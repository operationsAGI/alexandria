import React from 'react'

const GATHERINGS = [
  {
    label: 'I',
    title: 'Book Map',
    desc: 'A reading night distilled into a curated map of the essential books in a domain, drawn up together and recorded for the shelf.',
  },
  {
    label: 'II',
    title: 'Talks',
    desc: 'Short recorded presentations that surface out of a reading night: one member walking the room through what a text actually said.',
  },
  {
    label: 'III',
    title: 'Read-a-thons',
    desc: 'A single sitting, five to ten hours, in which one book is read cover to cover, "majored," so its entirety lives in memory at once.',
  },
  {
    label: 'IV',
    title: 'Salon',
    desc: 'A smaller, conversational evening built around a theme, where ideas from recent reading are argued out over the table.',
  },
  {
    label: 'V',
    title: 'Reading Party',
    desc: 'A relaxed, communal night of parallel reading: everyone with their own book, sharing a room and, eventually, a discussion.',
  },
  {
    label: 'VI',
    title: 'Debate',
    desc: 'A structured evening where two readings or two positions are set against each other, and the room works out where the truth sits.',
  },
]

export default function Gatherings() {
  return (
    <section id="gatherings" className="bg-ink-950/42 px-6 py-24 backdrop-blur-[3px]">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 max-w-xl">
          <p className="mb-3 font-sans text-xs uppercase tracking-[0.3em] text-amber-400">
            Gatherings
          </p>
          <h2 className="font-display text-3xl font-semibold text-white [text-shadow:0_1px_12px_rgba(0,0,0,0.5)] sm:text-4xl">
            Six ways to read together
          </h2>
        </div>
        <div className="grid gap-px overflow-hidden rounded-sm border border-amber-500/10 bg-amber-500/10 sm:grid-cols-2 lg:grid-cols-3">
          {GATHERINGS.map((g) => (
            <article
              key={g.title}
              className="flex min-h-[220px] flex-col bg-wood-900 p-7 transition hover:bg-wood-800"
            >
              <span className="mb-4 font-display text-sm italic text-amber-400">{g.label}.</span>
              <h3 className="mb-2 font-display text-xl font-semibold text-parchment-100">
                {g.title}
              </h3>
              <p className="font-serif text-[15px] leading-relaxed text-parchment-300">{g.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
