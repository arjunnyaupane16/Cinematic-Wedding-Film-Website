import type { WeddingNavSection } from './nav-types'
import { X } from 'lucide-react'
import { createPortal } from 'react-dom'

type Props = {
  open: boolean
  sections: WeddingNavSection[]
  monogram: string
  activeSection: string
  onClose: () => void
  onGoToSection: (id: string) => void
}

export function MobileMenu({ open, sections, monogram, activeSection, onClose, onGoToSection }: Props) {
  if (!open) return null
  if (typeof document === 'undefined') return null

  return createPortal(
    <div className="fixed inset-0 z-[60] pointer-events-none" role="presentation">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[3px]" />

      <aside
        className="sidebar-panel pointer-events-auto fixed right-0 top-0 bottom-0 h-[100dvh] w-[88vw] max-w-[420px] border-l border-white/10 overflow-y-auto [-webkit-overflow-scrolling:touch] [touch-action:pan-y] animate-[slideInRightSoft_520ms_var(--ease-dramatic)_forwards]"
        onClick={(e) => e.stopPropagation()}
        aria-label="Menu"
      >
        <div className="flex flex-col min-h-full p-8">
          <div className="flex justify-between items-center mb-8 shrink-0">
            <div>
              <span className="text-[10px] uppercase tracking-[0.26em] text-white/55">Navigation</span>
              <div className="mt-1 text-2xl font-light tracking-[0.3em]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {monogram}
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-full border border-white/15 hover:border-[#8B1538]/60 hover:text-[#8B1538] transition-colors" aria-label="Close menu">
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex flex-col gap-3 pb-2">
            <a
              href="#hero"
              onClick={(e) => {
                e.preventDefault()
                onClose()
                onGoToSection('hero')
              }}
              className={`text-xl font-light tracking-[0.14em] uppercase px-4 py-3 border transition-all opacity-0 animate-[fadeInUp_900ms_var(--ease-royal)_forwards] ${
                activeSection === 'hero'
                  ? 'text-[#8B1538] border-[#8B1538]/60 bg-[#8B1538]/10'
                  : 'text-white/90 border-white/10 hover:border-white/30 hover:bg-white/[0.03]'
              }`}
              style={{ fontFamily: "'Cormorant Garamond', serif", animationDelay: '60ms' }}
            >
              <span className="inline-flex items-center justify-between w-full"><span>Home</span><span className="text-[10px] tracking-[0.2em] text-white/45">00</span></span>
            </a>
            {sections.map((item, i) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault()
                  onClose()
                  onGoToSection(item.id)
                }}
                className={`text-xl font-light tracking-[0.14em] uppercase px-4 py-3 border transition-all opacity-0 animate-[fadeInUp_900ms_var(--ease-royal)_forwards] ${
                  activeSection === item.id
                    ? 'text-[#8B1538] border-[#8B1538]/60 bg-[#8B1538]/10'
                    : 'text-white/90 border-white/10 hover:border-white/30 hover:bg-white/[0.03]'
                }`}
                style={{ fontFamily: "'Cormorant Garamond', serif", animationDelay: `${140 + i * 70}ms` }}
              >
                <span className="inline-flex items-center justify-between w-full">
                  <span>{item.label}</span>
                  <span className="text-[10px] tracking-[0.2em] text-white/45">{String(i + 1).padStart(2, '0')}</span>
                </span>
              </a>
            ))}
          </nav>
        </div>
      </aside>
    </div>,
    document.body
  )
}

