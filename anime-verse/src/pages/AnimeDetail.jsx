import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getAnimeById, getAnimeCharacters } from '../utils/api';
import { useWatchlist } from '../hooks/useWatchlist';
import { Heart, Star, Users, ExternalLink, X, Play, Tv } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ─── Trailer Modal ──────────────────────────────────────────────────────────
function TrailerModal({ youtubeId, title, onClose }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        onClick={onClose}
        style={{ background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(10px)' }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: 'spring', damping: 20 }}
          className="relative w-full max-w-4xl"
          onClick={e => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute -top-10 right-0 text-white/70 hover:text-white flex items-center gap-2 text-sm font-bold"
          >
            <X className="w-5 h-5" /> Close
          </button>
          <div className="aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&cc_load_policy=1&cc_lang_pref=en`}
              title={`${title} Trailer`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Streaming Platforms ────────────────────────────────────────────────────
const PLATFORMS = [
  { name: 'Crunchyroll', color: '#F47521', url: (t) => `https://www.crunchyroll.com/search?q=${t}` },
  { name: 'Netflix', color: '#E50914', url: (t) => `https://www.netflix.com/search?q=${t}` },
  { name: 'Funimation', color: '#400099', url: (t) => `https://www.funimation.com/search/?q=${t}` },
  { name: 'Amazon Prime', color: '#00A8E0', url: (t) => `https://www.amazon.com/s?k=${t}+anime` },
];

// ─── Main Component ─────────────────────────────────────────────────────────
export default function AnimeDetail() {
  const { id } = useParams();
  const [anime, setAnime] = useState(null);
  const [chars, setChars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);
  const [showPlatforms, setShowPlatforms] = useState(false);
  const { add, remove, isIn } = useWatchlist();
  const posterRef = useRef(null);
  const bannerRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    setAnime(null);
    setShowTrailer(false);
    setShowPlatforms(false);
    const load = async () => {
      try {
        const [a, c] = await Promise.all([
          getAnimeById(id),
          getAnimeCharacters(id)
        ]);
        setAnime(a.data);
        setChars(c.data?.slice(0, 10) || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  useEffect(() => {
    if (!anime || !posterRef.current || !bannerRef.current) return;
    let ctx = gsap.context(() => {
      gsap.to(posterRef.current, {
        y: 80, ease: 'none',
        scrollTrigger: {
          trigger: bannerRef.current,
          start: 'top top', end: 'bottom top', scrub: true,
        },
      });
    });
    return () => ctx.revert();
  }, [anime]);

  // Close modal on ESC
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') setShowTrailer(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-muted text-sm font-bold tracking-widest uppercase">Loading...</p>
      </div>
    </div>
  );

  if (!anime) return (
    <div className="min-h-screen flex items-center justify-center text-muted">Anime not found.</div>
  );

  const inList = isIn(anime.mal_id);
  const title = anime.title_english || anime.title;
  const bannerImage = anime.images?.webp?.large_image_url || anime.images?.jpg?.large_image_url;
  const trailerYoutubeId = anime.trailer?.youtube_id;
  const ytSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(title + ' trailer')}`;
  const encodedTitle = encodeURIComponent(title);

  return (
    <>
      {/* Trailer Modal */}
      {showTrailer && trailerYoutubeId && (
        <TrailerModal
          youtubeId={trailerYoutubeId}
          title={title}
          onClose={() => setShowTrailer(false)}
        />
      )}

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-20 relative">

        {/* ── Cinematic Banner ── */}
        <div ref={bannerRef} className="relative h-[65vh] md:h-[75vh] w-full overflow-hidden">
          <img src={bannerImage} alt={title}
            className="absolute inset-0 w-full h-full object-cover filter blur-md scale-110 opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent hidden md:block" />

          <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-6 pb-10 flex items-end gap-8 z-10">
            {/* Poster */}
            <motion.div ref={posterRef} initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="hidden md:block w-52 flex-shrink-0 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.6)] border border-white/20 z-20">
              <img src={bannerImage} alt={title} className="w-full h-auto object-cover" />
            </motion.div>

            {/* Info */}
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }} className="flex-1">

              <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-text mb-1 leading-tight">{title}</h1>
              {anime.title_japanese && (
                <p className="text-muted/70 text-sm font-medium mb-4">{anime.title_japanese}</p>
              )}

              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-6">
                {anime.score && (
                  <div className="flex items-center gap-1 bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full font-bold text-sm border border-yellow-500/20">
                    <Star className="w-3 h-3 fill-current" /> {anime.score}
                  </div>
                )}
                {anime.year && <span className="text-xs font-medium text-muted bg-white/5 px-3 py-1 rounded-full">{anime.year}</span>}
                {anime.episodes && <span className="text-xs font-medium text-muted bg-white/5 px-3 py-1 rounded-full">{anime.episodes} Eps</span>}
                {anime.status && <span className="text-xs font-medium text-muted bg-white/5 px-3 py-1 rounded-full">{anime.status}</span>}
              </div>

              {/* ── ACTION BUTTONS ── */}
              <div className="flex flex-wrap gap-3">

                {/* 🎬 See Trailer - always visible */}
                {trailerYoutubeId ? (
                  <button
                    onClick={() => setShowTrailer(true)}
                    className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-full font-bold uppercase tracking-wider flex items-center gap-2 transition-all text-sm shadow-[0_0_25px_rgba(220,38,38,0.5)] hover:scale-105"
                  >
                    <Play className="w-4 h-4 fill-white" /> See Trailer Here
                  </button>
                ) : (
                  <a href={ytSearchUrl} target="_blank" rel="noopener noreferrer"
                    className="px-5 py-2.5 bg-red-600/80 hover:bg-red-600 text-white rounded-full font-bold uppercase tracking-wider flex items-center gap-2 transition-all text-sm">
                    <Play className="w-4 h-4 fill-white" /> Search Trailer
                  </a>
                )}

                {/* 📺 Watch Full Anime dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowPlatforms(!showPlatforms)}
                    className="px-5 py-2.5 bg-[#F47521] hover:bg-[#F47521]/80 text-white rounded-full font-bold uppercase tracking-wider flex items-center gap-2 transition-all text-sm shadow-[0_0_25px_rgba(244,117,33,0.4)] hover:scale-105"
                  >
                    <Tv className="w-4 h-4" /> Watch Full Anime ▾
                  </button>

                  <AnimatePresence>
                    {showPlatforms && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        className="absolute left-0 top-12 z-50 w-52 rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
                        style={{ background: 'rgba(10,2,26,0.97)', backdropFilter: 'blur(20px)' }}
                      >
                        {PLATFORMS.map(p => (
                          <a key={p.name} href={p.url(encodedTitle)} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors border-b border-white/5 last:border-0"
                          >
                            <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
                            <span className="text-text font-semibold text-sm">{p.name}</span>
                            <ExternalLink className="w-3 h-3 text-muted ml-auto" />
                          </a>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* ❤️ Save */}
                <button
                  onClick={() => inList ? remove(anime.mal_id) : add(anime)}
                  className={`px-5 py-2.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-2 transition-all text-sm ${
                    inList ? 'bg-primary/20 text-primary border border-primary/30' : 'glass text-text hover:bg-white/10'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${inList ? 'fill-primary' : ''}`} />
                  {inList ? 'Saved' : 'Save'}
                </button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* ── Content ── */}
        <div className="max-w-7xl mx-auto px-6 mt-12 grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-12">
          <div>
            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-8">
              {anime.genres?.map(g => (
                <Link to={`/search?q=${g.name}`} key={g.mal_id}
                  className="px-4 py-1.5 rounded-full glass text-sm font-medium text-text hover:bg-white/10 hover:text-primary transition-colors">
                  {g.name}
                </Link>
              ))}
            </div>

            {/* Synopsis */}
            <h2 className="text-xl font-black uppercase tracking-tight mb-3">Synopsis</h2>
            <p className="text-muted leading-relaxed whitespace-pre-wrap mb-12 text-sm">{anime.synopsis}</p>

            {/* Embedded Trailer */}
            {trailerYoutubeId && (
              <div className="mb-12">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
                    <Play className="w-5 h-5 text-red-500 fill-red-500" /> Official Trailer
                  </h2>
                  <button onClick={() => setShowTrailer(true)}
                    className="text-xs text-primary font-bold uppercase tracking-widest hover:underline flex items-center gap-1">
                    Open Fullscreen ↗
                  </button>
                </div>
                <div className="rounded-2xl overflow-hidden border border-white/5 shadow-2xl aspect-video relative">
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src={`https://www.youtube.com/embed/${trailerYoutubeId}?cc_load_policy=1&cc_lang_pref=en`}
                    title={`${title} Trailer`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            {/* Where to Watch */}
            <div className="mb-12">
              <h2 className="text-xl font-black uppercase tracking-tight mb-5 flex items-center gap-2">
                <Tv className="w-5 h-5 text-[#F47521]" /> Watch Full Anime On
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {PLATFORMS.map(p => (
                  <a key={p.name} href={p.url(encodedTitle)} target="_blank" rel="noopener noreferrer"
                    className="flex flex-col items-center gap-2 p-4 rounded-xl glass border border-white/5 hover:border-white/20 hover:scale-105 transition-all text-center group">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${p.color}25`, border: `1px solid ${p.color}40` }}>
                      <Tv className="w-5 h-5" style={{ color: p.color }} />
                    </div>
                    <span className="text-xs font-bold text-text">{p.name}</span>
                    <span className="text-[10px] text-muted group-hover:text-primary transition-colors">Search →</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Characters */}
            {chars.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <Users className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-black uppercase tracking-tight">Characters</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  {chars.map(({ character, role }) => (
                    <div key={character.mal_id} className="glass p-3 rounded-xl text-center group">
                      <div className="w-16 h-16 mx-auto rounded-full overflow-hidden mb-3 border-2 border-white/10 group-hover:border-primary transition-colors">
                        <img src={character.images?.jpg?.image_url} alt={character.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                      </div>
                      <p className="text-sm font-bold text-text truncate mb-1">{character.name}</p>
                      <p className="text-xs text-primary font-medium uppercase tracking-wider">{role}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="glass p-5 rounded-2xl">
              <h3 className="font-bold uppercase tracking-wider text-muted text-xs mb-4">Information</h3>
              <div className="space-y-3">
                {[
                  { label: 'Type', value: anime.type },
                  { label: 'Episodes', value: anime.episodes || 'Unknown' },
                  { label: 'Status', value: anime.status },
                  { label: 'Aired', value: anime.aired?.string },
                  { label: 'Studios', value: anime.studios?.map(s => s.name).join(', ') },
                  { label: 'Source', value: anime.source },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-start gap-4 pb-3 border-b border-white/5 last:border-0 last:pb-0">
                    <span className="text-muted text-xs">{item.label}</span>
                    <span className="text-text text-xs font-medium text-right">{item.value || 'N/A'}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}