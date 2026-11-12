/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, RefreshCw, Send, LogOut, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { AlertBanner } from '../../components/ui/ErrorState';
import { useAuth } from '../../lib/firebase/AuthContext';
import { useToast } from '../../components/ui/NotificationToast';

interface VerifyEmailViewProps {
  onNavigate: (path: string) => void;
}

export function VerifyEmailView({ onNavigate }: VerifyEmailViewProps) {
  const { currentUser, isEmailVerified, resendVerification, checkVerificationStatus, logout } = useAuth();
  const { showToast } = useToast();

  const [isChecking, setIsChecking] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const email = currentUser?.email || 'your registered address';

  const handleRefreshStatus = async () => {
    setIsChecking(true);
    setStatusMessage(null);
    setErrorMessage(null);

    try {
      const verified = await checkVerificationStatus();
      if (verified) {
        showToast('success', 'Email Verified', 'Your student email address has been verified.');
        onNavigate('/onboarding');
      } else {
        setStatusMessage(
          'Email not yet verified. Please click the link sent to your inbox, then press Refresh Status.'
        );
      }
    } catch (err: any) {
      console.error('Check verification error:', err);
      setErrorMessage('Could not refresh verification status from Firebase. Please try again.');
    } finally {
      setIsChecking(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    setResendSuccess(false);
    setErrorMessage(null);

    try {
      await resendVerification();
      setResendSuccess(true);
      showToast('info', 'Verification Sent', 'A fresh verification email has been dispatched.');
    } catch (err: any) {
      console.error('Resend error:', err);
      if (err?.code === 'auth/too-many-requests') {
        setErrorMessage('Too many requests. Please wait a moment before requesting another verification email.');
      } else {
        setErrorMessage('Could not send verification email. Please try again later.');
      }
    } finally {
      setIsResending(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await logout();
      onNavigate('/login');
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  return (
    <div className="py-12 sm:py-20 px-4 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-2xl border border-[#E5E7EB] p-7 sm:p-9 shadow-xs text-center">
        <div className="w-12 h-12 rounded-xl bg-[#FFF5EE] border border-[#FCD6C2] flex items-center justify-center text-[#F36B21] mx-auto mb-4">
          <Mail className="w-6 h-6" />
        </div>

        <h1 className="text-xl font-bold text-[#242424] mb-2">
          Verify Your Student Email
        </h1>

        <p className="text-xs text-[#525252] leading-relaxed mb-6">
          We have sent an official verification link to:
          <br />
          <strong className="text-[#242424] font-semibold">{email}</strong>
          <br />
          Please click the verification link in your inbox to confirm your account and access SIWES Studio.
        </p>

        {resendSuccess && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2 text-left">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Verification email sent. Please check your inbox and spam folder.</span>
          </div>
        )}

        {statusMessage && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center gap-2 text-left">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="mb-4">
            <AlertBanner type="error" message={errorMessage} onDismiss={() => setErrorMessage(null)} />
          </div>
        )}

        <div className="space-y-3 pt-2">
          <Button
            variant="primary"
            size="md"
            className="w-full justify-center"
            onClick={handleRefreshStatus}
            isLoading={isChecking}
            leftIcon={<RefreshCw className="w-4 h-4" />}
          >
            I've Verified — Refresh Status
          </Button>

          <Button
            variant="outline"
            size="md"
            className="w-full justify-center"
            onClick={handleResend}
            isLoading={isResending}
            leftIcon={<Send className="w-4 h-4" />}
          >
            Resend Verification Email
          </Button>
        </div>

        <div className="mt-6 pt-5 border-t border-[#F3F4F6] flex justify-center">
          <button
            onClick={handleSignOut}
            className="text-xs text-[#6B7280] hover:text-red-700 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out & Return</span>
          </button>
        </div>
      </div>
    </div>
  );
}
