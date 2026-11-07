// src/App.jsx
import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ReactLenis } from 'lenis/react';

// Core Framework Layout Wrappers
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollProgress from './components/ScrollProgress';
import CommandPalette from './components/CommandPalette';
import AIAnimeAssistant from './components/AIAnimeAssistant';
import { ToastProvider } from './context/ToastContext';

// Pages Modules Injection
import Home from './pages/Home';
import AnimeDetail from './pages/AnimeDetail';
import Search from './pages/Search';
import Genres from './pages/Genres';
import Watchlist from './pages/Watchlist';
import Gallery from './pages/Gallery';
import Museum from './pages/Museum';
import Schedule from './pages/Schedule';
import Compare from './pages/Compare';
import Developer from './pages/Developer';

// Mihir Style Premium Custom Micro-Interactions Transition Matrix
const pageVariants = {
  initial: { opacity: 0, y: 10, filter: 'blur(4px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.4, ease: [0.23, 1, 0.32, 1] } },
  exit: { opacity: 0, y: -10, filter: 'blur(4px)', transition: { duration: 0.3, ease: [0.23, 1, 0.32, 1] } }
};

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    // Smooth reset boundary setup to sync with Lenis frame update ticking
    const scrollTimeout = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, 20);
    return () => clearTimeout(scrollTimeout);
  }, [pathname]);
  return null;
}

function PageWrapper({ children }) {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="w-full">
      {children}
    </motion.div>
  );
}

function App() {
  const location = useLocation();

  return (
    <ToastProvider>
        {/* Dynamic Framework Setup with Forced Core Variable Bindings */}
      <ReactLenis root options={{ lerp: 0.08, duration: 1.2, smoothTouch: false }}>
        <div className="min-h-screen flex flex-col relative text-sm md:text-base overflow-x-hidden w-full bg-zinc-950 text-zinc-100 selection:bg-primary/30">
            <ScrollToTop />
            <ScrollProgress />
            <CommandPalette />

            {/* Elevated Nav Layer */}
            <Navbar />

            <main className="flex-1 w-full pt-16 relative z-10">
              <AnimatePresence mode="wait" initial={false}>
                <Routes location={location} key={location.pathname}>
                  <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
                  <Route path="/adventure" element={<Navigate to="/" replace />} />
                  <Route path="/anime/:id" element={<PageWrapper><AnimeDetail /></PageWrapper>} />
                  <Route path="/search" element={<PageWrapper><Search /></PageWrapper>} />
                  <Route path="/genres" element={<PageWrapper><Genres /></PageWrapper>} />
                  <Route path="/watchlist" element={<PageWrapper><Watchlist /></PageWrapper>} />
                  <Route path="/gallery" element={<PageWrapper><Gallery /></PageWrapper>} />
                  <Route path="/museum" element={<PageWrapper><Museum /></PageWrapper>} />
                  <Route path="/schedule" element={<PageWrapper><Schedule /></PageWrapper>} />
                  <Route path="/compare" element={<PageWrapper><Compare /></PageWrapper>} />
                  <Route path="/developer" element={<PageWrapper><Developer /></PageWrapper>} />
                </Routes>
              </AnimatePresence>
            </main>

            {/* AI Assistant - Bottom Right */}
            <div className="fixed bottom-4 right-4 z-50 pointer-events-auto sm:bottom-6 sm:right-6">
              <AIAnimeAssistant />
            </div>

            {location.pathname === '/' && <Footer />}
        </div>
      </ReactLenis>
    </ToastProvider>
  );
}

export default App;
