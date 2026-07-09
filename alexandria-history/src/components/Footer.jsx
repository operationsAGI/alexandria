import React from 'react'

export default function Footer() {
  return (
    <footer className="border-t border-amber-500/10 bg-ink-950/60 px-6 py-10 backdrop-blur-[3px]">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 font-sans text-xs text-parchment-400 sm:flex-row">
        <p>© {new Date().getFullYear()} Alexandria, The Reading Society, San Francisco.</p>
        <div className="flex gap-6">
          <a href="#the-idea" className="hover:text-amber-300">The Idea</a>
          <a href="#gatherings" className="hover:text-amber-300">Gatherings</a>
          <a href="#history" className="hover:text-amber-300">History</a>
          <a href="#gallery" className="hover:text-amber-300">Gallery</a>
          <a href="#join" className="hover:text-amber-300">Join</a>
        </div>
      </div>
    </footer>
  )
}
