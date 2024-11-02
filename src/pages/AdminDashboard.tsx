import React, { useState, useEffect } from 'react'
import { getAllUsers, promoteToAdmin, demoteToUser, deleteUser } from '../services/api'

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUsers()
        setUsers(response)
        setLoading(false)
      } catch (err) {
        setError('Failed to fetch users')
        setLoading(false)
      }
    }
    fetchUsers()
  }, [])

  const handlePromote = async (userId: number) => {
    try {
      const updatedUser = await promoteToAdmin(userId)
      setUsers(users.map((user) => 
        user.id === userId ? updatedUser : user
      ))
    } catch (err) {
      console.error('Failed to promote user:', err)
    }
  }

  const handleDemote = async (userId: number) => {
    try {
      const updatedUser = await demoteToUser(userId)
      setUsers(users.map((user) => 
        user.id === userId ? updatedUser : user
      ))
    } catch (err) {
      console.error('Failed to demote user:', err)
    }
  }

  const handleDelete = async (userId: number) => {
    try {
      await deleteUser(userId)
      setUsers(users.filter((user) => user.id !== userId))
    } catch (err) {
      console.error('Failed to delete user:', err)
    }
  }

  if (loading) return <div className="text-center py-4">Loading...</div>
  if (error) return <div className="text-red-500 text-center py-4">{error}</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
      
      {/* Desktop view */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">ID</th>
              <th className="border p-2">Username</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Role</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="border p-2">{user.id}</td>
                <td className="border p-2">{user.username}</td>
                <td className="border p-2">{user.email}</td>
                <td className="border p-2">{user.role}</td>
                <td className="border p-2">
                  {user.role === 'USER' ? (
                    <button onClick={() => handlePromote(user.id)} className="bg-green-500 text-white px-2 py-1 rounded mr-2">
                      Promote
                    </button>
                  ) : (
                    <button onClick={() => handleDemote(user.id)} className="bg-yellow-500 text-white px-2 py-1 rounded mr-2">
                      Demote
                    </button>
                  )}
                  <button onClick={() => handleDelete(user.id)} className="bg-red-500 text-white px-2 py-1 rounded">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile view */}
      <div className="md:hidden space-y-4">
        {users.map((user) => (
          <div key={user.id} className="bg-white shadow rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">ID: {user.id}</span>
              <span className={`px-2 py-1 rounded text-sm ${user.role === 'ADMIN' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                {user.role}
              </span>
            </div>
            <div className="mb-2">
              <p><strong>Username:</strong> {user.username}</p>
              <p><strong>Email:</strong> {user.email}</p>
            </div>
            <div className="flex justify-end space-x-2">
              {user.role === 'USER' ? (
                <button onClick={() => handlePromote(user.id)} className="bg-green-500 text-white px-2 py-1 rounded text-sm">
                  Promote
                </button>
              ) : (
                <button onClick={() => handleDemote(user.id)} className="bg-yellow-500 text-white px-2 py-1 rounded text-sm">
                  Demote
                </button>
              )}
              <button onClick={() => handleDelete(user.id)} className="bg-red-500 text-white px-2 py-1 rounded text-sm">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}