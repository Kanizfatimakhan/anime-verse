import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useWatchlist } from '../hooks/useWatchlist'

export default function TiltCard({ anime, index = 0 }) {
  const cardRef = useRef(null)
  const glowRef = useRef(null)
  const { add, remove, isIn } = useWatchlist()
  const inList = isIn(anime.mal_id)

  const handleMouseMove = (e) => {
    const card = cardRef.current
    if (!card) return

    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const cx = rect.width / 2
    const cy = rect.height / 2

    const rotX = ((y - cy) / cy) * -12
    const rotY = ((x - cx) / cx) * 12

    card.style.transform =
      `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.04,1.04,1.04)`

    if (glowRef.current) {
      glowRef.current.style.background =
        `radial-gradient(circle at ${x}px ${y}px,
        rgba(0,168,232,0.18),
        transparent 60%)`
    }
  }

  const handleMouseLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.transform =
        'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)'
    }

    if (glowRef.current) {
      glowRef.current.style.background = 'transparent'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.5 }}
      style={{ position: 'relative' }}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          position: 'relative',
          borderRadius: '14px',
          overflow: 'hidden',
          aspectRatio: '2/3',

          background: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(144,224,239,0.15)',

          transition: 'transform 0.15s ease',
          transformStyle: 'preserve-3d',

          boxShadow: '0 10px 35px rgba(0,0,0,0.4)'
        }}
      >
        <Link to={`/anime/${anime.mal_id}`}>
          <img
            src={anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url}
            alt={anime.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block'
            }}
          />

          {/* Glow overlay */}
          <div
            ref={glowRef}
            style={{
              position: 'absolute',
              inset: 0,
              transition: 'background 0.15s',
              pointerEvents: 'none'
            }}
          />

          {/* Gradient bottom */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent 60%)'
          }} />

          {/* Score badge */}
          {anime.score && (
            <div style={{
              position: 'absolute',
              top: 10,
              left: 10,
              background: '#00A8E8',
              color: '#fff',
              fontSize: '0.7rem',
              fontWeight: 800,
              padding: '3px 8px',
              borderRadius: '4px'
            }}>
              ★ {anime.score}
            </div>
          )}

          {/* Info */}
          <div style={{
            position: 'absolute',
            bottom: 12,
            left: 12,
            right: 12
          }}>
            <p style={{
              fontSize: '0.82rem',
              fontWeight: 600,
              color: '#EAF6FF',
              marginBottom: 4
            }}>
              {anime.title_english || anime.title}
            </p>

            <p style={{
              fontSize: '0.7rem',
              color: '#8AA6B8'
            }}>
              {anime.type || 'TV'} · {anime.episodes ? `${anime.episodes} eps` : 'Ongoing'}
            </p>
          </div>
        </Link>

        {/* Watchlist button */}
        <button
          onClick={() => inList ? remove(anime.mal_id) : add(anime)}
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            width: 30,
            height: 30,
            background: 'rgba(255,255,255,0.08)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(144,224,239,0.2)',
            color: '#EAF6FF',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {inList ? '♥' : '+'}
        </button>
      </div>
    </motion.div>
  )
}