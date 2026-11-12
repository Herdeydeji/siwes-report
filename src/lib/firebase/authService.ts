/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile,
  reload,
  User,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db } from './config';
import { handleFirestoreError, OperationType } from './errors';
import { StudentPlacementInfo, UserProfile } from '../types';

const ALLOWED_STUDENT_EDITABLE_FIELDS = new Set([
  'fullName',
  'phoneNumber',
  'institution',
  'faculty',
  'department',
  'programme',
  'matricNumber',
  'academicLevel',
  'academicSession',
  'placement',
  'avatarUrl',
]);

function boundString(value: unknown, maxLen: number): string {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, maxLen);
}

function sanitizePlacement(placement?: Partial<StudentPlacementInfo>): StudentPlacementInfo {
  const safe: StudentPlacementInfo = {
    organisationName: boundString(placement?.organisationName, 150),
  };

  if (placement?.organisationAddress !== undefined) {
    safe.organisationAddress = boundString(placement.organisationAddress, 250);
  }
  if (placement?.supervisorName !== undefined) {
    safe.supervisorName = boundString(placement.supervisorName, 120);
  }
  if (placement?.supervisorDesignation !== undefined) {
    safe.supervisorDesignation = boundString(placement.supervisorDesignation, 100);
  }
  if (placement?.startDate !== undefined) {
    safe.startDate = boundString(placement.startDate, 30);
  }
  if (placement?.endDate !== undefined) {
    safe.endDate = boundString(placement.endDate, 30);
  }

  return safe;
}

/**
 * Registers a new student account, initializes their Firestore profile with role 'student',
 * and sends an email verification link.
 */
export async function registerStudent(
  email: string,
  password: string,
  fullName: string
): Promise<{ user: User; profile: UserProfile }> {
  const cleanFullName = boundString(fullName, 120);
  const cleanEmail = boundString(email, 120);

  // 1. Create account in Firebase Auth
  const credential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
  const user = credential.user;

  // 2. Set Auth display name
  try {
    await updateProfile(user, { displayName: cleanFullName });
  } catch (err) {
    console.warn('Could not update Auth displayName immediately:', err);
  }

  // 3. Create initial Firestore profile (role is strictly student; verification & onboarding start false)
  const initialProfile: UserProfile = {
    uid: user.uid,
    fullName: cleanFullName,
    email: boundString(user.email || cleanEmail, 120),
    role: 'student',
    emailVerified: false,
    onboardingCompleted: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const userPath = `users/${user.uid}`;
  try {
    await setDoc(doc(db, 'users', user.uid), initialProfile);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, userPath);
  }

  // 4. Send email verification
  try {
    await sendEmailVerification(user);
  } catch (err) {
    console.warn('Initial sendEmailVerification error:', err);
  }

  return { user, profile: initialProfile };
}

/**
 * Signs in an existing user with email and password
 */
export async function loginStudent(email: string, password: string): Promise<User> {
  const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
  return credential.user;
}

/**
 * Signs out the currently authenticated user
 */
export async function logoutStudent(): Promise<void> {
  await signOut(auth);
}

/**
 * Sends a password reset email to the specified registered address
 */
export async function sendStudentPasswordReset(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email.trim());
}

/**
 * Resends the email verification message to the current user
 */
export async function resendStudentEmailVerification(user: User): Promise<void> {
  await sendEmailVerification(user);
}

/**
 * Reloads the current user from Firebase Auth to get the authoritative emailVerified status
 */
export async function reloadStudentUser(user: User): Promise<User> {
  await reload(user);
  return auth.currentUser || user;
}

/**
 * Fetches the user profile document from Firestore.
 * Note: emailVerified from Firestore is never used to grant auth verification;
 * Firebase Authentication (`auth.currentUser.emailVerified`) is the sole source of truth.
 */
export async function getStudentProfile(uid: string): Promise<UserProfile | null> {
  const userPath = `users/${uid}`;
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    if (!snap.exists()) {
      return null;
    }
    const data = snap.data();
    return {
      uid,
      fullName: data.fullName || '',
      email: data.email || '',
      phoneNumber: data.phoneNumber || '',
      role: data.role === 'admin' ? 'admin' : 'student',
      emailVerified: Boolean(auth.currentUser?.uid === uid ? auth.currentUser.emailVerified : false),
      onboardingCompleted: Boolean(data.onboardingCompleted),
      institution: data.institution || '',
      faculty: data.faculty || '',
      department: data.department || '',
      programme: data.programme || '',
      matricNumber: data.matricNumber || '',
      academicLevel: data.academicLevel || '',
      academicSession: data.academicSession || '',
      placement: data.placement || undefined,
      avatarUrl: data.avatarUrl || undefined,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, userPath);
  }
}

/**
 * Saves onboarding data to the student's Firestore profile and marks onboardingCompleted: true.
 * Server-side Firestore rules verify email_verified == true and completeness of mandatory fields.
 */
export async function saveStudentOnboarding(
  uid: string,
  onboardingData: Partial<UserProfile>
): Promise<void> {
  const userPath = `users/${uid}`;
  try {
    const updatePayload: Record<string, any> = {
      fullName: boundString(onboardingData.fullName, 120),
      phoneNumber: boundString(onboardingData.phoneNumber || '', 20),
      institution: boundString(onboardingData.institution, 150),
      faculty: boundString(onboardingData.faculty, 100),
      department: boundString(onboardingData.department, 100),
      programme: boundString(onboardingData.programme, 100),
      matricNumber: boundString(onboardingData.matricNumber, 50),
      academicLevel: boundString(onboardingData.academicLevel, 30),
      academicSession: boundString(onboardingData.academicSession, 30),
      placement: sanitizePlacement(onboardingData.placement),
      onboardingCompleted: true,
      updatedAt: serverTimestamp(),
    };

    await updateDoc(doc(db, 'users', uid), updatePayload);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, userPath);
  }
}

/**
 * Updates an existing student's allowlisted personal, academic, or placement fields in Firestore.
 * Privileged/immutable fields (role, uid, email, emailVerified, onboardingCompleted, createdAt)
 * are strictly stripped on the client and rejected by Firestore security rules.
 */
export async function updateStudentProfile(
  uid: string,
  fields: Partial<UserProfile>
): Promise<void> {
  const userPath = `users/${uid}`;
  try {
    const safeUpdate: Record<string, any> = {
      updatedAt: serverTimestamp(),
    };

    const stringLimits: Record<string, number> = {
      fullName: 120,
      phoneNumber: 20,
      institution: 150,
      faculty: 100,
      department: 100,
      programme: 100,
      matricNumber: 50,
      academicLevel: 30,
      academicSession: 30,
      avatarUrl: 500,
    };

    for (const [key, value] of Object.entries(fields)) {
      if (!ALLOWED_STUDENT_EDITABLE_FIELDS.has(key) || value === undefined) {
        continue;
      }
      if (key === 'placement' && typeof value === 'object' && value !== null) {
        safeUpdate.placement = sanitizePlacement(value as Partial<StudentPlacementInfo>);
      } else if (key in stringLimits) {
        safeUpdate[key] = boundString(value, stringLimits[key]);
      }
    }

    await updateDoc(doc(db, 'users', uid), safeUpdate);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, userPath);
  }
}
