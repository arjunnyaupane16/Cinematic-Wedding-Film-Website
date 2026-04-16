import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { weddingConfig } from '../config/wedding'
import { LazyImage } from '../components/wedding/LazyImage'
import { PhotoZoomModal } from '../components/wedding/PhotoZoomModal'

const content: Record<
  string,
  {
    title: string
    subtitle: string
    image: string
    body: string[]
    highlights: string[]
    timeline: { time: string; label: string }[]
    faqs: { q: string; a: string }[]
    gallery: string[]
  }
> = {
  'save-the-date': {
    title: 'Save the Date',
    subtitle: 'A gentle note, held close.',
    image: '/images/black-rose-hero.jpg',
    body: [
      'We’re getting married, and we’d love for you to be part of the day.',
      'This page is your first preview of the celebration experience — atmosphere, pace, and rhythm.',
      'More personal details will follow shortly. For now, please save the date and keep the evening free for joy.'
    ],
    highlights: [
      'Signature cinematic welcome',
      'Intimate ceremony and candlelit reception',
      'Curated floral and music direction',
      'Photo-led memory experience'
    ],
    timeline: [
      { time: '04:00 PM', label: 'Guest Arrival & Welcome Drinks' },
      { time: '05:00 PM', label: 'Ceremony Begins' },
      { time: '06:00 PM', label: 'Portrait Session & Family Photos' },
      { time: '07:30 PM', label: 'Dinner & Speeches' },
      { time: '09:00 PM', label: 'First Dance & Open Floor' }
    ],
    faqs: [
      { q: 'Is the schedule final?', a: 'The timing is close to final. Any updates will appear here first.' },
      { q: 'Can I bring children?', a: 'Please check your invitation note; it includes attendance details.' },
      { q: 'Will there be parking?', a: 'Yes. Parking guidance will be posted in the travel section.' }
    ],
    gallery: ['/images/gallery-1.jpg', '/images/gallery-2.jpg', '/images/gallery-3.jpg']
  },
  'travel-stay': {
    title: 'Travel & Stay',
    subtitle: 'Arrive softly. Settle beautifully.',
    image: '/images/car-interior.jpg',
    body: [
      'We’ve selected options that balance comfort, distance, and ease of movement throughout the event.',
      'Choose from premium nearby hotels or boutique stays depending on your weekend plan.',
      'If you need help planning routes, arrival times, or local transport, we are happy to help.'
    ],
    highlights: [
      'Recommended luxury and boutique stays',
      'Smooth transit between event locations',
      'Clear parking and pickup instructions',
      'Support for out-of-town guests'
    ],
    timeline: [
      { time: 'Day Before', label: 'Optional early check-in and informal meet-up' },
      { time: 'Wedding Day', label: 'Shuttle and route guidance live by midday' },
      { time: 'After Event', label: 'Late checkout suggestions and brunch options' },
      { time: 'Support', label: 'Contact host team for any travel issue' }
    ],
    faqs: [
      { q: 'How far is the venue from hotels?', a: 'Most suggested hotels are within 10-20 minutes.' },
      { q: 'Do I need to book early?', a: 'Yes, weekend demand can be high. Early booking is recommended.' },
      { q: 'Is transportation arranged?', a: 'Shared options and route maps are provided on this page.' }
    ],
    gallery: ['/images/gallery-4.jpg', '/images/gallery-5.jpg', '/images/gallery-6.jpg']
  },
  'rsvp-notes': {
    title: 'RSVP & Notes',
    subtitle: 'Kindly reply with your presence.',
    image: '/images/car-rear.jpg',
    body: [
      'Please confirm your attendance and add any dietary preferences or accessibility notes.',
      'You may include a short personal message — we will read every note with gratitude.',
      'The RSVP helps us design a smooth and thoughtful guest experience for everyone.'
    ],
    highlights: [
      'Quick RSVP confirmation',
      'Dietary and accessibility support',
      'Personal message option',
      'One place for all guest notes'
    ],
    timeline: [
      { time: 'Now', label: 'Open your invitation card page' },
      { time: 'Within 1 Minute', label: 'Confirm attendance and preferences' },
      { time: 'After Submission', label: 'Receive confirmation summary' },
      { time: 'Pre-Event', label: 'Final reminders shared before ceremony' }
    ],
    faqs: [
      { q: 'What if I need to update my RSVP?', a: 'You can send an updated note any time before the final deadline.' },
      { q: 'Can I add dietary details later?', a: 'Yes, but earlier updates help us plan better.' },
      { q: 'Is this mandatory?', a: 'Yes, RSVP confirmation helps with seating and service quality.' }
    ],
    gallery: ['/images/gallery-7.jpg', '/images/gallery-8.jpg', '/images/car-wheel.jpg']
  }
}

type DetailContent = (typeof content)[keyof typeof content]

const photoDetails: Record<
  string,
  { title: string; subtitle: string; image: string; location: string; date: string; story: string }
> = {
  'our-story-moment': {
    title: 'Our Story Moment',
    subtitle: 'A quiet beginning.',
    image: '/images/car-exterior-1.jpg',
    location: 'Nepalgunj, Nepal',
    date: 'December 2026',
    story: 'A gentle frame from the chapter where friendship turned into forever.'
  },
  'ceremony-atmosphere': {
    title: 'Ceremony Atmosphere',
    subtitle: 'The vows in focus.',
    image: '/images/car-grille.jpg',
    location: 'Ceremony Hall',
    date: 'Wedding Day',
    story: 'Soft light, still air, and the exact moment everything felt sacred.'
  },
  'venue-detail': {
    title: 'Venue Detail',
    subtitle: 'The place that held us.',
    image: '/images/car-interior.jpg',
    location: 'Nepalgunj Venue',
    date: 'Reception Evening',
    story: 'Every corner was selected to feel warm, elegant, and intimate.'
  },
  'golden-hour-moment': {
    title: 'Golden Hour Moment',
    subtitle: 'Light before sunset.',
    image: '/images/car-rear.jpg',
    location: 'Outdoor Portrait Space',
    date: 'Golden Hour',
    story: 'A timeless portrait where color, calm, and emotion met perfectly.'
  },
  'wedding-evening': {
    title: 'Wedding Evening',
    subtitle: 'The celebration glow.',
    image: '/images/car-front.jpg',
    location: 'Main Reception',
    date: 'Night Celebration',
    story: 'The night turned cinematic with music, laughter, and candlelight.'
  },
  'gallery-detail': {
    title: 'Gallery Detail',
    subtitle: 'Close to the heart.',
    image: '/images/car-wheel.jpg',
    location: 'Detail Studio',
    date: 'Portrait Session',
    story: 'A close-up frame that captures texture, craft, and elegance.'
  },
  'quiet-portrait': {
    title: 'Quiet Portrait',
    subtitle: 'Stillness and grace.',
    image: '/images/car-top.jpg',
    location: 'Portrait Corner',
    date: 'Before Reception',
    story: 'A minimal frame built around silence, softness, and presence.'
  },
  'save-the-date-frame': {
    title: 'The Save The Date',
    subtitle: 'Our first public frame.',
    image: '/images/black-rose-hero.jpg',
    location: 'Signature Visual',
    date: 'Announcement Day',
    story: 'The opening frame that introduced our wedding story to everyone.'
  },
  'first-look-frame': {
    title: 'The First Look',
    subtitle: 'Eyes that said everything.',
    image: '/images/car-exterior-1.jpg',
    location: 'Private Reveal',
    date: 'Pre-Ceremony',
    story: 'One glance, one smile, one memory that will always stay.'
  },
  'ceremony-portrait-frame': {
    title: 'Ceremony Portrait',
    subtitle: 'Promise in one frame.',
    image: '/images/car-front.jpg',
    location: 'Ceremony Stage',
    date: 'Main Ceremony',
    story: 'A portrait that holds the emotion and meaning of the vows.'
  },
  'florals-details-frame': {
    title: 'Florals & Details',
    subtitle: 'Design with emotion.',
    image: '/images/car-rear.jpg',
    location: 'Decor Storyline',
    date: 'Event Styling',
    story: 'The floral language of the day: elegant, deep, and memorable.'
  },
  'venue-frame': {
    title: 'The Venue',
    subtitle: 'A place of warmth.',
    image: '/images/car-interior.jpg',
    location: 'Nepalgunj Venue',
    date: 'Wedding Weekend',
    story: 'The selected space where every part of the day unfolded beautifully.'
  },
  'evening-portraits-frame': {
    title: 'Evening Portraits',
    subtitle: 'Soft and cinematic.',
    image: '/images/car-top.jpg',
    location: 'Evening Set',
    date: 'Post-Sunset',
    story: 'Portraits captured under warm tones and quiet celebration energy.'
  },
  'ring-story-frame': {
    title: 'Ring Story',
    subtitle: 'A symbol of forever.',
    image: '/images/car-wheel.jpg',
    location: 'Detail Table',
    date: 'Ceremony Prep',
    story: 'A frame dedicated to the rings that sealed our promise.'
  },
  'aisle-moments-frame': {
    title: 'Aisle Moments',
    subtitle: 'Steps toward forever.',
    image: '/images/gallery-1.jpg',
    location: 'Ceremony Aisle',
    date: 'Vow Time',
    story: 'A sequence of moments where every step felt deeply meaningful.'
  },
  'candid-smiles-frame': {
    title: 'Candid Smiles',
    subtitle: 'Joy, unfiltered.',
    image: '/images/gallery-2.jpg',
    location: 'Family & Friends',
    date: 'Reception',
    story: 'Natural smiles and unscripted laughter from the people we love.'
  },
  'quiet-vows-frame': {
    title: 'Quiet Vows',
    subtitle: 'Words from the heart.',
    image: '/images/gallery-3.jpg',
    location: 'Ceremony Center',
    date: 'Vow Exchange',
    story: 'A tender frame from the most intimate promises of the day.'
  },
  'reception-glow-frame': {
    title: 'Reception Glow',
    subtitle: 'Lights and warmth.',
    image: '/images/gallery-4.jpg',
    location: 'Reception Hall',
    date: 'Dinner Hour',
    story: 'Warm tones and evening ambience gave the reception its signature glow.'
  },
  'first-dance-frame': {
    title: 'First Dance',
    subtitle: 'One rhythm, two hearts.',
    image: '/images/gallery-5.jpg',
    location: 'Dance Floor',
    date: 'After Toasts',
    story: 'A timeless first dance moment shared with everyone around us.'
  },
  'family-toasts-frame': {
    title: 'Family Toasts',
    subtitle: 'Words we will remember.',
    image: '/images/gallery-6.jpg',
    location: 'Main Hall',
    date: 'Evening Program',
    story: 'Heartfelt speeches that made the celebration even more personal.'
  },
  'night-celebration-frame': {
    title: 'Night Celebration',
    subtitle: 'The party chapter.',
    image: '/images/gallery-7.jpg',
    location: 'Open Floor',
    date: 'Late Evening',
    story: 'The energy rose as music and celebration took over the night.'
  },
  'forever-frame': {
    title: 'Forever Frame',
    subtitle: 'The ending that begins everything.',
    image: '/images/gallery-8.jpg',
    location: 'Final Portrait',
    date: 'Wedding Night',
    story: 'A closing frame that marks the beginning of our forever journey.'
  }
}

export function DetailPage() {
  const [a11yMode, setA11yMode] = useState(false)
  const [zoomedPhoto, setZoomedPhoto] = useState<{ src: string, alt: string } | null>(null)
  const navigate = useNavigate()
  const { slug } = useParams()
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const photoId = searchParams.get('id')
  const legacyPhotoTitle = searchParams.get('title')
  const legacyPhotoImage = searchParams.get('image')
  const legacyPhotoSection = searchParams.get('section')
  const photo = photoId ? photoDetails[photoId] : undefined
  const dynamicPhotoItem: DetailContent | undefined =
    slug === 'photo'
      ? {
          title: photo?.title || legacyPhotoTitle || 'Photo Moment',
          subtitle: photo?.subtitle || legacyPhotoSection || 'A frame from our celebration.',
          image: photo?.image || legacyPhotoImage || '/images/black-rose-hero.jpg',
          body: [
            photo?.story || `A special frame from ${legacyPhotoSection || 'our wedding story'}.`,
            `Location: ${photo?.location || weddingConfig.venueAddress}`,
            `Captured: ${photo?.date || weddingConfig.weddingDate}`,
            'Thank you for being part of this day and for sharing these memories with us.'
          ],
          highlights: [
            'Cinematic wedding frame',
            'Captured with natural emotion',
            'Part of our story timeline',
            'A memory we will always cherish'
          ],
          timeline: [
            { time: 'Before Vows', label: 'Quiet moments and gentle anticipation' },
            { time: 'Ceremony', label: 'Promises spoken with love' },
            { time: 'Golden Hour', label: 'Portraits and soft light' },
            { time: 'Celebration', label: 'Music, laughter, and forever memories' }
          ],
          faqs: [
            { q: 'Can we view more photos?', a: 'Yes, keep exploring the gallery sections from home page.' },
            { q: 'Will full album be shared?', a: 'Selected album links will be shared with guests later.' },
            { q: 'Can I save this memory?', a: 'Absolutely. You can bookmark this page for quick revisit.' }
          ],
          gallery: ['/images/gallery-1.jpg', '/images/gallery-2.jpg', '/images/gallery-3.jpg']
        }
      : undefined
  const item = dynamicPhotoItem ?? (slug ? content[slug] : undefined)
  const calendarTitle = encodeURIComponent(`${weddingConfig.groomName} & ${weddingConfig.partnerName} Wedding`)
  const calendarLocation = encodeURIComponent(weddingConfig.venueAddress)
  const calendarDates = '20261214T113000Z/20261214T173000Z'
  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${calendarTitle}&dates=${calendarDates}&details=${encodeURIComponent('Wedding celebration')}&location=${calendarLocation}`
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(weddingConfig.mapsQuery)}`

  useEffect(() => {
    const saved = window.localStorage.getItem('wedding-a11y-mode')
    if (saved === 'true') setA11yMode(true)
  }, [])

  if (!item) {
    return (
      <div className="min-h-screen bg-black text-white px-6 lg:px-12 py-24">
        <div className="max-w-3xl mx-auto">
          <p className="text-sm text-white/60 tracking-[0.15em] uppercase">Not found</p>
          <h1 className="mt-4 text-3xl md:text-4xl font-light tracking-[0.2em] uppercase" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            This page doesn’t exist
          </h1>
          <button type="button" onClick={() => navigate('/')} className="inline-block mt-10 text-xs tracking-[0.25em] uppercase link-underline text-white/80 hover:text-white">
            Back to home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-black text-white ${a11yMode ? 'a11y-mode' : ''}`}>
      <div className="relative">
        <div 
          className="aspect-[16/9] lg:aspect-[21/9] overflow-hidden cursor-zoom-in"
          onClick={() => setZoomedPhoto({ src: item.image, alt: item.title })}
        >
          <LazyImage src={item.image} alt={item.title} className="w-full h-full object-cover ken-burns" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-transparent" />
        </div>
        <div className="absolute top-6 left-6 lg:left-12">
          <button type="button" onClick={() => navigate('/')} className="text-[10px] tracking-[0.3em] uppercase text-white/70 hover:text-white transition-colors link-underline">
            Home
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 lg:px-12 py-20 lg:py-24">
        <p className="text-[10px] tracking-[0.35em] uppercase text-white/55">{item.subtitle}</p>
        <h1 className="mt-4 text-3xl md:text-5xl font-light tracking-[0.18em] uppercase" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          {item.title}
        </h1>

        <div className="mt-10 space-y-6 text-white/80 font-light leading-relaxed">
          {item.body.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>

        <div className="mt-12 grid sm:grid-cols-2 gap-4">
          {item.highlights.map((h) => (
            <div key={h} className="border border-white/10 bg-white/5 px-4 py-4">
              <p className="text-sm text-white/85">{h}</p>
            </div>
          ))}
        </div>

        <div className="mt-14">
          <h2 className="text-xl md:text-2xl tracking-[0.18em] uppercase mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Event Flow
          </h2>
          <div className="space-y-4">
            {item.timeline.map((t) => (
              <div key={`${t.time}-${t.label}`} className="flex items-start justify-between gap-6 border-b border-white/10 pb-3">
                <span className="text-xs tracking-[0.2em] uppercase text-white/60">{t.time}</span>
                <span className="text-sm text-white/85 text-right">{t.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14">
          <h2 className="text-xl md:text-2xl tracking-[0.18em] uppercase mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Gallery
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {item.gallery.map((g) => (
              <div 
                key={g} 
                className="img-hover-zoom aspect-[4/5] overflow-hidden cursor-zoom-in"
                onClick={() => setZoomedPhoto({ src: g, alt: item.title })}
              >
                <LazyImage src={g} alt={item.title} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14">
          <h2 className="text-xl md:text-2xl tracking-[0.18em] uppercase mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            FAQs
          </h2>
          <div className="space-y-4">
            {item.faqs.map((f) => (
              <div key={f.q} className="border border-white/10 bg-white/[0.03] px-5 py-4">
                <p className="text-sm uppercase tracking-[0.14em] text-white/80 mb-2">{f.q}</p>
                <p className="text-sm text-white/65">{f.a}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex gap-6">
          <button type="button" onClick={() => navigate('/')} className="text-xs tracking-[0.25em] uppercase text-white/70 hover:text-white transition-colors link-underline">
            Back
          </button>
          {slug === 'save-the-date' && (
            <a href={googleCalendarUrl} target="_blank" rel="noreferrer" className="text-xs tracking-[0.2em] uppercase border border-white/25 px-4 py-2 text-white/85 hover:border-white/45 hover:text-white transition-all">
              Add to Google Calendar
            </a>
          )}
          {slug === 'travel-stay' && (
            <a href={mapsUrl} target="_blank" rel="noreferrer" className="text-xs tracking-[0.2em] uppercase border border-white/25 px-4 py-2 text-white/85 hover:border-white/45 hover:text-white transition-all">
              Open in Maps
            </a>
          )}
        </div>

        {slug === 'travel-stay' && (
          <div className="mt-10 border border-white/10 overflow-hidden">
            <iframe
              title="Venue map"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(weddingConfig.mapsQuery)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
              className="w-full h-[320px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        )}
      </div>

      <PhotoZoomModal
        isOpen={!!zoomedPhoto}
        onClose={() => setZoomedPhoto(null)}
        src={zoomedPhoto?.src || ''}
        alt={zoomedPhoto?.alt || ''}
      />
    </div>
  )
}
