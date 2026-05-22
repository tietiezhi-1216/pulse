import React from 'react';

const Bruno = ({ width }) => {
  return (
    <svg width={width} height={width} viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Pulse logo">
      <defs>
        <linearGradient id="pulse-mark" x1="32" y1="124" x2="224" y2="124" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#D90429" />
          <stop offset="0.45" stopColor="#FF174D" />
          <stop offset="1" stopColor="#FF5C8A" />
        </linearGradient>
        <filter id="pulse-neon" x="-28%" y="-60%" width="156%" height="220%" colorInterpolationFilters="sRGB">
          <feDropShadow dx="0" dy="0" stdDeviation="3.5" floodColor="#FF174D" floodOpacity="0.95" />
          <feDropShadow dx="0" dy="0" stdDeviation="9" floodColor="#FF174D" floodOpacity="0.58" />
          <feDropShadow dx="0" dy="0" stdDeviation="18" floodColor="#FF5C8A" floodOpacity="0.28" />
        </filter>
      </defs>
      <rect width="256" height="256" rx="56" fill="#FFFFFF" />
      <path
        d="M32 132h39l20-39 33 88 31-107 24 58h45"
        fill="none"
        stroke="#FF174D"
        strokeWidth="30"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.10"
      />
      <path
        d="M32 132h39l20-39 33 88 31-107 24 58h45"
        fill="none"
        stroke="#FF174D"
        strokeWidth="22"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.20"
      />
      <path
        d="M32 132h39l20-39 33 88 31-107 24 58h45"
        fill="none"
        stroke="url(#pulse-mark)"
        strokeWidth="13.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#pulse-neon)"
      />
      <path
        d="M32 132h39l20-39 33 88 31-107 24 58h45"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.52"
      />
    </svg>
  );
};

export default Bruno;
