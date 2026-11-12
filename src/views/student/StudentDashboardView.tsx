/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  FileText, 
  PlusCircle, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  BookOpen,
  Building2,
  AlertCircle,
  ShieldCheck,
  GraduationCap
} from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { StatusIndicator } from '../../components/ui/StatusIndicator';
import { EmptyState } from '../../components/ui/EmptyState';
import { UserProfile, SIWESReportSummary } from '../../lib/types';
import { formatSIWESDuration } from '../../lib/formatters';
import { findInstitution } from '../../lib/institutions';

interface StudentDashboardViewProps {
  user: UserProfile;
  onNavigate: (path: string) => void;
  reports: SIWESReportSummary[];
}

export function StudentDashboardView({
  user,
  onNavigate,
  reports,
}: StudentDashboardViewProps) {
  const activeReport = reports[0];
  const institutionMeta = findInstitution(user.institution || '');

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome, ${user.fullName.split(' ')[0] || 'Student'}`}
        description={`${user.institution || 'Nigerian Tertiary Institution'} · ${user.department || 'Department'}${
          user.matricNumber ? ` · Matric: ${user.matricNumber}` : ''
        }`}
        actions={
          <Button
            variant="primary"
            size="sm"
            onClick={() => onNavigate('/reports/new')}
            leftIcon={<PlusCircle className="w-4 h-4" />}
          >
            New Report
          </Button>
        }
      />

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-[#E5E7EB] shadow-2xs">
          <div className="flex items-center justify-between text-[#6B7280] mb-2">
            <span className="text-xs font-medium">My SIWES Reports</span>
            <FileText className="w-4 h-4 text-[#F36B21]" />
          </div>
          <div className="text-2xl font-bold text-[#242424] font-mono tabular-nums">
            {reports.length}
          </div>
          <p className="text-[11px] text-[#6B7280] mt-1">
            {reports.length > 0
              ? `${reports.filter((r) => r.status === 'draft').length} in draft`
              : 'No reports initialized yet'}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E5E7EB] shadow-2xs">
          <div className="flex items-center justify-between text-[#6B7280] mb-2">
            <span className="text-xs font-medium">Weekly Logbook Entries</span>
            <Clock className="w-4 h-4 text-[#F36B21]" />
          </div>
          <div className="text-2xl font-bold text-[#242424] font-mono tabular-nums">
            {activeReport ? activeReport.totalLogbookEntries : 0}
            <span className="text-sm font-normal text-[#6B7280]">
              {' '}
              / {activeReport ? (activeReport.duration === '3_months' ? 12 : 24) : 24} wks
            </span>
          </div>
          <p className="text-[11px] text-[#6B7280] mt-1">
            {activeReport
              ? `${Math.round(
                  (activeReport.totalLogbookEntries /
                    (activeReport.duration === '3_months' ? 12 : 24)) *
                    100
                )}% duration coverage`
              : 'Awaiting logbook entries'}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E5E7EB] shadow-2xs">
          <div className="flex items-center justify-between text-[#6B7280] mb-2">
            <span className="text-xs font-medium">Guideline Template</span>
            <BookOpen className="w-4 h-4 text-[#F36B21]" />
          </div>
          <div className="text-sm font-bold text-[#242424] truncate">
            {institutionMeta?.shortName || user.institution?.split('(')[0]?.trim() || 'Generic'}
          </div>
          <p
            className={`text-[11px] font-medium mt-1 flex items-center gap-1 ${
              institutionMeta?.hasVerifiedTemplate ? 'text-emerald-700' : 'text-amber-700'
            }`}
          >
            {institutionMeta?.hasVerifiedTemplate ? (
              <>
                <CheckCircle2 className="w-3 h-3" />
                <span>Verified Guideline</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-3 h-3" />
                <span>Standard Generic</span>
              </>
            )}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E5E7EB] shadow-2xs">
          <div className="flex items-center justify-between text-[#6B7280] mb-2">
            <span className="text-xs font-medium">Academic Level</span>
            <GraduationCap className="w-4 h-4 text-[#F36B21]" />
          </div>
          <div className="text-sm font-bold text-[#242424] truncate">
            {user.academicLevel || 'Undergraduate'}
          </div>
          <p className="text-[11px] text-[#6B7280] mt-1">
            Session: {user.academicSession || '2024/2025'}
          </p>
        </div>
      </div>

      {/* Active Report Section or Genuine Empty State */}
      {activeReport ? (
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F3F4F6]">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <StatusIndicator status={activeReport.status} />
                <span className="text-xs text-[#6B7280]">
                  Updated {activeReport.lastUpdated}
                </span>
              </div>
              <h2 className="text-lg font-bold text-[#242424]">
                {activeReport.title}
              </h2>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => onNavigate(`/reports/${activeReport.id}`)}
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Open Workspace
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs text-[#525252]">
            <div>
              <span className="text-[#6B7280] block text-[11px]">Industrial Placement:</span>
              <span className="font-semibold text-[#242424]">{activeReport.companyName}</span>
            </div>
            <div>
              <span className="text-[#6B7280] block text-[11px]">Duration:</span>
              <span className="font-semibold text-[#242424]">
                {formatSIWESDuration(activeReport.duration)}
              </span>
            </div>
            <div>
              <span className="text-[#6B7280] block text-[11px]">Department:</span>
              <span className="font-semibold text-[#242424]">{activeReport.department}</span>
            </div>
          </div>
        </div>
      ) : (
        <EmptyState
          icon={FileText}
          title="No SIWES Reports Initialized"
          description="You have not created any technical report drafts yet. Start your first report by selecting your industrial placement and duration."
          actionLabel="Create Your First Report"
          onAction={() => onNavigate('/reports/new')}
        />
      )}

      {/* Institutional Guidelines Alert & Real Rulebook */}
      <div className="bg-[#FFF5EE] border border-[#FCD6C2] rounded-xl p-5">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-[#F36B21] shrink-0 mt-0.5" />
          <div className="flex-1 text-xs">
            <h3 className="font-bold text-[#242424] mb-1">
              Active Institutional Rulebook: {user.institution || 'Nigerian Tertiary Institution'}
            </h3>
            <p className="text-[#525252] leading-relaxed mb-3">
              {institutionMeta?.guidelineNote ||
                'Standard 5-chapter report configuration: Preliminaries, Organization Profile, Technical Work Experience, Special Projects, and Conclusions & Recommendations.'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-[11px] text-[#242424] font-medium">
              <div className="bg-white/80 px-2.5 py-1.5 rounded border border-[#FCD6C2]/60">
                1.5" Left Margin (Binding)
              </div>
              <div className="bg-white/80 px-2.5 py-1.5 rounded border border-[#FCD6C2]/60">
                12pt Font, 1.5 Line Spacing
              </div>
              <div className="bg-white/80 px-2.5 py-1.5 rounded border border-[#FCD6C2]/60">
                Preliminaries: Roman (i - vii)
              </div>
              <div className="bg-white/80 px-2.5 py-1.5 rounded border border-[#FCD6C2]/60">
                Chapters: Arabic (1 - 5)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
