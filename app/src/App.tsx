import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import './App.css'
import { TopNav } from './components/wedding/TopNav'
import { MobileMenu } from './components/wedding/MobileMenu'
import { SearchOverlay } from './components/wedding/SearchOverlay'
import type { WeddingNavSection } from './components/wedding/nav-types'
import { weddingConfig } from './config/wedding'
import { LazyImage } from './components/wedding/LazyImage'

gsap.registerPlugin(ScrollTrigger)

function App() {
  const navigate = useNavigate()
  const [showPreloader, setShowPreloader] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [headerScrolled, setHeaderScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')
  const [a11yMode, setA11yMode] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const heroRef = useRef<HTMLDivElement>(null)
  const roseRef = useRef<HTMLVideoElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const scrollTriggersRef = useRef<ScrollTrigger[]>([])
  const longPressTimerRef = useRef<number | null>(null)

  // Cinematic preloader on first website visit only
  useEffect(() => {
    const hasSeenPreloader = window.sessionStorage.getItem('wedding-preloader-seen') === 'true'
    if (hasSeenPreloader) {
      setShowPreloader(false)
      return
    }

    setShowPreloader(true)
    const timer = window.setTimeout(() => {
      setShowPreloader(false)
      window.sessionStorage.setItem('wedding-preloader-seen', 'true')
    }, 2600)

    return () => window.clearTimeout(timer)
  }, [])

  // Lock page scrolling only for fully blocking overlays
  useEffect(() => {
    const shouldLockScroll = showPreloader || searchOpen
    document.body.style.overflow = shouldLockScroll ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [showPreloader, searchOpen])

  // Escape key closes open overlays
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      if (menuOpen) setMenuOpen(false)
      if (searchOpen) setSearchOpen(false)
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [menuOpen, searchOpen])

  // Header scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setHeaderScrolled(window.scrollY > 100)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Accessibility mode persistence
  useEffect(() => {
    const saved = window.localStorage.getItem('wedding-a11y-mode')
    if (saved === 'true') setA11yMode(true)
  }, [])

  useEffect(() => {
    window.localStorage.setItem('wedding-a11y-mode', String(a11yMode))
  }, [a11yMode])

  // Hero animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Rose spiral entrance
      gsap.fromTo(roseRef.current,
        { opacity: 0, scale: 0.5, rotation: -180 },
        { opacity: 1, scale: 1, rotation: 0, duration: 3.2, ease: 'power2.out', delay: 0.45 }
      )

      // Title reveal
      gsap.fromTo('.hero-title-line',
        { clipPath: 'inset(0 100% 0 0)' },
        { clipPath: 'inset(0 0% 0 0)', duration: 2.2, ease: 'power2.out', delay: 1.15, stagger: 0.32 }
      )

      // Scroll indicator
      gsap.fromTo('.scroll-indicator',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1.4, ease: 'power2.out', delay: 3.9 }
      )
    }, heroRef)

    return () => ctx.revert()
  }, [])

  // Scroll-triggered section animations
  useEffect(() => {
    const sections = document.querySelectorAll('.animate-section')
    
    sections.forEach((section) => {
      const st = ScrollTrigger.create({
        trigger: section,
        start: 'top 80%',
        onEnter: () => {
          gsap.to(section.querySelectorAll('.fade-up'), {
            opacity: 1,
            y: 0,
            duration: 1.25,
            ease: 'power2.out',
            stagger: 0.14
          })
          gsap.to(section.querySelectorAll('.curtain-reveal'), {
            clipPath: 'inset(0 0% 0 0)',
            duration: 1.75,
            ease: 'power1.inOut'
          })
        },
        once: true
      })
      scrollTriggersRef.current.push(st)
    })

    return () => {
      scrollTriggersRef.current.forEach(st => st.kill())
      scrollTriggersRef.current = []
    }
  }, [])

  // Track active section for nav highlighting
  useEffect(() => {
    const ids = ['hero', 'story', 'ceremony', 'venue', 'gallery', 'rsvp']
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible.length > 0) {
          setActiveSection(visible[0].target.id)
        }
      },
      { root: null, threshold: [0.35, 0.6, 0.85], rootMargin: '-10% 0px -35% 0px' }
    )

    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  // Carousel images + captions
  const carouselSlides = [
    { id: 'save-the-date-frame', src: '/images/black-rose-hero.jpg', caption: 'The Save The Date' },
    { id: 'first-look-frame', src: '/images/car-exterior-1.jpg', caption: 'The First Look' },
    { id: 'ceremony-portrait-frame', src: '/images/car-front.jpg', caption: 'Ceremony Portrait' },
    { id: 'florals-details-frame', src: '/images/car-rear.jpg', caption: 'Florals & Details' },
    { id: 'venue-frame', src: '/images/car-interior.jpg', caption: 'The Venue' },
    { id: 'evening-portraits-frame', src: '/images/car-top.jpg', caption: 'Evening Portraits' },
    { id: 'ring-story-frame', src: '/images/car-wheel.jpg', caption: 'Ring Story' },
    { id: 'aisle-moments-frame', src: '/images/gallery-1.jpg', caption: 'Aisle Moments' },
    { id: 'candid-smiles-frame', src: '/images/gallery-2.jpg', caption: 'Candid Smiles' },
    { id: 'quiet-vows-frame', src: '/images/gallery-3.jpg', caption: 'Quiet Vows' },
    { id: 'reception-glow-frame', src: '/images/gallery-4.jpg', caption: 'Reception Glow' },
    { id: 'first-dance-frame', src: '/images/gallery-5.jpg', caption: 'First Dance' },
    { id: 'family-toasts-frame', src: '/images/gallery-6.jpg', caption: 'Family Toasts' },
    { id: 'night-celebration-frame', src: '/images/gallery-7.jpg', caption: 'Night Celebration' },
    { id: 'forever-frame', src: '/images/gallery-8.jpg', caption: 'Forever Frame' }
  ]

  const sections: WeddingNavSection[] = [
    { label: 'Our Story', id: 'story' },
    { label: 'Ceremony', id: 'ceremony' },
    { label: 'Venue', id: 'venue' },
    { label: 'Gallery', id: 'gallery' },
    { label: 'RSVP', id: 'rsvp' }
  ]

  const goToSection = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    // Lenis handles smoothness globally; avoid double-smoothing jitter.
    el.scrollIntoView({ behavior: 'auto', block: 'start' })
  }

  const getPhotoDetailLink = (photoId: string) => `/details/photo?id=${encodeURIComponent(photoId)}`

  const clearLongPressTimer = () => {
    if (longPressTimerRef.current !== null) {
      window.clearTimeout(longPressTimerRef.current)
      longPressTimerRef.current = null
    }
  }

  useEffect(() => {
    return () => clearLongPressTimer()
  }, [])

  const getPhotoInteractionProps = (to: string) => ({
    onContextMenu: (event: React.MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault()
      navigate(to)
    },
    onTouchStart: () => {
      clearLongPressTimer()
      longPressTimerRef.current = window.setTimeout(() => {
        navigate(to)
      }, 420)
    },
    onTouchEnd: clearLongPressTimer,
    onTouchCancel: clearLongPressTimer,
    onTouchMove: clearLongPressTimer
  })

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % carouselSlides.length)
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length)

  // Keep carousel manual-only to avoid unexpected automatic switching

  return (
    <div className={`min-h-screen bg-black text-white overflow-x-hidden ${a11yMode ? 'a11y-mode' : ''}`}>
      {showPreloader && (
        <div className="preloader-overlay" role="status" aria-live="polite">
          <div className="preloader-content">
            <div className="preloader-petals" aria-hidden="true">
              {Array.from({ length: 10 }).map((_, index) => (
                <span
                  key={index}
                  className="preloader-petal"
                  style={
                    {
                      '--petal-delay': `${index * 90}ms`,
                      '--petal-duration': `${3200 + index * 120}ms`,
                      '--petal-x': `${-120 + index * 28}px`,
                      '--petal-scale': `${0.75 + (index % 4) * 0.1}`
                    } as React.CSSProperties
                  }
                />
              ))}
            </div>
            <div className="preloader-rose-shell">
              <video
                autoPlay
                muted
                playsInline
                loop
                className="preloader-rose"
              >
                <source src="/videos/black-rose.mp4" type="video/mp4" />
              </video>
            </div>
            <p className="preloader-logo">{weddingConfig.monogram}</p>
            <p className="preloader-line">{weddingConfig.groomName} &amp; {weddingConfig.partnerName}</p>
            <p className="preloader-subline">Wedding Film</p>
            <div className="preloader-progress">
              <span />
            </div>
          </div>
        </div>
      )}

      <TopNav
        headerScrolled={headerScrolled}
        sections={sections}
        monogram={weddingConfig.monogram}
        activeSection={activeSection}
        a11yMode={a11yMode}
        onOpenMenu={() => setMenuOpen(true)}
        onOpenSearch={() => setSearchOpen(true)}
        onToggleA11y={() => setA11yMode((prev) => !prev)}
        onGoToSection={goToSection}
      />

      <MobileMenu
        open={menuOpen}
        sections={sections}
        monogram={weddingConfig.monogram}
        activeSection={activeSection}
        onClose={() => setMenuOpen(false)}
        onGoToSection={goToSection}
      />

      <SearchOverlay
        open={searchOpen}
        query={searchQuery}
        onChangeQuery={setSearchQuery}
        sections={sections}
        onClose={() => setSearchOpen(false)}
        onGoToSection={goToSection}
      />

      {/* Hero Section with 3D Rose Video */}
      <section id="hero" ref={heroRef} className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-black">
        {/* 3D Rose Video Background */}
        <div className="absolute inset-0 flex items-center justify-center">
          <video
            ref={roseRef}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover hero-rose opacity-0"
            style={{ filter: 'brightness(0.86) contrast(1.1) saturate(0.95)' }}
            onLoadedMetadata={() => {
              const v = roseRef.current
              if (!v) return
              // Start around 13–14 seconds like your reference feel
              try { v.currentTime = 13.5 } catch { /* ignore */ }
            }}
          >
            <source src="/videos/black-rose.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Dark Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/25 pointer-events-none" />

        {/* Soft Blush Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(232,180,195,0.14)_0%,rgba(0,0,0,0)_55%)] pointer-events-none" />

        {/* Vignette Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(0,0,0,0.8)_100%)] pointer-events-none" />

        {/* Text Overlay */}
        <div ref={titleRef} className="relative z-10 text-center px-4">
          <div className="text-white/95 text-shadow">
            <div className="hero-title-line block text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-3" style={{ fontFamily: "'Great Vibes', cursive", letterSpacing: '0.02em' }}>
              {weddingConfig.groomName} &amp; {weddingConfig.partnerName}
            </div>
            <h1 className="hero-title-line block text-xs sm:text-sm md:text-base font-light tracking-[0.45em] uppercase text-white/80" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Wedding Film
            </h1>
            <p className="hero-title-line block mt-6 text-[10px] sm:text-xs tracking-[0.35em] uppercase text-white/70" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              A day of vows, light, and forever
            </p>
            <div className="hero-title-line mt-8 inline-flex flex-col sm:flex-row items-center gap-3 sm:gap-5 px-5 py-3 border border-white/20 bg-black/35 backdrop-blur-sm">
              <span className="text-[10px] sm:text-xs tracking-[0.28em] uppercase text-white/85">{weddingConfig.weddingDate}</span>
              <span className="hidden sm:inline text-white/30">•</span>
              <span className="text-[10px] sm:text-xs tracking-[0.22em] uppercase text-white/75">{weddingConfig.weddingTime}</span>
              <span className="hidden sm:inline text-white/30">•</span>
              <span className="text-[10px] sm:text-xs tracking-[0.2em] uppercase text-white/70">{weddingConfig.venueName}</span>
            </div>
            <Link
              to="/details/rsvp-notes"
              className="hero-title-line inline-block mt-7 text-[10px] tracking-[0.28em] uppercase border border-white/35 px-5 py-3 text-white/90 hover:bg-white/10 transition-all btn-glow"
            >
              RSVP Now
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="scroll-indicator absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-0">
          <div className="w-px h-12 bg-white/55 scroll-indicator-line" />
          <span className="text-[10px] tracking-[0.3em] uppercase text-white/55">Scroll</span>
        </div>
      </section>

      {/* Art in Motion Section */}
      <section id="story" className="animate-section min-h-screen bg-black py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Image */}
            <div className="curtain-reveal order-2 lg:order-1" style={{ clipPath: 'inset(0 100% 0 0)' }}>
              <Link to={getPhotoDetailLink('our-story-moment')} className="img-hover-zoom aspect-video block" {...getPhotoInteractionProps(getPhotoDetailLink('our-story-moment'))}>
                <LazyImage src="/images/car-exterior-1.jpg" alt="A quiet moment together" className="w-full h-full object-cover" />
              </Link>
            </div>

            {/* Text */}
            <div className="order-1 lg:order-2">
              <h2 className="fade-up text-3xl md:text-4xl lg:text-5xl font-light tracking-[0.2em] uppercase mb-8 opacity-0 translate-y-8" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Our Story
              </h2>
              <p className="fade-up text-base lg:text-lg font-light leading-relaxed text-white/80 opacity-0 translate-y-8">
                Two paths met softly, then all at once. What began with small conversations and shared comfort became a love story built on patience, laughter, and quiet devotion — now arriving at one luminous promise.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Uniquely Romantic Expression Section */}
      <section id="ceremony" className="animate-section min-h-screen bg-black py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="relative">
            {/* Background Image */}
            <div className="curtain-reveal aspect-[16/9] lg:aspect-[21/9]" style={{ clipPath: 'inset(0 100% 0 0)' }}>
              <Link to={getPhotoDetailLink('ceremony-atmosphere')} className="block h-full" {...getPhotoInteractionProps(getPhotoDetailLink('ceremony-atmosphere'))}>
                <LazyImage src="/images/car-grille.jpg" alt="Ceremony atmosphere" className="w-full h-full object-cover ken-burns" />
              </Link>
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent pointer-events-none" />
            </div>

            {/* Text Card */}
            <div className="lg:absolute lg:bottom-0 lg:left-0 lg:right-0 lg:p-12 mt-8 lg:mt-0">
              <div className="glass-card p-8 lg:p-12 max-w-2xl fade-up opacity-0 translate-y-8">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-light tracking-[0.2em] uppercase mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  The Ceremony
                </h2>
                <p className="text-sm lg:text-base font-light leading-relaxed text-white/70">
                  Join us as we exchange vows beneath soft light and gentle music. The ceremony is designed to feel intimate and cinematic — a slow, graceful moment where every glance means everything.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Roadster Renaissance Section */}
      <section id="venue" className="animate-section min-h-screen bg-black py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Text */}
            <div>
              <h2 className="fade-up text-3xl md:text-4xl lg:text-5xl font-light tracking-[0.2em] uppercase mb-8 opacity-0 translate-y-8" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                The Venue
              </h2>
              <div className="space-y-6">
                <p className="fade-up text-base lg:text-lg font-normal leading-relaxed text-white/90 opacity-0 translate-y-8">
                  A place chosen for its warmth and stillness — where architecture meets nature, and every corner feels like a frame from a film.
                </p>
                <p className="fade-up text-base lg:text-lg font-normal leading-relaxed text-white/90 opacity-0 translate-y-8">
                  Expect ivory florals, blush tones, and candlelight. From ceremony to celebration, the space will guide you gently through the story of the day.
                </p>
              </div>
            </div>

            {/* Image */}
            <div className="curtain-reveal" style={{ clipPath: 'inset(0 100% 0 0)' }}>
              <Link to={getPhotoDetailLink('venue-detail')} className="img-hover-zoom aspect-video rounded-sm overflow-hidden block" {...getPhotoInteractionProps(getPhotoDetailLink('venue-detail'))}>
                <LazyImage src="/images/car-interior.jpg" alt="Venue detail" className="w-full h-full object-cover" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Depth and Radiance Section */}
      <section id="day" className="animate-section min-h-screen bg-black py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-0 items-center">
            {/* Text */}
            <div className="lg:pr-20">
              <h2 className="fade-up text-3xl md:text-4xl lg:text-5xl font-light tracking-[0.2em] uppercase mb-8 opacity-0 translate-y-8" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                The Day, Unfolding
              </h2>
              <div className="space-y-6">
                <p className="fade-up text-base lg:text-lg font-light leading-relaxed text-white/80 opacity-0 translate-y-8">
                  A calm beginning — handwritten notes, soft music, and the first look. Then a slow walk toward the vows, followed by golden-hour portraits and a candlelit reception.
                </p>
                <p className="fade-up text-base lg:text-lg font-light leading-relaxed text-white/80 opacity-0 translate-y-8">
                  Every transition is designed to feel gentle and emotional — like the day itself: present, unhurried, and beautiful in its quiet details.
                </p>
              </div>
            </div>

            {/* Image with Divider */}
            <div className="relative lg:pl-20 lg:border-l lg:border-white/20">
              <div className="curtain-reveal" style={{ clipPath: 'inset(0 100% 0 0)' }}>
                <Link to={getPhotoDetailLink('golden-hour-moment')} className="img-hover-zoom aspect-[4/3] block" {...getPhotoInteractionProps(getPhotoDetailLink('golden-hour-moment'))}>
                  <LazyImage src="/images/car-rear.jpg" alt="Golden hour moment" className="w-full h-full object-cover" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Noire Lustre Section */}
      <section id="celebration" className="animate-section min-h-screen bg-black py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="relative overflow-hidden">
            {/* Background Image */}
            <div className="aspect-[16/9] lg:aspect-[21/9]">
              <Link to={getPhotoDetailLink('wedding-evening')} className="block h-full" {...getPhotoInteractionProps(getPhotoDetailLink('wedding-evening'))}>
                <LazyImage src="/images/car-front.jpg" alt="Wedding evening" className="w-full h-full object-cover ken-burns" />
              </Link>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent pointer-events-none" />
            </div>

            {/* Text */}
            <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-16">
              <div className="max-w-3xl">
                <h2 className="fade-up text-2xl md:text-3xl lg:text-4xl font-light tracking-[0.2em] uppercase mb-6 opacity-0 translate-y-8" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  The Celebration
                </h2>
                <p className="fade-up text-sm lg:text-base font-light leading-relaxed text-white/75 opacity-0 translate-y-8">
                  Dinner, speeches, and a first dance under warm light. Expect soft glamour: blush details, gentle gold highlights, and music that feels like a heartbeat.
                </p>
                <p className="fade-up text-sm lg:text-base font-light leading-relaxed text-white/75 mt-4 opacity-0 translate-y-8">
                  When the night deepens, the glow gets softer — and the moments become unforgettable.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Glamour Distilled Section */}
      <section id="gallery-prelude" className="animate-section min-h-screen bg-black py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Left Column - Large Image */}
            <div className="curtain-reveal lg:-mt-12" style={{ clipPath: 'inset(0 100% 0 0)' }}>
              <Link to={getPhotoDetailLink('gallery-detail')} className="img-hover-zoom aspect-[3/4] block" {...getPhotoInteractionProps(getPhotoDetailLink('gallery-detail'))}>
                <LazyImage src="/images/car-wheel.jpg" alt="Gallery detail" className="w-full h-full object-cover" />
              </Link>
            </div>

            {/* Right Column - Text + Image */}
            <div className="flex flex-col gap-12">
              <div>
                <h2 className="fade-up text-3xl md:text-4xl lg:text-5xl font-light tracking-[0.2em] uppercase mb-8 opacity-0 translate-y-8" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Gallery Prelude
                </h2>
                <p className="fade-up text-base lg:text-lg font-light leading-relaxed text-white/80 opacity-0 translate-y-8">
                  A collection of still moments — textures, glances, and light. Each frame is meant to feel like a memory you can step back into.
                </p>
                <p className="fade-up text-base lg:text-lg font-light leading-relaxed text-white/80 mt-6 opacity-0 translate-y-8">
                  Hover gently. Let the details reveal themselves slowly.
                </p>
              </div>

              <div className="curtain-reveal" style={{ clipPath: 'inset(0 100% 0 0)' }}>
                <Link to={getPhotoDetailLink('quiet-portrait')} className="img-hover-zoom aspect-video block" {...getPhotoInteractionProps(getPhotoDetailLink('quiet-portrait'))}>
                  <LazyImage src="/images/car-top.jpg" alt="A quiet portrait" className="w-full h-full object-cover" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Unmistakable in Presence - Carousel */}
      <section id="gallery" className="animate-section min-h-screen bg-black py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="mb-12">
            <h2 className="fade-up text-3xl md:text-4xl lg:text-5xl font-light tracking-[0.2em] uppercase mb-8 opacity-0 translate-y-8" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Gallery
            </h2>
            <p className="fade-up text-base lg:text-lg font-light leading-relaxed text-white/80 max-w-3xl opacity-0 translate-y-8">
              A cinematic sequence of moments — from the first light to the last dance. Each slide is a gentle reveal, designed to feel intimate and timeless.
            </p>
          </div>

          {/* Carousel */}
          <div className="relative">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-600"
                style={{ transform: `translateX(-${currentSlide * 100}%)`, transitionDuration: '950ms', transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)' }}
              >
                {carouselSlides.map((slide, index) => (
                  <div key={index} className="w-full flex-shrink-0 px-2">
                    <Link to={getPhotoDetailLink(slide.id)} className="aspect-[16/9] overflow-hidden relative block" {...getPhotoInteractionProps(getPhotoDetailLink(slide.id))}>
                      <LazyImage src={slide.src} alt={slide.caption} className="w-full h-full object-cover" />
                      <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-black/80 to-transparent">
                        <p className="text-xs sm:text-sm tracking-[0.16em] uppercase text-white/90" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                          {slide.caption}
                        </p>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8">
              <div className="flex items-center gap-4">
                <button 
                  onClick={prevSlide}
                  className="w-12 h-12 border border-white/30 flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button 
                  onClick={nextSlide}
                  className="w-12 h-12 border border-white/30 flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Dots */}
              <div className="flex items-center gap-3">
                {carouselSlides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentSlide ? 'bg-white w-6' : 'bg-white/30'
                    }`}
                  />
                ))}
              </div>

              {/* Slide Counter */}
              <span className="text-sm tracking-[0.2em] text-white/50">
                {String(currentSlide + 1).padStart(2, '0')} / {String(carouselSlides.length).padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Continue Your Journey */}
      <section id="rsvp" className="animate-section bg-black py-24 lg:py-32 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="fade-up text-3xl md:text-4xl font-light tracking-[0.2em] uppercase mb-4 opacity-0 translate-y-8" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Invitation
            </h2>
            <p className="fade-up text-sm text-white/50 tracking-[0.1em] opacity-0 translate-y-8">
              Details for our celebration — saved in one place
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { slug: 'save-the-date', title: 'Save the Date', desc: 'A gentle reminder to hold the day close — we can’t wait to celebrate with you.', img: '/images/black-rose-hero.jpg' },
              { slug: 'travel-stay', title: 'Travel & Stay', desc: 'Suggestions for arriving, parking, and nearby stays — curated for an easy weekend.', img: '/images/car-interior.jpg' },
              { slug: 'rsvp-notes', title: 'RSVP & Notes', desc: 'Kindly reply with your attendance and any dietary preferences.', img: '/images/car-rear.jpg' }
            ].map((card) => (
              <Link
                key={card.slug}
                to={`/details/${card.slug}`}
                className="fade-up card-lift cursor-pointer group opacity-0 translate-y-8 block"
              >
                <div className="img-hover-zoom aspect-[4/3] mb-6 overflow-hidden">
                  <LazyImage src={card.img} alt={card.title} className="w-full h-full object-cover" />
                </div>
                <h3 className="text-lg font-light tracking-[0.15em] uppercase mb-3 group-hover:text-[#8B1538] transition-colors" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  {card.title}
                </h3>
                <p className="text-sm font-light text-white/60 leading-relaxed">
                  {card.desc}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-white/10 py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          {/* Hero Row */}
          <div className="grid lg:grid-cols-[1.4fr_1fr] gap-10 lg:gap-16 pb-12 border-b border-white/10">
            <div>
              <div className="inline-flex items-center gap-4 mb-5">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-[#8B1538]/40">
                  <LazyImage src="/images/black-rose-hero.jpg" alt="La Rose Noire emblem" className="w-full h-full object-cover" />
                </div>
                <span className="text-[10px] tracking-[0.28em] uppercase text-[#8B1538]">La Rose Noire Wedding</span>
              </div>

              <h3 className="text-3xl md:text-4xl font-light tracking-[0.28em]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {weddingConfig.groomName} &amp; {weddingConfig.partnerName}
              </h3>
              <p className="mt-4 text-sm md:text-base text-white/75 max-w-2xl leading-relaxed">
                Thank you for being part of our story. For guest support, timing updates, or RSVP help, use the links on the right.
              </p>
            </div>

            <div>
              <h4 className="text-[11px] tracking-[0.24em] uppercase text-white/75 mb-4">Quick Access</h4>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => goToSection('story')} className="text-left text-[11px] tracking-[0.15em] uppercase px-3 py-2 border border-white/10 hover:border-[#8B1538]/60 hover:text-[#8B1538] transition-all">Our Story</button>
                <button onClick={() => goToSection('ceremony')} className="text-left text-[11px] tracking-[0.15em] uppercase px-3 py-2 border border-white/10 hover:border-[#8B1538]/60 hover:text-[#8B1538] transition-all">Ceremony</button>
                <button onClick={() => goToSection('venue')} className="text-left text-[11px] tracking-[0.15em] uppercase px-3 py-2 border border-white/10 hover:border-[#8B1538]/60 hover:text-[#8B1538] transition-all">Venue</button>
                <button onClick={() => goToSection('gallery')} className="text-left text-[11px] tracking-[0.15em] uppercase px-3 py-2 border border-white/10 hover:border-[#8B1538]/60 hover:text-[#8B1538] transition-all">Gallery</button>
                <button onClick={() => goToSection('rsvp')} className="text-left text-[11px] tracking-[0.15em] uppercase px-3 py-2 border border-white/10 hover:border-[#8B1538]/60 hover:text-[#8B1538] transition-all">RSVP</button>
                <a href={weddingConfig.mapsUrl} target="_blank" rel="noreferrer" className="text-left text-[11px] tracking-[0.15em] uppercase px-3 py-2 border border-white/10 hover:border-[#8B1538]/60 hover:text-[#8B1538] transition-all">Directions</a>
              </div>
            </div>
          </div>

          {/* Connect Row */}
          <div className="grid md:grid-cols-3 gap-8 pt-10">
            <div>
              <p className="text-[10px] tracking-[0.24em] uppercase text-white/60 mb-3">Contact</p>
              <div className="space-y-3">
                <a href={`mailto:${weddingConfig.contactEmail}`} className="block text-sm text-white/85 hover:text-[#8B1538] transition-colors">{weddingConfig.contactEmail}</a>
                <a href={`tel:${weddingConfig.contactPhone.replace(/\s+/g, '')}`} className="block text-sm text-white/70 hover:text-[#8B1538] transition-colors">{weddingConfig.contactPhone}</a>
              </div>
            </div>

            <div>
              <p className="text-[10px] tracking-[0.24em] uppercase text-white/60 mb-3">Location</p>
              <p className="text-sm text-white/80">{weddingConfig.venueAddress}</p>
              <a href={weddingConfig.mapsUrl} target="_blank" rel="noreferrer" className="inline-block mt-3 text-[11px] tracking-[0.18em] uppercase text-white/70 hover:text-[#8B1538] transition-colors link-underline">
                Open Maps
              </a>
            </div>

            <div>
              <p className="text-[10px] tracking-[0.24em] uppercase text-white/60 mb-3">Connect</p>
              <div className="flex items-center flex-wrap gap-4">
                <a href={weddingConfig.instagramUrl} target="_blank" rel="noreferrer" className="text-[11px] tracking-[0.15em] uppercase text-white/70 hover:text-[#8B1538] transition-colors">Instagram</a>
                <button onClick={() => goToSection('gallery')} className="text-[11px] tracking-[0.15em] uppercase text-white/70 hover:text-[#8B1538] transition-colors">Gallery</button>
                <Link to="/details/rsvp-notes" className="text-[11px] tracking-[0.2em] uppercase border border-white/20 px-4 py-2 text-white/85 hover:text-white hover:border-[#8B1538]/60 hover:bg-[#8B1538]/10 transition-all">
                  RSVP Now
                </Link>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-12 pt-7 border-t border-white/10 text-center">
            <p className="text-[10px] text-white/30 tracking-[0.1em]">
              © 2026 {weddingConfig.groomName} &amp; {weddingConfig.partnerName}. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
