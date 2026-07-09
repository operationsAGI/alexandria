import React, { useEffect, useRef, useState } from 'react'
import { eventsByYear } from '../data/events.js'

function formatDate(dateStr) {
  const d = new Date(`${dateStr}T00:00:00`)
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

function EventRow({ ev }) {
  const rowRef = useRef(null)

  useEffect(() => {
    const el = rowRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('tl-in')
          io.unobserve(el)
        }
      },
      { threshold: 0.15 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const links = []
  if (ev.rsvp) links.push({ href: ev.rsvp, label: 'RSVP on Luma' })
  if (ev.bookMap) links.push({ href: ev.bookMap, label: 'Book Map' })
  if (ev.talks) links.push({ href: ev.talks, label: 'Talks' })

  return (
    <li ref={rowRef} className="tl-reveal relative pb-12 pl-9 last:pb-0">
      <span
        className="absolute -left-[7px] top-1.5 z-10 h-3.5 w-3.5 rounded-full border-2 border-amber-400 bg-wood-900"
        aria-hidden="true"
      />
      <div className="mb-1.5 flex flex-wrap items-center gap-3 font-sans text-xs uppercase tracking-widest text-amber-400">
        <time dateTime={ev.date}>{formatDate(ev.date)}</time>
        <span className="rounded-sm border border-parchment-300/20 px-2 py-0.5 text-parchment-400">
          {ev.type}
        </span>
      </div>
      <h3 className="mb-2 font-display text-xl font-semibold leading-snug text-white [text-shadow:0_1px_8px_rgba(0,0,0,0.5)] sm:text-2xl">
        {ev.title}
      </h3>
      {links.length > 0 ? (
        <div className="flex flex-wrap gap-x-5 gap-y-1 font-sans text-sm">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="border-b border-amber-500/60 text-amber-300 transition hover:text-amber-200"
            >
              {l.label} ↗
            </a>
          ))}
        </div>
      ) : (
        <p className="font-sans text-sm text-parchment-400">{ev.note || 'Details in the Slack chat'}</p>
      )}
    </li>
  )
}

export default function HistoryTimeline() {
  const years = Object.keys(eventsByYear)
  const railRef = useRef(null)
  const fillRef = useRef(null)
  const yearHeaderRefs = useRef({})
  const [activeYear, setActiveYear] = useState(years[0])

  const registerYearHeader = (year, el) => {
    if (el) yearHeaderRefs.current[year] = el
  }

  useEffect(() => {
    let raf = null

    const update = () => {
      const rail = railRef.current
      if (rail) {
        const rect = rail.getBoundingClientRect()
        const viewportCenter = window.innerHeight * 0.5
        const progressed = viewportCenter - rect.top
        const fraction = Math.min(1, Math.max(0, progressed / rect.height))
        if (fillRef.current) {
          fillRef.current.style.height = `${fraction * 100}%`
        }
      }

      let current = years[0]
      Object.entries(yearHeaderRefs.current).forEach(([year, el]) => {
        const top = el.getBoundingClientRect().top
        if (top < window.innerHeight * 0.4) current = year
      })
      setActiveYear((prev) => (prev === current ? prev : current))

      raf = null
    }

    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', update)
      if (raf) cancelAnimationFrame(raf)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const jumpToYear = (year) => {
    const el = yearHeaderRefs.current[year]
    if (!el) return
    const y = el.getBoundingClientRect().top + window.scrollY - 84
    window.scrollTo({ top: y, behavior: 'smooth' })
  }

  return (
    <section id="history" className="bg-wood-900/58 py-24 backdrop-blur-[4px]">
      <div className="mx-auto max-w-3xl px-6">
        <div className="mb-10 max-w-xl">
          <p className="mb-3 font-sans text-xs uppercase tracking-[0.3em] text-amber-400">
            History
          </p>
          <h2 className="font-display text-3xl font-semibold text-white [text-shadow:0_1px_12px_rgba(0,0,0,0.5)] sm:text-4xl">
            Every gathering, since the first candle
          </h2>
          <p className="mt-4 font-serif text-parchment-200 [text-shadow:0_1px_8px_rgba(0,0,0,0.45)]">
            The full record of Alexandria's nights, chronological.
          </p>
        </div>

        <div className="mb-12 flex flex-wrap gap-2 font-sans text-xs">
          {years.map((y) => (
            <button
              key={y}
              type="button"
              onClick={() => jumpToYear(y)}
              className={`rounded-full border px-3 py-1.5 tracking-widest transition ${
                activeYear === y
                  ? 'border-amber-400 bg-amber-500 text-ink-950'
                  : 'border-amber-500/30 text-amber-300 hover:border-amber-400 hover:bg-amber-500/10'
              }`}
            >
              {y}
            </button>
          ))}
        </div>

        <div ref={railRef} className="relative border-l border-amber-500/20 pl-0">
          <div
            ref={fillRef}
            className="absolute -left-px top-0 w-px bg-amber-400"
            style={{ height: '0%' }}
            aria-hidden="true"
          />
          {years.map((year) => (
            <div key={year} className="mb-2">
              <h3
                ref={(el) => registerYearHeader(year, el)}
                className="sticky top-16 z-10 -ml-px mb-6 border-l border-transparent bg-wood-900/90 py-2 pl-9 font-display text-2xl italic text-amber-300 backdrop-blur-sm"
              >
                {year}
              </h3>
              <ul className="list-none">
                {eventsByYear[year].map((ev) => (
                  <EventRow key={ev.date + ev.title} ev={ev} />
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
