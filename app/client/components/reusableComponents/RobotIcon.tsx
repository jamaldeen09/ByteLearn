"use client"
export const RobotIcon = ({ className = "w-6 h-6" }) => (
    <svg 
      className={className}
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Robot head */}
      <rect x="6" y="4" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="2"/>
      
      {/* Antenna */}
      <path d="M12 4V2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="12" cy="2" r="1" fill="currentColor"/>
      
      {/* Eyes */}
      <circle cx="9" cy="8" r="1" fill="currentColor"/>
      <circle cx="15" cy="8" r="1" fill="currentColor"/>
      
      {/* Mouth */}
      <path d="M9 12H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      
      {/* Body */}
      <rect x="8" y="14" width="8" height="6" rx="1" stroke="currentColor" strokeWidth="2"/>
      
      {/* Arms */}
      <path d="M6 14V18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M18 14V18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      
      {/* Wheels/legs */}
      <circle cx="10" cy="20" r="1" fill="currentColor"/>
      <circle cx="14" cy="20" r="1" fill="currentColor"/>
    </svg>
)