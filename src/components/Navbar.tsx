import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { isAuthenticated, isAdmin, logout } = useAuth()

  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <span className="text-2xl font-bold mr-2">{'{BPS}'}</span>
          <span className="text-xl">Blog with Barun</span>
        </Link>
        <div className="space-x-4">
          <Link to="/blogs" className="hover:text-blue-200">Blogs</Link>
          {isAuthenticated ? (
            <>
              <Link to="/create-blog" className="hover:text-blue-200">Create Blog</Link>
              {isAdmin && <Link to="/admin" className="hover:text-blue-200">Admin</Link>}
              <button onClick={logout} className="hover:text-blue-200">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-200">Login</Link>
              <Link to="/register" className="hover:text-blue-200">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}