import { ArrowRight, BookOpen, CheckCircle2, Play, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWatchlist } from '../hooks/useWatchlist';

export default function JourneyBoard() {
  const { watchlist } = useWatchlist();
  const episodesLogged = watchlist.reduce((total, anime) => total + (Number(anime.episodesWatched) || 0), 0);
  const completed = watchlist.filter(anime => anime.status === 'completed').length;
  const continueAnime = watchlist.find(anime => anime.status === 'watching' && anime.episodesWatched > 0) ||
    watchlist.find(anime => anime.episodesWatched > 0);

  return (
    <section className="relative my-8 overflow-hidden rounded-[1.75rem] border border-violet-200/15 bg-[#100d1c]">
      <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-28 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />
      <div className="relative grid gap-6 p-5 sm:p-7 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-10">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-violet-200/75">
            <Sparkles className="h-3.5 w-3.5" /> Player log
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
            Your journey, <span className="text-violet-200">so far.</span>
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-white/55">
            Every series you save and episode you log becomes part of your anime story.
          </p>

          <div className="mt-5 flex flex-wrap gap-2.5">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white/70">
              <BookOpen className="h-3.5 w-3.5 text-violet-200" />
              <span><strong className="text-white">{watchlist.length}</strong> saved</span>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white/70">
              <Play className="h-3.5 w-3.5 text-cyan-200" />
              <span><strong className="text-white">{episodesLogged}</strong> episodes logged</span>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white/70">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-200" />
              <span><strong className="text-white">{completed}</strong> completed</span>
            </div>
          </div>
        </div>

        {continueAnime ? (
          <Link
            to={`/anime/${continueAnime.mal_id}`}
            className="group flex min-h-20 items-center gap-3 rounded-2xl border border-violet-200/15 bg-violet-300/[0.06] p-3.5 transition hover:border-violet-200/35 hover:bg-violet-300/[0.1] sm:min-w-64 sm:p-4"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-300 text-zinc-950">
              <Play className="h-4 w-4 fill-current" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-violet-100/60">Pick up where you left off</span>
              <span className="mt-1 block truncate text-sm font-semibold text-white">{continueAnime.title_english || continueAnime.title}</span>
              <span className="mt-0.5 block text-xs text-white/50">Episode {continueAnime.episodesWatched}</span>
            </span>
            <ArrowRight className="h-4 w-4 shrink-0 text-white/45 transition group-hover:translate-x-1 group-hover:text-white" />
          </Link>
        ) : (
          <Link
            to={watchlist.length ? '/watchlist' : '/search'}
            className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-violet-200/20 bg-violet-300/10 px-5 text-sm font-semibold text-violet-100 transition hover:border-violet-200/40 hover:bg-violet-300/15"
          >
            {watchlist.length ? 'Open your watchlist' : 'Save your first anime'}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        )}
      </div>
    </section>
  );
}
