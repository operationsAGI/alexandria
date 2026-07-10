import React from 'react'

const CHANNELS = [
  {
    label: 'Events',
    title: 'Luma',
    desc: 'Every upcoming reading night, with dates and details, lives here.',
    href: 'https://luma.com/user/agihouse',
  },
]

export default function Join() {
  return (
    <section
      id="join"
      className="relative overflow-hidden bg-[radial-gradient(ellipse_at_50%_0%,_rgba(58,39,22,0.42)_0%,_rgba(21,15,10,0.5)_65%)] px-6 py-24 text-center"
    >
      <div className="grain pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="relative mx-auto max-w-2xl">
        <p className="mb-3 font-sans text-xs uppercase tracking-[0.3em] text-amber-400">
          Get Involved
        </p>
        <h2 className="font-display text-3xl font-semibold text-white [text-shadow:0_1px_14px_rgba(0,0,0,0.55)] sm:text-4xl">
          Come read with us
        </h2>
        <p className="mt-4 font-serif text-lg text-parchment-200 [text-shadow:0_1px_10px_rgba(0,0,0,0.5)]">
          No accounts, no applications. RSVP to a night on Luma, that's the whole of it.
        </p>
      </div>
      <div className="relative mx-auto mt-14 max-w-xs text-left">
        {CHANNELS.map((c) => (
          <a
            key={c.title}
            href={c.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group block rounded-sm border border-parchment-300/15 bg-ink-950/55 p-6 backdrop-blur-[2px] transition hover:border-amber-400/60 hover:bg-ink-950/75"
          >
            <span className="mb-2 block font-sans text-[11px] uppercase tracking-[0.2em] text-amber-400">
              {c.label}
            </span>
            <h3 className="mb-1 font-display text-lg font-semibold text-white">
              {c.title}
              <span className="ml-1 inline-block transition group-hover:translate-x-1">↗</span>
            </h3>
            <p className="font-serif text-sm text-parchment-300">{c.desc}</p>
          </a>
        ))}
      </div>
      <p className="relative mt-8 font-sans text-sm text-parchment-300">
        Want to become a member?{' '}
        <a href="/join/" className="border-b border-amber-500/60 text-amber-300 transition hover:text-amber-200">
          Apply to join Alexandria
        </a>
      </p>
    </section>
  )
}
