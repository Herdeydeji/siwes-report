/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PublicNavbar } from './PublicNavbar';
import { PublicFooter } from './PublicFooter';
import { StudentSidebar } from './StudentSidebar';
import { AdminSidebar } from './AdminSidebar';
import { MobileNav } from './MobileNav';
import { UserProfile, UserRole } from '../../lib/types';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Button } from '../ui/Button';

// --- Public Layout ---
export function PublicLayout({
  children,
  currentPath,
  onNavigate,
}: {
  children: React.ReactNode;
  currentPath: string;
  onNavigate: (path: string) => void;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] pb-12">
      <PublicNavbar currentPath={currentPath} onNavigate={onNavigate} />
      <main className="flex-1">{children}</main>
      <PublicFooter onNavigate={onNavigate} />
    </div>
  );
}

// --- Student Layout ---
export function StudentLayout({
  children,
  currentPath,
  onNavigate,
  user,
  onLogout,
}: {
  children: React.ReactNode;
  currentPath: string;
  onNavigate: (path: string) => void;
  user: UserProfile;
  onLogout?: () => void;
}) {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#F8F9FA] pb-24 lg:pb-12">
      {/* Desktop Sidebar */}
      <StudentSidebar
        currentPath={currentPath}
        onNavigate={onNavigate}
        user={user}
        onLogout={onLogout}
      />

      {/* Mobile Top and Bottom Nav */}
      <MobileNav
        currentPath={currentPath}
        onNavigate={onNavigate}
        user={user}
        role="student"
        onLogout={onLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl w-full mx-auto">
        {children}
      </main>
    </div>
  );
}

// --- Admin Layout ---
export function AdminLayout({
  children,
  currentPath,
  onNavigate,
  user,
  role,
  onLogout,
}: {
  children: React.ReactNode;
  currentPath: string;
  onNavigate: (path: string) => void;
  user: UserProfile;
  role: UserRole;
  onLogout?: () => void;
}) {
  // Access Control Guard
  if (role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA] p-6 pb-20">
        <div className="max-w-md w-full bg-white rounded-xl border border-red-200 p-8 text-center shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4 border border-red-100">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-[#242424] mb-2">
            Administrator Access Required
          </h2>
          <p className="text-xs text-[#6B7280] leading-relaxed mb-6">
            You do not have administrative privileges to view administrative governance routes. Actual access control is enforced on the server runtime.
          </p>
          <div className="flex justify-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate('/')}
              leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
            >
              Return Home
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => onNavigate('/dashboard')}
            >
              Go to Student Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#F8F9FA] pb-24 lg:pb-12">
      {/* Desktop Admin Sidebar */}
      <AdminSidebar
        currentPath={currentPath}
        onNavigate={onNavigate}
        user={user}
        onLogout={onLogout}
      />

      {/* Mobile Nav */}
      <MobileNav
        currentPath={currentPath}
        onNavigate={onNavigate}
        user={user}
        role="admin"
        onLogout={onLogout}
      />

      {/* Admin Content Area */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl w-full mx-auto">
        {children}
      </main>
    </div>
  );
}
