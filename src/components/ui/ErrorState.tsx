/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AlertTriangle, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

export interface AlertBannerProps {
  type?: 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  onDismiss?: () => void;
  className?: string;
}

export function AlertBanner({
  type = 'error',
  title,
  message,
  onDismiss,
  className = '',
}: AlertBannerProps) {
  const styles = {
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  }[type];

  const Icon = type === 'info' ? AlertCircle : AlertTriangle;

  return (
    <div
      role="alert"
      className={`p-4 rounded-xl border flex items-start gap-3 text-xs ${styles} ${className}`}
    >
      <Icon className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
      <div className="flex-1">
        {title && <h4 className="font-semibold mb-0.5">{title}</h4>}
        <p className="leading-relaxed">{message}</p>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-current opacity-70 hover:opacity-100 p-1 -mr-1"
          aria-label="Dismiss alert"
        >
          ×
        </button>
      )}
    </div>
  );
}

export interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export function ErrorState({
  title = 'Unable to Load Data',
  description = 'An unexpected error occurred while communicating with the service. Please try again.',
  onRetry,
  retryLabel = 'Retry',
}: ErrorStateProps) {
  return (
    <div className="py-12 px-6 text-center bg-white rounded-xl border border-red-200 flex flex-col items-center max-w-lg mx-auto my-6">
      <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-red-600 mb-4">
        <AlertTriangle className="w-6 h-6" aria-hidden="true" />
      </div>
      <h3 className="text-base font-semibold text-[#242424] mb-1.5">{title}</h3>
      <p className="text-xs text-[#6B7280] leading-relaxed mb-6 max-w-sm">
        {description}
      </p>
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
        >
          {retryLabel}
        </Button>
      )}
    </div>
  );
}
