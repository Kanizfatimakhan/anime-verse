import { useState, useEffect } from 'react';

export const useWatchlist = () => {
  const [watchlist, setWatchlist] = useState(() => {
    if (typeof window === 'undefined') {
      return [];
    }

    try {
      const stored = window.localStorage.getItem('watchlist');
      if (!stored) return [];
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed.map(item => ({
        ...item,
        status: item.status || 'plan_to_watch',
        episodesWatched: item.episodesWatched || 0,
        addedAt: item.addedAt || new Date().toISOString(),
      })) : [];
    } catch {
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
    if (Array.isArray(jsonList)) {
      setWatchlist(jsonList);
      return true;
    }
    return false;
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
};
