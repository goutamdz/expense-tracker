import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify'
import { showSuccessToast, showErrorToast, showInfoToast } from '../utils/toastConfig'


function ExpenseInput() {
  const [categories, setCategories] = useState([]);
  const sources = ['cash', 'debit', 'credit', 'other'];
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios({
      method: 'GET',
      url: `${import.meta.env.VITE_BACKEND_BASE_URL}/api/v1/category`,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => {
        setCategories(res.data.categories);
        setIsLoading(false);
      })
      .catch(err => {
        setIsLoading(false);
      })
  }, [])

  const [expense, setExpense] = useState({
    title: '',
    amount: '',
    date: '',
    category: '',
    source: '',
    description: '',
  })

  const handleReset = () => {
    setExpense({
      title: '',
      amount: '',
      date: '',
      category: '',
      source: '',
      description: '',
    })
  }

  const handleChange = (e) => {
    setExpense({ ...expense, [e.target.name]: e.target.value })
  }
  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log(expense);
    try{
      setIsLoading(true);
      const response=await axios({
        method:'POST',
        url:`${import.meta.env.VITE_BACKEND_BASE_URL}/api/v1/expense`,
        data:expense,
        headers:{
          'Authorization':`Bearer ${localStorage.getItem('token')}`
        }
      })
      console.log(response);
      if(response.data.success){
        showSuccessToast(response.data.message||'Expense saved successfully!');
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
    }
    catch(err){
      showErrorToast(err.response.data.message || 'Something went wrong!');
    }
    finally{
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center py-8 px-2">
      <div className="bg-gray-100 rounded-2xl shadow-lg p-8 w-full max-w-3xl relative">
        <ToastContainer />
        {/* Back Button */}
        <button
          className="absolute -top-4 left-4 flex items-center gap-1 text-indigo-600 hover:underline font-medium bg-gray-100 px-2 py-1 rounded shadow cursor-pointer"
          onClick={() => navigate('/')}
        >
          <i className="ri-arrow-left-line text-lg"></i>
          Back
        </button>
        <h1 className="text-2xl font-semibold mb-1 mt-2">Expense Details</h1>
        <p className="text-gray-600 mb-6">Add required details to save expense</p>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <input
              type='text'
              name='title'
              placeholder='Expense name*'
              value={expense.title}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200 text-gray-800 text-base"
              required
            />
          </div>
          <div>
            <input
              type='number'
              name='amount'
              placeholder='Amount*'
              value={expense.amount}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200 text-gray-800 text-base"
              required
            />
          </div>
          <div>
            <div className="relative">
              <input
                type='date'
                name='date'
                placeholder='Expense Date*'
                value={expense.date}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200 text-gray-800 text-base pr-10"
                required
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                <i className="ri-calendar-line"></i>
              </span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <select
                name='category'
                value={expense.category}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200 text-gray-800 text-base"
                required
              >
                <option value="">Expense Category*</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <select
                name='source'
                value={expense.source}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200 text-gray-800 text-base"
                required
              >
                <option value="">Payment Source*</option>
                {sources.map(src => (
                  <option key={src} value={src}>{src.charAt(0).toUpperCase() + src.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <textarea
              name='description'
              placeholder='Comments'
              value={expense.description}
              onChange={handleChange}
              rows={3}
              className="w-full border border-gray-300 rounded-md px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200 text-gray-800 text-base resize-none"
            />
          </div>
          <div className="flex justify-end gap-4 pt-2">
            <button
              type="button"
              onClick={handleReset}
              className="text-indigo-600 hover:underline font-medium"
            >
              Reset
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2 rounded-md bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:opacity-60"
              disabled={isLoading}
            >
              {isLoading ? <i className="ri-loader-2-line animate-spin"></i> : <i className="ri-save-2-line"></i>} Save
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ExpenseInput