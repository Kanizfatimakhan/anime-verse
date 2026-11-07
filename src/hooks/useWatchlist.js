import { createContext, createElement, useContext, useEffect, useState } from 'react';

const WatchlistContext = createContext(null);
const VALID_STATUSES = new Set(['watching', 'plan_to_watch', 'completed']);

function normalizeEntry(item) {
  if (!item || typeof item !== 'object' || Array.isArray(item)) return null;
  const id = Number(item.mal_id);
  if (!Number.isSafeInteger(id) || id <= 0 || !(item.title || item.title_english)) return null;

  const episodes = Number(item.episodes) > 0 ? Math.floor(Number(item.episodes)) : null;
  const requestedProgress = Number(item.episodesWatched);
  const episodesWatched = Math.max(0, Math.min(
    Number.isFinite(requestedProgress) ? Math.floor(requestedProgress) : 0,
    episodes || Number.MAX_SAFE_INTEGER
  ));
  const status = episodes && episodesWatched >= episodes
    ? 'completed'
    : VALID_STATUSES.has(item.status) ? item.status : 'plan_to_watch';

  return {
    ...item,
    mal_id: id,
    status,
    episodesWatched,
    addedAt: item.addedAt || new Date().toISOString(),
    genres: Array.isArray(item.genres)
      ? item.genres.filter(genre => genre && typeof genre.name === 'string')
      : [],
  };
}

function normalizeList(list) {
  if (!Array.isArray(list)) return [];
  const unique = new Map();
  list.forEach(item => {
    const normalized = normalizeEntry(item);
    if (normalized && !unique.has(normalized.mal_id)) unique.set(normalized.mal_id, normalized);
  });
  return [...unique.values()];
}

function useWatchlistStore() {
  const [watchlist, setWatchlist] = useState(() => {
    if (typeof window === 'undefined') {
      return [];
    }

    try {
      const stored = window.localStorage.getItem('watchlist');
      if (!stored) return [];
      return normalizeList(JSON.parse(stored));
    } catch (error) {
      console.warn('Unable to read watchlist from localStorage:', error);
      return [];
    }
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      window.localStorage.setItem('watchlist', JSON.stringify(watchlist));
    } catch (e) {
      console.warn('Failed to save watchlist to localStorage', e);
    }
  }, [watchlist]);

  useEffect(() => {
    const handleStorage = event => {
      if (event.key !== 'watchlist') return;
      try {
        setWatchlist(normalizeList(event.newValue ? JSON.parse(event.newValue) : []));
      } catch (error) {
        console.warn('Unable to sync watchlist from another tab:', error);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const add = (anime, status = 'plan_to_watch', episodesWatched = 0) => {
    setWatchlist(prev => {
      const exists = prev.find(a => a.mal_id === anime.mal_id);
      if (exists) {
        return prev.map(a =>
          a.mal_id === anime.mal_id ? { ...a, status, episodesWatched: a.episodesWatched || episodesWatched } : a
        );
      }
      return [
        {
          ...anime,
          status,
          episodesWatched,
          addedAt: new Date().toISOString(),
        },
        ...prev,
      ];
    });
  };

  const remove = (id) => {
    setWatchlist(prev => prev.filter(a => a.mal_id !== id));
  };

  const updateStatus = (id, newStatus) => {
    setWatchlist(prev =>
      prev.map(a => (a.mal_id === id ? { ...a, status: newStatus } : a))
    );
  };

  const updateEpisodeProgress = (id, newCount) => {
    setWatchlist(prev =>
      prev.map(a => {
        if (a.mal_id !== id) return a;
        const total = a.episodes || 999;
        const validCount = Math.max(0, Math.min(newCount, total));
        const autoCompleted = a.episodes && validCount >= a.episodes;
        return {
          ...a,
          episodesWatched: validCount,
          status: autoCompleted ? 'completed' : validCount > 0 && a.status === 'plan_to_watch' ? 'watching' : a.status,
        };
      })
    );
  };

  const incrementEpisode = (id) => {
    const item = watchlist.find(a => a.mal_id === id);
    if (!item) return;
    updateEpisodeProgress(id, (item.episodesWatched || 0) + 1);
  };

  const isIn = (id) => watchlist.some(a => a.mal_id === id);

  const getItem = (id) => watchlist.find(a => a.mal_id === id);

  const getStatus = (id) => {
    const item = getItem(id);
    return item ? item.status : null;
  };

  const getProgress = (id) => {
    const item = getItem(id);
    return item ? item.episodesWatched || 0 : 0;
  };

  const clearAll = () => setWatchlist([]);

  const importList = (jsonList) => {
    if (!Array.isArray(jsonList)) return { imported: 0, skipped: 0 };
    const normalized = normalizeList(jsonList);
    setWatchlist(normalized);
    return { imported: normalized.length, skipped: jsonList.length - normalized.length };
  };

  return {
    watchlist,
    add,
    remove,
    updateStatus,
    updateEpisodeProgress,
    incrementEpisode,
    isIn,
    getItem,
    getStatus,
    getProgress,
    clearAll,
    importList,
  };
}

export function WatchlistProvider({ children }) {
  const value = useWatchlistStore();
  return createElement(WatchlistContext.Provider, { value }, children);
}

export const useWatchlist = () => {
  const context = useContext(WatchlistContext);
  if (!context) throw new Error('useWatchlist must be used within a WatchlistProvider');
  return context;
};
