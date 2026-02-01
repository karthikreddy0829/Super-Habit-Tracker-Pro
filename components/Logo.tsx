
import React from 'react';

interface LogoProps {
  size?: number;
  className?: string;
  variant?: 'full' | 'icon';
}

const Logo: React.FC<LogoProps> = ({ size = 40, className = "", variant = 'icon' }) => {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-sm"
      >
        {/* Pink Strike Circle Background */}
        <path 
          d="M50 15C30.67 15 15 30.67 15 50C15 69.33 30.67 85 50 85C69.33 85 85 69.33 85 50C85 30.67 69.33 15 50 15ZM35 75L45 55L30 55L70 25L60 45L75 45L35 75Z" 
          fill="#F19A9A" 
          fillOpacity="0.8"
        />
        
        {/* Black Stylized Barbell / H Icon */}
        <g fill="#1A1A1A">
          {/* Left Weights */}
          <rect x="28" y="44" width="3" height="12" rx="1.5" />
          <rect x="34" y="38" width="3" height="24" rx="1.5" />
          
          {/* Middle Bar / H Structure */}
          <rect x="42" y="35" width="3" height="30" rx="1.5" />
          <rect x="42" y="48" width="16" height="4" rx="1" />
          <rect x="55" y="35" width="3" height="30" rx="1.5" />
          
          {/* Right Weights */}
          <rect x="63" y="38" width="3" height="24" rx="1.5" />
          <rect x="69" y="44" width="3" height="12" rx="1.5" />
        </g>
      </svg>
      {variant === 'full' && (
        <div className="mt-2 text-center flex flex-col items-center">
          <span className="text-[18px] font-black text-[#1A1A1A] uppercase tracking-wider leading-none">
            Super
          </span>
          <span className="text-[10px] font-bold text-[#1A1A1A] uppercase tracking-[0.3em] mt-1 opacity-80">
            Tracker Pro
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
