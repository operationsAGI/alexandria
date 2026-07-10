import React from 'react'
import BackgroundVideo from './components/BackgroundVideo.jsx'
import CursorGlow from './components/CursorGlow.jsx'
import Nav from './components/Nav.jsx'
import EventRecapPage from './components/EventRecapPage.jsx'
import Footer from './components/Footer.jsx'

export default function EventApp() {
  return (
    <>
      <BackgroundVideo />
      <CursorGlow />
      <div className="relative z-10 min-h-screen">
        <Nav onHomePage={false} />
        <main>
          <EventRecapPage />
        </main>
        <Footer onHomePage={false} />
      </div>
    </>
  )
}
