import type {
  EmployerApplicationDetailResponse,
  EmployerApplicationListResponse,
} from '../types/application';
import type {
  EmployerProfile,
  EmployerProfileResponse,
} from '../types/employerProfile';
import type {
  JobPostingDetailResponse,
  JobPostingListItem,
} from '../types/jobPosting';
import type {
  EmployerMatchDetailResponse,
  EmployerMatchListItem,
} from '../types/match';
import type {
  EmployerWorkplaceListItem,
  WorkplaceDetailResponse,
} from '../types/workplace';

const DEMO_WORKPLACE_ID = 9001;
const DEMO_RECRUITING_JOB_ID = 9101;
const DEMO_CLOSED_JOB_ID = 9102;
const DEMO_WAITING_APPLICATION_ID = 9201;
const DEMO_OFFERED_APPLICATION_ID = 9202;
const DEMO_COMPLETED_APPLICATION_ID = 9203;
const DEMO_MATCH_ID = 9301;

const DEMO_PROFILE: EmployerProfile = {
  name: '데모 사업주',
  phone: '010-0000-0000',
  email: 'demo@hirelink.local',
  position: '점장',
  business: {
    name: 'HIRELINK 데모 카페',
    industry: 'FOOD_CAFE',
    address: '서울 마포구 데모로 10',
    detailAddress: '1층',
    registrationNumber: '000-00-00000',
    representativeName: '데모 사업주',
  },
};

const DEMO_PROFILE_RESPONSE: EmployerProfileResponse = {
  employerId: 999999,
  name: DEMO_PROFILE.name,
  email: DEMO_PROFILE.email,
  phoneNumber: DEMO_PROFILE.phone,
  position: DEMO_PROFILE.position,
};

const DEMO_WORKPLACE_DETAIL: WorkplaceDetailResponse = {
  workplaceId: DEMO_WORKPLACE_ID,
  workplaceName: DEMO_PROFILE.business.name,
  businessRegistrationNumber: DEMO_PROFILE.business.registrationNumber,
  businessTypeId: 1,
  businessTypeName: 'FOOD_CAFE',
  employeeCountRange: 'UNDER_5',
  workplaceAddress: `${DEMO_PROFILE.business.address} ${DEMO_PROFILE.business.detailAddress}`,
  latitude: 37.556,
  longitude: 126.923,
};

const DEMO_JOB_DETAILS: Record<number, JobPostingDetailResponse> = {
  [DEMO_RECRUITING_JOB_ID]: {
    jobPostingId: DEMO_RECRUITING_JOB_ID,
    title: '바리스타 채용',
    status: 'RECRUITING',
    workplaceId: DEMO_WORKPLACE_ID,
    workplaceName: DEMO_WORKPLACE_DETAIL.workplaceName,
    workplaceAddress: DEMO_WORKPLACE_DETAIL.workplaceAddress,
    latitude: DEMO_WORKPLACE_DETAIL.latitude,
    longitude: DEMO_WORKPLACE_DETAIL.longitude,
    businessTypeId: DEMO_WORKPLACE_DETAIL.businessTypeId,
    businessTypeName: DEMO_WORKPLACE_DETAIL.businessTypeName,
    jobRole: '바리스타',
    wageType: 'HOURLY',
    wageAmount: 13000,
    recruitmentCount: 5,
    workStartDate: '2026-12-01',
    requiredKoreanLevel: 'INTERMEDIATE',
    preferredExperience: 'SIX_MONTHS_OR_MORE',
    workTimeNegotiable: true,
    applicationDeadlineDate: '2026-12-20',
    workTimes: [
      { dayOfWeek: 'MON', startTime: '16:00', endTime: '22:00' },
      { dayOfWeek: 'WED', startTime: '16:00', endTime: '22:00' },
      { dayOfWeek: 'FRI', startTime: '16:00', endTime: '22:00' },
    ],
  },
  [DEMO_CLOSED_JOB_ID]: {
    jobPostingId: DEMO_CLOSED_JOB_ID,
    title: '홀 서버 채용',
    status: 'CLOSED',
    workplaceId: DEMO_WORKPLACE_ID,
    workplaceName: DEMO_WORKPLACE_DETAIL.workplaceName,
    workplaceAddress: DEMO_WORKPLACE_DETAIL.workplaceAddress,
    latitude: DEMO_WORKPLACE_DETAIL.latitude,
    longitude: DEMO_WORKPLACE_DETAIL.longitude,
    businessTypeId: DEMO_WORKPLACE_DETAIL.businessTypeId,
    businessTypeName: DEMO_WORKPLACE_DETAIL.businessTypeName,
    jobRole: '서버',
    wageType: 'HOURLY',
    wageAmount: 12500,
    recruitmentCount: 2,
    workStartDate: '2026-10-01',
    requiredKoreanLevel: 'BEGINNER',
    preferredExperience: 'NONE',
    workTimeNegotiable: false,
    applicationDeadlineDate: '2026-10-15',
    workTimes: [
      { dayOfWeek: 'TUE', startTime: '17:00', endTime: '21:00' },
      { dayOfWeek: 'THU', startTime: '17:00', endTime: '21:00' },
    ],
  },
};

function toJobListItem(detail: JobPostingDetailResponse): JobPostingListItem {
  return {
    jobPostingId: detail.jobPostingId,
    workplaceId: detail.workplaceId,
    workplaceName: detail.workplaceName,
    jobRole: detail.jobRole,
    wageType: detail.wageType,
    wageAmount: detail.wageAmount,
    status: detail.status,
    applicationDeadlineDate: detail.applicationDeadlineDate,
    workTimes: detail.workTimes,
    createdAt: '2026-09-01T09:00:00+09:00',
  };
}

const DEMO_APPLICATION_LISTS: Record<number, EmployerApplicationListResponse> =
  {
    [DEMO_RECRUITING_JOB_ID]: {
      jobPostingId: DEMO_RECRUITING_JOB_ID,
      capacity: 5,
      occupiedCount: 3,
      waitingResponseCount: 1,
      offeredCount: 1,
      completedCount: 1,
      applications: [
        {
          applicationId: DEMO_WAITING_APPLICATION_ID,
          status: 'WAITING_RESPONSE',
          applicantName: '데모 지원자 A',
          profileImageUrl: null,
          nationality: '베트남',
          visaType: 'D-2-2',
          topikLevel: 3,
          matchScore: 80,
          desiredStartDate: '2026-12-01',
          appliedAt: '2026-11-13T10:00:00+09:00',
          employerResponseDeadline: '2026-12-31T23:59:59+09:00',
          offerId: null,
          studentResponseDeadline: null,
          matchId: null,
        },
        {
          applicationId: DEMO_OFFERED_APPLICATION_ID,
          status: 'OFFERED',
          applicantName: '데모 지원자 B',
          profileImageUrl: null,
          nationality: '몽골',
          visaType: 'D-4-1',
          topikLevel: 4,
          matchScore: 90,
          desiredStartDate: '2026-12-05',
          appliedAt: '2026-11-12T11:30:00+09:00',
          employerResponseDeadline: null,
          offerId: 9401,
          studentResponseDeadline: '2026-12-31T23:59:59+09:00',
          matchId: null,
        },
        {
          applicationId: DEMO_COMPLETED_APPLICATION_ID,
          status: 'COMPLETED',
          applicantName: '데모 유학생',
          profileImageUrl: null,
          nationality: '우즈베키스탄',
          visaType: 'D-2-2',
          topikLevel: 3,
          matchScore: 100,
          desiredStartDate: '2026-11-20',
          appliedAt: '2026-11-01T14:00:00+09:00',
          employerResponseDeadline: null,
          offerId: 9402,
          studentResponseDeadline: null,
          matchId: DEMO_MATCH_ID,
        },
      ],
    },
    [DEMO_CLOSED_JOB_ID]: {
      jobPostingId: DEMO_CLOSED_JOB_ID,
      capacity: 2,
      occupiedCount: 0,
      waitingResponseCount: 0,
      offeredCount: 0,
      completedCount: 0,
      applications: [],
    },
  };

function createApplicationDetail(
  applicationId: number,
  status: EmployerApplicationDetailResponse['status'],
  name: string,
  nationality: string,
  visaType: string,
  topikLevel: number,
  matchScore: number,
): EmployerApplicationDetailResponse {
  return {
    applicationId,
    jobPostingId: DEMO_RECRUITING_JOB_ID,
    status,
    desiredStartDate: '2026-12-01',
    appliedAt: '2026-11-13T10:00:00+09:00',
    employerResponseDeadline:
      status === 'WAITING_RESPONSE' ? '2026-12-31T23:59:59+09:00' : null,
    applicant: {
      name,
      profileImageUrl: null,
      nationality,
      visaType,
      visaExpirationDate: '2027-10-31',
      koreanLevel: 'INTERMEDIATE',
      topikLevel,
      careers: [
        {
          careerName: '카페 보조',
          startMonth: '2026-01',
          endMonth: '2026-08',
          description: null,
        },
      ],
      availableWorkTimes: [
        { dayOfWeek: 'MON', startTime: '16:00', endTime: '22:00' },
        { dayOfWeek: 'WED', startTime: '16:00', endTime: '22:00' },
        { dayOfWeek: 'FRI', startTime: '16:00', endTime: '22:00' },
      ],
    },
    jobRequirements: {
      workTimes: DEMO_JOB_DETAILS[DEMO_RECRUITING_JOB_ID].workTimes,
      wageAmount: 13000,
      requiredKoreanLevel: 'INTERMEDIATE',
    },
    matchResult: {
      matchScore,
      workTimeMatched: true,
      experienceMatched: true,
      locationMatched: true,
      wageMatched: true,
      koreanLevelMatched: matchScore === 100,
    },
  };
}

const DEMO_APPLICATION_DETAILS: Record<
  number,
  EmployerApplicationDetailResponse
> = {
  [DEMO_WAITING_APPLICATION_ID]: createApplicationDetail(
    DEMO_WAITING_APPLICATION_ID,
    'WAITING_RESPONSE',
    '데모 지원자 A',
    '베트남',
    'D-2-2',
    3,
    80,
  ),
  [DEMO_OFFERED_APPLICATION_ID]: createApplicationDetail(
    DEMO_OFFERED_APPLICATION_ID,
    'OFFERED',
    '데모 지원자 B',
    '몽골',
    'D-4-1',
    4,
    90,
  ),
  [DEMO_COMPLETED_APPLICATION_ID]: createApplicationDetail(
    DEMO_COMPLETED_APPLICATION_ID,
    'COMPLETED',
    '데모 유학생',
    '우즈베키스탄',
    'D-2-2',
    3,
    100,
  ),
};

const DEMO_MATCH_DETAIL: EmployerMatchDetailResponse = {
  matchId: DEMO_MATCH_ID,
  applicationId: DEMO_COMPLETED_APPLICATION_ID,
  offerId: 9402,
  jobPostingId: DEMO_RECRUITING_JOB_ID,
  jobTitle: '바리스타',
  workplaceName: DEMO_WORKPLACE_DETAIL.workplaceName,
  workplaceAddress: DEMO_WORKPLACE_DETAIL.workplaceAddress,
  wageType: 'HOURLY',
  wageAmount: 13000,
  workTimes: DEMO_JOB_DETAILS[DEMO_RECRUITING_JOB_ID].workTimes,
  desiredStartDate: '2026-11-20',
  matchedAt: '2026-11-10T15:00:00+09:00',
  contact: {
    name: '데모 유학생',
    phoneNumber: '010-0000-0001',
  },
  student: {
    name: '데모 유학생',
    profileImageUrl: null,
    nationality: '우즈베키스탄',
    visaType: 'D-2-2',
    topikLevel: 3,
  },
};

function cloneDemoValue<T>(value: T): T {
  return structuredClone(value);
}

export function getDemoEmployerProfile() {
  return cloneDemoValue(DEMO_PROFILE);
}

export function getDemoEmployerProfileResponse() {
  return cloneDemoValue(DEMO_PROFILE_RESPONSE);
}

export function getDemoWorkplaces(): EmployerWorkplaceListItem[] {
  const detail = cloneDemoValue(DEMO_WORKPLACE_DETAIL);
  return [
    {
      workplaceId: detail.workplaceId,
      workplaceName: detail.workplaceName,
      businessTypeId: detail.businessTypeId,
      businessTypeName: detail.businessTypeName,
      workplaceAddress: detail.workplaceAddress,
      employeeCountRange: detail.employeeCountRange,
    },
  ];
}

export function getDemoWorkplaceDetail(workplaceId: number) {
  if (workplaceId !== DEMO_WORKPLACE_ID) return undefined;
  return cloneDemoValue(DEMO_WORKPLACE_DETAIL);
}

export function getDemoJobs() {
  return Object.values(DEMO_JOB_DETAILS).map((detail) =>
    cloneDemoValue(toJobListItem(detail)),
  );
}

export function getDemoJobDetail(jobPostingId: number) {
  const detail = DEMO_JOB_DETAILS[jobPostingId];
  return detail ? cloneDemoValue(detail) : undefined;
}

export function getDemoApplicationList(jobPostingId: number) {
  const response = DEMO_APPLICATION_LISTS[jobPostingId];
  return response ? cloneDemoValue(response) : undefined;
}

export function getDemoApplicationDetail(applicationId: number) {
  const response = DEMO_APPLICATION_DETAILS[applicationId];
  return response ? cloneDemoValue(response) : undefined;
}

export function getDemoMatches(jobPostingId?: number): EmployerMatchListItem[] {
  const match: EmployerMatchListItem = {
    matchId: DEMO_MATCH_DETAIL.matchId,
    applicationId: DEMO_MATCH_DETAIL.applicationId,
    offerId: DEMO_MATCH_DETAIL.offerId,
    jobPostingId: DEMO_MATCH_DETAIL.jobPostingId,
    jobTitle: DEMO_MATCH_DETAIL.jobTitle,
    workplaceName: DEMO_MATCH_DETAIL.workplaceName,
    wageType: DEMO_MATCH_DETAIL.wageType,
    wageAmount: DEMO_MATCH_DETAIL.wageAmount,
    desiredStartDate: DEMO_MATCH_DETAIL.desiredStartDate,
    matchedAt: DEMO_MATCH_DETAIL.matchedAt,
    student: DEMO_MATCH_DETAIL.student,
  };
  return jobPostingId === undefined || jobPostingId === match.jobPostingId
    ? [cloneDemoValue(match)]
    : [];
}

export function getDemoMatchDetail(matchId: number) {
  return matchId === DEMO_MATCH_ID
    ? cloneDemoValue(DEMO_MATCH_DETAIL)
    : undefined;
}
