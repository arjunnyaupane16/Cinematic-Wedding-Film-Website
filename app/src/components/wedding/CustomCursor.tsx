import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

interface TrailDot {
  x: number
  y: number
  id: number
  opacity: number
}

let trailId = 0

export const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null)
  const followerRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [isClicking, setIsClicking] = useState(false)
  const [trail, setTrail] = useState<TrailDot[]>([])
  const trailTimerRef = useRef<number | null>(null)
  const posRef = useRef({ x: 0, y: 0 })
  const lastTrailPos = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const cursor = cursorRef.current
    const follower = followerRef.current
    const ring = ringRef.current
    if (!cursor || !follower || !ring) return

    const moveCursor = (e: MouseEvent) => {
      const { clientX: x, clientY: y } = e
      posRef.current = { x, y }

      gsap.to(cursor, { x, y, duration: 0.08, ease: 'power2.out' })
      gsap.to(follower, { x, y, duration: 0.22, ease: 'power2.out' })
      gsap.to(ring, { x, y, duration: 0.5, ease: 'power2.out' })

      // Create trail dots only when moving fast enough
      const dx = x - lastTrailPos.current.x
      const dy = y - lastTrailPos.current.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist > 12) {
        lastTrailPos.current = { x, y }
        const id = trailId++
        setTrail(prev => [...prev.slice(-10), { x, y, id, opacity: 1 }])
        setTimeout(() => {
          setTrail(prev => prev.filter(d => d.id !== id))
        }, 600)
      }
    }

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const isInteractive =
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') ||
        target.closest('a') ||
        target.getAttribute('data-photo-reveal') === 'true'
      setIsHovered(!!isInteractive)
    }

    const handleMouseDown = () => setIsClicking(true)
    const handleMouseUp = () => setIsClicking(false)

    window.addEventListener('mousemove', moveCursor)
    window.addEventListener('mouseover', handleMouseOver)
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousemove', moveCursor)
      window.removeEventListener('mouseover', handleMouseOver)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      if (trailTimerRef.current) clearTimeout(trailTimerRef.current)
    }
  }, [])

  return (
    <>
      {/* Trail dots */}
      {trail.map((dot, i) => (
        <div
          key={dot.id}
          className="fixed pointer-events-none"
          style={{
            left: dot.x - 3,
            top: dot.y - 3,
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: '#8B1538',
            opacity: (i / trail.length) * 0.5,
            transform: `scale(${0.2 + (i / trail.length) * 0.8})`,
            zIndex: 9995,
            transition: 'opacity 0.6s ease',
          }}
        />
      ))}

      {/* Main dot */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none"
        style={{ zIndex: 9999, transform: 'translate(-50%, -50%)' }}
      >
        <div
          className="flex items-center justify-center"
          style={{
            width: isClicking ? '8px' : '10px',
            height: isClicking ? '8px' : '10px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, #ff4d77 0%, #8B1538 100%)',
            boxShadow: '0 0 12px rgba(139,21,56,0.8), 0 0 24px rgba(139,21,56,0.4)',
            transition: 'width 0.1s, height 0.1s, box-shadow 0.2s',
          }}
        />
      </div>

      {/* Follower ring */}
      <div
        ref={followerRef}
        className="fixed top-0 left-0 pointer-events-none"
        style={{ zIndex: 9998, transform: 'translate(-50%, -50%)' }}
      >
        <div
          style={{
            width: isHovered ? '48px' : isClicking ? '20px' : '32px',
            height: isHovered ? '48px' : isClicking ? '20px' : '32px',
            borderRadius: '50%',
            border: `1px solid rgba(139,21,56,${isHovered ? '0.8' : '0.5'})`,
            background: isHovered ? 'rgba(139,21,56,0.12)' : 'transparent',
            transition: 'width 0.3s cubic-bezier(0.34,1.56,0.64,1), height 0.3s cubic-bezier(0.34,1.56,0.64,1), background 0.3s, border-color 0.3s',
          }}
        />
      </div>

      {/* Outer slow ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none"
        style={{ zIndex: 9997, transform: 'translate(-50%, -50%)' }}
      >
        <div
          style={{
            width: isHovered ? '80px' : '60px',
            height: isHovered ? '80px' : '60px',
            borderRadius: '50%',
            border: '1px solid rgba(139,21,56,0.15)',
            transition: 'width 0.5s, height 0.5s',
          }}
        />
      </div>
    </>
  )
}
