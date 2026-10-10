import { useEffect, useMemo, useState } from 'react'

import {
  Search,
  Siren,
  AlertTriangle,
  Clock,
  MapPin,
  WifiOff
} from 'lucide-react'

import { useNavigate } from 'react-router-dom'

import { getEmergencies } from '../api/emergencyApi'

import useOnlineStatus from '../hooks/useOnlineStatus'

import {
  getPendingEmergencies
} from '../utils/offlineEmergencyDB'

import './Emergencies.css'


function Emergencies() {
  const navigate = useNavigate()

  const isOnline = useOnlineStatus()

  const [emergencies, setEmergencies] =
    useState([])

  const [search, setSearch] =
    useState('')

  const [statusFilter, setStatusFilter] =
    useState('ALL')

  const [severityFilter, setSeverityFilter] =
    useState('ALL')

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState('')


  /* =========================================
     GET MY EMERGENCIES
  ========================================= */

  useEffect(() => {
    const fetchEmergencies = async () => {
      try {
        setLoading(true)
        setError('')


        /* =====================================
           LOAD LOCAL PENDING EMERGENCIES
        ===================================== */

        const pendingEmergencies =
          await getPendingEmergencies()


        /* =====================================
           OFFLINE
        ===================================== */

        if (!isOnline) {
          setEmergencies(
            pendingEmergencies
          )

          return
        }


        /* =====================================
           ONLINE
        ===================================== */

        try {
          const data =
            await getEmergencies()

          const serverEmergencies =
            data.emergencies || []


          /*
            Keep local pending emergencies
            visible until sync happens.
          */

          setEmergencies([
            ...pendingEmergencies,
            ...serverEmergencies
          ])

        } catch (error) {
          console.error(
            'Fetch emergencies error:',
            error.message
          )


          /*
            If backend temporarily fails,
            still show local pending SOS.
          */

          setEmergencies(
            pendingEmergencies
          )
        }

      } catch (error) {
        console.error(
          'Load emergencies error:',
          error.message
        )

        setError(
          error.message
        )

        setEmergencies([])

      } finally {
        setLoading(false)
      }
    }


    fetchEmergencies()

  }, [isOnline])


  /* =========================================
     FILTER EMERGENCIES
  ========================================= */

  const filteredEmergencies =
    useMemo(() => {

      return emergencies.filter(
        (emergency) => {

          const searchValue =
            search
              .toLowerCase()
              .trim()


          const matchesSearch =
            !searchValue ||
            emergency.type
              ?.toLowerCase()
              .includes(searchValue) ||
            emergency.description
              ?.toLowerCase()
              .includes(searchValue) ||
            emergency.location
              ?.toLowerCase()
              .includes(searchValue)


          const matchesStatus =
            statusFilter === 'ALL' ||
            emergency.status === statusFilter


          const matchesSeverity =
            severityFilter === 'ALL' ||
            emergency.severity === severityFilter


          return (
            matchesSearch &&
            matchesStatus &&
            matchesSeverity
          )
        }
      )

    }, [
      emergencies,
      search,
      statusFilter,
      severityFilter
    ])


  /* =========================================
     FORMAT DATE
  ========================================= */

  const formatDate = (date) => {
    if (!date) {
      return 'Unknown time'
    }

    return new Date(date).toLocaleString(
      'en-IN',
      {
        dateStyle: 'medium',
        timeStyle: 'short'
      }
    )
  }


  /* =========================================
     EMPTY STATE
  ========================================= */

  const hasEmergencies =
    emergencies.length > 0


  return (
    <div className="emergencies-page">

      {/* =====================================
          HEADER
      ===================================== */}

      <div className="emergencies-header">

        <div>

          <p className="emergencies-eyebrow">
            EMERGENCY CENTER
          </p>

          <h1>
            Emergencies
          </h1>

          <p>
            View and manage your emergency alerts.
          </p>

        </div>

      </div>


      {/* =====================================
          CONNECTION NOTICE
      ===================================== */}

      {!isOnline && (

        <div className="emergencies-message">
          <WifiOff size={16} />

          <span>
            You are offline. Showing locally
            saved emergency alerts.
          </span>
        </div>

      )}


      {/* =====================================
          FILTERS
      ===================================== */}

      <div className="emergencies-toolbar">

        <div className="emergencies-search">

          <Search size={17} />

          <input
            type="text"
            placeholder="Search emergencies..."
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
          />

        </div>


        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(
              event.target.value
            )
          }
        >

          <option value="ALL">
            All Status
          </option>

          <option value="ACTIVE">
            Active
          </option>

          <option value="ACKNOWLEDGED">
            Acknowledged
          </option>

          <option value="PENDING">
            Pending
          </option>

          <option value="RESOLVED">
            Resolved
          </option>

        </select>


        <select
          value={severityFilter}
          onChange={(event) =>
            setSeverityFilter(
              event.target.value
            )
          }
        >

          <option value="ALL">
            All Severity
          </option>

          <option value="HIGH">
            High
          </option>

          <option value="MEDIUM">
            Medium
          </option>

          <option value="LOW">
            Low
          </option>

        </select>

      </div>


      {/* =====================================
          ERROR
      ===================================== */}

      {error && (

        <div className="emergencies-message emergencies-error">

          <AlertTriangle size={16} />

          <span>
            {error}
          </span>

        </div>

      )}


      {/* =====================================
          LOADING
      ===================================== */}

      {loading ? (

        <div className="emergencies-empty">

          <Clock size={25} />

          <p>
            Loading emergencies...
          </p>

        </div>

      ) : filteredEmergencies.length === 0 ? (

        /* =====================================
           EMPTY
        ===================================== */

        <div className="emergencies-empty">

          <Siren size={28} />

          <p>

            {hasEmergencies
              ? 'No emergencies match your filters'
              : 'No emergencies yet'}

          </p>

          <span>

            {hasEmergencies
              ? 'Try changing your search or filters.'
              : 'Your emergency alerts will appear here.'}

          </span>

        </div>

      ) : (

        /* =====================================
           LIST
        ===================================== */

        <div className="emergencies-list">

          {filteredEmergencies.map(
            (emergency) => {

              const isPending =
                emergency.status === 'PENDING'


              return (

                <button
                  type="button"
                  className="emergency-list-card"

                  key={
                    emergency._id ||
                    emergency.localId ||
                    emergency.id
                  }

                  onClick={() => {

                    /*
                      Pending emergency exists
                      only in IndexedDB.

                      It does not have a MongoDB
                      _id yet, so don't navigate.
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

                  <div className="emergency-list-icon">

                    {isPending ? (
                      <WifiOff size={20} />
                    ) : (
                      <Siren size={20} />
                    )}

                  </div>


                  {/* Content */}

                  <div className="emergency-list-content">

                    <div className="emergency-list-top">

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


                    <div className="emergency-list-meta">

                      <span>

                        <Clock size={13} />

                        {formatDate(
                          emergency.createdAt
                        )}

                      </span>


                      {emergency.location && (

                        <span>

                          <MapPin size={13} />

                          {emergency.location}

                        </span>

                      )}

                    </div>

                  </div>


                  {/* Right */}

                  <div className="emergency-list-right">

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
                      <AlertTriangle
                        size={17}
                      />
                    )}

                  </div>

                </button>

              )
            }
          )}

        </div>

      )}

    </div>
  )
}


export default Emergencies