export type StudentKoreanLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
export type StudentTopikLevel = 1 | 2 | 3 | 4 | 5 | 6;

export type StudentProfileCareer = {
  careerId: number;
  careerName: string;
  startMonth: string;
  endMonth: string;
  description: string;
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
