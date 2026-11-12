/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  PlusCircle, 
  Settings, 
  Menu, 
  X, 
  LogOut,
  ShieldCheck
} from 'lucide-react';
import { UserProfile, UserRole } from '../../lib/types';

interface MobileNavProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  user: UserProfile;
  role: UserRole;
  onLogout?: () => void;
}

export function MobileNav({
  currentPath,
  onNavigate,
  user,
  role,
  onLogout,
}: MobileNavProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const studentTabs = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Reports', path: '/reports', icon: FileText },
    { label: 'New', path: '/reports/new', icon: PlusCircle },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  const adminTabs = [
    { label: 'Admin', path: '/admin', icon: LayoutDashboard },
    { label: 'Users', path: '/admin/users', icon: ShieldCheck },
    { label: 'Reports', path: '/admin/reports', icon: FileText },
    { label: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  const tabs = role === 'admin' ? adminTabs : studentTabs;

  return (
    <>
      {/* Mobile Top App Bar */}
      <div className="lg:hidden sticky top-0 z-40 bg-white border-b border-[#E5E7EB] px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#F36B21] flex items-center justify-center text-white font-bold text-xs">
            S
          </div>
          <span className="text-sm font-bold text-[#242424]">SIWES Studio</span>
          {role === 'admin' && (
            <span className="text-[10px] bg-neutral-900 text-white px-1.5 py-0.5 rounded font-medium">
              Admin
            </span>
          )}
        </div>

        <button
          onClick={() => setDrawerOpen(!drawerOpen)}
          className="p-2 rounded-lg text-[#525252] hover:text-[#242424] hover:bg-[#F3F4F6] min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Open mobile menu"
        >
          {drawerOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Slide-over Drawer for secondary options and profile */}
      {drawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/40"
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />
          <div className="relative ml-auto w-72 bg-white h-full shadow-2xl flex flex-col p-5">
            <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB]">
              <span className="text-sm font-bold text-[#242424]">Account</span>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-1 rounded-lg text-[#6B7280] hover:text-[#242424]"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 border-b border-[#F3F4F6]">
              <p className="text-sm font-semibold text-[#242424]">{user.fullName}</p>
              <p className="text-xs text-[#6B7280] truncate">{user.email}</p>
              {user.institution && (
                <p className="text-xs text-[#F36B21] mt-1 font-medium">{user.institution}</p>
              )}
            </div>

            <div className="flex-1 py-4 space-y-1 overflow-y-auto">
              {role === 'admin' ? (
                <>
                  <div className="text-[10px] font-semibold text-[#9CA3AF] uppercase mb-2">
                    Administration
                  </div>
                  {[
                    { label: 'Overview', path: '/admin' },
                    { label: 'Users', path: '/admin/users' },
                    { label: 'Report Oversight', path: '/admin/reports' },
                    { label: 'Institutions', path: '/admin/institutions' },
                    { label: 'Report Templates', path: '/admin/templates' },
                    { label: 'Payments Ledger', path: '/admin/payments' },
                    { label: 'Subscription Plans', path: '/admin/plans' },
                    { label: 'Activity Logs', path: '/admin/activity' },
                    { label: 'System Settings', path: '/admin/settings' },
                  ].map((item) => (
                    <button
                      key={item.path}
                      onClick={() => {
                        setDrawerOpen(false);
                        onNavigate(item.path);
                      }}
                      className="w-full text-left py-2 px-3 rounded-lg text-xs font-medium text-[#525252] hover:bg-[#F9FAFB] hover:text-[#242424]"
                    >
                      {item.label}
                    </button>
                  ))}
                </>
              ) : (
                <>
                  <div className="text-[10px] font-semibold text-[#9CA3AF] uppercase mb-2">
                    Student Navigation
                  </div>
                  {studentTabs.map((item) => (
                    <button
                      key={item.path}
                      onClick={() => {
                        setDrawerOpen(false);
                        onNavigate(item.path);
                      }}
                      className="w-full text-left py-2 px-3 rounded-lg text-xs font-medium text-[#525252] hover:bg-[#FFF5EE] hover:text-[#F36B21]"
                    >
                      {item.label}
                    </button>
                  ))}
                </>
              )}
            </div>

            {onLogout && (
              <div className="pt-4 border-t border-[#E5E7EB]">
                <button
                  onClick={() => {
                    setDrawerOpen(false);
                    onLogout();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 min-h-[44px]"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar (fixed to bottom) */}
      <nav
        aria-label="Mobile Navigation"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E5E7EB] px-2 py-1 shadow-lg"
      >
        <div className="grid grid-cols-4 gap-1 max-w-md mx-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive =
              currentPath === tab.path ||
              (tab.path === '/reports' && currentPath.startsWith('/reports/rep'));

            return (
              <button
                key={tab.path}
                onClick={() => onNavigate(tab.path)}
                className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-lg min-h-[48px] transition-colors cursor-pointer ${
                  isActive ? 'text-[#F36B21]' : 'text-[#6B7280] hover:text-[#242424]'
                }`}
              >
                <Icon className="w-5 h-5 mb-0.5" aria-hidden="true" />
                <span className={`text-[10px] leading-tight ${isActive ? 'font-semibold' : 'font-normal'}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
