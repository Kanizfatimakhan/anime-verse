import { useEffect, useRef, useState } from 'react'

export default function Cursor() {
  const cursor = useRef(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    const update = () => setIsMobile(!!mq.matches)
    update()

    // Safari/old browsers: prefer addListener/removeListener fallback
    if (mq.addEventListener) mq.addEventListener('change', update)
    else mq.addListener(update)

    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', update)
      else mq.removeListener(update)
    }
  }, [])

  useEffect(() => {
    if (isMobile) return

    let x = 0, y = 0
    let cx = 0, cy = 0

    const move = (e) => {
      x = e.clientX
      y = e.clientY
    }

    window.addEventListener('mousemove', move)

    const animate = () => {
      cx += (x - cx) * 0.15
      cy += (y - cy) * 0.15

      if (cursor.current) {
        cursor.current.style.transform = `translate(${cx}px, ${cy}px)`
      }

      requestAnimationFrame(animate)
    }

    requestAnimationFrame(animate)

    return () => window.removeEventListener('mousemove', move)
  }, [isMobile])

  return (
    <>
      {!isMobile && (
        <>
          {/* Single soft cursor */}
          <div
            ref={cursor}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,

              width: 18,
              height: 18,
              background: 'var(--primary)',
              borderRadius: '50%',
              pointerEvents: 'none',
              zIndex: 9999,
              transform: 'translate(-50%, -50%)',
              boxShadow: '0 0 12px rgba(230,57,70,0.6)',
              transition: 'transform 0.05s linear'
            }}
          />

          {/* hide default cursor */}
          <style>{`
            * { cursor: none !important; }
          `}</style>
        </>
      )}
    </>
  )
}
