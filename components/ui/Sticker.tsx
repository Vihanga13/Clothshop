'use client';

import React from 'react';
import { motion } from 'framer-motion';

export interface StickerProps {
  text: string;
  variant?: 'yellow' | 'red' | 'blue' | 'green' | 'pink' | 'orange' | 'black';
  rotation?: number;
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  className?: string;
  interactive?: boolean;
}

const colorMap = {
  yellow: 'bg-neo-yellow text-black',
  red: 'bg-neo-red text-white',
  blue: 'bg-neo-blue text-white',
  green: 'bg-neo-green text-white',
  pink: 'bg-neo-pink text-black',
  orange: 'bg-neo-orange text-black',
  black: 'bg-black text-white',
};

const sizeMap = {
  sm: 'text-xs px-2.5 py-1',
  md: 'text-sm px-3.5 py-1.5',
  lg: 'text-base px-5 py-2 font-black',
};

export const Sticker: React.FC<StickerProps> = ({
  text,
  variant = 'yellow',
  rotation = -4,
  size = 'md',
  icon,
  className = '',
  interactive = true,
}) => {
  return (
    <motion.div
      initial={{ rotate: rotation }}
      whileHover={
        interactive
          ? {
              scale: 1.08,
              rotate: [rotation, rotation - 4, rotation + 4, rotation],
              transition: { duration: 0.3 },
            }
          : undefined
      }
      className={`
        inline-flex items-center gap-1.5
        border-3 border-black rounded-lg
        shadow-neo font-black uppercase tracking-wider
        select-none cursor-default
        ${colorMap[variant]}
        ${sizeMap[size]}
        ${className}
      `}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{text}</span>
    </motion.div>
  );
};
