import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, CalendarDays, Search, Shuffle, Sparkles, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const HERO_ART = '/steel-ball-run-2560x1440-25586.jpg';

export default function Hero({ featuredAnime = [] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [imageFailed, setImageFailed] = useState(false);
  const activeAnime = featuredAnime[activeIndex % Math.max(featuredAnime.length, 1)];
  const title = activeAnime?.title_english || activeAnime?.title || 'Your next favorite';
  const poster = activeAnime?.images?.webp?.large_image_url
    || activeAnime?.images?.jpg?.large_image_url
    || activeAnime?.images?.webp?.image_url;

  useEffect(() => setImageFailed(false), [activeAnime?.mal_id]);

  const moveSpotlight = direction => {
    if (!featuredAnime.length) return;
    setActiveIndex(index => (index + direction + featuredAnime.length) % featuredAnime.length);
  };

  const surpriseMe = () => {
    if (featuredAnime.length < 2) {
      moveSpotlight(1);
      return;
    }
    const offset = 1 + Math.floor(Math.random() * (featuredAnime.length - 1));
    moveSpotlight(offset);
  };

  const handleSpotlightKeyDown = event => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      moveSpotlight(-1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      moveSpotlight(1);
    }
  };

  return (
    <section
      className="relative isolate min-h-[min(90svh,820px)] overflow-hidden bg-[#08070e] text-white sm:min-h-[min(88vh,860px)]"
      onKeyDown={handleSpotlightKeyDown}
      aria-label="Anime discovery spotlight"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-30 bg-cover bg-[center_38%] opacity-45 sm:opacity-55"
        style={{ backgroundImage: `url("${HERO_ART}")` }}
      />
      <div className="absolute inset-0 -z-20 bg-gradient-to-r from-[#08070e] via-[#08070e]/90 to-[#08070e]/35" />
      <div className="absolute inset-0 -z-20 bg-gradient-to-t from-[#08070e] via-transparent to-[#08070e]/35" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_68%_48%,rgba(124,58,237,0.22),transparent_44%)]" />

      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -right-36 top-24 -z-10 h-[28rem] w-[28rem] rounded-full border border-violet-200/10 sm:right-[6%] sm:top-28 sm:h-[36rem] sm:w-[36rem]"
        animate={{ rotate: 360 }}
        transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}
      >
        <span className="absolute left-[17%] top-[15%] h-2 w-2 rounded-full bg-cyan-200 shadow-[0_0_20px_rgba(103,232,249,0.9)]" />
        <span className="absolute bottom-[18%] right-[9%] h-1.5 w-1.5 rounded-full bg-fuchsia-200 shadow-[0_0_18px_rgba(232,121,249,0.9)]" />
      </motion.div>
      <div aria-hidden="true" className="pointer-events-none absolute -right-24 top-40 -z-10 h-[24rem] w-[24rem] rounded-full border border-violet-200/[0.07] sm:right-[10%] sm:top-44 sm:h-[30rem] sm:w-[30rem]" />

      <div className="mx-auto grid min-h-[inherit] max-w-7xl items-center gap-10 px-5 pb-16 pt-24 sm:px-8 sm:pb-20 sm:pt-28 lg:grid-cols-[1fr_0.8fr] lg:gap-16 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-200/20 bg-black/35 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-violet-100/85 backdrop-blur-md sm:text-xs">
            <Sparkles className="h-3.5 w-3.5 text-cyan-200" />
            AnimeVerse · Your anime discovery
          </div>

          <h1 className="max-w-3xl text-[clamp(2.7rem,8vw,5.8rem)] font-black uppercase leading-[0.91] tracking-[-0.06em] text-white">
            Find your
            <br />
            <span className="bg-gradient-to-r from-violet-300 via-fuchsia-200 to-cyan-200 bg-clip-text text-transparent">
              next favorite
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-sm leading-7 text-white/70 sm:text-base sm:leading-8">
            Find a story that fits your mood, explore what everyone is watching, and keep track of what you love.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/search"
              className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-violet-300 px-6 text-sm font-bold text-zinc-950 shadow-[0_8px_32px_rgba(139,92,246,0.3)] transition hover:-translate-y-0.5 hover:bg-violet-200 hover:shadow-[0_10px_36px_rgba(139,92,246,0.45)]"
            >
              Explore anime
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="#mood-explorer"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/20 bg-black/25 px-6 text-sm font-semibold text-white/90 backdrop-blur transition hover:border-white/40 hover:bg-white/10"
            >
              Choose a mood
              <ArrowDown className="h-4 w-4" />
            </a>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 text-xs text-white/50">
            <Link to="/schedule" className="inline-flex items-center gap-2 transition hover:text-cyan-100">
              <CalendarDays className="h-4 w-4 text-cyan-200" /> See what airs next
            </Link>
            <Link to="/watchlist" className="inline-flex items-center gap-2 transition hover:text-violet-100">
              <Sparkles className="h-4 w-4 text-violet-200" /> Continue your watchlist
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 mx-auto w-full max-w-[25rem] lg:ml-auto"
        >
          <div className="absolute -inset-5 rounded-[2rem] bg-violet-500/15 blur-3xl" />
          <div className="relative overflow-hidden rounded-[1.7rem] border border-white/15 bg-[#100d1c] shadow-[0_28px_90px_rgba(0,0,0,0.5)]">
            <div className="absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-transparent via-violet-200/70 to-transparent" />
            <div className="absolute left-4 top-4 z-20 flex items-center gap-2 rounded-full border border-white/15 bg-black/45 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.16em] text-white/80 backdrop-blur sm:left-5 sm:top-5">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-200 shadow-[0_0_9px_rgba(103,232,249,.9)]" />
              Spotlight · {featuredAnime.length ? `${activeIndex + 1} / ${featuredAnime.length}` : 'Anime pick'}
            </div>

            <Link
              to={activeAnime ? `/anime/${activeAnime.mal_id}` : '/search'}
              aria-label={`View ${title}`}
              className="group relative block aspect-[4/5] overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-violet-200"
            >
              {activeAnime && poster && !imageFailed ? (
                <motion.img
                  key={activeAnime.mal_id}
                  src={poster}
                  alt={`${title} poster`}
                  onError={() => setImageFailed(true)}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.35 }}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              ) : (
                <div aria-hidden="true" className="absolute inset-0 overflow-hidden bg-[radial-gradient(ellipse_at_55%_32%,rgba(196,181,253,0.28),transparent_38%),linear-gradient(145deg,#241748,#100d1c_55%,#08131a)]">
                  <div className="absolute left-[14%] top-[18%] h-56 w-56 rounded-full border border-violet-100/15 shadow-[0_0_90px_rgba(167,139,250,0.18)]" />
                  <div className="absolute right-[10%] top-[32%] h-36 w-36 rounded-full border border-cyan-100/15" />
                  <Sparkles className="absolute left-1/2 top-[38%] h-16 w-16 -translate-x-1/2 -translate-y-1/2 text-violet-100/65" />
                  <span className="absolute left-1/2 top-[60%] -translate-x-1/2 font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-white/35">AnimeVerse pick</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#09070f] via-[#09070f]/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                <div className="mb-3 flex items-center gap-2">
                  {activeAnime?.score && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-amber-200/20 bg-black/45 px-2.5 py-1 text-xs font-bold text-amber-100 backdrop-blur">
                      <Star className="h-3 w-3 fill-current" /> {activeAnime.score}
                    </span>
                  )}
                  {activeAnime?.type && (
                    <span className="rounded-full border border-white/15 bg-black/40 px-2.5 py-1 text-[10px] font-semibold text-white/75 backdrop-blur">
                      {activeAnime.type}
                    </span>
                  )}
                  {activeAnime?.year && <span className="text-xs text-white/60">{activeAnime.year}</span>}
                </div>
                <h2 aria-live="polite" className="line-clamp-2 text-2xl font-black leading-tight tracking-tight text-white sm:text-3xl">{title}</h2>
                <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-violet-100/85 transition group-hover:text-white">
                  Meet this anime <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </p>
              </div>
            </Link>

            <div className="flex items-center justify-between border-t border-white/10 bg-[#100d1c] p-3.5 sm:p-4">
              <p className="pl-1 text-[10px] text-white/40">Use ← → to browse picks</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => moveSpotlight(-1)}
                  aria-label="Previous spotlight anime"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/70 transition hover:border-white/30 hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-200"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => moveSpotlight(1)}
                  aria-label="Next spotlight anime"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/70 transition hover:border-white/30 hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-200"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={surpriseMe}
                  aria-label="Surprise me with another anime"
                  className="ml-1 inline-flex h-9 items-center gap-2 rounded-full bg-violet-200 px-3 text-xs font-bold text-[#171023] transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-200"
                >
                  <Shuffle className="h-3.5 w-3.5" /> Surprise me
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
