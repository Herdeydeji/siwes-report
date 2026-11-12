/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { User, onAuthStateChanged, reload } from 'firebase/auth';
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
  const [authEmailVerified, setAuthEmailVerified] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthReady, setIsAuthReady] = useState<boolean>(false);

  // Monotonic token to prevent stale async auth callbacks from overwriting newer auth state
  const authSyncIdRef = useRef(0);

  // Probe Firestore on mount
  useEffect(() => {
    testFirestoreConnection().catch((err) => {
      console.warn('Initial Firestore connection check notice:', err);
    });
  }, []);

  // Listen for Firebase auth state changes and restore session cleanly on refresh
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      const syncId = ++authSyncIdRef.current;
      setIsLoading(true);

      if (user) {
        // Reload Auth user on session restoration so emailVerified reflects live Firebase Auth state
        try {
          await reload(user);
        } catch (err) {
          console.warn('Auth reload notice during session restore:', err);
        }

        if (syncId !== authSyncIdRef.current) return;

        const freshUser = auth.currentUser || user;
        setCurrentUser(freshUser);
        setAuthEmailVerified(Boolean(freshUser.emailVerified));

        try {
          const profile = await getStudentProfile(freshUser.uid);
          if (syncId !== authSyncIdRef.current) return;
          setUserProfile(profile);
        } catch (err) {
          console.error('Error fetching user profile from Firestore:', err);
          if (syncId !== authSyncIdRef.current) return;
          setUserProfile(null);
        }
      } else {
        setCurrentUser(null);
        setAuthEmailVerified(false);
        setUserProfile(null);
      }

      if (syncId === authSyncIdRef.current) {
        setIsLoading(false);
        setIsAuthReady(true);
      }
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
        setAuthEmailVerified(Boolean(user.emailVerified));
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
      try {
        await reload(user);
      } catch {
        // Use credential user state if reload fails transiently
      }
      const freshUser = auth.currentUser || user;
      setCurrentUser(freshUser);
      setAuthEmailVerified(Boolean(freshUser.emailVerified));
      const profile = await getStudentProfile(freshUser.uid);
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
      setAuthEmailVerified(false);
      setUserProfile(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resendVerification = useCallback(async () => {
    const activeUser = auth.currentUser || currentUser;
    if (!activeUser) throw new Error('No authenticated user session found.');
    await resendStudentEmailVerification(activeUser);
  }, [currentUser]);

  /**
   * Reloads Firebase Authentication user state.
   * Firebase Authentication (`currentUser.emailVerified`) is the sole authoritative source;
   * client code never writes `emailVerified` to Firestore.
   */
  const checkVerificationStatus = useCallback(async (): Promise<boolean> => {
    const activeUser = auth.currentUser || currentUser;
    if (!activeUser) return false;

    const reloaded = await reloadStudentUser(activeUser);
    const verified = Boolean(reloaded.emailVerified);
    setCurrentUser(reloaded);
    setAuthEmailVerified(verified);

    if (verified) {
      try {
        const profile = await getStudentProfile(reloaded.uid);
        setUserProfile(profile);
      } catch (err) {
        console.warn('Could not refresh profile after verification check:', err);
      }
    }

    return verified;
  }, [currentUser]);

  const sendPasswordReset = useCallback(async (email: string) => {
    await sendStudentPasswordReset(email);
  }, []);

  const completeOnboarding = useCallback(
    async (data: Partial<UserProfile>) => {
      const activeUser = auth.currentUser || currentUser;
      if (!activeUser) throw new Error('No authenticated user session found.');
      if (!activeUser.emailVerified) {
        throw new Error('Please verify your email address before completing onboarding.');
      }

      setIsLoading(true);
      try {
        await saveStudentOnboarding(activeUser.uid, data);
        const updated = await getStudentProfile(activeUser.uid);
        setUserProfile(updated);
      } finally {
        setIsLoading(false);
      }
    },
    [currentUser]
  );

  const refreshProfile = useCallback(async () => {
    const activeUser = auth.currentUser || currentUser;
    if (!activeUser) return;
    try {
      const profile = await getStudentProfile(activeUser.uid);
      setUserProfile(profile);
    } catch (err) {
      console.error('Error refreshing profile:', err);
    }
  }, [currentUser]);

  // Firebase Auth is strictly authoritative for email verification;
  // Firestore profile fields cannot independently grant verified status.
  const isEmailVerified = Boolean(currentUser && authEmailVerified);
  const onboardingCompleted = Boolean(currentUser && authEmailVerified && userProfile?.onboardingCompleted);

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
