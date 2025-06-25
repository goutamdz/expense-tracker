import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Navbar() {
  const [user, setUser] = useState(null)
  const [showModal, setShowModal] = useState(false)
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
      .catch((err) => {
        navigate('/login')
      })
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    setShowModal(false)
    navigate('/login')
  }

  if (!user) return null

  return (
    <div className="w-full flex justify-between items-center px-4 py-2 bg-white shadow h-12 min-h-0">
      {/* User section */}
      <div className="relative">
        <button
          className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100 focus:outline-none"
          onClick={() => setShowModal(true)}
        >
          <span className="inline-flex items-center justify-center w-8 h-8 bg-indigo-500 text-white rounded-full text-lg">
            <i className="ri-user-line"></i>
          </span>
          <span className="font-medium text-gray-800 text-sm">{user.name.split(' ')[0]}</span>
        </button>
        {/* Modal Popup */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-lg p-6 w-80 relative animate-fade-in">
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-xl"
                onClick={() => setShowModal(false)}
                aria-label="Close"
              >
                &times;
              </button>
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
                    className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* More menu */}
      <div className="relative">
        <button
          className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 focus:outline-none"
          onClick={() => setShowMenu((prev) => !prev)}
        >
          <span className="text-2xl text-gray-600">
            <i className="ri-more-2-fill"></i>
          </span>
        </button>
        {showMenu && (
          <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg z-50">
            <button
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => {
                setShowMenu(false)
                navigate('/add-category')
              }}
            >
              Add Categories
            </button>
            {/* Add more menu items here if needed */}
          </div>
        )}
      </div>
    </div>
  )
}

export default Navbar