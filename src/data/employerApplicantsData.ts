import type {
  ApplicantDocumentMock,
  ApplicantJobMock,
  ApplicantMatchItemMock,
  EmployerApplicantMock,
  HiredStudentDetailsMock,
} from "../types/application";

const HOUR_IN_MS = 60 * 60 * 1000;
const MINUTE_IN_MS = 60 * 1000;

function getFutureIso(hours: number, minutes = 0) {
  return new Date(
    Date.now() + hours * HOUR_IN_MS + minutes * MINUTE_IN_MS,
  ).toISOString();
}

function getFutureDateLabel(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);

  return [date.getFullYear(), date.getMonth() + 1, date.getDate()]
    .map((value, index) =>
      index === 0 ? String(value) : String(value).padStart(2, "0"),
    )
    .join(".");
}

const DEFAULT_DOCUMENTS: ApplicantDocumentMock[] = [
  {
    id: "alien-registration-card",
    name: "외국인등록증",
    submittedAt: "2026.09.02",
    expiresAt: "2027.01.09",
    isRegistered: true,
  },
  {
    id: "enrollment-certificate",
    name: "재학증명서",
    submittedAt: "2026.09.02",
    expiresAt: "2027.01.09",
    isRegistered: true,
  },
  {
    id: "transcript-warning",
    name: "성적증명서",
    submittedAt: "2026.09.02",
    expiresAt: getFutureDateLabel(12),
    isRegistered: true,
  },
  {
    id: "transcript-current",
    name: "성적증명서",
    submittedAt: "2026.09.02",
    expiresAt: "2027.01.09",
    isRegistered: true,
  },
];

const MISSING_DOCUMENTS: ApplicantDocumentMock[] = DEFAULT_DOCUMENTS.map(
  (document, index) =>
    index < 2
      ? { ...document }
      : {
          ...document,
          submittedAt: "",
          expiresAt: "",
          isRegistered: false,
        },
);

const DEFAULT_HIRED_DETAILS: HiredStudentDetailsMock = {
  qualificationExpiresAt: "2027.12.12",
  visaTypeLabel: "D-2(학사)",
  preferredExperience: "카페 경력 8개월",
  workAvailabilitySummary: "학기 중 주중 최대 25시간",
  analysisStatus: "READY",
  analysisStandards: [
    { id: "semester", label: "학기 중", value: "주중 최대 25시간 기준" },
    { id: "vacation", label: "방학 중", value: "별도 기준 적용 가능" },
    { id: "holiday", label: "주말 공휴일", value: "별도 기준 적용 가능" },
  ],
  jobScheduleLabel: "월수금 18-22",
  jobWeeklyHours: 18,
  maxWeeklyHours: 25,
  analysisSource: "하이코리아 안내",
  analysisCheckedAt: "2026.10.01",
  analysisDocuments: [
    { id: "alien-registration-card", name: "외국인등록증", value: "D-2" },
    { id: "enrollment-certificate", name: "재학증명서", value: "학부 2학년" },
    { id: "transcript", name: "성적증명서", value: "3.33/4.5" },
    { id: "topik", name: "TOPIK 성적 증명서", value: "3급" },
  ],
};

const DEFAULT_MATCH_ITEMS: ApplicantMatchItemMock[] = [
  {
    id: "work-days",
    label: "근무 요일",
    applicantValue: "월·수·금",
    jobValue: "월·수·금",
    result: "MATCH",
  },
  {
    id: "work-time",
    label: "근무 시간",
    applicantValue: "16-22",
    jobValue: "16-21",
    result: "NEGOTIABLE",
  },
  {
    id: "location",
    label: "근무 지역",
    applicantValue: "마포구",
    jobValue: "마포구",
    result: "MATCH",
  },
  {
    id: "experience",
    label: "업무",
    applicantValue: "바리스타",
    jobValue: "카페 경력 8개월",
    result: "MATCH",
  },
];

type ApplicantSeed = Omit<
  EmployerApplicantMock,
  | "topikLevel"
  | "birthDate"
  | "age"
  | "availableStartDate"
  | "documents"
  | "matchItems"
> &
  Partial<
    Pick<
      EmployerApplicantMock,
      | "topikLevel"
      | "birthDate"
      | "age"
      | "availableStartDate"
      | "documents"
      | "matchItems"
    >
  >;

function createApplicant(seed: ApplicantSeed): EmployerApplicantMock {
  return {
    topikLevel: "3급",
    birthDate: "2004.12.12",
    age: 21,
    availableStartDate: "2025.12.12",
    documents: DEFAULT_DOCUMENTS.map((document) => ({ ...document })),
    matchItems: DEFAULT_MATCH_ITEMS.map((item) => ({ ...item })),
    ...seed,
  };
}

export const APPLICANT_JOB_MOCKS: ApplicantJobMock[] = [
  {
    id: "barista-open",
    label: "바리스타·월수금 16-22·시급 13,000원",
    hiredSummary: "13,000원 · 월수금 16-22",
  },
  {
    id: "server-open",
    label: "서버·화목 11-20·시급 13,000원",
    hiredSummary: "13,000원 · 화목 11-20",
  },
];

export const EMPLOYER_APPLICANT_MOCKS: EmployerApplicantMock[] = [
  createApplicant({
    id: "application-jason",
    jobId: "barista-open",
    name: "제이슨",
    nationality: "베트남",
    visa: "D-2-2",
    matchRate: 80,
    status: "REVIEWING",
    expiresAt: getFutureIso(1, 12),
  }),
  createApplicant({
    id: "application-lin",
    jobId: "barista-open",
    name: "린",
    nationality: "중국",
    visa: "D-2-2",
    matchRate: 70,
    status: "REVIEWING",
    expiresAt: getFutureIso(12, 12),
  }),
  createApplicant({
    id: "application-jay",
    jobId: "barista-open",
    name: "제이",
    nationality: "베트남",
    visa: "D-2-1",
    matchRate: 30,
    status: "REVIEWING",
    expiresAt: getFutureIso(22, 12),
  }),
  createApplicant({
    id: "application-ariel",
    jobId: "barista-open",
    name: "아델",
    nationality: "베트남",
    visa: "D-2-2",
    matchRate: 90,
    status: "OFFER_WAITING",
    expiresAt: getFutureIso(12, 22),
  }),
  createApplicant({
    id: "application-suan",
    jobId: "barista-open",
    name: "수안",
    nationality: "중국",
    visa: "D-2-2",
    matchRate: 70,
    status: "OFFER_WAITING",
    expiresAt: getFutureIso(12, 12),
  }),
  createApplicant({
    id: "application-minsu",
    jobId: "barista-open",
    name: "민수",
    nationality: "베트남",
    visa: "D-2-1",
    matchRate: 88,
    status: "HIRED",
    hiredAt: "2026.12.12",
    phoneNumber: "010-1221-1212",
    hiredDetails: { ...DEFAULT_HIRED_DETAILS },
  }),
  createApplicant({
    id: "application-minji",
    jobId: "barista-open",
    name: "민지",
    nationality: "베트남",
    visa: "D-2-2",
    matchRate: 84,
    status: "HIRED",
    hiredAt: "2026.12.14",
    phoneNumber: "010-1234-5678",
    documents: MISSING_DOCUMENTS.map((document) => ({ ...document })),
    hiredDetails: {
      ...DEFAULT_HIRED_DETAILS,
      qualificationExpiresAt: "2026.11.12",
      hasQualificationExpiryWarning: true,
      analysisStatus: "MISSING_DOCUMENTS",
    },
  }),
  createApplicant({
    id: "application-hidden-rejected",
    jobId: "barista-open",
    name: "마이",
    nationality: "베트남",
    visa: "D-4-1",
    matchRate: 62,
    status: "REJECTED",
  }),
  createApplicant({
    id: "application-mia",
    jobId: "server-open",
    name: "미아",
    nationality: "베트남",
    visa: "D-2-2",
    matchRate: 92,
    status: "REVIEWING",
    expiresAt: getFutureIso(2, 45),
  }),
  createApplicant({
    id: "application-liu",
    jobId: "server-open",
    name: "리우",
    nationality: "중국",
    visa: "D-2-2",
    matchRate: 78,
    status: "REVIEWING",
    expiresAt: getFutureIso(7, 32),
  }),
  createApplicant({
    id: "application-anu",
    jobId: "server-open",
    name: "아누",
    nationality: "네팔",
    visa: "D-2-1",
    matchRate: 55,
    status: "REVIEWING",
    expiresAt: getFutureIso(14, 8),
  }),
  createApplicant({
    id: "application-zoe",
    jobId: "server-open",
    name: "조이",
    nationality: "네팔",
    visa: "D-2-2",
    matchRate: 42,
    status: "REVIEWING",
    expiresAt: getFutureIso(18, 21),
  }),
  createApplicant({
    id: "application-hana",
    jobId: "server-open",
    name: "하나",
    nationality: "몽골",
    visa: "D-2-1",
    matchRate: 35,
    status: "REVIEWING",
    expiresAt: getFutureIso(21, 5),
  }),
  createApplicant({
    id: "application-anna",
    jobId: "server-open",
    name: "안나",
    nationality: "우즈베키스탄",
    visa: "D-2-2",
    matchRate: 86,
    status: "OFFER_WAITING",
    expiresAt: getFutureIso(17, 42),
  }),
  createApplicant({
    id: "application-bao",
    jobId: "server-open",
    name: "바오",
    nationality: "베트남",
    visa: "D-2-1",
    matchRate: 68,
    status: "OFFER_WAITING",
    expiresAt: getFutureIso(23, 15),
  }),
  createApplicant({
    id: "application-nara",
    jobId: "server-open",
    name: "나라",
    nationality: "몽골",
    visa: "D-2-2",
    matchRate: 81,
    status: "HIRED",
    hiredAt: "2026.12.10",
    phoneNumber: "010-3412-8890",
    hiredDetails: {
      ...DEFAULT_HIRED_DETAILS,
      preferredExperience: "홀 서빙 경력 6개월",
      jobScheduleLabel: "화목 11-20",
      jobWeeklyHours: 18,
    },
  }),
];
