/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useId } from 'react';
import { AlertCircle, ChevronDown } from 'lucide-react';

// --- Text Input ---
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, helperText, error, leftIcon, rightIcon, className = '', id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;

    return (
      <div className="w-full text-left">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold text-[#242424] mb-1.5 tracking-tight">
            {label}
            {props.required && <span className="text-[#F36B21] ml-0.5">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 text-[#6B7280] pointer-events-none flex items-center shrink-0">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={`w-full bg-white text-[#242424] text-sm rounded-lg border transition-colors duration-150 py-2.5 px-3.5 min-h-[42px] outline-none placeholder:text-[#9CA3AF] ${
              leftIcon ? 'pl-10' : ''
            } ${rightIcon ? 'pr-10' : ''} ${
              error
                ? 'border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                : 'border-[#D1D5DB] hover:border-[#9CA3AF] focus:border-[#F36B21] focus:ring-1 focus:ring-[#F36B21]'
            } ${className}`}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3.5 text-[#6B7280] flex items-center shrink-0">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <div className="flex items-center gap-1.5 mt-1 text-xs text-red-600">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}
        {helperText && !error && (
          <p className="mt-1 text-xs text-[#6B7280]">{helperText}</p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

// --- Select Component ---
export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  helperText?: string;
  error?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, helperText, error, className = '', id, ...props }, ref) => {
    const generatedId = useId();
    const selectId = id || generatedId;

    return (
      <div className="w-full text-left">
        {label && (
          <label htmlFor={selectId} className="block text-xs font-semibold text-[#242424] mb-1.5 tracking-tight">
            {label}
            {props.required && <span className="text-[#F36B21] ml-0.5">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          <select
            id={selectId}
            ref={ref}
            className={`w-full bg-white text-[#242424] text-sm rounded-lg border appearance-none transition-colors duration-150 py-2.5 pl-3.5 pr-10 min-h-[42px] outline-none ${
              error
                ? 'border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                : 'border-[#D1D5DB] hover:border-[#9CA3AF] focus:border-[#F36B21] focus:ring-1 focus:ring-[#F36B21]'
            } ${className}`}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3.5 text-[#6B7280] pointer-events-none flex items-center shrink-0">
            <ChevronDown className="w-4 h-4" aria-hidden="true" />
          </div>
        </div>
        {error && (
          <div className="flex items-center gap-1.5 mt-1 text-xs text-red-600">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}
        {helperText && !error && (
          <p className="mt-1 text-xs text-[#6B7280]">{helperText}</p>
        )}
      </div>
    );
  }
);
Select.displayName = 'Select';

// --- Textarea Component ---
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, helperText, error, className = '', id, ...props }, ref) => {
    const generatedId = useId();
    const textareaId = id || generatedId;

    return (
      <div className="w-full text-left">
        {label && (
          <label htmlFor={textareaId} className="block text-xs font-semibold text-[#242424] mb-1.5 tracking-tight">
            {label}
            {props.required && <span className="text-[#F36B21] ml-0.5">*</span>}
          </label>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          className={`w-full bg-white text-[#242424] text-sm rounded-lg border transition-colors duration-150 p-3 min-h-[100px] outline-none placeholder:text-[#9CA3AF] ${
            error
              ? 'border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500'
              : 'border-[#D1D5DB] hover:border-[#9CA3AF] focus:border-[#F36B21] focus:ring-1 focus:ring-[#F36B21]'
          } ${className}`}
          {...props}
        />
        {error && (
          <div className="flex items-center gap-1.5 mt-1 text-xs text-red-600">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}
        {helperText && !error && (
          <p className="mt-1 text-xs text-[#6B7280]">{helperText}</p>
        )}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

// --- Checkbox Component ---
export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: React.ReactNode;
  description?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, className = '', id, ...props }, ref) => {
    const generatedId = useId();
    const checkboxId = id || generatedId;

    return (
      <div className="flex items-start gap-3">
        <input
          id={checkboxId}
          type="checkbox"
          ref={ref}
          className={`w-4 h-4 mt-0.5 rounded border-[#D1D5DB] text-[#F36B21] focus:ring-[#F36B21] accent-[#F36B21] cursor-pointer ${className}`}
          {...props}
        />
        <label htmlFor={checkboxId} className="text-xs text-[#242424] cursor-pointer select-none">
          <div className="font-medium">{label}</div>
          {description && <div className="text-[#6B7280] mt-0.5">{description}</div>}
        </label>
      </div>
    );
  }
);
Checkbox.displayName = 'Checkbox';
