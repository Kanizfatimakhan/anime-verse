import React, { Suspense, useEffect, useState, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, Html, Text, Float } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import axios from 'axios';

// ─── Single Anime Star/Orb ───────────────────────────────────────────────────
function AnimeOrb({ anime, position }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();

  const color = hovered ? '#F472B6' : '#7C3AED';
  const emissive = hovered ? '#F472B6' : '#4C1D95';

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5 + position[0]) * 0.2;
    }
  });

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onClick={() => navigate(`/anime/${anime.mal_id}`)}
        onPointerOver={() => { setHovered(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = 'default'; }}
      >
        <icosahedronGeometry args={[hovered ? 0.45 : 0.35, 1]} />
        <meshStandardMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={hovered ? 2 : 0.6}
          roughness={0.2}
          metalness={0.8}
          wireframe={false}
        />
      </mesh>

      {/* Glow ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.55, 0.04, 8, 32]} />
        <meshStandardMaterial
          color={hovered ? '#F472B6' : '#38BDF8'}
          emissive={hovered ? '#F472B6' : '#38BDF8'}
          emissiveIntensity={1}
          transparent
          opacity={hovered ? 1 : 0.4}
        />
      </mesh>

      {/* Point light around orb */}
      <pointLight
        color={hovered ? '#F472B6' : '#7C3AED'}
        intensity={hovered ? 3 : 0.8}
        distance={3}
      />

      {/* Hover label */}
      {hovered && (
        <Html distanceFactor={6} center>
          <div style={{
            background: 'rgba(10,2,26,0.92)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(244,114,182,0.4)',
            borderRadius: '12px',
            padding: '10px 14px',
            maxWidth: '180px',
            textAlign: 'center',
            pointerEvents: 'none',
            boxShadow: '0 0 20px rgba(244,114,182,0.3)',
          }}>
            <img
              src={anime.images?.webp?.image_url}
              alt={anime.title}
              style={{ width: '60px', height: '80px', objectFit: 'cover', borderRadius: '8px', marginBottom: '6px' }}
            />
            <p style={{ color: '#fff', fontSize: '11px', fontWeight: '800', margin: 0, lineHeight: 1.3 }}>
              {anime.title_english || anime.title}
            </p>
            {anime.score && (
              <p style={{ color: '#F472B6', fontSize: '10px', marginTop: '4px', fontWeight: '700' }}>
                ⭐ {anime.score}
              </p>
            )}
            <p style={{ color: '#aaa', fontSize: '9px', marginTop: '2px' }}>Click to explore →</p>
          </div>
        </Html>
      )}
    </group>
  );
}

// ─── Galaxy Scene ────────────────────────────────────────────────────────────
function GalaxyScene({ animeList }) {
  // Spread anime around a sphere
  const positions = animeList.map((_, i) => {
    const phi = Math.acos(-1 + (2 * i) / animeList.length);
    const theta = Math.sqrt(animeList.length * Math.PI) * phi;
    const r = 6 + Math.random() * 3;
    return [
      r * Math.cos(theta) * Math.sin(phi),
      r * Math.sin(theta) * Math.sin(phi),
      r * Math.cos(phi),
    ];
  });

  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 0, 0]} intensity={3} color="#7C3AED" distance={20} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#38BDF8" />
      <pointLight position={[-10, -10, -10]} intensity={1} color="#F472B6" />

      {/* Background stars */}
      <Stars radius={80} depth={60} count={6000} factor={3} saturation={0} fade speed={0.5} />

      {/* Center glowing core */}
      <Float speed={1} rotationIntensity={0.5} floatIntensity={0.3}>
        <mesh>
          <sphereGeometry args={[0.8, 32, 32]} />
          <meshStandardMaterial
            color="#7C3AED"
            emissive="#7C3AED"
            emissiveIntensity={3}
            roughness={0}
            metalness={1}
          />
        </mesh>
        <pointLight color="#7C3AED" intensity={8} distance={8} />
      </Float>

      {/* Anime orbs */}
      {animeList.map((anime, i) => (
        <AnimeOrb key={anime.mal_id} anime={anime} position={positions[i]} />
      ))}
    </>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function Viewer3D() {
  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get('https://api.jikan.moe/v4/top/anime?limit=25');
        setAnimeList(res.data.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <div className="w-full h-screen bg-[#030014] relative overflow-hidden">

      {/* HUD - Top info */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 z-10 text-center pointer-events-none">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-bold uppercase tracking-widest mb-2">
          ✦ Interactive Anime Galaxy
        </div>
        <h1 className="text-2xl font-black text-white uppercase tracking-tight">
          Top 25 Anime Universe
        </h1>
        <p className="text-white/50 text-xs mt-1">Hover to preview · Click to explore any anime</p>
      </div>

      {/* Controls hint - bottom */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-6 text-white/40 text-xs pointer-events-none">
        <span>🖱️ Drag: Rotate</span>
        <span>📍 Scroll: Zoom</span>
        <span>✨ Click orb: Open Anime</span>
      </div>

      {/* Loading */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center z-20 bg-[#030014]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-primary font-bold uppercase tracking-widest text-sm">Building Galaxy...</p>
          </div>
        </div>
      )}

      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 0, 14], fov: 60 }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          {!loading && <GalaxyScene animeList={animeList} />}
        </Suspense>
        <OrbitControls
          enablePan={false}
          minDistance={5}
          maxDistance={22}
          autoRotate
          autoRotateSpeed={0.4}
          enableDamping
          dampingFactor={0.05}
        />
      </Canvas>
    </div>
  );
}
