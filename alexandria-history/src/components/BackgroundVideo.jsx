import React, { useEffect, useRef } from 'react'

export default function BackgroundVideo() {
  const pagesRef = useRef(null)
  const shimmerRef = useRef(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      pagesRef.current?.pause()
      shimmerRef.current?.pause()
    }
  }, [])

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-ink-950" aria-hidden="true">
      {/* base layer: old book pages, the texture of the whole site */}
      <video
        ref={pagesRef}
        className="absolute inset-0 h-full w-full object-cover opacity-45"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      >
        <source src="/media/library-pages.mp4" type="video/mp4" />
      </video>

      {/* gold shimmer layer, screen-blended so it only catches light on the
          bright parts of the pages beneath it, reading as gold dust settling
          on the paper rather than a separate video */}
      <video
        ref={shimmerRef}
        className="absolute inset-0 h-full w-full object-cover opacity-55 mix-blend-screen"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      >
        <source src="/media/gold-shimmer.mp4" type="video/mp4" />
      </video>

      {/* light black/gold scrim: keeps text legible without hiding the footage */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink-950/45 via-ink-950/50 to-ink-950/65" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_15%,_rgba(224,171,82,0.12),_transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,_transparent_40%,_rgba(6,3,1,0.55)_100%)]" />
    </div>
  )
}
