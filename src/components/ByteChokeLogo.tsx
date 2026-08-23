import React from 'react';

interface ByteChokeLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'mono' | 'light';
}

export const ByteChokeLogo: React.FC<ByteChokeLogoProps> = ({
  className = '',
  size = 'md',
  variant = 'default'
}) => {
  const sizePixels = {
    sm: 26,
    md: 38,
    lg: 48,
    xl: 64
  }[size];

  return (
    <div
      className={`inline-flex items-center justify-center relative select-none shrink-0 ${className}`}
      style={{ width: sizePixels, height: sizePixels }}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-xs"
      >
        {/* Sleek Circular Dojo Base in Deep Obsidian for Maximum Contrast */}
        <circle
          cx="50"
          cy="50"
          r="46"
          fill="#141414"
          stroke="#262626"
          strokeWidth="3"
        />

        {/* Minimalist Inner Dojo Accent Ring */}
        <circle
          cx="50"
          cy="50"
          r="40"
          stroke="#2f2f2f"
          strokeWidth="1.5"
          strokeDasharray="4 3"
          fill="none"
        />

        {/* --- HIGH VISIBILITY BJJ WHITE BELT --- */}
        {/* Main Horizontal Wrapped Crisp White Belt Band */}
        <path
          d="M12 50 L88 50"
          stroke="#ffffff"
          strokeWidth="12"
          strokeLinecap="round"
        />
        {/* Belt Seam Stitch Lines */}
        <path
          d="M16 45.5 L84 45.5"
          stroke="#e5e5e5"
          strokeWidth="1"
          strokeLinecap="round"
        />
        <path
          d="M16 54.5 L84 54.5"
          stroke="#e5e5e5"
          strokeWidth="1"
          strokeLinecap="round"
        />

        {/* Authentic Black Rank Sleeve Bar on Right Side */}
        <rect
          x="54"
          y="44"
          width="26"
          height="12"
          rx="2"
          fill="#000000"
        />

        {/* White Degree Rank Stripes on Black Sleeve */}
        <rect x="61" y="45" width="2.5" height="10" fill="#ffffff" rx="0.5" />
        <rect x="66" y="45" width="2.5" height="10" fill="#ffffff" rx="0.5" />
        <rect x="71" y="45" width="2.5" height="10" fill="#ffffff" rx="0.5" />

        {/* Center Tied White Belt Knot Square */}
        <rect
          x="37"
          y="41"
          width="18"
          height="18"
          rx="4"
          fill="#ffffff"
          stroke="#000000"
          strokeWidth="2"
        />
        {/* Knot Fold Shadow Lines */}
        <path
          d="M40 45 L52 55"
          stroke="#d4d4d4"
          strokeWidth="1.5"
        />
        <path
          d="M52 45 L40 55"
          stroke="#d4d4d4"
          strokeWidth="1.5"
        />

        {/* Hanging White Belt Tails (Left & Right) */}
        {/* Left White Tail */}
        <path
          d="M42 58 L36 80"
          stroke="#ffffff"
          strokeWidth="7"
          strokeLinecap="round"
        />
        <path
          d="M42 58 L36 80"
          stroke="#d4d4d4"
          strokeWidth="1"
          strokeLinecap="round"
        />

        {/* Right White Tail (With Black Rank Bar Tip) */}
        <path
          d="M50 58 L56 80"
          stroke="#ffffff"
          strokeWidth="7"
          strokeLinecap="round"
        />
        {/* Black Rank Sleeve on Right Hanging Tail */}
        <path
          d="M54.5 74 L56 80"
          stroke="#000000"
          strokeWidth="7"
          strokeLinecap="round"
        />
        {/* White Degree Stripe on Tail Sleeve */}
        <line x1="53" y1="74" x2="57" y2="74" stroke="#ffffff" strokeWidth="1" />

        {/* Subtle Martial Arts Focus Amber Dot at Top */}
        <circle cx="50" cy="22" r="3" fill="#f59e0b" />
      </svg>
    </div>
  );
};
