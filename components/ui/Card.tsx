import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'white' | 'cream' | 'yellow' | 'red' | 'blue' | 'green' | 'black';
  hoverEffect?: boolean;
  shadow?: 'sm' | 'default' | 'md' | 'lg' | 'xl' | 'none';
  borderWidth?: '2' | '3';
  children: React.ReactNode;
  className?: string;
}

const backgroundStyles: Record<string, string> = {
  white: 'bg-white text-black',
  cream: 'bg-[#FFF8E7] text-black',
  yellow: 'bg-neo-yellow text-black',
  red: 'bg-neo-red text-white',
  blue: 'bg-neo-blue text-white',
  green: 'bg-neo-green text-white',
  black: 'bg-black text-white',
};

const shadowStyles: Record<string, string> = {
  sm: 'shadow-neo-sm',
  default: 'shadow-neo',
  md: 'shadow-neo-md',
  lg: 'shadow-neo-lg',
  xl: 'shadow-neo-xl',
  none: 'shadow-none',
};

export const Card: React.FC<CardProps> = ({
  variant = 'white',
  hoverEffect = false,
  shadow = 'default',
  borderWidth = '3',
  children,
  className = '',
  ...props
}) => {
  const borderClass = borderWidth === '3' ? 'border-3' : 'border-2';
  return (
    <div
      className={`
        ${borderClass} border-black rounded-lg
        ${backgroundStyles[variant]}
        ${shadowStyles[shadow]}
        ${
          hoverEffect
            ? 'transition-all duration-150 ease-out hover:-translate-x-1 hover:-translate-y-1 hover:shadow-neo-lg'
            : ''
        }
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};
