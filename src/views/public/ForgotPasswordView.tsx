/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ArrowLeft, Mail, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/FormControls';
import { AlertBanner } from '../../components/ui/ErrorState';
import { useAuth } from '../../lib/firebase/AuthContext';
import { getReadableAuthErrorMessage } from '../../lib/firebase/errors';

interface ForgotPasswordViewProps {
  onNavigate: (path: string) => void;
}

export function ForgotPasswordView({ onNavigate }: ForgotPasswordViewProps) {
  const { sendPasswordReset } = useAuth();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }

    setIsLoading(true);
    try {
      await sendPasswordReset(email);
      setIsSubmitted(true);
    } catch (err) {
      console.error('Password reset error:', err);
      // To prevent email enumeration attacks, show standard completion message or generalized error
      setIsSubmitted(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-12 sm:py-20 px-4 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-2xl border border-[#E5E7EB] p-7 sm:p-9 shadow-xs">
        <div className="text-center mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#FFF5EE] border border-[#FCD6C2] flex items-center justify-center text-[#F36B21] font-bold text-base mx-auto mb-3">
            <Mail className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold text-[#242424]">Reset Your Password</h1>
          <p className="text-xs text-[#6B7280] mt-1 leading-relaxed">
            Enter your registered student email address and we will send you instructions to reset your password.
          </p>
        </div>

        {error && (
          <div className="mb-4">
            <AlertBanner type="error" message={error} onDismiss={() => setError('')} />
          </div>
        )}

        {isSubmitted ? (
          <div className="space-y-5 text-center">
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 text-left">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-emerald-900 mb-0.5">Password Reset Requested</h4>
                  <p className="leading-relaxed">
                    If an account is registered with <strong>{email}</strong>, a password reset email has been sent. Please check your inbox and spam folder.
                  </p>
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              size="md"
              className="w-full justify-center"
              onClick={() => onNavigate('/login')}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Return to Sign In
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Registered Email Address"
              type="email"
              placeholder="e.g. student@uniosun.edu.ng"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
              required
              autoComplete="email"
            />

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full justify-center mt-2"
              isLoading={isLoading}
            >
              Send Password Reset Link
            </Button>

            <div className="pt-3 text-center">
              <button
                type="button"
                onClick={() => onNavigate('/login')}
                className="text-xs text-[#6B7280] hover:text-[#242424] inline-flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Sign In</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
