import { useMemo, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Float, Html, OrbitControls, Stars, Text } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';
import { Bookmark, Compass, Sparkles } from 'lucide-react';
import { useWatchlist } from '../hooks/useWatchlist';
import { SEED_ANIME_LIST } from '../data/animeSeedData';
import { getAnimeRouteId } from '../utils/animeApi';

const FEATURED_IDS = [52991, 5114, 40748, 16498, 38000, 9253, 1535, 32281];
const FEATURED_ANIME = FEATURED_IDS
  .map(id => SEED_ANIME_LIST.find(anime => anime.mal_id === id))
  .filter(Boolean);

function Exhibit({ anime, position, rotation, onSelect }) {
  const [imageFailed, setImageFailed] = useState(false);
  const title = anime.title_english || anime.title;
  const image = anime.images?.webp?.large_image_url ||
    anime.images?.jpg?.large_image_url ||
    anime.images?.webp?.image_url ||
    anime.images?.jpg?.image_url;

  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0, -0.08]}>
        <boxGeometry args={[2.35, 3.45, 0.16]} />
        <meshStandardMaterial color="#211b35" metalness={0.65} roughness={0.3} emissive="#30145a" emissiveIntensity={0.2} />
      </mesh>
      <mesh position={[0, -1.92, -0.18]}>
        <boxGeometry args={[1.3, 0.65, 0.55]} />
        <meshStandardMaterial color="#181622" metalness={0.7} roughness={0.28} />
      </mesh>
      <Html transform position={[0, 0, 0.02]} distanceFactor={7} style={{ pointerEvents: 'auto' }}>
        <button
          type="button"
          onClick={event => {
            event.stopPropagation();
            onSelect(getAnimeRouteId(anime));
          }}
          className="group relative block h-[clamp(150px,40vw,300px)] w-[clamp(100px,27vw,200px)] overflow-hidden rounded-lg border-2 border-violet-300/50 bg-zinc-900 text-left shadow-[0_0_24px_rgba(124,58,237,0.3)] transition hover:border-cyan-300"
          title={`View ${title}`}
        >
          {!imageFailed && image ? (
            <img
              src={image}
              alt={`${title} poster`}
              className="h-full w-full object-cover"
              onError={() => setImageFailed(true)}
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-violet-950 to-zinc-950 p-4 text-center">
              <span className="text-xl font-black uppercase text-white">{title}</span>
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/80 to-transparent px-3 pb-3 pt-12">
            <p className="line-clamp-2 text-sm font-bold text-white">{title}</p>
            <p className="mt-1 text-[11px] text-violet-200">
              {anime.score ? `★ ${anime.score}` : 'Featured anime'}
              {anime.year ? ` · ${anime.year}` : ''}
            </p>
          </div>
        </button>
      </Html>
    </group>
  );
}

function MuseumRoom({ exhibits, onSelect }) {
  const radius = 8.5;
  const positioned = useMemo(() => exhibits.map((anime, index) => {
    const angle = (index / exhibits.length) * Math.PI * 2;
    return {
      anime,
      position: [Math.cos(angle) * radius, 2.45, Math.sin(angle) * radius],
      rotation: [0, -angle - Math.PI / 2, 0],
    };
  }), [exhibits]);

  return (
    <>
      <color attach="background" args={['#070611']} />
      <ambientLight intensity={0.8} />
      <pointLight position={[0, 7, 0]} intensity={70} distance={20} color="#9b67ff" />
      <pointLight position={[0, 4, 8]} intensity={35} distance={18} color="#38bdf8" />
      <Stars radius={45} depth={30} count={1800} factor={3} saturation={0.4} fade speed={0.25} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <circleGeometry args={[15, 96]} />
        <meshStandardMaterial color="#11101c" metalness={0.45} roughness={0.5} />
      </mesh>
      <gridHelper args={[28, 28, '#543a85', '#26223a']} position={[0, 0, 0]} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]}>
        <ringGeometry args={[10.5, 10.58, 96]} />
        <meshBasicMaterial color="#38bdf8" />
      </mesh>

      <Float speed={1.2} rotationIntensity={0.12} floatIntensity={0.18}>
        <mesh position={[0, 1.65, 0]}>
          <icosahedronGeometry args={[0.8, 1]} />
          <meshStandardMaterial color="#7845c7" emissive="#6d28d9" emissiveIntensity={1.2} wireframe />
        </mesh>
      </Float>
      <Text position={[0, 0.7, 0]} fontSize={0.34} color="#e9ddff" anchorX="center" anchorY="middle">
        ANIMEVERSE
      </Text>
      <Text position={[0, 0.28, 0]} fontSize={0.16} color="#a9a0bd" anchorX="center" anchorY="middle">
        HALL OF FAME
      </Text>

      {positioned.map(({ anime, position, rotation }) => (
        <Exhibit
          key={anime.mal_id}
          anime={anime}
          position={position}
          rotation={rotation}
          onSelect={onSelect}
        />
      ))}
      <OrbitControls
        target={[0, 1.5, 0]}
        enablePan={false}
        minDistance={7}
        maxDistance={18}
        maxPolarAngle={Math.PI / 2 - 0.08}
        enableDamping
        dampingFactor={0.06}
      />
    </>
  );
}

export default function Museum() {
  const { watchlist } = useWatchlist();
  const [showWatchlist, setShowWatchlist] = useState(false);
  const navigate = useNavigate();
  const exhibits = showWatchlist && watchlist.length ? watchlist : FEATURED_ANIME;
  const isShowingWatchlist = showWatchlist && watchlist.length > 0;

  return (
    <section className="relative h-[calc(100dvh-4rem)] min-h-[420px] overflow-hidden bg-[#070611] text-white sm:min-h-[600px]">
      <Canvas camera={{ position: [0, 4.5, 15], fov: 50 }} dpr={[1, 1.25]}>
        <MuseumRoom exhibits={exhibits} onSelect={id => navigate(`/anime/${id}`)} />
      </Canvas>

      <header className="pointer-events-none absolute inset-x-0 top-5 z-10 flex flex-col items-center px-4 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-black/50 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-violet-200 backdrop-blur">
          <Sparkles className="h-3.5 w-3.5" /> Virtual Anime Museum
        </div>
        <h1 className="mt-2 text-2xl font-black uppercase tracking-tight drop-shadow-lg sm:text-3xl">
          {isShowingWatchlist ? 'Your Collection' : 'Hall of Fame'}
        </h1>
        <p className="mt-1 text-xs text-white/65">Drag to explore · Select any poster for details</p>
      </header>

      <div className="absolute right-4 top-28 z-20 sm:right-6 sm:top-5">
        {watchlist.length > 0 && (
          <button
            type="button"
            onClick={() => setShowWatchlist(value => !value)}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/60 px-3 py-2 text-[10px] font-bold uppercase tracking-wide backdrop-blur transition hover:border-primary/60 sm:px-4 sm:text-xs"
          >
            <Bookmark className="h-3.5 w-3.5" />
            {isShowingWatchlist ? 'Hall of Fame' : 'My Watchlist'}
          </button>
        )}
      </div>

      <div className="pointer-events-none absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-black/50 px-4 py-2 text-[10px] text-white/70 backdrop-blur sm:text-xs">
        <Compass className="h-3.5 w-3.5 text-cyan-300" />
        Drag to rotate · Scroll to zoom · Click a poster to open
      </div>
    </section>
  );
}
