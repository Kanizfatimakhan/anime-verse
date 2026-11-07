import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Star, Plus, Check, ArrowUpRight } from 'lucide-react';
import { useWatchlist } from '../hooks/useWatchlist';
import { useToast } from '../context/ToastContext';

const FALLBACK_IMAGE = '/steel-ball-run-2560x1440-25586.jpg';

export default function AnimeCard({ anime, index = 0 }) {
  const tiltRef = useRef(null);
  const { add, remove, isIn, getItem, incrementEpisode } = useWatchlist();
  const { showToast } = useToast();
  const navigate = useNavigate();

  if (!anime) return null;

  const inWatchlist = isIn(anime.mal_id);
  const watchItem = inWatchlist ? getItem(anime.mal_id) : null;
  const watchedEps = watchItem?.episodesWatched || 0;
  const totalEps = anime.episodes || null;
  const imageUrl =
    anime.images?.webp?.large_image_url ||
    anime.images?.jpg?.large_image_url ||
    anime.images?.webp?.image_url ||
    anime.images?.jpg?.image_url ||
    FALLBACK_IMAGE;
  const title = anime.title_english || anime.title || 'Untitled anime';

  const openDetails = () => navigate(`/anime/${anime.mal_id}`);
  const handleKeyDown = event => {
    if (event.target !== event.currentTarget) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openDetails();
    }
  };
  const stopCardClick = event => event.stopPropagation();
  const handlePointerMove = event => {
    if (event.pointerType === 'touch') return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    tiltRef.current.style.transform = `perspective(900px) rotateX(${(0.5 - y) * 7}deg) rotateY(${(x - 0.5) * 7}deg)`;
  };
  const resetTilt = () => {
    if (tiltRef.current) tiltRef.current.style.transform = '';
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.025, 0.2) }}
      whileHover={{ y: -5, scale: 1.015 }}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
      className="group relative h-full cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-[#111118] text-left shadow-[0_8px_28px_rgba(0,0,0,0.2)] transition-[border-color,box-shadow] duration-300 hover:border-violet-300/35 hover:shadow-[0_18px_42px_rgba(0,0,0,0.4)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-300"
      onClick={openDetails}
      onKeyDown={handleKeyDown}
      role="link"
      tabIndex={0}
      aria-label={`View ${title} details`}
    >
      <div ref={tiltRef} className="h-full transition-transform duration-100 ease-out">
      <div className="relative aspect-[2/3] overflow-hidden bg-zinc-900">
        <img
          src={imageUrl}
          alt={`${title} poster`}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.035]"
          loading="lazy"
          onError={event => {
            if (event.currentTarget.src.endsWith(FALLBACK_IMAGE)) return;
            event.currentTarget.src = FALLBACK_IMAGE;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/10 to-black/20" />

        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-2.5 sm:p-3">
          {anime.score ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-black/55 px-2 py-1 text-[10px] font-semibold text-amber-200 backdrop-blur-md sm:text-xs">
              <Star className="h-3 w-3 fill-current" />
              {anime.score}
            </span>
          ) : <span />}

          <button
            type="button"
            onClick={event => {
              stopCardClick(event);
              if (inWatchlist) {
                remove(anime.mal_id);
                showToast(`Removed "${title}" from watchlist`, 'info');
              } else {
                add(anime);
                showToast(`Added "${title}" to watchlist!`, 'success');
              }
            }}
            aria-label={inWatchlist ? `Remove ${title} from watchlist` : `Add ${title} to watchlist`}
            className={`rounded-full border p-2 backdrop-blur-md transition ${
              inWatchlist
                ? 'border-violet-300/45 bg-violet-400/25 text-white'
                : 'border-white/15 bg-black/45 text-white/85 hover:border-white/35 hover:bg-black/70'
            }`}
          >
            {inWatchlist ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
          </button>
        </div>

        <div className="absolute inset-x-0 bottom-0 p-3 sm:p-3.5">
          <div className="mb-2 flex flex-wrap items-center gap-1.5 text-[9px] font-semibold uppercase tracking-wide text-white/65 sm:text-[10px]">
            {anime.type && <span className="rounded-full border border-white/20 bg-black/30 px-2 py-0.5">{anime.type}</span>}
            {(anime.year || anime.year === 0) && <span>{anime.year}</span>}
          </div>
          <h3 className="line-clamp-2 text-xs font-semibold leading-snug text-white sm:text-sm">
            {title}
          </h3>
          <div className="mt-2 flex items-center justify-between gap-2">
            {inWatchlist && (
              <button
                type="button"
                onClick={event => {
                  stopCardClick(event);
                  incrementEpisode(anime.mal_id);
                  showToast(`Watched Ep ${watchedEps + 1} of ${title}! 🍿`, 'success');
                }}
                aria-label={`Mark episode ${watchedEps + 1} watched`}
                className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-2 py-1 text-[9px] font-semibold text-emerald-100 transition hover:bg-emerald-300/20 sm:text-[10px]"
              >
                Ep {watchedEps}{totalEps ? ` / ${totalEps}` : ''} <span aria-hidden="true">+</span>
              </button>
            )}
            <span className="ml-auto inline-flex items-center gap-1 text-[10px] font-medium text-white/55 transition-colors group-hover:text-white/90">
              Details <ArrowUpRight className="h-3 w-3" />
            </span>
          </div>
        </div>
      </div>

      {inWatchlist && totalEps && (
        <div className="h-1 bg-white/10">
          <div
            className="h-full bg-gradient-to-r from-violet-400 to-cyan-300 transition-[width] duration-300"
            style={{ width: `${Math.min(100, (watchedEps / totalEps) * 100)}%` }}
          />
        </div>
      )}
      </div>
    </motion.article>
  );
}
