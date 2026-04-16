import { useEffect } from 'react'
import { X, ZoomIn, ZoomOut } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  isOpen: boolean
  onClose: () => void
  src: string
  alt: string
}

export function PhotoZoomModal({ isOpen, onClose, src, alt }: Props) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 md:p-10"
          onClick={onClose}
        >
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-[10001]"
          >
            <X size={32} />
          </button>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative max-w-full max-h-full"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <div className="relative group overflow-hidden rounded-sm cursor-zoom-in">
              <img
                src={src}
                alt={alt}
                className="max-w-full max-h-[85vh] object-contain transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomOut size={18} className="text-white/70" />
                <span className="text-[10px] tracking-widest uppercase text-white/90">Interactive Zoom</span>
                <ZoomIn size={18} className="text-white/70" />
              </div>
            </div>
            <p className="mt-4 text-center text-white/50 text-[10px] tracking-[0.3em] uppercase">{alt}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
