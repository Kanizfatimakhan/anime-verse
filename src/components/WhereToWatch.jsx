import { motion } from 'framer-motion'
import { useMemo } from 'react'

const PLATFORM_META = [
  {
    name: 'Crunchyroll',
    hrefBase: 'https://www.crunchyroll.com/search?q=',
    // Simple inline SVG icon (no external assets)
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M7.2 6.6c1.4-1.2 3.3-2 5.3-2 2.6 0 5 .9 6.9 2.6"
          stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
        <path
          d="M6 18c1.6 1.8 3.8 3 6.3 3 2.4 0 4.5-1 6-2.6"
          stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
        <path
          d="M12.1 7.4c2.7 0 4.9 2.2 4.9 4.9s-2.2 4.9-4.9 4.9-4.9-2.2-4.9-4.9 2.2-4.9 4.9-4.9Z"
          stroke="#fff" strokeWidth="2"/>
      </svg>
    )
  },
  {
    name: 'Netflix',
    hrefBase: 'https://www.netflix.com/search?q=',
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M8 3h8l-1.2 17H9.2L8 3Z"
          fill="#fff" opacity="0.92"/>
        <path
          d="M9.4 21c-.2-4.5-.4-9.3-.6-13.3H15.2c-.2 4-.4 8.8-.6 13.3"
          stroke="#fff" strokeWidth="1.6" fill="none" opacity="0.92"/>
      </svg>
    )
  },
  {
    name: 'Amazon Prime Video',
    hrefBase: 'https://www.primevideo.com/search/ref=atv_nb_sr?phrase=',
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2l2.2 6.7H21l-5.5 4 2.1 7.3-5.6-4.1-5.6 4.1 2.1-7.3L3 8.7h6.8L12 2Z" fill="#fff" opacity="0.92"/>
      </svg>
    )
  },
  {
    name: 'Disney+',
    hrefBase: 'https://www.disneyplus.com/search?q=',
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 3c4.3 0 7 2.7 7 7s-2.7 11-7 11S5 14.3 5 10s2.7-7 7-7Z" fill="#fff" opacity="0.92"/>
        <path d="M10.2 9.1h3.5v1.6h-3.5V9.1Zm0 4h3.5v1.6h-3.5v-1.6Z" fill="var(--primary)"/>
      </svg>
    )
  }
]

export default function WhereToWatch({ title }) {
  const resolvedTitle = title ? String(title) : ''

  const buttons = useMemo(() => {
    if (!resolvedTitle) return []
    return PLATFORM_META.map((p) => ({
      ...p,
      href: `${p.hrefBase}${encodeURIComponent(resolvedTitle)}`
    }))
  }, [resolvedTitle])

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{ marginTop: '2rem' }}
    >
      <div
        style={{
          padding: '18px',
          borderRadius: '12px',
          background: 'linear-gradient(180deg, rgba(0,168,232,0.16) 0%, rgba(17,17,17,1) 60%)',
          border: '1px solid rgba(255,255,255,0.06)'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
          <div>
            <p style={{
              color: '#F0EDE8',
              fontSize: '1.15rem',
              fontWeight: 900,
              letterSpacing: '0.08em',
              marginBottom: '6px'
            }}>
              WHERE TO WATCH
            </p>
            <p style={{ color: '#888', fontSize: '0.82rem' }}>
              Official streaming platforms only
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '14px' }}>
          {buttons.map((p) => (
            <a
              key={p.name}
              href={p.href}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                padding: '11px 14px',
                borderRadius: '10px',
                background: 'var(--primary)',
                color: '#fff',
                textDecoration: 'none',
                fontWeight: 800,
                fontSize: '0.86rem',
                letterSpacing: '0.02em',
                transition: 'transform 160ms ease, box-shadow 160ms ease, filter 160ms ease',
                boxShadow: '0 0 0 rgba(0,168,232,0.0)',
                border: '1px solid rgba(255,255,255,0.12)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,168,232,0.35)'
                e.currentTarget.style.filter = 'saturate(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0px)';
                e.currentTarget.style.boxShadow = '0 0 0 rgba(0,168,232,0.0)';
                e.currentTarget.style.filter = 'none';
              }}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{p.icon}</span>
              <span>{p.name}</span>
            </a>
          ))}
        </div>

        {/* Badges */}
        <div style={{ marginTop: '14px', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {buttons.length > 0 ? (
            buttons.map((p) => (
              <span
                key={`badge-${p.name}`}
                style={{
                  padding: '6px 10px',
                  borderRadius: '999px',
background: 'rgba(0,168,232,0.10)',
border: '1px solid rgba(0,168,232,0.35)',
                  color: '#F0EDE8',
                  fontWeight: 700,
                  fontSize: '0.72rem',
                  letterSpacing: '0.04em'
                }}
              >
                Available On: {p.name}
              </span>
            ))
          ) : (
            <span style={{ color: '#888', fontSize: '0.82rem' }}>Check official platforms</span>
          )}
        </div>
      </div>
    </motion.section>
  )
}

