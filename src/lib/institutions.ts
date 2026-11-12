/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface InstitutionOption {
  id: string;
  name: string;
  shortName: string;
  state: string;
  hasVerifiedTemplate: boolean;
  guidelineNote: string;
  faculties: {
    name: string;
    departments: string[];
  }[];
}

export const INSTITUTIONS_CATALOG: InstitutionOption[] = [
  {
    id: 'uniosun',
    name: 'Osun State University (UNIOSUN)',
    shortName: 'UNIOSUN',
    state: 'Osun State',
    hasVerifiedTemplate: true,
    guidelineNote: 'Verified UNIOSUN FET Guidelines: 5 Chapters, 1.5" Left binding margin, 12pt Times New Roman, 1.5 line spacing, Letter of Transmittal to HOD.',
    faculties: [
      {
        name: 'Faculty of Engineering & Technology (FET)',
        departments: [
          'Civil Engineering',
          'Electrical & Electronics Engineering',
          'Mechanical Engineering',
          'Computer Engineering',
        ],
      },
      {
        name: 'Faculty of Science',
        departments: [
          'Computer Science',
          'Information Technology',
          'Industrial Chemistry',
          'Microbiology',
          'Biochemistry',
        ],
      },
      {
        name: 'Faculty of Agriculture',
        departments: [
          'Agronomy',
          'Animal Science',
          'Agricultural Economics',
        ],
      },
    ],
  },
  {
    id: 'futa',
    name: 'Federal University of Technology, Akure (FUTA)',
    shortName: 'FUTA',
    state: 'Ondo State',
    hasVerifiedTemplate: true,
    guidelineNote: 'Verified FUTA SEET Guidelines: 5 Chapters, 1.5" Left binding margin, 12pt font, 1.5 line spacing.',
    faculties: [
      {
        name: 'School of Engineering & Engineering Technology (SEET)',
        departments: [
          'Computer Engineering',
          'Mechanical Engineering',
          'Electrical & Electronics Engineering',
          'Civil Engineering',
          'Metallurgical & Materials Engineering',
        ],
      },
      {
        name: 'School of Computing (SOC)',
        departments: [
          'Computer Science',
          'Software Engineering',
          'Cybersecurity',
          'Information Technology',
        ],
      },
    ],
  },
  {
    id: 'unilag',
    name: 'University of Lagos (UNILAG)',
    shortName: 'UNILAG',
    state: 'Lagos State',
    hasVerifiedTemplate: false,
    guidelineNote: 'Generic Nigerian Tertiary SIWES Standard: 5 standard chapters, awaiting department-specific upload.',
    faculties: [
      {
        name: 'Faculty of Engineering',
        departments: [
          'Chemical & Petroleum Engineering',
          'Civil & Environmental Engineering',
          'Electrical & Electronics Engineering',
          'Mechanical Engineering',
          'Systems Engineering',
        ],
      },
      {
        name: 'Faculty of Science',
        departments: ['Computer Sciences', 'Physics', 'Chemistry'],
      },
    ],
  },
  {
    id: 'ui',
    name: 'University of Ibadan (UI)',
    shortName: 'UI',
    state: 'Oyo State',
    hasVerifiedTemplate: false,
    guidelineNote: 'Generic Nigerian Tertiary SIWES Standard: 5 standard chapters, awaiting department-specific upload.',
    faculties: [
      {
        name: 'Faculty of Technology',
        departments: [
          'Industrial & Production Engineering',
          'Electrical & Electronic Engineering',
          'Mechanical Engineering',
          'Civil Engineering',
        ],
      },
    ],
  },
  {
    id: 'oau',
    name: 'Obafemi Awolowo University (OAU)',
    shortName: 'OAU',
    state: 'Osun State',
    hasVerifiedTemplate: false,
    guidelineNote: 'Generic Nigerian Tertiary SIWES Standard: 5 standard chapters, awaiting department-specific upload.',
    faculties: [
      {
        name: 'Faculty of Technology',
        departments: [
          'Computer Science & Engineering',
          'Electronic & Electrical Engineering',
          'Mechanical Engineering',
          'Chemical Engineering',
        ],
      },
    ],
  },
  {
    id: 'covenant',
    name: 'Covenant University (CU)',
    shortName: 'CU',
    state: 'Ogun State',
    hasVerifiedTemplate: false,
    guidelineNote: 'Generic Nigerian Tertiary SIWES Standard: 5 standard chapters, awaiting department-specific upload.',
    faculties: [
      {
        name: 'College of Engineering (CoE)',
        departments: [
          'Electrical & Information Engineering',
          'Mechanical Engineering',
          'Civil Engineering',
          'Chemical Engineering',
        ],
      },
    ],
  },
  {
    id: 'yabatech',
    name: 'Yaba College of Technology (YABATECH)',
    shortName: 'YABATECH',
    state: 'Lagos State',
    hasVerifiedTemplate: false,
    guidelineNote: 'Generic NBTE Polytechnic Standard: 4-5 chapters, awaiting department-specific upload.',
    faculties: [
      {
        name: 'School of Technology',
        departments: [
          'Computer Science',
          'Electrical & Electronics Engineering Technology',
          'Mechanical Engineering Technology',
        ],
      },
    ],
  },
];

export function findInstitution(idOrName: string): InstitutionOption | undefined {
  if (!idOrName) return undefined;
  const query = idOrName.toLowerCase().trim();
  return INSTITUTIONS_CATALOG.find(
    (inst) =>
      inst.id.toLowerCase() === query ||
      inst.shortName.toLowerCase() === query ||
      inst.name.toLowerCase().includes(query)
  );
}
