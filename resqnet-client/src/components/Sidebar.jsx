import { NavLink, useNavigate } from 'react-router-dom'

import {
  ShieldCheck,
  LayoutDashboard,
  Siren,
  Users,
  UserCircle,
  LogOut
} from 'lucide-react'

import './Sidebar.css'

import { logoutUser } from '../api/authApi'


function Sidebar() {
  const navigate = useNavigate()


  const navigationItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard
    },

    {
      name: 'Emergencies',
      path: '/dashboard/emergencies',
      icon: Siren
    },

    {
      name: 'Contacts',
      path: '/dashboard/contacts',
      icon: Users
    },

    {
      name: 'Profile',
      path: '/dashboard/profile',
      icon: UserCircle
    }
  ]


  const handleLogout = () => {
    logoutUser()
    navigate('/login')
  }


  return (
    <aside className="sidebar">

      {/* Logo */}

      <div className="sidebar-logo">

        <div className="sidebar-logo-icon">
          <ShieldCheck size={21} />
        </div>

        <span>
          ResQNet
        </span>

      </div>


      {/* Navigation */}

      <nav className="sidebar-nav">

        <p className="sidebar-section-title">
          MENU
        </p>


        {navigationItems.map((item) => {

          const Icon = item.icon

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/dashboard'}
              className={({ isActive }) =>
                `sidebar-link ${
                  isActive ? 'active' : ''
                }`
              }
            >
              <Icon size={19} />

              <span>
                {item.name}
              </span>

            </NavLink>
          )
        })}

      </nav>


      {/* Bottom */}

      <div className="sidebar-bottom">

        <button
          type="button"
          className="logout-button"
          onClick={handleLogout}
        >
          <LogOut size={19} />

          <span>
            Logout
          </span>

        </button>

      </div>

    </aside>
  )
}


export default Sidebar