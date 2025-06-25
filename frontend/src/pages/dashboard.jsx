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
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [selected, setSelected] = useState(1);
    const [stats, setStats] = useState(null);

    const fetchStats = useCallback(async () => {
        try {
            const response = await axios({
                method: 'GET',
                url: `${import.meta.env.VITE_BACKEND_BASE_URL}/api/v1/expense/stats`,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                params: {
                    startDate: startDate.toISOString(),
                    endDate: endDate.toISOString()
                }
            });
            
            if (response.data.success) {
                setStats(response.data.stats);
            }
        } catch (err) {
            console.log(err);
        }
    }, [startDate, endDate]);

    useEffect(() => {
        if(selected === 0) {//current month
            const now = new Date();
            const start = new Date(now.getFullYear(), now.getMonth(), 1);
            const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
            setStartDate(new Date(start.getFullYear(), start.getMonth(), start.getDate()));
            setEndDate(new Date(end.getFullYear(), end.getMonth(), end.getDate()));
        } else if(selected === 1) {//last 3 months
            const now = new Date();
            const start = new Date(now.getFullYear(), now.getMonth() - 3, 1);
            const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
            setStartDate(new Date(start.getFullYear(), start.getMonth(), start.getDate()));
            setEndDate(new Date(end.getFullYear(), end.getMonth(), end.getDate()));
        } else if(selected === 2) {//last 6 months
            const now = new Date();
            const start = new Date(now.getFullYear(), now.getMonth() - 6, 1);
            const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
            setStartDate(new Date(start.getFullYear(), start.getMonth(), start.getDate()));
            setEndDate(new Date(end.getFullYear(), end.getMonth(), end.getDate()));
        }
    }, [selected]);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    useEffect(() => {
        setSelected(0);
    }, []);

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
            currency: 'USD'
        }).format(amount);
    }, []);

    return (
        <>
            <Navbar />

            <div className="min-h-screen bg-gray-200 p-6">
                <button
                    onClick={() => navigate('/add-expense')}
                    className="fixed bottom-8 right-8 flex items-center gap-2 px-5 py-3 bg-blue-100 text-blue-900 font-medium rounded-xl shadow-lg hover:bg-blue-200 transition z-50"
                >
                    <i className="ri-file-add-line text-2xl"></i>
                    Add Expense
                </button>
                {/* Time Frame Filter */}
                <div className="flex justify-end mb-8">
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
                        icon={<i className="ri-money-dollar-circle-line"></i>}
                        title={stats ? formatCurrency(stats.totalAmount) : "$0.00"}
                        description={"Total Expenses Amount"}
                    />
                </div>

                {/* Expense List */}
                <div className="max-w-6xl mx-auto">
                    <ExpenseList startDate={startDate} endDate={endDate} />
                </div>
            </div>
        </>
    )
}

export default Dashboard