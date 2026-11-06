import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ReactLenis } from 'lenis/react';
import { useState, useEffect } from 'react';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoadingScreen from './components/LoadingScreen';
import ScrollProgress from './components/ScrollProgress';
import CommandPalette from './components/CommandPalette';
import RecommendationBar from './components/RecommendationBar';
import RandomAnimeButton from './components/RandomAnimeButton';
import AIAnimeAssistant from './components/AIAnimeAssistant';
import { ThemeProvider } from './context/ThemeContext';

import Home from './pages/Home';
import AnimeDetail from './pages/AnimeDetail';
import Search from './pages/Search';
import Genres from './pages/Genres';
import Watchlist from './pages/Watchlist';
import Museum from './pages/Museum';
import Viewer3D from './pages/Viewer3D';
import Developer from './pages/Developer';

// Premium Curtain Transition
const pageVariants = {
  initial: { opacity: 0, scale: 0.98, filter: 'blur(10px)' },
  animate: { opacity: 1, scale: 1, filter: 'blur(0px)', transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, scale: 1.02, filter: 'blur(10px)', transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }
};

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, 10);
  }, [pathname]);
  return null;
}

function PageWrapper({ children }) {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      {children}
    </motion.div>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  return (
    <ThemeProvider>
      <ReactLenis root options={{ lerp: 0.1, duration: 1.5, smoothTouch: false }}>
        {isLoading ? (
          <LoadingScreen onComplete={() => setIsLoading(false)} />
        ) : (
          <div className="min-h-screen flex flex-col relative text-sm md:text-base overflow-x-hidden w-full">
            <ScrollToTop />
            <ScrollProgress />
            <CommandPalette />
            <Navbar />
            
            <main className="flex-1 w-full pt-16">
              <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>
                  <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
                  <Route path="/anime/:id" element={<PageWrapper><AnimeDetail /></PageWrapper>} />
                  <Route path="/search" element={<PageWrapper><Search /></PageWrapper>} />
                  <Route path="/genres" element={<PageWrapper><Genres /></PageWrapper>} />
                  <Route path="/watchlist" element={<PageWrapper><Watchlist /></PageWrapper>} />
                  <Route path="/museum" element={<PageWrapper><Museum /></PageWrapper>} />
                  <Route path="/3d-viewer" element={<PageWrapper><Viewer3D /></PageWrapper>} />
                  <Route path="/developer" element={<PageWrapper><Developer /></PageWrapper>} />
                </Routes>
              </AnimatePresence>
            </main>

            <RecommendationBar />
            <RandomAnimeButton />
            <AIAnimeAssistant />
            <Footer />
          </div>
        )}
      </ReactLenis>
    </ThemeProvider>
  );
}

export default App;
