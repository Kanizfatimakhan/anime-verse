import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Command, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setIsOpen(false);
      setQuery('');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[200]"
            onClick={() => setIsOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-[20%] left-1/2 -translate-x-1/2 w-[90%] max-w-2xl glass shadow-2xl z-[201] overflow-hidden"
          >
            <form onSubmit={handleSearch} className="flex items-center p-4 border-b border-border bg-background/50">
              <Search className="w-5 h-5 text-muted mr-3" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search anime, characters, studios..."
                className="flex-1 bg-transparent border-none outline-none text-text text-lg placeholder:text-muted/50"
              />
              <div className="flex items-center gap-2 text-xs text-muted/50">
                <kbd className="bg-secondary px-2 py-1 rounded hidden sm:inline-block">ESC</kbd>
                <button type="button" onClick={() => setIsOpen(false)} className="hover:text-text transition-colors ml-2">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </form>
            <div className="p-4 bg-secondary/30">
              <p className="text-xs text-muted mb-3 font-semibold uppercase tracking-wider">Quick Actions</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button onClick={() => { navigate('/search'); setIsOpen(false); }} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 text-left transition-colors text-text/90 hover:text-text">
                  <Search className="w-4 h-4 text-primary" />
                  <span>Advanced Search</span>
                </button>
                <button onClick={() => { navigate('/genres'); setIsOpen(false); }} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 text-left transition-colors text-text/90 hover:text-text">
                  <Command className="w-4 h-4 text-accent" />
                  <span>Browse Genres</span>
                </button>
                <button onClick={() => { navigate('/schedule'); setIsOpen(false); }} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 text-left transition-colors text-text/90 hover:text-text">
                  <span className="text-sm">📅</span>
                  <span>Weekly Airing Schedule</span>
                </button>
                <button onClick={() => { navigate('/compare'); setIsOpen(false); }} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 text-left transition-colors text-text/90 hover:text-text">
                  <span className="text-sm">⚔️</span>
                  <span>Anime Face-Off (Versus)</span>
                </button>
                <button onClick={() => { navigate('/gallery'); setIsOpen(false); }} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 text-left transition-colors text-text/90 hover:text-text">
                  <span className="text-sm">🖼️</span>
                  <span>Anime Gallery</span>
                </button>
                <button onClick={() => { navigate('/museum'); setIsOpen(false); }} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 text-left transition-colors text-text/90 hover:text-text">
                  <span className="text-sm">🏛️</span>
                  <span>Virtual Museum</span>
                </button>
                <button onClick={() => { navigate('/watchlist'); setIsOpen(false); }} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 text-left transition-colors text-text/90 hover:text-text">
                  <span className="text-sm">❤️</span>
                  <span>My Watchlist</span>
                </button>
                <button onClick={() => { navigate('/developer'); setIsOpen(false); }} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 text-left transition-colors text-text/90 hover:text-text">
                  <span className="text-sm">👩‍💻</span>
                  <span>Developer Portfolio</span>
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
