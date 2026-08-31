import React from 'react';
import kshetraLogoImg from '../../assets/kshetra-logo.png';
import kshetraIconImg from '../../assets/kshetra-icon.png';

interface LandXLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showWordmark?: boolean;
  className?: string;
  lightMode?: boolean;
}

export const KshetraLogo: React.FC<LandXLogoProps> = ({
  size = 'md',
  showWordmark = true,
  className = '',
  lightMode = false,
}) => {
  // Dimensions
  const logoHeight =
    size === 'sm' ? 'h-8' : size === 'md' ? 'h-11' : size === 'lg' ? 'h-14' : 'h-20';
  const iconDimensions =
    size === 'sm' ? 'h-7 w-7' : size === 'md' ? 'h-9 w-9' : size === 'lg' ? 'h-12 w-12' : 'h-16 w-16';

  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      {showWordmark ? (
        <img
          src={kshetraLogoImg}
          alt="KSHETRA — National Infrastructure Intelligence"
          className={`${logoHeight} w-auto object-contain transition-transform duration-200 hover:scale-[1.02] ${
            lightMode ? 'brightness-110' : ''
          }`}
        />
      ) : (
        <img
          src={kshetraIconImg}
          alt="KSHETRA"
          className={`${iconDimensions} object-contain transition-transform duration-200 hover:scale-105 ${
            lightMode ? 'brightness-110' : ''
          }`}
        />
      )}
    </div>
  );
};

// Maintain LandXLogo as backward compatible alias
export const LandXLogo = KshetraLogo;

