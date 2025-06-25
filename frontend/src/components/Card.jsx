import React from 'react'

function Card({ icon, title, description }) {
  return (
    <div className="bg-gray-100 rounded-xl shadow flex flex-col items-center justify-center p-8 min-w-[250px] min-h-[180px]">
      <div className="text-4xl mb-3 text-gray-700">{icon}</div>
      <p className="text-3xl font-light mb-1">{title}</p>
      <p className="text-base text-gray-500">{description}</p>
    </div>
  )
}

export default Card;