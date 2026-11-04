export type StudentKoreanLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
export type StudentTopikLevel = 1 | 2 | 3 | 4 | 5 | 6;

import type { StudentCareerResponse } from './experience';

export type StudentProfileCareer = StudentCareerResponse;

export type StudentProfileResponse = {
  studentId: number;
  name: string;
  email: string;
  phoneNumber: string;
  birthDate: string;
  nationality: string;
  currentRegion: string;
  koreanLevel: StudentKoreanLevel;
  visaCode: string;
  universityName: string;
  enrollmentStartDate: string;
  studyProgramId: number | null;
  gradeLevel: number | null;
  academicState: string;
  topikLevel: StudentTopikLevel | null;
  stayStartDate: string;
  stayExpirationDate: string;
  profileImageUrl: string | null;
  hirelinkBadgeIssuedAt: string | null;
  careers: StudentProfileCareer[];
};

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
