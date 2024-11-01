import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { getAllBlogs, searchBlogs } from '../services/api'

interface Blog {
  id: number;
  title: string;
  content: string;
  user: {
    username: string;
  };
}

export default function BlogList() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(0)
  const [size] = useState(10)

  const fetchBlogs = useCallback(async () => {
    setLoading(true)
    try {
      let response
      if (searchTerm) {
        response = await searchBlogs(searchTerm, page, size)
      } else {
        response = await getAllBlogs()
      }
      setBlogs(response.content || response)
      setLoading(false)
    } catch (err) {
      setError('Failed to fetch blogs')
      setLoading(false)
    }
  }, [searchTerm, page, size])

  useEffect(() => {
    fetchBlogs()
  }, [fetchBlogs])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(0)
    fetchBlogs()
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div className="text-red-500">{error}</div>

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Blog Posts</h2>
      <form onSubmit={handleSearch} className="mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search blogs..."
          className="px-3 py-2 border rounded mr-2"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Search
        </button>
      </form>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {blogs.map((blog) => (
          <div key={blog.id} className="bg-white p-4 rounded shadow">
            <h3 className="text-xl font-semibold mb-2">{blog.title}</h3>
            <p className="text-gray-600 mb-2">{blog.content.substring(0, 100)}...</p>
            <p className="text-sm text-gray-500 mb-2">By: {blog.user.username}</p>
            <Link to={`/blogs/${blog.id}`} className="text-blue-600 hover:underline">
              Read more
            </Link>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <button
          onClick={() => setPage(prev => Math.max(0, prev - 1))}
          disabled={page === 0}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => setPage(prev => prev + 1)}
          disabled={blogs.length < size}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  )
}