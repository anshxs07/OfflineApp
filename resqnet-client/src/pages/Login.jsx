import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import {
  ShieldCheck,
  ArrowLeft,
  Mail,
  Lock
} from 'lucide-react'

import { loginUser } from '../api/authApi'

import './Auth.css'

function Login() {

  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    email: '',
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

      // Call Login API
      const data = await loginUser(formData)


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
        'Login successful!'
      )


      // Redirect to dashboard
      setTimeout(() => {
        navigate('/dashboard')
      }, 500)

    } catch (error) {

      console.error(
        'Login error:',
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

              Emergency Communication Platform

            </div>


            <h1>

              Stay connected.

              <span>
                {' '}Stay safe.
              </span>

            </h1>


            <p>

              Access your emergency dashboard, manage your

              contacts, and stay connected with your community.

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
                Welcome back
              </h2>

              <p>
                Sign in to access your ResQNet account.
              </p>

            </div>



            {/* ERROR */}

            {error && (

              <div className="auth-message auth-error">

                {error}

              </div>

            )}



            {/* SUCCESS */}

            {success && (

              <div className="auth-message auth-success">

                {success}

              </div>

            )}



            <form onSubmit={handleSubmit}>


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
                  PASSWORD
              ========================= */}

              <div className="form-group">

                <div className="label-row">

                  <label htmlFor="password">

                    Password

                  </label>


                  <button
                    type="button"
                    className="forgot-password"
                  >

                    Forgot password?

                  </button>

                </div>


                <div className="input-wrapper">

                  <Lock size={18} />

                  <input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
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
                  ? 'Signing In...'
                  : 'Sign In'
                }

              </button>

            </form>



            <div className="auth-switch">

              <span>

                Don't have an account?

              </span>

              <Link to="/register">

                Create account

              </Link>

            </div>


          </div>

        </div>


      </div>

    </div>
  )
}

export default Login