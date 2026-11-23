import type {
  CreateStudentApplicationRequest,
  CreateStudentApplicationResponse,
  StudentApplication,
  StudentApplicationDetail,
  StudentApplicationsResponse,
  WithdrawStudentApplicationResponse,
} from '../types/studentApplication';
import type {
  StudentEmploymentMatchListItem,
  StudentEmploymentMatchesResponse,
  StudentEmploymentMatchResponse,
} from '../types/studentMatch';
import type {
  StudentMatchingPreferencesResponse,
  StudentMatchingPreferencesUpdateRequest,
} from '../types/studentMatchingPreferences';
import type {
  StudentProfileResponse,
  StudentProfileUpdateRequest,
  StudentProfileUpdateResponse,
} from '../types/studentProfile';
import type {
  CreateStudentRecommendationsResponse,
  StudentRecommendation,
  StudentRecommendationDetailResponse,
  StudentRecommendationRefreshResponse,
  StudentRecommendationsResponse,
} from '../types/studentRecommendation';
import type { StudentJobPostingDetail } from '../types/studentJobPosting';

const now = () => new Date().toISOString();
const future = (hours: number) =>
  new Date(Date.now() + hours * 60 * 60 * 1_000).toISOString();

let demoProfile: StudentProfileResponse = {
  academicState: 'ENROLLED',
  birthDate: '2002-04-18',
  careers: [
    {
      careerId: 1,
      careerName: '카페 스태프',
      description: '카페 음료 제조 및 고객 응대',
      endMonth: '2026-08',
      startMonth: '2026-01',
    },
  ],
  currentRegion: '서울특별시 동작구',
  email: 'student.demo@hirelink.local',
  enrollmentStartDate: '2025-03-01',
  gradeLevel: 2,
  hirelinkBadgeIssuedAt: null,
  koreanLevel: 'INTERMEDIATE',
  name: '김유학생',
  nationality: '베트남',
  phoneNumber: '010-0000-0000',
  profileImageUrl: null,
  stayExpirationDate: '2027-12-31',
  stayStartDate: '2025-02-20',
  studentId: 999_999,
  studyProgramId: 1,
  studyProgram: 'BACHELOR',
  topikLevel: 3,
  universityName: '하이어링크대학교',
  visaCode: 'D-2-2',
};

let demoMatchingPreferences: StudentMatchingPreferencesResponse = {
  businessTypeFlexible: false,
  preferredJobs: [
    {
      businessTypeId: 1,
      businessTypeName: 'FOOD_CAFE',
      otherJobName: null,
    },
  ],
  preferredLocation: {
    latitude: 37.4965,
    locationName: '서울특별시 동작구',
    longitude: 126.9574,
    radiusM: 3_000,
  },
  preferredWorkTimes: [
    { dayOfWeek: 'MON', endTime: '22:00', startTime: '16:00' },
    { dayOfWeek: 'WED', endTime: '22:00', startTime: '16:00' },
    { dayOfWeek: 'FRI', endTime: '22:00', startTime: '16:00' },
  ],
  priorities: [
    { criterionId: 1, criterionName: 'WORK_TIME', priorityOrder: 1 },
    { criterionId: 2, criterionName: 'WAGE', priorityOrder: 2 },
    { criterionId: 3, criterionName: 'DISTANCE', priorityOrder: 3 },
    { criterionId: 4, criterionName: 'BUSINESS_TYPE', priorityOrder: 4 },
  ],
};

type DemoStudentRecommendation = StudentRecommendation & {
  walkingTimeMinutes: number;
};

let demoRecommendations: DemoStudentRecommendation[] = [
  {
    applicationId: null,
    applicationStatus: null,
    jobPostingId: 101,
    jobTitle: '바리스타',
    matchScore: 92,
    rank: 1,
    recommendationId: 1001,
    walkingTimeMinutes: 12,
    recommendationReasons: ['근무 시간이 일치해요', '희망 지역과 가까워요'],
    wageAmount: 13_000,
    wageType: 'HOURLY',
    workplaceAddress: '서울특별시 동작구 상도로 369',
    workplaceName: '하이어링크 카페',
    workTimes: [
      { dayOfWeek: 'MON', endTime: '22:00', startTime: '16:00' },
      { dayOfWeek: 'WED', endTime: '22:00', startTime: '16:00' },
      { dayOfWeek: 'FRI', endTime: '22:00', startTime: '16:00' },
    ],
  },
  {
    applicationId: null,
    applicationStatus: null,
    jobPostingId: 102,
    jobTitle: '매장 스태프',
    matchScore: 84,
    rank: 2,
    recommendationId: 1002,
    walkingTimeMinutes: 18,
    recommendationReasons: ['한국어 수준이 일치해요', '희망 급여 이상이에요'],
    wageAmount: 12_500,
    wageType: 'HOURLY',
    workplaceAddress: '서울특별시 마포구 월드컵북로 21',
    workplaceName: '링크 편의점',
    workTimes: [
      { dayOfWeek: 'TUE', endTime: '20:00', startTime: '14:00' },
      { dayOfWeek: 'THU', endTime: '20:00', startTime: '14:00' },
    ],
  },
];

let demoApplications: StudentApplication[] = [
  {
    applicationId: 2001,
    appliedAt: now(),
    desiredStartDate: '2026-12-01',
    employerResponseDeadline: future(18),
    jobPostingId: 103,
    jobTitle: '서버',
    matchId: null,
    offerId: null,
    offerStatus: null,
    offeredAt: null,
    recommendationReasons: ['근무 시간이 일치해요'],
    status: 'WAITING_RESPONSE',
    studentResponseDeadline: null,
    wageAmount: 13_000,
    wageType: 'HOURLY',
    workplaceName: '하이어링크 레스토랑',
  },
  {
    applicationId: 2002,
    appliedAt: now(),
    desiredStartDate: '2026-12-10',
    employerResponseDeadline: future(12),
    jobPostingId: 104,
    jobTitle: '주방 보조',
    matchId: null,
    offerId: 3002,
    offerStatus: 'PENDING',
    offeredAt: now(),
    recommendationReasons: ['희망 지역과 가까워요'],
    status: 'OFFERED',
    studentResponseDeadline: future(20),
    wageAmount: 13_500,
    wageType: 'HOURLY',
    workplaceName: '링크 키친',
  },
  {
    applicationId: 2003,
    appliedAt: now(),
    desiredStartDate: '2026-11-20',
    employerResponseDeadline: future(1),
    jobPostingId: 105,
    jobTitle: '카페 스태프',
    matchId: 4003,
    offerId: 3003,
    offerStatus: 'ACCEPTED',
    offeredAt: now(),
    recommendationReasons: ['근무 시간과 지역이 일치해요'],
    status: 'COMPLETED',
    studentResponseDeadline: future(1),
    wageAmount: 13_000,
    wageType: 'HOURLY',
    workplaceName: '그린 카페',
  },
];

let demoMatches: Array<
  StudentEmploymentMatchListItem & { employerPhoneNumber?: string }
> = [
  {
    applicationId: 2003,
    desiredStartDate: '2026-11-20',
    employerPhoneNumber: '010-1111-2222',
    jobPostingId: 105,
    jobTitle: '카페 스태프',
    matchId: 4003,
    matchedAt: now(),
    offerId: 3003,
    student: null,
    wageAmount: 13_000,
    wageType: 'HOURLY',
    workplaceName: '그린 카페',
  },
];

function findApplication(applicationId: string | number) {
  return demoApplications.find(
    (application) => application.applicationId === Number(applicationId),
  );
}

function toApplicationDetail(
  application: StudentApplication,
): StudentApplicationDetail {
  return {
    ...application,
    endReason: null,
    endedAt: null,
    jobTitle: application.jobTitle,
    respondedAt:
      application.offerStatus === 'ACCEPTED' ? application.offeredAt : null,
    status: application.status,
    workplaceAddress: '서울특별시 동작구 상도로 369',
    workTimes: [
      { dayOfWeek: 'MON', endTime: '22:00', startTime: '16:00' },
      { dayOfWeek: 'WED', endTime: '22:00', startTime: '16:00' },
      { dayOfWeek: 'FRI', endTime: '22:00', startTime: '16:00' },
    ],
  };
}

export async function getDemoStudentProfile() {
  return structuredClone(demoProfile);
}

export async function updateDemoStudentProfile(
  request: StudentProfileUpdateRequest,
): Promise<StudentProfileUpdateResponse> {
  const { birthDate, phoneNumber, currentRegion, koreanLevel, careers } =
    request;
  demoProfile = {
    ...demoProfile,
    ...(birthDate !== undefined && { birthDate }),
    ...(phoneNumber !== undefined && { phoneNumber }),
    ...(currentRegion !== undefined && { currentRegion }),
    ...(koreanLevel !== undefined && { koreanLevel }),
    ...(careers && {
      careers: careers.map((career, index) => ({
        ...career,
        careerId: index + 1,
      })),
    }),
  };
  return structuredClone({
    academicState: demoProfile.academicState,
    birthDate: demoProfile.birthDate,
    currentRegion: demoProfile.currentRegion,
    email: demoProfile.email,
    gradeLevel: demoProfile.gradeLevel,
    hirelinkBadgeIssuedAt: demoProfile.hirelinkBadgeIssuedAt,
    koreanLevel: demoProfile.koreanLevel,
    name: demoProfile.name,
    nationality: demoProfile.nationality,
    phoneNumber: demoProfile.phoneNumber,
    stayExpirationDate: demoProfile.stayExpirationDate,
    studentId: demoProfile.studentId,
    studyProgramId: demoProfile.studyProgramId,
    studyProgram: demoProfile.studyProgram,
    topikLevel: demoProfile.topikLevel,
    universityName: demoProfile.universityName,
    visaCode: demoProfile.visaCode,
  });
}

export async function getDemoStudentMatchingPreferences() {
  return structuredClone(demoMatchingPreferences);
}

export async function updateDemoStudentMatchingPreferences(
  request: StudentMatchingPreferencesUpdateRequest,
) {
  const businessTypeNames: Record<number, string> = {
    1: 'FOOD_CAFE',
    2: 'RETAIL',
    3: 'OFFICE_AND_TOURISM',
    4: 'INTERPRETATION',
    5: 'DUTY_FREE',
    6: 'ACADEMIC',
    7: 'INTERNSHIP',
    8: 'OTHER',
  };
  const criterionNames = {
    1: 'WORK_TIME',
    2: 'WAGE',
    3: 'DISTANCE',
    4: 'BUSINESS_TYPE',
  } as const;
  demoMatchingPreferences = {
    ...demoMatchingPreferences,
    businessTypeFlexible:
      request.businessTypeFlexible ??
      demoMatchingPreferences.businessTypeFlexible,
    preferredJobs:
      request.preferredJobs?.map((job) => ({
        businessTypeId: job.businessTypeId,
        otherJobName: job.otherJobName ?? null,
        businessTypeName: businessTypeNames[job.businessTypeId] ?? 'OTHER',
      })) ?? demoMatchingPreferences.preferredJobs,
    preferredLocation:
      request.preferredLocation ?? demoMatchingPreferences.preferredLocation,
    preferredWorkTimes:
      request.preferredWorkTimes ?? demoMatchingPreferences.preferredWorkTimes,
    priorities:
      request.priorities?.map((priority) => ({
        ...priority,
        criterionName:
          criterionNames[priority.criterionId as keyof typeof criterionNames],
      })) ?? demoMatchingPreferences.priorities,
  };
  return structuredClone(demoMatchingPreferences);
}

export async function getDemoStudentRecommendations(): Promise<StudentRecommendationsResponse> {
  return {
    batchId: 1,
    generatedAt: now(),
    recommendations: structuredClone(demoRecommendations),
    refreshRequired: false,
  };
}

export async function getDemoStudentRecommendation(
  recommendationId: string | number,
): Promise<StudentRecommendationDetailResponse> {
  const recommendation = demoRecommendations.find(
    (item) => item.recommendationId === Number(recommendationId),
  );
  if (!recommendation) throw new Error('Demo recommendation not found.');
  return { ...structuredClone(recommendation), batchId: 1, generatedAt: now() };
}

export async function createDemoStudentRecommendations(): Promise<CreateStudentRecommendationsResponse> {
  return {
    batchId: 1,
    generatedAt: now(),
    recommendationCount: demoRecommendations.length,
  };
}

export async function refreshDemoStudentRecommendations(): Promise<StudentRecommendationRefreshResponse> {
  return {
    batchId: 1,
    generatedAt: now(),
    recommendationCount: demoRecommendations.length,
    refreshed: true,
  };
}

export async function getDemoStudentApplications(): Promise<StudentApplicationsResponse> {
  return { applications: structuredClone(demoApplications) };
}

export async function getDemoStudentApplication(
  applicationId: string | number,
) {
  const application = findApplication(applicationId);
  if (!application) throw new Error('Demo application not found.');
  return structuredClone(toApplicationDetail(application));
}

export async function createDemoStudentApplication(
  request: CreateStudentApplicationRequest,
): Promise<CreateStudentApplicationResponse> {
  const recommendation = demoRecommendations.find(
    (item) => item.recommendationId === request.recommendationId,
  );
  if (!recommendation) throw new Error('Demo recommendation not found.');

  const applicationId =
    Math.max(...demoApplications.map((item) => item.applicationId)) + 1;
  const appliedAt = now();
  const employerResponseDeadline = future(24);
  demoApplications = [
    ...demoApplications,
    {
      applicationId,
      appliedAt,
      desiredStartDate: request.desiredStartDate,
      employerResponseDeadline,
      jobPostingId: recommendation.jobPostingId,
      jobTitle: recommendation.jobTitle,
      matchId: null,
      offerId: null,
      offerStatus: null,
      offeredAt: null,
      recommendationReasons: recommendation.recommendationReasons,
      status: 'WAITING_RESPONSE',
      studentResponseDeadline: null,
      wageAmount: recommendation.wageAmount,
      wageType: recommendation.wageType,
      workplaceName: recommendation.workplaceName,
    },
  ];
  demoRecommendations = demoRecommendations.map((item) =>
    item.recommendationId === request.recommendationId
      ? { ...item, applicationId, applicationStatus: 'WAITING_RESPONSE' }
      : item,
  );
  return {
    applicationId,
    appliedAt,
    desiredStartDate: request.desiredStartDate,
    employerResponseDeadline,
    jobPostingId: recommendation.jobPostingId,
    status: 'WAITING_RESPONSE',
  };
}

export async function withdrawDemoStudentApplication(
  applicationId: string | number,
): Promise<WithdrawStudentApplicationResponse> {
  const numericId = Number(applicationId);
  demoApplications = demoApplications.filter(
    (application) => application.applicationId !== numericId,
  );
  return {
    applicationId: numericId,
    endedAt: now(),
    endReason: 'WITHDRAWN',
    status: 'ENDED',
  };
}

export async function acceptDemoStudentEmploymentOffer(
  offerId: string | number,
) {
  const numericOfferId = Number(offerId);
  const application = demoApplications.find(
    (item) => item.offerId === numericOfferId,
  );
  if (!application) throw new Error('Demo offer not found.');
  const matchId = 4_000 + application.applicationId;
  const respondedAt = now();
  demoApplications = demoApplications.map((item) =>
    item.applicationId === application.applicationId
      ? { ...item, matchId, offerStatus: 'ACCEPTED', status: 'COMPLETED' }
      : item,
  );
  demoMatches = [
    ...demoMatches,
    {
      applicationId: application.applicationId,
      desiredStartDate: application.desiredStartDate,
      jobPostingId: application.jobPostingId,
      jobTitle: application.jobTitle,
      matchId,
      matchedAt: respondedAt,
      offerId: numericOfferId,
      student: null,
      wageAmount: application.wageAmount,
      wageType: application.wageType,
      workplaceName: application.workplaceName,
    },
  ];
  return {
    applicationId: application.applicationId,
    applicationStatus: 'COMPLETED' as const,
    matchId,
    offerId: numericOfferId,
    offerStatus: 'ACCEPTED' as const,
    respondedAt,
  };
}

export async function rejectDemoStudentEmploymentOffer(
  offerId: string | number,
) {
  const numericOfferId = Number(offerId);
  const application = demoApplications.find(
    (item) => item.offerId === numericOfferId,
  );
  if (!application) throw new Error('Demo offer not found.');
  const respondedAt = now();
  demoApplications = demoApplications.filter(
    (item) => item.applicationId !== application.applicationId,
  );
  return {
    applicationId: application.applicationId,
    applicationStatus: 'ENDED' as const,
    endedAt: respondedAt,
    endReason: 'STUDENT_REJECTED' as const,
    offerId: numericOfferId,
    offerStatus: 'REJECTED' as const,
    respondedAt,
  };
}

export async function getDemoEmploymentMatches(): Promise<StudentEmploymentMatchesResponse> {
  return { matches: structuredClone(demoMatches) };
}

export async function getDemoEmploymentMatch(
  matchId: string | number,
): Promise<StudentEmploymentMatchResponse> {
  const match = demoMatches.find((item) => item.matchId === Number(matchId));
  if (!match) throw new Error('Demo match not found.');
  return {
    ...structuredClone(match),
    contact: { name: '박점장', phoneNumber: '010-1111-2222' },
    workplaceAddress: '서울특별시 동작구 상도로 369',
    workTimes: [
      { dayOfWeek: 'MON', endTime: '22:00', startTime: '16:00' },
      { dayOfWeek: 'WED', endTime: '22:00', startTime: '16:00' },
    ],
  };
}

export async function getDemoStudentJobPosting(
  jobPostingId: string | number,
): Promise<StudentJobPostingDetail> {
  const recommendation = demoRecommendations.find(
    (item) => item.jobPostingId === Number(jobPostingId),
  );
  if (!recommendation) throw new Error('Demo job posting not found.');
  return {
    applicationDeadlineDate: '2026-12-31',
    businessTypeId: 1,
    businessTypeName: 'FOOD_CAFE',
    jobPostingId: recommendation.jobPostingId,
    jobRole: recommendation.jobTitle,
    latitude: 37.4965,
    longitude: 126.9574,
    preferredExperience: '카페 근무 경험',
    recruitmentCount: 2,
    requiredKoreanLevel: 'INTERMEDIATE',
    status: 'RECRUITING',
    title: recommendation.jobTitle,
    wageAmount: recommendation.wageAmount,
    wageType: recommendation.wageType,
    workplaceAddress: recommendation.workplaceAddress,
    workplaceId: 1,
    workplaceName: recommendation.workplaceName,
    workStartDate: '2026-12-01',
    workTimeNegotiable: true,
    workTimes: recommendation.workTimes,
  };
}
