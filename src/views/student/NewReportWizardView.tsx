/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Building, Calendar, User, FileText, CheckCircle2 } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { Input, Select, Textarea } from '../../components/ui/FormControls';
import { useToast } from '../../components/ui/NotificationToast';
import { UserProfile, SIWESReportSummary, SIWESDuration } from '../../lib/types';

interface NewReportWizardViewProps {
  user: UserProfile;
  onNavigate: (path: string) => void;
  onCreateReport: (report: SIWESReportSummary) => void;
}

export function NewReportWizardView({
  user,
  onNavigate,
  onCreateReport,
}: NewReportWizardViewProps) {
  const { showToast } = useToast();
  const [title, setTitle] = useState('Technical Report on Industrial Work Experience Scheme at MainOne Telecommunications');
  const [companyName, setCompanyName] = useState('MainOne Cable Company (An Equinix Company)');
  const [companyAddress, setCompanyAddress] = useState('Victoria Island, Lagos State, Nigeria');
  const [departmentPlaced, setDepartmentPlaced] = useState('Network Operations & Infrastructure Engineering');
  const [industrySupervisor, setIndustrySupervisor] = useState('Engr. T. A. Balogun (MNSE, COREN Reg.)');
  const [duration, setDuration] = useState<SIWESDuration>('6_months');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const durationOptions = [
    { value: '3_months', label: '3 Months (12 Weeks) — SIWES I' },
    { value: '6_months', label: '6 Months (24 Weeks) — SIWES II' },
    { value: '12_months', label: '1 Year (48 Weeks) — Polytechnic / Specialized IT' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !companyName.trim()) {
      setError('Please provide report title and placement organization.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const newId = `rep-${Date.now().toString().slice(-4)}`;
      const newReport: SIWESReportSummary = {
        id: newId,
        title,
        studentName: user.fullName,
        matricNumber: user.matricNumber || 'MATRIC/001',
        institution: user.institution || 'Nigerian Tertiary Institution',
        department: user.department || 'Engineering',
        companyName,
        duration,
        status: 'draft',
        progressPercent: 15,
        totalLogbookEntries: 0,
        lastUpdated: 'Just now',
      };

      onCreateReport(newReport);
      showToast('success', 'Report Initialized', 'Your institutional report layout has been created.');
      onNavigate(`/reports/${newId}`);
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title="Initialize New SIWES Report"
        description="Configure your industrial placement parameters and institutional report format."
        breadcrumbs={[
          { label: 'Dashboard', onClick: () => onNavigate('/dashboard') },
          { label: 'Reports', onClick: () => onNavigate('/reports') },
          { label: 'New Report' },
        ]}
      />

      <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 sm:p-8 shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[#242424] pb-2 border-b border-[#F3F4F6] flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#F36B21]" />
              <span>1. Report & Placement Details</span>
            </h3>

            <Input
              label="Official Report Title"
              placeholder="e.g. Technical Report on Students Industrial Work Experience Scheme (SIWES)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              helperText="Must conform to your department's cover page naming convention."
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Placement Organization Name"
                placeholder="e.g. Nigerian National Petroleum Corporation (NNPC)"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                leftIcon={<Building className="w-4 h-4" />}
                required
              />

              <Select
                label="SIWES Duration Scheme"
                options={durationOptions}
                value={duration}
                onChange={(e) => setDuration(e.target.value as SIWESDuration)}
                required
              />
            </div>

            <Input
              label="Organization Location / Address"
              placeholder="e.g. Plot 14, Commercial Avenue, Ikeja, Lagos"
              value={companyAddress}
              onChange={(e) => setCompanyAddress(e.target.value)}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Department Assigned During Attachment"
                placeholder="e.g. Transmission & Quality Assurance"
                value={departmentPlaced}
                onChange={(e) => setDepartmentPlaced(e.target.value)}
                required
              />

              <Input
                label="Industry-Based Supervisor Name & Designation"
                placeholder="e.g. Engr. K. A. Johnson, Senior Plant Engineer"
                value={industrySupervisor}
                onChange={(e) => setIndustrySupervisor(e.target.value)}
                leftIcon={<User className="w-4 h-4" />}
                helperText="Will appear on the official Letter of Transmittal."
              />
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-bold text-[#242424] pb-2 border-b border-[#F3F4F6] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#F36B21]" />
              <span>2. Institutional Guideline Alignment</span>
            </h3>
            <div className="bg-[#F8F9FA] p-4 rounded-lg border border-[#E5E7EB] text-xs text-[#525252] space-y-1.5">
              <p>
                <strong>Institution:</strong> {user.institution}
              </p>
              <p>
                <strong>Faculty & Department:</strong> {user.department}
              </p>
              <p>
                <strong>Chapter Layout:</strong> 5 Standard Chapters (Preliminaries, Establishment Profile, Operations Experience, Special Projects, Conclusion & Recommendations)
              </p>
            </div>
          </div>

          {error && <p className="text-xs text-red-600">{error}</p>}

          <div className="flex items-center justify-between pt-4 border-t border-[#F3F4F6]">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => onNavigate('/reports')}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Create Report Workspace
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
