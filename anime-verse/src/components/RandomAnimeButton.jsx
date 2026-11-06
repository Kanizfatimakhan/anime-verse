import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dices, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function RandomAnimeButton() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchRandomAnime = async () => {
    if (loading) return;
    setLoading(true);
    try {
      // Jikan API random endpoint
      const response = await axios.get('https://api.jikan.moe/v4/random/anime');
      const animeId = response.data.data.mal_id;
      
      // Navigate to the detail page
      navigate(`/anime/${animeId}`);
    } catch (error) {
      console.error("Failed to fetch random anime", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <motion.button
        whileHover={{ scale: 1.1, rotate: 10 }}
        whileTap={{ scale: 0.9 }}
        onClick={fetchRandomAnime}
        disabled={loading}
        className="w-14 h-14 rounded-full bg-primary/80 backdrop-blur-md shadow-[0_0_30px_rgba(124,58,237,0.5)] border border-white/20 flex items-center justify-center text-white relative overflow-hidden group"
      >
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
            >
              <Loader2 className="w-6 h-6 animate-spin" />
            </motion.div>
          ) : (
            <motion.div
              key="dice"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
            >
              <Dices className="w-6 h-6 group-hover:animate-bounce" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hover Tooltip */}
        <div className="absolute left-16 top-1/2 -translate-y-1/2 px-3 py-1 bg-background/90 backdrop-blur-md border border-white/10 rounded-lg text-xs font-bold uppercase tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Random Anime
        </div>
      </motion.button>
    </div>
  );
}
