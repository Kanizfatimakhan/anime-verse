import { motion } from 'framer-motion';
import { Smile, Frown, Coffee, Skull, Flame, Heart, Zap, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const moods = [
  { id: 'happy', name: 'Happy', icon: Smile, query: 'comedy,slice of life', color: 'text-yellow-400' },
  { id: 'sad', name: 'Emotional', icon: Frown, query: 'drama', color: 'text-blue-400' },
  { id: 'relaxing', name: 'Relaxing', icon: Coffee, query: 'iyashikei,slice of life', color: 'text-green-400' },
  { id: 'dark', name: 'Dark', icon: Skull, query: 'psychological,thriller', color: 'text-purple-400' },
  { id: 'action', name: 'Action', icon: Flame, query: 'action,shounen', color: 'text-red-400' },
  { id: 'romance', name: 'Romance', icon: Heart, query: 'romance', color: 'text-pink-400' },
  { id: 'adventure', name: 'Adventure', icon: Zap, query: 'adventure,fantasy', color: 'text-orange-400' }
];

export default function AnimeMoodExplorer() {
  const navigate = useNavigate();

  const handleMoodSelect = (mood) => {
    navigate(`/search?q=${encodeURIComponent(mood.query)}&mood=${mood.id}`);
  };

  return (
    <section id="mood-explorer" className="relative overflow-hidden py-8 sm:py-12">
      <div className="page-container relative z-10">
        <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-violet-300/75">Choose your route</p>
          <h2 className="section-heading text-2xl text-text sm:text-3xl">
            What world are you in the mood for?
          </h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-muted">Pick a feeling. We’ll take you to stories that match the vibe.</p>
        </div>

        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4">
          {moods.map((mood, i) => {
            const Icon = mood.icon;
            return (
              <motion.button
                key={mood.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleMoodSelect(mood)}
                className="group relative flex min-h-24 items-center gap-2.5 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] p-3 text-left transition-all duration-300 hover:border-violet-200/30 hover:bg-violet-300/[0.06] sm:min-h-28 sm:gap-4 sm:p-5"
              >
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] sm:h-12 sm:w-12 ${mood.color}`}>
                  <Icon className="h-4 w-4 sm:h-6 sm:w-6" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-white sm:text-base">{mood.name}</span>
                  <span className="mt-1 block text-[10px] font-medium uppercase tracking-wide text-white/40">Explore path</span>
                </span>
                <span className="absolute right-3 top-3 font-mono text-[9px] text-white/25">0{i + 1}</span>
                <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-violet-300 to-cyan-200 transition-all duration-300 group-hover:w-full" />
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
