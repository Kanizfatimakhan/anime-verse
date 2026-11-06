import { useWatchlist } from '../hooks/useWatchlist';
import AnimeCard from '../components/AnimeCard';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bookmark, Play } from 'lucide-react';

export default function Watchlist() {
  const { watchlist } = useWatchlist();

  return (
    <div className="max-w-7xl mx-auto px-6 pt-10 pb-12 min-h-[80vh]">
      <div className="flex items-center gap-4 mb-4">
        <Bookmark className="w-8 h-8 text-primary" />
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-text">
          My <span className="text-primary">Watchlist</span>
        </h1>
      </div>
      <p className="text-muted text-sm md:text-base mb-12 uppercase tracking-widest font-bold">
        {watchlist.length} {watchlist.length === 1 ? 'Anime' : 'Animes'} Saved
      </p>

      {watchlist.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center text-center py-20 glass rounded-3xl border border-white/5 shadow-2xl"
        >
          <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10">
            <span className="text-5xl">🎌</span>
          </div>
          <p className="text-2xl font-bold text-text mb-2">Your watchlist is empty</p>
          <p className="text-muted mb-8 max-w-sm">Discover and save the anime you want to watch later so you never lose track.</p>
          
          <Link 
            to="/search" 
            className="px-8 py-4 bg-primary text-white rounded-full font-bold uppercase tracking-wider flex items-center gap-2 hover:scale-105 hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] transition-all duration-300"
          >
            <Play className="w-5 h-5 fill-current" />
            Browse Anime
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {watchlist.map((anime, i) => (
            <AnimeCard key={anime.mal_id} anime={anime} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
