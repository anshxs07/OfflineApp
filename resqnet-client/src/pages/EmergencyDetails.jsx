import { useEffect, useState } from 'react'
import {
  ArrowLeft,
  Siren,
  AlertTriangle,
  MapPin,
  Clock,
  CheckCircle,
  Trash2
} from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'

import {
  getEmergencyById,
  updateEmergency,
  deleteEmergency
} from '../api/emergencyApi'

import './EmergencyDetails.css'

function EmergencyDetails() {
  const navigate = useNavigate()
  const { id } = useParams()

  const [emergency, setEmergency] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updating, setUpdating] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const fetchEmergency = async () => {
      try {
        setLoading(true)
        setError('')

        const data = await getEmergencyById(id)

        setEmergency(data.emergency)
      } catch (error) {
        console.error(
          'Fetch emergency details error:',
          error.message
        )

        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchEmergency()
  }, [id])

  const formatDate = (date) => {
    if (!date) return 'Unknown time'

    return new Date(date).toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short'
    })
  }

  const handleAcknowledge = async () => {
    try {
      setUpdating(true)
      setError('')

      const data = await updateEmergency(id, {
        status: 'ACKNOWLEDGED'
      })

      setEmergency(data.emergency)
    } catch (error) {
      console.error(
        'Acknowledge emergency error:',
        error.message
      )

      setError(error.message)
    } finally {
      setUpdating(false)
    }
  }

  const handleResolve = async () => {
    try {
      setUpdating(true)
      setError('')

      const data = await updateEmergency(id, {
        status: 'RESOLVED'
      })

      setEmergency(data.emergency)
    } catch (error) {
      console.error(
        'Resolve emergency error:',
        error.message
      )

      setError(error.message)
    } finally {
      setUpdating(false)
    }
  }

  const handleDelete = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this emergency?'
    )

    if (!confirmed) return

    try {
      setDeleting(true)
      setError('')

      await deleteEmergency(id)

      navigate('/dashboard/emergencies')
    } catch (error) {
      console.error(
        'Delete emergency error:',
        error.message
      )

      setError(error.message)
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="emergency-details-page">
        <div className="emergency-details-message">
          <Clock size={25} />
          <p>Loading emergency details...</p>
        </div>
      </div>
    )
  }

  if (error && !emergency) {
    return (
      <div className="emergency-details-page">
        <button
          type="button"
          className="back-button"
          onClick={() =>
            navigate('/dashboard/emergencies')
          }
        >
          <ArrowLeft size={17} />
          Back to Emergencies
        </button>

        <div className="emergency-details-message error">
          <AlertTriangle size={25} />
          <p>{error}</p>
        </div>
      </div>
    )
  }

  if (!emergency) {
    return null
  }

  const isActive = emergency.status === 'ACTIVE'
  const isAcknowledged =
    emergency.status === 'ACKNOWLEDGED'
  const isResolved = emergency.status === 'RESOLVED'

  return (
    <div className="emergency-details-page">

      {/* Header */}

      <div className="details-header">
        <button
          type="button"
          className="back-button"
          onClick={() =>
            navigate('/dashboard/emergencies')
          }
        >
          <ArrowLeft size={17} />
          Back
        </button>

        <div>
          <p className="details-eyebrow">
            EMERGENCY DETAILS
          </p>

          <h1>{emergency.type}</h1>
        </div>
      </div>


      {/* Error */}

      {error && (
        <div className="details-error">
          <AlertTriangle size={16} />
          {error}
        </div>
      )}


      {/* Main Content */}

      <div className="emergency-details-grid">

        {/* Left */}

        <div className="details-main">

          <div className="details-card">

            <div className="details-card-header">

              <div className="details-icon">
                <Siren size={22} />
              </div>

              <div>
                <h2>{emergency.type}</h2>

                <p>
                  Created on{' '}
                  {formatDate(emergency.createdAt)}
                </p>
              </div>

            </div>


            {/* Status */}

            <div className="details-status-row">

              <span
                className={`emergency-status status-${emergency.status.toLowerCase()}`}
              >
                {emergency.status}
              </span>

              <span
                className={`emergency-severity severity-${emergency.severity.toLowerCase()}`}
              >
                {emergency.severity}
              </span>

            </div>


            {/* Description */}

            <div className="details-section">

              <h3>Description</h3>

              <p>
                {emergency.description ||
                  'No description provided.'}
              </p>

            </div>


            {/* Information */}

            <div className="details-section">

              <h3>Emergency Information</h3>

              <div className="details-info-grid">

                <div className="details-info-item">

                  <Clock size={17} />

                  <div>
                    <span>Created</span>
                    <strong>
                      {formatDate(
                        emergency.createdAt
                      )}
                    </strong>
                  </div>

                </div>


                <div className="details-info-item">

                  <AlertTriangle size={17} />

                  <div>
                    <span>Severity</span>
                    <strong>
                      {emergency.severity}
                    </strong>
                  </div>

                </div>


                <div className="details-info-item">

                  <CheckCircle size={17} />

                  <div>
                    <span>Status</span>
                    <strong>
                      {emergency.status}
                    </strong>
                  </div>

                </div>

              </div>

            </div>


            {/* Location */}

            <div className="details-section">

              <h3>Location</h3>

              <div className="location-box">

                <MapPin size={19} />

                <span>
                  {emergency.location ||
                    'No location provided'}
                </span>

              </div>

            </div>

          </div>

        </div>


        {/* Right Sidebar */}

        <aside className="details-sidebar">

          <div className="response-card">

            <div className="response-card-header">
              <h3>Emergency Actions</h3>
              <p>
                Manage the status of this emergency.
              </p>
            </div>


            {/* Acknowledge */}

            {isActive && (
              <button
                type="button"
                className="action-button acknowledge-button"
                onClick={handleAcknowledge}
                disabled={updating}
              >
                <CheckCircle size={17} />

                {updating
                  ? 'Updating...'
                  : 'Acknowledge Alert'}
              </button>
            )}


            {/* Resolve */}

            {(isActive || isAcknowledged) && (
              <button
                type="button"
                className="action-button resolve-button"
                onClick={handleResolve}
                disabled={updating}
              >
                <CheckCircle size={17} />

                {updating
                  ? 'Updating...'
                  : 'Mark as Resolved'}
              </button>
            )}


            {/* Resolved message */}

            {isResolved && (
              <div className="resolved-message">
                <CheckCircle size={18} />

                <div>
                  <strong>
                    Emergency Resolved
                  </strong>

                  <span>
                    This emergency has been marked as
                    resolved.
                  </span>
                </div>
              </div>
            )}


            {/* Delete */}

            <button
              type="button"
              className="action-button delete-button"
              onClick={handleDelete}
              disabled={deleting}
            >
              <Trash2 size={17} />

              {deleting
                ? 'Deleting...'
                : 'Delete Emergency'}
            </button>

          </div>


          {/* Safety Notice */}

          <div className="safety-notice">

            <AlertTriangle size={18} />

            <div>
              <strong>Safety Notice</strong>

              <p>
                If this is a serious emergency, contact
                your local emergency services immediately.
              </p>
            </div>

          </div>

        </aside>

      </div>

    </div>
  )
}

export default EmergencyDetails