import { motion } from 'framer-motion';
import {
  Link2,
  GitBranch,
  Mail,
  Terminal,
  Sparkles,
  Code2,
  Tv,
  ExternalLink,
  GraduationCap,
  Cpu,
  Layers,
  Globe,
  CheckCircle,
} from 'lucide-react';
import Tilt from 'react-parallax-tilt';

const STREAMING_PLATFORMS = [
  {
    name: 'Crunchyroll',
    desc: 'Largest official anime catalog with day-and-date simulcasts',
    url: 'https://www.crunchyroll.com',
    color: '#F47521',
  },
  {
    name: 'Netflix',
    desc: 'High-budget anime originals and cinematic acquisitions',
    url: 'https://www.netflix.com/browse/genre/7424',
    color: '#E50914',
  },
  {
    name: 'Amazon Prime Video',
    desc: 'Exclusive seasonal anime releases and theatrical movies',
    url: 'https://www.primevideo.com',
    color: '#00A8E0',
  },
  {
    name: 'Disney+ Hotstar',
    desc: 'Curated anime block including Bleach: TYBW',
    url: 'https://www.hotstar.com',
    color: '#0F6FDE',
  },
];

const HIGHLIGHTS = [
  { title: 'Interactive 3D WebGL', desc: 'Custom Three.js virtual museum with dynamic lighting and camera matrices.' },
  { title: 'Generative AI Integration', desc: 'Google Gemini 1.5 Flash conversational assistant with fallback offline engines.' },
  { title: 'Smooth Motion Physics', desc: 'Lenis smooth-scrolling synced with Framer Motion and GSAP ScrollTrigger.' },
  { title: 'Optimized Data Layer', desc: 'Smart client-side caching engine preventing API rate limits (HTTP 429).' },
];

export default function Developer() {
  return (
    <div className="page-container pt-16 pb-20 min-h-[85vh]">
      {/* ─── Profile Section ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
        {/* Left: Holographic 3D Tilt Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md mx-auto lg:max-w-none"
        >
          <Tilt
            tiltMaxAngleX={10}
            tiltMaxAngleY={10}
            perspective={1000}
            scale={1.02}
            className="w-full aspect-[4/5] sm:aspect-[4/3] lg:aspect-[4/5] rounded-[2rem] relative overflow-hidden shadow-[0_20px_60px_rgba(124,58,237,0.3)] border border-white/10 bg-zinc-950"
          >
            {/* Visual backdrop */}
            <img
              src="https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&q=80"
              alt="Anime Aesthetic"
              className="absolute inset-0 w-full h-full object-cover filter brightness-[0.7]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/10 mix-blend-screen" />

            {/* Badge */}
            <div className="absolute top-6 left-6 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900/80 backdrop-blur-md border border-white/10 text-xs font-bold uppercase tracking-wider text-accent">
              <Sparkles className="w-4 h-4 text-primary" /> Senior Frontend Architect
            </div>

            {/* Content info */}
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 z-10">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 border-primary/60 bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-black text-2xl sm:text-3xl shadow-xl mb-4">
                K
              </div>
              <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white mb-1">
                Kaniz Fatima Khan
              </h2>
              <p className="text-accent font-bold tracking-widest uppercase text-xs sm:text-sm mb-5 flex items-center gap-2">
                <Code2 className="w-4 h-4" /> Full-Stack Software Engineer
              </p>

              {/* Links */}
              <div className="flex flex-wrap gap-2.5">
                <a
                  href="https://www.linkedin.com/in/kaniz-fatima-khan-452841246/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-[#0077B5]/30 hover:bg-[#0077B5]/70 transition-colors rounded-full border border-[#0077B5]/40 text-white text-xs font-semibold"
                >
                  <Link2 className="w-3.5 h-3.5" /> LinkedIn
                </a>
                <a
                  href="https://github.com/Kanizfatimakhan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 transition-colors rounded-full border border-white/20 text-white text-xs font-semibold"
                >
                  <GitBranch className="w-3.5 h-3.5" /> GitHub
                </a>
                <a
                  href="mailto:kanizfatima@example.com"
                  className="p-2.5 bg-white/10 hover:bg-accent/40 transition-colors rounded-full border border-white/20 text-white"
                  title="Contact Email"
                >
                  <Mail className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </Tilt>
        </motion.div>

        {/* Right: Technical Narrative */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" /> Engineering & Architectural Vision
          </div>
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-text mb-6 leading-tight">
            Building The Next Generation of{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              Web Experiences
            </span>
          </h1>
          <p className="text-muted leading-relaxed mb-6 text-sm sm:text-base">
            AnimeVerse is designed as a production-grade demonstration of modern frontend engineering,
            combining real-time WebGL graphics, micro-interaction transitions, and resilient API architectures.
            Built with an emphasis on high performance, modern accessibility, and production-grade design systems.
          </p>

          {/* Architecture Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {HIGHLIGHTS.map((item, idx) => (
              <div key={idx} className="glass p-3.5 rounded-xl border border-white/5 bg-zinc-900/30">
                <div className="flex items-center gap-2 text-xs font-bold text-text mb-1">
                  <CheckCircle className="w-3.5 h-3.5 text-primary" /> {item.title}
                </div>
                <p className="text-[11px] text-muted leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Tech Stack Pills */}
          <div className="glass p-4 rounded-2xl border border-white/5 mb-6">
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-muted mb-3 flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5" /> Core Technologies
            </h3>
            <div className="flex flex-wrap gap-2">
              {[
                'React 18',
                'Three.js / React Three Fiber',
                'GSAP ScrollTrigger',
                'Framer Motion',
                'Google Gemini AI',
                'Tailwind CSS',
                'Lenis Smooth Scroll',
                'Vite',
              ].map(tech => (
                <span
                  key={tech}
                  className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-text"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* ─── Streaming Legal Partners ─── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-3">
            <Tv className="w-3.5 h-3.5" /> Legal Streaming Integration
          </div>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-text">
            Where to Stream Full Shows
          </h2>
          <p className="text-muted text-xs sm:text-sm mt-1 max-w-lg mx-auto">
            Direct routing to licensed international anime distributors with high-definition simulcasts.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {STREAMING_PLATFORMS.map((platform) => (
            <a
              key={platform.name}
              href={platform.url}
              target="_blank"
              rel="noopener noreferrer"
              className="glass p-5 rounded-2xl border border-white/5 hover:border-white/20 transition-all hover:-translate-y-1 group flex flex-col justify-between"
            >
              <div>
                <div className="w-2.5 h-2.5 rounded-full mb-3" style={{ background: platform.color }} />
                <h3 className="font-bold text-sm text-text mb-1 group-hover:text-primary transition-colors">
                  {platform.name}
                </h3>
                <p className="text-xs text-muted leading-relaxed line-clamp-2">{platform.desc}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-semibold text-primary">
                <span>Explore Platform</span>
                <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </a>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
