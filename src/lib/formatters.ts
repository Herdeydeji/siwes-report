/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SIWESDuration, ReportStatus } from './types';

/**
 * Format Nigerian Naira currency (NGN) without decimals for cleaner student display
 */
export function formatCurrencyNGN(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Formats SIWES duration into standard ITF academic representation
 */
export function formatSIWESDuration(duration: SIWESDuration): string {
  switch (duration) {
    case '3_months':
      return '3 Months (12 Weeks)';
    case '6_months':
      return '6 Months (24 Weeks)';
    case '12_months':
      return '1 Year (48 Weeks)';
    default:
      return duration;
  }
}

/**
 * Get the target week count for a given SIWES duration
 */
export function getDurationTotalWeeks(duration: SIWESDuration): number {
  switch (duration) {
    case '3_months':
      return 12;
    case '6_months':
      return 24;
    case '12_months':
      return 48;
    default:
      return 24;
  }
}

/**
 * Validates Nigerian matriculation / registration number format (e.g. 19/0445, FUTA/CSC/20/1234, 2021/ENG/0192)
 */
export function isValidMatricNumber(matric: string): boolean {
  if (!matric || matric.trim().length < 4) return false;
  const clean = matric.trim();
  // Must contain alphanumeric characters and common separators (/ or -)
  const pattern = /^[A-Za-z0-9\/\-]{4,25}$/;
  return pattern.test(clean);
}

/**
 * Returns human-readable label and style configuration for report statuses
 */
export function getStatusMeta(status: ReportStatus): { label: string; tone: 'neutral' | 'info' | 'warning' | 'success' } {
  switch (status) {
    case 'draft':
      return { label: 'Draft', tone: 'neutral' };
    case 'in_review':
      return { label: 'In Review', tone: 'info' };
    case 'changes_requested':
      return { label: 'Changes Requested', tone: 'warning' };
    case 'approved':
      return { label: 'Approved', tone: 'success' };
    case 'exported':
      return { label: 'Exported', tone: 'success' };
    default:
      return { label: status, tone: 'neutral' };
  }
}
