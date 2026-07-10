import React from 'react'

const PHOTOS = [
  { src: '/media/gallery/gallery-1.jpg', alt: 'A reading gathering seated around a table lined with books' },
  { src: '/media/gallery/gallery-2.jpg', alt: 'Members in conversation after a reading night' },
  { src: '/media/gallery/gallery-3.jpg', alt: 'A small group reading together, seated on the floor' },
  { src: '/media/gallery/gallery-4.jpg', alt: 'Members gathered near a bookshelf, in conversation' },
]

export default function Gallery() {
  return (
    <section id="gallery" className="bg-ink-950/45 px-6 py-24 backdrop-blur-[3px]">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 max-w-xl">
          <p className="mb-3 font-sans text-xs uppercase tracking-[0.3em] text-amber-400">
            Gallery
          </p>
          <h2 className="font-display text-3xl font-semibold text-white [text-shadow:0_1px_12px_rgba(0,0,0,0.5)] sm:text-4xl">
            From the gatherings
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {PHOTOS.map((p) => (
            <div
              key={p.src}
              className="aspect-[4/3] overflow-hidden rounded-sm border border-amber-500/15 bg-wood-900"
            >
              <img
                src={p.src}
                alt={p.alt}
                loading="lazy"
                className="h-full w-full object-cover transition duration-500 hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
