"use client"

import React, { useEffect, useRef } from 'react'

export const AnimatedBlob: React.FC = () => {
  const blobRef = useRef<SVGPathElement>(null)

  useEffect(() => {
    const blob = blobRef.current
    if (!blob) return

    let mouseX = 0
    let mouseY = 0
    let blobX = 0
    let blobY = 0

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    const animateBlob = () => {
      const dx = mouseX - blobX
      const dy = mouseY - blobY
      blobX += dx * 0.1
      blobY += dy * 0.1
      blob.style.transform = `translate(${blobX}px, ${blobY}px)`
      requestAnimationFrame(animateBlob)
    }

    window.addEventListener('mousemove', handleMouseMove)
    animateBlob()

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <svg
      className="absolute top-0 left-0 w-full h-full pointer-events-none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id="goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
            result="goo"
          />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>
      </defs>
      <g filter="url(#goo)">
        <path
          ref={blobRef}
          d="M60,-76.9C75.5,-63.9,84.2,-42.8,89.1,-20.7C94.1,1.4,95.3,24.4,86.7,41.7C78.1,58.9,59.6,70.3,40.6,77.3C21.6,84.3,2.2,86.9,-19.2,84.6C-40.7,82.3,-64.2,75.1,-79.4,59.1C-94.6,43.1,-101.5,18.3,-98.9,-4.9C-96.2,-28.1,-84,-49.7,-67.1,-62.6C-50.2,-75.5,-28.7,-79.7,-5.2,-73.7C18.3,-67.7,44.5,-51.5,60,-76.9Z"
          fill="url(#blob-gradient)"
          transform="translate(100 100)"
        />
      </g>
      <linearGradient id="blob-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="rgba(79, 70, 229, 0.3)" />
        <stop offset="50%" stopColor="rgba(147, 51, 234, 0.3)" />
        <stop offset="100%" stopColor="rgba(236, 72, 153, 0.3)" />
      </linearGradient>
    </svg>
  )
}

