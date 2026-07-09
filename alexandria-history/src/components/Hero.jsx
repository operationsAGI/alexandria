import React from 'react'

export default function Hero() {
  return (
    <header
      id="top"
      className="relative overflow-hidden border-b border-amber-500/10 bg-[radial-gradient(ellipse_at_50%_0%,_rgba(43,29,17,0.42)_0%,_rgba(21,15,10,0.5)_60%,_rgba(13,9,6,0.6)_100%)] px-6 py-28 sm:py-36"
    >
      <div className="grain pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="relative mx-auto max-w-3xl text-center">
        <p className="mb-5 font-sans text-xs uppercase tracking-[0.3em] text-amber-400">
          San Francisco · Est. October 2023
        </p>
        <h1 className="font-display text-5xl font-semibold leading-tight text-white [text-shadow:0_2px_18px_rgba(0,0,0,0.55)] sm:text-7xl">
          Alexandria
        </h1>
        <p className="mx-auto mt-8 max-w-xl font-serif text-lg leading-relaxed text-parchment-200 [text-shadow:0_1px_10px_rgba(0,0,0,0.5)] sm:text-xl">
          Reading is a social practice again. Alexandria gathers autodidacts in San Francisco to
          read whole books and papers, in person, in one sitting, against the erosion of a
          coherent worldview and the collapse of the human attention span.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#history"
            className="rounded-sm bg-amber-500 px-7 py-3 font-sans text-sm font-semibold uppercase tracking-widest text-ink-950 transition hover:bg-amber-400"
          >
            Read the History
          </a>
          <a
            href="#join"
            className="rounded-sm border border-parchment-300/30 px-7 py-3 font-sans text-sm uppercase tracking-widest text-parchment-200 transition hover:border-amber-400 hover:text-amber-300"
          >
            Join the Society
          </a>
        </div>
      </div>
    </header>
  )
}
