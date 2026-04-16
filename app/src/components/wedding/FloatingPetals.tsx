import { useEffect, useRef } from 'react'

interface Petal {
  x: number
  y: number
  vx: number
  vy: number
  rotation: number
  rotationSpeed: number
  scale: number
  opacity: number
  color: string
  swayOffset: number
  swaySpeed: number
  swayAmp: number
}

const PETAL_COLORS = [
  '#8B1538',
  '#a31d44',
  '#c23456',
  '#6d1030',
  '#ff8fa8',
  '#e8b4c0',
  '#ff6b8a',
]

function createPetal(canvasWidth: number, spawnAtTop = false): Petal {
  return {
    x: Math.random() * canvasWidth,
    y: spawnAtTop ? -30 - Math.random() * 200 : Math.random() * window.innerHeight,
    vx: (Math.random() - 0.5) * 0.6,
    vy: 0.5 + Math.random() * 1.2,
    rotation: Math.random() * 360,
    rotationSpeed: (Math.random() - 0.5) * 2.5,
    scale: 0.4 + Math.random() * 0.9,
    opacity: 0.2 + Math.random() * 0.6,
    color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
    swayOffset: Math.random() * Math.PI * 2,
    swaySpeed: 0.008 + Math.random() * 0.012,
    swayAmp: 0.4 + Math.random() * 1.0,
  }
}

function drawPetal(ctx: CanvasRenderingContext2D, petal: Petal) {
  ctx.save()
  ctx.translate(petal.x, petal.y)
  ctx.rotate((petal.rotation * Math.PI) / 180)
  ctx.scale(petal.scale, petal.scale)
  ctx.globalAlpha = petal.opacity

  // Draw a rose petal shape
  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.bezierCurveTo(8, -12, 18, -14, 20, -6)
  ctx.bezierCurveTo(22, 2, 14, 10, 0, 14)
  ctx.bezierCurveTo(-14, 10, -22, 2, -20, -6)
  ctx.bezierCurveTo(-18, -14, -8, -12, 0, 0)
  ctx.closePath()

  const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, 22)
  grad.addColorStop(0, `${petal.color}ff`)
  grad.addColorStop(0.6, `${petal.color}cc`)
  grad.addColorStop(1, `${petal.color}55`)
  ctx.fillStyle = grad
  ctx.fill()

  // Sheen
  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.bezierCurveTo(4, -8, 10, -10, 10, -4)
  ctx.bezierCurveTo(10, 2, 4, 6, 0, 8)
  ctx.fillStyle = 'rgba(255,255,255,0.12)'
  ctx.fill()

  ctx.restore()
}

export const FloatingPetals = ({ count = 35 }: { count?: number }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let frame = 0

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Initialize petals scattered across screen
    const petals: Petal[] = Array.from({ length: count }, () =>
      createPetal(canvas.width, false)
    )

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      frame++

      petals.forEach((petal, i) => {
        // Sway
        petal.x += petal.vx + Math.sin(frame * petal.swaySpeed + petal.swayOffset) * petal.swayAmp
        petal.y += petal.vy
        petal.rotation += petal.rotationSpeed

        drawPetal(ctx, petal)

        // Reset when off screen
        if (petal.y > canvas.height + 40) {
          petals[i] = createPetal(canvas.width, true)
        }
        if (petal.x < -40) petals[i].x = canvas.width + 20
        if (petal.x > canvas.width + 40) petals[i].x = -20
      })

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
    }
  }, [count])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 5, mixBlendMode: 'screen' }}
      aria-hidden="true"
    />
  )
}
