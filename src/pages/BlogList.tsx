import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { getAllBlogs, searchBlogs } from '../services/api'
import DOMPurify from 'dompurify'

interface Blog {
  id: number;
  title: string;
  content: string;
  contentType: string;
  user: {
    username: string;
  };
  createdAt: string;
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

  const truncateHTML = (html: string, maxLength: number) => {
    const strippedString = html.replace(/(<([^>]+)>)/gi, "");
    if (strippedString.length <= maxLength) return html;
    const truncated = strippedString.substr(0, maxLength);
    return truncated.substr(0, truncated.lastIndexOf(" ")) + "...";
  }

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>
  if (error) return <div className="text-red-500 text-center">{error}</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-8 text-center">Blog Posts</h2>
      <form onSubmit={handleSearch} className="mb-8 flex justify-center">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search blogs..."
          className="px-4 py-2 border rounded-l-md w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-r-md hover:bg-blue-700 transition duration-200">
          Search
        </button>
      </form>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {blogs.map((blog) => (
          <div key={blog.id} className="bg-white rounded-lg shadow-md overflow-hidden transition duration-300 hover:shadow-xl">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-3 text-gray-800">{blog.title}</h3>
              <div 
                className="text-gray-600 mb-4 prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ 
                  __html: DOMPurify.sanitize(truncateHTML(blog.content, 150)) 
                }}
              />
              <p className="text-sm text-gray-500 mb-4">By: {blog.user.username} | {new Date(blog.createdAt).toLocaleDateString()}</p>
              <Link 
                to={`/blogs/${blog.id}`} 
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200"
              >
                Read more
              </Link>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 flex justify-center space-x-4">
        <button
          onClick={() => setPage(prev => Math.max(0, prev - 1))}
          disabled={page === 0}
          className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400 transition duration-200 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => setPage(prev => prev + 1)}
          disabled={blogs.length < size}
          className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400 transition duration-200 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  )
}