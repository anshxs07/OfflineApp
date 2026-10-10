import { apiRequest } from './api'


export const registerUser = async (userData) => {
  return apiRequest(
    '/auth/register',
    {
      method: 'POST',
      body: JSON.stringify(userData)
    }
  )
}


export const loginUser = async (credentials) => {
  return apiRequest(
    '/auth/login',
    {
      method: 'POST',
      body: JSON.stringify(credentials)
    }
  )
}
export const logoutUser = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}