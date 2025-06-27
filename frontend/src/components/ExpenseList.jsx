import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import { showSuccessToast, showErrorToast } from '../utils/toastConfig';
import 'react-toastify/dist/ReactToastify.css';

function ExpenseList({ startDate, endDate }) {
    const [expenses, setExpenses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalExpenses: 0,
        hasNextPage: false,
        hasPrevPage: false
    });
    const [filters, setFilters] = useState({
        category: '',
        source: '',
        sortBy: 'date',
        sortOrder: 'desc'
    });
    const [editExpense, setEditExpense] = useState(null);
    const [editLoading, setEditLoading] = useState(false);

    const sources = ['cash', 'debit', 'credit', 'other'];

    // Fetch categories
    const fetchCategories = useCallback(async () => {
        try {
            const response = await axios({
                method: 'GET',
                url: `${import.meta.env.VITE_BACKEND_BASE_URL}/api/v1/category`,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (response.data.success) {
                setCategories(response.data.categories);
            }
        } catch (err) {
            console.log('Error fetching categories:', err);
        }
    }, []);

    const fetchExpenses = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios({
                method: 'GET',
                url: `${import.meta.env.VITE_BACKEND_BASE_URL}/api/v1/expense`,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                params: {
                    page: pagination.currentPage,
                    limit: 10,
                    category: filters.category,
                    source: filters.source,
                    startDate: startDate.toISOString(),
                    endDate: endDate.toISOString(),
                    sortBy: filters.sortBy,
                    sortOrder: filters.sortOrder
                }
            });
            
            if (response.data.success) {
                setExpenses(response.data.expenses);
                setPagination(response.data.pagination);
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }, [pagination.currentPage, filters, startDate, endDate]);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    useEffect(() => {
        fetchExpenses();
    }, [fetchExpenses]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setPagination(prev => ({ ...prev, currentPage: 1 }));
    };

    const handlePageChange = (page) => {
        setPagination(prev => ({ ...prev, currentPage: page }));
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    };

    const getSourceIcon = (source) => {
        const icons = {
            cash: 'ri-money-dollar-circle-line',
            debit: 'ri-bank-card-line',
            credit: 'ri-credit-card-line',
            other: 'ri-wallet-3-line'
        };
        return icons[source] || 'ri-wallet-3-line';
    };

    const getSourceColor = (source) => {
        const colors = {
            cash: 'text-green-600',
            debit: 'text-blue-600',
            credit: 'text-purple-600',
            other: 'text-gray-600'
        };
        return colors[source] || 'text-gray-600';
    };

    // Edit handler
    const handleEditClick = (expense) => {
        setEditExpense({ ...expense, category: expense.category?._id || '', date: expense.date?.slice(0, 10) });
    };

    const handleEditChange = (e) => {
        setEditExpense({ ...editExpense, [e.target.name]: e.target.value });
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setEditLoading(true);
        try {
            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_BASE_URL}/api/v1/expense/${editExpense._id}`,
                {
                    ...editExpense,
                    amount: Number(editExpense.amount),
                },
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                }
            );
            if (response.data.success) {
                showSuccessToast('Expense updated successfully!');
                setEditExpense(null);
                fetchExpenses();
            }
        } catch (err) {
            showErrorToast(err.response?.data?.message || 'Failed to update expense');
        } finally {
            setEditLoading(false);
        }
    };

    // Delete handler
    const handleDelete = async (expenseId) => {
        if (!window.confirm('Are you sure you want to delete this expense?')) return;
        try {
            setEditLoading(true);
            const response = await axios.delete(
                `${import.meta.env.VITE_BACKEND_BASE_URL}/api/v1/expense/${expenseId}`,
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                }
            );
            if (response.data.success) {
                showSuccessToast('Expense deleted successfully!');
                fetchExpenses();
            }
        } catch (err) {
            showErrorToast(err.response?.data?.message || 'Failed to delete expense');
        } finally {
            setEditLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-gray-100 rounded-xl shadow p-6">
                <div className="flex items-center justify-center py-8">
                    <i className="ri-loader-2-line animate-spin text-2xl text-gray-600"></i>
                    <span className="ml-2 text-gray-600">Loading expenses...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-100 rounded-xl shadow p-6">
            <ToastContainer />
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <div>
                    <h2 className="text-xl font-semibold text-gray-800">Expense Details</h2>
                    <p className="text-gray-600 text-sm">
                        Showing {expenses.length} of {pagination.totalExpenses} expenses
                    </p>
                </div>
                
                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:mt-0">
                    <select
                        value={filters.category}
                        onChange={(e) => handleFilterChange('category', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200 text-sm"
                    >
                        <option value="">All Categories</option>
                        {categories.map(category => (
                            <option key={category._id} value={category._id}>
                                {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
                            </option>
                        ))}
                    </select>
                    
                    <select
                        value={filters.source}
                        onChange={(e) => handleFilterChange('source', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200 text-sm"
                    >
                        <option value="">All Sources</option>
                        {sources.map(source => (
                            <option key={source} value={source}>
                                {source.charAt(0).toUpperCase() + source.slice(1)}
                            </option>
                        ))}
                    </select>
                    
                    <select
                        value={filters.sortBy}
                        onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200 text-sm"
                    >
                        <option value="date">Sort by Date</option>
                        <option value="amount">Sort by Amount</option>
                        <option value="title">Sort by Title</option>
                    </select>
                    
                    <button
                        onClick={() => handleFilterChange('sortOrder', filters.sortOrder === 'desc' ? 'asc' : 'desc')}
                        className="px-3 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-200 text-sm"
                    >
                        <i className={`ri-sort-${filters.sortOrder === 'desc' ? 'desc' : 'asc'}`}></i>
                    </button>
                </div>
            </div>

            {/* Expenses Table */}
            {expenses.length === 0 ? (
                <div className="text-center py-8">
                    <i className="ri-file-list-3-line text-4xl text-gray-400 mb-3"></i>
                    <p className="text-gray-600">No expenses found for the selected period</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full bg-white rounded-lg shadow-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Expense
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Category
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Amount
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Source
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {expenses.map((expense) => (
                                <tr key={expense._id} className="hover:bg-gray-50">
                                    <td className="px-4 py-4">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">
                                                {expense.title}
                                            </div>
                                            {expense.description && (
                                                <div className="text-sm text-gray-500 truncate max-w-xs">
                                                    {expense.description}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            {expense.category?.name || 'N/A'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="text-sm font-semibold text-gray-900">
                                            {formatCurrency(expense.amount)}
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center">
                                            <i className={`${getSourceIcon(expense.source)} ${getSourceColor(expense.source)} text-lg mr-2`}></i>
                                            <span className="text-sm text-gray-900 capitalize">
                                                {expense.source}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-sm text-gray-900">
                                        {formatDate(expense.date)}
                                    </td>
                                    <td className="px-4 py-4">
                                        <button
                                            className="text-indigo-600 hover:text-indigo-900 font-medium mr-2"
                                            onClick={() => handleEditClick(expense)}
                                        >
                                            <i className="ri-edit-2-line"></i> Edit
                                        </button>
                                        <button
                                            className="text-red-600 hover:text-red-800 font-medium"
                                            onClick={() => handleDelete(expense._id)}
                                        >
                                            <i className="ri-delete-bin-line"></i> Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                    <div className="text-sm text-gray-700">
                        Page {pagination.currentPage} of {pagination.totalPages}
                    </div>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => handlePageChange(pagination.currentPage - 1)}
                            disabled={!pagination.hasPrevPage}
                            className="px-3 py-2 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => handlePageChange(pagination.currentPage + 1)}
                            disabled={!pagination.hasNextPage}
                            className="px-3 py-2 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {editExpense && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <form onSubmit={handleEditSubmit} className="bg-white rounded-xl shadow-lg p-8 w-full max-w-lg relative animate-fade-in">
                        <button
                            type="button"
                            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-xl"
                            onClick={() => setEditExpense(null)}
                            aria-label="Close"
                        >
                            &times;
                        </button>
                        <h2 className="text-xl font-semibold mb-4">Edit Expense</h2>
                        <div className="space-y-4">
                            <input
                                type="text"
                                name="title"
                                value={editExpense.title}
                                onChange={handleEditChange}
                                className="w-full border border-gray-300 rounded-md px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200 text-gray-800 text-base"
                                required
                                placeholder="Expense name*"
                            />
                            <input
                                type="number"
                                name="amount"
                                value={editExpense.amount}
                                onChange={handleEditChange}
                                className="w-full border border-gray-300 rounded-md px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200 text-gray-800 text-base"
                                required
                                placeholder="Amount*"
                            />
                            <input
                                type="date"
                                name="date"
                                value={editExpense.date?.slice(0, 10) || ''}
                                onChange={handleEditChange}
                                className="w-full border border-gray-300 rounded-md px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200 text-gray-800 text-base"
                                required
                            />
                            <select
                                name="category"
                                value={editExpense.category}
                                onChange={handleEditChange}
                                className="w-full border border-gray-300 rounded-md px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200 text-gray-800 text-base"
                                required
                            >
                                <option value="">Expense Category*</option>
                                {categories.map(cat => (
                                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                                ))}
                            </select>
                            <select
                                name="source"
                                value={editExpense.source}
                                onChange={handleEditChange}
                                className="w-full border border-gray-300 rounded-md px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200 text-gray-800 text-base"
                                required
                            >
                                <option value="">Payment Source*</option>
                                {sources.map(src => (
                                    <option key={src} value={src}>{src.charAt(0).toUpperCase() + src.slice(1)}</option>
                                ))}
                            </select>
                            <textarea
                                name="description"
                                value={editExpense.description}
                                onChange={handleEditChange}
                                rows={3}
                                className="w-full border border-gray-300 rounded-md px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200 text-gray-800 text-base resize-none"
                                placeholder="Comments"
                            />
                        </div>
                        <div className="flex justify-end gap-4 pt-4">
                            <button
                                type="button"
                                onClick={() => setEditExpense(null)}
                                className="text-indigo-600 hover:underline font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex items-center gap-2 px-6 py-2 rounded-md bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:opacity-60"
                                disabled={editLoading}
                            >
                                {editLoading ? <i className="ri-loader-2-line animate-spin"></i> : <i className="ri-save-2-line"></i>} Update
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}

export default ExpenseList;