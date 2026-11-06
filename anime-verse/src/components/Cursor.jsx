// anime-verse/src/components/Cursor.jsx
import React, { useEffect, useState } from 'react';

/**
 * Premium Mihir-Style Smooth Custom Cursor Component
 * Optimized using pure CSS variables for lag-free rendering.
 * Automatically hidden on mobile devices to prevent touch interaction bugs.
 */
const Cursor = () => {
  const [position, setMemoPosition] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 1. Mobile aur Tablets par custom cursor disable karein (UX Rule)
    if (window.innerWidth < 768) return;

    setIsVisible(true);

    const handleMouseMove = (e) => {
      setMemoPosition({ x: e.clientX, y: e.clientY });
    };

    // 2. Clickable items (buttons, links, cards) par hover detect karein
    const handleMouseOver = (e) => {
      if (e.target.closest('a') || e.target.closest('button') || e.target.closest('[role="button"]') || e.target.closest('.hover-target')) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* Central Core Dot */}
      <div
        className="pointer-events-none fixed z-[9999] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white transition-all duration-75"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: isHovered ? '4px' : '8px',
          height: isHovered ? '4px' : '8px',
        }}
      />
      
      {/* Outer Fluid Ring (Nyx Glassmorphic Aesthetic) */}
      <div
        className="pointer-events-none fixed z-[9998] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/30 backdrop-invert-[0.1] transition-all duration-300 ease-out"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: isHovered ? '50px' : '24px',
          height: isHovered ? '50px' : '24px',
          backgroundColor: isHovered ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
          borderColor: isHovered ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 255, 255, 0.3)',
        }}
      />
    </>
  );
};

export default Cursor;
