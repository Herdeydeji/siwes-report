/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';

interface PublicNavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export function PublicNavbar({ currentPath, onNavigate }: PublicNavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Overview', path: '/' },
    { label: 'Workflow', path: '/#workflow' },
    { label: 'Capabilities', path: '/#capabilities' },
    { label: 'Pricing', path: '/pricing' },
  ];

  const handleLinkClick = (path: string) => {
    setMobileMenuOpen(false);
    if (path.startsWith('/#')) {
      if (currentPath !== '/') {
        onNavigate('/');
        setTimeout(() => {
          const el = document.getElementById(path.replace('/#', ''));
          el?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        const el = document.getElementById(path.replace('/#', ''));
        el?.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      onNavigate(path);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E5E7EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-8">
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate('/')}
              className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
            >
              <div className="w-8 h-8 rounded-lg bg-[#F36B21] flex items-center justify-center text-white font-bold text-sm tracking-tight shadow-xs">
                S
              </div>
              <span className="text-base font-bold text-[#242424] tracking-tight whitespace-nowrap">
                SIWES Studio
              </span>
            </button>
          </div>

          {/* Zone 2: Clean 4–5 single-line navigation links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-[#525252]">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleLinkClick(link.path)}
                className={`transition-colors py-1 cursor-pointer whitespace-nowrap shrink-0 hover:text-[#F36B21] ${
                  currentPath === link.path ? 'text-[#F36B21] font-semibold' : ''
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Zone 3: Primary Action & Sign In */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate('/login')}
              className="text-xs font-medium text-[#525252] hover:text-[#242424] px-3 py-2 cursor-pointer transition-colors whitespace-nowrap shrink-0"
            >
              Sign In
            </button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => onNavigate('/register')}
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Get Started
            </Button>
          </div>

          {/* Mobile menu trigger */}
          <div className="md:hidden flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => onNavigate('/register')}
              className="text-xs px-3 py-1.5"
            >
              Get Started
            </Button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#525252] hover:text-[#242424] hover:bg-[#F3F4F6] transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#E5E7EB] bg-white px-4 pt-2 pb-5 space-y-3">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleLinkClick(link.path)}
                className="text-left py-2.5 px-3 rounded-lg text-xs font-medium text-[#525252] hover:text-[#F36B21] hover:bg-[#FFF5EE] transition-colors"
              >
                {link.label}
              </button>
            ))}
          </nav>
          <div className="pt-3 border-t border-[#F3F4F6] flex flex-col gap-2">
            <Button
              variant="outline"
              size="md"
              className="w-full justify-center"
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate('/login');
              }}
            >
              Sign In
            </Button>
            <Button
              variant="primary"
              size="md"
              className="w-full justify-center"
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate('/register');
              }}
            >
              Get Started
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
