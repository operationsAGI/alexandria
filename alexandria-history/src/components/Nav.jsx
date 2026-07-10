import React from 'react'
import { pastEvents } from '../data/pastEvents.js'

const SECTION_LINKS = [
  { href: '#the-idea', label: 'The Idea' },
  { href: '#gatherings', label: 'Gatherings' },
  { href: '#history', label: 'History' },
  { href: '#gallery', label: 'Gallery' },
]

export default function Nav({ onHomePage = true }) {
  const prefix = onHomePage ? '' : '/'
  return (
    <nav className="sticky top-0 z-40 border-b border-amber-500/25 bg-ink-950/95 shadow-[0_4px_24px_rgba(0,0,0,0.45)] backdrop-blur-lg">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a
          href={onHomePage ? '#top' : '/'}
          className="font-display text-xl font-semibold tracking-wide text-white"
        >
          <span className="mr-1 text-amber-400 flicker" aria-hidden="true">✦</span>
          Alexandria
        </a>
        <ul className="hidden items-center gap-8 font-sans text-sm tracking-wide text-parchment-200 sm:flex">
          {SECTION_LINKS.map((l) => (
            <li key={l.href}>
              <a href={`${prefix}${l.href}`} className="transition hover:text-amber-300">
                {l.label}
              </a>
            </li>
          ))}

          <li className="group relative">
            <button
              type="button"
              className="flex items-center gap-1 transition hover:text-amber-300"
            >
              Events
              <svg viewBox="0 0 12 8" className="h-2.5 w-2.5 fill-current transition group-hover:rotate-180">
                <path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div className="invisible absolute left-1/2 top-full w-72 -translate-x-1/2 pt-3 opacity-0 transition group-hover:visible group-hover:opacity-100">
              <div className="rounded-sm border border-amber-500/20 bg-ink-950/95 p-2 shadow-page backdrop-blur-lg">
                <p className="px-3 pb-1 pt-1 font-sans text-[10px] uppercase tracking-[0.2em] text-amber-500">
                  Past Gatherings
                </p>
                {pastEvents.map((ev) => (
                  <a
                    key={ev.href}
                    href={ev.href}
                    className="block rounded-sm px-3 py-2 font-serif text-[15px] leading-snug text-parchment-200 transition hover:bg-amber-500/10 hover:text-amber-300"
                  >
                    {ev.title}
                  </a>
                ))}
              </div>
            </div>
          </li>

          <li>
            <a href={`${prefix}#join`} className="transition hover:text-amber-300">
              Get Involved
            </a>
          </li>
        </ul>
        <a
          href="/join/"
          className="rounded-sm border border-amber-500/60 px-4 py-2 font-sans text-xs uppercase tracking-widest text-amber-300 transition hover:bg-amber-500/10"
        >
          Join
        </a>
      </div>
    </nav>
  )
}
