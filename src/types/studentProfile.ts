export type StudentKoreanLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
export type StudentTopikLevel = 1 | 2 | 3 | 4 | 5 | 6;

import type { StudentCareerResponse } from './experience';

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
  email: string;
  phoneNumber: string;
  birthDate: string;
  nationality: string;
  currentRegion: string;
  koreanLevel: StudentKoreanLevel;
  visaCode: string | null;
  universityName: string | null;
  enrollmentStartDate: string | null;
  studyProgramId: number | null;
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
  name: string;
  birthDate: string;
  nationality: string;
  currentRegion: string;
  koreanLevel: StudentKoreanLevel;
  visaCode: string;
  stayExpirationDate: string;
  universityName: string;
  academicState: string;
  topikLevel: StudentTopikLevel | null;
}>;
