import type {
  RecommendedJob,
  RecommendedJobDetail,
} from '../types/studentMatching';

export const MAX_RECOMMENDED_JOBS = 3;

const RECOMMENDED_JOB_DETAIL: RecommendedJobDetail = {
  locationAndDistance: '동작구 · 도보 12분',
  matchRate: 94,
  tags: ['카페', '주 3일 이상'],
  metrics: [
    { label: '월급', value: '250만원' },
    { label: '장기', value: '1년 이상' },
    { label: '요일', value: '월-금' },
    { label: '시간', value: '9-18시' },
  ],
  comparisonTags: ['근무 시간 일치', '희망 거리'],
};

export const STUDENT_RECOMMENDED_JOBS: RecommendedJob[] = [
  {
    countdownLabel: '23:10',
    id: 'mega-coffee-soongsil-1',
    companyName: '메가커피 숭실대점',
    detail: RECOMMENDED_JOB_DETAIL,
    isCountdownActive: true,
    role: '직무 | 바리스타',
    commuteAndWage: '도보 12분 · 시급 13,000원',
    matchDescription: '시간·거리 모두 일치',
    matchRate: 95,
    showsApplyButton: false,
  },
  {
    countdownLabel: '17:10',
    id: 'mega-coffee-soongsil-2',
    companyName: '메가커피 숭실대점',
    detail: RECOMMENDED_JOB_DETAIL,
    isCountdownActive: true,
    role: '직무 | 바리스타',
    commuteAndWage: '도보 12분 · 시급 13,000원',
    matchDescription: '시간·거리 모두 일치',
    matchRate: 65,
    showsApplyButton: false,
  },
  {
    countdownLabel: '24:00',
    id: 'mega-coffee-soongsil-3',
    companyName: '메가커피 숭실대점',
    detail: RECOMMENDED_JOB_DETAIL,
    isCountdownActive: false,
    role: '직무 | 바리스타',
    commuteAndWage: '도보 12분 · 시급 13,000원',
    matchDescription: '시간·거리 모두 일치',
    matchRate: 65,
    showsApplyButton: true,
  },
];
