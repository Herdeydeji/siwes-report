/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ArrowRight, Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/FormControls';
import { AlertBanner } from '../../components/ui/ErrorState';
import { useAuth } from '../../lib/firebase/AuthContext';
import { getReadableAuthErrorMessage } from '../../lib/firebase/errors';

interface LoginViewProps {
  onNavigate: (path: string) => void;
}

export function LoginView({ onNavigate }: LoginViewProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      // Auth state change handler in App.tsx will route according to verification and onboarding
    } catch (err: any) {
      console.error('Sign in failed:', err);
      setError(getReadableAuthErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-12 sm:py-20 px-4 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-2xl border border-[#E5E7EB] p-7 sm:p-9 shadow-xs">
        <div className="text-center mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#F36B21] flex items-center justify-center text-white font-bold text-base mx-auto mb-3 shadow-xs">
            S
          </div>
          <h1 className="text-xl font-bold text-[#242424]">Sign In to SIWES Studio</h1>
          <p className="text-xs text-[#6B7280] mt-1">
            Access your verified industrial logbooks and report drafts
          </p>
        </div>

        {error && (
          <div className="mb-4">
            <AlertBanner type="error" message={error} onDismiss={() => setError('')} />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="e.g. student@uniosun.edu.ng"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail className="w-4 h-4" />}
            required
            autoComplete="email"
          />

          <div>
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[#6B7280] hover:text-[#242424] cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
              required
              autoComplete="current-password"
            />
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <button
              type="button"
              onClick={() => onNavigate('/forgot-password')}
              className="text-[#F36B21] hover:underline font-medium cursor-pointer"
            >
              Forgot password?
            </button>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            className="w-full justify-center mt-2"
            isLoading={isLoading}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Sign In
          </Button>
        </form>

        <div className="mt-6 pt-5 border-t border-[#F3F4F6] text-center text-xs text-[#6B7280]">
          Don't have an account yet?{' '}
          <button
            onClick={() => onNavigate('/register')}
            className="text-[#F36B21] font-semibold hover:underline cursor-pointer"
          >
            Create student account
          </button>
        </div>
      </div>
    </div>
  );
}
