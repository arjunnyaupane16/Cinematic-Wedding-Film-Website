import type { WeddingNavSection } from './nav-types'
import { X } from 'lucide-react'

type Props = {
  open: boolean
  query: string
  onChangeQuery: (value: string) => void
  sections: WeddingNavSection[]
  onClose: () => void
  onGoToSection: (id: string) => void
}

export function SearchOverlay({ open, query, onChangeQuery, sections, onClose, onGoToSection }: Props) {
  if (!open) return null

  const normalized = query.trim().toLowerCase()
  const results = sections.filter((s) => s.label.toLowerCase().includes(normalized))

  return (
    <div className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-sm">
      <div className="max-w-2xl mx-auto mt-24 px-6">
        <div className="glass-card p-6 lg:p-8">
          <div className="flex items-center justify-between gap-4 mb-6">
            <h3 className="text-sm tracking-[0.25em] uppercase text-white/80" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Search
            </h3>
            <button
              onClick={() => {
                onClose()
                onChangeQuery('')
              }}
              className="p-2 hover:opacity-70 transition-opacity"
              aria-label="Close search"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <input
            value={query}
            onChange={(e) => onChangeQuery(e.target.value)}
            placeholder="Type: story, ceremony, venue, gallery…"
            className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-white/25 transition-colors"
            autoFocus
          />

          <div className="mt-6 grid sm:grid-cols-2 gap-3">
            {results.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  onClose()
                  onChangeQuery('')
                  onGoToSection(s.id)
                }}
                className="text-left px-4 py-3 border border-white/10 bg-white/5 hover:bg-white/10 transition-colors btn-glow"
              >
                <div className="text-[11px] tracking-[0.25em] uppercase text-white/85" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  {s.label}
                </div>
                <div className="text-xs text-white/45 mt-1">Jump to section</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

