export type StudentKoreanLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
export type StudentTopikLevel = 1 | 2 | 3 | 4 | 5 | 6;

import type { StudentCareerResponse } from './experience';
import type { StudentPreferredLocation } from './studentMatchingPreferences';
import type { StudentStudyProgram } from './studentOnboarding';

export type StudentProfileCareer = StudentCareerResponse;

export type StudentProfileCreateRequest = {
  name: string;
  birthDate: string;
  nationality: string;
  currentRegion: string;
  koreanLevel: StudentKoreanLevel;
};

export type StudentProfileCreateResponse = {
  studentId: number;
  name: string;
  phoneNumber: string;
  birthDate: string;
  nationality: string;
  currentRegion: string;
  koreanLevel: StudentKoreanLevel;
};

export type StudentProfileResponse = {
  studentId: number;
  name: string;
  email: string | null;
  phoneNumber: string;
  birthDate: string;
  nationality: string;
  currentRegion: string;
  koreanLevel: StudentKoreanLevel;
  visaCode: string | null;
  universityName: string | null;
  enrollmentStartDate: string | null;
  studyProgramId: number | null;
  studyProgram: StudentStudyProgram | null;
  gradeLevel: number | null;
  academicState: string | null;
  topikLevel: StudentTopikLevel | null;
  stayStartDate: string | null;
  stayExpirationDate: string | null;
  profileImageUrl: string | null;
  hirelinkBadgeIssuedAt: string | null;
  careers: StudentProfileCareer[];
};

export type StudentProfileUpdateResponse = Omit<
  StudentProfileResponse,
  'careers' | 'enrollmentStartDate' | 'profileImageUrl' | 'stayStartDate'
>;

export type StudentProfileUpdateRequest = Partial<{
  birthDate: string;
  phoneNumber: string;
  currentRegion: string;
  koreanLevel: StudentKoreanLevel;
  preferredLocation: StudentPreferredLocation;
  careers: StudentProfileCareerInput[];
}>;

export type StudentProfileCareerInput = {
  careerName: string;
  startMonth: string;
  endMonth: string;
  description: string;
};
