/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  PlusCircle, 
  Settings, 
  LogOut,
  GraduationCap
} from 'lucide-react';
import { UserProfile } from '../../lib/types';

interface StudentSidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  user: UserProfile;
  onLogout?: () => void;
}

export function StudentSidebar({
  currentPath,
  onNavigate,
  user,
  onLogout,
}: StudentSidebarProps) {
  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'My Reports', path: '/reports', icon: FileText },
    { label: 'New Report', path: '/reports/new', icon: PlusCircle },
    { label: 'Account Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside className="hidden lg:flex lg:flex-col w-64 bg-white border-r border-[#E5E7EB] h-screen sticky top-0 shrink-0 z-30 select-none">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-[#E5E7EB] gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-[#F36B21] flex items-center justify-center text-white font-bold text-sm shadow-xs">
          S
        </div>
        <div>
          <span className="text-sm font-bold text-[#242424] block leading-tight">
            SIWES Studio
          </span>
          <span className="text-[10px] text-[#6B7280] font-medium tracking-wide uppercase">
            Student Portal
          </span>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">
          Workspace
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            currentPath === item.path ||
            (item.path === '/reports' && currentPath.startsWith('/reports/rep'));

          return (
            <button
              key={item.path}
              onClick={() => onNavigate(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors cursor-pointer text-left ${
                isActive
                  ? 'bg-[#FFF5EE] text-[#F36B21] font-semibold'
                  : 'text-[#525252] hover:bg-[#F9FAFB] hover:text-[#242424]'
              }`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 ${
                  isActive ? 'text-[#F36B21]' : 'text-[#6B7280]'
                }`}
                aria-hidden="true"
              />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* User & Institution Profile Summary */}
      <div className="p-4 border-t border-[#E5E7EB] bg-[#FAFAFA]">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-[#E5E7EB] border border-[#D1D5DB] flex items-center justify-center text-[#242424] font-semibold text-xs shrink-0">
            {user.fullName.slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-[#242424] truncate">
              {user.fullName}
            </p>
            <p className="text-[11px] text-[#6B7280] truncate font-mono">
              {user.matricNumber || 'Student'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-[#6B7280] mb-3 px-1">
          <GraduationCap className="w-3.5 h-3.5 text-[#F36B21] shrink-0" />
          <span className="truncate">{user.institution || 'Nigerian University'}</span>
        </div>

        {onLogout && (
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-md text-xs text-[#6B7280] hover:text-red-700 hover:bg-red-50 transition-colors border border-[#E5E7EB]"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        )}
      </div>
    </aside>
  );
}
