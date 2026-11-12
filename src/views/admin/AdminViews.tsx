/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Users, 
  FileCheck, 
  Building2, 
  BookOpen, 
  CreditCard, 
  Layers, 
  Activity, 
  Sliders, 
  PlusCircle, 
  Search, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Info
} from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { DataTable, Column } from '../../components/ui/DataTable';
import { StatusIndicator } from '../../components/ui/StatusIndicator';
import { Input, Select } from '../../components/ui/FormControls';
import { useToast } from '../../components/ui/NotificationToast';
import { formatCurrencyNGN } from '../../lib/formatters';

// --- 1. Admin Overview View ---
export function AdminOverviewView({ onNavigate }: { onNavigate: (path: string) => void }) {
  const metrics = [
    { label: 'Registered Students', value: '1,428', change: '+12% this month', icon: Users },
    { label: 'SIWES Reports Compiled', value: '894', change: '85% completion rate', icon: FileCheck },
    { label: 'Configured Institutions', value: '46', change: 'Federal, State, Private', icon: Building2 },
    { label: 'Approved Guideline Templates', value: '128', change: 'Across 14 faculties', icon: BookOpen },
  ];

  const recentUsers = [
    { name: 'Adedeji Adebeso', institution: 'FUTA', department: 'Computer Engineering', status: 'active', joined: 'Today' },
    { name: 'Chidinma Okeke', institution: 'UNILAG', department: 'Chemical Engineering', status: 'active', joined: 'Yesterday' },
    { name: 'Ibrahim Danladi', institution: 'ABU Zaria', department: 'Mechanical Engineering', status: 'active', joined: '2 days ago' },
    { name: 'Blessing Adeleke', institution: 'University of Ibadan', department: 'Agricultural Science', status: 'active', joined: '3 days ago' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Administrative Overview"
        description="System governance, institutional guideline adherence, and platform activity."
        actions={
          <Button
            variant="primary"
            size="sm"
            onClick={() => onNavigate('/admin/institutions')}
            leftIcon={<PlusCircle className="w-4 h-4" />}
          >
            Manage Institutions
          </Button>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, i) => {
          const Icon = m.icon;
          return (
            <div key={i} className="bg-white p-5 rounded-xl border border-[#E5E7EB] shadow-2xs">
              <div className="flex items-center justify-between text-[#6B7280] mb-2">
                <span className="text-xs font-medium">{m.label}</span>
                <Icon className="w-4 h-4 text-[#F36B21]" />
              </div>
              <div className="text-2xl font-bold text-[#242424] font-mono tabular-nums">
                {m.value}
              </div>
              <p className="text-[11px] text-emerald-700 font-medium mt-1">
                {m.change}
              </p>
            </div>
          );
        })}
      </div>

      {/* System Status Banner */}
      <div className="bg-[#FFF5EE] border border-[#FCD6C2] rounded-xl p-4 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-[#F36B21] shrink-0" />
          <div>
            <h4 className="font-bold text-[#242424]">Foundation Phase Active</h4>
            <p className="text-[#525252]">Server-side rule enforcement and Firestore security audits active.</p>
          </div>
        </div>
        <span className="text-[#F36B21] font-mono font-medium">Phase 1</span>
      </div>

      {/* Recent Users Table */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-bold text-[#242424]">Recent Student Registrations</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('/admin/users')}
          >
            View All Users
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-[#E5E7EB] text-[#6B7280]">
                <th className="py-2.5 px-3 font-semibold">Student Name</th>
                <th className="py-2.5 px-3 font-semibold">Institution</th>
                <th className="py-2.5 px-3 font-semibold">Department</th>
                <th className="py-2.5 px-3 font-semibold">Status</th>
                <th className="py-2.5 px-3 font-semibold">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3F4F6]">
              {recentUsers.map((u, i) => (
                <tr key={i} className="hover:bg-[#F9FAFB]">
                  <td className="py-2.5 px-3 font-semibold text-[#242424]">{u.name}</td>
                  <td className="py-2.5 px-3 text-[#525252]">{u.institution}</td>
                  <td className="py-2.5 px-3 text-[#525252]">{u.department}</td>
                  <td className="py-2.5 px-3"><StatusIndicator status={u.status as any} /></td>
                  <td className="py-2.5 px-3 text-[#6B7280]">{u.joined}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// --- 2. Admin Users View ---
export function AdminUsersView() {
  const [search, setSearch] = useState('');
  const users = [
    { id: 'usr-1', name: 'Adedeji Adebeso', email: 'adedeji@futa.edu.ng', role: 'student', institution: 'FUTA', matric: 'CPE/19/8402', status: 'active' },
    { id: 'usr-2', name: 'Chidinma Okeke', email: 'c.okeke@unilag.edu.ng', role: 'student', institution: 'UNILAG', matric: '180402091', status: 'active' },
    { id: 'usr-3', name: 'Dr. E. O. Adebayo', email: 'admin@siwesstudio.ng', role: 'admin', institution: 'Platform Staff', matric: 'STAFF/01', status: 'active' },
    { id: 'usr-4', name: 'Ibrahim Danladi', email: 'i.danladi@abu.edu.ng', role: 'student', institution: 'ABU Zaria', matric: 'U17ME1045', status: 'active' },
    { id: 'usr-5', name: 'Blessing Adeleke', email: 'b.adeleke@ui.edu.ng', role: 'student', institution: 'UI Ibadan', matric: '204911', status: 'pending' },
  ];

  const filtered = users.filter((u) => u.name.toLowerCase().includes(search.toLowerCase()) || u.institution.toLowerCase().includes(search.toLowerCase()));

  const columns: Column<any>[] = [
    { key: 'name', header: 'User', render: (u) => <div><div className="font-semibold text-[#242424]">{u.name}</div><div className="text-[11px] text-[#6B7280]">{u.email}</div></div> },
    { key: 'role', header: 'Role', render: (u) => <span className="font-mono text-xs uppercase text-[#525252]">{u.role}</span> },
    { key: 'institution', header: 'Institution', render: (u) => <span className="text-xs">{u.institution}</span> },
    { key: 'matric', header: 'Matric / Staff ID', render: (u) => <span className="font-mono text-xs text-[#6B7280]">{u.matric}</span> },
    { key: 'status', header: 'Status', render: (u) => <StatusIndicator status={u.status} /> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Management"
        description="Oversee registered student accounts, institutional affiliations, and staff permissions."
      />
      <div className="bg-white p-4 rounded-xl border border-[#E5E7EB] flex items-center justify-between">
        <Input
          placeholder="Search by student name or institution..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-72"
          leftIcon={<Search className="w-4 h-4" />}
        />
        <span className="text-xs text-[#6B7280]">Total Accounts: {users.length}</span>
      </div>
      <DataTable data={filtered} columns={columns} keyExtractor={(u) => u.id} />
    </div>
  );
}

// --- 3. Admin Reports View ---
export function AdminReportsView() {
  const reports = [
    { id: 'rep-01', student: 'Adedeji Adebeso', institution: 'FUTA', title: 'Technical Attachment at Chevron Nigeria Ltd', status: 'draft', chapters: '3 / 5', flags: 0 },
    { id: 'rep-02', student: 'Chidinma Okeke', institution: 'UNILAG', title: 'Industrial Training at Dangote Refinery Lekki', status: 'in_review', chapters: '5 / 5', flags: 0 },
    { id: 'rep-03', student: 'Ibrahim Danladi', institution: 'ABU Zaria', title: 'Mechanical Plant Operations at Peugeot Automobile', status: 'approved', chapters: '5 / 5', flags: 0 },
    { id: 'rep-04', student: 'Blessing Adeleke', institution: 'UI Ibadan', title: 'Agronomic Research Attachment at IITA Ibadan', status: 'draft', chapters: '2 / 5', flags: 1 },
  ];

  const columns: Column<any>[] = [
    { key: 'title', header: 'Report Title', render: (r) => <div><div className="font-semibold text-[#242424]">{r.title}</div><div className="text-[11px] text-[#6B7280]">{r.student} · {r.institution}</div></div> },
    { key: 'status', header: 'Workflow State', render: (r) => <StatusIndicator status={r.status} /> },
    { key: 'chapters', header: 'Chapters Complete', render: (r) => <span className="font-mono text-xs">{r.chapters}</span> },
    { key: 'flags', header: 'Audit Status', render: (r) => r.flags === 0 ? <span className="text-emerald-700 text-xs flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Verified</span> : <span className="text-amber-700 text-xs flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> Review Needed</span> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Report Oversight & Quality Audits"
        description="Monitor submitted reports across Nigerian tertiary institutions for guideline conformance."
      />
      <DataTable data={reports} columns={columns} keyExtractor={(r) => r.id} />
    </div>
  );
}

// --- 4. Admin Institutions View ---
export function AdminInstitutionsView() {
  const institutions = [
    { id: 'inst-1', name: 'Federal University of Technology, Akure', code: 'FUTA', type: 'Federal University', state: 'Ondo', templates: 18, status: 'active' },
    { id: 'inst-2', name: 'University of Lagos', code: 'UNILAG', type: 'Federal University', state: 'Lagos', templates: 24, status: 'active' },
    { id: 'inst-3', name: 'University of Ibadan', code: 'UI', type: 'Federal University', state: 'Oyo', templates: 16, status: 'active' },
    { id: 'inst-4', name: 'Obafemi Awolowo University', code: 'OAU', type: 'Federal University', state: 'Osun', templates: 20, status: 'active' },
    { id: 'inst-5', name: 'Covenant University', code: 'CU', type: 'Private University', state: 'Ogun', templates: 12, status: 'active' },
    { id: 'inst-6', name: 'Yaba College of Technology', code: 'YABATECH', type: 'Polytechnic', state: 'Lagos', templates: 14, status: 'active' },
  ];

  const columns: Column<any>[] = [
    { key: 'name', header: 'Institution Name', render: (i) => <div><span className="font-semibold text-[#242424]">{i.name}</span> <span className="font-mono text-xs text-[#F36B21]">({i.code})</span></div> },
    { key: 'type', header: 'Category', render: (i) => <span className="text-xs text-[#525252]">{i.type}</span> },
    { key: 'state', header: 'State', render: (i) => <span className="text-xs text-[#6B7280]">{i.state}</span> },
    { key: 'templates', header: 'Active Guidelines', render: (i) => <span className="font-mono text-xs">{i.templates}</span> },
    { key: 'status', header: 'Status', render: (i) => <StatusIndicator status={i.status} /> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tertiary Institutions Directory"
        description="Nigerian universities, polytechnics, and colleges with active SIWES guideline rulebooks."
      />
      <DataTable data={institutions} columns={columns} keyExtractor={(i) => i.id} />
    </div>
  );
}

// --- 5. Admin Templates View ---
export function AdminTemplatesView() {
  const templates = [
    { id: 'tpl-1', faculty: 'Engineering & Technology (SEET)', chapters: 5, font: 'Times New Roman 12pt', lineSpacing: '1.5', bindingMargin: '1.5 inch', status: 'active' },
    { id: 'tpl-2', faculty: 'Physical & Computing Sciences', chapters: 5, font: 'Arial / Times 12pt', lineSpacing: '1.5', bindingMargin: '1.5 inch', status: 'active' },
    { id: 'tpl-3', faculty: 'Agriculture & Forestry', chapters: 5, font: 'Times New Roman 12pt', lineSpacing: '2.0', bindingMargin: '1.25 inch', status: 'active' },
    { id: 'tpl-4', faculty: 'Polytechnic Engineering Technology (NBTE)', chapters: 4, font: 'Times New Roman 12pt', lineSpacing: '1.5', bindingMargin: '1.5 inch', status: 'active' },
  ];

  const columns: Column<any>[] = [
    { key: 'faculty', header: 'Faculty / Division Guideline', render: (t) => <span className="font-semibold text-[#242424]">{t.faculty}</span> },
    { key: 'chapters', header: 'Chapters', render: (t) => <span className="font-mono text-xs">{t.chapters} Chapters</span> },
    { key: 'font', header: 'Typography & Spacing', render: (t) => <span className="text-xs text-[#6B7280]">{t.font} · {t.lineSpacing} spacing</span> },
    { key: 'bindingMargin', header: 'Binding Margin', render: (t) => <span className="font-mono text-xs">{t.bindingMargin}</span> },
    { key: 'status', header: 'Status', render: (t) => <StatusIndicator status={t.status} /> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Institutional Guideline Templates"
        description="Standard chapter requirements, margin definitions, and preliminary page rules by academic faculty."
      />
      <DataTable data={templates} columns={columns} keyExtractor={(t) => t.id} />
    </div>
  );
}

// --- 6. Admin Payments View ---
export function AdminPaymentsView() {
  const transactions = [
    { id: 'tx-1001', student: 'Chidinma Okeke', plan: 'Standard Report', amount: 3500, ref: 'TX-NG-88912', status: 'paid', date: 'Today, 10:14 AM' },
    { id: 'tx-1002', student: 'Ibrahim Danladi', plan: 'Premium Defense Suite', amount: 6500, ref: 'TX-NG-88913', status: 'paid', date: 'Yesterday' },
    { id: 'tx-1003', student: 'Emeka Nwosu', plan: 'Standard Report', amount: 3500, ref: 'TX-NG-88914', status: 'pending', date: '2 days ago' },
  ];

  const columns: Column<any>[] = [
    { key: 'ref', header: 'Reference', render: (tx) => <span className="font-mono text-xs text-[#242424]">{tx.ref}</span> },
    { key: 'student', header: 'Student', render: (tx) => <span className="font-semibold text-xs text-[#242424]">{tx.student}</span> },
    { key: 'plan', header: 'Plan Package', render: (tx) => <span className="text-xs text-[#525252]">{tx.plan}</span> },
    { key: 'amount', header: 'Amount (NGN)', render: (tx) => <span className="font-mono text-xs font-bold text-[#242424]">{formatCurrencyNGN(tx.amount)}</span> },
    { key: 'status', header: 'Status', render: (tx) => <StatusIndicator status={tx.status} /> },
    { key: 'date', header: 'Date', render: (tx) => <span className="text-xs text-[#6B7280]">{tx.date}</span> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payments Ledger"
        description="Student report package transactions and financial audits."
      />
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <span>Payment integrations (Bachs/Paystack) are intentionally scheduled for Phase 3. Ledger architecture is established.</span>
      </div>
      <DataTable data={transactions} columns={columns} keyExtractor={(tx) => tx.id} />
    </div>
  );
}

// --- 7. Admin Plans View ---
export function AdminPlansView() {
  const plans = [
    { id: 'plan-1', name: 'Starter Logbook', price: 0, duration: 'Up to 4 weeks', activeUsers: 480, status: 'active' },
    { id: 'plan-2', name: 'Standard Report', price: 3500, duration: '24 weeks (6 months)', activeUsers: 840, status: 'active' },
    { id: 'plan-3', name: 'Premium Defense Suite', price: 6500, duration: '48 weeks (1 year)', activeUsers: 108, status: 'active' },
  ];

  const columns: Column<any>[] = [
    { key: 'name', header: 'Plan Tier', render: (p) => <span className="font-semibold text-xs text-[#242424]">{p.name}</span> },
    { key: 'price', header: 'Price (NGN)', render: (p) => <span className="font-mono text-xs font-bold">{p.price === 0 ? 'Free' : formatCurrencyNGN(p.price)}</span> },
    { key: 'duration', header: 'Coverage', render: (p) => <span className="text-xs text-[#6B7280]">{p.duration}</span> },
    { key: 'activeUsers', header: 'Enrolled Students', render: (p) => <span className="font-mono text-xs">{p.activeUsers}</span> },
    { key: 'status', header: 'Status', render: (p) => <StatusIndicator status={p.status} /> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Subscription & Package Plans"
        description="Configure student tier pricing and feature bundles."
      />
      <DataTable data={plans} columns={columns} keyExtractor={(p) => p.id} />
    </div>
  );
}

// --- 8. Admin Activity View ---
export function AdminActivityView() {
  const activities = [
    { id: 'act-1', event: 'New Institution Guideline Published', user: 'Admin Adebayo', ip: '102.89.44.12 (Lagos, NG)', time: '12 mins ago' },
    { id: 'act-2', event: 'Report Export DOCX Generated', user: 'Student Okeke (UNILAG)', ip: '197.210.55.90 (Ikeja, NG)', time: '45 mins ago' },
    { id: 'act-3', event: 'Student Account Registered', user: 'Adedeji Adebeso (FUTA)', ip: '105.112.82.11 (Akure, NG)', time: '2 hours ago' },
    { id: 'act-4', event: 'Security Rule Verification Passed', user: 'System Task', ip: '127.0.0.1 (Server)', time: '4 hours ago' },
  ];

  const columns: Column<any>[] = [
    { key: 'event', header: 'Platform Event', render: (a) => <span className="font-semibold text-xs text-[#242424]">{a.event}</span> },
    { key: 'user', header: 'Actor / User', render: (a) => <span className="text-xs text-[#525252]">{a.user}</span> },
    { key: 'ip', header: 'Network Context', render: (a) => <span className="font-mono text-xs text-[#6B7280]">{a.ip}</span> },
    { key: 'time', header: 'Timestamp', render: (a) => <span className="text-xs text-[#6B7280]">{a.time}</span> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit Logs & Platform Activity"
        description="Real-time operational records, security events, and student interaction telemetry."
      />
      <DataTable data={activities} columns={columns} keyExtractor={(a) => a.id} />
    </div>
  );
}

// --- 9. Admin Settings View ---
export function AdminSettingsView() {
  const { showToast } = useToast();
  const [academicSession, setAcademicSession] = useState('2025/2026 Academic Session');
  const [defaultMargin, setDefaultMargin] = useState('1.5 inch Left Binding / 1.0 inch Top, Right, Bottom');
  const [maxLogbookEntries, setMaxLogbookEntries] = useState('48 weeks');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      showToast('success', 'System Parameters Updated', 'Default institutional parameters saved.');
    }, 400);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title="System Governance & Parameters"
        description="Global platform parameters, academic session defaults, and institutional margin standards."
      />
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 sm:p-8">
        <form onSubmit={handleSave} className="space-y-5">
          <Input
            label="Current Default Academic Session"
            value={academicSession}
            onChange={(e) => setAcademicSession(e.target.value)}
            helperText="Applied to newly initiated SIWES cover pages."
          />
          <Input
            label="Standard Binding Margin Rule"
            value={defaultMargin}
            onChange={(e) => setDefaultMargin(e.target.value)}
            helperText="NUC and NBTE prescribed margin for physical thesis binding."
          />
          <Input
            label="Maximum Allowed Logbook Duration"
            value={maxLogbookEntries}
            onChange={(e) => setMaxLogbookEntries(e.target.value)}
          />
          <div className="flex justify-end pt-3 border-t border-[#F3F4F6]">
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isSaving}
            >
              Save System Parameters
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
