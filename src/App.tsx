/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { matchRoute } from './lib/router';
import { UserRole, SIWESReportSummary, UserProfile } from './lib/types';
import { ToastProvider } from './components/ui/NotificationToast';
import { AuthProvider, useAuth } from './lib/firebase/AuthContext';
import { PublicLayout, StudentLayout, AdminLayout } from './components/layout/Layouts';
import { RoleSimulatorBar } from './components/layout/RoleSimulatorBar';
import { PageLoading } from './components/ui/LoadingState';

// Public Views
import { LandingView } from './views/public/LandingView';
import { LoginView } from './views/public/LoginView';
import { RegisterView } from './views/public/RegisterView';
import { PricingView } from './views/public/PricingView';
import { ForgotPasswordView } from './views/public/ForgotPasswordView';

// Student Auth & Onboarding Views
import { VerifyEmailView } from './views/student/VerifyEmailView';
import { StudentOnboardingView } from './views/student/StudentOnboardingView';

// Student Workspace Views
import { StudentDashboardView } from './views/student/StudentDashboardView';
import { ReportsListView } from './views/student/ReportsListView';
import { NewReportWizardView } from './views/student/NewReportWizardView';
import { ReportDetailView } from './views/student/ReportDetailView';
import { StudentSettingsView } from './views/student/StudentSettingsView';

// Admin Views
import {
  AdminOverviewView,
  AdminUsersView,
  AdminReportsView,
  AdminInstitutionsView,
  AdminTemplatesView,
  AdminPaymentsView,
  AdminPlansView,
  AdminActivityView,
  AdminSettingsView,
} from './views/admin/AdminViews';

import { NotFoundView } from './views/NotFoundView';

function AppContent() {
  const {
    currentUser,
    userProfile,
    isLoading: isAuthLoading,
    isAuthReady,
    isEmailVerified,
    onboardingCompleted,
    logout,
  } = useAuth();

  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (import.meta.env.DEV && params.get('preview')) {
        return `/${params.get('preview')}`;
      }
      if (params.get('autostart') === '1') {
        return '/dashboard';
      }
      return window.location.pathname || '/';
    }
    return '/';
  });

  const [simulatedRole, setSimulatedRole] = useState<UserRole>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (import.meta.env.DEV && params.get('preview')) {
        return 'student';
      }
      if (params.get('autostart') === '1') {
        return 'student';
      }
    }
    return 'guest';
  });
  const [reports, setReports] = useState<SIWESReportSummary[]>([]);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    if (path !== currentPath) {
      window.history.pushState({}, '', path);
      setCurrentPath(path);
      window.scrollTo(0, 0);
    }
  };

  // Automated Authentication & Onboarding Route Redirection (Section 10)
  useEffect(() => {
    if (!isAuthReady) return;

    const publicAuthPaths = ['/login', '/register', '/forgot-password'];
    const studentProtectedPaths = ['/dashboard', '/reports', '/settings', '/onboarding', '/verify-email'];

    // 1. If authenticated user arrives on login/register:
    if (currentUser && publicAuthPaths.includes(currentPath)) {
      if (!isEmailVerified) {
        navigate('/verify-email');
      } else if (!onboardingCompleted) {
        navigate('/onboarding');
      } else {
        navigate('/dashboard');
      }
      return;
    }

    // 2. If unauthenticated user tries to access protected student paths without dev simulation:
    if (!currentUser && simulatedRole === 'guest' && studentProtectedPaths.some((p) => currentPath.startsWith(p))) {
      navigate('/login');
      return;
    }

    // 3. If authenticated user is NOT verified yet, and is trying to access protected workspace:
    if (currentUser && !isEmailVerified) {
      if (currentPath !== '/verify-email' && !publicAuthPaths.includes(currentPath) && currentPath !== '/') {
        navigate('/verify-email');
        return;
      }
    }

    // 4. If authenticated & verified user has NOT completed onboarding yet:
    if (currentUser && isEmailVerified && !onboardingCompleted) {
      if (currentPath !== '/onboarding' && !publicAuthPaths.includes(currentPath) && currentPath !== '/') {
        navigate('/onboarding');
        return;
      }
    }

    // 5. If verified user with completed onboarding tries to go back to /verify-email or /onboarding:
    if (currentUser && isEmailVerified && onboardingCompleted) {
      if (currentPath === '/verify-email' || currentPath === '/onboarding') {
        navigate('/dashboard');
        return;
      }
    }
  }, [currentUser, isAuthReady, isEmailVerified, onboardingCompleted, currentPath]);

  // Derive active user identity
  const activeUserProfile: UserProfile = userProfile || {
    uid: currentUser?.uid || 'guest-uid',
    fullName: currentUser?.displayName || 'Student User',
    email: currentUser?.email || '',
    role: 'student',
    emailVerified: Boolean(currentUser?.emailVerified),
    onboardingCompleted: false,
  };

  // Determine actual role
  const actualRole: UserRole = currentUser
    ? activeUserProfile.role === 'admin'
      ? 'admin'
      : 'student'
    : simulatedRole;

  const handleRoleChange = (role: UserRole) => {
    setSimulatedRole(role);
    if (role === 'guest' && (currentPath.startsWith('/dashboard') || currentPath.startsWith('/reports') || currentPath.startsWith('/admin'))) {
      navigate('/');
    } else if (role === 'student' && currentPath.startsWith('/admin')) {
      navigate('/dashboard');
    } else if (role === 'admin' && !currentPath.startsWith('/admin')) {
      navigate('/admin');
    }
  };

  const handleCreateReport = (newReport: SIWESReportSummary) => {
    setReports((prev) => [newReport, ...prev]);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error('Logout error:', err);
      navigate('/');
    }
  };

  // Route matching
  const matched = matchRoute(currentPath);
  const route = matched.route;

  // Global loading state while checking initial Firebase auth token
  if (!isAuthReady && isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA]">
        <PageLoading message="Connecting to SIWES Studio..." />
      </div>
    );
  }

  // View resolution
  const renderView = () => {
    if (!route) {
      return <NotFoundView onNavigate={navigate} />;
    }

    switch (route.path) {
      // Public Routes
      case '/':
        return <LandingView onNavigate={navigate} />;
      case '/login':
        return <LoginView onNavigate={navigate} />;
      case '/register':
        return <RegisterView onNavigate={navigate} />;
      case '/pricing':
        return <PricingView onNavigate={navigate} />;
      case '/forgot-password':
        return <ForgotPasswordView onNavigate={navigate} />;

      // Student Auth & Onboarding Routes
      case '/verify-email':
        return <VerifyEmailView onNavigate={navigate} />;
      case '/onboarding':
        return <StudentOnboardingView onNavigate={navigate} />;

      // Student Workspace Routes
      case '/dashboard':
        return (
          <StudentDashboardView
            user={activeUserProfile}
            onNavigate={navigate}
            reports={reports}
          />
        );
      case '/reports':
        return <ReportsListView reports={reports} onNavigate={navigate} />;
      case '/reports/new':
        return (
          <NewReportWizardView
            user={activeUserProfile}
            onNavigate={navigate}
            onCreateReport={handleCreateReport}
          />
        );
      case '/reports/:reportId':
        return (
          <ReportDetailView
            reportId={matched.params.reportId || 'rep-101'}
            report={reports.find((r) => r.id === matched.params.reportId)}
            onNavigate={navigate}
          />
        );
      case '/settings':
        return <StudentSettingsView onNavigate={navigate} />;

      // Administration Routes
      case '/admin':
        return <AdminOverviewView onNavigate={navigate} />;
      case '/admin/users':
        return <AdminUsersView />;
      case '/admin/reports':
        return <AdminReportsView />;
      case '/admin/institutions':
        return <AdminInstitutionsView />;
      case '/admin/templates':
        return <AdminTemplatesView />;
      case '/admin/payments':
        return <AdminPaymentsView />;
      case '/admin/plans':
        return <AdminPlansView />;
      case '/admin/activity':
        return <AdminActivityView />;
      case '/admin/settings':
        return <AdminSettingsView />;

      default:
        return <NotFoundView onNavigate={navigate} />;
    }
  };

  const layoutGroup = route?.group || 'public';

  return (
    <>
      {layoutGroup === 'public' && (
        <PublicLayout currentPath={currentPath} onNavigate={navigate}>
          {renderView()}
        </PublicLayout>
      )}

      {layoutGroup === 'student' && (
        <StudentLayout
          currentPath={currentPath}
          onNavigate={navigate}
          user={activeUserProfile}
          onLogout={handleLogout}
        >
          {renderView()}
        </StudentLayout>
      )}

      {layoutGroup === 'admin' && (
        <AdminLayout
          currentPath={currentPath}
          onNavigate={navigate}
          user={activeUserProfile}
          role={actualRole}
          onLogout={handleLogout}
        >
          {renderView()}
        </AdminLayout>
      )}

      {/* Development UI Route Inspector */}
      <RoleSimulatorBar
        currentRole={actualRole}
        onRoleChange={handleRoleChange}
        currentPath={currentPath}
        onNavigate={navigate}
      />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </AuthProvider>
  );
}
