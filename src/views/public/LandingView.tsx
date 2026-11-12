/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  ArrowRight, 
  BookOpen, 
  CheckCircle, 
  FileCheck2, 
  Layers, 
  Sparkles, 
  Clock, 
  ShieldCheck, 
  FileSpreadsheet,
  GraduationCap
} from 'lucide-react';
import { Button } from '../../components/ui/Button';

interface LandingViewProps {
  onNavigate: (path: string) => void;
}

export function LandingView({ onNavigate }: LandingViewProps) {
  const workflowSteps = [
    {
      step: '01',
      title: 'Weekly Logbook Ingestion',
      description:
        'Input your weekly industrial training entries, daily maintenance logs, and project assignments directly or from photos of your physical ITF logbook.',
      icon: FileSpreadsheet,
    },
    {
      step: '02',
      title: 'Institutional Alignment',
      description:
        'Select your university or polytechnic and engineering/science faculty guidelines for required chapter formats, page margins, and preliminary pages.',
      icon: GraduationCap,
    },
    {
      step: '03',
      title: 'Technical Report Synthesis',
      description:
        'Synthesizes raw daily tasks into rigorous engineering and scientific prose across Preliminaries, Organizational Structure, Technical Experience, and Challenges.',
      icon: Layers,
    },
    {
      step: '04',
      title: 'Defense-Ready Export',
      description:
        'Review with department-specific checklists and export print-ready PDF and editable DOCX formats formatted for departmental defense.',
      icon: FileCheck2,
    },
  ];

  const capabilities = [
    {
      title: 'ITF & Department Template Engine',
      description:
        'Pre-configured schemas for Nigerian tertiary institutions including Federal, State, and Private universities, plus Polytechnics.',
    },
    {
      title: 'Weekly Logbook Expansion',
      description:
        'Converts brief logbook phrases into comprehensive, academically rigorous descriptions of industrial machinery, workflows, and protocols.',
    },
    {
      title: 'Technical Figures & Diagram Captions',
      description:
        'Formatted figure, table, and schematic referencing compliant with standard engineering and science defense expectations.',
    },
    {
      title: 'Supervisor Sign-off Readiness',
      description:
        'Generates institutional preliminary pages including Letter of Transmittal, Certification, Acknowledgements, and Abstract.',
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white border-b border-[#E5E7EB] pt-12 pb-16 sm:pt-20 sm:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            {/* Institution Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#FFF5EE] border border-[#FCD6C2] text-xs font-medium text-[#F36B21]">
              <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Engineered for Nigerian Tertiary Institutions</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#242424] text-balance leading-tight">
              Transform Your SIWES Logbook Into a Defense-Ready Technical Report
            </h1>

            {/* Sub-headline */}
            <p className="text-sm sm:text-base text-[#525252] leading-relaxed max-w-2xl mx-auto text-balance">
              SIWES Studio guides Nigerian university and polytechnic students in converting real industrial training logbooks into compliant, professionally structured academic reports.
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
              <Button
                variant="primary"
                size="lg"
                onClick={() => onNavigate('/register')}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="w-full sm:w-auto"
              >
                Get Started
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => onNavigate('/login')}
                className="w-full sm:w-auto"
              >
                Sign In
              </Button>
            </div>

            {/* Trust Points */}
            <div className="pt-8 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-[#6B7280]">
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>NUC & NBTE Aligned</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>3, 6, & 12 Month Schemes</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Print & DOCX Formatted</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section id="workflow" className="py-16 sm:py-24 bg-[#F8F9FA] border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-semibold text-[#F36B21] uppercase tracking-wider">
              Preparation Workflow
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#242424] mt-1.5 tracking-tight">
              From Weekly Logbook to Academic Defense in Four Steps
            </h2>
            <p className="text-xs sm:text-sm text-[#6B7280] mt-2">
              A systematic pipeline that prevents last-minute panic and ensures full adherence to your department guidelines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {workflowSteps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.step}
                  className="bg-white rounded-xl border border-[#E5E7EB] p-6 flex flex-col justify-between hover:border-[#D1D5DB] transition-all shadow-xs"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-mono font-bold text-[#F36B21] bg-[#FFF5EE] px-2 py-0.5 rounded border border-[#FCD6C2]">
                        {step.step}
                      </span>
                      <Icon className="w-5 h-5 text-[#6B7280]" aria-hidden="true" />
                    </div>
                    <h3 className="text-sm font-bold text-[#242424] mb-2">
                      {step.title}
                    </h3>
                    <p className="text-xs text-[#6B7280] leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Capabilities Bento Grid */}
      <section id="capabilities" className="py-16 sm:py-24 bg-white border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-semibold text-[#F36B21] uppercase tracking-wider">
              Core Capabilities
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#242424] mt-1.5 tracking-tight">
              Built Specifically for the Realities of Nigerian SIWES
            </h2>
            <p className="text-xs sm:text-sm text-[#6B7280] mt-2">
              Engineered with deep understanding of institutional requirements, supervisor expectations, and ITF logbook structures.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {capabilities.map((cap, i) => (
              <div
                key={i}
                className="bg-[#F8F9FA] rounded-xl border border-[#E5E7EB] p-6 hover:bg-white hover:border-[#D1D5DB] transition-all shadow-xs"
              >
                <div className="w-8 h-8 rounded-lg bg-white border border-[#E5E7EB] flex items-center justify-center text-[#F36B21] font-semibold text-xs mb-3 shadow-2xs">
                  0{i + 1}
                </div>
                <h3 className="text-sm font-bold text-[#242424] mb-1.5">
                  {cap.title}
                </h3>
                <p className="text-xs text-[#6B7280] leading-relaxed">
                  {cap.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Entry Point CTA */}
      <section className="py-16 sm:py-20 bg-[#F8F9FA]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center bg-white rounded-2xl border border-[#E5E7EB] p-8 sm:p-12 shadow-sm">
          <span className="text-xs font-semibold text-[#F36B21] uppercase tracking-wider">
            Accessible Student Plans
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#242424] mt-2 tracking-tight">
            Clear, Transparent Pricing Tailored for Students
          </h2>
          <p className="text-xs sm:text-sm text-[#6B7280] mt-2 max-w-xl mx-auto leading-relaxed">
            Free starter logbook review, with student-friendly one-off report packages designed specifically for tertiary students in Nigeria.
          </p>
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              variant="primary"
              size="md"
              onClick={() => onNavigate('/pricing')}
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              View Student Pricing
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={() => onNavigate('/register')}
            >
              Create Free Account
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
