/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  User, 
  GraduationCap, 
  Building2, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle,
  ShieldCheck,
  Info
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/FormControls';
import { AlertBanner } from '../../components/ui/ErrorState';
import { useAuth } from '../../lib/firebase/AuthContext';
import { useToast } from '../../components/ui/NotificationToast';
import { INSTITUTIONS_CATALOG, findInstitution } from '../../lib/institutions';
import { isValidMatricNumber } from '../../lib/formatters';

interface StudentOnboardingViewProps {
  onNavigate: (path: string) => void;
}

export function StudentOnboardingView({ onNavigate }: StudentOnboardingViewProps) {
  const { currentUser, userProfile, completeOnboarding } = useAuth();
  const { showToast } = useToast();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Step 1: Personal Information
  const [fullName, setFullName] = useState(
    userProfile?.fullName || currentUser?.displayName || ''
  );
  const [email] = useState(userProfile?.email || currentUser?.email || '');
  const [phoneNumber, setPhoneNumber] = useState(userProfile?.phoneNumber || '');

  // Step 2: Academic Information
  const [institution, setInstitution] = useState(
    userProfile?.institution || 'Osun State University (UNIOSUN)'
  );
  const [faculty, setFaculty] = useState(
    userProfile?.faculty || 'Faculty of Engineering & Technology (FET)'
  );
  const [department, setDepartment] = useState(
    userProfile?.department || 'Mechanical Engineering'
  );
  const [programme, setProgramme] = useState(
    userProfile?.programme || 'Mechanical Engineering'
  );
  const [matricNumber, setMatricNumber] = useState(
    userProfile?.matricNumber || ''
  );
  const [academicLevel, setAcademicLevel] = useState(
    userProfile?.academicLevel || '400 Level'
  );
  const [academicSession, setAcademicSession] = useState(
    userProfile?.academicSession || '2024/2025'
  );

  // Step 3: SIWES Placement Information
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
  const [startDate, setStartDate] = useState(
    userProfile?.placement?.startDate || ''
  );
  const [endDate, setEndDate] = useState(
    userProfile?.placement?.endDate || ''
  );

  const selectedInstitutionMeta = findInstitution(institution);

  // Institution dropdown options
  const institutionSelectOptions = INSTITUTIONS_CATALOG.map((inst) => ({
    value: inst.name,
    label: `${inst.name} ${inst.hasVerifiedTemplate ? '— Verified Template' : '— Generic'}`,
  }));

  // Academic level options
  const levelOptions = [
    { value: '300 Level', label: '300 Level (SIWES I / 3 Months)' },
    { value: '400 Level', label: '400 Level (SIWES II / 6 Months)' },
    { value: '500 Level', label: '500 Level (Specialized IT)' },
    { value: 'ND I', label: 'ND I (Polytechnic 3-Month IT)' },
    { value: 'ND II', label: 'ND II (Polytechnic 1-Year Pre-HND IT)' },
    { value: 'HND I', label: 'HND I' },
    { value: 'HND II', label: 'HND II' },
  ];

  // Academic session options
  const sessionOptions = [
    { value: '2024/2025', label: '2024/2025 Academic Session' },
    { value: '2025/2026', label: '2025/2026 Academic Session' },
    { value: '2023/2024', label: '2023/2024 Academic Session' },
  ];

  const handleStep1Next = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim()) {
      setError('Please provide your full legal name as registered with your institution.');
      return;
    }

    setStep(2);
  };

  const handleStep2Next = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!institution) {
      setError('Please select your tertiary institution.');
      return;
    }

    if (!faculty.trim()) {
      setError('Please provide your faculty or school.');
      return;
    }

    if (!department.trim()) {
      setError('Please provide your department.');
      return;
    }

    if (!isValidMatricNumber(matricNumber)) {
      setError('Please enter a valid matriculation / registration number (e.g. 19/0445 or FUTA/CSC/20/1234).');
      return;
    }

    setStep(3);
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!organisationName.trim()) {
      setError('Please provide the name of your SIWES placement organization/company.');
      return;
    }

    setIsSaving(true);
    try {
      await completeOnboarding({
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
        institution,
        faculty: faculty.trim(),
        department: department.trim(),
        programme: (programme || department).trim(),
        matricNumber: matricNumber.trim(),
        academicLevel,
        academicSession,
        placement: {
          organisationName: organisationName.trim(),
          organisationAddress: organisationAddress.trim(),
          supervisorName: supervisorName.trim(),
          supervisorDesignation: supervisorDesignation.trim(),
          startDate,
          endDate,
        },
      });

      showToast('success', 'Onboarding Complete', 'Your academic profile and institutional guidelines are configured.');
      onNavigate('/dashboard');
    } catch (err: any) {
      console.error('Failed to save onboarding:', err);
      setError('Failed to save onboarding details to Firestore. Please ensure your email is verified and all fields are valid.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="py-10 sm:py-16 px-4 max-w-2xl mx-auto">
      {/* Header and Step Indicator */}
      <div className="text-center mb-8">
        <span className="text-xs font-semibold text-[#F36B21] uppercase tracking-wider">
          Student Onboarding
        </span>
        <h1 className="text-2xl font-bold text-[#242424] mt-1">
          Configure Your SIWES Academic Profile
        </h1>
        <p className="text-xs text-[#6B7280] mt-1.5 max-w-md mx-auto">
          We use these details to align your technical report with institutional defense standards and Industrial Training Fund (ITF) requirements.
        </p>

        {/* Step Progression Bar */}
        <div className="flex items-center justify-center gap-3 mt-6">
          <div className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                step >= 1
                  ? 'bg-[#F36B21] text-white'
                  : 'bg-[#E5E7EB] text-[#6B7280]'
              }`}
            >
              1
            </div>
            <span className={`text-xs font-medium ${step >= 1 ? 'text-[#242424]' : 'text-[#9CA3AF]'}`}>
              Personal
            </span>
          </div>

          <div className="w-8 h-0.5 bg-[#E5E7EB]" />

          <div className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                step >= 2
                  ? 'bg-[#F36B21] text-white'
                  : 'bg-[#E5E7EB] text-[#6B7280]'
              }`}
            >
              2
            </div>
            <span className={`text-xs font-medium ${step >= 2 ? 'text-[#242424]' : 'text-[#9CA3AF]'}`}>
              Academic
            </span>
          </div>

          <div className="w-8 h-0.5 bg-[#E5E7EB]" />

          <div className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                step >= 3
                  ? 'bg-[#F36B21] text-white'
                  : 'bg-[#E5E7EB] text-[#6B7280]'
              }`}
            >
              3
            </div>
            <span className={`text-xs font-medium ${step >= 3 ? 'text-[#242424]' : 'text-[#9CA3AF]'}`}>
              Placement
            </span>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6">
          <AlertBanner type="error" message={error} onDismiss={() => setError('')} />
        </div>
      )}

      {/* Surface Card Container */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 sm:p-9 shadow-xs">
        {/* STEP 1: Personal Information */}
        {step === 1 && (
          <form onSubmit={handleStep1Next} className="space-y-4">
            <div className="border-b border-[#F3F4F6] pb-3 mb-2 flex items-center gap-2">
              <User className="w-4 h-4 text-[#F36B21]" />
              <h2 className="text-sm font-bold text-[#242424]">Step 1: Personal Details</h2>
            </div>

            <Input
              label="Full Name (as registered with your institution)"
              placeholder="e.g. Adedeji Adebeso"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              helperText="Will appear on the title page, certification page, and defense transmittal letter."
              required
            />

            <Input
              label="Email Address"
              type="email"
              value={email}
              disabled
              helperText="Authenticated student account email address."
            />

            <Input
              label="Phone Number (Optional)"
              type="tel"
              placeholder="e.g. 08012345678"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              helperText="Used for institutional notifications and supervisor contact coordination."
            />

            <div className="pt-4 flex justify-end">
              <Button
                type="submit"
                variant="primary"
                size="md"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Continue to Academic Info
              </Button>
            </div>
          </form>
        )}

        {/* STEP 2: Academic Information */}
        {step === 2 && (
          <form onSubmit={handleStep2Next} className="space-y-4">
            <div className="border-b border-[#F3F4F6] pb-3 mb-2 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-[#F36B21]" />
              <h2 className="text-sm font-bold text-[#242424]">Step 2: Institutional & Academic Profile</h2>
            </div>

            <Select
              label="Tertiary Institution"
              options={institutionSelectOptions}
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              required
            />

            {/* Institution Template Verification Indicator */}
            <div className={`p-3.5 rounded-xl border text-xs flex items-start gap-2.5 ${
              selectedInstitutionMeta?.hasVerifiedTemplate
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-amber-50 border-amber-200 text-amber-900'
            }`}>
              {selectedInstitutionMeta?.hasVerifiedTemplate ? (
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              )}
              <div className="leading-relaxed">
                <span className="font-semibold block">
                  {selectedInstitutionMeta?.hasVerifiedTemplate
                    ? `Verified Institutional Guideline: ${selectedInstitutionMeta.shortName}`
                    : 'Generic Nigerian Tertiary SIWES Standard'}
                </span>
                <span className="text-[11px] opacity-90">
                  {selectedInstitutionMeta?.guidelineNote ||
                    'Standard 5-chapter NUC/NBTE report configuration will be applied.'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Faculty / School"
                placeholder="e.g. Faculty of Engineering & Technology"
                value={faculty}
                onChange={(e) => setFaculty(e.target.value)}
                required
              />
              <Input
                label="Department"
                placeholder="e.g. Mechanical Engineering"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Course / Programme of Study"
                placeholder="e.g. B.Eng. Mechanical Engineering"
                value={programme}
                onChange={(e) => setProgramme(e.target.value)}
                required
              />
              <Input
                label="Matric / Reg Number"
                placeholder="e.g. 19/ENG/0445"
                value={matricNumber}
                onChange={(e) => setMatricNumber(e.target.value)}
                helperText="Must match your physical ITF logbook number."
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Current Academic Level"
                options={levelOptions}
                value={academicLevel}
                onChange={(e) => setAcademicLevel(e.target.value)}
                required
              />
              <Select
                label="Academic Session"
                options={sessionOptions}
                value={academicSession}
                onChange={(e) => setAcademicSession(e.target.value)}
                required
              />
            </div>

            <div className="pt-4 flex items-center justify-between">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={() => setStep(1)}
                leftIcon={<ArrowLeft className="w-4 h-4" />}
              >
                Back
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Continue to Placement Info
              </Button>
            </div>
          </form>
        )}

        {/* STEP 3: SIWES Placement Information */}
        {step === 3 && (
          <form onSubmit={handleFinalSubmit} className="space-y-4">
            <div className="border-b border-[#F3F4F6] pb-3 mb-2 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#F36B21]" />
              <h2 className="text-sm font-bold text-[#242424]">Step 3: Industrial Placement Details</h2>
            </div>

            <p className="text-xs text-[#6B7280] leading-relaxed">
              Enter your industry attachment details. Optional fields can be completed or adjusted later from your settings.
            </p>

            <Input
              label="Organisation / Company Name"
              placeholder="e.g. Nigerian National Petroleum Company Limited (NNPC)"
              value={organisationName}
              onChange={(e) => setOrganisationName(e.target.value)}
              helperText="Where you underwent your industrial work experience."
              required
            />

            <Input
              label="Organisation Location / Address (Optional)"
              placeholder="e.g. Plot 15, Herbert Macaulay Way, Central Business District, Abuja"
              value={organisationAddress}
              onChange={(e) => setOrganisationAddress(e.target.value)}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Industry Supervisor's Name (Optional)"
                placeholder="e.g. Engr. B. O. Okonjo"
                value={supervisorName}
                onChange={(e) => setSupervisorName(e.target.value)}
                helperText="Appears on certification endorsement page."
              />
              <Input
                label="Supervisor's Designation / Title (Optional)"
                placeholder="e.g. Senior Plant Maintenance Engineer"
                value={supervisorDesignation}
                onChange={(e) => setSupervisorDesignation(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="SIWES Start Date (Optional)"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <Input
                label="SIWES End Date (Optional)"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            <div className="pt-4 flex items-center justify-between">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={() => setStep(2)}
                leftIcon={<ArrowLeft className="w-4 h-4" />}
              >
                Back
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isSaving}
                rightIcon={<CheckCircle2 className="w-4 h-4" />}
              >
                Complete Onboarding & Enter Workspace
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
