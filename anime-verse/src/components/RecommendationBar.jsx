import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function RecommendationBar() {
  const [isVisible, setIsVisible] = useState(true);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    // Fetch a few random top anime for recommendations
    const fetchRecommendations = async () => {
      try {
        const { data } = await axios.get('https://api.jikan.moe/v4/top/anime?limit=5');
        setRecommendations(data.data);
      } catch (err) {
        console.error("Failed to load recommendations", err);
      }
    };
    fetchRecommendations();
  }, []);

  if (!isVisible || recommendations.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ delay: 2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="fixed bottom-0 left-0 right-0 z-40 bg-secondary/80 backdrop-blur-xl border-t border-border overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1 overflow-hidden">
            <div className="hidden md:flex items-center gap-2 text-primary whitespace-nowrap font-bold text-xs uppercase tracking-wider pr-4 border-r border-white/10">
              <Sparkles className="w-4 h-4" />
              Recommended
            </div>
            
            <div className="flex-1 overflow-x-auto no-scrollbar">
              <div className="flex items-center gap-4 w-max px-2">
                {recommendations.map(anime => (
                  <Link
                    key={anime.mal_id}
                    to={`/anime/${anime.mal_id}`}
                    className="flex items-center gap-3 group px-2 py-1 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <img 
                      src={anime.images.webp.image_url} 
                      alt={anime.title} 
                      className="w-8 h-8 rounded object-cover"
                    />
                    <span className="text-sm font-medium text-text group-hover:text-primary transition-colors max-w-[120px] truncate">
                      {anime.title}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <button 
            onClick={() => setIsVisible(false)}
            className="ml-4 p-1.5 text-muted hover:text-text hover:bg-white/10 rounded-full transition-colors flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
