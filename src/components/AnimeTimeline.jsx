import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const decades = [
  { year: '1980s', desc: 'The Golden Age', image: 'https://cdn.myanimelist.net/images/anime/4/50361l.jpg' }, // Akira
  { year: '1990s', desc: 'The Masterpieces', image: 'https://cdn.myanimelist.net/images/anime/10/47347l.jpg' }, // Evangelion
  { year: '2000s', desc: 'The Big Three Era', image: 'https://cdn.myanimelist.net/images/anime/13/17405l.jpg' }, // Naruto
  { year: '2010s', desc: 'The Isekai Boom', image: 'https://cdn.myanimelist.net/images/anime/1122/96435l.jpg' }, // Attack on Titan
  { year: '2020s', desc: 'Modern Cinematic', image: 'https://cdn.myanimelist.net/images/anime/1171/109222l.jpg' }, // Jujutsu Kaisen
];

export default function AnimeTimeline() {
  const navigate = useNavigate();

  return (
    <section className="py-20 relative">
      <div className="page-container">
        <div className="flex items-center gap-3 mb-12">
          <Calendar className="w-8 h-8 text-primary" />
          <h2 className="text-3xl font-black uppercase tracking-tight text-text">
            Era <span className="text-primary">Timeline</span>
          </h2>
        </div>

        <div className="relative">
          {/* Main Line */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-white/5 -translate-y-1/2 hidden md:block rounded-full" />
          
          <div className="flex flex-col md:flex-row gap-8 justify-between relative z-10">
            {decades.map((era, i) => (
              <motion.div
                key={era.year}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                className="flex-1 flex flex-col items-center group cursor-pointer"
                onClick={() => navigate(`/search?q=${era.year}`)}
              >
                {/* Node */}
                <div className="w-4 h-4 bg-background border-2 border-primary rounded-full mb-6 relative z-20 group-hover:scale-150 transition-transform group-hover:bg-primary" />
                
                {/* Card */}
                <div className="w-full max-w-sm mx-auto relative aspect-[3/4] rounded-xl overflow-hidden glass group-hover:-translate-y-2 transition-transform duration-300">
                  <img src={era.image} alt={era.year} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-center transform translate-y-4 group-hover:translate-y-0 transition-transform">
                    <h3 className="text-2xl font-black text-white tracking-wider mb-1">{era.year}</h3>
                    <p className="text-xs text-primary font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                      {era.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
