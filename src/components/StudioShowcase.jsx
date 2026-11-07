import { motion } from 'framer-motion';
import { Clapperboard, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const studios = [
  { id: 2, name: 'Kyoto Animation', works: 'Violet Evergarden, A Silent Voice', image: 'https://cdn.myanimelist.net/images/anime/1825/110716l.jpg' },
  { id: 4, name: 'Bones', works: 'Fullmetal Alchemist, My Hero Academia', image: 'https://cdn.myanimelist.net/images/anime/1223/96541l.jpg' },
  { id: 11, name: 'Madhouse', works: 'Death Note, Hunter x Hunter', image: 'https://cdn.myanimelist.net/images/anime/1337/99013l.jpg' },
  { id: 569, name: 'MAPPA', works: 'Jujutsu Kaisen, Attack on Titan', image: 'https://cdn.myanimelist.net/images/anime/1171/109222l.jpg' },
  { id: 43, name: 'ufotable', works: 'Demon Slayer, Fate/Zero', image: 'https://cdn.myanimelist.net/images/anime/1286/99889l.jpg' }
];

export default function StudioShowcase() {
  const [selectedStudio, setSelectedStudio] = useState(null);

  useEffect(() => {
    if (!selectedStudio) return undefined;
    const closeOnEscape = event => {
      if (event.key === 'Escape') setSelectedStudio(null);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [selectedStudio]);

  return (
    <section className="relative py-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-7 flex flex-col justify-between gap-4 sm:mb-8 md:flex-row md:items-end">
          <div className="flex items-center gap-3">
            <Clapperboard className="w-8 h-8 text-accent" />
            <h2 className="text-3xl font-black uppercase tracking-tight text-text">
              Legendary <span className="text-accent">Studios</span>
            </h2>
          </div>
          <p className="text-muted text-sm max-w-sm text-right hidden md:block">
            The masterminds behind the breathtaking animation of your favorite shows.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5 lg:gap-5">
          {studios.map((studio, i) => (
            <motion.button
              type="button"
              key={studio.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -10 }}
              onClick={() => setSelectedStudio(studio)}
              aria-label={`View featured works from ${studio.name}`}
              className="group relative h-44 w-full cursor-pointer overflow-hidden rounded-xl text-left glass focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 sm:h-52 lg:h-60"
            >
              <img 
                src={studio.image} 
                alt={studio.name} 
                className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-all duration-700 group-hover:scale-110 blur-[2px] group-hover:blur-0" 
              />
              <span className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
              
              <span className="absolute inset-x-0 bottom-0 flex flex-col items-center p-3 text-center transition-transform duration-300 sm:p-5">
                <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-md transition-transform group-hover:scale-110 group-hover:border-accent group-hover:bg-accent/20 sm:mb-4 sm:h-12 sm:w-12">
                  <Clapperboard className="h-4 w-4 text-text transition-colors group-hover:text-accent sm:h-5 sm:w-5" />
                </span>
                <span className="mb-1 text-lg font-bold text-white transition-colors group-hover:text-accent">{studio.name}</span>
                <span className="line-clamp-2 text-xs text-muted/90">
                  {studio.works}
                </span>
              </span>
            </motion.button>
          ))}
        </div>
      </div>
      {selectedStudio && createPortal(
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
          onClick={() => setSelectedStudio(null)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="studio-dialog-title"
            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 p-6 shadow-2xl shadow-black/50 sm:p-8"
            onClick={event => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedStudio(null)}
              aria-label="Close studio details"
              className="absolute right-4 top-4 rounded-full p-2 text-white/65 transition hover:bg-white/10 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
            <Clapperboard className="mb-4 h-8 w-8 text-accent" />
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-accent">Legendary studio</p>
            <h3 id="studio-dialog-title" className="text-2xl font-black text-white">{selectedStudio.name}</h3>
            <p className="mt-5 text-sm font-semibold text-white/80">Featured works</p>
            <p className="mt-2 text-sm leading-6 text-muted">{selectedStudio.works}</p>
          </section>
        </div>,
        document.body
      )}
    </section>
  );
}
