/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  initializeTestEnvironment,
  assertFails,
  assertSucceeds,
  RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

const PROJECT_ID = 'demo-siwes-studio-rules-audit';

let testEnv: RulesTestEnvironment;

function serverTimestamp() {
  return firebase.firestore.FieldValue.serverTimestamp();
}

function customTimestamp(msOffset = -60_000) {
  return firebase.firestore.Timestamp.fromMillis(Date.now() + msOffset);
}

function baseStudentProfile(uid: string, email: string, overrides: Record<string, unknown> = {}) {
  return {
    uid,
    fullName: 'Tunde Bakare',
    email,
    role: 'student',
    emailVerified: false,
    onboardingCompleted: false,
    createdAt: customTimestamp(-120_000),
    updatedAt: customTimestamp(-120_000),
    ...overrides,
  };
}

function fullOnboardingPayload() {
  return {
    fullName: 'Tunde Bakare',
    phoneNumber: '08031234567',
    institution: 'Federal University of Technology, Akure (FUTA)',
    faculty: 'School of Engineering and Engineering Technology',
    department: 'Mechanical Engineering',
    programme: 'B.Eng. Mechanical Engineering',
    matricNumber: 'MEE/19/4012',
    academicLevel: '400 Level',
    academicSession: '2024/2025',
    placement: {
      organisationName: 'Nigerian Bottling Company Plc',
      organisationAddress: 'Ikeja Industrial Estate, Lagos',
      supervisorName: 'Engr. K. Adeyemi',
      supervisorDesignation: 'Plant Maintenance Lead',
      startDate: '2025-03-01',
      endDate: '2025-08-30',
    },
    onboardingCompleted: true,
    updatedAt: serverTimestamp(),
  };
}

test.before(async () => {
  const rules = fs.readFileSync(path.resolve(process.cwd(), 'firestore.rules'), 'utf8');
  testEnv = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: {
      rules,
    },
  });
});

test.beforeEach(async () => {
  await testEnv.clearFirestore();

  // Seed baseline profiles and a server-provisioned admin record bypassing rules
  await testEnv.withSecurityRulesDisabled(async (context) => {
    const db = context.firestore();

    await db.collection('users').doc('student-a').set(
      baseStudentProfile('student-a', 'student.a@futa.edu.ng', {
        onboardingCompleted: true,
        institution: 'Federal University of Technology, Akure (FUTA)',
        faculty: 'SEET',
        department: 'Computer Engineering',
        programme: 'B.Eng. Computer Engineering',
        matricNumber: 'CPE/19/1001',
        academicLevel: '400 Level',
        academicSession: '2024/2025',
        placement: {
          organisationName: 'Interswitch Group',
        },
      })
    );

    await db.collection('users').doc('student-b').set(
      baseStudentProfile('student-b', 'student.b@unilag.edu.ng')
    );

    await db.collection('users').doc('student-unverified').set(
      baseStudentProfile('student-unverified', 'unverified@uniosun.edu.ng')
    );

    await db.collection('admins').doc('admin-1').set({
      uid: 'admin-1',
      email: 'admin@siwesstudio.ng',
      grantedAt: customTimestamp(-86_400_000),
    });

    await db.collection('users').doc('admin-1').set(
      baseStudentProfile('admin-1', 'admin@siwesstudio.ng', {
        role: 'admin',
        fullName: 'Dr. E. O. Adebayo',
        onboardingCompleted: true,
      })
    );
  });
});

test.after(async () => {
  await testEnv.cleanup();
});

// Scenario 1: Unauthenticated user reading a student profile
test('1. Unauthenticated user cannot read or list student profiles', async () => {
  const unauthDb = testEnv.unauthenticatedContext().firestore();
  await assertFails(unauthDb.collection('users').doc('student-a').get());
  await assertFails(unauthDb.collection('users').get());
});

// Scenario 2: Student reading their own profile
test('2. Student can read their own profile', async () => {
  const studentADb = testEnv
    .authenticatedContext('student-a', { email: 'student.a@futa.edu.ng', email_verified: true })
    .firestore();
  const snap = await assertSucceeds(studentADb.collection('users').doc('student-a').get());
  assert.equal(snap.exists, true);
  assert.equal(snap.data()?.uid, 'student-a');
});

// Scenario 3: Student reading another student's profile
test('3. Student cannot read another student profile', async () => {
  const studentADb = testEnv
    .authenticatedContext('student-a', { email: 'student.a@futa.edu.ng', email_verified: true })
    .firestore();
  await assertFails(studentADb.collection('users').doc('student-b').get());
});

// Scenario 4: Student listing all profiles
test('4. Student cannot list all student profiles', async () => {
  const studentADb = testEnv
    .authenticatedContext('student-a', { email: 'student.a@futa.edu.ng', email_verified: true })
    .firestore();
  await assertFails(studentADb.collection('users').get());
});

// Scenario 5: Student changing their role to admin
test('5. Student cannot escalate role to admin on update or create', async () => {
  const studentADb = testEnv
    .authenticatedContext('student-a', { email: 'student.a@futa.edu.ng', email_verified: true })
    .firestore();
  await assertFails(
    studentADb.collection('users').doc('student-a').update({
      role: 'admin',
      updatedAt: serverTimestamp(),
    })
  );

  const newStudentDb = testEnv
    .authenticatedContext('student-new', { email: 'new@futa.edu.ng', email_verified: false })
    .firestore();
  await assertFails(
    newStudentDb.collection('users').doc('student-new').set({
      uid: 'student-new',
      fullName: 'Privilege Escalator',
      email: 'new@futa.edu.ng',
      role: 'admin',
      emailVerified: false,
      onboardingCompleted: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  );
});

// Scenario 6: Student changing emailVerified to true
test('6. Student cannot set emailVerified to true in Firestore', async () => {
  const studentBDb = testEnv
    .authenticatedContext('student-b', { email: 'student.b@unilag.edu.ng', email_verified: true })
    .firestore();
  await assertFails(
    studentBDb.collection('users').doc('student-b').update({
      emailVerified: true,
      updatedAt: serverTimestamp(),
    })
  );
});

// Scenario 7: Student changing onboardingCompleted to true without completing onboarding
test('7. Student cannot bypass onboarding by setting onboardingCompleted to true without required fields', async () => {
  const studentBDb = testEnv
    .authenticatedContext('student-b', { email: 'student.b@unilag.edu.ng', email_verified: true })
    .firestore();

  // Attempt 7a: Flip onboardingCompleted alone
  await assertFails(
    studentBDb.collection('users').doc('student-b').update({
      onboardingCompleted: true,
      updatedAt: serverTimestamp(),
    })
  );

  // Attempt 7b: Flip onboardingCompleted with empty/incomplete required fields
  await assertFails(
    studentBDb.collection('users').doc('student-b').update({
      institution: 'UNILAG',
      department: '',
      onboardingCompleted: true,
      updatedAt: serverTimestamp(),
    })
  );

  // Attempt 7c: Valid complete onboarding succeeds for verified student
  await assertSucceeds(
    studentBDb.collection('users').doc('student-b').update(fullOnboardingPayload())
  );

  // Attempt 7d: Cannot toggle onboardingCompleted back to false once completed
  await assertFails(
    studentBDb.collection('users').doc('student-b').update({
      onboardingCompleted: false,
      updatedAt: serverTimestamp(),
    })
  );
});

// Scenario 8: Student changing uid or email
test('8. Student cannot modify uid or email', async () => {
  const studentADb = testEnv
    .authenticatedContext('student-a', { email: 'student.a@futa.edu.ng', email_verified: true })
    .firestore();

  await assertFails(
    studentADb.collection('users').doc('student-a').update({
      uid: 'student-b',
      updatedAt: serverTimestamp(),
    })
  );

  await assertFails(
    studentADb.collection('users').doc('student-a').update({
      email: 'spoofed@futa.edu.ng',
      updatedAt: serverTimestamp(),
    })
  );
});

// Scenario 9: Student modifying createdAt
test('9. Student cannot modify createdAt', async () => {
  const studentADb = testEnv
    .authenticatedContext('student-a', { email: 'student.a@futa.edu.ng', email_verified: true })
    .firestore();

  await assertFails(
    studentADb.collection('users').doc('student-a').update({
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  );

  await assertFails(
    studentADb.collection('users').doc('student-a').update({
      createdAt: customTimestamp(-500_000),
      updatedAt: serverTimestamp(),
    })
  );
});

// Scenario 10: Student updating an allowed academic or placement field
test('10. Verified student can update allowed academic and placement fields', async () => {
  const studentADb = testEnv
    .authenticatedContext('student-a', { email: 'student.a@futa.edu.ng', email_verified: true })
    .firestore();

  await assertSucceeds(
    studentADb.collection('users').doc('student-a').update({
      department: 'Electrical and Electronics Engineering',
      academicSession: '2025/2026',
      placement: {
        organisationName: 'Shell Petroleum Development Company',
        organisationAddress: 'Port Harcourt, Rivers State',
        supervisorName: 'Engr. Musa Ibrahim',
        supervisorDesignation: 'Lead Field Engineer',
      },
      updatedAt: serverTimestamp(),
    })
  );

  // Also reject arbitrary shadow/ghost fields on update
  await assertFails(
    studentADb.collection('users').doc('student-a').update({
      department: 'Computer Engineering',
      isAdmin: true,
      updatedAt: serverTimestamp(),
    })
  );

  // Unverified student cannot update profile fields
  const unverifiedDb = testEnv
    .authenticatedContext('student-unverified', { email: 'unverified@uniosun.edu.ng', email_verified: false })
    .firestore();
  await assertFails(
    unverifiedDb.collection('users').doc('student-unverified').update({
      department: 'Civil Engineering',
      updatedAt: serverTimestamp(),
    })
  );
});

// Scenario 11: Unauthorised user creating an admin record
test('11. Unauthorised users cannot create, modify, or delete /admins records', async () => {
  const unauthDb = testEnv.unauthenticatedContext().firestore();
  await assertFails(
    unauthDb.collection('admins').doc('attacker').set({
      uid: 'attacker',
    })
  );

  const studentADb = testEnv
    .authenticatedContext('student-a', { email: 'student.a@futa.edu.ng', email_verified: true })
    .firestore();

  await assertFails(
    studentADb.collection('admins').doc('student-a').set({
      uid: 'student-a',
      email: 'student.a@futa.edu.ng',
    })
  );

  await assertFails(studentADb.collection('admins').doc('admin-1').get());
  await assertFails(studentADb.collection('admins').get());
  await assertFails(studentADb.collection('admins').doc('admin-1').delete());
});

// Scenario 12: Valid administrator accessing permitted administrative records
test('12. Valid verified administrator can access /admins and student user records', async () => {
  const adminDb = testEnv
    .authenticatedContext('admin-1', { email: 'admin@siwesstudio.ng', email_verified: true })
    .firestore();

  const adminRecord = await assertSucceeds(adminDb.collection('admins').doc('admin-1').get());
  assert.equal(adminRecord.exists, true);

  const allUsersSnap = await assertSucceeds(adminDb.collection('users').get());
  assert.equal(allUsersSnap.size >= 3, true);

  const studentSnap = await assertSucceeds(adminDb.collection('users').doc('student-a').get());
  assert.equal(studentSnap.exists, true);

  // Even a verified admin cannot mutate /admins via client SDK
  await assertFails(
    adminDb.collection('admins').doc('student-a').set({
      uid: 'student-a',
    })
  );

  // Unverified admin token is rejected
  const unverifiedAdminDb = testEnv
    .authenticatedContext('admin-1', { email: 'admin@siwesstudio.ng', email_verified: false })
    .firestore();
  await assertFails(unverifiedAdminDb.collection('admins').doc('admin-1').get());
  await assertFails(unverifiedAdminDb.collection('users').get());
});

// Additional integrity test: Registration create rule matches registerStudent client payload
test('Registration allows creating initial student profile and blocks forged initial state', async () => {
  const newDb = testEnv
    .authenticatedContext('fresh-student', { email: 'fresh@uniosun.edu.ng', email_verified: false })
    .firestore();

  await assertSucceeds(
    newDb.collection('users').doc('fresh-student').set({
      uid: 'fresh-student',
      fullName: 'Kemi Adeosun',
      email: 'fresh@uniosun.edu.ng',
      role: 'student',
      emailVerified: false,
      onboardingCompleted: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  );

  // Cannot create profile with emailVerified: true or onboardingCompleted: true
  const evilDb = testEnv
    .authenticatedContext('evil-student', { email: 'evil@uniosun.edu.ng', email_verified: false })
    .firestore();

  await assertFails(
    evilDb.collection('users').doc('evil-student').set({
      uid: 'evil-student',
      fullName: 'Evil Student',
      email: 'evil@uniosun.edu.ng',
      role: 'student',
      emailVerified: true,
      onboardingCompleted: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  );

  await assertFails(
    evilDb.collection('users').doc('evil-student').set({
      uid: 'evil-student',
      fullName: 'Evil Student',
      email: 'evil@uniosun.edu.ng',
      role: 'student',
      emailVerified: false,
      onboardingCompleted: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  );
});
