/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { INSTITUTIONS_CATALOG, findInstitution } from './institutions';

test('institutions catalog includes UNIOSUN as fully supported reference', () => {
  const uniosun = findInstitution('uniosun');
  assert.ok(uniosun);
  assert.equal(uniosun?.shortName, 'UNIOSUN');
  assert.equal(uniosun?.hasVerifiedTemplate, true);
  assert.ok(uniosun?.guidelineNote.includes('UNIOSUN FET'));
  assert.ok(uniosun?.faculties.some(f => f.name.includes('Engineering')));
});

test('findInstitution correctly distinguishes verified from generic templates', () => {
  const futa = findInstitution('futa');
  assert.ok(futa);
  assert.equal(futa?.hasVerifiedTemplate, true);

  const unilag = findInstitution('unilag');
  assert.ok(unilag);
  assert.equal(unilag?.hasVerifiedTemplate, false);
  assert.ok(unilag?.guidelineNote.includes('Generic'));
});

test('findInstitution returns undefined for unknown queries', () => {
  const unknown = findInstitution('non-existent-poly');
  assert.equal(unknown, undefined);
});
