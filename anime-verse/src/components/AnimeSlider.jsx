import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, FreeMode, Mousewheel } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';
import AnimeCard from './AnimeCard';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';

export default function AnimeSlider({ title, items }) {
  const [swiperInstance, setSwiperInstance] = useState(null);

  if (!items || items.length === 0) return null;

  return (
    <div className="py-10 relative group">
      <div className="max-w-7xl mx-auto px-6 mb-6 flex items-end justify-between">
        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-text">
          {title.split(' ').map((word, i, arr) => 
            i === arr.length - 1 ? <span key={i} className="text-primary">{word}</span> : <span key={i}>{word} </span>
          )}
        </h2>
        
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => swiperInstance?.slidePrev()} className="p-2 rounded-full glass hover:bg-white/10 text-text transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={() => swiperInstance?.slideNext()} className="p-2 rounded-full glass hover:bg-white/10 text-text transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="pl-6 xl:pl-[calc((100vw-80rem)/2+1.5rem)]">
        <Swiper
          modules={[Navigation, FreeMode, Mousewheel]}
          onSwiper={setSwiperInstance}
          freeMode={true}
          mousewheel={{ forceToAxis: true }}
          spaceBetween={20}
          slidesPerView="auto"
          className="!overflow-visible"
        >
          {items.map((anime, i) => (
            <SwiperSlide key={anime.mal_id} className="!w-[160px] md:!w-[220px]">
              <AnimeCard anime={anime} index={i % 10} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
