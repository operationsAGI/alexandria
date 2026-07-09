import React, { useEffect, useRef, useState } from 'react'

const FLASH_MS = 400 // the flash brightening once the flight ends
const FADE_OUT_MS = 800 // the bright overlay dissolving to reveal the page
const MAX_FLIGHT_MS = 2400 // hard cap in case video metadata never loads (video itself runs ~1.8s)

export default function IntroFlythrough({ onComplete }) {
  const [skipped, setSkipped] = useState(false)
  const [flashOn, setFlashOn] = useState(false)
  const [fadingOut, setFadingOut] = useState(false)
  const videoRef = useRef(null)
  const fallbackTimeout = useRef(null)
  const flashTimeout = useRef(null)
  const fadeTimeout = useRef(null)
  const started = useRef(false)

  const beginSequence = () => {
    if (started.current) return
    started.current = true
    clearTimeout(fallbackTimeout.current)
    setFlashOn(true)
    flashTimeout.current = setTimeout(() => {
      setFadingOut(true)
      fadeTimeout.current = setTimeout(onComplete, FADE_OUT_MS)
    }, FLASH_MS)
  }

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      onComplete()
      return
    }
    // safety net: never let the intro hang if the video fails to load or play
    fallbackTimeout.current = setTimeout(beginSequence, MAX_FLIGHT_MS)
    return () => {
      clearTimeout(fallbackTimeout.current)
      clearTimeout(flashTimeout.current)
      clearTimeout(fadeTimeout.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleVideoEnded = () => {
    beginSequence()
  }

  const handleSkip = () => {
    clearTimeout(fallbackTimeout.current)
    clearTimeout(flashTimeout.current)
    clearTimeout(fadeTimeout.current)
    setSkipped(true)
    onComplete()
  }

  if (skipped) return null

  return (
    <div
      className={`intro-root fixed inset-0 z-50 overflow-hidden bg-ink-950 ${fadingOut ? 'fading-out' : ''}`}
      role="presentation"
      aria-hidden="true"
    >
      <video
        ref={videoRef}
        className="h-full w-full object-cover"
        autoPlay
        muted
        playsInline
        onEnded={handleVideoEnded}
      >
        <source src="/media/intro-library.mp4" type="video/mp4" />
      </video>

      <div className={`intro-flash ${flashOn ? 'flash-on' : ''}`} />

      <button
        type="button"
        onClick={handleSkip}
        disabled={fadingOut}
        aria-hidden="false"
        aria-label="Skip intro animation"
        className={`absolute bottom-8 right-8 z-20 rounded-sm border border-parchment-300/30 bg-ink-950/40 px-4 py-2 font-sans text-xs uppercase tracking-widest text-parchment-200 backdrop-blur-sm transition hover:border-amber-400 hover:text-amber-300 ${
          fadingOut ? 'pointer-events-none opacity-0' : ''
        }`}
      >
        Skip intro
      </button>
    </div>
  )
}
