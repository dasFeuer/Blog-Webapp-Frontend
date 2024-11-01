import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getBlogById, getCommentsByBlogId, createComment, updateComment, deleteComment, deleteBlog } from '../services/api'
import { useAuth } from '../context/AuthContext'

interface Blog {
  id: number;
  title: string;
  content: string;
  user: {
    id: number;
    username: string;
  };
}

interface Comment {
  id: number;
  content: string;
  user: {
    id: number;
    username: string;
  };
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

  if (loading) return <div>Loading...</div>
  if (error) return <div className="text-red-500">{error}</div>
  if (!blog) return <div>Blog not found</div>

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-4">{blog.title}</h2>
      <p className="text-gray-600 mb-8">{blog.content}</p>
      <p className="text-sm text-gray-500 mb-8">By: {blog.user.username}</p>
      
      {user && (user.id === blog.user.id || user.role === 'ADMIN') && (
        <div className="mb-8">
          <Link to={`/edit-blog/${blog.id}`} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mr-2">
            Edit Blog
          </Link>
          <button onClick={handleDeleteBlog} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
            Delete Blog
          </button>
        </div>
      )}
      
      <h3 className="text-2xl font-bold mb-4">Comments</h3>
      {comments.map((comment) => (
        <div key={comment.id} className="bg-white p-4 rounded shadow mb-4">
          {editingCommentId === comment.id ? (
            <div>
              <textarea
                value={editedCommentContent}
                onChange={(e) => setEditedCommentContent(e.target.value)}
                className="w-full p-2 border rounded mb-2"
              />
              <button 
                onClick={() => handleUpdateComment(comment.id)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mr-2"
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
          ) : (
            <div>
              <p>{comment.content}</p>
              <p className="text-sm text-gray-500 mt-2">By: {comment.user.username}</p>
              {user && (user.id === comment.user.id || user.role === 'ADMIN') && (
                <div className="mt-2">
                  <button 
                    onClick={() => handleEditComment(comment.id, comment.content)}
                    className="text-blue-600 hover:underline mr-2"
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
      
      {user && (
        <form onSubmit={handleCommentSubmit} className="mt-8">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Write a comment..."
            required
          />
          <button type="submit" className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Post Comment
          </button>
        </form>
      )}
    </div>
  )
}