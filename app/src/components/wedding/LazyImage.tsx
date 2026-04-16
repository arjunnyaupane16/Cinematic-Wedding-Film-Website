import { useState } from 'react'

type Props = {
  src: string
  alt: string
  className?: string
  wrapperClassName?: string
}

export function LazyImage({ src, alt, className = '', wrapperClassName = '' }: Props) {
  const [loaded, setLoaded] = useState(false)

  return (
    <div className={`lazy-image-shell ${loaded ? 'is-loaded' : ''} ${wrapperClassName}`}>
      <div className="lazy-image-skeleton" aria-hidden="true" />
      <img
        src={src}
        alt={alt}
        className={`lazy-image ${loaded ? 'is-loaded' : ''} ${className}`}
        loading="lazy"
        onLoad={() => setLoaded(true)}
      />
    </div>
  )
}

