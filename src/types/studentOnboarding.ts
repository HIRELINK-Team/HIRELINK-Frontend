import type { StudentKoreanLevel } from './studentProfile';
import type {
  StudentMatchingPriorityUpdate,
  StudentPreferredJobUpdate,
  StudentPreferredLocation,
  StudentPreferredWorkTime,
} from './studentMatchingPreferences';

export type StudentStudyProgram =
  'ASSOCIATE' | 'BACHELOR' | 'MASTER' | 'DOCTORATE' | 'EXCHANGE';

export type StudentOnboardingRequest = {
  birthDate: string;
  currentRegion: string;
  koreanLevel: StudentKoreanLevel;
  studyProgram: StudentStudyProgram;
  careers: {
    careerName: string;
    startMonth: string;
    endMonth: string;
    description: string;
  }[];
  matchingPreferences: {
    businessTypeFlexible: boolean;
    preferredJobs: StudentPreferredJobUpdate[];
    preferredWorkTimes: StudentPreferredWorkTime[];
    preferredLocation: StudentPreferredLocation;
    priorities: StudentMatchingPriorityUpdate[];
  };
};

// Address search does not yet provide the coordinates required by Swagger.
export type StudentOnboardingDraftRequest = Omit<
  StudentOnboardingRequest,
  'matchingPreferences'
> & {
  matchingPreferences: Omit<
    StudentOnboardingRequest['matchingPreferences'],
    'preferredLocation'
  > & {
    preferredLocation: Omit<
      StudentPreferredLocation,
      'latitude' | 'longitude'
    > &
      Partial<Pick<StudentPreferredLocation, 'latitude' | 'longitude'>>;
  };
};

export type StudentOnboardingResponse = {
  studentId: number;
  completed: boolean;
  completedAt: string;
};
