import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Sparkles, ArrowUpRight } from 'lucide-react';

export default function Genres() {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const { data } = await axios.get('https://api.jikan.moe/v4/genres/anime');
        // Keep top 32 genres
        setGenres(data.data.slice(0, 32));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchGenres();
  }, []);

  // Helper to assign a dynamic soft gradient theme to each card
  const getGenreColor = (name) => {
    const n = name.toLowerCase();
    if (n.includes('action') || n.includes('sports') || n.includes('martial')) {
      return { from: 'from-orange-500/20', to: 'to-red-500/10', border: 'hover:border-orange-500/40', text: 'text-orange-400' };
    }
    if (n.includes('comedy') || n.includes('slice') || n.includes('parody')) {
      return { from: 'from-yellow-500/20', to: 'to-amber-500/10', border: 'hover:border-yellow-500/40', text: 'text-yellow-400' };
    }
    if (n.includes('fantasy') || n.includes('magic') || n.includes('supernatural')) {
      return { from: 'from-purple-500/20', to: 'to-indigo-500/10', border: 'hover:border-purple-500/40', text: 'text-purple-400' };
    }
    if (n.includes('sci-fi') || n.includes('mecha') || n.includes('space')) {
      return { from: 'from-cyan-500/20', to: 'to-blue-500/10', border: 'hover:border-cyan-500/40', text: 'text-cyan-400' };
    }
    if (n.includes('romance') || n.includes('shoujo') || n.includes('drama')) {
      return { from: 'from-pink-500/20', to: 'to-rose-500/10', border: 'hover:border-pink-500/40', text: 'text-pink-400' };
    }
    if (n.includes('adventure') || n.includes('mystery') || n.includes('suspense')) {
      return { from: 'from-emerald-500/20', to: 'to-teal-500/10', border: 'hover:border-emerald-500/40', text: 'text-emerald-400' };
    }
    // Default fallback
    return { from: 'from-white/10', to: 'to-white/5', border: 'hover:border-primary/40', text: 'text-primary' };
  };

  return (
    <div className="max-w-7xl mx-auto px-6 pt-8 pb-12 min-h-[80vh] flex flex-col">
      
      {/* Header */}
      <div className="text-center mb-10 mt-6">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/30"
        >
          <Sparkles className="w-6 h-6 text-primary" />
        </motion.div>
        <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-3">
          Genre <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Galaxy</span>
        </h1>
        <p className="text-muted text-xs sm:text-sm max-w-md mx-auto">
          Explore the vast universe of anime genres. Select any card to filter and discover new worlds.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center flex-1 py-20">
          <div className="animate-spin w-8 h-8 border-3 border-primary border-t-transparent rounded-full" />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 max-w-5xl w-full mx-auto">
          {genres.map((genre, i) => {
            const theme = getGenreColor(genre.name);
            return (
              <motion.button
                key={genre.mal_id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.02, ease: "easeOut" }}
                whileHover={{ scale: 1.03, y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(`/search?q=${genre.name}&genre=${genre.mal_id}`)}
                className={`relative group rounded-2xl glass border border-white/5 bg-gradient-to-br ${theme.from} ${theme.to} ${theme.border} transition-all duration-300 p-5 flex flex-col items-start justify-between min-h-[110px] text-left hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] overflow-hidden`}
              >
                {/* Background glow decoration */}
                <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-white/5 rounded-full blur-xl group-hover:bg-primary/10 transition-colors duration-300" />
                
                <div className="w-full flex items-center justify-between">
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-white/5 border border-white/5 text-muted group-hover:text-text transition-colors`}>
                    #{i + 1}
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-muted group-hover:text-text group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
                </div>

                <div className="mt-4">
                  <h3 className={`font-black uppercase tracking-tight text-sm md:text-base ${theme.text} group-hover:text-white transition-colors leading-tight`}>
                    {genre.name}
                  </h3>
                  <p className="text-[10px] text-muted/80 mt-1 font-semibold tracking-wider">
                    {genre.count.toLocaleString()} SHOWS
                  </p>
                </div>
              </motion.button>
            );
          })}
        </div>
      )}
    </div>
  );
}
