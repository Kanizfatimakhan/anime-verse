import { useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Palette } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const themes = [
  { id: 'dark', name: 'Dark', colors: { bg: '#09090B', primary: '#7C3AED', accent: '#38BDF8' } },
  { id: 'amoled', name: 'AMOLED', colors: { bg: '#000000', primary: '#E11D48', accent: '#F43F5E' } },
  { id: 'purple', name: 'Purple', colors: { bg: '#171026', primary: '#A855F7', accent: '#D8B4FE' } },
  { id: 'cyber', name: 'Cyber Blue', colors: { bg: '#050B14', primary: '#0EA5E9', accent: '#38BDF8' } },
];

export default function ThemeSwitcher() {
  const [currentTheme, setCurrentTheme] = useLocalStorage('animeverse_theme', 'dark');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const theme = themes.find(t => t.id === currentTheme) || themes[0];
    document.documentElement.style.setProperty('--bg', theme.colors.bg);
    document.documentElement.style.setProperty('--primary', theme.colors.primary);
    document.documentElement.style.setProperty('--accent', theme.colors.accent);
    // Optionally update other variables like border, glass colors based on bg
  }, [currentTheme]);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full hover:bg-white/10 transition-colors text-muted hover:text-text"
        title="Switch Theme"
      >
        <Palette className="w-5 h-5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 top-full mt-2 w-48 glass p-2 flex flex-col gap-1 z-50 origin-top-right"
          >
            {themes.map(theme => (
              <button
                key={theme.id}
                onClick={() => {
                  setCurrentTheme(theme.id);
                  setIsOpen(false);
                }}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                  currentTheme === theme.id ? 'bg-primary/20 text-text' : 'text-muted hover:bg-white/5 hover:text-text'
                }`}
              >
                <div 
                  className="w-4 h-4 rounded-full border border-white/20"
                  style={{ background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.accent})` }}
                />
                {theme.name}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
