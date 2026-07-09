import React from 'react'

export default function TheIdea() {
  return (
    <section id="the-idea" className="relative bg-wood-900/45 px-6 py-24 backdrop-blur-[3px]">
      <div className="mx-auto grid max-w-6xl gap-14 sm:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="mb-3 font-sans text-xs uppercase tracking-[0.3em] text-amber-400">The Idea</p>
          <h2 className="font-display text-3xl font-semibold text-white [text-shadow:0_1px_12px_rgba(0,0,0,0.5)] sm:text-4xl">
            An antidote to a fragmenting mind
          </h2>
        </div>
        <div className="space-y-5 font-serif text-lg leading-relaxed text-parchment-200 [text-shadow:0_1px_8px_rgba(0,0,0,0.45)]">
          <p>
            Alexandria takes its name from the ancient library that once tried to collect the
            whole of human knowledge under one roof. It exists to name and resist two modern
            failures: a worldview splintered into shallow, disconnected takes, and an attention
            span too short to hold a long, complex thought.
          </p>
          <p>
            The counter-move is immersion: gathering people to read entire books and papers, in
            person, in sustained focus, until the habit of long-form thought returns by practice
            rather than by willpower alone. Members work toward what the society calls{' '}
            <em className="text-amber-300 not-italic">technical omnicompetence</em>: a personal
            knowledge base broad and deep enough to reconstruct the foundations of civilization.
          </p>
          <p className="border-l-2 border-amber-500/50 pl-5 italic text-parchment-200">
            Autodidactic. Bibliophilic. Omnicompetent.
          </p>
        </div>
      </div>
    </section>
  )
}
