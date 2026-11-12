/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UserRole } from './types';

export interface RouteDefinition {
  path: string;
  group: 'public' | 'student' | 'admin';
  title: string;
  requiredRole?: UserRole;
  isExact?: boolean;
}

export const APP_ROUTES: RouteDefinition[] = [
  // Public Routes
  { path: '/', group: 'public', title: 'Home', isExact: true },
  { path: '/login', group: 'public', title: 'Sign In', isExact: true },
  { path: '/register', group: 'public', title: 'Register', isExact: true },
  { path: '/pricing', group: 'public', title: 'Pricing & Plans', isExact: true },
  { path: '/forgot-password', group: 'public', title: 'Reset Password', isExact: true },

  // Student Onboarding & Auth Routes
  { path: '/verify-email', group: 'student', title: 'Email Verification', requiredRole: 'student', isExact: true },
  { path: '/onboarding', group: 'student', title: 'Student Onboarding', requiredRole: 'student', isExact: true },

  // Student Workspace Routes
  { path: '/dashboard', group: 'student', title: 'Dashboard', requiredRole: 'student', isExact: true },
  { path: '/reports', group: 'student', title: 'My Reports', requiredRole: 'student', isExact: true },
  { path: '/reports/new', group: 'student', title: 'New Report', requiredRole: 'student', isExact: true },
  { path: '/reports/:reportId', group: 'student', title: 'Report Workspace', requiredRole: 'student', isExact: false },
  { path: '/settings', group: 'student', title: 'Account Settings', requiredRole: 'student', isExact: true },

  // Administration Routes
  { path: '/admin', group: 'admin', title: 'Admin Overview', requiredRole: 'admin', isExact: true },
  { path: '/admin/users', group: 'admin', title: 'User Management', requiredRole: 'admin', isExact: true },
  { path: '/admin/reports', group: 'admin', title: 'Report Oversight', requiredRole: 'admin', isExact: true },
  { path: '/admin/institutions', group: 'admin', title: 'Institutions', requiredRole: 'admin', isExact: true },
  { path: '/admin/templates', group: 'admin', title: 'Report Templates', requiredRole: 'admin', isExact: true },
  { path: '/admin/payments', group: 'admin', title: 'Payments Ledger', requiredRole: 'admin', isExact: true },
  { path: '/admin/plans', group: 'admin', title: 'Subscription Plans', requiredRole: 'admin', isExact: true },
  { path: '/admin/activity', group: 'admin', title: 'Audit Activity', requiredRole: 'admin', isExact: true },
  { path: '/admin/settings', group: 'admin', title: 'System Settings', requiredRole: 'admin', isExact: true },
];

export interface MatchedRoute {
  route: RouteDefinition | null;
  params: Record<string, string>;
  pathname: string;
}

/**
 * Matches a URL pathname against configured routes, extracting dynamic parameters like :reportId
 */
export function matchRoute(pathname: string, routes: RouteDefinition[] = APP_ROUTES): MatchedRoute {
  const cleanPath = pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;

  for (const def of routes) {
    if (def.path === cleanPath) {
      return { route: def, params: {}, pathname: cleanPath };
    }
  }

  const pathParts = cleanPath.split('/').filter(Boolean);

  for (const def of routes) {
    if (!def.path.includes(':')) continue;

    const patternParts = def.path.split('/').filter(Boolean);
    if (patternParts.length !== pathParts.length) continue;

    const params: Record<string, string> = {};
    let matches = true;

    for (let i = 0; i < patternParts.length; i++) {
      const pPart = patternParts[i];
      const actualPart = pathParts[i];

      if (pPart.startsWith(':')) {
        const paramKey = pPart.slice(1);
        params[paramKey] = actualPart;
      } else if (pPart !== actualPart) {
        matches = false;
        break;
      }
    }

    if (matches) {
      return { route: def, params, pathname: cleanPath };
    }
  }

  return { route: null, params: {}, pathname: cleanPath };
}

/**
 * Checks whether a given user role can access the specified route
 */
export function canAccessRoute(route: RouteDefinition | null, userRole: UserRole): boolean {
  if (!route) return false;
  if (!route.requiredRole) return true;

  if (route.requiredRole === 'admin') {
    return userRole === 'admin';
  }

  if (route.requiredRole === 'student') {
    return userRole === 'student' || userRole === 'admin';
  }

  return true;
}
