/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { matchRoute, canAccessRoute, APP_ROUTES } from './router';

test('router matches exact public routes correctly', () => {
  const home = matchRoute('/');
  assert.equal(home.route?.path, '/');
  assert.equal(home.route?.group, 'public');

  const pricing = matchRoute('/pricing');
  assert.equal(pricing.route?.path, '/pricing');
  assert.equal(pricing.route?.group, 'public');

  const forgot = matchRoute('/forgot-password');
  assert.equal(forgot.route?.path, '/forgot-password');
  assert.equal(forgot.route?.group, 'public');
});

test('router matches onboarding and email verification routes', () => {
  const verify = matchRoute('/verify-email');
  assert.equal(verify.route?.path, '/verify-email');
  assert.equal(verify.route?.group, 'student');

  const onboard = matchRoute('/onboarding');
  assert.equal(onboard.route?.path, '/onboarding');
  assert.equal(onboard.route?.group, 'student');
});

test('router extracts dynamic params for report detail route', () => {
  const match = matchRoute('/reports/rep-9824-unilag');
  assert.notEqual(match.route, null);
  assert.equal(match.route?.path, '/reports/:reportId');
  assert.equal(match.route?.group, 'student');
  assert.equal(match.params.reportId, 'rep-9824-unilag');
});

test('canAccessRoute enforces role authorization properly', () => {
  const forgotRoute = APP_ROUTES.find(r => r.path === '/forgot-password')!;
  const verifyRoute = APP_ROUTES.find(r => r.path === '/verify-email')!;
  const onboardRoute = APP_ROUTES.find(r => r.path === '/onboarding')!;
  const adminRoute = APP_ROUTES.find(r => r.path === '/admin')!;

  assert.equal(canAccessRoute(forgotRoute, 'guest'), true);
  assert.equal(canAccessRoute(verifyRoute, 'guest'), false);
  assert.equal(canAccessRoute(verifyRoute, 'student'), true);
  assert.equal(canAccessRoute(onboardRoute, 'student'), true);
  assert.equal(canAccessRoute(adminRoute, 'student'), false);
  assert.equal(canAccessRoute(adminRoute, 'admin'), true);
});
