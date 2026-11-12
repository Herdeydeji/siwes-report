/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserRole } from '../../lib/types';
import { Shield, User, Globe, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';

interface RoleSimulatorBarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  currentPath: string;
  onNavigate: (path: string) => void;
}

export function RoleSimulatorBar({
  currentRole,
  onRoleChange,
  currentPath,
  onNavigate,
}: RoleSimulatorBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // In production builds, never render the simulator bar
  if (!import.meta.env.DEV) {
    return null;
  }

  const quickRoutes = [
    { label: 'Landing (/)', path: '/' },
    { label: 'Login (/login)', path: '/login' },
    { label: 'Register (/register)', path: '/register' },
    { label: 'Reset Password (/forgot-password)', path: '/forgot-password' },
    { label: 'Pricing (/pricing)', path: '/pricing' },
    { label: 'Verify Email (/verify-email)', path: '/verify-email', reqRole: 'student' as UserRole },
    { label: 'Onboarding (/onboarding)', path: '/onboarding', reqRole: 'student' as UserRole },
    { label: 'Student Dashboard (/dashboard)', path: '/dashboard', reqRole: 'student' as UserRole },
    { label: 'My Reports (/reports)', path: '/reports', reqRole: 'student' as UserRole },
    { label: 'New Report (/reports/new)', path: '/reports/new', reqRole: 'student' as UserRole },
    { label: 'Report Detail (/reports/rep-101)', path: '/reports/rep-101', reqRole: 'student' as UserRole },
    { label: 'Student Settings (/settings)', path: '/settings', reqRole: 'student' as UserRole },
    { label: 'Admin Overview (/admin)', path: '/admin', reqRole: 'admin' as UserRole },
    { label: 'Admin Users (/admin/users)', path: '/admin/users', reqRole: 'admin' as UserRole },
    { label: 'Admin Reports (/admin/reports)', path: '/admin/reports', reqRole: 'admin' as UserRole },
    { label: 'Admin Institutions (/admin/institutions)', path: '/admin/institutions', reqRole: 'admin' as UserRole },
    { label: 'Admin Templates (/admin/templates)', path: '/admin/templates', reqRole: 'admin' as UserRole },
    { label: 'Admin Payments (/admin/payments)', path: '/admin/payments', reqRole: 'admin' as UserRole },
    { label: 'Admin Plans (/admin/plans)', path: '/admin/plans', reqRole: 'admin' as UserRole },
    { label: 'Admin Activity (/admin/activity)', path: '/admin/activity', reqRole: 'admin' as UserRole },
    { label: 'Admin Settings (/admin/settings)', path: '/admin/settings', reqRole: 'admin' as UserRole },
  ];

  return (
    <aside
      aria-label="Development Route Inspector"
      className="fixed bottom-0 left-0 right-0 z-50 bg-[#242424] text-white border-t border-neutral-700 shadow-2xl text-xs"
    >
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-semibold text-[#F36B21] tracking-wider uppercase whitespace-nowrap">
            DEV INSPECTOR (Preview Only)
          </span>
          <span className="hidden sm:inline text-neutral-400 text-[11px]">
            Preview Role:
          </span>
          <div className="flex items-center bg-neutral-800 p-0.5 rounded-lg border border-neutral-700">
            <button
              onClick={() => onRoleChange('guest')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                currentRole === 'guest'
                  ? 'bg-[#F36B21] text-white font-medium'
                  : 'text-neutral-300 hover:text-white'
              }`}
            >
              <Globe className="w-3 h-3" />
              <span>Public</span>
            </button>
            <button
              onClick={() => onRoleChange('student')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                currentRole === 'student'
                  ? 'bg-[#F36B21] text-white font-medium'
                  : 'text-neutral-300 hover:text-white'
              }`}
            >
              <User className="w-3 h-3" />
              <span>Student</span>
            </button>
            <button
              onClick={() => onRoleChange('admin')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                currentRole === 'admin'
                  ? 'bg-[#F36B21] text-white font-medium'
                  : 'text-neutral-300 hover:text-white'
              }`}
            >
              <Shield className="w-3 h-3" />
              <span>Admin</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden md:inline font-mono text-[11px] text-neutral-400 bg-neutral-800 px-2 py-0.5 rounded border border-neutral-700">
            {currentPath}
          </span>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-[11px] text-neutral-300 hover:text-white px-2 py-1 rounded hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <span>All Routes ({quickRoutes.length})</span>
            {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-neutral-700 bg-neutral-900 px-4 py-3 max-h-48 overflow-y-auto">
          <div className="mb-2 text-[10px] text-neutral-400 flex items-center gap-1.5">
            <AlertCircle className="w-3 h-3 text-amber-500 shrink-0" />
            <span>Development UI inspection tool. Actual database permissions are strictly governed by Cloud Firestore security rules.</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-1.5">
            {quickRoutes.map((r) => {
              const isCurrent = currentPath === r.path;
              return (
                <button
                  key={r.path}
                  onClick={() => {
                    if (r.reqRole && currentRole !== r.reqRole && currentRole !== 'admin') {
                      onRoleChange(r.reqRole);
                    }
                    onNavigate(r.path);
                    setIsExpanded(false);
                  }}
                  className={`text-left text-[11px] px-2 py-1.5 rounded truncate transition-colors ${
                    isCurrent
                      ? 'bg-[#F36B21] text-white font-semibold'
                      : 'text-neutral-300 hover:bg-neutral-800 hover:text-white'
                  }`}
                  title={r.label}
                >
                  {r.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </aside>
  );
}
