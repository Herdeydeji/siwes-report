/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Button } from '../components/ui/Button';
import { ArrowLeft, FileQuestion } from 'lucide-react';

export function NotFoundView({ onNavigate }: { onNavigate: (path: string) => void }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-white rounded-2xl border border-[#E5E7EB] p-8 shadow-sm">
        <div className="w-12 h-12 rounded-xl bg-[#FFF5EE] text-[#F36B21] flex items-center justify-center mx-auto mb-4 border border-[#FCD6C2]">
          <FileQuestion className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold text-[#242424] mb-2">Page Not Found</h1>
        <p className="text-xs text-[#6B7280] leading-relaxed mb-6">
          The requested route does not exist in SIWES Studio or may have been moved.
        </p>
        <Button
          variant="primary"
          size="md"
          onClick={() => onNavigate('/')}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          className="mx-auto"
        >
          Return to Home
        </Button>
      </div>
    </div>
  );
}
