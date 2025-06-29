import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Navbar() {
  const [user, setUser] = useState(null)
  const [showProfile, setShowProfile] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    axios({
      method: 'GET',
      url: `${import.meta.env.VITE_BACKEND_BASE_URL}/api/v1/user/profile`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then((res) => {
        setUser(res.data.user)
      })
      .catch(() => {
        navigate('/login')
      })
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    setShowProfile(false)
    navigate('/login')
  }

  if (!user) return null

  return (
    <nav className="w-full bg-white h-16 flex items-center px-6 z-50 border border-gray-300 shadow-lg fixed top-0 left-0 right-0">
      {/* Logo/Title */}
      <div className="flex items-center gap-2 text-indigo-600 font-bold text-xl cursor-pointer select-none" onClick={() => navigate('/')}> 
        <i className="ri-money-dollar-circle-line text-2xl"></i>
        <span>ExpenseTracker</span>
      </div>
      {/* Center space for future nav links */}
      <div className="flex-1 flex justify-center">
        {/* Add nav links here if needed */}
      </div>
      {/* Right section: User & Menu */}
      <div className="flex items-center gap-4">
        {/* Add Category Dropdown */}
        <div className="relative">
          <button
            className="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700 transition"
            onClick={() => setShowMenu((prev) => !prev)}
          >
            <i className="ri-add-line text-lg cursor-pointer"></i>
            <span className="hidden sm:inline cursor-pointer">Add/Delete Category</span>
            <i className="ri-arrow-down-s-line text-lg cursor-pointer"></i>
          </button>
          {showMenu && (
            <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-50 animate-fade-in">
              <button
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-t-lg cursor-pointer"
                onClick={() => {
                  setShowMenu(false)
                  navigate('/add-category')
                }}
              >
                Add / Delete
              </button>
              {/* Add more menu items here if needed */}
            </div>
          )}
        </div>
        {/* User Avatar/Profile Dropdown */}
        <div className="relative">
          <button
            className="flex items-center gap-2 px-2 py-1 rounded-full hover:bg-gray-100 focus:outline-none transition cursor-pointer"
            onClick={() => setShowProfile((prev) => !prev)}
          >
            <span className="inline-flex items-center justify-center w-10 h-10 bg-indigo-500 text-white rounded-full text-xl">
              <i className="ri-user-line"></i>
            </span>
            <span className="font-medium text-gray-800 text-base hidden sm:block">{user.name.split(' ')[0]}</span>
            <i className="ri-arrow-down-s-line text-lg text-gray-500"></i>
          </button>
          {showProfile && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-xl z-50 animate-fade-in p-5">
              <div className="flex flex-col items-center gap-2">
                <span className="inline-flex items-center justify-center w-16 h-16 bg-indigo-500 text-white rounded-full text-3xl mb-2">
                  <i className="ri-user-line"></i>
                </span>
                <div className="text-center">
                  <div className="font-bold text-lg">{user.name}</div>
                  <div className="text-gray-600 text-sm mb-1">{user.email}</div>
                  <div className="text-gray-400 text-xs mb-2">
                    Joined: {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                  <button
                    className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition w-full cursor-pointer"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Overlay for closing dropdowns */}
      {(showProfile || showMenu) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowProfile(false)
            setShowMenu(false)
          }}
        />
      )}
    </nav>
  )
}

export default Navbar