/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-150 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 select-none whitespace-nowrap shrink-0 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99]';

    const sizeStyles = {
      sm: 'text-xs px-3 py-1.5 min-h-[36px] gap-1.5',
      md: 'text-sm px-4 py-2 min-h-[40px] gap-2',
      lg: 'text-sm px-5 py-2.5 min-h-[44px] gap-2.5 font-medium',
    }[size];

    const variantStyles = {
      primary:
        'bg-[#F36B21] text-white hover:bg-[#DD5A15] shadow-xs hover:shadow-sm focus-visible:ring-[#F36B21]',
      secondary:
        'bg-[#242424] text-white hover:bg-[#383838] shadow-xs focus-visible:ring-[#242424]',
      outline:
        'border border-[#D1D5DB] bg-white text-[#242424] hover:bg-[#F9FAFB] hover:border-[#9CA3AF] focus-visible:ring-[#242424]',
      ghost:
        'text-[#242424] hover:bg-[#F3F4F6] focus-visible:ring-[#242424]',
      danger:
        'border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 focus-visible:ring-red-500',
    }[variant];

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin shrink-0" aria-hidden="true" />
            <span>{children}</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}
            <span>{children}</span>
            {rightIcon && <span className="shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
