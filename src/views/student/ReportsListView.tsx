/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PlusCircle, Search, Eye, ArrowRight } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { DataTable, Column } from '../../components/ui/DataTable';
import { StatusIndicator } from '../../components/ui/StatusIndicator';
import { Input } from '../../components/ui/FormControls';
import { SIWESReportSummary } from '../../lib/types';
import { formatSIWESDuration } from '../../lib/formatters';

interface ReportsListViewProps {
  reports: SIWESReportSummary[];
  onNavigate: (path: string) => void;
}

export function ReportsListView({ reports, onNavigate }: ReportsListViewProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredReports = reports.filter(
    (r) =>
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.institution.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns: Column<SIWESReportSummary>[] = [
    {
      key: 'title',
      header: 'Report Title & Organization',
      render: (r) => (
        <div>
          <button
            onClick={() => onNavigate(`/reports/${r.id}`)}
            className="font-semibold text-[#242424] hover:text-[#F36B21] transition-colors text-left block text-xs"
          >
            {r.title}
          </button>
          <span className="text-[11px] text-[#6B7280]">{r.companyName}</span>
        </div>
      ),
    },
    {
      key: 'duration',
      header: 'Duration',
      render: (r) => (
        <span className="text-xs text-[#525252]">
          {formatSIWESDuration(r.duration)}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (r) => <StatusIndicator status={r.status} />,
    },
    {
      key: 'progressPercent',
      header: 'Progress',
      align: 'center',
      render: (r) => (
        <div className="flex items-center justify-center gap-2">
          <div className="w-16 bg-[#E5E7EB] h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-[#F36B21] h-full rounded-full"
              style={{ width: `${r.progressPercent}%` }}
            />
          </div>
          <span className="text-[11px] font-mono tabular-nums text-[#6B7280]">
            {r.progressPercent}%
          </span>
        </div>
      ),
    },
    {
      key: 'lastUpdated',
      header: 'Last Modified',
      render: (r) => (
        <span className="text-xs text-[#6B7280]">{r.lastUpdated}</span>
      ),
    },
    {
      key: 'actions',
      header: 'Action',
      align: 'right',
      render: (r) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onNavigate(`/reports/${r.id}`)}
          rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
        >
          Open
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="My SIWES Reports"
        description="Manage your draft reports, preliminary sections, and export packages."
        breadcrumbs={[
          { label: 'Dashboard', onClick: () => onNavigate('/dashboard') },
          { label: 'Reports' },
        ]}
        actions={
          <Button
            variant="primary"
            size="sm"
            onClick={() => onNavigate('/reports/new')}
            leftIcon={<PlusCircle className="w-4 h-4" />}
          >
            Create New Report
          </Button>
        }
      />

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-xl border border-[#E5E7EB]">
        <div className="w-full sm:w-72">
          <Input
            placeholder="Search by company or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>
        <div className="text-xs text-[#6B7280]">
          Showing <span className="font-semibold text-[#242424]">{filteredReports.length}</span> reports
        </div>
      </div>

      {/* Reports Table & Responsive Cards */}
      <DataTable
        data={filteredReports}
        columns={columns}
        keyExtractor={(r) => r.id}
        emptyMessage="No matching SIWES reports found. Click 'Create New Report' to begin."
        renderMobileCard={(r) => (
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 space-y-3">
            <div className="flex justify-between items-start gap-2">
              <div>
                <h3 className="font-semibold text-xs text-[#242424]">{r.title}</h3>
                <p className="text-[11px] text-[#6B7280]">{r.companyName}</p>
              </div>
              <StatusIndicator status={r.status} />
            </div>
            <div className="flex justify-between items-center text-xs text-[#6B7280] pt-2 border-t border-[#F3F4F6]">
              <span>{formatSIWESDuration(r.duration)}</span>
              <span className="font-mono">{r.progressPercent}% complete</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-center"
              onClick={() => onNavigate(`/reports/${r.id}`)}
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Open Report Workspace
            </Button>
          </div>
        )}
      />
    </div>
  );
}
