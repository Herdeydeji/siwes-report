/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  FileCheck, 
  Building2, 
  BookOpen, 
  CreditCard, 
  Layers, 
  Activity, 
  Sliders,
  ShieldAlert,
  LogOut
} from 'lucide-react';
import { UserProfile } from '../../lib/types';

interface AdminSidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  user: UserProfile;
  onLogout?: () => void;
}

export function AdminSidebar({
  currentPath,
  onNavigate,
  user,
  onLogout,
}: AdminSidebarProps) {
  const adminNavItems = [
    { label: 'Overview', path: '/admin', icon: LayoutDashboard },
    { label: 'Users', path: '/admin/users', icon: Users },
    { label: 'Report Oversight', path: '/admin/reports', icon: FileCheck },
    { label: 'Institutions', path: '/admin/institutions', icon: Building2 },
    { label: 'Report Templates', path: '/admin/templates', icon: BookOpen },
    { label: 'Payments Ledger', path: '/admin/payments', icon: CreditCard },
    { label: 'Subscription Plans', path: '/admin/plans', icon: Layers },
    { label: 'Activity Logs', path: '/admin/activity', icon: Activity },
    { label: 'System Settings', path: '/admin/settings', icon: Sliders },
  ];

  return (
    <aside className="hidden lg:flex lg:flex-col w-64 bg-[#242424] text-white h-screen sticky top-0 shrink-0 z-30 select-none">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-neutral-700 gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-[#F36B21] flex items-center justify-center text-white font-bold text-sm">
          S
        </div>
        <div>
          <span className="text-sm font-bold text-white block leading-tight">
            SIWES Studio
          </span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-[10px] text-[#F36B21] font-semibold tracking-wider uppercase">
              Administrator
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 py-5 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
          Management
        </div>
        {adminNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path;

          return (
            <button
              key={item.path}
              onClick={() => onNavigate(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer text-left ${
                isActive
                  ? 'bg-neutral-800 text-[#F36B21] font-semibold border-l-2 border-[#F36B21]'
                  : 'text-neutral-300 hover:bg-neutral-800 hover:text-white'
              }`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 ${
                  isActive ? 'text-[#F36B21]' : 'text-neutral-400'
                }`}
                aria-hidden="true"
              />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Admin User Footer */}
      <div className="p-4 border-t border-neutral-700 bg-neutral-900/50">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-white font-semibold text-xs shrink-0">
            {user.fullName.slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-white truncate">
              {user.fullName}
            </p>
            <div className="flex items-center gap-1 text-[10px] text-neutral-400">
              <ShieldAlert className="w-3 h-3 text-[#F36B21]" />
              <span className="truncate">System Admin</span>
            </div>
          </div>
        </div>

        {onLogout && (
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-md text-xs text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors border border-neutral-700"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        )}
      </div>
    </aside>
  );
}
