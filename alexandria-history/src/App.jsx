import React, { useState } from 'react'
import IntroFlythrough from './components/IntroFlythrough.jsx'
import BackgroundVideo from './components/BackgroundVideo.jsx'
import CursorGlow from './components/CursorGlow.jsx'
import Nav from './components/Nav.jsx'
import Hero from './components/Hero.jsx'
import TheIdea from './components/TheIdea.jsx'
import Gatherings from './components/Gatherings.jsx'
import HistoryTimeline from './components/HistoryTimeline.jsx'
import Gallery from './components/Gallery.jsx'
import Join from './components/Join.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
  const [introDone, setIntroDone] = useState(false)

  return (
    <>
      {!introDone && <IntroFlythrough onComplete={() => setIntroDone(true)} />}
      <BackgroundVideo />
      <CursorGlow />
      <div className="relative z-10 min-h-screen">
        <Nav />
        <main>
          <Hero />
          <TheIdea />
          <Gatherings />
          <HistoryTimeline />
          <Gallery />
          <Join />
        </main>
        <Footer />
      </div>
    </>
  )
}
