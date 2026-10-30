import type {
  StudentMyMenu,
  StudentMyProfile,
  StudentMyProgress,
} from '../types/studentMy';

export const STUDENT_MY_PROFILE_MOCK: StudentMyProfile = {
  name: '김숭실',
  visaStatus: 'D-2-2',
  topikLevel: 'TOPIK 4급',
};

export const STUDENT_MY_PROGRESS_MOCK: StudentMyProgress = {
  title: '내 근무 조건을 확인하세요!',
  descriptionLines: [
    '체류·학업 정보를 등록하면',
    '지원 가능한 일자리를 더 정확하게',
    '추천해드려요.',
  ],
  percent: 60,
};

export const STUDENT_MY_PRIMARY_MENUS: readonly StudentMyMenu[] = [
  {
    id: 'personal-info',
    title: '내 정보 관리',
    description: '체류자격 · 학업 · 어학 정보 관리',
  },
  {
    id: 'documents',
    title: '서류 관리',
    description: '등록 서류 · 인증 상태 확인',
  },
  {
    id: 'matching-conditions',
    title: '매칭 조건 관리',
    description: '희망 직종 · 시간 · 급여 · 거리 등 설정',
  },
];

export const STUDENT_MY_SECONDARY_MENUS: readonly StudentMyMenu[] = [
  { id: 'notifications', title: '알림설정' },
  { id: 'customer-center', title: '고객센터' },
  { id: 'terms', title: '약관 및 개인정보' },
];
