import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { showSuccessToast, showErrorToast } from '../utils/toastConfig'
import 'react-toastify/dist/ReactToastify.css'

function AddCategory() {
  const [categories, setCategories] = useState([])
  const [newCategory, setNewCategory] = useState('')
  const [loading, setLoading] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  // Fetch existing categories
  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await axios({
        method: 'GET',
        url: `${import.meta.env.VITE_BACKEND_BASE_URL}/api/v1/category`,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      
      if (response.data.success) {
        setCategories(response.data.categories)
      }
    } catch (err) {
      console.log('Error fetching categories:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!newCategory.trim()) {
      showErrorToast('Category name is required')
      return
    }

    setLoading(true)
    
    try {
      const response = await axios({
        method: 'POST',
        url: `${import.meta.env.VITE_BACKEND_BASE_URL}/api/v1/category`,
        data: {
          name: newCategory.trim()
        },
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (response.data.success) {
        showSuccessToast('Category created successfully!')
        setNewCategory('')
        fetchCategories() // Refresh the list
      }
    } catch (error) {
      console.error('Error creating category:', error)
      const errorMessage = error.response?.data?.message || 'Failed to create category'
      showErrorToast(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (categoryId) => {
    if (!window.confirm('Are you sure you want to delete this category?')) {
      return
    }

    try {
      const response = await axios({
        method: 'DELETE',
        url: `${import.meta.env.VITE_BACKEND_BASE_URL}/api/v1/category/${categoryId}`,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (response.data.success) {
        showSuccessToast('Category deleted successfully!')
        fetchCategories() // Refresh the list
      }
    } catch (error) {
      console.error('Error deleting category:', error)
      const errorMessage = error.response?.data?.message || 'Failed to delete category'
      showErrorToast(errorMessage)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-200 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <span className="text-gray-600">Loading categories...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-200 p-6 pt-20">
      <ToastContainer />
      
      {/* Header */}
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8 mt-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Manage Categories</h1>
            <p className="text-gray-600 mt-2">Create and manage your expense categories</p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
          >
            <i className="ri-arrow-left-line"></i>
            Back to Dashboard
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Add New Category Form */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Category</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name
                </label>
                <input
                  type="text"
                  id="categoryName"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Enter category name (e.g., Groceries, Transportation)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
                  disabled={loading}
                />
              </div>
              
              <button
                type="submit"
                disabled={loading || !newCategory.trim()}
                className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition ${
                  loading || !newCategory.trim()
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                {loading ? (
                  <>
                    <i className="ri-loader-2-line animate-spin"></i>
                    Creating...
                  </>
                ) : (
                  <>
                    <i className="ri-add-line"></i>
                    Create Category
                  </>
                )}
              </button>
            </form>

            {/* Tips */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="text-sm font-medium text-blue-800 mb-2">💡 Tips for good category names:</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Use clear, descriptive names</li>
                <li>• Keep them short and memorable</li>
                <li>• Examples: Food, Transport, Entertainment</li>
              </ul>
            </div>
          </div>

          {/* Existing Categories */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Categories</h2>
            
            {categories.length === 0 ? (
              <div className="text-center py-8">
                <i className="ri-folder-line text-4xl text-gray-400 mb-3"></i>
                <p className="text-gray-600">No categories yet. Create your first one!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {categories.map((category) => (
                  <div
                    key={category._id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                        <i className="ri-folder-line text-indigo-600"></i>
                      </div>
                      <span className="font-medium text-gray-800 capitalize">
                        {category.name}
                      </span>
                    </div>
                    
                    <button
                      onClick={() => handleDelete(category._id)}
                      className="text-red-500 hover:text-red-700 transition p-1"
                      title="Delete category"
                    >
                      <i className="ri-delete-bin-line text-lg"></i>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Category Stats */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Categories:</span>
                <span className="font-semibold text-gray-800">{categories.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddCategory