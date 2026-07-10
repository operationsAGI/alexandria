import React from 'react'
import BackgroundVideo from './components/BackgroundVideo.jsx'
import CursorGlow from './components/CursorGlow.jsx'
import Nav from './components/Nav.jsx'
import RegistrationPage from './components/RegistrationPage.jsx'
import Footer from './components/Footer.jsx'

export default function JoinApp() {
  return (
    <>
      <BackgroundVideo />
      <CursorGlow />
      <div className="relative z-10 min-h-screen">
        <Nav onHomePage={false} />
        <main>
          <RegistrationPage />
        </main>
        <Footer onHomePage={false} />
      </div>
    </>
  )
}
