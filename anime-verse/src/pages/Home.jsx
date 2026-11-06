// anime-verse/src/pages/Home.jsx
import { useEffect, useState } from 'react';
import { fetchWithCache } from '../utils/api'; // Upgraded Caching Engine Connect Kiya
import Hero from '../components/Hero';
import AnimeSlider from '../components/AnimeSlider';
import AnimeMoodExplorer from '../components/AnimeMoodExplorer';
import AnimeTimeline from '../components/AnimeTimeline';
import StudioShowcase from '../components/StudioShowcase';
import { motion } from 'framer-motion';

export default function Home() {
  const [trending, setTrending] = useState([]);
  const [top, setTop] = useState([]);
  const [season, setSeason] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      setError(null);
      try {
        // Mihir Jaiswal Production Standard: Concurrent Caching (30 Minutes Expiry)
        const [t, tp, s] = await Promise.allSettled([
          fetchWithCache('/seasons/now?limit=15', 'trending_anime', 30), // Trending endpoints vary, setting stable query
          fetchWithCache('/top/anime?limit=30', 'top_anime', 45),       // Top anime cached for 45 mins
          fetchWithCache('/seasons/now', 'season_anime', 30)
        ]);

        if (t.status === 'fulfilled' && t.value) setTrending(t.value.data || []);
        if (tp.status === 'fulfilled' && tp.value) setTop(tp.value.data || []);
        if (s.status === 'fulfilled' && s.value) setSeason(s.value.data || []);
        
        // Agar main files block ho jayein aur local storage bhi na ho tabhi error dikhayein
        if (t.status === 'rejected' && tp.status === 'rejected' && !localStorage.getItem('top_anime')) {
          setError('API limit reached or Server Slow. Wait a moment and refresh.');
        }
      } catch(e) {
        setError('Something went wrong. Please refresh.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-6 bg-zinc-950">
      <motion.p 
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="text-5xl mb-6"
      >
        ⚠️
      </motion.p>
      <p className="text-primary text-xl font-bold mb-6 font-mono tracking-tight">{error}</p>
      <button 
        onClick={() => window.location.reload()} 
        className="px-8 py-3 bg-zinc-900/40 border border-white/10 backdrop-blur-md text-white rounded-full font-bold uppercase tracking-widest hover:bg-white hover:text-black hover:border-white transition-all duration-300 hover-target"
      >
        Retry Connection
      </button>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-zinc-950 pb-8 min-h-screen selection:bg-primary selection:text-white"
    >
      <Hero />
      
      {/* Immersive Layout Structure */}
      <div className="relative z-10 -mt-20 max-w-7xl mx-auto px-4 sm:px-6">
        <AnimeSlider title="Today's Trending" items={trending} />
        <AnimeSlider title="This Season" items={season} />
        
        {/* Bento / Parallax Structure Integrated Inside Sections */}
        <AnimeMoodExplorer />
        
        <AnimeSlider title="Top Airing" items={top.slice(0, 15)} />
        <AnimeSlider title="Most Popular" items={top.slice(15, 30)} />
        
        <AnimeTimeline />
        <StudioShowcase />
      </div>
    </motion.div>
  );
}
