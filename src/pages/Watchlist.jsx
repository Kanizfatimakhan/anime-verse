import { useState, useMemo, useRef, useEffect } from 'react';
import { useWatchlist } from '../hooks/useWatchlist';
import { useToast } from '../context/ToastContext';
import AnimeCard from '../components/AnimeCard';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bookmark,
  Play,
  Download,
  Upload,
  Trash2,
  Share2,
  Tv,
  CheckCircle2,
  Clock,
  Heart,
  Filter,
  ArrowUpDown,
  Sparkles,
} from 'lucide-react';

const STATUS_TABS = [
  { id: 'all', label: 'All', icon: Bookmark },
  { id: 'watching', label: 'Watching', icon: Tv },
  { id: 'plan_to_watch', label: 'Plan to Watch', icon: Clock },
  { id: 'completed', label: 'Completed', icon: CheckCircle2 },
  { id: 'favorites', label: 'Favorites', icon: Heart },
];

export default function Watchlist() {
  const { watchlist, clearAll, importList } = useWatchlist();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef(null);
  const copiedTimeoutRef = useRef(null);

  useEffect(() => () => clearTimeout(copiedTimeoutRef.current), []);

  // Compute Statistics
  const stats = useMemo(() => {
    const total = watchlist.length;
    const completed = watchlist.filter(a => a.status === 'completed').length;
    const watching = watchlist.filter(a => a.status === 'watching').length;
    const scores = watchlist.map(a => Number(a.score)).filter(s => !isNaN(s) && s > 0);
    const avgScore = scores.length
      ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)
      : 'N/A';

    return { total, completed, watching, avgScore };
  }, [watchlist]);

  // Filter & Sort
  const filteredList = useMemo(() => {
    let list = [...watchlist];

    if (activeTab !== 'all') {
      list = list.filter(a => (a.status || 'plan_to_watch') === activeTab);
    }

    if (sortBy === 'score') {
      list.sort((a, b) => (Number(b.score) || 0) - (Number(a.score) || 0));
    } else if (sortBy === 'title') {
      list.sort((a, b) => (a.title_english || a.title || '').localeCompare(b.title_english || b.title || ''));
    } else {
      // Recent first
      list.sort((a, b) => new Date(b.addedAt || 0) - new Date(a.addedAt || 0));
    }

    return list;
  }, [watchlist, activeTab, sortBy]);

  // Export JSON
  const handleExport = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(watchlist, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `animeverse_watchlist_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Watchlist exported as JSON backup 💾', 'success');
  };

  // Import JSON
  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (Array.isArray(parsed)) {
          importList(parsed);
          showToast(`Imported ${parsed.length} anime entries! ✨`, 'success');
        }
      } catch (err) {
        showToast('Invalid JSON file format', 'error');
      }
    };
    reader.readAsText(file);
  };

  // Share
  const handleShare = async () => {
    const titles = watchlist.slice(0, 5).map(a => a.title_english || a.title).join(', ');
    const text = `Check out my AnimeVerse Watchlist (${watchlist.length} titles including ${titles})!`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      clearTimeout(copiedTimeoutRef.current);
      copiedTimeoutRef.current = setTimeout(() => setCopied(false), 2000);
      showToast('Watchlist summary copied to clipboard 📋', 'success');
    } catch (error) {
      console.error('Failed to copy watchlist summary:', error);
      showToast('Unable to copy the watchlist summary. Check clipboard permissions.', 'error');
    }
  };

  return (
    <div className="page-container pt-10 pb-20 min-h-[85vh]">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Personal Collection
          </div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-text">
            My <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Watchlist</span>
          </h1>
          <p className="text-muted text-sm mt-1">
            Track your anime journey, curate favorites, and organize what to watch next.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleShare}
            className="px-4 py-2 rounded-full glass border border-white/10 hover:border-primary/40 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all text-text hover:text-primary"
            title="Copy share summary to clipboard"
          >
            <Share2 className="w-3.5 h-3.5" />
            {copied ? 'Copied!' : 'Share'}
          </button>

          <button
            onClick={handleExport}
            disabled={watchlist.length === 0}
            className="px-4 py-2 rounded-full glass border border-white/10 hover:border-primary/40 disabled:opacity-40 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all text-text hover:text-primary"
            title="Download your watchlist as JSON"
          >
            <Download className="w-3.5 h-3.5" /> Export
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 rounded-full glass border border-white/10 hover:border-primary/40 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all text-text hover:text-primary"
            title="Upload a saved watchlist JSON file"
          >
            <Upload className="w-3.5 h-3.5" /> Import
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImport}
            accept=".json"
            className="hidden"
          />

          {watchlist.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to clear your entire watchlist?')) {
                  clearAll();
                }
              }}
              className="p-2 rounded-full glass border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors"
              title="Clear all saved anime"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Stats Bento Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="glass p-4 rounded-2xl border border-white/5 bg-gradient-to-br from-white/5 to-transparent">
          <p className="text-[11px] font-bold text-muted uppercase tracking-wider">Total Shows</p>
          <p className="text-2xl sm:text-3xl font-black text-text mt-1">{stats.total}</p>
        </div>
        <div className="glass p-4 rounded-2xl border border-white/5 bg-gradient-to-br from-blue-500/10 to-transparent">
          <p className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">Currently Watching</p>
          <p className="text-2xl sm:text-3xl font-black text-blue-400 mt-1">{stats.watching}</p>
        </div>
        <div className="glass p-4 rounded-2xl border border-white/5 bg-gradient-to-br from-emerald-500/10 to-transparent">
          <p className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">Completed</p>
          <p className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1">{stats.completed}</p>
        </div>
        <div className="glass p-4 rounded-2xl border border-white/5 bg-gradient-to-br from-yellow-500/10 to-transparent">
          <p className="text-[11px] font-bold text-yellow-400 uppercase tracking-wider">Average Rating</p>
          <p className="text-2xl sm:text-3xl font-black text-yellow-400 mt-1">★ {stats.avgScore}</p>
        </div>
      </div>

      {/* Filter Tabs & Sort Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-white/5">
        {/* Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {STATUS_TABS.map(tab => {
            const Icon = tab.icon;
            const count = tab.id === 'all'
              ? watchlist.length
              : watchlist.filter(a => (a.status || 'plan_to_watch') === tab.id).length;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-primary text-white shadow-[0_0_20px_rgba(124,58,237,0.4)]'
                    : 'glass text-muted hover:text-text hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-white/20' : 'bg-white/10'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-2 justify-end">
          <ArrowUpDown className="w-4 h-4 text-muted" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="glass bg-zinc-900/80 border border-white/10 rounded-full px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-text outline-none focus:border-primary"
          >
            <option value="recent">Recently Added</option>
            <option value="score">Highest Score</option>
            <option value="title">Alphabetical (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Content Grid */}
      {filteredList.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center text-center py-20 glass rounded-3xl border border-white/5 shadow-2xl"
        >
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-5 border border-primary/20">
            <span className="text-4xl">✨</span>
          </div>
          <h3 className="text-2xl font-black text-text uppercase tracking-tight mb-2">
            {activeTab === 'all' ? 'Your Watchlist is Empty' : `No ${activeTab.replace('_', ' ')} Anime Yet`}
          </h3>
          <p className="text-muted text-sm mb-8 max-w-sm">
            Explore our vast catalog and add anime to your personal library using the + button on any card.
          </p>
          <div className="flex items-center gap-3">
            <Link
              to="/search"
              className="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-full font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-primary/30 text-xs transition-all"
            >
              <Play className="w-4 h-4 fill-current" /> Browse Anime
            </Link>
            <Link
              to="/genres"
              className="px-6 py-3 glass hover:bg-white/10 text-text rounded-full font-bold uppercase tracking-wider text-xs transition-all"
            >
              Explore Genres
            </Link>
          </div>
        </motion.div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
        >
          <AnimatePresence>
            {filteredList.map((anime, i) => (
              <AnimeCard key={anime.mal_id} anime={anime} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
