/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Check, Info, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { formatCurrencyNGN } from '../../lib/formatters';

interface PricingViewProps {
  onNavigate: (path: string) => void;
}

export function PricingView({ onNavigate }: PricingViewProps) {
  const plans = [
    {
      name: 'Starter Logbook',
      price: 0,
      description: 'Ideal for inspecting your institutional guidelines and testing logbook entry formatting.',
      popular: false,
      features: [
        'Weekly logbook digitization (up to 4 weeks)',
        'Institutional guideline checklist',
        'Preliminary page outline preview',
        'Basic technical glossary',
      ],
      buttonLabel: 'Get Started Free',
      buttonVariant: 'outline' as const,
    },
    {
      name: 'Standard Report',
      price: 3500,
      description: 'Complete 5-chapter technical SIWES report customized for your institution and department.',
      popular: true,
      features: [
        'Full duration synthesis (up to 24 weeks / 6 months)',
        'Complete 5 chapters + Preliminaries',
        'Institution-specific formatting (margins, font, spacing)',
        'Print-ready PDF & editable Word (DOCX) export',
        'Technical figures & schematic placeholders',
      ],
      buttonLabel: 'Select Standard Plan',
      buttonVariant: 'primary' as const,
    },
    {
      name: 'Premium Defense Suite',
      price: 6500,
      description: 'Comprehensive package including defense presentation outline and supervisor revision support.',
      popular: false,
      features: [
        'Everything in Standard Report',
        'Up to 48 weeks synthesis (1-year IT schemes)',
        'Departmental defense presentation slides outline',
        'Supervisor revision iterations & feedback checker',
        'Technical interview / defense Q&A preparation guide',
      ],
      buttonLabel: 'Select Defense Suite',
      buttonVariant: 'outline' as const,
    },
  ];

  return (
    <div className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
        <span className="text-xs font-semibold text-[#F36B21] uppercase tracking-wider">
          Student Pricing
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#242424] mt-2 tracking-tight">
          Affordable, Transparent Pricing for Nigerian Students
        </h1>
        <p className="text-xs sm:text-sm text-[#6B7280] mt-3 leading-relaxed">
          No subscriptions or hidden fees. Single one-off report packages designed to fit student allowances and project budgets.
        </p>

        {/* Phase 1 Notice */}
        <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800 text-left">
          <Info className="w-4 h-4 shrink-0 text-amber-600" />
          <span>
            Phase 1 Foundation: Payment gateways are not connected in this phase. All tier selections route to the student workspace preview.
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-2xl bg-white p-7 flex flex-col justify-between transition-all relative ${
              plan.popular
                ? 'border-2 border-[#F36B21] shadow-md'
                : 'border border-[#E5E7EB] shadow-xs'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#F36B21] text-white text-[11px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
                Most Popular for Defense
              </div>
            )}

            <div>
              <div className="mb-4">
                <h3 className="text-base font-bold text-[#242424]">{plan.name}</h3>
                <p className="text-xs text-[#6B7280] mt-1 leading-relaxed min-h-[36px]">
                  {plan.description}
                </p>
              </div>

              <div className="py-4 border-y border-[#F3F4F6] mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-[#242424] font-mono tabular-nums">
                    {plan.price === 0 ? 'Free' : formatCurrencyNGN(plan.price)}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-xs text-[#6B7280]">/ one-off report</span>
                  )}
                </div>
              </div>

              <div className="space-y-3 mb-8">
                <p className="text-xs font-semibold text-[#242424] uppercase tracking-wider">
                  Includes:
                </p>
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-[#525252]">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <Button
              variant={plan.buttonVariant}
              size="md"
              className="w-full justify-center"
              onClick={() => onNavigate('/register')}
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              {plan.buttonLabel}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
