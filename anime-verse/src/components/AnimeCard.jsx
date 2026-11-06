import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Play, Star, Plus } from 'lucide-react';
import { useWatchlist } from '../hooks/useWatchlist';
import Tilt from 'react-parallax-tilt';
import { useDynamicTheme } from '../context/ThemeContext';

export default function AnimeCard({ anime, index = 0 }) {
  const { add, remove, isIn } = useWatchlist();
  const { extractColor, resetColor } = useDynamicTheme();
  
  if (!anime) return null;

  const inWatchlist = isIn(anime.mal_id);
  const imageUrl = anime.images?.webp?.large_image_url || anime.images?.jpg?.large_image_url;

  const handleHoverStart = () => {
    extractColor(imageUrl);
  };

  const handleHoverEnd = () => {
    resetColor();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="relative group h-full"
      onMouseEnter={handleHoverStart}
      onMouseLeave={handleHoverEnd}
    >
      <Tilt
        tiltMaxAngleX={10}
        tiltMaxAngleY={10}
        perspective={1000}
        scale={1.05}
        transitionSpeed={2000}
        gyroscope={true}
        className="h-full"
      >
        <div className="relative h-full aspect-[2/3] rounded-2xl overflow-hidden glass border border-white/5 group-hover:border-primary/50 transition-colors shadow-2xl">
          
          <img 
            src={imageUrl} 
            alt={anime.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-10">
            {anime.score && (
              <div className="bg-background/80 backdrop-blur-md text-primary px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1 border border-white/10">
                <Star className="w-3 h-3 fill-current" />
                {anime.score}
              </div>
            )}
            
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                inWatchlist ? remove(anime.mal_id) : add(anime);
              }}
              className={`p-1.5 rounded-full backdrop-blur-md border transition-all ${
                inWatchlist 
                  ? 'bg-primary text-white border-primary' 
                  : 'bg-background/50 text-white border-white/10 hover:bg-white/20'
              }`}
            >
              <Plus className={`w-4 h-4 transition-transform ${inWatchlist ? 'rotate-45' : ''}`} />
            </button>
          </div>

          {/* Bottom Info */}
          <div className="absolute bottom-0 left-0 right-0 p-4 z-10 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <h3 className="text-white font-bold text-sm md:text-base line-clamp-2 leading-tight mb-1">
              {anime.title_english || anime.title}
            </h3>
            
            <div className="flex items-center gap-2 text-xs font-medium text-muted opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
              <span className="bg-primary/20 text-primary px-2 py-0.5 rounded-sm uppercase tracking-wider">
                {anime.type}
              </span>
              <span>{anime.year || anime.status}</span>
            </div>

            <Link 
              to={`/anime/${anime.mal_id}`}
              className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <div className="w-12 h-12 rounded-full bg-primary/90 text-white flex items-center justify-center shadow-[0_0_30px_rgba(124,58,237,0.5)] transform scale-75 group-hover:scale-100 transition-transform duration-300 delay-100">
                <Play className="w-5 h-5 fill-current ml-1" />
              </div>
            </Link>
          </div>

        </div>
      </Tilt>
    </motion.div>
  );
}
