import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Lenis from '@studio-freight/lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './index.css'
import App from './App.tsx'
import { DetailPage } from './pages/DetailPage.tsx'
import { CustomCursor } from './components/wedding/CustomCursor'
import { FloatingPetals } from './components/wedding/FloatingPetals'

gsap.registerPlugin(ScrollTrigger)

function AppRoutes() {

  useEffect(() => {
    // Ultra-smooth scrolling setup
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
    })

    // Expose lenis to window for use in other components
    ;(window as any).lenis = lenis

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    lenis.on('scroll', ScrollTrigger.update)

    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.destroy()
      delete (window as any).lenis
    }
  }, [])

  return (
    <div className="route-transition">
      <FloatingPetals count={40} />
      <CustomCursor />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/details/:slug" element={<DetailPage />} />
      </Routes>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </StrictMode>,
)
