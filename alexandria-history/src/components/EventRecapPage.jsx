import React, { useState } from 'react'
import { scifiBooks } from '../data/scifiBooks.js'

// ---- Event data. Copy this block as the starting point for the next
// event's recap page (see the SOP for the full process). ----
const EVENT = {
  title: 'The Crossing: From Fantasy to Reality',
  subtitle: 'Science Fiction Reading Night',
  date: 'July 9, 2026',
  location: 'AGI House SF, 170 St. Germain Ave, San Francisco',
  lumaUrl: 'https://luma.com/ScienceFictionReadingNight',
  youtubeId: 'wofIg8iPPpI',
  intro:
    "The best science fiction isn't about the future, it's about the ideas we're not brave enough to think out loud yet.",
  body: [
    "For one night, we gathered the people who read it like a blueprint. An evening of close reading, sharp argument, and the particular joy of finding someone who also underlined that passage.",
    "Everyone brought the book that rewired them. Some brought the one they're still angry about.",
  ],
}

const TONES = [
  'from-amber-700 to-amber-900',
  'from-ember-500 to-wood-900',
  'from-[#1f4b47] to-wood-900',
  'from-wood-600 to-wood-900',
  'from-brown-600 to-wood-900',
]

// group the flat recommendation list by recommender, preserving the order
// each person first appears in the sheet
function groupByRecommender(books) {
  const order = []
  const groups = {}
  books.forEach((b) => {
    if (!groups[b.recommender]) {
      groups[b.recommender] = []
      order.push(b.recommender)
    }
    groups[b.recommender].push(b)
  })
  return order.map((name) => ({ name, books: groups[name] }))
}

function BookChip({ book, tone }) {
  const [coverFailed, setCoverFailed] = useState(false)
  const showCover = book.isbn && !coverFailed

  const content = showCover ? (
    <div className="group relative h-full overflow-hidden rounded-sm border border-amber-500/20 shadow-page">
      <img
        src={`https://covers.openlibrary.org/b/isbn/${book.isbn}-M.jpg`}
        onError={() => setCoverFailed(true)}
        alt={`${book.title} cover`}
        className="h-full w-full object-cover"
      />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-950/90 to-transparent px-2 pb-1.5 pt-4 opacity-0 transition group-hover:opacity-100">
        <p className="font-sans text-[10px] leading-tight text-parchment-200">{book.title}</p>
      </div>
    </div>
  ) : (
    <div
      className={`relative flex h-full flex-col items-center justify-center overflow-hidden rounded-sm border border-amber-500/25 bg-gradient-to-b ${tone} px-3 py-4 text-center shadow-page transition hover:border-amber-400/60`}
    >
      <span className="absolute left-0 right-0 top-0 h-[3px] bg-amber-400/70" aria-hidden="true" />
      <svg viewBox="0 0 24 24" className="mb-2 h-4 w-4 flex-shrink-0 fill-amber-300/80" aria-hidden="true">
        <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8 5.8 21.3l2.4-7.4L2 9.4h7.6z" />
      </svg>
      <h4 className="font-display text-[13px] font-semibold leading-tight text-white [text-shadow:0_1px_4px_rgba(0,0,0,0.5)]">
        {book.title}
      </h4>
      {book.author && (
        <p className="mt-1.5 font-serif text-[11px] italic leading-tight text-parchment-300">
          {book.author}
        </p>
      )}
    </div>
  )
  return book.link ? (
    <a href={book.link} target="_blank" rel="noopener noreferrer" className="aspect-[2/3] block">
      {content}
    </a>
  ) : (
    <div className="aspect-[2/3]">{content}</div>
  )
}

function RecommenderSection({ name, books, toneOffset }) {
  return (
    <div className="mb-12">
      <h3 className="mb-4 font-sans text-xs uppercase tracking-[0.25em] text-amber-400">
        Recommended by {name}
        <span className="ml-2 text-parchment-500">· {books.length}</span>
      </h3>
      <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-5 md:grid-cols-6">
        {books.map((book, i) => (
          <BookChip key={book.title + i} book={book} tone={TONES[(toneOffset + i) % TONES.length]} />
        ))}
      </div>
    </div>
  )
}

function VideoCard({ youtubeId, title }) {
  const [thumb, setThumb] = useState(`https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`)
  return (
    <a
      href={`https://www.youtube.com/watch?v=${youtubeId}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative mb-8 block aspect-video overflow-hidden rounded-sm border border-amber-500/20 shadow-page"
    >
      <img
        src={thumb}
        onError={() => setThumb(`https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`)}
        alt={title}
        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-ink-950/35 transition group-hover:bg-ink-950/50" />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/90 shadow-page transition group-hover:bg-amber-400">
          <svg viewBox="0 0 24 24" className="ml-1 h-7 w-7 fill-ink-950">
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      </div>
      <span className="absolute bottom-3 left-3 rounded-sm bg-ink-950/70 px-2.5 py-1 font-sans text-xs text-parchment-200">
        Watch on YouTube ↗
      </span>
    </a>
  )
}

export default function EventRecapPage() {
  const groups = groupByRecommender(scifiBooks)
  let toneOffset = 0

  return (
    <>
      <header className="relative overflow-hidden border-b border-amber-500/10 bg-[radial-gradient(ellipse_at_50%_0%,_rgba(43,29,17,0.42)_0%,_rgba(21,15,10,0.5)_60%,_rgba(13,9,6,0.6)_100%)] px-6 py-20 sm:py-28">
        <div className="grain pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto max-w-3xl text-center">
          <p className="mb-5 font-sans text-xs uppercase tracking-[0.3em] text-amber-400">
            {EVENT.date} · San Francisco
          </p>
          <h1 className="font-display text-4xl font-semibold leading-tight text-white [text-shadow:0_2px_18px_rgba(0,0,0,0.55)] sm:text-6xl">
            The Crossing:
            <br />
            From Fantasy to Reality
          </h1>
          <p className="mt-3 font-serif text-xl italic text-amber-300 [text-shadow:0_1px_10px_rgba(0,0,0,0.5)]">
            {EVENT.subtitle}
          </p>
          <p className="mx-auto mt-6 max-w-2xl font-serif text-xl italic leading-relaxed text-parchment-200 [text-shadow:0_1px_10px_rgba(0,0,0,0.5)]">
            {EVENT.intro}
          </p>
        </div>
      </header>

      <section className="bg-wood-900/58 px-6 py-20 backdrop-blur-[4px]">
        <div className="mx-auto max-w-2xl space-y-5 font-serif text-lg leading-relaxed text-parchment-200">
          {EVENT.body.map((p) => (
            <p key={p}>{p}</p>
          ))}
          <p className="font-sans text-sm text-parchment-400">
            {EVENT.location} ·{' '}
            <a
              href={EVENT.lumaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="border-b border-amber-500/60 text-amber-300 transition hover:text-amber-200"
            >
              Original event page ↗
            </a>
          </p>
        </div>
      </section>

      <section className="bg-ink-950/45 px-6 py-20 backdrop-blur-[3px]">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 max-w-xl">
            <p className="mb-3 font-sans text-xs uppercase tracking-[0.3em] text-amber-400">
              The Library Wall
            </p>
            <h2 className="font-display text-3xl font-semibold text-white [text-shadow:0_1px_12px_rgba(0,0,0,0.5)] sm:text-4xl">
              {scifiBooks.length} books, {groups.length} readers
            </h2>
            <p className="mt-4 font-serif text-parchment-200">
              Everything the room brought to the table, grouped by who brought it. Tap a title to
              find it.
            </p>
          </div>
          {groups.map((g) => {
            const section = (
              <RecommenderSection key={g.name} name={g.name} books={g.books} toneOffset={toneOffset} />
            )
            toneOffset += g.books.length
            return section
          })}
        </div>
      </section>

      <section className="bg-wood-900/58 px-6 py-20 backdrop-blur-[4px]">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 max-w-xl">
            <p className="mb-3 font-sans text-xs uppercase tracking-[0.3em] text-amber-400">
              From the Night
            </p>
            <h2 className="font-display text-3xl font-semibold text-white [text-shadow:0_1px_12px_rgba(0,0,0,0.5)] sm:text-4xl">
              Photos &amp; clips
            </h2>
          </div>

          <VideoCard youtubeId={EVENT.youtubeId} title={`${EVENT.title}: video from the night`} />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <img
              src="/media/events/scifi-night-2.jpg"
              alt="Members gathered on a couch at Science Fiction Reading Night, several holding their books"
              className="aspect-[4/3] w-full rounded-sm border border-amber-500/20 object-cover shadow-page"
            />
            <img
              src="/media/events/scifi-night-1.jpg"
              alt="A member reading at the table during Science Fiction Reading Night"
              className="aspect-[4/3] w-full rounded-sm border border-amber-500/20 object-cover shadow-page"
            />
            <img
              src="/media/events/scifi-night-3.jpg"
              alt="A member reading with a kitten curled up beside them at Science Fiction Reading Night"
              className="aspect-[4/3] w-full rounded-sm border border-amber-500/20 object-cover shadow-page"
            />
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[radial-gradient(ellipse_at_50%_0%,_rgba(58,39,22,0.42)_0%,_rgba(21,15,10,0.5)_65%)] px-6 py-20 text-center">
        <div className="grain pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto max-w-xl">
          <h2 className="font-display text-2xl font-semibold text-white [text-shadow:0_1px_14px_rgba(0,0,0,0.55)] sm:text-3xl">
            Come to the next one
          </h2>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href="/"
              className="rounded-sm border border-parchment-300/30 px-6 py-3 font-sans text-sm uppercase tracking-widest text-parchment-200 transition hover:border-amber-400 hover:text-amber-300"
            >
              Back to Alexandria
            </a>
            <a
              href="/join/"
              className="rounded-sm bg-amber-500 px-6 py-3 font-sans text-sm font-semibold uppercase tracking-widest text-ink-950 transition hover:bg-amber-400"
            >
              Join the Society
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
