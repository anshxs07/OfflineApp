import { apiRequest } from './api'


// ==============================
// CREATE EMERGENCY
// ==============================

export const createEmergency = async (
  emergencyData
) => {
  return apiRequest(
    '/emergencies',
    {
      method: 'POST',
      body: JSON.stringify(emergencyData)
    }
  )
}


// ==============================
// GET MY EMERGENCIES
// ==============================

export const getEmergencies = async () => {
  return apiRequest('/emergencies')
}


// ==============================
// GET SINGLE EMERGENCY
// ==============================

export const getEmergencyById = async (id) => {
  return apiRequest(
    `/emergencies/${id}`
  )
}


// ==============================
// UPDATE EMERGENCY
// ==============================

export const updateEmergency = async (
  id,
  emergencyData
) => {
  return apiRequest(
    `/emergencies/${id}`,
    {
      method: 'PUT',
      body: JSON.stringify(emergencyData)
    }
  )
}


// ==============================
// DELETE EMERGENCY
// ==============================

export const deleteEmergency = async (id) => {
  return apiRequest(
    `/emergencies/${id}`,
    {
      method: 'DELETE'
    }
  )
}