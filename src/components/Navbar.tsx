import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { isAuthenticated, isAdmin, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold mr-2">{'{BPS}'}</span>
            <span className="text-xl hidden sm:inline">Blog with Barun</span>
          </Link>
          <div className="hidden md:flex space-x-4">
            <NavLinks isAuthenticated={isAuthenticated} isAdmin={isAdmin} logout={logout} />
          </div>
          <button
            className="md:hidden focus:outline-none"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
        {isMenuOpen && (
          <div className="md:hidden mt-4">
            <NavLinks isAuthenticated={isAuthenticated} isAdmin={isAdmin} logout={logout} />
          </div>
        )}
      </div>
    </nav>
  )
}

interface NavLinksProps {
  isAuthenticated: boolean;
  isAdmin: boolean;
  logout: () => void;
}

function NavLinks({ isAuthenticated, isAdmin, logout }: NavLinksProps) {
  return (
    <div className="flex flex-col md:flex-row md:space-x-4">
      <Link to="/blogs" className="py-2 md:py-0 hover:text-blue-200">Blogs</Link>
      {isAuthenticated ? (
        <>
          <Link to="/create-blog" className="py-2 md:py-0 hover:text-blue-200">Create Blog</Link>
          {isAdmin && <Link to="/admin" className="py-2 md:py-0 hover:text-blue-200">Admin</Link>}
          <button onClick={logout} className="py-2 md:py-0 text-left hover:text-blue-200">Logout</button>
        </>
      ) : (
        <>
          <Link to="/login" className="py-2 md:py-0 hover:text-blue-200">Login</Link>
          <Link to="/register" className="py-2 md:py-0 hover:text-blue-200">Register</Link>
        </>
      )}
    </div>
  )
}