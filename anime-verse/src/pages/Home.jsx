import { useEffect, useState } from 'react';
import { getTrending, getTopAnime, getSeasonNow } from '../utils/api';
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
        const [t, tp, s] = await Promise.allSettled([
          getTrending(),
          getTopAnime(),
          getSeasonNow()
        ]);
        if (t.status === 'fulfilled') setTrending(t.value.data || []);
        if (tp.status === 'fulfilled') setTop(tp.value.data || []);
        if (s.status === 'fulfilled') setSeason(s.value.data || []);
        
        if (t.status === 'rejected' && tp.status === 'rejected') {
          setError('API limit reached. Wait a moment and refresh.');
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
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-6">
      <p className="text-5xl mb-6">⚠️</p>
      <p className="text-primary text-xl font-bold mb-6">{error}</p>
      <button 
        onClick={() => window.location.reload()} 
        className="px-8 py-3 bg-primary/20 text-primary border border-primary rounded-full font-bold uppercase tracking-widest hover:bg-primary hover:text-white transition-colors"
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
      className="bg-background pb-8"
    >
      <Hero />
      
      {/* We skip showing loaders for individual sections so the page flows immediately */}
      <div className="relative z-10 -mt-20">
        <AnimeSlider title="Today's Trending" items={trending} />
        <AnimeSlider title="This Season" items={season} />
        
        <AnimeMoodExplorer />
        
        <AnimeSlider title="Top Airing" items={top.slice(0, 15)} />
        <AnimeSlider title="Most Popular" items={top.slice(15, 30)} />
        
        <AnimeTimeline />
        <StudioShowcase />
      </div>
    </motion.div>
  );
}