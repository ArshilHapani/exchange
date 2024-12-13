import React from 'react'

export const AnimatedSVG: React.FC = () => {
  return (
    <svg
      className="absolute inset-0 w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1000 1000"
    >
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.3" />
          <stop offset="50%" stopColor="#9333EA" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#EC4899" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      
      <path
        d="M0,500 Q250,0 500,500 T1000,500"
        fill="none"
        stroke="url(#gradient)"
        strokeWidth="2"
        className="animate-draw"
      />
      <path
        d="M0,600 Q400,100 800,600 T1600,600"
        fill="none"
        stroke="url(#gradient)"
        strokeWidth="2"
        className="animate-draw animation-delay-1000"
      />
      <circle
        cx="500"
        cy="500"
        r="300"
        fill="none"
        stroke="url(#gradient)"
        strokeWidth="2"
        className="animate-draw animation-delay-2000"
      />
      <rect
        x="300"
        y="300"
        width="400"
        height="400"
        fill="none"
        stroke="url(#gradient)"
        strokeWidth="2"
        className="animate-draw animation-delay-3000"
      />
    </svg>
  )
}

