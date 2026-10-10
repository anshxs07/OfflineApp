import { ShieldCheck, ArrowRight, WifiOff, MessageCircle, Siren } from 'lucide-react'
import './Landing.css'


import { Link } from 'react-router-dom'

function Landing() {
  return (
    <div className="landing-page">

      {/* Navbar */}
      <nav className="landing-navbar">

        <div className="logo">
          <div className="logo-icon">
            <ShieldCheck size={22} />
          </div>

          <span className="logo-text">
            ResQNet
          </span>
        </div>

        <div className="nav-actions">
         <Link to="/login" className="nav-login">
           Login
           </Link>

          <Link to="/register" className="nav-register">
             Get Started
              </Link>
        </div>

      </nav>


      {/* Hero Section */}
      <section className="hero">

        <div className="hero-content">

          <div className="hero-badge">
            <Siren size={15} />
            Emergency Communication Platform
          </div>

          <h1 className="hero-title">
            Stay connected when
            <span> every second matters.</span>
          </h1>

          <p className="hero-description">
            ResQNet helps people communicate during emergencies,
            even when internet connectivity becomes unreliable.
            Report incidents, request help, and keep your community
            informed.
          </p>

          <div className="hero-actions">

           <Link to="/register" className="primary-button">
            Get Started
          <ArrowRight size={18} />
             </Link>

            <button className="secondary-button">
              How It Works
            </button>

          </div>

        </div>


        {/* Emergency Visual */}
        <div className="hero-visual">

          <div className="emergency-card">

            <div className="emergency-status">

              <strong>Emergency Center</strong>

              <div className="status-online">
                <span className="status-dot"></span>
                Online
              </div>

            </div>


            <div className="sos-circle">

              <div className="sos-icon">
                🚨
              </div>

              <div className="sos-text">
                SOS
              </div>

            </div>

            <p className="sos-subtext">
              Press SOS to report an emergency
            </p>


            <div className="hero-stats">

              <div className="stat">
                <span className="stat-value">
                  24/7
                </span>

                <span className="stat-label">
                  Available
                </span>
              </div>

              <div className="stat">
                <span className="stat-value">
                  Offline
                </span>

                <span className="stat-label">
                  Ready
                </span>
              </div>

              <div className="stat">
                <span className="stat-value">
                  Fast
                </span>

                <span className="stat-label">
                  Response
                </span>
              </div>

            </div>

          </div>

        </div>

      </section>


      {/* Features */}
      <section className="features-section">

        <div className="section-header">

          <div className="section-label">
            Why ResQNet
          </div>

          <h2 className="section-title">
            Built for situations where connectivity can't be trusted.
          </h2>

          <p className="section-description">
            ResQNet combines real-time communication with
            offline-first technology to help communities stay
            prepared during critical situations.
          </p>

        </div>


        <div className="features-grid">

          <div className="feature-card">

            <div className="feature-icon">
              <Siren size={23} />
            </div>

            <h3 className="feature-title">
              Emergency Alerts
            </h3>

            <p className="feature-description">
              Quickly report fires, medical emergencies,
              accidents and other critical situations.
            </p>

          </div>


          <div className="feature-card">

            <div className="feature-icon">
              <WifiOff size={23} />
            </div>

            <h3 className="feature-title">
              Offline First
            </h3>

            <p className="feature-description">
              Emergency information can be stored locally
              and synchronized automatically when connectivity
              returns.
            </p>

          </div>


          <div className="feature-card">

            <div className="feature-icon">
              <MessageCircle size={23} />
            </div>

            <h3 className="feature-title">
              Real-Time Messaging
            </h3>

            <p className="feature-description">
              Communicate with people and responders during
              an active emergency incident.
            </p>

          </div>

        </div>

      </section>


      {/* CTA */}
      <section className="cta-section">

        <div className="cta-container">

          <h2 className="cta-title">
            Be prepared before an emergency happens.
          </h2>

          <p className="cta-description">
            Create your ResQNet account and keep your emergency
            contacts, alerts, and communication tools ready.
          </p>

          <Link to="/register" className="primary-button">
               Create Your Account
           <ArrowRight size={18} />
</Link>

        </div>

      </section>


      {/* Footer */}
      <footer className="footer">

        <div className="footer-content">

          <div className="logo">

            <div className="logo-icon">
              <ShieldCheck size={18} />
            </div>

            <span className="logo-text">
              ResQNet
            </span>

          </div>

          <p className="footer-text">
            © 2026 ResQNet. Emergency communication platform.
          </p>

        </div>

      </footer>

    </div>
  )
}

export default Landing