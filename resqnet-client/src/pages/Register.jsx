import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import {
  ShieldCheck,
  ArrowLeft,
  User,
  Mail,
  Lock,
  Phone
} from 'lucide-react'

import { registerUser } from '../api/authApi'

import './Auth.css'

function Register() {

  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  })

  const [loading, setLoading] = useState(false)

  const [error, setError] = useState('')

  const [success, setSuccess] = useState('')


  const handleChange = (e) => {

    const { id, value } = e.target

    setFormData((previousData) => ({
      ...previousData,
      [id]: value
    }))
  }


  const handleSubmit = async (e) => {

    e.preventDefault()

    setError('')
    setSuccess('')
    setLoading(true)

    try {

      // Call Register API
      const data = await registerUser(formData)


      // Save JWT token
      localStorage.setItem(
        'token',
        data.token
      )


      // Save user information
      localStorage.setItem(
        'user',
        JSON.stringify(data.user)
      )


      setSuccess(
        'Account created successfully!'
      )


      // Redirect to dashboard
      setTimeout(() => {
        navigate('/dashboard')
      }, 800)

    } catch (error) {

      console.error(
        'Registration error:',
        error
      )

      setError(
        error.message ||
        'Something went wrong. Please try again.'
      )

    } finally {

      setLoading(false)

    }
  }


  return (

    <div className="auth-page">

      <div className="auth-container">


        {/* =========================
            LEFT SIDE
        ========================= */}

        <div className="auth-info">

          <Link
            to="/"
            className="auth-logo"
          >

            <div className="logo-icon">

              <ShieldCheck size={22} />

            </div>

            <span>
              ResQNet
            </span>

          </Link>


          <div className="auth-info-content">

            <div className="auth-badge">

              <span className="auth-badge-dot"></span>

              Join the Emergency Network

            </div>


            <h1>

              Be prepared

              <span>
                {' '}when it matters.
              </span>

            </h1>


            <p>

              Create your account and keep your emergency

              communication tools ready whenever you need them.

            </p>

          </div>


          <p className="auth-footer-text">

            Your safety. Our priority.

          </p>

        </div>



        {/* =========================
            RIGHT SIDE
        ========================= */}

        <div className="auth-form-section">

          <div className="auth-form-container">


            <Link
              to="/"
              className="back-link"
            >

              <ArrowLeft size={16} />

              Back to home

            </Link>


            <div className="form-header">

              <h2>
                Create your account
              </h2>

              <p>
                Get started with ResQNet today.
              </p>

            </div>



            {/* =========================
                ERROR MESSAGE
            ========================= */}

            {error && (

              <div className="auth-message auth-error">

                {error}

              </div>

            )}



            {/* =========================
                SUCCESS MESSAGE
            ========================= */}

            {success && (

              <div className="auth-message auth-success">

                {success}

              </div>

            )}



            <form onSubmit={handleSubmit}>


              {/* =========================
                  NAME
              ========================= */}

              <div className="form-group">

                <label htmlFor="name">
                  Full name
                </label>

                <div className="input-wrapper">

                  <User size={18} />

                  <input
                    id="name"
                    type="text"
                    placeholder="Your full name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />

                </div>

              </div>



              {/* =========================
                  EMAIL
              ========================= */}

              <div className="form-group">

                <label htmlFor="email">
                  Email address
                </label>

                <div className="input-wrapper">

                  <Mail size={18} />

                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />

                </div>

              </div>



              {/* =========================
                  PHONE
              ========================= */}

              <div className="form-group">

                <label htmlFor="phone">
                  Phone number
                </label>

                <div className="input-wrapper">

                  <Phone size={18} />

                  <input
                    id="phone"
                    type="tel"
                    placeholder="+91 XXXXX XXXXX"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />

                </div>

              </div>



              {/* =========================
                  PASSWORD
              ========================= */}

              <div className="form-group">

                <label htmlFor="password">
                  Password
                </label>

                <div className="input-wrapper">

                  <Lock size={18} />

                  <input
                    id="password"
                    type="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    minLength={6}
                    required
                  />

                </div>

              </div>



              {/* =========================
                  SUBMIT
              ========================= */}

              <button
                type="submit"
                className="auth-submit"
                disabled={loading}
              >

                {loading
                  ? 'Creating Account...'
                  : 'Create Account'
                }

              </button>

            </form>



            <div className="auth-switch">

              <span>
                Already have an account?
              </span>

              <Link to="/login">
                Sign in
              </Link>

            </div>


          </div>

        </div>

      </div>

    </div>
  )
}

export default Register