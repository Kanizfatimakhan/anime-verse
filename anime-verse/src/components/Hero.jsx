import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { ChevronDown, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import InteractiveCanvas from './InteractiveCanvas';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const elementsRef = useRef([]);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Parallax text
      gsap.to(textRef.current, {
        yPercent: 50,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      });

      // Floating holographic elements
      elementsRef.current.forEach((el, i) => {
        gsap.to(el, {
          y: "random(-100, 100)",
          x: "random(-50, 50)",
          rotation: "random(-45, 45)",
          duration: "random(4, 8)",
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: i * 0.5
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-background">
      {/* Dynamic Animated Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[150px] mix-blend-screen" />
      </div>

      <InteractiveCanvas />

      {/* Floating Holographic Elements */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            ref={el => elementsRef.current[i] = el}
            className="absolute bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl w-24 h-32 lg:w-48 lg:h-64"
            style={{
              top: `${Math.random() * 80 + 10}%`,
              left: `${Math.random() * 80 + 10}%`,
              boxShadow: '0 0 40px rgba(124,58,237,0.1)'
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto mt-20" ref={textRef}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter text-text leading-none mb-6">
            The Ultimate <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-glow to-accent">
              Anime Experience
            </span>
          </h1>
          <p className="text-base md:text-lg text-muted max-w-2xl mx-auto mb-10 leading-relaxed">
            Immerse yourself in a cinematic journey. Discover trending masterpieces, explore intricate genres, and curate your personal collection.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/museum" 
              className="px-8 py-4 bg-primary text-white rounded-full font-bold uppercase tracking-wider flex items-center gap-2 hover:scale-105 hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] transition-all duration-300"
            >
              <Play className="w-5 h-5 fill-current" />
              Enter the 3D Museum
            </Link>
            <button 
              onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))}
              className="px-8 py-4 glass text-text rounded-full font-bold uppercase tracking-wider hover:bg-white/10 transition-all duration-300"
            >
              Quick Search (Ctrl+K)
            </button>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.div>
    </div>
  );
}
