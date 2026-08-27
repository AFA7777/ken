import React, { useState } from 'react';

interface KenAvatarProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showStatus?: boolean;
}

export const KenAvatar: React.FC<KenAvatarProps> = ({
  size = 'md',
  className = '',
  showStatus = false,
}) => {
  const [imgError, setImgError] = useState(false);

  const sizeMap = {
    xs: {
      container: 'w-7 h-7 rounded-xl',
      badge: 'w-3 h-3 text-[8px] -bottom-0.5 -right-0.5',
      indicator: 'w-2 h-2 -top-0.5 -right-0.5',
    },
    sm: {
      container: 'w-8 h-8 rounded-xl',
      badge: 'w-3.5 h-3.5 text-[9px] -bottom-0.5 -right-0.5',
      indicator: 'w-2.5 h-2.5 -top-0.5 -right-0.5',
    },
    md: {
      container: 'w-10 h-10 sm:w-11 sm:h-11 rounded-2xl',
      badge: 'w-4 h-4 text-[10px] -bottom-1 -right-1',
      indicator: 'w-3 h-3 -top-0.5 -right-0.5',
    },
    lg: {
      container: 'w-14 h-14 sm:w-16 sm:h-16 rounded-3xl',
      badge: 'w-5 h-5 text-xs -bottom-1.5 -right-1.5 font-bold',
      indicator: 'w-3.5 h-3.5 -top-0.5 -right-0.5',
    },
    xl: {
      container: 'w-20 h-20 sm:w-24 sm:h-24 rounded-3xl',
      badge: 'w-7 h-7 text-sm -bottom-2 -right-2 font-bold',
      indicator: 'w-4 h-4 -top-1 -right-1',
    },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`relative shrink-0 select-none ${className}`}>
      {/* Outer circular / smooth container */}
      <div
        className={`${currentSize.container} overflow-hidden border border-[#D5CDBD] bg-[#EBE4D6] shadow-xs relative flex items-center justify-center`}
      >
        {!imgError ? (
          <img
            src="/ken_avatar.jpg"
            alt="Ken 助教 (工業設計)"
            className="w-full h-full object-cover object-center transform scale-105"
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
          />
        ) : (
          /* High-Fidelity SVG Portrait Fallback */
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full object-cover"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="bgStudio" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#EFE9DE" />
                <stop offset="60%" stopColor="#E4DBCB" />
                <stop offset="100%" stopColor="#D5CBB9" />
              </linearGradient>

              <linearGradient id="denimFabric" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#86A9C8" />
                <stop offset="50%" stopColor="#6C92B5" />
                <stop offset="100%" stopColor="#557B9E" />
              </linearGradient>

              <linearGradient id="denimCollar" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#6E95B8" />
                <stop offset="100%" stopColor="#527699" />
              </linearGradient>

              <linearGradient id="skinTone" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FDE6D7" />
                <stop offset="60%" stopColor="#F5D4BF" />
                <stop offset="100%" stopColor="#E8C0A9" />
              </linearGradient>

              <linearGradient id="hairGlow" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#2E2C2A" />
                <stop offset="50%" stopColor="#211F1E" />
                <stop offset="100%" stopColor="#121110" />
              </linearGradient>
            </defs>

            <rect width="100" height="100" fill="url(#bgStudio)" />
            <circle cx="50" cy="40" r="45" fill="#FFF9EF" opacity="0.4" />

            {/* Shoulders & Washed Denim Shirt */}
            <path
              d="M6 100 C6 81, 20 73, 50 73 C80 73, 94 81, 94 100 Z"
              fill="url(#denimFabric)"
            />
            {/* White Undershirt */}
            <path d="M38 72 Q50 82 62 72 L60 83 Q50 89 40 83 Z" fill="#FAF8F5" />
            {/* Denim Collars */}
            <path d="M28 73 L42 86 L49 87 L43 73 Z" fill="url(#denimCollar)" stroke="#4A6F90" strokeWidth="0.75" />
            <path d="M72 73 L58 86 L51 87 L57 73 Z" fill="url(#denimCollar)" stroke="#4A6F90" strokeWidth="0.75" />
            {/* Neck */}
            <path d="M41 53 L41 74 Q50 78 59 74 L59 53 Z" fill="url(#skinTone)" />
            {/* Face */}
            <path d="M32 42 C32 29, 41 23, 50 23 C59 23, 68 29, 68 42 C68 53, 62 61, 50 63 C38 61, 32 53, 32 42 Z" fill="url(#skinTone)" />
            {/* Hair */}
            <path d="M29 36 C31 22, 42 14, 50 14 C60 14, 69 20, 70 34 C66 29, 58 26, 52 27 C45 28, 40 33, 36 39 C34 36, 31 35, 29 36 Z" fill="url(#hairGlow)" />
            {/* Eyes */}
            <circle cx="43.2" cy="45" r="1.6" fill="#241913" />
            <circle cx="56.8" cy="45" r="1.6" fill="#241913" />
            {/* Lips */}
            <path d="M45.5 56.5 Q50 57.8 54.5 56.5" stroke="#B57365" strokeWidth="1.3" strokeLinecap="round" fill="none" />
          </svg>
        )}
      </div>

      {/* "K" circular monogram badge in corner */}
      <div
        className={`absolute ${currentSize.badge} rounded-full bg-[#24211E] text-[#F9F7F2] flex items-center justify-center font-serif-chic font-bold border-2 border-[#FAF8F5] shadow-xs select-none`}
        title="Ken 助教 (工業設計)"
      >
        K
      </div>

      {/* Online indicator */}
      {showStatus && (
        <span
          className={`absolute ${currentSize.indicator} bg-emerald-500 border-2 border-[#FAF8F5] rounded-full`}
          title="在線引導中"
        />
      )}
    </div>
  );
};
