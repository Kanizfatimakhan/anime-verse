import axios from 'axios';
import { SEED_ANIME_LIST } from '../data/animeSeedData';

const ANILIST_API_URL = 'https://graphql.anilist.co';
const REQUEST_TIMEOUT_MS = 10_000;
const MIN_REQUEST_INTERVAL_MS = 700;
const NETWORK_COOLDOWN_MS = 60_000;
const CACHE_VERSION = 'anilist_v2';

const GENRE_IDS = {
  Action: 1,
  Adventure: 2,
  Comedy: 4,
  Drama: 8,
  Ecchi: 9,
  Fantasy: 10,
  Horror: 14,
  'Mahou Shoujo': 66,
  Mecha: 18,
  Music: 19,
  Mystery: 7,
  Psychological: 40,
  Romance: 22,
  'Sci-Fi': 24,
  'Slice of Life': 36,
  Sports: 30,
  Supernatural: 37,
  Thriller: 41,
};

const GENRE_NAMES_BY_ID = Object.fromEntries(
  Object.entries(GENRE_IDS).map(([name, id]) => [String(id), name])
);

const ORIGIN_COUNTRY_NAMES = {
  JP: 'Japan',
  CN: 'China',
  KR: 'South Korea',
  TW: 'Taiwan',
};

const MEDIA_FIELDS = `
  id
  idMal
  countryOfOrigin
  title { romaji english native }
  coverImage { large extraLarge }
  bannerImage
  description(asHtml: false)
  episodes
  status
  format
  season
  seasonYear
  averageScore
  popularity
  genres
  studios(isMain: true) { nodes { id name } }
  startDate { year month day }
  endDate { year month day }
  duration
  source
  isAdult
  trailer { id site thumbnail }
  rankings { rank type }
  airingSchedule { nodes { airingAt episode } }
`;

const MEDIA_FRAGMENT = `fragment AnimeFields on Media { ${MEDIA_FIELDS} }`;

const LIST_QUERY = `
  ${MEDIA_FRAGMENT}
  query AnimeList(
    $page: Int
    $perPage: Int
    $search: String
    $sort: [MediaSort]
    $genreIn: [String]
    $formatIn: [MediaFormat]
    $statusIn: [MediaStatus]
    $countryOfOrigin: CountryCode
    $season: MediaSeason
    $seasonYear: Int
    $startDateGreater: FuzzyDateInt
    $startDateLesser: FuzzyDateInt
  ) {
    Page(page: $page, perPage: $perPage) {
      pageInfo { hasNextPage }
      media(
        type: ANIME
        isAdult: false
        search: $search
        sort: $sort
        genre_in: $genreIn
        format_in: $formatIn
        status_in: $statusIn
        countryOfOrigin: $countryOfOrigin
        season: $season
        seasonYear: $seasonYear
        startDate_greater: $startDateGreater
        startDate_lesser: $startDateLesser
      ) {
        ...AnimeFields
      }
    }
  }
`;

const DETAIL_QUERY = `
  ${MEDIA_FRAGMENT}
  query AnimeDetail($id: Int, $idMal: Int) {
    Media(id: $id, idMal: $idMal, type: ANIME) {
      ...AnimeFields
    }
  }
`;

const CHARACTERS_QUERY = `
  query AnimeCharacters($id: Int, $idMal: Int) {
    Media(id: $id, idMal: $idMal, type: ANIME) {
      characters(sort: ROLE, perPage: 10) {
        edges {
          role
          node { id name { full } image { large } }
        }
      }
    }
  }
`;

const RECOMMENDATIONS_QUERY = `
  ${MEDIA_FRAGMENT}
  query AnimeRecommendations($id: Int, $idMal: Int) {
    Media(id: $id, idMal: $idMal, type: ANIME) {
      recommendations(sort: RATING, perPage: 6) {
        nodes {
          mediaRecommendation { ...AnimeFields }
        }
      }
    }
  }
`;

const SCHEDULE_QUERY = `
  ${MEDIA_FRAGMENT}
  query AnimeSchedule($from: Int, $to: Int) {
    Page(page: 1, perPage: 50) {
      airingSchedules(
        airingAt_greater: $from
        airingAt_lesser: $to
        notYetAired: true
        sort: TIME
      ) {
        airingAt
        episode
        media { ...AnimeFields }
      }
    }
  }
`;

let lastRequestTime = 0;
let requestQueue = Promise.resolve();
let apiUnavailableUntil = 0;
const pendingRequests = new Map();

function isBrowserStorageAvailable() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function writeCache(key, value) {
  if (!isBrowserStorageAvailable()) return;

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    window.localStorage.setItem(`${key}_timestamp`, Date.now().toString());
  } catch (error) {
    console.warn(`Unable to save anime cache for ${key}:`, error);
  }
}

function getCachedValue(key, expiryInMinutes) {
  if (!isBrowserStorageAvailable()) return { value: null, isFresh: false };

  try {
    const value = window.localStorage.getItem(key);
    const timestamp = Number(window.localStorage.getItem(`${key}_timestamp`));
    if (!value) return { value: null, isFresh: false };

    const parsed = JSON.parse(value);
    return {
      value: parsed,
      isFresh: Number.isFinite(timestamp) &&
        Date.now() - timestamp < expiryInMinutes * 60 * 1000,
    };
  } catch (error) {
    console.warn(`Unable to read anime cache for ${key}:`, error);
    return { value: null, isFresh: false };
  }
}

function requestAniList(query, variables) {
  const request = requestQueue.then(async () => {
    if (Date.now() < apiUnavailableUntil) {
      throw new Error('AniList is temporarily unavailable; retry cooldown is active.');
    }

    const delay = MIN_REQUEST_INTERVAL_MS - (Date.now() - lastRequestTime);
    if (delay > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }
    lastRequestTime = Date.now();

    const response = await axios.post(
      ANILIST_API_URL,
      { query, variables },
      { timeout: REQUEST_TIMEOUT_MS }
    );

    if (response.data?.errors?.length) {
      throw new Error(response.data.errors.map(item => item.message).join('; '));
    }

    return response.data?.data;
  });

  requestQueue = request.then(() => undefined, () => undefined);
  return request.catch(error => {
    const status = error.response?.status;
    if (!status || status === 429 || status >= 500) {
      apiUnavailableUntil = Date.now() + NETWORK_COOLDOWN_MS;
      console.warn('AniList is unavailable; showing cached or local anime data:', error.message);
    } else {
      console.warn('AniList request failed:', error.message);
    }
    throw error;
  });
}

function fetchCached(
  key,
  query,
  variables,
  transform,
  fallback,
  expiryInMinutes = 60,
  returnFallbackImmediately = true
) {
  const cached = getCachedValue(key, expiryInMinutes);
  if (cached.isFresh) return Promise.resolve(cached.value);

  const fallbackValue = cached.value ?? fallback;
  if (pendingRequests.has(key)) return pendingRequests.get(key);

  const request = requestAniList(query, variables)
    .then(transform)
    .then(value => {
      writeCache(key, value);
      apiUnavailableUntil = 0;
      return value;
    })
    .catch(() => fallbackValue)
    .finally(() => pendingRequests.delete(key));

  pendingRequests.set(key, request);
  if (fallbackValue !== undefined && (returnFallbackImmediately || cached.value !== null)) {
    void request;
    return Promise.resolve(fallbackValue);
  }
  return request;
}

function mapStatus(status) {
  return {
    FINISHED: 'Finished Airing',
    RELEASING: 'Currently Airing',
    NOT_YET_RELEASED: 'Not yet aired',
    CANCELLED: 'Discontinued',
    HIATUS: 'On Hiatus',
  }[status] || status || null;
}

function mapFormat(format) {
  return {
    TV: 'TV',
    TV_SHORT: 'TV Short',
    MOVIE: 'Movie',
    SPECIAL: 'Special',
    OVA: 'OVA',
    ONA: 'ONA',
    MUSIC: 'Music',
  }[format] || format || null;
}

function mapAnime(media) {
  if (!media) return null;

  const title = media.title?.romaji || media.title?.english || media.title?.native || 'Untitled anime';
  const image = media.coverImage?.extraLarge || media.coverImage?.large || null;
  const start = media.startDate;
  const end = media.endDate;
  const dateString = date => (
    date?.year
      ? [date.year, date.month, date.day].filter(value => value != null)
        .map((value, index) => index ? String(value).padStart(2, '0') : String(value))
        .join('-')
      : null
  );
  const trailerId = media.trailer?.site === 'youtube'
    ? String(media.trailer.id || '').trim()
    : '';
  const youtubeId = /^[\w-]{11}$/.test(trailerId) ? trailerId : null;

  return {
    mal_id: media.idMal ?? media.id,
    anilist_id: media.id,
    id_source: media.idMal == null ? 'anilist' : 'mal',
    country_of_origin: media.countryOfOrigin || null,
    country_name: ORIGIN_COUNTRY_NAMES[media.countryOfOrigin] || media.countryOfOrigin || null,
    title,
    title_english: media.title?.english || null,
    title_japanese: media.title?.native || null,
    score: media.averageScore == null ? null : Number((media.averageScore / 10).toFixed(2)),
    rank: media.rankings?.find(item => item.type === 'RATED')?.rank || null,
    popularity: media.popularity || null,
    episodes: media.episodes || null,
    status: mapStatus(media.status),
    year: media.seasonYear || start?.year || null,
    season: media.season || null,
    type: mapFormat(media.format),
    duration: media.duration ? `${media.duration} min per ep` : null,
    rating: media.isAdult ? 'R - 17+ (violence & profanity)' : null,
    source: media.source || null,
    synopsis: media.description || null,
    genres: (media.genres || []).map(name => ({
      mal_id: GENRE_IDS[name] ?? name,
      name,
    })),
    studios: (media.studios?.nodes || []).map(studio => ({
      mal_id: studio.id,
      name: studio.name,
    })),
    images: {
      webp: { image_url: image, large_image_url: image },
      jpg: { image_url: image, large_image_url: image },
    },
    banner_image: media.bannerImage || image,
    trailer: youtubeId ? {
      youtube_id: youtubeId,
      embed_url: `https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0&playsinline=1`,
      url: `https://www.youtube.com/watch?v=${youtubeId}`,
    } : null,
    aired: {
      from: dateString(start),
      to: dateString(end),
      string: start?.year ? `${dateString(start) || 'Unknown'}${end?.year ? ` to ${dateString(end)}` : ''}` : null,
    },
    broadcast: null,
  };
}

function mapMediaList(mediaList = []) {
  return mediaList.map(mapAnime).filter(Boolean);
}

function makeRouteId(anime) {
  return anime?.id_source === 'anilist' && anime.anilist_id
    ? `anilist-${anime.anilist_id}`
    : anime?.mal_id;
}

export const getAnimeRouteId = makeRouteId;
export const getAnimeOriginName = countryCode =>
  ORIGIN_COUNTRY_NAMES[countryCode] || countryCode || null;

function normalizeTrailer(trailer) {
  const trailerId = String(trailer?.youtube_id || '').trim();
  if (!/^[\w-]{11}$/.test(trailerId)) return null;

  return {
    ...trailer,
    youtube_id: trailerId,
    embed_url: `https://www.youtube-nocookie.com/embed/${trailerId}?rel=0&playsinline=1`,
    url: `https://www.youtube.com/watch?v=${trailerId}`,
  };
}

function parseAnimeId(routeId) {
  const value = String(routeId ?? '');
  if (value.startsWith('anilist-')) {
    const id = Number(value.slice('anilist-'.length));
    return Number.isInteger(id) && id > 0 ? { id } : null;
  }

  const idMal = Number(value);
  return Number.isInteger(idMal) && idMal > 0 ? { idMal } : null;
}

function createFallbackList(data = SEED_ANIME_LIST, pagination = { has_next_page: false }) {
  return { data, pagination };
}

function listCacheKey(prefix, variables) {
  return `${CACHE_VERSION}_${prefix}_${JSON.stringify(variables)}`;
}

async function fetchMediaList(
  prefix,
  variables,
  expiryInMinutes = 60,
  fallback = createFallbackList(),
  returnFallbackImmediately = false
) {
  const normalizedVariables = {
    page: variables.page || 1,
    perPage: variables.perPage || 24,
    ...variables,
  };
  return fetchCached(
    listCacheKey(prefix, normalizedVariables),
    LIST_QUERY,
    normalizedVariables,
    data => ({
      data: mapMediaList(data?.Page?.media),
      pagination: { has_next_page: Boolean(data?.Page?.pageInfo?.hasNextPage) },
    }),
    fallback,
    expiryInMinutes,
    returnFallbackImmediately
  );
}

function getSeedSearchResults(query, options) {
  const search = (query || '').trim().toLowerCase();
  const genreName = options.genres == null
    ? null
    : GENRE_NAMES_BY_ID[String(options.genres)] || String(options.genres);
  const filtered = SEED_ANIME_LIST.filter(anime => {
    const matchesText = !search || [
      anime.title,
      anime.title_english,
      anime.title_japanese,
      ...(anime.genres || []).map(genre => genre.name),
    ].some(value => value?.toLowerCase().includes(search));
    const matchesGenre = !genreName ||
      anime.genres?.some(genre => genre.name.toLowerCase() === genreName.toLowerCase());
    const matchesCountry = !options.countryOfOrigin ||
      anime.country_of_origin === options.countryOfOrigin;
    const matchesType = !options.type || anime.type?.toLowerCase() === options.type.toLowerCase();
    const status = anime.status?.toLowerCase() || '';
    const matchesStatus = !options.status ||
      (options.status === 'complete' ? status.includes('finished') :
        options.status === 'airing' ? status.includes('airing') :
          status.includes('not yet'));
    const matchesScore = !options.min_score || Number(anime.score) >= Number(options.min_score);
    return matchesText && matchesGenre && matchesCountry && matchesType && matchesStatus && matchesScore;
  });
  const limit = Number(options.limit) || 24;
  const page = Number(options.page) || 1;
  const offset = (page - 1) * limit;
  return createFallbackList(filtered.slice(offset, offset + limit), {
    has_next_page: offset + limit < filtered.length,
  });
}

function currentSeason() {
  const month = new Date().getMonth();
  if (month < 3) return 'WINTER';
  if (month < 6) return 'SPRING';
  if (month < 9) return 'SUMMER';
  return 'FALL';
}

function getFormatFilter(format) {
  return {
    tv: 'TV',
    movie: 'MOVIE',
    ova: 'OVA',
    special: 'SPECIAL',
  }[String(format || '').toLowerCase()];
}

function getStatusFilter(status) {
  return {
    airing: 'RELEASING',
    complete: 'FINISHED',
    upcoming: 'NOT_YET_RELEASED',
  }[String(status || '').toLowerCase()];
}

function getSortFilter(orderBy, direction) {
  const desc = direction === 'desc';
  if (orderBy === 'score') return [desc ? 'SCORE_DESC' : 'SCORE'];
  if (orderBy === 'title') return [desc ? 'TITLE_ROMAJI_DESC' : 'TITLE_ROMAJI'];
  if (orderBy === 'start_date') return [desc ? 'START_DATE_DESC' : 'START_DATE'];
  return [desc ? 'POPULARITY_DESC' : 'POPULARITY'];
}

export const searchAnime = async (query, options = {}) => {
  const genreName = options.genres == null
    ? undefined
    : GENRE_NAMES_BY_ID[String(options.genres)] || String(options.genres);
  const variables = {
    page: Number(options.page) || 1,
    perPage: Math.min(Number(options.limit) || 24, 50),
    search: query?.trim() || undefined,
    sort: getSortFilter(options.order_by || 'popularity', options.sort || 'desc'),
    genreIn: genreName ? [genreName] : undefined,
    countryOfOrigin: options.countryOfOrigin || undefined,
    startDateGreater: options.startDateGreater || undefined,
    startDateLesser: options.startDateLesser || undefined,
    formatIn: getFormatFilter(options.type) ? [getFormatFilter(options.type)] : undefined,
    statusIn: getStatusFilter(options.status) ? [getStatusFilter(options.status)] : undefined,
  };
  const fallback = getSeedSearchResults(query, options);
  return fetchCached(
    listCacheKey('search', variables),
    LIST_QUERY,
    variables,
    data => ({
      data: mapMediaList(data?.Page?.media),
      pagination: { has_next_page: Boolean(data?.Page?.pageInfo?.hasNextPage) },
    }),
    fallback,
    15,
    false
  );
};

export const getAnimeById = async routeId => {
  const identifier = parseAnimeId(routeId);
  if (!identifier) return { data: null };
  const matchedSeed = identifier.idMal
    ? SEED_ANIME_LIST.find(anime => anime.mal_id === identifier.idMal)
    : null;
  const variables = { id: identifier.id, idMal: identifier.idMal };
  const cacheKey = `${CACHE_VERSION}_detail_${identifier.id || `mal_${identifier.idMal}`}`;
  const fallback = {
    data: matchedSeed
      ? { ...matchedSeed, trailer: normalizeTrailer(matchedSeed.trailer) }
      : null,
  };

  if (matchedSeed) {
    void fetchCached(
      cacheKey,
      DETAIL_QUERY,
      variables,
      data => ({ data: mapAnime(data?.Media) }),
      fallback,
      60,
      false
    );
    return fallback;
  }

  return fetchCached(
    cacheKey,
    DETAIL_QUERY,
    variables,
    data => ({ data: mapAnime(data?.Media) }),
    fallback,
    60,
    false
  );
};

export const getAnimeCharacters = async routeId => {
  const identifier = parseAnimeId(routeId);
  if (!identifier) return { data: [] };
  return fetchCached(
    `${CACHE_VERSION}_characters_${identifier.id || `mal_${identifier.idMal}`}`,
    CHARACTERS_QUERY,
    { id: identifier.id, idMal: identifier.idMal },
    data => ({
      data: (data?.Media?.characters?.edges || []).map(edge => ({
        role: edge.role,
        character: {
          mal_id: edge.node.id,
          name: edge.node.name?.full,
          images: { jpg: { image_url: edge.node.image?.large } },
        },
      })),
    }),
    { data: [] },
    60,
    false
  );
};

export const getAnimeRecommendations = async routeId => {
  const identifier = parseAnimeId(routeId);
  if (!identifier) return { data: [] };
  return fetchCached(
    `${CACHE_VERSION}_recommendations_${identifier.id || `mal_${identifier.idMal}`}`,
    RECOMMENDATIONS_QUERY,
    { id: identifier.id, idMal: identifier.idMal },
    data => ({
      data: (data?.Media?.recommendations?.nodes || [])
        .map(item => ({ entry: mapAnime(item.mediaRecommendation) }))
        .filter(item => item.entry),
    }),
    { data: [] },
    60,
    false
  );
};

export const getAnimeMusicVideos = async () => ({ data: [] });

export const getAnimeGenres = async () => {
  const cacheKey = `${CACHE_VERSION}_genres`;
  const fallbackGenres = [
    'Action', 'Adventure', 'Comedy', 'Drama', 'Ecchi', 'Fantasy', 'Horror',
    'Mahou Shoujo', 'Mecha', 'Music', 'Mystery', 'Psychological', 'Romance',
    'Sci-Fi', 'Slice of Life', 'Sports', 'Supernatural', 'Thriller',
  ];
  return fetchCached(
    cacheKey,
    'query AnimeGenres { GenreCollection }',
    {},
    data => ({
      data: (data?.GenreCollection || fallbackGenres).map(name => ({
        mal_id: GENRE_IDS[name] ?? name,
        name,
        count: 0,
      })),
    }),
    {
      data: fallbackGenres.map(name => ({
        mal_id: GENRE_IDS[name] ?? name,
        name,
        count: 0,
      })),
    },
    120,
    false
  );
};

export const getTrending = async () => fetchMediaList('trending', {
  page: 1,
  perPage: 15,
  sort: ['TRENDING_DESC'],
}, 60, createFallbackList(SEED_ANIME_LIST.slice(0, 8)));

export const getTopAnime = async () => fetchMediaList('top', {
  page: 1,
  perPage: 25,
  sort: ['SCORE_DESC'],
}, 60, createFallbackList(SEED_ANIME_LIST));

export const getSeasonNow = async () => fetchMediaList('season', {
  page: 1,
  perPage: 20,
  sort: ['POPULARITY_DESC'],
  season: currentSeason(),
  seasonYear: new Date().getFullYear(),
}, 60, createFallbackList(SEED_ANIME_LIST.slice(3, 11)));

export const getRandomAnime = async () => {
  const result = await fetchMediaList('random', {
    page: 1,
    perPage: 50,
    sort: ['POPULARITY_DESC'],
  }, 60, createFallbackList(), false);
  const items = result.data || SEED_ANIME_LIST;
  return { data: items[Math.floor(Math.random() * items.length)] || SEED_ANIME_LIST[0] };
};

export const getAnimeSchedule = async () => {
  const from = Math.floor(Date.now() / 1000);
  const to = from + 7 * 24 * 60 * 60;
  return fetchCached(
    `${CACHE_VERSION}_schedule_${new Date().toISOString().slice(0, 10)}`,
    SCHEDULE_QUERY,
    { from, to },
    data => {
      const byId = new Map();
      (data?.Page?.airingSchedules || []).forEach(item => {
        const anime = mapAnime(item.media);
        if (!anime || byId.has(anime.mal_id)) return;
        const day = new Date(item.airingAt * 1000).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
        anime.broadcast = { day, time: null, timezone: null };
        byId.set(anime.mal_id, anime);
      });
      return { data: [...byId.values()] };
    },
    { data: SEED_ANIME_LIST },
    30,
    false
  );
};

export default { post: requestAniList };
