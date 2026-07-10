import React, { useState } from 'react'

// The actual Alexandria Application Form, embedded directly so every
// submission is handled by Google Forms itself and lands in the sheet
// it's already connected to: https://docs.google.com/spreadsheets/d/1gNCdEjFz_duOlmn7TunSQlxMVdwNsiC94wSEOhgQkNA
const FORM_EMBED_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSfvVC-FJ5j_NTi4oFBcaVPf2Fb9h1rzDRNXH_M3lmN6xuj5qA/viewform?embedded=true'
const FORM_DIRECT_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSfvVC-FJ5j_NTi4oFBcaVPf2Fb9h1rzDRNXH_M3lmN6xuj5qA/viewform'

export default function RegistrationPage() {
  const [loaded, setLoaded] = useState(false)

  return (
    <header className="relative overflow-hidden border-b border-amber-500/10 bg-[radial-gradient(ellipse_at_50%_0%,_rgba(43,29,17,0.42)_0%,_rgba(21,15,10,0.5)_60%,_rgba(13,9,6,0.6)_100%)] px-6 py-20 sm:py-28">
      <div className="grain pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="relative mx-auto max-w-2xl text-center">
        <p className="mb-5 font-sans text-xs uppercase tracking-[0.3em] text-amber-400">
          Apply
        </p>
        <h1 className="font-display text-4xl font-semibold leading-tight text-white [text-shadow:0_2px_18px_rgba(0,0,0,0.55)] sm:text-6xl">
          Join Alexandria
        </h1>
        <p className="mx-auto mt-6 max-w-xl font-serif text-lg leading-relaxed text-parchment-200 [text-shadow:0_1px_10px_rgba(0,0,0,0.5)]">
          Alexandria is a society of autodidacts who read deeply and completely, together. Tell
          us a bit about yourself, and we'll be in touch.
        </p>
      </div>

      <div className="relative mx-auto mt-14 max-w-2xl">
        <div className="overflow-hidden rounded-sm border border-amber-500/25 bg-ink-950/60 shadow-page backdrop-blur-[2px]">
          {!loaded && (
            <div className="flex h-[600px] flex-col items-center justify-center gap-3 font-sans text-sm text-parchment-400">
              <span className="h-8 w-8 animate-spin rounded-full border-2 border-amber-500/30 border-t-amber-400" />
              Loading the application form…
            </div>
          )}
          <iframe
            title="Alexandria Application Form"
            src={FORM_EMBED_URL}
            onLoad={() => setLoaded(true)}
            className={loaded ? 'block' : 'hidden'}
            width="100%"
            height="1250"
            frameBorder="0"
            marginHeight="0"
            marginWidth="0"
          >
            Loading…
          </iframe>
        </div>
        <p className="mt-6 font-sans text-sm text-parchment-400">
          Form not loading?{' '}
          <a
            href={FORM_DIRECT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="border-b border-amber-500/60 text-amber-300 transition hover:text-amber-200"
          >
            Open it directly ↗
          </a>
        </p>
      </div>
    </header>
  )
}
