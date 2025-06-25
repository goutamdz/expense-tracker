import React from 'react'

function Card({icon,title,description}) {
  return (
    <div>
        {icon}
        <p className='text-lg font-bold'>{title}</p>
        <p className='text-sm text-gray-500'>{description}</p>
    </div>
  )
}

export default Card;