// anime-verse/src/components/TiltCard.jsx
import React, { useState, useRef } from 'react';

const TiltCard = ({ children, className = "" }) => {
  const cardRef = useRef(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  // Desktop viewport par mouse move handle karne ke liye (3D effect)
  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;

    // Mobile screens par performance bachane ke liye tilt calculations skip karein
    if (window.innerWidth < 768) return;

    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left - box.width / 2;
    const y = e.clientY - box.top - box.height / 2;

    // Standard tilt constraints (-15deg to 15deg max)
    setRotateX(-y / (box.height / 30));
    setRotateY(x / (box.width / 30));
  };

  // Mouse leave hone par variables ko smoothly normal 0 par reset karein
  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transition: 'transform 0.1s ease-out',
      }}
      className={`
        relative overflow-hidden rounded-2xl 
        border border-white/10 bg-zinc-900/40 backdrop-blur-md 
        p-5 text-white shadow-2xl transition-all duration-300 
        hover:border-white/20 hover:bg-zinc-900/60
        ${className}
      `}
    >
      {/* Mihir-Style Premium Soft Inner Glow Effect */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/5 to-transparent mix-blend-overlay" />
      
      {/* Render internal anime card details/children cleanly */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default TiltCard;
