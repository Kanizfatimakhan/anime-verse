import { motion } from 'framer-motion';
import { Clapperboard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const studios = [
  { id: 2, name: 'Kyoto Animation', works: 'Violet Evergarden, A Silent Voice', image: 'https://cdn.myanimelist.net/images/anime/1825/110716l.jpg' },
  { id: 4, name: 'Bones', works: 'Fullmetal Alchemist, My Hero Academia', image: 'https://cdn.myanimelist.net/images/anime/1223/96541l.jpg' },
  { id: 11, name: 'Madhouse', works: 'Death Note, Hunter x Hunter', image: 'https://cdn.myanimelist.net/images/anime/1337/99013l.jpg' },
  { id: 569, name: 'MAPPA', works: 'Jujutsu Kaisen, Attack on Titan', image: 'https://cdn.myanimelist.net/images/anime/1171/109222l.jpg' },
  { id: 43, name: 'ufotable', works: 'Demon Slayer, Fate/Zero', image: 'https://cdn.myanimelist.net/images/anime/1286/99889l.jpg' }
];

export default function StudioShowcase() {
  const navigate = useNavigate();

  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {studios.map((studio, i) => (
            <motion.div
              key={studio.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -10 }}
              onClick={() => navigate(`/search?q=${studio.name}`)}
              className="relative group cursor-pointer h-64 rounded-xl overflow-hidden glass"
            >
              <img 
                src={studio.image} 
                alt={studio.name} 
                className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-all duration-700 group-hover:scale-110 blur-[2px] group-hover:blur-0" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
              
              <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col items-center text-center transform transition-transform duration-300">
                <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center mb-4 border border-white/20 group-hover:scale-110 transition-transform group-hover:bg-accent/20 group-hover:border-accent">
                  <Clapperboard className="w-5 h-5 text-text group-hover:text-accent transition-colors" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-accent transition-colors">{studio.name}</h3>
                <p className="text-xs text-muted/80 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 h-0 group-hover:h-auto">
                  {studio.works}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
