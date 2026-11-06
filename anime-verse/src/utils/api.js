import axios from 'axios'

const BASE = 'https://api.jikan.moe/v4'

const get = async (url, params = {}) => {
  const res = await axios.get(`${BASE}${url}`, { params, timeout: 12000 })
  return res.data
}

export const getTrending = () => get('/top/anime', { filter: 'airing', limit: 12 })
export const getTopAnime = () => get('/top/anime', { limit: 12 })
export const searchAnime = (q, page = 1) => get('/anime', { q, page, limit: 16, sfw: true })
export const getAnimeById = (id) => get(`/anime/${id}/full`)
export const getAnimeCharacters = (id) => get(`/anime/${id}/characters`)
export const getGenres = () => get('/genres/anime')
export const getAnimeByGenre = (genre_id, page = 1) => get('/anime', { genres: genre_id, page, limit: 16, order_by: 'score', sort: 'desc', sfw: true })
export const getSeasonNow = () => get('/seasons/now', { limit: 12 })