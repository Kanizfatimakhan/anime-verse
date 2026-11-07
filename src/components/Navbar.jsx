import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Menu, X } from 'lucide-react';
import { useWatchlist } from '../hooks/useWatchlist';

export default function Navbar() {
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { watchlist } = useWatchlist();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [mobileMenuOpen]);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Search', path: '/search' },
    { label: 'Schedule', path: '/schedule' },
    { label: 'Versus', path: '/compare' },
    { label: 'Genres', path: '/genres' },
    { label: 'Watchlist', path: '/watchlist', badge: watchlist.length > 0 ? watchlist.length : null },
    { label: 'Museum', path: '/museum' },
    { label: 'Developer', path: '/developer' },
  ];

  const triggerSearch = () => {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }));
  };

  return (
    <>
      <motion.nav
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-[90] border-b transition-all duration-300 ${
          scrolled
            ? 'border-white/10 bg-zinc-950/90 py-2.5 shadow-lg shadow-black/20 backdrop-blur-2xl'
            : 'border-transparent bg-zinc-950/45 py-3.5 backdrop-blur-md'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex h-11 items-center justify-between gap-4">
          <Link to="/" className="relative z-[110] flex items-center gap-2 group">
            <span className="font-bold text-lg tracking-[-0.045em] text-text flex items-center gap-1.5 sm:text-xl">
              <span>Anime</span>
              <span className="text-violet-300 transition-colors group-hover:text-cyan-200">
                VERSE
              </span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="flex items-center gap-0.5">
              {navLinks.map(({ path, label, badge }) => (
                <Link
                  key={path}
                  to={path}
                  className={`relative rounded-full px-3 py-2 text-[11px] font-semibold transition-colors flex items-center gap-1.5 xl:px-3.5 xl:text-xs ${
                    pathname === path ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/[0.06] hover:text-white'
                  }`}
                >
                  <span>{label}</span>
                  {badge && (
                    <span className="text-[10px] bg-primary text-white font-black px-1.5 py-0.2 rounded-full leading-tight">
                      {badge}
                    </span>
                  )}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={triggerSearch}
                aria-label="Open search"
                className="ml-1 inline-flex h-9 items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3.5 text-xs text-white/75 transition hover:border-white/30 hover:bg-white/10 hover:text-white"
              >
                <Search className="w-3.5 h-3.5" />
                <span className="flex items-center gap-2">
                  Search <kbd className="hidden xl:inline-block rounded border border-white/10 px-1.5 py-0.5 text-[9px] text-white/45">Ctrl K</kbd>
                </span>
              </button>
            </div>
          </div>

          {/* Mobile Toggle Triggers */}
          <div className="lg:hidden flex items-center gap-2.5 z-[110] relative">
            <button onClick={triggerSearch} aria-label="Open search" className="rounded-full p-2 text-white/65 transition hover:bg-white/10 hover:text-white">
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-full p-2 text-white transition hover:bg-white/10 focus:outline-none"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-primary" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Slide-in Mobile Overlay Panel */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween', duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
            className="fixed inset-0 z-[100] overflow-y-auto overscroll-contain bg-zinc-950/98 backdrop-blur-2xl flex flex-col items-center justify-center border-l border-white/5 px-4 py-8"
          >
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close navigation menu"
              className="absolute right-4 top-4 rounded-full p-2 text-muted transition-colors hover:bg-white/10 hover:text-white"
            >
              <X className="h-6 w-6" />
            </button>
            <div className="flex flex-col items-center gap-3 sm:gap-5 text-base sm:text-lg font-black tracking-widest uppercase">
              {navLinks.map(({ path, label, badge }, i) => (
                <motion.div
                  key={path}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.04 }}
                >
                  <Link
                    to={path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block py-2.5 px-6 rounded-full transition-all text-center flex items-center gap-2 ${
                      pathname === path
                        ? 'text-primary bg-primary/10 shadow-[0_0_20px_rgba(124,58,237,0.3)] border border-primary/20'
                        : 'text-text/90 hover:text-primary hover:bg-white/5'
                    }`}
                  >
                    <span>{label}</span>
                    {badge && (
                      <span className="text-[10px] bg-primary text-white px-2 py-0.5 rounded-full">
                        {badge}
                      </span>
                    )}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
