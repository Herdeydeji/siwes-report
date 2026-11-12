/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  FileEdit, 
  Download, 
  ShieldCheck, 
  UserCheck, 
  XCircle 
} from 'lucide-react';
import { ReportStatus } from '../../lib/types';

export type GeneralStatus = 
  | ReportStatus 
  | 'active' 
  | 'pending' 
  | 'suspended' 
  | 'paid' 
  | 'failed';

interface StatusConfig {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  textColor: string;
  bgColor: string;
  borderColor: string;
}

const STATUS_CONFIGS: Record<GeneralStatus, StatusConfig> = {
  draft: {
    label: 'Draft',
    icon: FileEdit,
    textColor: 'text-[#525252]',
    bgColor: 'bg-[#F3F4F6]',
    borderColor: 'border-[#E5E7EB]',
  },
  in_review: {
    label: 'In Review',
    icon: Clock,
    textColor: 'text-amber-800',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
  },
  changes_requested: {
    label: 'Changes Requested',
    icon: AlertCircle,
    textColor: 'text-orange-800',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
  },
  approved: {
    label: 'Approved',
    icon: CheckCircle2,
    textColor: 'text-emerald-800',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
  },
  exported: {
    label: 'Exported',
    icon: Download,
    textColor: 'text-[#F36B21]',
    bgColor: 'bg-[#FFF5EE]',
    borderColor: 'border-[#FCD6C2]',
  },
  active: {
    label: 'Active',
    icon: UserCheck,
    textColor: 'text-emerald-800',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
  },
  pending: {
    label: 'Pending',
    icon: Clock,
    textColor: 'text-amber-800',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
  },
  suspended: {
    label: 'Suspended',
    icon: XCircle,
    textColor: 'text-red-800',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
  },
  paid: {
    label: 'Paid',
    icon: ShieldCheck,
    textColor: 'text-emerald-800',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
  },
  failed: {
    label: 'Failed',
    icon: AlertCircle,
    textColor: 'text-red-800',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
  },
};

export interface StatusIndicatorProps {
  status: GeneralStatus;
  showIcon?: boolean;
  className?: string;
}

export function StatusIndicator({
  status,
  showIcon = true,
  className = '',
}: StatusIndicatorProps) {
  const config = STATUS_CONFIGS[status] || {
    label: status,
    icon: Clock,
    textColor: 'text-[#525252]',
    bgColor: 'bg-[#F3F4F6]',
    borderColor: 'border-[#E5E7EB]',
  };

  const IconComponent = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md border ${config.bgColor} ${config.textColor} ${config.borderColor} select-none whitespace-nowrap shrink-0 ${className}`}
    >
      {showIcon && <IconComponent className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />}
      <span>{config.label}</span>
    </span>
  );
}
