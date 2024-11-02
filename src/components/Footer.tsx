import React from 'react'
import { Link } from 'react-router-dom'
import { Facebook, Linkedin, Github, Instagram } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-blue-600 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">Blog with Barun</h2>
            <p className="text-blue-200">Explore the world of ideas and stories.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-blue-200 transition-colors">Home</Link></li>
              <li><Link to="/blogs" className="hover:text-blue-200 transition-colors">Blogs</Link></li>
              <li><Link to="/create-blog" className="hover:text-blue-200 transition-colors">Create Blog</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Connect with Us</h3>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/devbarun11/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-200 transition-colors" aria-label="Facebook">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="https://www.linkedin.com/in/devbarun11/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-200 transition-colors" aria-label="LinkedIn">
                <Linkedin className="h-6 w-6" />
              </a>
              <a href="https://github.com/dasFeuer" target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-200 transition-colors" aria-label="GitHub">
                <Github className="h-6 w-6" />
              </a>
              <a href="https://stackoverflow.com/users/22530966/barun-panthi-sharma" target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-200 transition-colors" aria-label="Stack Overflow">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M15.725 0l-1.72 1.277 6.39 8.588 1.716-1.277L15.725 0zm-3.94 3.418l-1.369 1.644 8.225 6.85 1.369-1.644-8.225-6.85zm-3.15 4.465l-.905 1.94 9.702 4.517.904-1.94-9.701-4.517zm-1.85 4.86l-.44 2.093 10.473 2.201.44-2.092-10.473-2.203zM1.89 15.47V24h19.19v-8.53h-2.133v6.397H4.021v-6.396H1.89zm4.265 2.133v2.13h10.66v-2.13H6.154Z" />
                </svg>
              </a>
              <a href="https://www.instagram.com/devbarun11/?next=%2F" target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-200 transition-colors" aria-label="Instagram">
                <Instagram className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-blue-500 pt-8 text-center text-blue-200">
          <p>&copy; {currentYear} Blog with Barun. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}