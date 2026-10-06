import React from 'react';

export type BadgeVariant =
  | 'yellow'
  | 'red'
  | 'blue'
  | 'green'
  | 'pink'
  | 'orange'
  | 'black'
  | 'white';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: 'sm' | 'md' | 'lg';
  rotation?: 'none' | 'left' | 'right' | 'left-lg' | 'right-lg';
  className?: string;
  children: React.ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  yellow: 'bg-neo-yellow text-black',
  red: 'bg-neo-red text-white',
  blue: 'bg-neo-blue text-white',
  green: 'bg-neo-green text-white',
  pink: 'bg-neo-pink text-black',
  orange: 'bg-neo-orange text-black',
  black: 'bg-black text-white',
  white: 'bg-white text-black',
};

const sizeStyles: Record<string, string> = {
  sm: 'px-2 py-0.5 text-[10px] font-black',
  md: 'px-2.5 py-1 text-xs font-black',
  lg: 'px-3.5 py-1.5 text-sm font-black',
};

const rotationStyles: Record<string, string> = {
  none: 'rotate-0',
  left: '-rotate-2',
  right: 'rotate-2',
  'left-lg': '-rotate-6',
  'right-lg': 'rotate-6',
};

export const Badge: React.FC<BadgeProps> = ({
  variant = 'yellow',
  size = 'md',
  rotation = 'none',
  className = '',
  children,
  ...props
}) => {
  return (
    <span
      className={`
        inline-flex items-center justify-center
        border-2 border-black rounded-lg
        shadow-neo-sm uppercase tracking-tight
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${rotationStyles[rotation]}
        ${className}
      `}
      {...props}
    >
      {children}
    </span>
  );
};
