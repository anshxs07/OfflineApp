import { useState } from 'react'

import {
  Siren,
  X,
  MapPin,
  WifiOff
} from 'lucide-react'

import { createEmergency } from '../api/emergencyApi'
import useOnlineStatus from '../hooks/useOnlineStatus'

import {
  savePendingEmergency
} from '../utils/offlineEmergencyDB'

import './EmergencyModal.css'


function EmergencyModal({
  onClose,
  onEmergencyCreated
}) {
  const isOnline = useOnlineStatus()

  const [formData, setFormData] = useState({
    type: 'MEDICAL',
    severity: 'HIGH',
    description: '',
    location: ''
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')


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
     HANDLE SUBMIT
  ========================================= */

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      setLoading(true)
      setError('')


      /* =====================================
         OFFLINE
      ===================================== */

      if (!isOnline) {
        const pendingEmergency = {
          localId: `offline-${Date.now()}`,

          type: formData.type,

          severity: formData.severity,

          description:
            formData.description.trim(),

          location:
            formData.location.trim(),

          status: 'PENDING',

          createdAt:
            new Date().toISOString()
        }


        await savePendingEmergency(
          pendingEmergency
        )


        /*
          Show pending emergency
          immediately in dashboard
        */

        onEmergencyCreated(
          pendingEmergency
        )

        return
      }


      /* =====================================
         ONLINE
      ===================================== */

      const data = await createEmergency(
        formData
      )


      onEmergencyCreated(
        data.emergency
      )

    } catch (error) {
      console.error(
        'Create emergency error:',
        error.message
      )

      setError(error.message)

    } finally {
      setLoading(false)
    }
  }


  return (
    <div
      className="emergency-modal-overlay"
      onClick={onClose}
    >

      <div
        className="emergency-modal"
        onClick={(event) =>
          event.stopPropagation()
        }
      >

        {/* ===================================
            HEADER
        =================================== */}

        <div className="emergency-modal-header">

          <div className="emergency-modal-title">

            <div className="emergency-modal-icon">
              <Siren size={20} />
            </div>

            <div>

              <h2>
                Emergency Alert
              </h2>

              <p>
                Provide emergency details
              </p>

            </div>

          </div>


          <button
            type="button"
            className="emergency-modal-close"
            onClick={onClose}
            disabled={loading}
          >
            <X size={18} />
          </button>

        </div>


        {/* ===================================
            OFFLINE NOTICE
        =================================== */}

        {!isOnline && (

          <div className="emergency-offline-notice">

            <WifiOff size={17} />

            <div>

              <strong>
                You are offline
              </strong>

              <span>
                Your emergency alert will be
                saved and synced when connection
                is restored.
              </span>

            </div>

          </div>

        )}


        {/* ===================================
            ERROR
        =================================== */}

        {error && (

          <div className="emergency-modal-error">
            {error}
          </div>

        )}


        {/* ===================================
            FORM
        =================================== */}

        <form
          className="emergency-modal-form"
          onSubmit={handleSubmit}
        >

          {/* Emergency Type */}

          <div className="emergency-form-field">

            <label htmlFor="type">
              Emergency Type
            </label>

            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              disabled={loading}
            >

              <option value="FIRE">
                Fire
              </option>

              <option value="MEDICAL">
                Medical
              </option>

              <option value="ACCIDENT">
                Accident
              </option>

              <option value="FLOOD">
                Flood
              </option>

              <option value="OTHER">
                Other
              </option>

            </select>

          </div>


          {/* Severity */}

          <div className="emergency-form-field">

            <label htmlFor="severity">
              Severity
            </label>

            <select
              id="severity"
              name="severity"
              value={formData.severity}
              onChange={handleChange}
              disabled={loading}
            >

              <option value="LOW">
                Low
              </option>

              <option value="MEDIUM">
                Medium
              </option>

              <option value="HIGH">
                High
              </option>

            </select>

          </div>


          {/* Description */}

          <div className="emergency-form-field">

            <label htmlFor="description">
              Description
            </label>

            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the emergency..."
              rows="4"
              disabled={loading}
            />

          </div>


          {/* Location */}

          <div className="emergency-form-field">

            <label htmlFor="location">
              Location
            </label>

            <div className="emergency-location-input">

              <MapPin size={17} />

              <input
                id="location"
                name="location"
                type="text"
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter your location"
                disabled={loading}
              />

            </div>

          </div>


          {/* =================================
              ACTIONS
          ================================= */}

          <div className="emergency-modal-actions">

            <button
              type="button"
              className="emergency-cancel-button"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>


            <button
              type="submit"
              className="emergency-submit-button"
              disabled={loading}
            >

              {isOnline ? (
                <Siren size={17} />
              ) : (
                <WifiOff size={17} />
              )}

              {loading
                ? 'Saving...'
                : isOnline
                  ? 'Send Emergency Alert'
                  : 'Save Emergency Offline'}

            </button>

          </div>

        </form>

      </div>

    </div>
  )
}


export default EmergencyModal