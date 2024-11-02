import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getBlogById, getCommentsByBlogId, createComment, updateComment, deleteComment, deleteBlog } from '../services/api'
import { useAuth } from '../context/AuthContext'
import DOMPurify from 'dompurify'

interface Blog {
  id: number;
  title: string;
  content: string;
  contentType: string;
  user: {
    id: number;
    username: string;
  };
  createdAt: string;
}

interface Comment {
  id: number;
  content: string;
  user: {
    id: number;
    username: string;
  };
  createdAt: string;
}

export default function BlogDetail() {
  const { id } = useParams<{ id: string }>()
  const [blog, setBlog] = useState<Blog | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null)
  const [editedCommentContent, setEditedCommentContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchBlogAndComments = async () => {
      try {
        const [blogData, commentsData] = await Promise.all([
          getBlogById(Number(id)),
          getCommentsByBlogId(Number(id))
        ])
        setBlog(blogData)
        setComments(commentsData)
        setLoading(false)
      } catch (err) {
        setError('Failed to fetch blog and comments')
        setLoading(false)
      }
    }
    fetchBlogAndComments()
  }, [id])

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    try {
      const response = await createComment(Number(id), user.id, newComment)
      setComments([...comments, response])
      setNewComment('')
    } catch (err) {
      console.error('Failed to post comment:', err)
    }
  }

  const handleEditComment = (commentId: number, content: string) => {
    setEditingCommentId(commentId)
    setEditedCommentContent(content)
  }

  const handleUpdateComment = async (commentId: number) => {
    try {
      const response = await updateComment(Number(id), commentId, editedCommentContent)
      setComments(comments.map(comment => 
        comment.id === commentId ? response : comment
      ))
      setEditingCommentId(null)
    } catch (err) {
      console.error('Failed to update comment:', err)
    }
  }

  const handleDeleteComment = async (commentId: number) => {
    try {
      await deleteComment(Number(id), commentId)
      setComments(comments.filter(comment => comment.id !== commentId))
    } catch (err) {
      console.error('Failed to delete comment:', err)
    }
  }

  const handleDeleteBlog = async () => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        await deleteBlog(Number(id))
        navigate('/blogs')
      } catch (err) {
        console.error('Failed to delete blog:', err)
      }
    }
  }

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>
  if (error) return <div className="text-red-500 text-center">{error}</div>
  if (!blog) return <div className="text-center">Blog not found</div>

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <article className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6">
          <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
          <p className="text-gray-600 mb-4">
            By {blog.user.username} on {new Date(blog.createdAt).toLocaleDateString()}
          </p>
          <div className="prose max-w-none">
            {blog.contentType === 'code' ? (
              <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
                <code dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(blog.content) }} />
              </pre>
            ) : (
              <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(blog.content) }} />
            )}
          </div>
        </div>
      </article>
      
      {user && (user.id === blog.user.id || user.role === 'ADMIN') && (
        <div className="mt-8 space-x-4">
          <Link to={`/edit-blog/${blog.id}`} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Edit Blog
          </Link>
          <button onClick={handleDeleteBlog} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
            Delete Blog
          </button>
        </div>
      )}
      
      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Comments</h2>
        {comments.map((comment) => (
          <div key={comment.id} className="bg-white p-6 rounded-lg shadow-md mb-6">
            {editingCommentId === comment.id ? (
              <div>
                <textarea
                  value={editedCommentContent}
                  onChange={(e) => setEditedCommentContent(e.target.value)}
                  className="w-full p-2 border rounded mb-2"
                  rows={3}
                />
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleUpdateComment(comment.id)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Save
                  </button>
                  <button 
                    onClick={() => setEditingCommentId(null)}
                    className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-gray-800">{comment.content}</p>
                <p className="text-sm text-gray-500 mt-2">
                  By {comment.user.username} on {new Date(comment.createdAt).toLocaleDateString()}
                </p>
                {user && (user.id === comment.user.id || user.role === 'ADMIN') && (
                  <div className="mt-4 space-x-2">
                    <button 
                      onClick={() => handleEditComment(comment.id, comment.content)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteComment(comment.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </section>
      
      {user && (
        <form onSubmit={handleCommentSubmit} className="mt-8">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full p-4 border rounded-lg shadow-inner"
            placeholder="Write a comment..."
            rows={4}
            required
          />
          <button type="submit" className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200">
            Post Comment
          </button>
        </form>
      )}
    </div>
  )
}