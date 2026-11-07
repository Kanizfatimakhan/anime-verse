import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark, Images, Star } from 'lucide-react';
import { useWatchlist } from '../hooks/useWatchlist';
import { SEED_ANIME_LIST } from '../data/animeSeedData';

const FEATURED_IDS = [52991, 5114, 40748, 16498, 38000, 9253, 1535, 32281];
const FEATURED_ANIME = FEATURED_IDS
  .map(id => SEED_ANIME_LIST.find(anime => anime.mal_id === id))
  .filter(Boolean);

function AnimePoster({ anime, onSelect }) {
  const [imageFailed, setImageFailed] = useState(false);
  const title = anime.title_english || anime.title;
  const image = anime.images?.webp?.large_image_url ||
    anime.images?.jpg?.large_image_url ||
    anime.images?.webp?.image_url ||
    anime.images?.jpg?.image_url;

  return (
    <button
      type="button"
      onClick={() => onSelect(anime.mal_id)}
      className="group relative w-full overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 text-left transition duration-300 hover:-translate-y-1 hover:border-primary/60 hover:shadow-[0_16px_50px_rgba(124,58,237,0.2)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
    >
      <div className="relative aspect-[2/3] overflow-hidden bg-gradient-to-br from-primary/30 via-zinc-900 to-accent/20">
        {!imageFailed && image ? (
          <img
            src={image}
            alt={`${title} poster`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center p-5 text-center">
            <span className="text-xl font-black uppercase tracking-wide text-white/85">{title}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />
        {anime.score && (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/70 px-2.5 py-1 text-xs font-bold text-amber-300 backdrop-blur">
            <Star className="h-3 w-3 fill-current" /> {anime.score}
          </span>
        )}
        <div className="absolute inset-x-0 bottom-0 p-4">
          <p className="line-clamp-2 text-sm font-bold text-white sm:text-base">{title}</p>
          <p className="mt-1 text-xs text-white/65">{[anime.type, anime.year].filter(Boolean).join(' · ')}</p>
        </div>
      </div>
    </button>
  );
}

export default function Gallery() {
  const { watchlist } = useWatchlist();
  const [showWatchlist, setShowWatchlist] = useState(false);
  const navigate = useNavigate();
  const exhibits = useMemo(
    () => showWatchlist && watchlist.length ? watchlist : FEATURED_ANIME,
    [showWatchlist, watchlist]
  );
  const showingWatchlist = showWatchlist && watchlist.length > 0;

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-[#070611] px-4 pb-16 pt-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
              <Images className="h-3.5 w-3.5" /> Anime Collection
            </div>
            <h1 className="text-3xl font-black uppercase tracking-tight sm:text-4xl">
              {showingWatchlist ? 'My Anime Gallery' : 'Featured Anime'}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-white/60">
              {showingWatchlist
                ? 'Your saved anime, collected in one place.'
                : 'Browse fan-favorite anime. Select a poster to explore its details.'}
            </p>
          </div>
          {watchlist.length > 0 && (
            <button
              type="button"
              onClick={() => setShowWatchlist(value => !value)}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-bold uppercase tracking-wide transition hover:border-primary/50 hover:bg-primary/10"
            >
              <Bookmark className="h-4 w-4" />
              {showingWatchlist ? 'View Featured Anime' : `My Watchlist (${watchlist.length})`}
            </button>
          )}
        </div>

        {exhibits.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">
            {exhibits.map((anime, index) => (
              <AnimePoster
                key={`${anime.mal_id}-${index}`}
                anime={anime}
                onSelect={id => navigate(`/anime/${id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-16 text-center">
            <h2 className="text-lg font-bold">Your watchlist is empty</h2>
            <p className="mt-2 text-sm text-white/60">Add anime to your watchlist and they will appear here.</p>
          </div>
        )}
      </div>
    </main>
  );
}
