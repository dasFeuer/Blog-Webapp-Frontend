import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import BlogList from './pages/BlogList'
import BlogDetail from './pages/BlogDetail'
import CreateBlog from './pages/CreateBlog'
import EditBlog from './pages/EditBlog'
import AdminDashboard from './pages/AdminDashboard'
import PrivateRoute from './components/PrivateRoute'
import './quill-custom.css'
import './blog-content.css'

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/blogs" element={<BlogList />} />
              <Route path="/blogs/:id" element={<BlogDetail />} />
              <Route path="/create-blog" element={<PrivateRoute><CreateBlog /></PrivateRoute>} />
              <Route path="/edit-blog/:id" element={<PrivateRoute><EditBlog /></PrivateRoute>} />
              <Route path="/admin" element={<PrivateRoute adminOnly={true}><AdminDashboard /></PrivateRoute>} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  )
}