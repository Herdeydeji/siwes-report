/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { auth } from './config';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

/**
 * Standard Firestore error handler conforming to skill specification
 */
export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

/**
 * Maps Firebase Auth error codes to user-friendly messages without exposing internal stack details
 */
export function getReadableAuthErrorMessage(error: unknown): string {
  if (!error) return 'An unexpected authentication error occurred.';
  
  const rawCode = (error as any)?.code || '';
  const rawMessage = (error as any)?.message || String(error);

  if (rawCode === 'auth/operation-not-allowed' || rawMessage.includes('auth/operation-not-allowed')) {
    return 'Email/Password sign-in is not yet enabled in your Firebase Project. Please enable "Email/Password" under Authentication > Sign-in method in your Firebase Console.';
  }
  if (rawCode === 'auth/email-already-in-use' || rawMessage.includes('auth/email-already-in-use')) {
    return 'An account with this email address already exists. Please sign in instead.';
  }
  if (rawCode === 'auth/invalid-email' || rawMessage.includes('auth/invalid-email')) {
    return 'The email address format is invalid. Please check and try again.';
  }
  if (rawCode === 'auth/weak-password' || rawMessage.includes('auth/weak-password')) {
    return 'The password is too weak. Please use at least 6 characters.';
  }
  if (
    rawCode === 'auth/user-not-found' ||
    rawCode === 'auth/wrong-password' ||
    rawCode === 'auth/invalid-credential' ||
    rawMessage.includes('auth/invalid-credential')
  ) {
    return 'Invalid email or password. Please verify your credentials.';
  }
  if (rawCode === 'auth/too-many-requests' || rawMessage.includes('auth/too-many-requests')) {
    return 'Access temporarily restricted due to many failed attempts. Please wait a few minutes or reset your password.';
  }
  if (rawCode === 'auth/user-disabled' || rawMessage.includes('auth/user-disabled')) {
    return 'This student account has been suspended. Please contact platform administration.';
  }
  if (rawCode === 'auth/network-request-failed' || rawMessage.includes('auth/network-request-failed')) {
    return 'Network connection error. Please check your internet connection.';
  }

  if (typeof error === 'object' && error !== null && 'message' in error) {
    return (error as { message: string }).message;
  }
  return 'An authentication error occurred. Please try again.';
}

