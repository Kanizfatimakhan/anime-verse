export default function Marquee({ items = [] }) {
  const list = [...items, ...items]
  return (
    <div style={{
      overflow: 'hidden', borderTop: '1px solid rgba(144,224,239,0.15)',
      borderBottom: '1px solid rgba(144,224,239,0.15)', padding: '12px 0',
      marginBottom: '3rem', background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(10px)'
    }}>
      <div style={{
        display: 'flex', gap: '3rem',
        animation: 'marquee 25s linear infinite',
        width: 'max-content'
      }}>
        {list.map((item, i) => (
          <span key={i} style={{
            fontFamily: 'Bebas Neue', fontSize: '1rem',
            letterSpacing: '0.15em', color: '#333',
            whiteSpace: 'nowrap'
          }}>
            <span style={{ color: '#E63946', marginRight: '1rem' }}>✦</span>
            {item}
          </span>
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}
