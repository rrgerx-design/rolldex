import React from 'react';
import { BeltDefinition } from '../types';

interface BeltGraphicProps {
  belt: BeltDefinition;
  stripes: number; // 0 to maxStripes
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const BeltGraphic: React.FC<BeltGraphicProps> = ({
  belt,
  stripes = 0,
  size = 'md',
  showLabel = false
}) => {
  // Height and dimensions based on size
  const dimensions = {
    sm: { height: 'h-6', barWidth: 'w-14', stripeWidth: 'w-1', gap: 'gap-0.5', text: 'text-[11px]' },
    md: { height: 'h-9', barWidth: 'w-20', stripeWidth: 'w-1.5', gap: 'gap-1', text: 'text-xs' },
    lg: { height: 'h-12', barWidth: 'w-28', stripeWidth: 'w-2', gap: 'gap-1.5', text: 'text-sm' }
  }[size];

  const effectiveStripes = Math.min(Math.max(0, stripes), belt.maxStripes);

  // Bar colors
  const getBarBg = () => {
    if (belt.barType === 'red') return 'bg-red-700';
    if (belt.barType === 'white') return 'bg-white';
    return 'bg-neutral-950';
  };

  // Stripe tape color (black belt degrees on red bar are white; white bar stripes might be black or red)
  const getStripeColor = () => {
    if (belt.barType === 'white') return 'bg-neutral-900';
    return 'bg-white';
  };

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {/* Belt Strap */}
      <div
        className={`relative w-full ${dimensions.height} rounded-md shadow-inner flex items-center justify-between overflow-hidden border border-black/30`}
        style={{ backgroundColor: belt.primaryColor }}
      >
        {/* Belt Texture Lines */}
        <div className="absolute inset-0 opacity-20 pointer-events-none flex flex-col justify-around py-0.5">
          <div className="w-full h-px bg-black/40" />
          <div className="w-full h-px bg-black/40" />
        </div>

        {/* Center Stripe (for Kids multi-color belts or Coral belts) */}
        {belt.secondaryColor && (
          <div
            className="absolute inset-x-0 top-1/4 bottom-1/4 shadow-xs border-y border-black/20 pointer-events-none"
            style={{ backgroundColor: belt.secondaryColor }}
          />
        )}

        {/* Left belt section spacer */}
        <div className="w-1/2" />

        {/* Rank Bar (Sleeve at end of belt) */}
        <div
          className={`relative h-full ${dimensions.barWidth} ${getBarBg()} flex items-center justify-end px-2 shadow-md shrink-0 ${
            belt.barBorder ? 'border-y-2 border-white' : ''
          }`}
        >
          {/* White border caps for Professor Black Belt */}
          {belt.barBorder && (
            <>
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-white" />
              <div className="absolute right-0 top-0 bottom-0 w-1 bg-white" />
            </>
          )}

          {/* Stripes / Degree Bars */}
          <div className={`flex items-center ${dimensions.gap} z-10 mr-1`}>
            {Array.from({ length: effectiveStripes }).map((_, idx) => (
              <div
                key={idx}
                className={`${dimensions.stripeWidth} h-4/5 ${getStripeColor()} rounded-xs shadow-xs`}
                title={`Stripe ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {showLabel && (
        <div className="flex items-center justify-between text-xs font-semibold px-0.5">
          <span className="text-neutral-900 dark:text-neutral-100">{belt.name}</span>
          <span className="text-amber-600 font-bold">
            {effectiveStripes === 0
              ? 'No Stripes'
              : belt.id.includes('black')
              ? `${effectiveStripes}º Degree Professor`
              : `${effectiveStripes} ${effectiveStripes === 1 ? 'Stripe' : 'Stripes'}`}
          </span>
        </div>
      )}
    </div>
  );
};
