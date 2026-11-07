import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import AnimeSlider from './AnimeSlider';
import { useWatchlist } from '../hooks/useWatchlist';
import { searchAnime } from '../utils/animeApi';

export default function PersonalizedPicks() {
  const { watchlist } = useWatchlist();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const favoriteGenre = useMemo(() => {
    const genreCounts = new Map();
    watchlist.forEach(anime => {
      const uniqueGenres = new Set((anime.genres || []).map(genre => genre.name).filter(Boolean));
      uniqueGenres.forEach(name => genreCounts.set(name, (genreCounts.get(name) || 0) + 1));
    });

    return [...genreCounts.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0]?.[0] || '';
  }, [watchlist]);

  useEffect(() => {
    let active = true;
    if (!favoriteGenre) {
      setRecommendations([]);
      setError(false);
      return undefined;
    }

    setLoading(true);
    setError(false);
    searchAnime('', { genres: favoriteGenre, order_by: 'popularity', sort: 'desc', limit: 24 })
      .then(result => {
        if (!active) return;
        const savedIds = new Set(watchlist.map(anime => anime.mal_id));
        setRecommendations((result?.data || [])
          .filter(anime => !savedIds.has(anime.mal_id))
          .slice(0, 12));
      })
      .catch(cause => {
        console.error('Personalized anime recommendations failed:', cause);
        if (active) {
          setRecommendations([]);
          setError(true);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, [favoriteGenre, watchlist]);

  if (!watchlist.length) {
    return (
      <section className="my-4 rounded-3xl border border-violet-200/10 bg-gradient-to-br from-violet-500/[0.08] to-white/[0.02] p-5 sm:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-2 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-violet-200/75">
              <Sparkles className="h-3.5 w-3.5" /> Made for your taste
            </p>
            <h2 className="text-xl font-black text-white sm:text-2xl">Your anime taste, your picks.</h2>
            <p className="mt-1 text-sm text-white/55">Save a few anime to get recommendations based on the genres you enjoy.</p>
          </div>
          <Link to="/search" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-violet-300 px-5 py-3 text-xs font-bold text-zinc-950 transition hover:bg-violet-200">
            Find anime <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <section aria-live="polite" className="my-4 rounded-3xl border border-white/10 bg-white/[0.02] p-5 sm:p-7">
        <p className="text-xs font-bold uppercase tracking-wider text-violet-200/75">Finding your next favorite…</p>
        <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-6">
          {[...Array(6)].map((_, index) => <div key={index} className="aspect-[2/3] animate-pulse rounded-xl bg-white/[0.06]" />)}
        </div>
      </section>
    );
  }

  if (error || !recommendations.length) {
    return (
      <section aria-live="polite" className="my-4 rounded-3xl border border-white/10 bg-white/[0.02] p-5 sm:p-7">
        <p className="text-xs font-bold uppercase tracking-wider text-violet-200/75">Made for your taste</p>
        <p className="mt-2 text-sm text-white/60">
          {error ? 'Recommendations could not load right now.' : `You have saved all the ${favoriteGenre} picks we found.`}
        </p>
        <Link to="/search" className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-violet-200 hover:text-white">
          Explore more anime <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </section>
    );
  }

  return <AnimeSlider title={`Because you like ${favoriteGenre}`} items={recommendations} />;
}
