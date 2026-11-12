/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Button } from './Button';

export interface EmptyStateProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryAction?: React.ReactNode;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  secondaryAction,
}: EmptyStateProps) {
  return (
    <div className="py-14 px-6 text-center bg-white rounded-xl border border-[#E5E7EB] flex flex-col items-center max-w-lg mx-auto my-6">
      <div className="w-12 h-12 rounded-xl bg-[#FFF5EE] border border-[#FCD6C2] flex items-center justify-center text-[#F36B21] mb-4">
        <Icon className="w-6 h-6" aria-hidden="true" />
      </div>
      <h3 className="text-base font-semibold text-[#242424] mb-1.5">{title}</h3>
      <p className="text-xs text-[#6B7280] leading-relaxed mb-6 max-w-sm">
        {description}
      </p>
      {(actionLabel || secondaryAction) && (
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {actionLabel && onAction && (
            <Button variant="primary" size="sm" onClick={onAction}>
              {actionLabel}
            </Button>
          )}
          {secondaryAction}
        </div>
      )}
    </div>
  );
}
