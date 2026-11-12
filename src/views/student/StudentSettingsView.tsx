/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/FormControls';
import { AlertBanner } from '../../components/ui/ErrorState';
import { useToast } from '../../components/ui/NotificationToast';
import { useAuth } from '../../lib/firebase/AuthContext';
import { updateStudentProfile } from '../../lib/firebase/authService';
import { INSTITUTIONS_CATALOG, findInstitution } from '../../lib/institutions';
import { Save, User, GraduationCap, Building2, ShieldCheck, Info } from 'lucide-react';

interface StudentSettingsViewProps {
  onNavigate: (path: string) => void;
}

export function StudentSettingsView({ onNavigate }: StudentSettingsViewProps) {
  const { currentUser, userProfile, refreshProfile } = useAuth();
  const { showToast } = useToast();

  const [fullName, setFullName] = useState(userProfile?.fullName || '');
  const [phoneNumber, setPhoneNumber] = useState(userProfile?.phoneNumber || '');
  const [institution, setInstitution] = useState(userProfile?.institution || '');
  const [faculty, setFaculty] = useState(userProfile?.faculty || '');
  const [department, setDepartment] = useState(userProfile?.department || '');
  const [programme, setProgramme] = useState(userProfile?.programme || '');
  const [matricNumber, setMatricNumber] = useState(userProfile?.matricNumber || '');
  const [academicLevel, setAcademicLevel] = useState(userProfile?.academicLevel || '400 Level');
  const [academicSession, setAcademicSession] = useState(userProfile?.academicSession || '2024/2025');

  // Placement info
  const [organisationName, setOrganisationName] = useState(
    userProfile?.placement?.organisationName || ''
  );
  const [organisationAddress, setOrganisationAddress] = useState(
    userProfile?.placement?.organisationAddress || ''
  );
  const [supervisorName, setSupervisorName] = useState(
    userProfile?.placement?.supervisorName || ''
  );
  const [supervisorDesignation, setSupervisorDesignation] = useState(
    userProfile?.placement?.supervisorDesignation || ''
  );

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  // Sync state when userProfile loads
  useEffect(() => {
    if (userProfile) {
      setFullName(userProfile.fullName || '');
      setPhoneNumber(userProfile.phoneNumber || '');
      setInstitution(userProfile.institution || '');
      setFaculty(userProfile.faculty || '');
      setDepartment(userProfile.department || '');
      setProgramme(userProfile.programme || '');
      setMatricNumber(userProfile.matricNumber || '');
      setAcademicLevel(userProfile.academicLevel || '400 Level');
      setAcademicSession(userProfile.academicSession || '2024/2025');
      setOrganisationName(userProfile.placement?.organisationName || '');
      setOrganisationAddress(userProfile.placement?.organisationAddress || '');
      setSupervisorName(userProfile.placement?.supervisorName || '');
      setSupervisorDesignation(userProfile.placement?.supervisorDesignation || '');
    }
  }, [userProfile]);

  const institutionSelectOptions = INSTITUTIONS_CATALOG.map((inst) => ({
    value: inst.name,
    label: `${inst.name} ${inst.hasVerifiedTemplate ? '— Verified Template' : '— Generic'}`,
  }));

  const selectedInstMeta = findInstitution(institution);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    if (!fullName.trim() || !matricNumber.trim() || !department.trim() || !faculty.trim() || !programme.trim()) {
      setError('Full name, faculty, department, programme, and matric number are required.');
      return;
    }

    setError('');
    setIsSaving(true);

    try {
      await updateStudentProfile(currentUser.uid, {
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
        institution,
        faculty: faculty.trim(),
        department: department.trim(),
        programme: programme.trim(),
        matricNumber: matricNumber.trim(),
        academicLevel,
        academicSession,
        placement: {
          organisationName: organisationName.trim(),
          organisationAddress: organisationAddress.trim(),
          supervisorName: supervisorName.trim(),
          supervisorDesignation: supervisorDesignation.trim(),
          ...(userProfile?.placement?.startDate ? { startDate: userProfile.placement.startDate } : {}),
          ...(userProfile?.placement?.endDate ? { endDate: userProfile.placement.endDate } : {}),
        },
      });

      await refreshProfile();
      showToast('success', 'Profile Updated', 'Student parameters saved to Firestore.');
    } catch (err: any) {
      console.error('Save error:', err);
      setError('Could not update profile in Firestore. Please check your connection.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title="Student Account Settings"
        description="Manage your institutional affiliations, matriculation identity, and SIWES placement records."
        breadcrumbs={[
          { label: 'Dashboard', onClick: () => onNavigate('/dashboard') },
          { label: 'Settings' },
        ]}
      />

      {error && (
        <AlertBanner type="error" message={error} onDismiss={() => setError('')} />
      )}

      <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 sm:p-8 shadow-xs">
        <form onSubmit={handleSave} className="space-y-6">
          {/* Academic Identity */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[#242424] pb-2 border-b border-[#F3F4F6] flex items-center gap-2">
              <User className="w-4 h-4 text-[#F36B21]" />
              <span>Personal & Contact Identity</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Legal Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
              <Input
                label="Registered Email (Account Identity)"
                type="email"
                value={currentUser?.email || ''}
                disabled
                helperText="Primary email cannot be modified from settings."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Phone Number"
                type="tel"
                placeholder="e.g. 08012345678"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              <Input
                label="Matric / Reg Number"
                value={matricNumber}
                onChange={(e) => setMatricNumber(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Institutional Affiliation */}
          <div className="space-y-4 pt-2">
            <h3 className="text-sm font-bold text-[#242424] pb-2 border-b border-[#F3F4F6] flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-[#F36B21]" />
              <span>Institutional Affiliation & Guidelines</span>
            </h3>

            <Select
              label="Tertiary Institution"
              options={institutionSelectOptions}
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              required
            />

            <div className={`p-3 rounded-lg border text-xs flex items-start gap-2 ${
              selectedInstMeta?.hasVerifiedTemplate
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-amber-50 border-amber-200 text-amber-800'
            }`}>
              {selectedInstMeta?.hasVerifiedTemplate ? (
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              )}
              <span>
                {selectedInstMeta?.guidelineNote ||
                  'Standard Nigerian Tertiary SIWES template active.'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Faculty / College"
                value={faculty}
                onChange={(e) => setFaculty(e.target.value)}
                required
              />
              <Input
                label="Department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Programme / Course of Study"
                value={programme}
                onChange={(e) => setProgramme(e.target.value)}
                required
              />
              <Input
                label="Academic Session"
                value={academicSession}
                onChange={(e) => setAcademicSession(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Placement Details */}
          <div className="space-y-4 pt-2">
            <h3 className="text-sm font-bold text-[#242424] pb-2 border-b border-[#F3F4F6] flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#F36B21]" />
              <span>SIWES Placement Information</span>
            </h3>

            <Input
              label="Organisation / Company Name"
              value={organisationName}
              onChange={(e) => setOrganisationName(e.target.value)}
              placeholder="e.g. Chevron Nigeria Limited"
            />

            <Input
              label="Organisation Location / Address"
              value={organisationAddress}
              onChange={(e) => setOrganisationAddress(e.target.value)}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Industry-Based Supervisor"
                value={supervisorName}
                onChange={(e) => setSupervisorName(e.target.value)}
              />
              <Input
                label="Supervisor Designation"
                value={supervisorDesignation}
                onChange={(e) => setSupervisorDesignation(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-[#F3F4F6]">
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isSaving}
              leftIcon={<Save className="w-4 h-4" />}
            >
              Save Profile Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
