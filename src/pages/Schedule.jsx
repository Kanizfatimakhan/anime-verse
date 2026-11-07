import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Sparkles, Clock, Tv } from 'lucide-react';
import { getAnimeSchedule } from '../utils/animeApi';
import AnimeCard from '../components/AnimeCard';
import { SEED_ANIME_LIST } from '../data/animeSeedData';

const DAYS = [
  { id: 'monday', label: 'Monday' },
  { id: 'tuesday', label: 'Tuesday' },
  { id: 'wednesday', label: 'Wednesday' },
  { id: 'thursday', label: 'Thursday' },
  { id: 'friday', label: 'Friday' },
  { id: 'saturday', label: 'Saturday' },
  { id: 'sunday', label: 'Sunday' },
];

export default function Schedule() {
  const currentDayName = useMemo(() => {
    const daysMap = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return daysMap[new Date().getDay()];
  }, []);

  const [activeDay, setActiveDay] = useState(currentDayName);
  const [scheduleData, setScheduleData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchSched = async () => {
      setLoading(true);
      try {
        const res = await getAnimeSchedule();
        if (isMounted) {
          setScheduleData(res?.data || SEED_ANIME_LIST);
        }
      } catch {
        if (isMounted) setScheduleData(SEED_ANIME_LIST);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchSched();

    return () => { isMounted = false; };
  }, []);

  // Filter shows for active day (distribute seed data cleanly if API doesn't specify broadcast day)
  const dayAnime = useMemo(() => {
    if (!scheduleData.length) return SEED_ANIME_LIST;

    const filtered = scheduleData.filter(a => {
      const broadcastDay = a.broadcast?.day?.toLowerCase();
      if (broadcastDay) return broadcastDay.includes(activeDay);
      // Fallback distribution for demo consistency
      const index = DAYS.findIndex(d => d.id === activeDay);
      return a.mal_id % 7 === index;
    });

    return filtered.length ? filtered : SEED_ANIME_LIST.slice(0, 6);
  }, [scheduleData, activeDay]);

  return (
    <div className="page-container pt-10 pb-20 min-h-[85vh]">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-4">
          <Calendar className="w-3.5 h-3.5" /> Broadcast Radar
        </div>
        <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-text mb-3">
          Weekly <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Simulcast Schedule</span>
        </h1>
        <p className="text-muted text-xs sm:text-sm">
          Keep track of weekly Japanese episode broadcasts and international simulcast drops.
        </p>
      </div>

      {/* Day Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 pb-4 mb-8">
        {DAYS.map(day => {
          const isToday = day.id === currentDayName;
          const isActive = day.id === activeDay;

          return (
            <button
              key={day.id}
              onClick={() => setActiveDay(day.id)}
              className={`relative px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-1.5 ${
                isActive
                  ? 'bg-primary text-white shadow-[0_0_20px_rgba(124,58,237,0.4)]'
                  : 'glass text-muted hover:text-text hover:bg-white/5 border border-white/5'
              }`}
            >
              <span>{day.label}</span>
              {isToday && (
                <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-black ${isActive ? 'bg-white text-zinc-950' : 'bg-primary/20 text-primary'}`}>
                  Today
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <motion.div
        key={activeDay}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-white/5 text-xs font-bold uppercase tracking-wider text-muted">
          <span>Airing on {DAYS.find(d => d.id === activeDay)?.label}</span>
          <span>{dayAnime.length} Broadcasts</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
          {dayAnime.map((anime, i) => (
            <AnimeCard key={`${anime.mal_id}-${i}`} anime={anime} index={i} />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
