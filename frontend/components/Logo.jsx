export default function Logo({ size = 'md', showText = true, className = '' }) {
  const sizes = {
    sm: { icon: 28, text: 'text-xl' },
    md: { icon: 40, text: 'text-2xl' },
    lg: { icon: 48, text: 'text-3xl' },
  };

  const { icon, text } = sizes[size] || sizes.md;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Toolvy Icon */}
      <svg 
        width={icon} 
        height={icon} 
        viewBox="0 0 120 120" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="transition-transform duration-300 group-hover:scale-110"
      >
        <defs>
          <linearGradient id="logo-gradient" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#7c6cfa"/>
            <stop offset="100%" stopColor="#00d4ff"/>
          </linearGradient>
          <linearGradient id="logo-gradient-2" x1="120" y1="0" x2="0" y2="120" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#00d4ff"/>
            <stop offset="100%" stopColor="#7c6cfa"/>
          </linearGradient>
          <filter id="logo-glow">
            <feGaussianBlur stdDeviation="2" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Rounded square background */}
        <rect 
          x="4" 
          y="4" 
          width="112" 
          height="112" 
          rx="30"
          className="fill-white dark:fill-gray-800"
          stroke="url(#logo-gradient)" 
          strokeWidth="1.5" 
          opacity="0.9"
        />

        {/* Left bracket < */}
        <path 
          d="M36 38 L20 60 L36 82"
          stroke="url(#logo-gradient)" 
          strokeWidth="5.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          fill="none" 
          filter="url(#logo-glow)"
        />

        {/* Right bracket > */}
        <path 
          d="M84 38 L100 60 L84 82"
          stroke="url(#logo-gradient-2)" 
          strokeWidth="5.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          fill="none" 
          filter="url(#logo-glow)"
        />

        {/* Center: wrench tool */}
        {/* Wrench handle */}
        <rect 
          x="55" 
          y="62" 
          width="10" 
          height="13" 
          rx="3"
          fill="url(#logo-gradient)" 
          filter="url(#logo-glow)"
        />
        
        {/* Wrench head circle */}
        <circle 
          cx="60" 
          cy="50" 
          r="13"
          fill="none" 
          stroke="url(#logo-gradient)" 
          strokeWidth="4.5" 
          filter="url(#logo-glow)"
        />
        
        {/* Wrench head inner dot */}
        <circle 
          cx="60" 
          cy="50" 
          r="5"
          fill="url(#logo-gradient)" 
          filter="url(#logo-glow)"
        />
        
        {/* Top notch */}
        <rect 
          x="56.5" 
          y="34" 
          width="7" 
          height="9" 
          rx="3.5"
          fill="url(#logo-gradient)" 
          filter="url(#logo-glow)"
        />

        {/* Spark dots */}
        <circle cx="92" cy="28" r="3" fill="#00d4ff" opacity="0.8" filter="url(#logo-glow)"/>
        <circle cx="102" cy="36" r="2" fill="#7c6cfa" opacity="0.6"/>
        <circle cx="98" cy="22" r="1.5" fill="#00d4ff" opacity="0.5"/>
      </svg>

      {/* Wordmark */}
      {showText && (
        <div className={`font-display font-black ${text} leading-none hidden sm:block`}>
          <span className="text-gray-900 dark:text-white">Tool</span>
          <span className="bg-gradient-to-r from-[#7c6cfa] to-[#00d4ff] bg-clip-text text-transparent">
            vy
          </span>
        </div>
      )}
    </div>
  );
}
