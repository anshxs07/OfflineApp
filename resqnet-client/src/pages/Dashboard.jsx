import { useEffect, useState } from 'react'

import {
  ShieldCheck,
  Wifi,
  WifiOff,
  Siren,
  AlertTriangle,
  MapPin,
  Users,
  Clock,
  ChevronRight
} from 'lucide-react'

import { useNavigate } from 'react-router-dom'

import { getProfile } from '../api/userApi'
import { getEmergencies } from '../api/emergencyApi'
import syncPendingEmergencies from '../utils/syncPendingEmergencies'

import useOnlineStatus from '../hooks/useOnlineStatus'

import {
  getPendingEmergencies
} from '../utils/offlineEmergencyDB'

import EmergencyModal from '../components/EmergencyModal'

import './Dashboard.css'


function Dashboard() {
  const navigate = useNavigate()
  const isOnline = useOnlineStatus()

  const [user, setUser] = useState(null)
  const [emergencies, setEmergencies] = useState([])

  const [loading, setLoading] = useState(true)
  const [emergenciesLoading, setEmergenciesLoading] =
    useState(true)

  const [showEmergencyModal, setShowEmergencyModal] =
    useState(false)


  /* =========================================
     FETCH PROFILE
  ========================================= */

  useEffect(() => {
    const fetchDashboardProfile = async () => {
      try {
        setLoading(true)

        const data = await getProfile()

        setUser(data.user)

        localStorage.setItem(
          'user',
          JSON.stringify(data.user)
        )
      } catch (error) {
        console.error(
          'Dashboard profile error:',
          error.message
        )

        const storedUser =
          localStorage.getItem('user')

        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser))
          } catch {
            localStorage.removeItem('user')
          }
        }
      } finally {
        setLoading(false)
      }
    }

    /*
      Profile API only needs to be called
      when we are online.
    */

    if (isOnline) {
      fetchDashboardProfile()
    } else {
      const storedUser =
        localStorage.getItem('user')

      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser))
        } catch {
          localStorage.removeItem('user')
        }
      }

      setLoading(false)
    }
  }, [isOnline])


  /* =========================================
     FETCH EMERGENCIES
  ========================================= */

  useEffect(() => {
  const handleConnectionChange = async () => {
    /*
      When internet is restored,
      first sync pending emergencies.
    */

    if (isOnline) {
      await syncPendingEmergencies()
    }

    /*
      After sync, fetch the latest data.
    */

    await fetchEmergencies()
  }

  handleConnectionChange()
}, [isOnline])

  const fetchEmergencies = async () => {
    try {
      setEmergenciesLoading(true)

      /*
        Always load pending emergencies first.
        This works even when offline.
      */

      const pendingEmergencies =
        await getPendingEmergencies()


      /*
        When online, fetch server emergencies.
      */

      if (isOnline) {
        try {
          const data = await getEmergencies()

          const serverEmergencies =
            data.emergencies || []

          /*
            Pending emergencies are kept separately
            until sync is implemented.
          */

          setEmergencies([
            ...pendingEmergencies,
            ...serverEmergencies
          ])

          return
        } catch (error) {
          console.error(
            'Dashboard emergencies error:',
            error.message
          )
        }
      }


      /*
        Offline OR backend unavailable:
        show local pending emergencies.
      */

      setEmergencies(
        pendingEmergencies
      )

    } catch (error) {
      console.error(
        'Load offline emergencies error:',
        error.message
      )

      setEmergencies([])
    } finally {
      setEmergenciesLoading(false)
    }
  }


  /* =========================================
     EMERGENCY CREATED
  ========================================= */

  const handleEmergencyCreated = (
    emergency
  ) => {
    setEmergencies((previous) => [
      emergency,
      ...previous
    ])

    setShowEmergencyModal(false)
  }


  /* =========================================
     GREETING
  ========================================= */

  const getGreeting = () => {
    const hour = new Date().getHours()

    if (hour < 12) {
      return 'Good morning'
    }

    if (hour < 18) {
      return 'Good afternoon'
    }

    return 'Good evening'
  }


  /* =========================================
     ACTIVE / PENDING EMERGENCIES
  ========================================= */

  const activeEmergencies =
    emergencies.filter(
      (emergency) =>
        emergency.status === 'ACTIVE' ||
        emergency.status === 'ACKNOWLEDGED' ||
        emergency.status === 'PENDING'
    )


  const latestEmergencies =
    emergencies.slice(0, 3)


  const formatDate = (date) => {
    if (!date) return 'Unknown time'

    return new Date(date).toLocaleString(
      'en-IN',
      {
        dateStyle: 'medium',
        timeStyle: 'short'
      }
    )
  }


  const hasActiveEmergency =
    activeEmergencies.length > 0


  return (
    <div className="dashboard-page">

      {/* =====================================
          HEADER
      ===================================== */}

      <div className="dashboard-header">

        <div>

          <p className="dashboard-eyebrow">
            RESQNET DASHBOARD
          </p>

          <h1>
            {getGreeting()}
            {loading
              ? ''
              : `, ${user?.name || 'User'}`}
          </h1>

          <p>
            Stay connected and be prepared for
            emergencies.
          </p>

        </div>


        <div
          className={`connection-badge ${
            isOnline
              ? 'connection-online'
              : 'connection-offline'
          }`}
        >

          {isOnline ? (
            <Wifi size={15} />
          ) : (
            <WifiOff size={15} />
          )}

          <span>
            {isOnline
              ? 'Online'
              : 'Offline'}
          </span>

        </div>

      </div>


      {/* =====================================
          STATS
      ===================================== */}

      <div className="dashboard-stats">

        {/* My Status */}

        <div className="dashboard-stat-card">

          <div className="stat-icon stat-blue">
            <ShieldCheck size={19} />
          </div>

          <div>

            <span>
              My Status
            </span>

            <strong
              className={
                hasActiveEmergency
                  ? 'stat-danger'
                  : 'stat-safe'
              }
            >
              {hasActiveEmergency
                ? 'HELP NEEDED'
                : 'SAFE'}
            </strong>

          </div>

        </div>


        {/* Connection */}

        <div className="dashboard-stat-card">

          <div
            className={`stat-icon ${
              isOnline
                ? 'stat-green'
                : 'stat-orange'
            }`}
          >

            {isOnline ? (
              <Wifi size={19} />
            ) : (
              <WifiOff size={19} />
            )}

          </div>

          <div>

            <span>
              Connection
            </span>

            <strong>
              {isOnline
                ? 'ONLINE'
                : 'OFFLINE'}
            </strong>

          </div>

        </div>


        {/* Active Alerts */}

        <div className="dashboard-stat-card">

          <div className="stat-icon stat-red">
            <Siren size={19} />
          </div>

          <div>

            <span>
              Active Alerts
            </span>

            <strong>
              {activeEmergencies.length}
            </strong>

          </div>

        </div>

      </div>


      {/* =====================================
          MAIN GRID
      ===================================== */}

      <div className="dashboard-main-grid">

        {/* SOS */}

        <div className="sos-card">

          <div className="sos-content">

            <div className="sos-icon">
              <Siren size={24} />
            </div>

            <div>

              <p className="sos-label">
                EMERGENCY
              </p>

              <h2>
                Need immediate help?
              </h2>

              <p>
                Send an emergency alert to your
                safety network.
              </p>

            </div>

          </div>


          <button
            type="button"
            className="sos-button"
            onClick={() =>
              setShowEmergencyModal(true)
            }
          >
            <Siren size={18} />

            Send Emergency Alert

          </button>

        </div>


        {/* Safety Network */}

        <div className="safety-network-card">

          <div className="section-card-header">

            <div>

              <h2>
                Safety Network
              </h2>

              <p>
                Your emergency support network
              </p>

            </div>

            <Users size={19} />

          </div>


          <div className="network-info">

            <div className="network-icon">
              <Users size={18} />
            </div>

            <div>

              <strong>
                Emergency Contacts
              </strong>

              <span>
                Manage your trusted contacts
              </span>

            </div>

          </div>


          <button
            type="button"
            className="network-button"
            onClick={() =>
              navigate('/dashboard/contacts')
            }
          >
            Manage Contacts

            <ChevronRight size={15} />

          </button>

        </div>

      </div>


      {/* =====================================
          RECENT ACTIVITY
      ===================================== */}

      <div className="dashboard-section">

        <div className="dashboard-section-header">

          <div>

            <p className="dashboard-section-eyebrow">
              RECENT ACTIVITY
            </p>

            <h2>
              Active Emergencies
            </h2>

          </div>


          <button
            type="button"
            className="view-all-button"
            onClick={() =>
              navigate(
                '/dashboard/emergencies'
              )
            }
          >
            View all

            <ChevronRight size={15} />

          </button>

        </div>


        {/* Loading */}

        {emergenciesLoading ? (

          <div className="dashboard-empty">

            <Clock size={22} />

            <p>
              Loading emergencies...
            </p>

          </div>

        ) : latestEmergencies.length === 0 ? (

          /* Empty */

          <div className="dashboard-empty">

            <ShieldCheck size={24} />

            <p>
              No emergencies yet
            </p>

            <span>
              Your emergency alerts will
              appear here.
            </span>

          </div>

        ) : (

          /* Emergency list */

          <div className="dashboard-emergencies">

            {latestEmergencies.map(
              (emergency) => {

                const isPending =
                  emergency.status === 'PENDING'

                return (
                  <button
                    type="button"
                    className="dashboard-emergency-card"
                    key={
                      emergency._id ||
                      emergency.localId ||
                      emergency.id
                    }
                    onClick={() => {

                      /*
                        Pending emergencies are
                        not on MongoDB yet, so don't
                        navigate to backend details.
                      */

                      if (isPending) {
                        return
                      }

                      navigate(
                        `/dashboard/emergencies/${emergency._id}`
                      )

                    }}
                  >

                    {/* Icon */}

                    <div className="dashboard-emergency-icon">

                      {isPending ? (
                        <WifiOff size={18} />
                      ) : (
                        <Siren size={18} />
                      )}

                    </div>


                    {/* Content */}

                    <div className="dashboard-emergency-content">

                      <div className="dashboard-emergency-top">

                        <h3>
                          {emergency.type}
                        </h3>


                        <span
                          className={`emergency-severity severity-${emergency.severity?.toLowerCase()}`}
                        >
                          {emergency.severity}
                        </span>

                      </div>


                      <p>
                        {emergency.description ||
                          'No description provided'}
                      </p>


                      <div className="dashboard-emergency-meta">

                        <span>

                          <Clock size={12} />

                          {formatDate(
                            emergency.createdAt
                          )}

                        </span>


                        {emergency.location && (

                          <span>

                            <MapPin size={12} />

                            {emergency.location}

                          </span>

                        )}

                      </div>

                    </div>


                    {/* Right */}

                    <div className="dashboard-emergency-right">

                      <span
                        className={`emergency-status ${
                          isPending
                            ? 'status-pending'
                            : `status-${emergency.status?.toLowerCase()}`
                        }`}
                      >
                        {isPending
                          ? 'PENDING'
                          : emergency.status}
                      </span>


                      {!isPending && (
                        <ChevronRight size={16} />
                      )}

                    </div>

                  </button>
                )
              }
            )}

          </div>

        )}

      </div>


      {/* =====================================
          EMERGENCY MODAL
      ===================================== */}

      {showEmergencyModal && (

        <EmergencyModal
          onClose={() =>
            setShowEmergencyModal(false)
          }
          onEmergencyCreated={
            handleEmergencyCreated
          }
        />

      )}

    </div>
  )
}


export default Dashboard