/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth, testFirestoreConnection } from './config';
import {
  registerStudent,
  loginStudent,
  logoutStudent,
  sendStudentPasswordReset,
  resendStudentEmailVerification,
  reloadStudentUser,
  getStudentProfile,
  saveStudentOnboarding,
  updateStudentProfile,
} from './authService';
import { UserProfile } from '../types';

interface AuthContextValue {
  currentUser: User | null;
  userProfile: UserProfile | null;
  isLoading: boolean;
  isAuthReady: boolean;
  isEmailVerified: boolean;
  onboardingCompleted: boolean;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resendVerification: () => Promise<void>;
  checkVerificationStatus: () => Promise<boolean>;
  sendPasswordReset: (email: string) => Promise<void>;
  completeOnboarding: (data: Partial<UserProfile>) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthReady, setIsAuthReady] = useState<boolean>(false);

  // Probe Firestore on mount
  useEffect(() => {
    testFirestoreConnection().catch((err) => {
      console.warn('Initial Firestore connection check notice:', err);
    });
  }, []);

  // Listen for Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setIsLoading(true);
      setCurrentUser(user);

      if (user) {
        try {
          const profile = await getStudentProfile(user.uid);
          setUserProfile(profile);
        } catch (err) {
          console.error('Error fetching user profile from Firestore:', err);
          setUserProfile(null);
        }
      } else {
        setUserProfile(null);
      }

      setIsLoading(false);
      setIsAuthReady(true);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const register = useCallback(
    async (email: string, password: string, fullName: string) => {
      setIsLoading(true);
      try {
        const { user, profile } = await registerStudent(email, password, fullName);
        setCurrentUser(user);
        setUserProfile(profile);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const user = await loginStudent(email, password);
      setCurrentUser(user);
      const profile = await getStudentProfile(user.uid);
      setUserProfile(profile);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await logoutStudent();
      setCurrentUser(null);
      setUserProfile(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resendVerification = useCallback(async () => {
    if (!currentUser) throw new Error('No authenticated user session found.');
    await resendStudentEmailVerification(currentUser);
  }, [currentUser]);

  const checkVerificationStatus = useCallback(async (): Promise<boolean> => {
    if (!currentUser) return false;
    const reloaded = await reloadStudentUser(currentUser);
    setCurrentUser(reloaded);

    // If verified now, update Firestore profile record if needed
    if (reloaded.emailVerified && userProfile && !userProfile.emailVerified) {
      try {
        await updateStudentProfile(reloaded.uid, { emailVerified: true });
        setUserProfile((prev) => (prev ? { ...prev, emailVerified: true } : null));
      } catch (err) {
        console.warn('Could not update emailVerified flag in Firestore:', err);
      }
    }

    return reloaded.emailVerified;
  }, [currentUser, userProfile]);

  const sendPasswordReset = useCallback(async (email: string) => {
    await sendStudentPasswordReset(email);
  }, []);

  const completeOnboarding = useCallback(
    async (data: Partial<UserProfile>) => {
      if (!currentUser) throw new Error('No authenticated user session found.');
      setIsLoading(true);
      try {
        await saveStudentOnboarding(currentUser.uid, data);
        const updated = await getStudentProfile(currentUser.uid);
        setUserProfile(updated);
      } finally {
        setIsLoading(false);
      }
    },
    [currentUser]
  );

  const refreshProfile = useCallback(async () => {
    if (!currentUser) return;
    try {
      const profile = await getStudentProfile(currentUser.uid);
      setUserProfile(profile);
    } catch (err) {
      console.error('Error refreshing profile:', err);
    }
  }, [currentUser]);

  const isEmailVerified = Boolean(currentUser?.emailVerified);
  const onboardingCompleted = Boolean(userProfile?.onboardingCompleted);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        isLoading,
        isAuthReady,
        isEmailVerified,
        onboardingCompleted,
        register,
        login,
        logout,
        resendVerification,
        checkVerificationStatus,
        sendPasswordReset,
        completeOnboarding,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
