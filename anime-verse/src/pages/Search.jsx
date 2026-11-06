import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { searchAnime } from '../utils/api';
import AnimeCard from '../components/AnimeCard';
import { Search as SearchIcon, Clock, X } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export default function Search() {
  const [params] = useSearchParams();
  const initialQ = params.get('q') || '';
  
  const [query, setQuery] = useState(initialQ);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useLocalStorage('animeverse_recent_searches', []);
  const navigate = useNavigate();

  // Debounce logic
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      setLoading(true);
      searchAnime(query, 1)
        .then(res => setResults(res.data || []))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
      
      // Save to recent
      if (query.trim().length > 2) {
        setRecentSearches(prev => {
          const filtered = prev.filter(q => q.toLowerCase() !== query.toLowerCase());
          return [query, ...filtered].slice(0, 5);
        });
      }
    }, 600); // 600ms debounce

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  // Sync with URL
  useEffect(() => {
    if (initialQ !== query && initialQ) setQuery(initialQ);
  }, [initialQ]);

  const handleRecentClick = (q) => {
    setQuery(q);
    navigate(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 pt-10 pb-12 min-h-[80vh]">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-6">
          Advanced <span className="text-primary">Search</span>
        </h1>
        
        <div className="relative">
          <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-muted" />
          <input 
            type="text" 
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              navigate(`/search?q=${encodeURIComponent(e.target.value)}`, { replace: true });
            }}
            placeholder="Search in English, Romaji, or Japanese..."
            className="w-full glass bg-background/50 border-2 border-white/10 focus:border-primary rounded-full py-5 pl-16 pr-6 text-lg text-text outline-none transition-all shadow-2xl"
          />
          {query && (
            <button 
              onClick={() => { setQuery(''); navigate('/search'); }}
              className="absolute right-6 top-1/2 -translate-y-1/2 p-1 text-muted hover:text-text bg-white/5 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Recent Searches */}
        {!query && recentSearches.length > 0 && (
          <div className="mt-8 text-left glass p-6 rounded-2xl max-w-xl mx-auto">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4" /> Recent Searches
            </h3>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map(term => (
                <button
                  key={term}
                  onClick={() => handleRecentClick(term)}
                  className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-sm font-medium text-text transition-colors border border-white/5"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="aspect-[2/3] rounded-xl glass animate-pulse" />
          ))}
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {results.map((anime, i) => (
            <AnimeCard key={anime.mal_id} anime={anime} index={i} />
          ))}
        </div>
      ) : query && !loading ? (
        <div className="text-center py-20 text-muted">
          <p className="text-xl mb-2">No results found for "{query}"</p>
          <p className="text-sm">Try using different keywords or Japanese romaji.</p>
        </div>
      ) : null}
    </div>
  );
}
