import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchAnime } from '../utils/animeApi';
import AnimeCard from '../components/AnimeCard';
import { Search as SearchIcon, Clock, X, SlidersHorizontal, Sparkles, ChevronDown } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { motion, AnimatePresence } from 'framer-motion';

const TYPE_OPTIONS = [
  { id: '', label: 'All Formats' },
  { id: 'tv', label: 'TV Series' },
  { id: 'movie', label: 'Movies' },
  { id: 'ova', label: 'OVAs' },
  { id: 'special', label: 'Specials' },
];

const ORIGIN_OPTIONS = [
  { id: '', label: 'All origins' },
  { id: 'JP', label: 'Japan' },
  { id: 'CN', label: 'China' },
  { id: 'KR', label: 'South Korea' },
  { id: 'TW', label: 'Taiwan' },
];

const STATUS_OPTIONS = [
  { id: '', label: 'Any Status' },
  { id: 'airing', label: 'Currently Airing' },
  { id: 'complete', label: 'Finished' },
  { id: 'upcoming', label: 'Upcoming' },
];

const SORT_OPTIONS = [
  { id: 'popularity', label: 'Most Popular' },
  { id: 'score', label: 'Highest Rated' },
  { id: 'title', label: 'Title (A-Z)' },
  { id: 'start_date', label: 'Release Date' },
];

const QUICK_GENRES = [
  { id: 1, name: 'Action' },
  { id: 2, name: 'Adventure' },
  { id: 4, name: 'Comedy' },
  { id: 8, name: 'Drama' },
  { id: 10, name: 'Fantasy' },
  { id: 22, name: 'Romance' },
  { id: 24, name: 'Sci-Fi' },
  { id: 40, name: 'Psychological' },
];

function FilterSelect({ label, value, options, onChange }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const selected = options.find(option => option.id === value) || options[0];

  useEffect(() => {
    if (!open) return undefined;
    const closeOnOutsideClick = event => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    const closeOnEscape = event => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', closeOnOutsideClick);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsideClick);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [open]);

  return (
    <div>
      <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-muted">
        {label}
      </label>
      <div className="relative" ref={rootRef}>
        <button
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => setOpen(current => !current)}
          className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-zinc-900 px-3 py-2.5 text-left text-xs font-semibold text-text transition hover:border-white/20 focus-visible:border-primary"
        >
          <span>{selected.label}</span>
          <ChevronDown className={`h-4 w-4 text-muted transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
        {open && (
          <div
            role="listbox"
            aria-label={label}
            className="absolute left-0 right-0 top-full z-[80] mt-1 max-h-56 overflow-y-auto rounded-xl border border-white/10 bg-zinc-900 p-1 shadow-xl shadow-black/50"
          >
            {options.map(option => (
              <button
                type="button"
                role="option"
                aria-selected={value === option.id}
                key={option.id}
                onClick={() => {
                  onChange(option.id);
                  setOpen(false);
                }}
                className={`w-full rounded-lg px-3 py-2 text-left text-xs transition ${
                  value === option.id
                    ? 'bg-primary/20 text-white'
                    : 'text-white/75 hover:bg-white/10 hover:text-white'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Search() {
  const [params, setParams] = useSearchParams();
  const initialQ = params.get('q') || '';
  const initialGenre = params.get('genre') || '';
  const initialOrigin = params.get('country') || '';
  const initialFrom = params.get('from') || '';
  const initialTo = params.get('to') || '';

  const [query, setQuery] = useState(initialQ);
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');
  const [orderBy, setOrderBy] = useState('popularity');
  const [selectedGenre, setSelectedGenre] = useState(initialGenre);
  const [countryOfOrigin, setCountryOfOrigin] = useState(initialOrigin);
  const [yearRange, setYearRange] = useState({ from: initialFrom, to: initialTo });
  const [showFilters, setShowFilters] = useState(Boolean(initialOrigin));

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [recentSearches, setRecentSearches] = useLocalStorage('animeverse_recent_searches', []);
  const updateSearchUrl = (nextQuery, nextOrigin = countryOfOrigin, nextGenre = selectedGenre) => {
    const nextParams = new URLSearchParams();
    if (nextQuery.trim()) nextParams.set('q', nextQuery.trim());
    if (nextGenre) nextParams.set('genre', nextGenre);
    if (nextOrigin) nextParams.set('country', nextOrigin);
    if (yearRange.from && yearRange.to) {
      nextParams.set('from', yearRange.from);
      nextParams.set('to', yearRange.to);
    }
    setParams(nextParams, { replace: true });
  };

  // Search execution
  const executeSearch = async (targetQuery, targetPage = 1, append = false) => {
    setLoading(true);
    try {
      const res = await searchAnime(targetQuery, {
        page: targetPage,
        type: type || undefined,
        status: status || undefined,
        countryOfOrigin: countryOfOrigin || undefined,
        startDateGreater: yearRange.from ? Number(`${Number(yearRange.from) - 1}1231`) : undefined,
        startDateLesser: yearRange.to ? Number(`${Number(yearRange.to) + 1}0101`) : undefined,
        order_by: orderBy,
        sort: orderBy === 'title' ? 'asc' : 'desc',
        genres: selectedGenre || undefined,
      });

      const items = res?.data || [];
      if (append) {
        setResults(prev => [...prev, ...items]);
      } else {
        setResults(items);
      }
      setHasNextPage(Boolean(res?.pagination?.has_next_page));
      setPage(targetPage);
    } catch (err) {
      console.error(err);
      if (!append) setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search trigger when query or filters change
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      executeSearch(query, 1, false);

      // Save to recent searches if long enough
      if (query.trim().length > 2) {
        setRecentSearches(prev => {
          const filtered = prev.filter(q => q.toLowerCase() !== query.toLowerCase());
          return [query.trim(), ...filtered].slice(0, 6);
        });
      }
    }, 450);

    return () => clearTimeout(delayDebounceFn);
  }, [query, type, status, orderBy, selectedGenre, countryOfOrigin, yearRange]);

  // Sync URL changes
  useEffect(() => {
    setQuery(initialQ);
    setSelectedGenre(initialGenre);
    setCountryOfOrigin(initialOrigin);
    setYearRange({ from: initialFrom, to: initialTo });
    if (initialOrigin) setShowFilters(true);
  }, [initialQ, initialGenre, initialOrigin, initialFrom, initialTo]);

  const handleRecentClick = (term) => {
    setQuery(term);
    updateSearchUrl(term);
  };

  const handleGenreToggle = (genreId) => {
    const newGenre = selectedGenre === String(genreId) ? '' : String(genreId);
    setSelectedGenre(newGenre);
    updateSearchUrl(query, countryOfOrigin, newGenre);
  };

  const handleLoadMore = () => {
    if (!loading && hasNextPage) {
      executeSearch(query, page + 1, true);
    }
  };

  return (
    <div className="page-container pt-10 pb-20 min-h-[85vh]">
      {/* Search Header */}
      <div className="max-w-3xl mx-auto text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-4">
          <Sparkles className="w-3.5 h-3.5" /> High-Performance Anime Search
        </div>
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-4 text-text">
          Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Anime</span>
        </h1>
        <p className="text-muted text-sm max-w-md mx-auto mb-8">
          Explore anime worldwide by title, genre, release status, format, and country of origin.
        </p>

        {countryOfOrigin && (
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-200/20 bg-cyan-300/10 px-4 py-2 text-sm font-semibold text-cyan-100">
            Showing anime from {ORIGIN_OPTIONS.find(option => option.id === countryOfOrigin)?.label || countryOfOrigin}
            <button
              type="button"
              onClick={() => {
                setCountryOfOrigin('');
                updateSearchUrl(query, '');
              }}
              aria-label="Clear country filter"
              className="rounded-full p-1 text-cyan-100/70 transition hover:bg-white/10 hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {yearRange.from && yearRange.to && (
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-2 text-sm text-text">
            Anime from {yearRange.from}–{yearRange.to}
            <button
              type="button"
              onClick={() => {
                setYearRange({ from: '', to: '' });
                const nextParams = new URLSearchParams(params);
                nextParams.delete('from');
                nextParams.delete('to');
                setParams(nextParams, { replace: true });
              }}
              className="rounded-full p-1 text-muted transition hover:bg-white/10 hover:text-white"
              aria-label="Clear era filter"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* Input Field */}
        <div className="relative">
          <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              updateSearchUrl(e.target.value);
            }}
            placeholder="Search anime titles worldwide..."
            className="w-full glass bg-zinc-900/60 border-2 border-white/10 focus:border-primary/80 rounded-full py-4 pl-14 pr-24 text-base text-text outline-none transition-all shadow-2xl placeholder:text-muted/60"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
            {query && (
              <button
                onClick={() => { setQuery(''); updateSearchUrl(''); }}
                className="p-1.5 text-muted hover:text-text bg-white/5 rounded-full transition-colors"
                title="Clear query"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-full border text-xs transition-colors flex items-center gap-1 font-bold ${
                showFilters || type || status || selectedGenre || countryOfOrigin || yearRange.from
                  ? 'bg-primary text-white border-primary shadow-lg shadow-primary/30'
                  : 'bg-white/5 border-white/10 text-muted hover:text-text'
              }`}
              title="Toggle Advanced Filters"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Genre Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
          {QUICK_GENRES.map(g => {
            const isSelected = selectedGenre === String(g.id);
            return (
              <button
                key={g.id}
                onClick={() => handleGenreToggle(g.id)}
                className={`min-h-10 px-3 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all border ${
                  isSelected
                    ? 'bg-primary text-white border-primary shadow-[0_0_15px_rgba(124,58,237,0.4)]'
                    : 'glass border-white/5 text-muted hover:text-text hover:bg-white/5'
                }`}
              >
                {g.name}
              </button>
            );
          })}
        </div>

        {/* Expandable Filter Drawer */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 glass p-5 rounded-2xl border border-white/10 text-left grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              <FilterSelect
                label="Anime Origin"
                value={countryOfOrigin}
                options={ORIGIN_OPTIONS}
                onChange={origin => {
                  setCountryOfOrigin(origin);
                  updateSearchUrl(query, origin);
                }}
              />
              <FilterSelect label="Format Type" value={type} options={TYPE_OPTIONS} onChange={setType} />
              <FilterSelect label="Release Status" value={status} options={STATUS_OPTIONS} onChange={setStatus} />
              <FilterSelect label="Sort Matrix" value={orderBy} options={SORT_OPTIONS} onChange={setOrderBy} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Recent Searches */}
        {!query && recentSearches.length > 0 && (
          <div className="mt-8 text-left glass p-5 rounded-2xl border border-white/5 max-w-xl mx-auto">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-2">
                <Clock className="w-3.5 h-3.5" /> Recent Searches
              </h3>
              <button
                onClick={() => setRecentSearches([])}
                className="text-[10px] uppercase font-bold text-muted hover:text-red-400 transition-colors"
              >
                Clear All
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map(term => (
                <button
                  key={term}
                  onClick={() => handleRecentClick(term)}
                  className="px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-xs font-medium text-text transition-colors border border-white/5"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Results Header */}
      {results.length > 0 && (
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-white/5 text-xs text-muted font-bold uppercase tracking-wider">
          <span>
            Displaying {results.length} Titles
            {countryOfOrigin && ` · ${ORIGIN_OPTIONS.find(option => option.id === countryOfOrigin)?.label || countryOfOrigin}`}
          </span>
          {query && <span>Matches for "{query}"</span>}
        </div>
      )}

      {/* Results Grid / Loading State */}
      {loading && results.length === 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="aspect-[2/3] rounded-2xl glass border border-white/5 animate-pulse" />
          ))}
        </div>
      ) : results.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
            {results.map((anime, i) => (
              <AnimeCard key={`${anime.mal_id}-${i}`} anime={anime} index={i % 12} />
            ))}
          </div>

          {/* Load More Button */}
          {hasNextPage && (
            <div className="mt-12 text-center">
              <button
                onClick={handleLoadMore}
                disabled={loading}
                className="px-8 py-3.5 bg-primary/20 hover:bg-primary border border-primary/40 text-white rounded-full font-bold uppercase tracking-wider text-xs transition-all hover:scale-105 disabled:opacity-50 inline-flex items-center gap-2"
              >
                {loading ? 'Fetching next page...' : 'Load More Titles ↓'}
              </button>
            </div>
          )}
        </>
      ) : (query || countryOfOrigin || yearRange.from) && !loading ? (
        <div className="text-center py-20 text-muted glass rounded-3xl border border-white/5 max-w-lg mx-auto">
          <p className="text-3xl mb-3">🔍</p>
          <p className="text-xl font-bold text-text mb-2">
            {query
              ? `No results found for "${query}"`
              : yearRange.from
                ? `No anime found from ${yearRange.from}–${yearRange.to}`
                : 'No anime found for this origin'}
          </p>
          <p className="text-xs text-muted max-w-sm mx-auto mb-6">
            Try checking spelling, removing active filters, or exploring popular genres below.
          </p>
          <button
            onClick={() => {
              setQuery('');
              setType('');
              setStatus('');
              setSelectedGenre('');
              setCountryOfOrigin('');
              setYearRange({ from: '', to: '' });
              setParams(new URLSearchParams(), { replace: true });
            }}
            className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full text-xs font-bold uppercase tracking-wider transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : null}
    </div>
  );
}
