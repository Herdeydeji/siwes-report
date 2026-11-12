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
import { UserProfile } from '../types';

/**
 * Registers a new student account, initializes their Firestore profile with role 'student',
 * and sends an email verification link.
 */
export async function registerStudent(
  email: string,
  password: string,
  fullName: string
): Promise<{ user: User; profile: UserProfile }> {
  // 1. Create account in Firebase Auth
  const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
  const user = credential.user;

  // 2. Set Auth display name
  try {
    await updateProfile(user, { displayName: fullName.trim() });
  } catch (err) {
    console.warn('Could not update Auth displayName immediately:', err);
  }

  // 3. Create initial Firestore profile (role is strictly student; cannot self-assign admin)
  const initialProfile: UserProfile = {
    uid: user.uid,
    fullName: fullName.trim(),
    email: user.email || email.trim(),
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
 * Reloads the current user from Firebase Auth to get the latest emailVerified status
 */
export async function reloadStudentUser(user: User): Promise<User> {
  await reload(user);
  return auth.currentUser || user;
}

/**
 * Fetches the user profile document from Firestore
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
      emailVerified: Boolean(data.emailVerified),
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
 * Saves onboarding data to the student's Firestore profile and marks onboardingCompleted: true
 */
export async function saveStudentOnboarding(
  uid: string,
  onboardingData: Partial<UserProfile>
): Promise<void> {
  const userPath = `users/${uid}`;
  try {
    const updatePayload: Record<string, any> = {
      fullName: onboardingData.fullName,
      phoneNumber: onboardingData.phoneNumber || '',
      institution: onboardingData.institution,
      faculty: onboardingData.faculty,
      department: onboardingData.department,
      programme: onboardingData.programme,
      matricNumber: onboardingData.matricNumber,
      academicLevel: onboardingData.academicLevel,
      academicSession: onboardingData.academicSession,
      onboardingCompleted: true,
      updatedAt: serverTimestamp(),
    };

    if (onboardingData.placement) {
      updatePayload.placement = onboardingData.placement;
    }

    await updateDoc(doc(db, 'users', uid), updatePayload);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, userPath);
  }
}

/**
 * Updates an existing student's profile fields in Firestore
 */
export async function updateStudentProfile(
  uid: string,
  fields: Partial<UserProfile>
): Promise<void> {
  const userPath = `users/${uid}`;
  try {
    // Protect role against client tampering
    const { role, uid: _, createdAt: __, ...safeFields } = fields as any;
    await updateDoc(doc(db, 'users', uid), {
      ...safeFields,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, userPath);
  }
}
