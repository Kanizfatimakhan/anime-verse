// src/utils/api.js
import axios from 'axios';

// Free Anime API Base Configuration
const ANIME_API = axios.create({
  baseURL: 'https://jikan.moe',
  timeout: 10000, // 10 seconds timeout
});

/**
 * Senior-Grade Caching Interceptor (Bina backend ke slowness fix karne ke liye)
 * @param {string} endpoint - API endpoint (e.g., '/top/anime')
 * @param {string} cacheKey - LocalStorage key name
 * @param {number} expiryInMinutes - Data kab tak fresh rahega (default 30 mins)
 */
export const fetchWithCache = async (endpoint, cacheKey, expiryInMinutes = 30) => {
  const cachedData = localStorage.getItem(cacheKey);
  const cacheTimestamp = localStorage.getItem(`${cacheKey}_timestamp`);
  const now = new Date().getTime();

  // Agar cache valid hai toh wahi se data uthao, network request bachao
  if (cachedData && cacheTimestamp && (now - cacheTimestamp < expiryInMinutes * 60 * 1000)) {
    console.log(`%c[AnimeVerse Cache Hit] Loading ${cacheKey} from LocalStorage`, "color: #00ff00; font-weight: bold;");
    return JSON.parse(cachedData);
  }

  // Agar cache purana hai ya nahi hai, toh fresh network call karo
  try {
    console.log(`%c[AnimeVerse Network Fetch] Getting fresh data for ${cacheKey}`, "color: #00ffff; font-weight: bold;");
    const response = await ANIME_API.get(endpoint);
    
    // Save to localStorage for next time
    localStorage.setItem(cacheKey, JSON.stringify(response.data));
    localStorage.setItem(`${cacheKey}_timestamp`, now.toString());
    
    return response.data;
  } catch (error) {
    console.error(`%c[API Error] Fetch failed for ${endpoint}: ${error.message}`, "color: #ff0000");
    // Fallback: Agar net down hai toh purana cached data dikha do bhale hi expire ho gaya ho
    return cachedData ? JSON.parse(cachedData) : null;
  }
};

export default ANIME_API;
