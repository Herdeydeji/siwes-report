/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { getReadableAuthErrorMessage } from './errors';

test('getReadableAuthErrorMessage maps Firebase Auth error codes cleanly', () => {
  assert.match(
    getReadableAuthErrorMessage({ code: 'auth/operation-not-allowed' }),
    /Email\/Password sign-in is not yet enabled/i
  );
  assert.match(
    getReadableAuthErrorMessage({ code: 'auth/invalid-credential' }),
    /Invalid email or password/i
  );
  assert.match(
    getReadableAuthErrorMessage({ code: 'auth/email-already-in-use' }),
    /already exists/i
  );
  assert.match(
    getReadableAuthErrorMessage({ code: 'auth/too-many-requests' }),
    /temporarily restricted/i
  );
});
