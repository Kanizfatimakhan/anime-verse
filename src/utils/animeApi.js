// src/utils/animeApi.js
import axios from 'axios';
import { SEED_ANIME_LIST } from '../data/animeSeedData';

// Direct Jikan API v4
const BASE_API_URL = "https://api.jikan.moe/v4";

const ANIME_API = axios.create({
  baseURL: BASE_API_URL,
  timeout: 6000,
});

// Throttle requests and pause retries briefly when Jikan is unreachable.
let lastRequestTime = 0;
let requestQueue = Promise.resolve();
const MIN_REQUEST_INTERVAL = 300;
const NETWORK_COOLDOWN_MS = 60_000;
let apiUnavailableUntil = 0;

ANIME_API.interceptors.request.use(async (config) => {
  let release;
  const previousRequest = requestQueue;
  requestQueue = new Promise(resolve => {
    release = resolve;
  });

  await previousRequest;
  let released = false;
  const releaseQueue = () => {
    if (!released) {
      released = true;
      release();
    }
  };

  try {
    if (Date.now() < apiUnavailableUntil) {
      const error = new Error('Jikan API is temporarily unavailable');
      error.code = 'JIKAN_COOLDOWN';
      throw error;
    }

    const timeSinceLast = Date.now() - lastRequestTime;
    if (timeSinceLast < MIN_REQUEST_INTERVAL) {
      await new Promise(resolve => setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLast));
    }
    lastRequestTime = Date.now();
    config.releaseRequestQueue = releaseQueue;
    return config;
  } catch (error) {
    releaseQueue();
    throw error;
  }
});

ANIME_API.interceptors.response.use(
  response => {
    response.config.releaseRequestQueue?.();
    apiUnavailableUntil = 0;
    return response;
  },
  error => {
    error.config?.releaseRequestQueue?.();
    if (
      !error.response &&
      error.code !== 'JIKAN_COOLDOWN' &&
      (error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK' || error.message === 'Network Error')
    ) {
      apiUnavailableUntil = Date.now() + NETWORK_COOLDOWN_MS;
      console.warn('Jikan API is unreachable; using local anime data and pausing retries for 60 seconds.');
    }
    return Promise.reject(error);
  }
);

const pendingRequests = new Map();

/**
 * High-Speed Stale-While-Revalidate Caching Engine
 * Guarantees instantaneous 0ms response when seed data or cached data exists
 */
export const fetchWithCache = async (endpoint, cacheKey, expiryInMinutes = 60, seedFallback = null) => {
  const isBrowser = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  let cachedData = null;
  let cacheTimestamp = null;
  if (isBrowser) {
    try {
      cachedData = window.localStorage.getItem(cacheKey);
      cacheTimestamp = window.localStorage.getItem(`${cacheKey}_timestamp`);
    } catch (error) {
      console.warn('Unable to read anime cache from localStorage:', error);
    }
  }
  const now = Date.now();

  // If valid cache exists, return immediately
  if (cachedData && cacheTimestamp && (now - Number(cacheTimestamp) < expiryInMinutes * 60 * 1000)) {
    try {
      return JSON.parse(cachedData);
    } catch (error) {
      console.warn(`Ignoring invalid cached anime data for ${cacheKey}:`, error);
    }
  }

  let fallbackValue = null;
  if (cachedData) {
    try {
      fallbackValue = JSON.parse(cachedData);
    } catch (error) {
      console.warn(`Ignoring invalid cached anime data for ${cacheKey}:`, error);
    }
  } else if (seedFallback) {
    fallbackValue = { data: seedFallback };
  }

  const refresh = () => {
    if (Date.now() < apiUnavailableUntil) {
      return Promise.resolve(fallbackValue || { data: SEED_ANIME_LIST });
    }

    if (pendingRequests.has(cacheKey)) {
      return pendingRequests.get(cacheKey);
    }

    const request = ANIME_API.get(endpoint)
      .then(response => {
        const freshData = response.data;
        try {
          if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
            window.localStorage.setItem(cacheKey, JSON.stringify(freshData));
            window.localStorage.setItem(`${cacheKey}_timestamp`, Date.now().toString());
          }
        } catch (error) {
          console.warn('Unable to save anime cache to localStorage:', error);
        }
        return freshData;
      })
      .catch(error => {
        if (fallbackValue) {
          return fallbackValue;
        }
        if (error.code === 'JIKAN_COOLDOWN') {
          return { data: SEED_ANIME_LIST };
        }
        console.warn(`API call failed for ${endpoint}; using seed data:`, error.message);
        return { data: SEED_ANIME_LIST };
      })
      .finally(() => {
        pendingRequests.delete(cacheKey);
      });

    pendingRequests.set(cacheKey, request);
    return request;
  };

  if (fallbackValue) {
    void refresh();
    return fallbackValue;
  }

  return refresh();
};

// --- Custom API Methods ---

export const getAnimeById = async (id) => {
  const numId = Number(id);
  const matchedSeed = SEED_ANIME_LIST.find(a => a.mal_id === numId);

  // Return seed data instantly if available, then refresh
  if (matchedSeed) {
    // Fire background refresh without blocking
    fetchWithCache(`/anime/${id}/full`, `anime_detail_${id}`, 60).catch(() => {});
    return { data: matchedSeed };
  }

  return fetchWithCache(`/anime/${id}/full`, `anime_detail_${id}`, 60, null);
};

export const getAnimeCharacters = async (id) => {
  return fetchWithCache(`/anime/${id}/characters`, `anime_characters_${id}`, 60);
};

export const getAnimeRecommendations = async (id) => {
  return fetchWithCache(`/anime/${id}/recommendations`, `anime_recs_${id}`, 60);
};

export const getAnimeMusicVideos = async (id) => {
  return fetchWithCache(`/anime/${id}/videos/music`, `anime_music_${id}`, 60);
};

export const searchAnime = async (query, options = {}) => {
  const qLower = (query || '').toLowerCase().trim();

  if (Date.now() >= apiUnavailableUntil) {
    try {
      const params = {
        q: query || undefined,
        limit: options.limit || 24,
        page: options.page || 1,
        type: options.type || undefined,
        status: options.status || undefined,
        order_by: options.order_by || 'popularity',
        sort: options.sort || 'asc',
        sfw: true,
      };

      if (options.genres) params.genres = options.genres;
      if (options.min_score) params.min_score = options.min_score;

      const response = await ANIME_API.get(`/anime`, { params });
      if (response?.data?.data && response.data.data.length > 0) {
        return response.data;
      }
    } catch (error) {
      if (error.code !== 'JIKAN_COOLDOWN') {
        console.info('Live anime search unavailable; showing local results.');
      }
    }
  }

  const filtered = SEED_ANIME_LIST.filter(anime => {
    const matchesQuery = !qLower || [
      anime.title,
      anime.title_english,
      anime.title_japanese,
      ...(anime.genres || []).map(genre => genre.name),
    ].some(value => value?.toLowerCase().includes(qLower));
    const matchesGenre = !options.genres ||
      anime.genres?.some(genre => String(genre.mal_id) === String(options.genres));
    const matchesType = !options.type || anime.type?.toLowerCase() === options.type.toLowerCase();
    const status = anime.status?.toLowerCase() || '';
    const matchesStatus = !options.status ||
      (options.status === 'complete' ? status.includes('finished') :
        options.status === 'airing' ? status.includes('airing') :
          status.includes('not yet'));
    const matchesScore = !options.min_score || Number(anime.score) >= Number(options.min_score);

    return matchesQuery && matchesGenre && matchesType && matchesStatus && matchesScore;
  });

  const sorted = [...filtered];
  if (options.order_by === 'score') {
    sorted.sort((a, b) => (Number(b.score) || 0) - (Number(a.score) || 0));
  } else if (options.order_by === 'title') {
    sorted.sort((a, b) => (a.title_english || a.title || '').localeCompare(b.title_english || b.title || ''));
  } else if (options.order_by === 'start_date') {
    sorted.sort((a, b) => (Number(b.year) || 0) - (Number(a.year) || 0));
  } else {
    sorted.sort((a, b) => (Number(a.popularity) || Infinity) - (Number(b.popularity) || Infinity));
  }
  if (options.sort === 'desc' && options.order_by !== 'score' && options.order_by !== 'start_date') {
    sorted.reverse();
  }

  const limit = Number(options.limit) || 24;
  const page = Number(options.page) || 1;
  const offset = (page - 1) * limit;
  return {
    data: sorted.slice(offset, offset + limit),
    pagination: { has_next_page: offset + limit < sorted.length },
  };
};

export const getTrending = async () => {
  return fetchWithCache('/seasons/now?limit=15', 'trending_anime', 60, SEED_ANIME_LIST.slice(0, 8));
};

export const getTopAnime = async () => {
  return fetchWithCache('/top/anime?limit=25', 'top_anime', 60, SEED_ANIME_LIST);
};

export const getSeasonNow = async () => {
  return fetchWithCache('/seasons/now?limit=20', 'season_anime', 60, SEED_ANIME_LIST.slice(3, 11));
};

export const getRandomAnime = async () => {
  try {
    const response = await ANIME_API.get('/random/anime');
    return response.data;
  } catch {
    // Pick random from seed
    const randomIndex = Math.floor(Math.random() * SEED_ANIME_LIST.length);
    return { data: SEED_ANIME_LIST[randomIndex] };
  }
};

export const getAnimeSchedule = async () => {
  return fetchWithCache('/schedules?limit=25', 'anime_schedules', 60, SEED_ANIME_LIST);
};

export default ANIME_API;
