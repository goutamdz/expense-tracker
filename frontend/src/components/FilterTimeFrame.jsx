import React, { useState } from 'react'

const options = [
  'All Time',
  'Current Month',
  'Last 3 Months',
  'Last 6 Months',
  'Custom Range',
]

function FilterTimeFrame({ selected, setSelected, startDate, setStartDate, endDate, setEndDate, onSearch }) {
  const [showCustomDates, setShowCustomDates] = useState(false);

  const handleOptionClick = (index) => {
    setSelected(index);
    
    if (index === 4) { // Custom Range
      setShowCustomDates(true);
    } else {
      setShowCustomDates(false);
    }
  };

  const handleCustomDateChange = (type, value) => {
    if (type === 'start') {
      // setStartDate(new Date(new Date().setFullYear(new Date().getFullYear() - 1)));
      setStartDate(new Date(value));
    } else {
      setEndDate(new Date(value));
    }
  };

  return (
    <div className="bg-gray-100 rounded-2xl p-4">
      {/* Preset Options */}
      <div className="flex gap-3 flex-wrap mb-4">
        {
          options.map((option, index) => {
            return (
              <div
                key={index}
                className={`px-4 py-1 rounded-md border text-gray-700 font-medium transition cursor-pointer
                ${selected === index
                    ? 'bg-slate-400 border-gray-400 shadow-sm'
                    : 'bg-gray-100 border-gray-300 hover:bg-white'
                }
              `}
                onClick={() => handleOptionClick(index)}
              >
                {option}
              </div>
            )
          })
        }
      </div>

      {/* Custom Date Range */}
      {showCustomDates && (
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">From:</label>
            <input
              type="date"
              value={startDate ? startDate.toISOString().split('T')[0] : ''}
              onChange={(e) => handleCustomDateChange('start', e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200 text-sm"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">To:</label>
            <input
              type="date"
              value={endDate ? endDate.toISOString().split('T')[0] : ''}
              onChange={(e) => handleCustomDateChange('end', e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200 text-sm"
            />
          </div>

          <button
            onClick={() => {
              setSelected(0); // Reset to 1 year
              setStartDate(new Date(new Date().setFullYear(new Date().getFullYear() - 1)));
              setEndDate(new Date());
              setShowCustomDates(true);
            }}
            className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:underline cursor-pointer"
          >
            Reset
          </button>
        </div>
      )}
    </div>
  )
}

export default FilterTimeFrame