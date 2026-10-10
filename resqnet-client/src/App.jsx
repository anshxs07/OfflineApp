import { Routes, Route } from 'react-router-dom'

import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Emergencies from './pages/Emergencies'
import EmergencyDetails from './pages/EmergencyDetails'
import Contacts from './pages/Contacts'

import DashboardLayout from './layouts/DashboardLayout'
import Profile from './pages/Profile'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <Routes>

      {/* Public Routes */}
      <Route path="/" element={<Landing />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />


      {/* Dashboard Routes */}
      <Route element={<ProtectedRoute />}>
  <Route path="/dashboard" element={<DashboardLayout />}>
    <Route index element={<Dashboard />} />
    <Route path="emergencies" element={<Emergencies />} />
    <Route path="emergencies/:id" element={<EmergencyDetails />} />
    <Route path="contacts" element={<Contacts />} />
    <Route path="profile" element={<Profile />} />
  </Route>
</Route>

    </Routes>
  )
}

export default App