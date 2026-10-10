import { useEffect, useState } from 'react'

import {
  UserCircle,
  Mail,
  Phone,
  ShieldAlert,
  MapPin,
  Edit3,
  Save,
  X,
  Trash2,
  AlertTriangle
} from 'lucide-react'

import { useNavigate } from 'react-router-dom'

import {
  getProfile,
  updateProfile,
  deleteAccount
} from '../api/userApi'

import { logoutUser } from '../api/authApi'

import './Profile.css'


function Profile() {
  const navigate = useNavigate()

  const [user, setUser] = useState(null)

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    emergencyContact: '',
    emergencyPhone: ''
  })

  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')


  /* =========================================
     GET PROFILE
  ========================================= */

  useEffect(() => {
    fetchProfile()
  }, [])


  const fetchProfile = async () => {
    try {
      setLoading(true)
      setError('')

      const data = await getProfile()

      setUser(data.user)

      setFormData({
        name: data.user.name || '',
        phone: data.user.phone || '',
        emergencyContact:
          data.user.emergencyContact || '',
        emergencyPhone:
          data.user.emergencyPhone || ''
      })

      localStorage.setItem(
        'user',
        JSON.stringify(data.user)
      )

    } catch (error) {
      console.error(
        'Fetch profile error:',
        error.message
      )

      /*
        Fallback to localStorage
      */

      const storedUser =
        localStorage.getItem('user')

      if (storedUser) {
        try {
          const parsedUser =
            JSON.parse(storedUser)

          setUser(parsedUser)

          setFormData({
            name: parsedUser.name || '',
            phone: parsedUser.phone || '',
            emergencyContact:
              parsedUser.emergencyContact || '',
            emergencyPhone:
              parsedUser.emergencyPhone || ''
          })

        } catch {
          localStorage.removeItem('user')
        }
      }

      setError(error.message)

    } finally {
      setLoading(false)
    }
  }


  /* =========================================
     HANDLE INPUT
  ========================================= */

  const handleChange = (event) => {
    const {
      name,
      value
    } = event.target

    setFormData((previous) => ({
      ...previous,
      [name]: value
    }))
  }


  /* =========================================
     EDIT
  ========================================= */

  const handleEdit = () => {
    setSuccess('')
    setError('')
    setIsEditing(true)
  }


  /* =========================================
     CANCEL
  ========================================= */

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      phone: user?.phone || '',
      emergencyContact:
        user?.emergencyContact || '',
      emergencyPhone:
        user?.emergencyPhone || ''
    })

    setError('')
    setSuccess('')
    setIsEditing(false)
  }


  /* =========================================
     SAVE
  ========================================= */

  const handleSave = async (event) => {
    event.preventDefault()

    if (!formData.name.trim()) {
      setError('Name is required')
      return
    }

    if (!formData.phone.trim()) {
      setError('Phone number is required')
      return
    }

    try {
      setSaving(true)
      setError('')
      setSuccess('')

      const data = await updateProfile({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        emergencyContact:
          formData.emergencyContact.trim(),
        emergencyPhone:
          formData.emergencyPhone.trim()
      })

      setUser(data.user)

      setFormData({
        name: data.user.name || '',
        phone: data.user.phone || '',
        emergencyContact:
          data.user.emergencyContact || '',
        emergencyPhone:
          data.user.emergencyPhone || ''
      })

      localStorage.setItem(
        'user',
        JSON.stringify(data.user)
      )

      setIsEditing(false)
      setSuccess(
        'Profile updated successfully.'
      )

    } catch (error) {
      console.error(
        'Update profile error:',
        error.message
      )

      setError(error.message)

    } finally {
      setSaving(false)
    }
  }


  /* =========================================
     DELETE ACCOUNT
  ========================================= */

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone.'
    )

    if (!confirmed) return

    try {
      setDeleting(true)
      setError('')

      await deleteAccount()

      logoutUser()

      navigate('/login', {
        replace: true
      })

    } catch (error) {
      console.error(
        'Delete account error:',
        error.message
      )

      setError(error.message)
      setDeleting(false)
    }
  }


  /* =========================================
     LOADING
  ========================================= */

  if (loading) {
    return (
      <div className="profile-page">

        <div className="profile-message">
          <UserCircle size={24} />

          <p>
            Loading profile...
          </p>
        </div>

      </div>
    )
  }


  return (
    <div className="profile-page">

      {/* =====================================
          HEADER
      ===================================== */}

      <div className="profile-header">

        <div>

          <p className="profile-eyebrow">
            ACCOUNT
          </p>

          <h1>
            Profile
          </h1>

          <p>
            Manage your personal and emergency
            information.
          </p>

        </div>


        {!isEditing && (

          <button
            type="button"
            className="profile-edit-button"
            onClick={handleEdit}
          >
            <Edit3 size={16} />
            Edit Profile
          </button>

        )}

      </div>


      {/* =====================================
          ERROR / SUCCESS
      ===================================== */}

      {error && (

        <div className="profile-alert profile-alert-error">

          <AlertTriangle size={16} />

          <span>
            {error}
          </span>

          <button
            type="button"
            onClick={() => setError('')}
          >
            <X size={15} />
          </button>

        </div>

      )}


      {success && (

        <div className="profile-alert profile-alert-success">

          <ShieldAlert size={16} />

          <span>
            {success}
          </span>

        </div>

      )}


      {/* =====================================
          PROFILE FORM
      ===================================== */}

      <form
        className="profile-form"
        onSubmit={handleSave}
      >

        {/* ===================================
            PERSONAL INFORMATION
        =================================== */}

        <section className="profile-card">

          <div className="profile-card-header">

            <div>

              <h2>
                Personal Information
              </h2>

              <p>
                Your basic account information.
              </p>

            </div>

            <UserCircle size={20} />

          </div>


          <div className="profile-fields">

            {/* Name */}

            <div className="profile-field">

              <label htmlFor="name">
                Full Name
              </label>

              <div className="profile-input-wrapper">

                <UserCircle size={17} />

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!isEditing || saving}
                />

              </div>

            </div>


            {/* Email */}

            <div className="profile-field">

              <label htmlFor="email">
                Email
              </label>

              <div className="profile-input-wrapper">

                <Mail size={17} />

                <input
                  id="email"
                  type="email"
                  value={user?.email || ''}
                  disabled
                />

              </div>

              <small>
                Email cannot be changed.
              </small>

            </div>


            {/* Phone */}

            <div className="profile-field">

              <label htmlFor="phone">
                Phone Number
              </label>

              <div className="profile-input-wrapper">

                <Phone size={17} />

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!isEditing || saving}
                />

              </div>

            </div>


            {/* User ID */}

            <div className="profile-field">

              <label htmlFor="userId">
                User ID
              </label>

              <div className="profile-input-wrapper">

                <ShieldAlert size={17} />

                <input
                  id="userId"
                  type="text"
                  value={user?._id || user?.id || ''}
                  disabled
                />

              </div>

            </div>

          </div>

        </section>


        {/* ===================================
            EMERGENCY INFORMATION
        =================================== */}

        <section className="profile-card">

          <div className="profile-card-header">

            <div>

              <h2>
                Emergency Information
              </h2>

              <p>
                Information used during emergencies.
              </p>

            </div>

            <ShieldAlert size={20} />

          </div>


          <div className="profile-fields">

            {/* Emergency Contact */}

            <div className="profile-field">

              <label htmlFor="emergencyContact">
                Emergency Contact
              </label>

              <div className="profile-input-wrapper">

                <UserCircle size={17} />

                <input
                  id="emergencyContact"
                  name="emergencyContact"
                  type="text"
                  value={
                    formData.emergencyContact
                  }
                  onChange={handleChange}
                  placeholder="Enter emergency contact"
                  disabled={!isEditing || saving}
                />

              </div>

            </div>


            {/* Emergency Phone */}

            <div className="profile-field">

              <label htmlFor="emergencyPhone">
                Emergency Contact Phone
              </label>

              <div className="profile-input-wrapper">

                <Phone size={17} />

                <input
                  id="emergencyPhone"
                  name="emergencyPhone"
                  type="tel"
                  value={
                    formData.emergencyPhone
                  }
                  onChange={handleChange}
                  placeholder="Enter emergency contact phone"
                  disabled={!isEditing || saving}
                />

              </div>

            </div>

          </div>

        </section>


        {/* ===================================
            LOCATION
        =================================== */}

        <section className="profile-card">

          <div className="profile-card-header">

            <div>

              <h2>
                Location Sharing
              </h2>

              <p>
                Location can help responders
                reach you during an emergency.
              </p>

            </div>

            <MapPin size={20} />

          </div>


          <div className="location-coming-soon">

            <div>

              <strong>
                Location Sharing
              </strong>

              <p>
                Location sharing settings will
                be available when the emergency
                location system is connected.
              </p>

            </div>


            <span>
              Coming Soon
            </span>

          </div>

        </section>


        {/* ===================================
            EDIT ACTIONS
        =================================== */}

        {isEditing && (

          <div className="profile-actions">

            <button
              type="button"
              className="profile-cancel-button"
              onClick={handleCancel}
              disabled={saving}
            >
              <X size={16} />
              Cancel
            </button>


            <button
              type="submit"
              className="profile-save-button"
              disabled={saving}
            >
              <Save size={16} />

              {saving
                ? 'Saving...'
                : 'Save Changes'}

            </button>

          </div>

        )}

      </form>


      {/* =====================================
          DANGER ZONE
      ===================================== */}

      <section className="profile-danger-card">

        <div className="profile-danger-content">

          <div className="profile-danger-icon">
            <Trash2 size={18} />
          </div>

          <div>

            <h2>
              Delete Account
            </h2>

            <p>
              Permanently delete your ResQNet
              account and account data.
            </p>

          </div>

        </div>


        <button
          type="button"
          className="profile-delete-button"
          onClick={handleDeleteAccount}
          disabled={deleting}
        >
          <Trash2 size={16} />

          {deleting
            ? 'Deleting...'
            : 'Delete Account'}

        </button>

      </section>

    </div>
  )
}


export default Profile