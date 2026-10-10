import { useEffect, useState } from 'react'
import {
  UserRound,
  Phone,
  Plus,
  Trash2,
  ShieldAlert,
  Users,
  X
} from 'lucide-react'

import {
  getContacts,
  createContact,
  deleteContact
} from '../api/contactApi'

import './Contacts.css'


function Contacts() {
  const [contacts, setContacts] = useState([])

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [showModal, setShowModal] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    relationship: '',
    type: 'EMERGENCY'
  })


  /* =========================================
     FETCH CONTACTS
  ========================================= */

  useEffect(() => {
    fetchContacts()
  }, [])


  const fetchContacts = async () => {
    try {
      setLoading(true)
      setError('')

      const data = await getContacts()

      setContacts(data.contacts || [])
    } catch (error) {
      console.error(
        'Fetch contacts error:',
        error.message
      )

      setError(error.message)
    } finally {
      setLoading(false)
    }
  }


  /* =========================================
     INPUT CHANGE
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
     OPEN MODAL
  ========================================= */

  const handleOpenModal = () => {
    setError('')

    setFormData({
      name: '',
      phone: '',
      relationship: '',
      type: 'EMERGENCY'
    })

    setShowModal(true)
  }


  /* =========================================
     CLOSE MODAL
  ========================================= */

  const handleCloseModal = () => {
    if (saving) return

    setShowModal(false)
  }


  /* =========================================
     CREATE CONTACT
  ========================================= */

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!formData.name.trim()) {
      setError('Please enter contact name')
      return
    }

    if (!formData.phone.trim()) {
      setError('Please enter contact phone number')
      return
    }

    try {
      setSaving(true)
      setError('')

      const data = await createContact({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        relationship:
          formData.relationship.trim(),
        type: formData.type
      })

      setContacts((previous) => [
        data.contact,
        ...previous
      ])

      setShowModal(false)

      setFormData({
        name: '',
        phone: '',
        relationship: '',
        type: 'EMERGENCY'
      })
    } catch (error) {
      console.error(
        'Create contact error:',
        error.message
      )

      setError(error.message)
    } finally {
      setSaving(false)
    }
  }


  /* =========================================
     DELETE CONTACT
  ========================================= */

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this contact?'
    )

    if (!confirmed) return

    try {
      setError('')

      await deleteContact(id)

      setContacts((previous) =>
        previous.filter(
          (contact) => contact._id !== id
        )
      )
    } catch (error) {
      console.error(
        'Delete contact error:',
        error.message
      )

      setError(error.message)
    }
  }


  /* =========================================
     COUNTS
  ========================================= */

  const emergencyContacts =
    contacts.filter(
      (contact) =>
        contact.type === 'EMERGENCY'
    )

  const trustedContacts =
    contacts.filter(
      (contact) =>
        contact.type === 'TRUSTED'
    )


  return (
    <div className="contacts-page">

      {/* =====================================
          HEADER
      ===================================== */}

      <div className="contacts-header">

        <div>

          <p className="contacts-eyebrow">
            SAFETY NETWORK
          </p>

          <h1>Contacts</h1>

          <p>
            Manage the people you trust during
            emergencies.
          </p>

        </div>


        <button
          type="button"
          className="add-contact-button"
          onClick={handleOpenModal}
        >
          <Plus size={17} />
          Add Contact
        </button>

      </div>


      {/* =====================================
          ERROR
      ===================================== */}

      {error && (
        <div className="contacts-error">
          <ShieldAlert size={16} />
          <span>{error}</span>

          <button
            type="button"
            onClick={() => setError('')}
          >
            <X size={15} />
          </button>
        </div>
      )}


      {/* =====================================
          STATS
      ===================================== */}

      <div className="contacts-stats">

        <div className="contact-stat-card">

          <div className="contact-stat-icon emergency">
            <ShieldAlert size={18} />
          </div>

          <div>
            <span>Emergency Contacts</span>
            <strong>
              {emergencyContacts.length}
            </strong>
          </div>

        </div>


        <div className="contact-stat-card">

          <div className="contact-stat-icon trusted">
            <Users size={18} />
          </div>

          <div>
            <span>Trusted Contacts</span>
            <strong>
              {trustedContacts.length}
            </strong>
          </div>

        </div>


        <div className="contact-stat-card">

          <div className="contact-stat-icon total">
            <UserRound size={18} />
          </div>

          <div>
            <span>Total Contacts</span>
            <strong>
              {contacts.length}
            </strong>
          </div>

        </div>

      </div>


      {/* =====================================
          CONTACT LIST
      ===================================== */}

      {loading ? (

        <div className="contacts-empty">

          <Users size={25} />

          <p>
            Loading contacts...
          </p>

        </div>

      ) : contacts.length === 0 ? (

        <div className="contacts-empty">

          <Users size={28} />

          <p>
            No contacts added yet
          </p>

          <span>
            Add someone you trust to your
            emergency network.
          </span>

          <button
            type="button"
            onClick={handleOpenModal}
          >
            <Plus size={15} />
            Add Your First Contact
          </button>

        </div>

      ) : (

        <div className="contacts-list">

          {contacts.map((contact) => (

            <div
              className="contact-card"
              key={contact._id}
            >

              {/* Icon */}

              <div
                className={`contact-avatar ${
                  contact.type === 'EMERGENCY'
                    ? 'avatar-emergency'
                    : 'avatar-trusted'
                }`}
              >
                <UserRound size={20} />
              </div>


              {/* Content */}

              <div className="contact-content">

                <div className="contact-name-row">

                  <h3>
                    {contact.name}
                  </h3>

                  <span
                    className={`contact-type ${
                      contact.type === 'EMERGENCY'
                        ? 'type-emergency'
                        : 'type-trusted'
                    }`}
                  >
                    {contact.type}
                  </span>

                </div>


                {contact.relationship && (
                  <p className="contact-relationship">
                    {contact.relationship}
                  </p>
                )}


                <div className="contact-phone">

                  <Phone size={13} />

                  <span>
                    {contact.phone}
                  </span>

                </div>

              </div>


              {/* Delete */}

              <button
                type="button"
                className="delete-contact-button"
                onClick={() =>
                  handleDelete(contact._id)
                }
                title="Delete contact"
              >
                <Trash2 size={16} />
              </button>

            </div>

          ))}

        </div>

      )}


      {/* =====================================
          ADD CONTACT MODAL
      ===================================== */}

      {showModal && (

        <div
          className="contact-modal-overlay"
          onClick={handleCloseModal}
        >

          <div
            className="contact-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* Header */}

            <div className="contact-modal-header">

              <div>

                <h2>
                  Add Contact
                </h2>

                <p>
                  Add someone to your safety network.
                </p>

              </div>


              <button
                type="button"
                className="contact-modal-close"
                onClick={handleCloseModal}
                disabled={saving}
              >
                <X size={18} />
              </button>

            </div>


            {/* Form */}

            <form
              className="contact-form"
              onSubmit={handleSubmit}
            >

              {/* Name */}

              <div className="contact-form-field">

                <label htmlFor="contact-name">
                  Name
                </label>

                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter contact name"
                  disabled={saving}
                />

              </div>


              {/* Phone */}

              <div className="contact-form-field">

                <label htmlFor="contact-phone">
                  Phone Number
                </label>

                <input
                  id="contact-phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  disabled={saving}
                />

              </div>


              {/* Relationship */}

              <div className="contact-form-field">

                <label htmlFor="contact-relationship">
                  Relationship
                </label>

                <input
                  id="contact-relationship"
                  name="relationship"
                  type="text"
                  value={
                    formData.relationship
                  }
                  onChange={handleChange}
                  placeholder="e.g. Brother, Friend, Parent"
                  disabled={saving}
                />

              </div>


              {/* Type */}

              <div className="contact-form-field">

                <label htmlFor="contact-type">
                  Contact Type
                </label>

                <select
                  id="contact-type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  disabled={saving}
                >

                  <option value="EMERGENCY">
                    Emergency Contact
                  </option>

                  <option value="TRUSTED">
                    Trusted Contact
                  </option>

                </select>

              </div>


              {/* Actions */}

              <div className="contact-form-actions">

                <button
                  type="button"
                  className="contact-cancel-button"
                  onClick={handleCloseModal}
                  disabled={saving}
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  className="contact-save-button"
                  disabled={saving}
                >
                  <Plus size={16} />

                  {saving
                    ? 'Saving...'
                    : 'Add Contact'}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  )
}


export default Contacts