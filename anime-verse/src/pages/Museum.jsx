import { Canvas } from '@react-three/fiber';
import { PointerLockControls, Stars, Text, Image } from '@react-three/drei';
import { Suspense, useMemo } from 'react';
import { useWatchlist } from '../hooks/useWatchlist';
import * as THREE from 'three';

// A single painting on the wall
function GalleryFrame({ position, rotation, url, title }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Frame Box */}
      <mesh position={[0, 0, -0.05]}>
        <boxGeometry args={[2.2, 3.2, 0.1]} />
        <meshStandardMaterial color="#111" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Poster Image */}
      <Suspense fallback={
        <mesh>
          <planeGeometry args={[2, 3]} />
          <meshBasicMaterial color="#333" />
        </mesh>
      }>
        <Image url={url} scale={[2, 3]} position={[0, 0, 0.01]} />
      </Suspense>
      {/* Glow / Light */}
      <pointLight position={[0, 0, 1]} intensity={0.5} color="#7C3AED" distance={3} />
    </group>
  );
}

// The Museum Environment
function MuseumEnvironment({ watchlist }) {
  // Generate random positions along a circular wall for the posters
  const frames = useMemo(() => {
    return watchlist.slice(0, 10).map((anime, i) => {
      const angle = (i / Math.min(watchlist.length, 10)) * Math.PI * 2;
      const radius = 8;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      return {
        id: anime.mal_id,
        url: anime.images?.webp?.large_image_url || anime.images?.jpg?.large_image_url,
        title: anime.title,
        position: [x, 1.5, z],
        rotation: [0, -angle - Math.PI / 2, 0]
      };
    });
  }, [watchlist]);

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#09090B" roughness={0.1} metalness={0.8} />
        <gridHelper args={[50, 50, '#38BDF8', '#7C3AED']} rotation={[Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} />
      </mesh>
      
      {/* Stars/Space Background */}
      <Stars radius={50} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

      {/* Center Pedestal */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[1, 1, 1, 32]} />
        <meshStandardMaterial color="#7C3AED" emissive="#7C3AED" emissiveIntensity={0.5} />
      </mesh>
      <Text position={[0, 1.5, 0]} fontSize={0.5} color="#fff" outlineWidth={0.02} outlineColor="#000">
        YOUR WATCHLIST
      </Text>

      {/* Posters */}
      {frames.map((frame) => (
        <GalleryFrame key={frame.id} {...frame} />
      ))}
      
      <ambientLight intensity={0.2} />
    </group>
  );
}

export default function Museum() {
  const { watchlist } = useWatchlist();

  return (
    <div className="w-full h-screen bg-black relative">
      <div className="absolute top-24 left-1/2 -translate-x-1/2 z-10 pointer-events-none text-center">
        <h1 className="text-2xl font-black uppercase tracking-[0.2em] text-white mix-blend-difference">
          Virtual Museum
        </h1>
        <p className="text-white/70 text-sm mt-2 mix-blend-difference bg-black/50 px-4 py-1 rounded-full">
          Click to look around. Press ESC to exit pointer lock. WASD to move (if enabled).
        </p>
      </div>

      <Canvas shadows camera={{ position: [0, 1.6, 5], fov: 60 }}>
        <MuseumEnvironment watchlist={watchlist} />
        <PointerLockControls />
      </Canvas>
    </div>
  );
}
