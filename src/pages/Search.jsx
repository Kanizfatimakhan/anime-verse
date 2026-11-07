import { useEffect, useState, useTransition } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
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

export default function Search() {
  const [params, setParams] = useSearchParams();
  const initialQ = params.get('q') || '';
  const initialGenre = params.get('genre') || '';

  const [query, setQuery] = useState(initialQ);
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');
  const [orderBy, setOrderBy] = useState('popularity');
  const [selectedGenre, setSelectedGenre] = useState(initialGenre);
  const [showFilters, setShowFilters] = useState(false);

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [recentSearches, setRecentSearches] = useLocalStorage('animeverse_recent_searches', []);
  const navigate = useNavigate();

  // Search execution
  const executeSearch = async (targetQuery, targetPage = 1, append = false) => {
    setLoading(true);
    try {
      const res = await searchAnime(targetQuery, {
        page: targetPage,
        type: type || undefined,
        status: status || undefined,
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
  }, [query, type, status, orderBy, selectedGenre]);

  // Sync URL changes
  useEffect(() => {
    if (initialQ !== query && initialQ) {
      setQuery(initialQ);
    }
    if (initialGenre !== selectedGenre) {
      setSelectedGenre(initialGenre);
    }
  }, [initialQ, initialGenre]);

  const handleRecentClick = (term) => {
    setQuery(term);
    navigate(`/search?q=${encodeURIComponent(term)}`);
  };

  const handleGenreToggle = (genreId) => {
    const newGenre = selectedGenre === String(genreId) ? '' : String(genreId);
    setSelectedGenre(newGenre);
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
          Search across thousands of titles in English, Japanese Romaji, or browse curated filter matrices.
        </p>

        {/* Input Field */}
        <div className="relative">
          <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              navigate(`/search?q=${encodeURIComponent(e.target.value)}`, { replace: true });
            }}
            placeholder="Search by title, romaji, character, or studio..."
            className="w-full glass bg-zinc-900/60 border-2 border-white/10 focus:border-primary/80 rounded-full py-4 pl-14 pr-24 text-base text-text outline-none transition-all shadow-2xl placeholder:text-muted/60"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
            {query && (
              <button
                onClick={() => { setQuery(''); navigate('/search'); }}
                className="p-1.5 text-muted hover:text-text bg-white/5 rounded-full transition-colors"
                title="Clear query"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-full border text-xs transition-colors flex items-center gap-1 font-bold ${
                showFilters || type || status || selectedGenre
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
                className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider transition-all border ${
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
              className="mt-6 glass p-5 rounded-2xl border border-white/10 text-left grid grid-cols-1 sm:grid-cols-3 gap-4"
            >
              {/* Type Filter */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-muted block mb-2">
                  Format Type
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full glass bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-xs font-semibold text-text outline-none focus:border-primary"
                >
                  {TYPE_OPTIONS.map(opt => (
                    <option key={opt.id} value={opt.id}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-muted block mb-2">
                  Release Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full glass bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-xs font-semibold text-text outline-none focus:border-primary"
                >
                  {STATUS_OPTIONS.map(opt => (
                    <option key={opt.id} value={opt.id}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Sort Order */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-muted block mb-2">
                  Sort Matrix
                </label>
                <select
                  value={orderBy}
                  onChange={(e) => setOrderBy(e.target.value)}
                  className="w-full glass bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-xs font-semibold text-text outline-none focus:border-primary"
                >
                  {SORT_OPTIONS.map(opt => (
                    <option key={opt.id} value={opt.id}>{opt.label}</option>
                  ))}
                </select>
              </div>
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
          <span>Displaying {results.length} Titles</span>
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
      ) : query && !loading ? (
        <div className="text-center py-20 text-muted glass rounded-3xl border border-white/5 max-w-lg mx-auto">
          <p className="text-3xl mb-3">🔍</p>
          <p className="text-xl font-bold text-text mb-2">No results found for "{query}"</p>
          <p className="text-xs text-muted max-w-sm mx-auto mb-6">
            Try checking spelling, removing active filters, or exploring popular genres below.
          </p>
          <button
            onClick={() => { setQuery(''); setType(''); setStatus(''); setSelectedGenre(''); }}
            className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full text-xs font-bold uppercase tracking-wider transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : null}
    </div>
  );
}
