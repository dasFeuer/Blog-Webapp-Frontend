import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Home() {
  const { isAuthenticated, user } = useAuth()

  return (
    <div className="max-w-4xl mx-auto text-center">
      <h1 className="text-4xl font-bold mb-6">Welcome to Our Blog</h1>
      <p className="text-xl mb-8">Discover interesting articles and share your thoughts</p>
      
      {isAuthenticated ? (
        <div>
          <p className="text-lg mb-4">Welcome back, {user?.username}!</p>
          <div className="space-x-4">
            <Link to="/blogs" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
              View Blogs
            </Link>
            <Link to="/create-blog" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
              Create a Blog
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-x-4">
          <Link to="/login" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
            Login
          </Link>
          <Link to="/register" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
            Register
          </Link>
        </div>
      )}
      
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">Latest Posts</h2>
        {/* Here you would typically fetch and display a few recent blog posts */}
        <p>Check out our blog section to see the latest posts!</p>
      </div>
    </div>
  )
}