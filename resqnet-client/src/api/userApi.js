import { apiRequest } from './api'


// Get logged-in user's profile
export const getProfile = async () => {
  return apiRequest('/users/profile')
}


// Update logged-in user's profile
export const updateProfile = async (userData) => {
  return apiRequest(
    '/users/profile',
    {
      method: 'PUT',
      body: JSON.stringify(userData)
    }
  )
}


// Delete logged-in user's account
export const deleteAccount = async () => {
  return apiRequest(
    '/users/profile',
    {
      method: 'DELETE'
    }
  )
}