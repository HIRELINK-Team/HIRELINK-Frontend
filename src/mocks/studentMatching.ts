import type { RecommendedJob } from '../types/studentMatching';

export const MAX_RECOMMENDED_JOBS = 3;

export const STUDENT_RECOMMENDED_JOBS: RecommendedJob[] = [
  {
    countdownLabel: '23:10',
    id: 'mega-coffee-soongsil-1',
    companyName: '메가커피 숭실대점',
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
    isCountdownActive: false,
    role: '직무 | 바리스타',
    commuteAndWage: '도보 12분 · 시급 13,000원',
    matchDescription: '시간·거리 모두 일치',
    matchRate: 65,
    showsApplyButton: true,
  },
];
