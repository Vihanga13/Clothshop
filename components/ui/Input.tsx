import React, { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, rightIcon, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-black uppercase tracking-wider text-black flex items-center justify-between"
          >
            <span>{label}</span>
            {props.required && <span className="text-neo-red font-bold">*REQUIRED</span>}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 pointer-events-none text-black">
              {leftIcon}
            </div>
          )}

          <input
            id={inputId}
            ref={ref}
            className={`
              w-full bg-white text-black font-bold text-sm
              border-3 border-black rounded-lg
              shadow-neo
              px-4 py-3
              placeholder:text-gray-500 placeholder:font-medium
              transition-all duration-100
              focus:outline-none focus:-translate-x-0.5 focus:-translate-y-0.5 focus:shadow-neo-md
              disabled:bg-gray-100 disabled:cursor-not-allowed
              ${leftIcon ? 'pl-11' : ''}
              ${rightIcon ? 'pr-11' : ''}
              ${error ? 'border-neo-red bg-red-50' : ''}
              ${className}
            `}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3.5 text-black">
              {rightIcon}
            </div>
          )}
        </div>

        {error ? (
          <p className="text-xs font-black text-neo-red flex items-center gap-1 mt-0.5">
            <span>⚠</span> {error}
          </p>
        ) : helperText ? (
          <p className="text-xs font-semibold text-gray-700 mt-0.5">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
