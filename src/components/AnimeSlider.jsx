import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, FreeMode, Mousewheel } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';
import AnimeCard from './AnimeCard';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { useState } from 'react';

export default function AnimeSlider({ title, items }) {
  const [swiperInstance, setSwiperInstance] = useState(null);

  if (!items || items.length === 0) return null;
  const handleKeyDown = event => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      swiperInstance?.slidePrev();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      swiperInstance?.slideNext();
    }
  };

  return (
    <section className="group relative py-5 sm:py-6" onKeyDown={handleKeyDown}>
      <div className="mx-auto mb-4 flex max-w-7xl items-end justify-between gap-4 px-1 sm:mb-5 sm:px-6">
        <div>
          <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-violet-300/80 sm:text-[11px]">
            AnimeVerse picks
          </p>
          <h2 className="section-heading text-white">
            {title.split(' ').map((word, i, arr) =>
              i === arr.length - 1 ? <span key={i} className="text-violet-200">{word}</span> : <span key={i}>{word} </span>
            )}
          </h2>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <span className="hidden text-[10px] text-white/30 sm:inline">← →</span>
          <button aria-label={`Previous ${title} anime`} onClick={() => swiperInstance?.slidePrev()} className="rounded-full border border-white/10 bg-white/[0.04] p-2 text-white/75 transition-colors hover:bg-white/10 hover:text-white">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button aria-label={`Next ${title} anime`} onClick={() => swiperInstance?.slideNext()} className="rounded-full border border-white/10 bg-white/[0.04] p-2 text-white/75 transition-colors hover:bg-white/10 hover:text-white">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="pl-4 sm:pl-6 xl:pl-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))]">
        <Swiper
          modules={[Navigation, FreeMode, Mousewheel]}
          onSwiper={setSwiperInstance}
          freeMode={true}
          mousewheel={{ forceToAxis: true }}
          spaceBetween={14}
          slidesPerView="auto"
          className="!overflow-visible"
        >
          {items.map((anime, i) => (
            <SwiperSlide key={anime.mal_id} className="!w-[144px] sm:!w-[176px] lg:!w-[196px]">
              <AnimeCard anime={anime} index={i % 10} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
