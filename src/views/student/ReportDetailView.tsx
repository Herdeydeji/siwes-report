/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  CheckCircle2, 
  Layers, 
  Building, 
  Wrench, 
  Lightbulb, 
  AlertTriangle, 
  HelpCircle,
  ExternalLink,
  Info
} from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { StatusIndicator } from '../../components/ui/StatusIndicator';
import { Dialog } from '../../components/ui/Dialog';
import { useToast } from '../../components/ui/NotificationToast';
import { SIWESReportSummary } from '../../lib/types';
import { formatSIWESDuration } from '../../lib/formatters';

interface ReportDetailViewProps {
  reportId: string;
  report?: SIWESReportSummary;
  onNavigate: (path: string) => void;
}

export function ReportDetailView({
  reportId,
  report,
  onNavigate,
}: ReportDetailViewProps) {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<
    'prelim' | 'ch1' | 'ch2' | 'ch3' | 'ch4' | 'ch5'
  >('ch1');
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [exportType, setExportType] = useState<'pdf' | 'docx'>('pdf');

  // Fallback data if direct URL access
  const activeReport: SIWESReportSummary = report || {
    id: reportId,
    title: 'SIWES Technical Report on Industrial Attachment at Chevron Nigeria Limited',
    studentName: 'Adedeji Adebeso',
    matricNumber: 'CPE/19/8402',
    institution: 'Federal University of Technology, Akure (FUTA)',
    department: 'Computer Engineering (SEET)',
    companyName: 'Chevron Nigeria Limited (Escravos Operations)',
    duration: '6_months',
    status: 'draft',
    progressPercent: 65,
    totalLogbookEntries: 16,
    lastUpdated: 'Today at 09:30 AM',
  };

  const tabs = [
    { id: 'prelim', label: 'Preliminaries (i-vii)', icon: FileText },
    { id: 'ch1', label: 'Chapter 1: Organization', icon: Building },
    { id: 'ch2', label: 'Chapter 2: Work Experience', icon: Wrench },
    { id: 'ch3', label: 'Chapter 3: Special Project', icon: Lightbulb },
    { id: 'ch4', label: 'Chapter 4: Challenges & Safety', icon: AlertTriangle },
    { id: 'ch5', label: 'Chapter 5: Conclusion', icon: CheckCircle2 },
  ];

  const handleExportClick = (type: 'pdf' | 'docx') => {
    setExportType(type);
    setExportModalOpen(true);
  };

  const handleExecuteExport = () => {
    setExportModalOpen(false);
    showToast(
      'info',
      `${exportType.toUpperCase()} Export Prepared`,
      'Document compiler is architected for Phase 4 server-side document generation.'
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={activeReport.title}
        description={`${activeReport.companyName} · ${formatSIWESDuration(activeReport.duration)} · Matric: ${activeReport.matricNumber}`}
        breadcrumbs={[
          { label: 'Dashboard', onClick: () => onNavigate('/dashboard') },
          { label: 'Reports', onClick: () => onNavigate('/reports') },
          { label: 'Report Workspace' },
        ]}
        badge={<StatusIndicator status={activeReport.status} />}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExportClick('docx')}
              leftIcon={<Download className="w-3.5 h-3.5" />}
            >
              Export DOCX
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleExportClick('pdf')}
              leftIcon={<Printer className="w-3.5 h-3.5" />}
            >
              Export PDF
            </Button>
          </div>
        }
      />

      {/* Phase Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <span>
          <strong>Phase 1 Foundation:</strong> Reusable report workspace container with full chapter breakdown compliant with Nigerian tertiary institution guidelines. Real-time document rendering runs in later phases.
        </span>
      </div>

      {/* Chapter Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2 border-b border-[#E5E7EB] no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                isActive
                  ? 'bg-[#242424] text-white font-semibold shadow-2xs'
                  : 'text-[#525252] hover:bg-[#F3F4F6] hover:text-[#242424]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Chapter Content Surface */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 sm:p-10 shadow-xs">
        {activeTab === 'prelim' && (
          <div className="space-y-6">
            <div className="border-b border-[#F3F4F6] pb-4">
              <span className="text-[11px] font-mono font-semibold text-[#F36B21] uppercase">
                Pages i – vii
              </span>
              <h2 className="text-lg font-bold text-[#242424]">
                Preliminary Pages & Institutional Endorsements
              </h2>
            </div>
            <div className="space-y-4 text-xs text-[#525252] leading-relaxed">
              <div className="p-4 rounded-lg bg-[#F8F9FA] border border-[#E5E7EB]">
                <h4 className="font-semibold text-[#242424] mb-1">1. Letter of Transmittal</h4>
                <p>Addressed to the Head of Department, submitting the report in partial fulfillment of the requirements for the award of Bachelor of Engineering (B.Eng).</p>
              </div>
              <div className="p-4 rounded-lg bg-[#F8F9FA] border border-[#E5E7EB]">
                <h4 className="font-semibold text-[#242424] mb-1">2. Certification & Supervisor Sign-off</h4>
                <p>Formal endorsement block signed by Industry-Based Supervisor, Institutional Coordinator, and Head of Department.</p>
              </div>
              <div className="p-4 rounded-lg bg-[#F8F9FA] border border-[#E5E7EB]">
                <h4 className="font-semibold text-[#242424] mb-1">3. Acknowledgements & Abstract</h4>
                <p>Summary of industrial work experience, skills acquired, and primary technical contributions.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ch1' && (
          <div className="space-y-6">
            <div className="border-b border-[#F3F4F6] pb-4">
              <span className="text-[11px] font-mono font-semibold text-[#F36B21] uppercase">
                Chapter 1
              </span>
              <h2 className="text-lg font-bold text-[#242424]">
                Introduction & Establishment Profile
              </h2>
            </div>
            <div className="space-y-4 text-xs text-[#525252] leading-relaxed">
              <h3 className="text-sm font-semibold text-[#242424]">1.1 History and Background of Establishment</h3>
              <p>
                {activeReport.companyName} was established to deliver world-class operations in Nigeria. During the attachment period, the student was integrated into operational divisions adhering to Nigerian Industrial Training Fund (ITF) statutory objectives.
              </p>

              <h3 className="text-sm font-semibold text-[#242424] pt-2">1.2 Corporate Organogram & Departmental Divisions</h3>
              <p>
                The organizational structure incorporates management hierarchies, engineering supervision lines, HSE committees, and operational maintenance units.
              </p>

              <div className="p-4 rounded-lg border border-dashed border-[#D1D5DB] bg-[#FAFAFA] text-center text-xs text-[#6B7280]">
                Figure 1.1: Functional Organogram of {activeReport.companyName} (Auto-formatted for NUC/NBTE Margins)
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ch2' && (
          <div className="space-y-6">
            <div className="border-b border-[#F3F4F6] pb-4">
              <span className="text-[11px] font-mono font-semibold text-[#F36B21] uppercase">
                Chapter 2
              </span>
              <h2 className="text-lg font-bold text-[#242424]">
                Technical Work Experience & Operations
              </h2>
            </div>
            <div className="space-y-4 text-xs text-[#525252] leading-relaxed">
              <h3 className="text-sm font-semibold text-[#242424]">2.1 Routine Technical Duties</h3>
              <p>
                Daily preventive inspections, diagnostic troubleshooting, instrumentation calibrating, and network topology configurations recorded in weekly logbook entries.
              </p>
              <h3 className="text-sm font-semibold text-[#242424] pt-2">2.2 Tools, Machinery and Specialized Software Utilized</h3>
              <p>
                Hands-on application with industrial apparatus, measuring instruments, programmable logic controllers, and simulation environments.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'ch3' && (
          <div className="space-y-6">
            <div className="border-b border-[#F3F4F6] pb-4">
              <span className="text-[11px] font-mono font-semibold text-[#F36B21] uppercase">
                Chapter 3
              </span>
              <h2 className="text-lg font-bold text-[#242424]">
                Special Project & Case Study Analysis
              </h2>
            </div>
            <div className="space-y-4 text-xs text-[#525252] leading-relaxed">
              <h3 className="text-sm font-semibold text-[#242424]">3.1 Problem Formulation & Project Scope</h3>
              <p>
                Detailed investigative study on an industrial problem encountered during attachment, articulating problem background, engineering formulation, and testing methodology.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'ch4' && (
          <div className="space-y-6">
            <div className="border-b border-[#F3F4F6] pb-4">
              <span className="text-[11px] font-mono font-semibold text-[#F36B21] uppercase">
                Chapter 4
              </span>
              <h2 className="text-lg font-bold text-[#242424]">
                Industrial Experience Challenges & Safety Protocols
              </h2>
            </div>
            <div className="space-y-4 text-xs text-[#525252] leading-relaxed">
              <h3 className="text-sm font-semibold text-[#242424]">4.1 Technical Bottlenecks & Solutions</h3>
              <p>
                Real-world engineering limitations, procurement delays, power irregularities, and how technical teams adapted to resolve them.
              </p>
              <h3 className="text-sm font-semibold text-[#242424] pt-2">4.2 Health, Safety & Environment (HSE) Compliance</h3>
              <p>
                Adherence to PPE regulations, fire safety protocols, and zero-incident workplace mandates.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'ch5' && (
          <div className="space-y-6">
            <div className="border-b border-[#F3F4F6] pb-4">
              <span className="text-[11px] font-mono font-semibold text-[#F36B21] uppercase">
                Chapter 5
              </span>
              <h2 className="text-lg font-bold text-[#242424]">
                Conclusion & Recommendations
              </h2>
            </div>
            <div className="space-y-4 text-xs text-[#525252] leading-relaxed">
              <h3 className="text-sm font-semibold text-[#242424]">5.1 Assessment of Scheme Objectives</h3>
              <p>
                Evaluation of the bridge between theoretical coursework taught in Nigerian tertiary classrooms and actual industrial practice.
              </p>
              <h3 className="text-sm font-semibold text-[#242424] pt-2">5.2 Recommendations to Industrial Training Fund (ITF)</h3>
              <p>
                Constructive feedback regarding student allowances, supervision visits, and industry placement partnerships.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Export Confirmation Dialog */}
      <Dialog
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        title={`Export ${exportType.toUpperCase()} Technical Report`}
        description="Verify institutional defense formatting before compilation."
      >
        <div className="space-y-4 text-xs text-[#525252]">
          <div className="p-3 bg-[#F8F9FA] rounded-lg border border-[#E5E7EB] space-y-1">
            <p><strong>Report:</strong> {activeReport.title}</p>
            <p><strong>Format:</strong> {exportType === 'pdf' ? 'Print-ready PDF (A4, 1.5" Binding margin)' : 'Editable Microsoft Word (.docx)'}</p>
            <p><strong>Institution:</strong> {activeReport.institution}</p>
          </div>
          <div className="flex justify-end gap-2.5 pt-2">
            <Button variant="outline" size="sm" onClick={() => setExportModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleExecuteExport}>
              Compile & Export
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
