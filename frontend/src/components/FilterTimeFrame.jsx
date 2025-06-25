import React, { useState } from 'react'

const options = [
  'Current Month',
  'Last 3 Months',
  'Last 6 Months',
  'Custom Date Range',
]

function FilterTimeFrame() {
  const [selected, setSelected] = useState(0)

  return (
    <div className="bg-gray-100 rounded-2xl p-4 flex gap-3 flex-wrap">
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
              onClick={() => setSelected(index)}
            >
              {option}
            </div>
          )
        })
      }

    </div>
  )
}

export default FilterTimeFrame