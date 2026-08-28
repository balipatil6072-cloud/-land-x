import React from 'react';

interface LandXLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showWordmark?: boolean;
  className?: string;
  lightMode?: boolean;
}

export const LandXLogo: React.FC<LandXLogoProps> = ({
  size = 'md',
  showWordmark = true,
  className = '',
  lightMode = false,
}) => {
  // Dimensions
  const iconSize = size === 'sm' ? 24 : size === 'md' ? 30 : size === 'lg' ? 38 : 50;
  const textSize = size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : size === 'lg' ? 'text-lg' : 'text-2xl';

  return (
    <div className={`inline-flex items-center space-x-3 select-none ${className}`}>
      {/* CADASTRAL LAND BOUNDARY 'X' SYMBOL (OPEN SILHOUETTE - NO BOX - NO CONTAINER) */}
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0 transition-transform duration-200 hover:scale-105"
      >
        {/* Top Land Parcel Polygon */}
        <polygon
          points="10,6 38,6 30,19 18,19"
          fill={lightMode ? '#ffffff' : '#1e3a8a'}
          className="transition-colors duration-200"
        />

        {/* Bottom Land Parcel Polygon */}
        <polygon
          points="18,29 30,29 38,42 10,42"
          fill={lightMode ? '#93c5fd' : '#1d4ed8'}
          className="transition-colors duration-200"
        />

        {/* Left Land Parcel Polygon */}
        <polygon
          points="6,10 17,18 17,30 6,38"
          fill={lightMode ? '#38bdf8' : '#0284c7'}
          className="transition-colors duration-200"
        />

        {/* Right Land Parcel Polygon */}
        <polygon
          points="42,10 42,38 31,30 31,18"
          fill={lightMode ? '#60a5fa' : '#2563eb'}
          className="transition-colors duration-200"
        />

        {/* Intersecting Cadastral Corridor Channels - The Discovered Negative Space 'X' */}
        <path
          d="M7,7 L41,41 M41,7 L7,41"
          stroke={lightMode ? '#0f172a' : '#ffffff'}
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Central Precision Survey Node */}
        <circle cx="24" cy="24" r="2" fill={lightMode ? '#38bdf8' : '#0284c7'} />
      </svg>

      {/* INSTITUTIONAL WORDMARK LOCKUP */}
      {showWordmark && (
        <div className="flex flex-col justify-center leading-none">
          <div className={`font-mono font-bold tracking-widest ${textSize} ${lightMode ? 'text-white' : 'text-slate-900'}`}>
            LAND<span className={lightMode ? 'text-blue-400' : 'text-blue-700'}>-X</span>
          </div>
        </div>
      )}
    </div>
  );
};
