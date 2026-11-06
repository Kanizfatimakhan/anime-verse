// anime-verse/src/components/Navbar.jsx
import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Menu, X } from 'lucide-react';
import ThemeSwitcher from './ThemeSwitcher';

export default function Navbar() {
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 20);
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

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
    { label: 'Genres', path: '/genres' },
    { label: 'Watchlist', path: '/watchlist' },
    { label: 'Museum 3D', path: '/museum' },
    { label: 'Viewer 3D', path: '/3d-viewer' },
    { label: 'Developer', path: '/developer' },
  ];

  const triggerSearch = () => {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }));
  };

  return (
    <>
      <motion.nav
        variants={{
          visible: { y: 0 },
          hidden: { y: '-100%' }
        }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={`fixed top-0 left-0 right-0 z-[90] transition-all duration-300 ${
          scrolled 
            ? 'bg-zinc-950/40 backdrop-blur-md border-b border-white/5 py-3 shadow-2xl shadow-black/40' 
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          
          <Link to="/" className="relative z-[110] flex items-center gap-2 group hover-target">
            <span className="font-black text-xl tracking-tighter text-text">
              ANIME<span className="text-primary group-hover:text-accent transition-colors">VERSE</span>
            </span>
          </Link>

          {/* Desktop Nav (Mihir Style Bento/Glass Architecture) */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-6 bg-zinc-900/40 border border-white/5 backdrop-blur-md px-6 py-2 rounded-full shadow-lg shadow-black/20">
              {navLinks.map(({ path, label }) => (
                <Link
                  key={path}
                  to={path}
                  className={`relative text-xs lg:text-sm font-medium tracking-wide uppercase transition-colors hover-target ${
                    pathname === path ? 'text-primary' : 'text-muted hover:text-text'
                  }`}
                >
                  {label}
                  {pathname === path && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full shadow-[0_0_10px_rgba(124,58,237,0.5)]"
                    />
                  )}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={triggerSearch}
                className="flex items-center gap-2 text-sm text-muted hover:text-text transition-colors bg-zinc-900/40 border border-white/5 backdrop-blur-md px-4 py-2 rounded-full shadow-md hover:border-white/10 hover-target"
              >
                <Search className="w-4 h-4" />
                <span className="opacity-70 flex items-center gap-1">Search <kbd className="hidden lg:inline-block bg-white/10 px-1.5 py-0.5 rounded text-[10px]">Ctrl K</kbd></span>
              </button>
              <ThemeSwitcher />
            </div>
          </div>

          {/* Mobile Toggle Triggers */}
          <div className="md:hidden flex items-center gap-3 z-[110] relative">
            <button onClick={triggerSearch} className="text-muted hover:text-text p-2 hover-target">
              <Search className="w-5 h-5" />
            </button>
            <ThemeSwitcher />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-text p-2 -mr-2 focus:outline-none hover-target"
              aria-label="Toggle Menu"
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
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
            className="fixed inset-0 z-[100] bg-zinc-950/95 backdrop-blur-2xl flex flex-col items-center justify-center border-l border-white/5"
          >
            <div className="flex flex-col items-center gap-6 text-xl sm:text-2xl font-black tracking-widest uppercase mt-8">
              {navLinks.map(({ path, label }, i) => (
                <motion.div
                  key={path}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.05 }}
                >
                  <Link
                    to={path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block py-2 px-6 rounded-full transition-all duration-300 text-center ${
                      pathname === path 
                        ? 'text-primary bg-primary/10 shadow-[0_0_20px_rgba(124,58,237,0.3)] border border-primary/20' 
                        : 'text-text/90 hover:text-primary hover:bg-white/5'
                    }`}
                  >
                    {label}
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
