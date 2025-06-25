import React from 'react'
import Card from '../components/Card'
import FilterTimeFrame from '../components/FilterTimeFrame'
import SummaryCard from '../components/SummaryCard'
import Navbar from '../components/Navbar'
import { useNavigate } from 'react-router-dom'


function Dashboard() {
    const navigate = useNavigate();
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
                        <FilterTimeFrame />
                    </div>
                </div>
                {/* Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                    <Card
                        icon={<i className="ri-calendar-line"></i>}
                        title={"Jul 15 2016"}
                        description={"First Expense Date"}
                    />
                    <Card
                        icon={<i className="ri-calendar-line"></i>}
                        title={"Jun 20 2025"}
                        description={"Latest Expense Date"}
                    />
                    <Card
                        icon={<i className="ri-receipt-line"></i>}
                        title={3}
                        description={"Number of Expenses"}
                    />
                    <Card
                        icon={<i className="ri-money-dollar-circle-line"></i>}
                        title={"$4,136.00"}
                        description={"Total Expenses Amount"}
                    />
                </div>
            </div>
        </>
    )
}

export default Dashboard