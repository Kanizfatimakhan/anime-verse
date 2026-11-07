import TiltCard from './TiltCard'
import { motion } from 'framer-motion'

export default function Grid({ items, title }) {
  return (
    <section style={{ marginBottom: '4rem' }}>
      {title && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}
        >
          <h2 style={{
            fontFamily: 'Bebas Neue', fontSize: '2rem', letterSpacing: '3px',
            color: '#F0EDE8'
          }}>{title}</h2>
          <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, #2a2a2a, transparent)' }} />
          <span style={{ color: 'var(--primary)', fontFamily: 'Bebas Neue', letterSpacing: '2px', fontSize: '0.85rem' }}>
            {items.length} TITLES
          </span>
        </motion.div>
      )}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(155px, 1fr))',
        gap: '18px'
      }}>
        {items.map((anime, i) => (
          <TiltCard key={anime.mal_id} anime={anime} index={i} />
        ))}
      </div>
    </section>
  )
}
