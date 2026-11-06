import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => onComplete(), 500); // Wait a bit at 100%
          return 100;
        }
        return prev + Math.floor(Math.random() * 15) + 5; // Random jump
      });
    }, 150);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, y: '-100%', transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
      >
        <motion.div 
          className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          AnimeVerse
        </motion.div>
        
        <div className="w-64 h-1 bg-secondary rounded-full overflow-hidden relative">
          <motion.div
            className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-primary to-accent"
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: "easeOut", duration: 0.2 }}
          />
        </div>
        <motion.div 
          className="mt-4 text-muted font-mono text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {Math.min(progress, 100)}%
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
