'use client';

import React from 'react';

export interface MarqueeProps {
  items?: string[];
  separator?: string;
  speed?: 'normal' | 'fast' | 'slow';
  reverse?: boolean;
  bgColor?: string;
  textColor?: string;
  borderTop?: boolean;
  borderBottom?: boolean;
  className?: string;
}

const defaultItems = [
  'FREE ISLANDWIDE SHIPPING OVER LKR 15,000',
  'LIMITED ATELIER DROPS EVERY FRIDAY',
  '30-DAY FREE FIT EXCHANGES',
  'HEAVYWEIGHT 500GSM APPAREL',
  '100% GOTS ORGANIC COTTON',
  'CONTEMPORARY NEO-BRUTALIST ATELIER',
];

export const Marquee: React.FC<MarqueeProps> = ({
  items = defaultItems,
  separator = '★',
  speed = 'normal',
  reverse = false,
  bgColor = 'bg-neo-yellow',
  textColor = 'text-black',
  borderTop = true,
  borderBottom = true,
  className = '',
}) => {
  const content = items.join(` ${separator} `) + ` ${separator} `;

  const speedClass =
    speed === 'fast'
      ? reverse
        ? 'animate-[marquee-reverse_12s_linear_infinite]'
        : 'animate-[marquee_12s_linear_infinite]'
      : speed === 'slow'
      ? reverse
        ? 'animate-[marquee-reverse_35s_linear_infinite]'
        : 'animate-[marquee_35s_linear_infinite]'
      : reverse
      ? 'animate-marquee-reverse'
      : 'animate-marquee';

  return (
    <div
      className={`
        w-full overflow-hidden select-none py-2.5
        ${bgColor} ${textColor}
        ${borderTop ? 'border-t-3 border-black' : ''}
        ${borderBottom ? 'border-b-3 border-black' : ''}
        ${className}
      `}
      aria-hidden="true"
    >
      <div className="flex whitespace-nowrap will-change-transform">
        <div className={`flex shrink-0 items-center text-xs md:text-sm font-black tracking-widest uppercase ${speedClass}`}>
          <span className="px-4">{content}</span>
          <span className="px-4">{content}</span>
        </div>
        <div className={`flex shrink-0 items-center text-xs md:text-sm font-black tracking-widest uppercase ${speedClass}`}>
          <span className="px-4">{content}</span>
          <span className="px-4">{content}</span>
        </div>
      </div>
    </div>
  );
};
