import React from 'react'

const LINKS = [
  { href: '#the-idea', label: 'The Idea' },
  { href: '#gatherings', label: 'Gatherings' },
  { href: '#history', label: 'History' },
  { href: '#gallery', label: 'Gallery' },
  { href: '#join', label: 'Join' },
]

export default function Nav() {
  return (
    <nav className="sticky top-0 z-40 border-b border-amber-500/25 bg-ink-950/95 shadow-[0_4px_24px_rgba(0,0,0,0.45)] backdrop-blur-lg">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#top" className="font-display text-xl font-semibold tracking-wide text-white">
          <span className="mr-1 text-amber-400 flicker" aria-hidden="true">✦</span>
          Alexandria
        </a>
        <ul className="hidden gap-8 font-sans text-sm tracking-wide text-parchment-200 sm:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="transition hover:text-amber-300">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href="#join"
          className="rounded-sm border border-amber-500/60 px-4 py-2 font-sans text-xs uppercase tracking-widest text-amber-300 transition hover:bg-amber-500/10"
        >
          Join
        </a>
      </div>
    </nav>
  )
}
