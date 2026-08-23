import React from 'react';

interface RollDexLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
}

export const RollDexLogo: React.FC<RollDexLogoProps> = ({
  size = 'md',
  showSubtitle = false
}) => {
  const textSizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl sm:text-3xl',
    lg: 'text-3xl sm:text-4xl',
    xl: 'text-4xl sm:text-5xl'
  };

  const svgDimensions = {
    sm: { w: 26, h: 26 },
    md: { w: 34, h: 34 },
    lg: { w: 42, h: 42 },
    xl: { w: 52, h: 52 }
  }[size];

  return (
    <div className="inline-flex flex-col select-none">
      <div className="flex items-center tracking-tight">
        {/* WORD 1: "ROLL" in Original App Amber / Warm Golden Orange */}
        <span
          className={`font-display font-black uppercase leading-none text-amber-500 tracking-tight mr-2 sm:mr-2.5 drop-shadow-[0_1px_1px_rgba(0,0,0,0.06)] ${textSizeClasses[size]}`}
          style={{ letterSpacing: '-0.02em' }}
        >
          ROLL
        </span>

        {/* WORD 2: "DEX" ("DE" in Deep Charcoal + Authentic Black Belt "X" with Red Rank Sleeve) */}
        <div className="flex items-center">
          {/* "DE" in crisp solid white */}
          <span
            className={`font-display font-black uppercase leading-none text-white ${textSizeClasses[size]}`}
            style={{ letterSpacing: '-0.02em' }}
          >
            DE
          </span>

          {/* "X" - Tight, optically paired White Belt tied knot with Signature Black Rank Bar */}
          <div className="inline-flex items-center justify-center relative translate-y-[-0.5px] ml-[2px]">
            <svg
              width={svgDimensions.w}
              height={svgDimensions.h}
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="drop-shadow-sm overflow-visible"
            >
              {/* Belt Tail 1: Top-Left to Bottom-Right (Crisp White Gi Belt) */}
              <line
                x1="10"
                y1="10"
                x2="54"
                y2="54"
                stroke="#f8fafc"
                strokeWidth="12"
                strokeLinecap="round"
              />
              {/* Stitching Line Tail 1 */}
              <line
                x1="11"
                y1="9"
                x2="53"
                y2="51"
                stroke="#cbd5e1"
                strokeWidth="1.4"
                strokeLinecap="round"
              />

              {/* Belt Tail 2: Top-Right to Bottom-Left (Crisp White Gi Belt) */}
              <line
                x1="54"
                y1="10"
                x2="10"
                y2="54"
                stroke="#f8fafc"
                strokeWidth="12"
                strokeLinecap="round"
              />
              {/* Stitching Line Tail 2 */}
              <line
                x1="53"
                y1="9"
                x2="11"
                y2="51"
                stroke="#cbd5e1"
                strokeWidth="1.4"
                strokeLinecap="round"
              />

              {/* BJJ White Belt Signature BLACK RANK SLEEVE on bottom-right tail */}
              <g transform="rotate(45 44 44)">
                {/* Black Rank Sleeve Bar */}
                <rect
                  x="36"
                  y="39"
                  width="17"
                  height="11"
                  rx="1.5"
                  fill="#0f172a"
                  stroke="#334155"
                  strokeWidth="0.8"
                />
                {/* White rank stripes */}
                <line x1="39.5" y1="40" x2="39.5" y2="49.5" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="square" />
                <line x1="43.5" y1="40" x2="43.5" y2="49.5" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="square" />
                <line x1="47.5" y1="40" x2="47.5" y2="49.5" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="square" />
              </g>

              {/* Central Tied BJJ Belt Knot Square with Authentic Brazil Flag */}
              <g id="bjj-belt-knot-brazil-flag">
                {/* Green Field with Knot Rounded Rectangle Base */}
                <rect
                  x="22"
                  y="22"
                  width="20"
                  height="20"
                  rx="3.5"
                  fill="#009c3b"
                  stroke="#0f172a"
                  strokeWidth="2.2"
                />

                {/* Brazilian Flag Yellow Rhombus / Diamond */}
                <polygon
                  points="32,24.6 39.4,32 32,39.4 24.6,32"
                  fill="#ffdf00"
                />

                {/* Brazilian Flag Celestial Blue Circle */}
                <circle
                  cx="32"
                  cy="32"
                  r="4.2"
                  fill="#002776"
                />

                {/* Brazilian Flag White Arch Band ("Ordem e Progresso") */}
                <path
                  d="M 28 31.8 C 30.2 30.2, 33.8 30.2, 36 31.8"
                  stroke="#ffffff"
                  strokeWidth="0.85"
                  fill="none"
                  strokeLinecap="round"
                />

                {/* Southern Cross constellation stars in blue sphere */}
                <circle cx="31.2" cy="33.7" r="0.4" fill="#ffffff" />
                <circle cx="32.8" cy="34.1" r="0.4" fill="#ffffff" />
                <circle cx="32" cy="35" r="0.35" fill="#ffffff" />

                {/* Subtle knot seam edge overlay */}
                <rect
                  x="22"
                  y="22"
                  width="20"
                  height="20"
                  rx="3.5"
                  fill="none"
                  stroke="#0f172a"
                  strokeWidth="2"
                />
              </g>
            </svg>
          </div>
        </div>
      </div>
      {showSubtitle && (
        <span className="text-[11px] sm:text-xs text-white font-light tracking-wider mt-0.5">
          BJJ Journal
        </span>
      )}
    </div>
  );
};
