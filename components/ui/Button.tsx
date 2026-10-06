'use client';

import React from 'react';
import Link from 'next/link';

export type ButtonVariant =
  | 'yellow'
  | 'red'
  | 'blue'
  | 'green'
  | 'black'
  | 'white'
  | 'pink'
  | 'outline';

export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  isExternal?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  className?: string;
}

const variantStyles: Record<ButtonVariant, string> = {
  yellow: 'bg-neo-yellow text-black hover:bg-[#FFE033]',
  red: 'bg-neo-red text-white hover:bg-[#FF4D42]',
  blue: 'bg-neo-blue text-white hover:bg-[#3D62F5]',
  green: 'bg-neo-green text-white hover:bg-[#00C98D]',
  black: 'bg-black text-white hover:bg-[#1A1A1A]',
  white: 'bg-white text-black hover:bg-[#F4F4F4]',
  pink: 'bg-neo-pink text-black hover:bg-[#FF7BBF]',
  outline: 'bg-cream text-black hover:bg-white',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs font-bold gap-1.5',
  md: 'px-5 py-2.5 text-sm font-extrabold gap-2',
  lg: 'px-7 py-3.5 text-base font-extrabold gap-2.5',
  xl: 'px-8 py-4 text-lg font-black gap-3 tracking-wide',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'yellow',
  size = 'md',
  href,
  isExternal = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = '',
  children,
  disabled,
  ...props
}) => {
  const baseClasses = `
    inline-flex items-center justify-center
    border-3 border-black
    rounded-lg
    shadow-neo
    transition-all duration-100 ease-in-out
    uppercase tracking-tight select-none
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    ${fullWidth ? 'w-full' : ''}
    ${
      disabled
        ? 'opacity-50 cursor-not-allowed shadow-neo-sm translate-x-0 translate-y-0'
        : 'hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-neo-md active:translate-x-1 active:translate-y-1 active:shadow-neo-none cursor-pointer'
    }
    ${className}
  `.trim();

  if (href) {
    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={baseClasses}
        >
          {leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
        </a>
      );
    }
    return (
      <Link href={href} className={baseClasses}>
        {leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
        <span>{children}</span>
        {rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
      </Link>
    );
  }

  return (
    <button className={baseClasses} disabled={disabled} {...props}>
      {leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
      <span>{children}</span>
      {rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
    </button>
  );
};
