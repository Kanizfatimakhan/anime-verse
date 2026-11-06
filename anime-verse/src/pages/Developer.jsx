import { motion } from 'framer-motion';
import { Link2, GitBranch, Mail, Terminal, Sparkles, Code2, Tv, ExternalLink } from 'lucide-react';
import Tilt from 'react-parallax-tilt';

const STREAMING_PLATFORMS = [
  {
    name: 'Crunchyroll',
    desc: 'Largest anime library with simulcasts',
    url: 'https://www.crunchyroll.com',
    color: '#F47521',
    logo: 'https://www.crunchyroll.com/build/assets/img/favicons/favicon-32x32.png',
  },
  {
    name: 'Netflix',
    desc: 'Premium anime originals & exclusives',
    url: 'https://www.netflix.com/browse/genre/7424',
    color: '#E50914',
    logo: 'https://assets.nflxext.com/us/ffe/siteui/common/icons/nficon2016.ico',
  },
  {
    name: 'Funimation',
    desc: 'Dubbed anime & simulcasts',
    url: 'https://www.funimation.com',
    color: '#400099',
    logo: 'https://www.funimation.com/favicon.ico',
  },
  {
    name: 'Amazon Prime Video',
    desc: 'Anime exclusives on Prime',
    url: 'https://www.primevideo.com',
    color: '#00A8E0',
    logo: 'https://www.primevideo.com/favicon.ico',
  },
  {
    name: 'HiDive',
    desc: 'Niche & classic anime titles',
    url: 'https://www.hidive.com',
    color: '#00AEEF',
    logo: 'https://www.hidive.com/favicon.ico',
  },
  {
    name: 'Disney+ Hotstar',
    desc: 'Select anime titles & movies',
    url: 'https://www.hotstar.com',
    color: '#0F6FDE',
    logo: 'https://www.hotstar.com/favicon.ico',
  },
];

export default function Developer() {
  return (
    <div className="max-w-7xl mx-auto px-6 pt-16 pb-12 min-h-[85vh]">

      {/* ─── Profile Section ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">

        {/* Left: Holographic Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md mx-auto lg:max-w-none"
        >
          <Tilt
            tiltMaxAngleX={12}
            tiltMaxAngleY={12}
            perspective={1000}
            scale={1.02}
            className="w-full aspect-[4/5] sm:aspect-[4/3] lg:aspect-[4/5] rounded-[2rem] relative overflow-hidden shadow-[0_0_40px_rgba(124,58,237,0.3)] border border-white/10"
          >
            {/* Anime background image */}
            <img
              src="https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&q=80"
              alt="Anime aesthetic"
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d0118] via-primary/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/10" />

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 z-10">
              {/* Avatar circle */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-primary/60 bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-black text-2xl sm:text-3xl shadow-lg mb-4">
                K
              </div>
              <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white mb-1">Kaniz Fatima Khan</h2>
              <p className="text-accent font-bold tracking-widest uppercase text-xs sm:text-sm mb-5 flex items-center gap-2">
                <Code2 className="w-4 h-4" /> Full Stack Developer
              </p>

              {/* Social Links */}
              <div className="flex flex-wrap gap-3">
                <a
                  href="https://www.linkedin.com/in/kaniz-fatima-khan-452841246/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-[#0077B5]/30 hover:bg-[#0077B5]/70 transition-colors rounded-full border border-[#0077B5]/40 text-white text-xs sm:text-sm font-semibold"
                >
                  <Link2 className="w-4 h-4" /> LinkedIn
                </a>
                <a
                  href="https://github.com/Kanizfatimakhan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 transition-colors rounded-full border border-white/20 text-white text-xs sm:text-sm font-semibold"
                >
                  <GitBranch className="w-4 h-4" /> GitHub
                </a>
                <a
                  href="mailto:kanizfatima@example.com"
                  className="p-2.5 bg-white/10 hover:bg-accent/40 transition-colors rounded-full border border-white/20 text-white"
                >
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </div>
          </Tilt>
        </motion.div>

        {/* Right: Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-text mb-6">
            The Vision <br /> Behind{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">AnimeVerse</span>
          </h1>
          <p className="text-muted leading-relaxed mb-8 text-sm md:text-base">
            AnimeVerse is built to be the ultimate, ultra-premium experience for discovering anime.
            Crafted with passion, it blends cutting-edge WebGL 3D environments, Awwwards-quality GSAP animations,
            and a glassmorphism aesthetic to deliver a cinematic user journey like no other.
          </p>

          <div className="glass p-5 md:p-6 rounded-2xl border border-white/5 mb-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted mb-4 flex items-center gap-2">
              <Terminal className="w-4 h-4" /> Tech Stack
            </h3>
            <div className="flex flex-wrap gap-2">
              {['React 18', 'Three.js / R3F', 'GSAP', 'Framer Motion', 'Vite', 'Jikan API', 'Gemini AI', 'Tailwind CSS'].map(tech => (
                <span key={tech} className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-text">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="glass p-5 md:p-6 rounded-2xl border border-primary/20 bg-primary/5">
            <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Message from Developer
            </h3>
            <p className="text-text/80 text-xs sm:text-sm leading-relaxed italic">
              "My goal was to break the mold of traditional list-based anime sites and create something
              that feels alive — a fully immersive, next-gen experience. From the VR Museum to the AI Chatbot,
              every feature is built with love for the anime community."
              <br /><br />
              <span className="not-italic font-bold text-primary">— Kaniz Fatima Khan</span>
            </p>
          </div>
        </motion.div>
      </div>

      {/* ─── Where to Watch Section ─── */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-4">
            <Tv className="w-4 h-4" /> Full Anime Streaming
          </div>
          <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight text-text">
            Where to Watch <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Full Anime</span>
          </h2>
          <p className="text-muted mt-3 text-xs sm:text-sm max-w-xl mx-auto">
            Explore thousands of anime series and movies on these premium platforms. Legal, high-quality, and subtitled!
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {STREAMING_PLATFORMS.map((platform, i) => (
            <motion.a
              key={platform.name}
              href={platform.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              whileHover={{ scale: 1.03, y: -4 }}
              className="glass p-5 md:p-6 rounded-2xl border border-white/5 hover:border-white/20 transition-all group flex items-center gap-5 relative overflow-hidden"
            >
              {/* Color accent bar */}
              <div
                className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
                style={{ background: platform.color }}
              />
              {/* Logo circle */}
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg"
                style={{ background: `${platform.color}20`, border: `1px solid ${platform.color}40` }}
              >
                <img
                  src={platform.logo}
                  alt={platform.name}
                  className="w-7 h-7 object-contain"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
                <Tv className="w-6 h-6 hidden" style={{ color: platform.color }} />
              </div>
              {/* Text */}
              <div className="flex-1 min-w-0">
                <h3 className="font-black text-text text-sm sm:text-base mb-1">{platform.name}</h3>
                <p className="text-muted text-xs leading-relaxed line-clamp-2">{platform.desc}</p>
              </div>
              {/* Arrow */}
              <ExternalLink className="w-4 h-4 text-muted group-hover:text-primary transition-colors flex-shrink-0" />
            </motion.a>
          ))}
        </div>
      </motion.div>

    </div>
  );
}
