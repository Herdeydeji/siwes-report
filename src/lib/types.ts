/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'guest' | 'student' | 'admin';

export interface StudentPlacementInfo {
  organisationName: string;
  organisationAddress?: string;
  supervisorName?: string;
  supervisorDesignation?: string;
  startDate?: string;
  endDate?: string;
}

export interface UserProfile {
  id?: string;
  uid: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  role: 'student' | 'admin';
  emailVerified: boolean;
  onboardingCompleted: boolean;
  institution?: string;
  faculty?: string;
  department?: string;
  programme?: string;
  matricNumber?: string;
  academicLevel?: string; // e.g. "300 Level", "400 Level", "ND II", "HND II"
  academicSession?: string; // e.g. "2024/2025"
  placement?: StudentPlacementInfo;
  avatarUrl?: string;
  createdAt?: any;
  updatedAt?: any;
}

export type SIWESDuration = '3_months' | '6_months' | '12_months';

export type ReportStatus = 
  | 'draft'
  | 'in_review'
  | 'changes_requested'
  | 'approved'
  | 'exported';

export interface SIWESReportSummary {
  id: string;
  title: string;
  studentName: string;
  matricNumber: string;
  institution: string;
  department: string;
  companyName: string;
  duration: SIWESDuration;
  status: ReportStatus;
  progressPercent: number;
  totalLogbookEntries: number;
  lastUpdated: string;
}

export interface InstitutionTemplate {
  id: string;
  name: string;
  shortName: string;
  state: string;
  type: 'Federal University' | 'State University' | 'Private University' | 'Polytechnic';
  reportGuidelines: string;
  standardChaptersCount: number;
  isActive: boolean;
}

export interface ToastMessage {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message?: string;
}
