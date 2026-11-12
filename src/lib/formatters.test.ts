/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { formatCurrencyNGN, formatSIWESDuration, getDurationTotalWeeks, isValidMatricNumber, getStatusMeta } from './formatters';

test('formatCurrencyNGN formats Nigerian Naira properly', () => {
  const result = formatCurrencyNGN(3500);
  assert.ok(result.includes('3,500') || result.includes('3500'));
  assert.ok(result.includes('NGN') || result.includes('₦'));
});

test('formatSIWESDuration formats duration string with week count', () => {
  assert.equal(formatSIWESDuration('3_months'), '3 Months (12 Weeks)');
  assert.equal(formatSIWESDuration('6_months'), '6 Months (24 Weeks)');
  assert.equal(formatSIWESDuration('12_months'), '1 Year (48 Weeks)');
});

test('getDurationTotalWeeks returns exact weeks', () => {
  assert.equal(getDurationTotalWeeks('3_months'), 12);
  assert.equal(getDurationTotalWeeks('6_months'), 24);
  assert.equal(getDurationTotalWeeks('12_months'), 48);
});

test('isValidMatricNumber validates university matriculation formats', () => {
  assert.equal(isValidMatricNumber('19/52HA081'), true);
  assert.equal(isValidMatricNumber('FUTA/CSC/21/8042'), true);
  assert.equal(isValidMatricNumber('UNILAG-ENG-2022-091'), true);
  assert.equal(isValidMatricNumber(''), false);
  assert.equal(isValidMatricNumber('ab'), false);
  assert.equal(isValidMatricNumber('invalid!@#$matric'), false);
});

test('getStatusMeta returns proper labels and tones', () => {
  assert.deepEqual(getStatusMeta('draft'), { label: 'Draft', tone: 'neutral' });
  assert.deepEqual(getStatusMeta('in_review'), { label: 'In Review', tone: 'info' });
  assert.deepEqual(getStatusMeta('approved'), { label: 'Approved', tone: 'success' });
});
