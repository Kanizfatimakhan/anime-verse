import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getAnimeById, getAnimeCharacters, getAnimeRecommendations, getAnimeMusicVideos } from '../utils/animeApi';
import { useWatchlist } from '../hooks/useWatchlist';
import { useToast } from '../context/ToastContext';
import AnimeCard from '../components/AnimeCard';
import {
  Heart,
  Star,
  Users,
  ExternalLink,
  X,
  Play,
  Tv,
  Share2,
  Check,
  TrendingUp,
  Award,
  Sparkles,
  ChevronDown,
  Music,
  Film,
  CheckCircle2,
} from 'lucide-react';
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
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.85, opacity: 0 }}
          transition={{ type: 'spring', damping: 22 }}
          className="relative w-full max-w-4xl"
          onClick={e => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute -top-10 right-0 text-white/70 hover:text-white flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest"
          >
            <X className="w-4 h-4" /> Close
          </button>
          <div className="aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black">
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

export default function AnimeDetail() {
  const { id } = useParams();
  const [anime, setAnime] = useState(null);
  const [chars, setChars] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);
  const [showPlatforms, setShowPlatforms] = useState(false);
  const [showStatusPicker, setShowStatusPicker] = useState(false);
  const [activeMediaTab, setActiveMediaTab] = useState('trailer'); // 'trailer' | 'ost' | 'watch'
  const [musicVideos, setMusicVideos] = useState([]);
  const [musicLoading, setMusicLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const {
    add,
    remove,
    isIn,
    getStatus,
    updateStatus,
    getItem,
    updateEpisodeProgress,
    incrementEpisode,
  } = useWatchlist();
  const { showToast } = useToast();
  const posterRef = useRef(null);
  const bannerRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    setAnime(null);
    setChars([]);
    setRecommendations([]);
    setShowTrailer(false);
    setShowPlatforms(false);
    setShowStatusPicker(false);

    let isMounted = true;
    const load = async () => {
      try {
        const [a, c, r] = await Promise.allSettled([
          getAnimeById(id),
          getAnimeCharacters(id),
          getAnimeRecommendations(id),
        ]);

        if (!isMounted) return;

        if (a.status === 'fulfilled' && a.value?.data) {
          setAnime(a.value.data);
          setLoading(false); // Render immediately once main anime metadata arrives!
        }
        if (c.status === 'fulfilled' && Array.isArray(c.value?.data)) {
          setChars(c.value.data
            .filter(item => item?.character && item.character.mal_id != null)
            .slice(0, 10));
        }
        if (r.status === 'fulfilled' && Array.isArray(r.value?.data)) {
          setRecommendations(r.value.data
            .map(item => item?.entry)
            .filter(entry => entry && entry.mal_id != null)
            .slice(0, 6));
        }
      } catch (e) {
        console.error('Anime detail load failed:', e);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    load();

    return () => { isMounted = false; };
  }, [id]);

  useEffect(() => {
    if (!anime || !posterRef.current || !bannerRef.current) return;
    let ctx = gsap.context(() => {
      gsap.to(posterRef.current, {
        y: 60,
        ease: 'none',
        scrollTrigger: {
          trigger: bannerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    });
    return () => ctx.revert();
  }, [anime]);

  useEffect(() => {
    if (activeMediaTab !== 'ost' || !anime?.mal_id) return undefined;

    let isMounted = true;
    setMusicLoading(true);
    getAnimeMusicVideos(anime.mal_id)
      .then(response => {
        if (isMounted) {
          const videos = Array.isArray(response?.data) ? response.data : [];
          setMusicVideos(videos.filter(item => item.video?.embed_url));
        }
      })
      .catch(error => {
        console.error('Failed to load anime music videos:', error);
        if (isMounted) setMusicVideos([]);
      })
      .finally(() => {
        if (isMounted) setMusicLoading(false);
      });

    return () => { isMounted = false; };
  }, [activeMediaTab, anime?.mal_id]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    showToast('Anime link copied to clipboard! 📋', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-3 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted text-xs font-bold tracking-widest uppercase">Summoning Anime Details...</p>
        </div>
      </div>
    );
  }

  if (!anime) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
        <p className="text-4xl mb-4">⛩️</p>
        <h2 className="text-2xl font-black text-text mb-2">Anime Not Found</h2>
        <p className="text-muted text-sm mb-6 max-w-sm">The requested anime could not be found or the API is experiencing high traffic.</p>
        <Link to="/search" className="px-6 py-2.5 bg-primary text-white rounded-full text-xs font-bold uppercase tracking-wider">
          Browse Search
        </Link>
      </div>
    );
  }

  const inList = isIn(anime.mal_id);
  const currentStatus = getStatus(anime.mal_id);
  const watchItem = inList ? getItem(anime.mal_id) : null;
  const watchedEps = watchItem?.episodesWatched || 0;
  const totalEps = anime.episodes || 0;

  const title = anime.title_english || anime.title;
  const bannerImage = anime.images?.webp?.large_image_url || anime.images?.jpg?.large_image_url;
  const trailerYoutubeId = anime.trailer?.youtube_id;
  const ytSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(title + ' trailer')}`;
  const encodedTitle = encodeURIComponent(title);

  return (
    <>
      {/* Fullscreen Trailer Modal */}
      {showTrailer && trailerYoutubeId && (
        <TrailerModal
          youtubeId={trailerYoutubeId}
          title={title}
          onClose={() => setShowTrailer(false)}
        />
      )}

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-24 relative">
        {/* ── Cinematic Hero Banner ── */}
        <div ref={bannerRef} className="relative h-[65vh] md:h-[75vh] w-full overflow-hidden">
          <img
            src={bannerImage}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover filter blur-xl scale-110 opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-transparent to-transparent hidden md:block" />

          <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-6 pb-10 flex items-end gap-8 z-10">
            {/* 3D Poster */}
            <motion.div
              ref={posterRef}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="hidden md:block w-56 flex-shrink-0 rounded-2xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.8)] border border-white/20 z-20 aspect-[2/3]"
            >
              <img src={bannerImage} alt={title} className="w-full h-full object-cover" />
            </motion.div>

            {/* Title & Metadata */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="flex-1 min-w-0"
            >
              <h1 className="text-3xl md:text-5xl font-black tracking-tight text-text mb-1 leading-tight">
                {title}
              </h1>
              {anime.title_japanese && (
                <p className="text-muted/70 text-sm font-medium mb-4">{anime.title_japanese}</p>
              )}

              {/* Stat Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-6 text-xs font-bold uppercase tracking-wider">
                {anime.score && (
                  <div className="flex items-center gap-1 bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full border border-yellow-500/30">
                    <Star className="w-3.5 h-3.5 fill-current" /> {anime.score}
                  </div>
                )}
                {anime.rank && (
                  <span className="flex items-center gap-1 bg-primary/20 text-primary px-3 py-1 rounded-full border border-primary/30">
                    <Award className="w-3 h-3" /> Ranked #{anime.rank}
                  </span>
                )}
                {anime.popularity && (
                  <span className="flex items-center gap-1 bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full border border-blue-500/30">
                    <TrendingUp className="w-3 h-3" /> Pop #{anime.popularity}
                  </span>
                )}
                {anime.year && <span className="bg-white/5 text-muted px-3 py-1 rounded-full">{anime.year}</span>}
                {anime.episodes && <span className="bg-white/5 text-muted px-3 py-1 rounded-full">{anime.episodes} Eps</span>}
                {anime.status && <span className="bg-white/5 text-muted px-3 py-1 rounded-full">{anime.status}</span>}
              </div>

              {/* Action Buttons Bar */}
              <div className="flex flex-wrap items-center gap-3">
                {/* 🎬 Trailer Button */}
                {trailerYoutubeId ? (
                  <button
                    onClick={() => setShowTrailer(true)}
                    className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-full font-bold uppercase tracking-wider flex items-center gap-2 transition-all text-xs shadow-[0_0_25px_rgba(220,38,38,0.4)] hover:scale-105"
                  >
                    <Play className="w-4 h-4 fill-white" /> Watch Trailer
                  </button>
                ) : (
                  <a
                    href={ytSearchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 bg-red-600/80 hover:bg-red-600 text-white rounded-full font-bold uppercase tracking-wider flex items-center gap-2 transition-all text-xs"
                  >
                    <Play className="w-4 h-4 fill-white" /> Search Trailer
                  </a>
                )}

                {/* 📺 Stream Platforms Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowPlatforms(!showPlatforms)}
                    className="px-5 py-2.5 bg-[#F47521] hover:bg-[#F47521]/90 text-white rounded-full font-bold uppercase tracking-wider flex items-center gap-2 transition-all text-xs shadow-[0_0_25px_rgba(244,117,33,0.35)] hover:scale-105"
                  >
                    <Tv className="w-4 h-4" /> Watch On ▾
                  </button>

                  <AnimatePresence>
                    {showPlatforms && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        className="absolute left-0 top-12 z-50 w-52 rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-zinc-950/95 backdrop-blur-2xl"
                      >
                        {PLATFORMS.map(p => (
                          <a
                            key={p.name}
                            href={p.url(encodedTitle)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors border-b border-white/5 last:border-0"
                          >
                            <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
                            <span className="text-text font-semibold text-xs">{p.name}</span>
                            <ExternalLink className="w-3.5 h-3.5 text-muted ml-auto" />
                          </a>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* ❤️ Save to Watchlist / Status Picker */}
                <div className="relative">
                  <button
                    onClick={() => {
                      if (!inList) {
                        add(anime, 'plan_to_watch');
                        showToast(`Added "${title}" to your watchlist!`, 'success');
                      } else {
                        setShowStatusPicker(!showStatusPicker);
                      }
                    }}
                    className={`px-5 py-2.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-2 transition-all text-xs ${
                      inList
                        ? 'bg-primary/20 text-primary border border-primary/40 shadow-lg shadow-primary/20'
                        : 'glass text-text hover:bg-white/10'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${inList ? 'fill-primary' : ''}`} />
                    <span>{inList ? (currentStatus ? currentStatus.replace('_', ' ') : 'Saved') : 'Add to Watchlist'}</span>
                    {inList && <ChevronDown className="w-3.5 h-3.5 ml-0.5" />}
                  </button>

                  <AnimatePresence>
                    {showStatusPicker && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        className="absolute left-0 top-12 z-50 w-44 rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-zinc-950/95 backdrop-blur-2xl p-1"
                      >
                        {[
                          { id: 'plan_to_watch', label: 'Plan to Watch' },
                          { id: 'watching', label: 'Watching' },
                          { id: 'completed', label: 'Completed' },
                          { id: 'favorites', label: 'Favorites' },
                        ].map(st => (
                          <button
                            key={st.id}
                            onClick={() => {
                              updateStatus(anime.mal_id, st.id);
                              setShowStatusPicker(false);
                              showToast(`Updated status to: ${st.label}`, 'info');
                            }}
                            className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center justify-between ${
                              currentStatus === st.id ? 'bg-primary/20 text-primary' : 'text-text hover:bg-white/5'
                            }`}
                          >
                            <span>{st.label}</span>
                            {currentStatus === st.id && <Check className="w-3.5 h-3.5" />}
                          </button>
                        ))}
                        <div className="border-t border-white/5 my-1" />
                        <button
                          onClick={() => {
                            remove(anime.mal_id);
                            setShowStatusPicker(false);
                            showToast(`Removed from Watchlist`, 'info');
                          }}
                          className="w-full text-left px-3.5 py-2 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-500/10"
                        >
                          Remove from List
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Share Button */}
                <button
                  onClick={handleShare}
                  className="p-2.5 rounded-full glass hover:bg-white/10 text-muted hover:text-text transition-colors"
                  title="Copy link"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                </button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* ── Content Layout ── */}
        <div className="page-container mt-12 grid grid-cols-1 gap-8 pb-8 sm:gap-12 lg:grid-cols-[1fr_300px]">
          <div>
            {/* Genre Pills */}
            <div className="flex flex-wrap gap-2 mb-8">
              {anime.genres?.map(g => (
                <Link
                  to={`/search?genre=${g.mal_id}`}
                  key={g.mal_id}
                  className="px-4 py-1.5 rounded-full glass text-xs font-bold uppercase tracking-wider text-text hover:bg-primary/20 hover:text-primary border border-white/5 transition-all"
                >
                  {g.name}
                </Link>
              ))}
            </div>

            {/* In-App Interactive Media Center (Trailer / OST / Clips) */}
            <div className="mb-12 glass p-5 rounded-3xl border border-white/10 bg-zinc-900/40">
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <Film className="w-5 h-5 text-accent" />
                  <h2 className="text-lg font-black uppercase tracking-tight text-white">
                    Interactive Media Hub
                  </h2>
                </div>

                {/* Media Switcher Tabs */}
                <div className="flex items-center gap-1 bg-black/40 p-1 rounded-full border border-white/5">
                  <button
                    onClick={() => setActiveMediaTab('trailer')}
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                      activeMediaTab === 'trailer'
                        ? 'bg-primary text-white shadow-md'
                        : 'text-muted hover:text-white'
                    }`}
                  >
                    Trailer
                  </button>
                  <button
                    onClick={() => setActiveMediaTab('ost')}
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1 ${
                      activeMediaTab === 'ost'
                        ? 'bg-accent text-zinc-950 font-black shadow-md'
                        : 'text-muted hover:text-white'
                    }`}
                  >
                    <Music className="w-3 h-3" /> OST Themes
                  </button>
                </div>
              </div>

              {/* Tab 1: Video Trailer Player */}
              {activeMediaTab === 'trailer' && (
                <div>
                  {trailerYoutubeId ? (
                    <div className="rounded-2xl overflow-hidden border border-white/5 shadow-2xl aspect-video relative bg-black">
                      <iframe
                        className="absolute inset-0 w-full h-full"
                        src={`https://www.youtube.com/embed/${trailerYoutubeId}?cc_load_policy=1&cc_lang_pref=en`}
                        title={`${title} Official Trailer`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <div className="py-12 text-center text-muted">
                      <p className="text-sm">Trailer unavailable directly. Search YouTube below:</p>
                      <a
                        href={ytSearchUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 inline-flex items-center gap-2 px-5 py-2 bg-red-600 text-white rounded-full text-xs font-bold uppercase tracking-wider"
                      >
                        <Play className="w-3.5 h-3.5 fill-white" /> Search on YouTube
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 2: Soundtrack & Themes */}
              {activeMediaTab === 'ost' && (
                <div className="space-y-4 py-2">
                  <p className="text-xs text-muted">
                    Press Play on an available track to hear it here. Your browser will not autoplay music.
                  </p>
                  {musicLoading ? (
                    <p className="py-8 text-center text-sm text-muted">Loading available tracks…</p>
                  ) : musicVideos.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {musicVideos.slice(0, 4).map((item, index) => (
                        <div key={item.video.youtube_id || item.video.embed_url} className="rounded-2xl overflow-hidden border border-white/10 bg-zinc-950">
                          <div className="aspect-video">
                            <iframe
                              className="w-full h-full"
                              src={item.video.embed_url}
                              title={`${title} music track ${index + 1}`}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                              referrerPolicy="strict-origin-when-cross-origin"
                              allowFullScreen
                            />
                          </div>
                          <p className="p-3 text-xs font-semibold text-white line-clamp-2">
                            {item.title || `${title} music track ${index + 1}`}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { label: 'Opening Theme (OP)', query: 'opening song ost', color: 'text-accent bg-accent/10 border-accent/20' },
                        { label: 'Ending Theme (ED)', query: 'ending song ost', color: 'text-primary bg-primary/10 border-primary/20' },
                      ].map(({ label, query, color }) => (
                        <div key={label} className="p-4 rounded-2xl bg-zinc-950 border border-white/5 flex flex-col justify-between">
                          <div>
                            <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${color}`}>
                              {label}
                            </span>
                            <h4 className="text-sm font-bold text-white mt-2">
                              {label.startsWith('Opening')
                                ? anime.ost?.opening || `${title} Official Opening Theme`
                                : anime.ost?.ending || `${title} Official Ending Theme`}
                            </h4>
                          </div>
                          <a
                            href={`https://www.youtube.com/results?search_query=${encodeURIComponent(`${title} ${query}`)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" /> Find track on YouTube ↗
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Synopsis */}
            <div className="mb-12">
              <h2 className="text-xl font-black uppercase tracking-tight mb-3 text-text">Synopsis</h2>
              <p className="text-muted leading-relaxed whitespace-pre-wrap text-sm sm:text-base">
                {anime.synopsis || 'No synopsis available for this title.'}
              </p>
            </div>

            {/* Characters & Voice Cast */}
            {chars.length > 0 && (
              <div className="mb-12">
                <div className="flex items-center gap-2 mb-6">
                  <Users className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-black uppercase tracking-tight">Main Characters</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  {chars.map(({ character, role }) => (
                    <div key={character?.mal_id} className="glass p-3 rounded-2xl text-center group border border-white/5 hover:border-primary/40 transition-all">
                      <div className="w-16 h-16 mx-auto rounded-full overflow-hidden mb-3 border-2 border-white/10 group-hover:border-primary transition-colors">
                        <img
                          src={character?.images?.jpg?.image_url || character?.images?.webp?.image_url}
                          alt={character?.name || 'Anime character'}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                        />
                      </div>
                      <p className="text-xs font-bold text-text truncate mb-1">{character?.name || 'Unknown character'}</p>
                      <p className="text-[10px] text-primary font-semibold uppercase tracking-wider">{role}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations / You May Also Like */}
            {recommendations.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <Sparkles className="w-5 h-5 text-accent" />
                  <h2 className="text-xl font-black uppercase tracking-tight">You Might Also Like</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                  {recommendations.filter(Boolean).map((rec, i) => (
                    <AnimeCard key={`${rec.mal_id}-${i}`} anime={rec} index={i} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Info Card + Episode Tracker Widget */}
          <div className="space-y-6">
            {/* Episode Tracker Box */}
            <div className="glass p-5 rounded-2xl border border-white/10 bg-zinc-900/60">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold uppercase tracking-wider text-white text-xs flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Episode Tracker
                </h3>
                {inList && (
                  <span className="text-[10px] font-bold uppercase text-primary">
                    {currentStatus?.replace('_', ' ')}
                  </span>
                )}
              </div>

              {inList ? (
                <div>
                  <div className="flex items-center justify-between text-xs text-muted mb-2 font-semibold">
                    <span>Progress:</span>
                    <span className="text-white font-bold">
                      {watchedEps} / {totalEps || '∞'} Episodes
                    </span>
                  </div>

                  {totalEps > 0 && (
                    <div className="w-full h-2 bg-black/60 rounded-full overflow-hidden mb-4">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300"
                        style={{ width: `${Math.min(100, (watchedEps / totalEps) * 100)}%` }}
                      />
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        incrementEpisode(anime.mal_id);
                        showToast(`Marked Episode ${watchedEps + 1} watched! 🍿`, 'success');
                      }}
                      className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
                    >
                      +1 Episode Watched
                    </button>
                    {watchedEps > 0 && (
                      <button
                        onClick={() => updateEpisodeProgress(anime.mal_id, watchedEps - 1)}
                        className="px-3 py-2 bg-white/5 hover:bg-white/10 text-muted rounded-xl text-xs font-bold transition-all"
                        title="Step backward"
                      >
                        -1
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-2">
                  <p className="text-xs text-muted mb-3">
                    Add this anime to your library to track your episode progress.
                  </p>
                  <button
                    onClick={() => {
                      add(anime, 'watching');
                      showToast(`Added to currently watching!`, 'success');
                    }}
                    className="w-full py-2 bg-primary/20 hover:bg-primary border border-primary/40 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
                  >
                    Start Tracking
                  </button>
                </div>
              )}
            </div>

            {/* Metadata Card */}
            <div className="glass p-5 rounded-2xl border border-white/5 bg-zinc-900/40">
              <h3 className="font-bold uppercase tracking-wider text-muted text-xs mb-4">Metadata</h3>
              <div className="space-y-3">
                {[
                  { label: 'Type', value: anime.type },
                  { label: 'Episodes', value: anime.episodes || 'Unknown' },
                  { label: 'Duration', value: anime.duration },
                  { label: 'Status', value: anime.status },
                  { label: 'Aired', value: anime.aired?.string },
                  { label: 'Premiered', value: anime.season && anime.year ? `${anime.season} ${anime.year}` : null },
                  { label: 'Studios', value: anime.studios?.map(s => s.name).join(', ') },
                  { label: 'Source', value: anime.source },
                  { label: 'Rating', value: anime.rating },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-start gap-4 pb-2.5 border-b border-white/5 last:border-0 last:pb-0">
                    <span className="text-muted text-xs font-medium">{item.label}</span>
                    <span className="text-text text-xs font-semibold text-right">{item.value || 'N/A'}</span>
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
