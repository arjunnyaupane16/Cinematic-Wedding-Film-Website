import type { WeddingNavSection } from './nav-types'
import { Menu, Search } from 'lucide-react'

type Props = {
  headerScrolled: boolean
  sections: WeddingNavSection[]
  monogram: string
  activeSection: string
  a11yMode: boolean
  onOpenMenu: () => void
  onOpenSearch: () => void
  onToggleA11y: () => void
  onGoToSection: (id: string) => void
}

export function TopNav({ headerScrolled, sections, monogram, activeSection, a11yMode, onOpenMenu, onOpenSearch, onToggleA11y, onGoToSection }: Props) {
  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        headerScrolled ? 'bg-black/95 backdrop-blur-xl border-b border-white/10 shadow-[0_8px_24px_rgba(0,0,0,0.28)]' : 'bg-transparent'
      }`}
    >
      <div className="flex items-center justify-between px-6 lg:px-12 h-20">
        <button
          onClick={onOpenMenu}
          className="flex items-center gap-3 text-xs tracking-[0.2em] uppercase hover:opacity-70 transition-opacity"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
          <span className="hidden sm:inline">Menu</span>
        </button>

        <div className="absolute left-1/2 -translate-x-1/2">
          <button onClick={() => onGoToSection('hero')} className="group flex items-center gap-3" aria-label="Go to top">
            <span className="relative inline-flex items-center justify-center w-10 h-10 rounded-full border border-white/15 bg-white/5 backdrop-blur-md transition-all duration-500 group-hover:border-white/30 group-hover:bg-white/10">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M12 2l2.9 6.2L22 9.3l-5 4.8 1.2 7L12 17.9 5.8 21.1 7 14.1 2 9.3l7.1-1.1L12 2z"
                  stroke="rgba(200,169,106,0.9)"
                  strokeWidth="1.2"
                />
              </svg>
            </span>
            <span
              className="hidden sm:block text-[11px] tracking-[0.35em] uppercase text-white/80"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              {monogram}
            </span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onToggleA11y}
            className={`a11y-scale text-[10px] tracking-[0.2em] uppercase border px-3 py-2 transition-all ${
              a11yMode ? 'border-[#8B1538] text-[#8B1538] bg-[#8B1538]/10' : 'border-white/20 text-white/70 hover:text-white hover:border-white/40'
            }`}
            aria-label="Toggle accessibility mode"
          >
            A11Y
          </button>
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-3 text-xs tracking-[0.15em] uppercase hover:opacity-70 transition-opacity"
            aria-label="Search sections"
          >
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline">Search</span>
          </button>
        </div>
      </div>

      <div className={`border-t border-white/10 transition-all duration-500 ${headerScrolled ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex items-center justify-between px-6 lg:px-12 py-4 overflow-x-auto">
          <span className="text-[10px] tracking-[0.2em] uppercase text-white/60 whitespace-nowrap mr-8">Wedding</span>
          <nav className="flex items-center gap-6 lg:gap-10">
            {sections.slice(0, 5).map((item, index) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault()
                  onGoToSection(item.id)
                }}
                className={`text-[10px] lg:text-[11px] tracking-[0.1em] uppercase whitespace-nowrap transition-opacity ${
                  activeSection === item.id
                    ? 'text-[#8B1538] nav-link-active'
                    : index === 2
                      ? 'text-white'
                      : 'text-white/50 hover:text-white'
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}

