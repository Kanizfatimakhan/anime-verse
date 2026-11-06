import { useState, useEffect } from 'react'

export const useWatchlist = () => {
  const [watchlist, setWatchlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem('watchlist')) || [] } 
    catch { return [] }
  })

  useEffect(() => {
    localStorage.setItem('watchlist', JSON.stringify(watchlist))
  }, [watchlist])

  const add = (anime) => setWatchlist(prev => 
    prev.find(a => a.mal_id === anime.mal_id) ? prev : [...prev, anime]
  )
  const remove = (id) => setWatchlist(prev => prev.filter(a => a.mal_id !== id))
  const isIn = (id) => watchlist.some(a => a.mal_id === id)

  return { watchlist, add, remove, isIn }
}
