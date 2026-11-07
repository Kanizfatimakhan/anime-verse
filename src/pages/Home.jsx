import { useEffect, useState } from 'react';
import { getTrending, getTopAnime, getSeasonNow } from '../utils/animeApi';
import Hero from '../components/Hero';
import AnimeSlider from '../components/AnimeSlider';
import AnimeMoodExplorer from '../components/AnimeMoodExplorer';
import AnimeTimeline from '../components/AnimeTimeline';
import StudioShowcase from '../components/StudioShowcase';
import JourneyBoard from '../components/JourneyBoard';
import PersonalizedPicks from '../components/PersonalizedPicks';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, Swords, Orbit, ArrowUpRight, Globe2 } from 'lucide-react';

// Robust fallback data in case the live anime API is unavailable on cold start
const FALLBACK_TRENDING = [
  { mal_id: 52991, title_english: "Frieren: Beyond Journey's End", score: 9.35, type: 'TV', year: 2023, images: { webp: { large_image_url: 'https://cdn.myanimelist.net/images/anime/1015/138075l.jpg' } } },
  { mal_id: 40748, title_english: 'Jujutsu Kaisen Season 2', score: 8.82, type: 'TV', year: 2023, images: { webp: { large_image_url: 'https://cdn.myanimelist.net/images/anime/1171/109222l.jpg' } } },
  { mal_id: 5114, title_english: 'Fullmetal Alchemist: Brotherhood', score: 9.10, type: 'TV', year: 2009, images: { webp: { large_image_url: 'https://cdn.myanimelist.net/images/anime/1223/96541l.jpg' } } },
  { mal_id: 16498, title_english: 'Attack on Titan', score: 8.55, type: 'TV', year: 2013, images: { webp: { large_image_url: 'https://cdn.myanimelist.net/images/anime/10/47347l.jpg' } } },
  { mal_id: 38000, title_english: 'Demon Slayer: Kimetsu no Yaiba', score: 8.49, type: 'TV', year: 2019, images: { webp: { large_image_url: 'https://cdn.myanimelist.net/images/anime/1286/99889l.jpg' } } },
  { mal_id: 9253, title_english: 'Steins;Gate', score: 9.07, type: 'TV', year: 2011, images: { webp: { large_image_url: 'https://cdn.myanimelist.net/images/anime/1935/127974l.jpg' } } },
];

const ORIGIN_COUNTRIES = [
  { code: 'JP', name: 'Japan' },
  { code: 'CN', name: 'China' },
  { code: 'KR', name: 'South Korea' },
  { code: 'TW', name: 'Taiwan' },
];

export default function Home() {
  const [trending, setTrending] = useState([]);
  const [top, setTop] = useState([]);
  const [season, setSeason] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const [t, tp, s] = await Promise.allSettled([
          getTrending(),
          getTopAnime(),
          getSeasonNow(),
        ]);

        if (!isMounted) return;

        const trendData = t.status === 'fulfilled' && t.value?.data ? t.value.data : [];
        const topData = tp.status === 'fulfilled' && tp.value?.data ? tp.value.data : [];
        const seasonData = s.status === 'fulfilled' && s.value?.data ? s.value.data : [];

        setTrending(trendData.length ? trendData : FALLBACK_TRENDING);
        setTop(topData.length ? topData : FALLBACK_TRENDING);
        setSeason(seasonData.length ? seasonData : FALLBACK_TRENDING);
      } catch (e) {
        console.error('Home View Loading Failed:', e);
        if (isMounted) {
          setTrending(FALLBACK_TRENDING);
          setTop(FALLBACK_TRENDING);
          setSeason(FALLBACK_TRENDING);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    load();

    return () => { isMounted = false; };
  }, []);

  const featuredAnime = [...trending, ...season, ...top].filter((anime, index, list) => (
    anime?.mal_id && list.findIndex(item => item?.mal_id === anime.mal_id) === index
  )).slice(0, 8);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-zinc-950 selection:bg-primary selection:text-white"
    >
      <Hero featuredAnime={featuredAnime} />

      {/* Immersive Layout Structure */}
      <div className="relative z-10 mx-auto max-w-7xl space-y-1 px-4 pb-4 sm:space-y-2 sm:px-6 sm:pb-6">
        <section className="my-5 rounded-3xl border border-white/10 bg-gradient-to-br from-violet-500/[0.12] via-white/[0.035] to-cyan-400/[0.07] p-4 sm:my-6 sm:p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl">
              <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-200/80">
                <Globe2 className="h-3.5 w-3.5" /> Explore by origin
              </div>
              <h2 className="text-xl font-black tracking-tight text-white sm:text-2xl">
                Stories from across Asia.
              </h2>
              <p className="mt-1.5 text-sm leading-6 text-white/55">
                Browse anime by its recorded country of origin, or explore the full global catalog.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link to="/search" className="rounded-full border border-white/15 bg-white/10 px-4 py-2.5 text-xs font-semibold text-white transition hover:border-violet-200/40 hover:bg-violet-300/15">
                All origins
              </Link>
              {ORIGIN_COUNTRIES.map(country => (
                <Link
                  key={country.code}
                  to={`/search?country=${country.code}`}
                  className="rounded-full border border-white/10 bg-black/20 px-4 py-2.5 text-xs font-semibold text-white/70 transition hover:border-cyan-200/40 hover:bg-cyan-300/10 hover:text-white"
                >
                  {country.name}
                </Link>
              ))}
            </div>
          </div>
        </section>

        <AnimeSlider title="Today's Trending" items={trending} />
        <JourneyBoard />
        <PersonalizedPicks />
        <AnimeSlider title="This Season" items={season} />

        {/* Bento Mood Matrix */}
        <AnimeMoodExplorer />

        {/* Exclusive Feature Bento Grid */}
        <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 py-4 no-scrollbar sm:gap-4 sm:py-6 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0">
          <Link
            to="/schedule"
            className="group flex w-[84vw] max-w-sm shrink-0 snap-start flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.025] p-5 transition duration-300 hover:-translate-y-1 hover:border-violet-400/35 hover:bg-white/[0.045] sm:p-6 md:w-auto md:max-w-none md:shrink"
          >
            <div>
              <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl border border-violet-300/15 bg-violet-400/10 text-violet-200">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="flex items-center justify-between text-base font-semibold tracking-tight text-white transition-colors group-hover:text-violet-200">
                <span>Weekly Schedule</span>
                <ArrowUpRight className="w-4 h-4 text-muted group-hover:text-primary transition-transform group-hover:translate-x-0.5" />
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted">
                Live Japanese broadcast times and international simulcast drops organized Monday to Sunday.
              </p>
            </div>
            <span className="mt-5 inline-block text-xs font-semibold text-violet-200">
              Check Airing Schedule →
            </span>
          </Link>

          <Link
            to="/compare"
            className="group flex w-[84vw] max-w-sm shrink-0 snap-start flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.025] p-5 transition duration-300 hover:-translate-y-1 hover:border-cyan-300/35 hover:bg-white/[0.045] sm:p-6 md:w-auto md:max-w-none md:shrink"
          >
            <div>
              <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-300/15 bg-cyan-300/10 text-cyan-200">
                <Swords className="w-5 h-5" />
              </div>
              <h3 className="flex items-center justify-between text-base font-semibold tracking-tight text-white transition-colors group-hover:text-cyan-200">
                <span>Versus Face-Off</span>
                <ArrowUpRight className="w-4 h-4 text-muted group-hover:text-accent transition-transform group-hover:translate-x-0.5" />
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted">
                Pit any two anime head-to-head. Compare animation studios, episode pacing, and ratings.
              </p>
            </div>
            <span className="mt-5 inline-block text-xs font-semibold text-cyan-200">
              Open Versus Arena →
            </span>
          </Link>

          <Link
            to="/gallery"
            className="group flex w-[84vw] max-w-sm shrink-0 snap-start flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.025] p-5 transition duration-300 hover:-translate-y-1 hover:border-fuchsia-300/35 hover:bg-white/[0.045] sm:p-6 md:w-auto md:max-w-none md:shrink"
          >
            <div>
              <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl border border-fuchsia-300/15 bg-fuchsia-300/10 text-fuchsia-200">
                <Orbit className="w-5 h-5" />
              </div>
              <h3 className="flex items-center justify-between text-base font-semibold tracking-tight text-white transition-colors group-hover:text-fuchsia-200">
                <span>Anime Gallery</span>
                <ArrowUpRight className="w-4 h-4 text-muted group-hover:text-purple-400 transition-transform group-hover:translate-x-0.5" />
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted">
                Browse a curated collection of anime posters or explore your personal watchlist.
              </p>
            </div>
            <span className="mt-5 inline-block text-xs font-semibold text-fuchsia-200">
              Explore the Gallery →
            </span>
          </Link>
        </div>

        <AnimeSlider title="Top Airing" items={top.slice(0, 15)} />
        <AnimeSlider title="All-Time Popular" items={top.slice(15, 30).length ? top.slice(15, 30) : top} />

        <AnimeTimeline />
        <StudioShowcase />
      </div>
    </motion.div>
  );
}
