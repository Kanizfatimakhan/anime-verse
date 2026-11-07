import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Swords, Star, Award, Film, Tv, Sparkles, ArrowRight, Check } from 'lucide-react';
import { SEED_ANIME_LIST } from '../data/animeSeedData';
import { Link } from 'react-router-dom';

export default function Compare() {
  const [animeAId, setAnimeAId] = useState(SEED_ANIME_LIST[3].mal_id); // Attack on Titan
  const [animeBId, setAnimeBId] = useState(SEED_ANIME_LIST[4].mal_id); // Demon Slayer

  const animeA = useMemo(() => SEED_ANIME_LIST.find(a => a.mal_id === Number(animeAId)) || SEED_ANIME_LIST[0], [animeAId]);
  const animeB = useMemo(() => SEED_ANIME_LIST.find(a => a.mal_id === Number(animeBId)) || SEED_ANIME_LIST[1], [animeBId]);

  return (
    <div className="page-container pt-10 pb-20 min-h-[85vh]">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-4">
          <Swords className="w-3.5 h-3.5" /> Versus Arena
        </div>
        <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-text mb-3">
          Anime <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-glow to-accent">Face-Off</span>
        </h1>
        <p className="text-muted text-xs sm:text-sm">
          Compare scores, production studios, pacing, and visual themes side-by-side.
        </p>
      </div>

      {/* Selectors Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
        <div className="glass p-4 rounded-2xl border border-primary/30 bg-primary/5">
          <label className="text-[11px] font-bold uppercase tracking-wider text-primary block mb-2">
            Contender 1
          </label>
          <select
            value={animeAId}
            onChange={(e) => setAnimeAId(Number(e.target.value))}
            className="w-full glass [color-scheme:dark] bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs font-bold text-white outline-none focus:border-primary"
          >
            {SEED_ANIME_LIST.map(a => (
              <option className="bg-zinc-900 text-white" key={a.mal_id} value={a.mal_id}>
                {a.title_english || a.title} (★ {a.score})
              </option>
            ))}
          </select>
        </div>

        <div className="glass p-4 rounded-2xl border border-accent/30 bg-accent/5">
          <label className="text-[11px] font-bold uppercase tracking-wider text-accent block mb-2">
            Contender 2
          </label>
          <select
            value={animeBId}
            onChange={(e) => setAnimeBId(Number(e.target.value))}
            className="w-full glass [color-scheme:dark] bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs font-bold text-white outline-none focus:border-accent"
          >
            {SEED_ANIME_LIST.map(a => (
              <option className="bg-zinc-900 text-white" key={a.mal_id} value={a.mal_id}>
                {a.title_english || a.title} (★ {a.score})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Versus Comparison Arena */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] items-stretch gap-6 max-w-5xl mx-auto mb-12">
        {/* Card A */}
        <div className="glass p-6 rounded-3xl border border-white/10 flex flex-col justify-between relative overflow-hidden bg-zinc-950">
          <div className="flex gap-4 items-start mb-6">
            <img
              src={animeA.images?.webp?.large_image_url || animeA.images?.jpg?.large_image_url}
              alt={animeA.title}
              className="w-24 aspect-[2/3] object-cover rounded-xl shadow-lg border border-white/10 flex-shrink-0"
            />
            <div className="min-w-0">
              <span className="text-[10px] font-black uppercase tracking-wider text-primary px-2 py-0.5 rounded bg-primary/10 border border-primary/20">
                {animeA.type} · {animeA.year || 'Classic'}
              </span>
              <h2 className="text-lg font-black text-white mt-1 leading-tight line-clamp-2">
                {animeA.title_english || animeA.title}
              </h2>
              <p className="text-xs text-muted mt-1">{animeA.studios?.[0]?.name || 'Studio Unknown'}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-muted">Global Rating</span>
                <span className="text-yellow-400">★ {animeA.score} / 10</span>
              </div>
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-yellow-500 to-amber-400"
                  style={{ width: `${(animeA.score / 10) * 100}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <p className="text-[10px] text-muted uppercase font-bold">Episodes</p>
                <p className="text-base font-black text-white mt-0.5">{animeA.episodes || 'Ongoing'}</p>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <p className="text-[10px] text-muted uppercase font-bold">Rank</p>
                <p className="text-base font-black text-primary mt-0.5">#{animeA.rank || 'N/A'}</p>
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold text-muted uppercase mb-2">Key Themes</p>
              <div className="flex flex-wrap gap-1.5">
                {animeA.genres?.map(g => (
                  <span key={g.name} className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-white/5 text-text border border-white/5">
                    {g.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <Link
            to={`/anime/${animeA.mal_id}`}
            className="mt-6 w-full py-2.5 bg-primary/20 hover:bg-primary border border-primary/40 text-white rounded-xl text-xs font-bold uppercase tracking-wider text-center block transition-all"
          >
            View Full Details
          </Link>
        </div>

        {/* VS Center Badge */}
        <div className="flex items-center justify-center my-2 lg:my-0">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-black text-sm shadow-[0_0_30px_rgba(124,58,237,0.5)] border-2 border-white/20">
            VS
          </div>
        </div>

        {/* Card B */}
        <div className="glass p-6 rounded-3xl border border-white/10 flex flex-col justify-between relative overflow-hidden bg-zinc-950">
          <div className="flex gap-4 items-start mb-6">
            <img
              src={animeB.images?.webp?.large_image_url || animeB.images?.jpg?.large_image_url}
              alt={animeB.title}
              className="w-24 aspect-[2/3] object-cover rounded-xl shadow-lg border border-white/10 flex-shrink-0"
            />
            <div className="min-w-0">
              <span className="text-[10px] font-black uppercase tracking-wider text-accent px-2 py-0.5 rounded bg-accent/10 border border-accent/20">
                {animeB.type} · {animeB.year || 'Classic'}
              </span>
              <h2 className="text-lg font-black text-white mt-1 leading-tight line-clamp-2">
                {animeB.title_english || animeB.title}
              </h2>
              <p className="text-xs text-muted mt-1">{animeB.studios?.[0]?.name || 'Studio Unknown'}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-muted">Global Rating</span>
                <span className="text-yellow-400">★ {animeB.score} / 10</span>
              </div>
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-accent to-blue-400"
                  style={{ width: `${(animeB.score / 10) * 100}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <p className="text-[10px] text-muted uppercase font-bold">Episodes</p>
                <p className="text-base font-black text-white mt-0.5">{animeB.episodes || 'Ongoing'}</p>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <p className="text-[10px] text-muted uppercase font-bold">Rank</p>
                <p className="text-base font-black text-accent mt-0.5">#{animeB.rank || 'N/A'}</p>
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold text-muted uppercase mb-2">Key Themes</p>
              <div className="flex flex-wrap gap-1.5">
                {animeB.genres?.map(g => (
                  <span key={g.name} className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-white/5 text-text border border-white/5">
                    {g.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <Link
            to={`/anime/${animeB.mal_id}`}
            className="mt-6 w-full py-2.5 bg-accent/20 hover:bg-accent hover:text-zinc-950 border border-accent/40 text-white rounded-xl text-xs font-bold uppercase tracking-wider text-center block transition-all"
          >
            View Full Details
          </Link>
        </div>
      </div>
    </div>
  );
}
