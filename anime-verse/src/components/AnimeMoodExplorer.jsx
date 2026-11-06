import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [activeMood, setActiveMood] = useState(null);
  const navigate = useNavigate();

  const handleMoodSelect = (mood) => {
    setActiveMood(mood.id);
    setTimeout(() => {
      navigate(`/search?q=${encodeURIComponent(mood.query)}&mood=${mood.id}`);
    }, 600); // Wait for animation
  };

  return (
    <section className="py-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-text mb-4">
            Mood <span className="text-primary">Explorer</span>
          </h2>
          <p className="text-muted max-w-xl">Not sure what to watch? Let your mood decide your next adventure.</p>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          {moods.map((mood, i) => {
            const Icon = mood.icon;
            const isActive = activeMood === mood.id;
            
            return (
              <motion.button
                key={mood.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleMoodSelect(mood)}
                className={`relative px-6 py-4 rounded-2xl glass border flex flex-col items-center gap-3 min-w-[120px] transition-all duration-300 ${
                  isActive ? 'border-primary bg-primary/10 scale-110 shadow-[0_0_30px_rgba(124,58,237,0.3)]' : 'border-white/5 hover:bg-white/5'
                }`}
              >
                <Icon className={`w-8 h-8 ${mood.color}`} />
                <span className="font-bold text-sm tracking-wider text-text">{mood.name}</span>
                
                {isActive && (
                  <motion.div 
                    layoutId="mood-active"
                    className="absolute inset-0 border-2 border-primary rounded-2xl z-20 pointer-events-none"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
