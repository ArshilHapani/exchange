"use client";

import React from "react";

interface AnimatedBackgroundProps {
  children: React.ReactNode;
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  children,
}) => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="relative w-full h-full">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 animate-gradient-x"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background to-background"></div>
        </div>
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default AnimatedBackground;
