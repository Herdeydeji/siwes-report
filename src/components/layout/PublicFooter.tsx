/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface PublicFooterProps {
  onNavigate: (path: string) => void;
}

export function PublicFooter({ onNavigate }: PublicFooterProps) {
  return (
    <footer className="bg-white border-t border-[#E5E7EB] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#F36B21] flex items-center justify-center text-white font-bold text-xs">
                S
              </div>
              <span className="text-base font-bold text-[#242424]">SIWES Studio</span>
            </div>
            <p className="text-xs text-[#6B7280] max-w-sm leading-relaxed">
              SIWES Report Studio helps students in Nigerian tertiary institutions transform actual industrial training logbooks into compliant, professionally structured technical defense reports.
            </p>
            <div className="text-[11px] text-[#9CA3AF]">
              Designed in alignment with National Universities Commission (NUC), NBTE, and Industrial Training Fund (ITF) standards.
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-[#242424] uppercase tracking-wider mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-xs text-[#525252]">
              <li>
                <button
                  onClick={() => onNavigate('/')}
                  className="hover:text-[#F36B21] transition-colors cursor-pointer"
                >
                  Overview & Features
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/pricing')}
                  className="hover:text-[#F36B21] transition-colors cursor-pointer"
                >
                  Student Pricing
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/register')}
                  className="hover:text-[#F36B21] transition-colors cursor-pointer"
                >
                  Create Account
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/login')}
                  className="hover:text-[#F36B21] transition-colors cursor-pointer"
                >
                  Sign In
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-[#242424] uppercase tracking-wider mb-3">
              Institutions & Compliance
            </h4>
            <ul className="space-y-2 text-xs text-[#525252]">
              <li>Universities (Federal, State, Private)</li>
              <li>Polytechnics & Colleges of Tech</li>
              <li>3-Month, 6-Month & 1-Year IT Schemes</li>
              <li>Defense Ready Formatting</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-[#F3F4F6] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6B7280]">
          <div>
            &copy; {new Date().getFullYear()} SIWES Studio. All rights reserved.
          </div>
          <div className="flex items-center gap-6 text-xs">
            <span>Institutional Guidelines Compliant</span>
            <span aria-hidden="true">&middot;</span>
            <span>Version 1.0.0 Foundation</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
