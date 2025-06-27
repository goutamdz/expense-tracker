import React, { useState, useEffect, useCallback } from 'react'
import Card from '../components/Card'
import FilterTimeFrame from '../components/FilterTimeFrame'
import SummaryCard from '../components/SummaryCard'
import ExpenseList from '../components/ExpenseList'
import Navbar from '../components/Navbar'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function Dashboard() {
    const navigate = useNavigate();
    // Set selected to null for 'All' by default
    const [selected, setSelected] = useState(null);
    const [startDate, setStartDate] = useState(() => new Date('1970-01-01'));
    const [endDate, setEndDate] = useState(() => new Date('2999-12-31'));
    const [stats, setStats] = useState(null);

    // Update startDate and endDate when selected changes
    useEffect(() => {
        const now = new Date();
        if (selected === 0) { // current month
            setStartDate(new Date(now.getFullYear(), now.getMonth(), 1));
            setEndDate(new Date(now.getFullYear(), now.getMonth() + 1, 0));
        } else if (selected === 1) { // last 3 months
            setStartDate(new Date(now.getFullYear(), now.getMonth() - 3, 1));
            setEndDate(new Date(now.getFullYear(), now.getMonth() + 1, 0));
        } else if (selected === 2) { // last 6 months
            setStartDate(new Date(now.getFullYear(), now.getMonth() - 6, 1));
            setEndDate(new Date(now.getFullYear(), now.getMonth() + 1, 0));
        } else if (selected === null) { // All
            setStartDate(new Date('1970-01-01'));
            setEndDate(new Date('2999-12-31'));
        }
    }, [selected]);

    // Add a function to refresh stats
    const refreshStats = useCallback(() => {
        if (!startDate || !endDate) return;
        axios({
            method: 'GET',
            url: `${import.meta.env.VITE_BACKEND_BASE_URL}/api/v1/expense/stats`,
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            params: {
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString()
            }
        })
        .then((response) => {
            if (response.data.success) {
                setStats(response.data.stats);
            }
        })
        .catch((err) => {
            console.log(err);
        });
    }, [startDate, endDate]);

    // Fetch stats when startDate, endDate, or selected changes
    useEffect(() => {
        refreshStats();
    }, [startDate, endDate, selected, refreshStats]);

    const formatDate = useCallback((dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }, []);

    const formatCurrency = useCallback((amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'INR',
        }).format(amount);
    }, []);

    return (
        <>
            <Navbar />

            <div className="min-h-screen bg-gray-200 p-6 cursor-pointer pt-20">
                <button
                    onClick={() => navigate('/add-expense')}
                    className="fixed bottom-8 right-8 flex items-center gap-2 px-5 py-3 bg-blue-100 text-blue-900 font-medium rounded-xl shadow-lg hover:bg-blue-200 transition z-50"
                >
                    <i className="ri-file-add-line text-2xl"></i>
                    Add Expense
                </button>
                {/* Time Frame Filter */}
                <div className="flex justify-end mb-8 mt-4">
                    <div className="bg-gray-100 rounded-xl shadow p-6 w-[720px]">
                        <FilterTimeFrame
                            selected={selected}
                            setSelected={setSelected}
                            startDate={startDate}
                            setStartDate={setStartDate}
                            endDate={endDate}
                            setEndDate={setEndDate}
                        />
                    </div>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-8">
                    <Card
                        icon={<i className="ri-calendar-line"></i>}
                        title={stats ? formatDate(stats.startDate) : "N/A"}
                        description={"First Expense Date"}
                    />
                    <Card
                        icon={<i className="ri-calendar-line"></i>}
                        title={stats ? formatDate(stats.endDate) : "N/A"}
                        description={"Latest Expense Date"}
                    />
                    <Card
                        icon={<i className="ri-receipt-line"></i>}
                        title={stats ? stats.totalCount : 0}
                        description={"Number of Expenses"}
                    />
                    <Card
                        icon={<i className="ri-money-rupee-circle-line"></i>}
                        title={stats ? formatCurrency(stats.totalAmount) : "₹0.00"}
                        description={"Total Expenses Amount"}
                    />
                </div>

                {/* Expense List */}
                <div className="max-w-6xl mx-auto">
                    <ExpenseList startDate={startDate} endDate={endDate} onDataChange={refreshStats} />
                </div>
            </div>
        </>
    )
}

export default Dashboard