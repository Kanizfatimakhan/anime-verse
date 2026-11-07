import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const decades = [
  { year: '1980s', from: 1980, to: 1989, desc: 'The Golden Age', image: 'https://cdn.myanimelist.net/images/anime/4/50361l.jpg' },
  { year: '1990s', from: 1990, to: 1999, desc: 'The Masterpieces', image: 'https://cdn.myanimelist.net/images/anime/10/47347l.jpg' },
  { year: '2000s', from: 2000, to: 2009, desc: 'The Big Three Era', image: 'https://cdn.myanimelist.net/images/anime/13/17405l.jpg' },
  { year: '2010s', from: 2010, to: 2019, desc: 'The Isekai Boom', image: 'https://cdn.myanimelist.net/images/anime/1122/96435l.jpg' },
  { year: '2020s', from: 2020, to: 2029, desc: 'Modern Cinematic', image: 'https://cdn.myanimelist.net/images/anime/1171/109222l.jpg' },
];

export default function AnimeTimeline() {
  const navigate = useNavigate();

  return (
    <section className="relative py-10 sm:py-12">
      <div className="page-container">
        <div className="mb-7 flex items-center gap-3 sm:mb-8">
          <Calendar className="w-8 h-8 text-primary" />
          <h2 className="text-3xl font-black uppercase tracking-tight text-text">
            Era <span className="text-primary">Timeline</span>
          </h2>
        </div>

        <div className="relative">
          {/* Main Line */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-white/5 -translate-y-1/2 hidden md:block rounded-full" />
          
          <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-3 no-scrollbar relative z-10 md:mx-0 md:flex-row md:gap-6 md:overflow-visible md:px-0 md:pb-0">
            {decades.map((era, i) => (
              <motion.button
                type="button"
                key={era.year}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                className="group flex w-[74vw] max-w-64 shrink-0 snap-center cursor-pointer flex-col items-center border-0 bg-transparent p-0 text-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-4 md:flex-1"
                aria-label={`Browse anime from the ${era.year}`}
                onClick={() => navigate(`/search?from=${era.from}&to=${era.to}`)}
              >
                {/* Node */}
                <div className="relative z-20 mb-4 h-4 w-4 rounded-full border-2 border-primary bg-background transition-transform group-hover:scale-150 group-hover:bg-primary md:mb-6" />
                
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
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
