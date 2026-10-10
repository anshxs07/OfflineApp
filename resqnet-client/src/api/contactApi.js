import { apiRequest } from './api'


/* =========================================
   CREATE CONTACT
========================================= */

export const createContact = async (contactData) => {
  return apiRequest(
    '/contacts',
    {
      method: 'POST',
      body: JSON.stringify(contactData)
    }
  )
}


/* =========================================
   GET ALL CONTACTS
========================================= */

export const getContacts = async () => {
  return apiRequest('/contacts')
}


/* =========================================
   GET CONTACT BY ID
========================================= */

export const getContactById = async (id) => {
  return apiRequest(
    `/contacts/${id}`
  )
}


/* =========================================
   UPDATE CONTACT
========================================= */

export const updateContact = async (
  id,
  contactData
) => {
  return apiRequest(
    `/contacts/${id}`,
    {
      method: 'PUT',
      body: JSON.stringify(contactData)
    }
  )
}


/* =========================================
   DELETE CONTACT
========================================= */

export const deleteContact = async (id) => {
  return apiRequest(
    `/contacts/${id}`,
    {
      method: 'DELETE'
    }
  )
}