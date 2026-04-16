import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
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
  const location = useLocation()

  useEffect(() => {
    // Ultra-smooth scrolling setup
    const lenis = new Lenis({
      duration: 2.2,
      easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -12 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.6,
    })

    lenis.on('scroll', ScrollTrigger.update)

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })

    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.destroy()
      gsap.ticker.remove(lenis.raf)
    }
  }, [])

  return (
    <div key={location.pathname} className="route-transition">
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
