import { Link, useNavigate } from '@tanstack/react-router'

import { useState } from 'react'
import { Home, Menu, X, LogIn, LogOut, User, Shield } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import '../assets/Header.scss'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, isAuthenticated, logout, isLoading } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    setIsOpen(false)
    navigate({ to: '/' })
  }

  return (
    <>
      <header className="p-1 flex items-center justify-between text-white shadow-lg">
        <div className="flex items-center">
          <button
            onClick={() => setIsOpen(true)}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
          <h1 className="ml-4 text-xl font-semibold">
            <Link to="/" className="logo"></Link>
          </h1>
        </div>

        <div className="header-auth">
          {isLoading ? (
            <div className="auth-loading" />
          ) : isAuthenticated && user ? (
            <div className="user-info">
              <div className="user-avatar">
                {user.role === 'Admin' ? (
                  <Shield size={16} />
                ) : (
                  <User size={16} />
                )}
              </div>
              <span className="user-name">{user.name}</span>
              <button
                onClick={handleLogout}
                className="logout-btn"
                aria-label="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link to="/auth" className="login-btn">
              <LogIn size={18} />
              <span>Sign In</span>
            </Link>
          )}
        </div>
      </header>

      <aside
        className={`fixed top-0 left-0 h-full w-80 text-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4">
          <h2 className="text-xl font-bold">Navigation</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-lg transition-colors"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        {isAuthenticated && user && (
          <div className="sidebar-user-info">
            <div className="sidebar-avatar">
              {user.role === 'Admin' ? (
                <Shield size={24} />
              ) : (
                <User size={24} />
              )}
            </div>
            <div className="sidebar-user-details">
              <span className="sidebar-user-name">{user.name}</span>
              <span className="sidebar-user-role">{user.role}</span>
            </div>
          </div>
        )}

        <nav className="flex-1 p-4 overflow-y-auto">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 p-3 rounded-lg transition-colors mb-2"
            activeProps={{
              className:
                'flex items-center gap-3 p-3 rounded-lg transition-colors mb-2',
            }}
          >
            <Home size={20} />
            <span className="font-medium">Home</span>
          </Link>

          {!isAuthenticated && (
            <Link
              to="/auth"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 p-3 rounded-lg transition-colors mb-2"
            >
              <LogIn size={20} />
              <span className="font-medium">Sign In</span>
            </Link>
          )}
        </nav>

        {isAuthenticated && (
          <div className="sidebar-footer">
            <button onClick={handleLogout} className="sidebar-logout-btn">
              <LogOut size={20} />
              <span>Sign Out</span>
            </button>
          </div>
        )}
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
