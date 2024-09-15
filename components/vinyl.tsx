import React from 'react'

export default function ZenlessZoneZeroVinyl() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-300">
      <div className="w-80 h-80 relative">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          {/* White background */}
          <circle cx="100" cy="100" r="100" fill="#fff" />
          
          {/* Vinyl grooves */}
          {[...Array(40)].map((_, i) => (
            <circle
              key={i}
              cx="100"
              cy="100"
              r={100 - i * 2.5}
              fill="none"
              stroke="#ddd"
              strokeWidth="0.5"
            />
          ))}
          
          {/* Center label */}
          <circle cx="100" cy="100" r="40" fill="#000" />
          
          {/* Text on the record */}
          <text
            x="100"
            y="95"
            textAnchor="middle"
            fill="#fff"
            fontSize="8"
            fontFamily="Arial, sans-serif"
            fontWeight="bold"
          >
            Zenless Zone Zero
          </text>
          <text
            x="100"
            y="110"
            textAnchor="middle"
            fill="#fff"
            fontSize="8"
            fontFamily="Arial, sans-serif"
          >
            三Z Studio
          </text>
        </svg>
        
        {/* Light reflection */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-white opacity-30 rounded-full pointer-events-none" />
        
        {/* Subtle shadow for depth */}
        <div className="absolute inset-0 rounded-full shadow-lg pointer-events-none" />
      </div>
    </div>
  )
}