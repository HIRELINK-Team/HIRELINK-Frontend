import type {
  AcademicStatus,
  ResidenceQualification,
  TopikLevel,
} from '../types/residence';

export type KoreanLevel = 'beginner' | 'intermediate' | 'advanced';

export const COUNTRY_OPTIONS = [
  '베트남',
  '중국',
  '몽골',
  '우즈베키스탄',
  '일본',
  '기타',
] as const;

export type CountryOption = (typeof COUNTRY_OPTIONS)[number];

export const KOREAN_LEVELS: Array<{
  description: string;
  label: string;
  value: KoreanLevel;
}> = [
  { value: 'beginner', label: '초급', description: '간단한 인사만 가능해요.' },
  {
    value: 'intermediate',
    label: '중급',
    description: '일상 대화 정도는 할 수 있어요.',
  },
  { value: 'advanced', label: '고급', description: '업무 대화도 가능해요.' },
];

export const RESIDENCE_QUALIFICATION_OPTIONS: Array<{
  label: string;
  value: ResidenceQualification;
}> = [
  { value: 'D2_1', label: '전문학사(D-2-1)' },
  { value: 'D2_2', label: '학사(D-2-2)' },
  { value: 'D2_3', label: '석사(D-2-3)' },
  { value: 'D2_4', label: '박사(D-2-4)' },
  { value: 'D2_6', label: '교환학생(D-2-6)' },
  { value: 'D2_7', label: '일·학습연계(D-2-7)' },
  { value: 'D2_8', label: '방문학생(D-2-8)' },
  { value: 'D4_1', label: '한국어/외국어 연수(D-4-1)' },
];

export const ACADEMIC_STATUS_OPTIONS: Record<
  ResidenceQualification,
  Array<{ label: string; value: AcademicStatus }>
> = {
  D2_1: [
    { value: 'ENROLLED', label: '재학 중' },
    { value: 'COMPLETED', label: '수료' },
    { value: 'GRADUATED', label: '졸업' },
    { value: 'LEAVE_OF_ABSENCE', label: '휴학 중' },
  ],
  D2_2: [
    { value: 'ENROLLED', label: '재학 중' },
    { value: 'COMPLETED', label: '수료' },
    { value: 'GRADUATED', label: '졸업' },
    { value: 'LEAVE_OF_ABSENCE', label: '휴학 중' },
  ],
  D2_3: [
    { value: 'ENROLLED', label: '재학 중' },
    { value: 'COMPLETED', label: '수료' },
    { value: 'GRADUATED', label: '졸업' },
    { value: 'LEAVE_OF_ABSENCE', label: '휴학 중' },
  ],
  D2_4: [
    { value: 'ENROLLED', label: '재학 중' },
    { value: 'COMPLETED', label: '수료' },
    { value: 'GRADUATED', label: '졸업' },
    { value: 'LEAVE_OF_ABSENCE', label: '휴학 중' },
  ],
  D2_6: [
    { value: 'EXCHANGE_IN_PROGRESS', label: '교환학생 진행 중' },
    { value: 'EXCHANGE_ENDED', label: '교환학기 종료' },
    { value: 'INTERRUPTED', label: '중단' },
  ],
  D2_7: [
    { value: 'PROGRAM_IN_PROGRESS', label: '과정 참여 중' },
    { value: 'PROGRAM_COMPLETED', label: '과정 수료' },
    { value: 'INTERRUPTED', label: '휴학/중단' },
  ],
  D2_8: [
    { value: 'VISITING_IN_PROGRESS', label: '방문학기 진행 중' },
    { value: 'VISITING_ENDED', label: '방문학기 종료' },
    { value: 'INTERRUPTED', label: '중단' },
  ],
  D4_1: [
    { value: 'TRAINING_IN_PROGRESS', label: '연수 중' },
    { value: 'TRAINING_COMPLETED', label: '연수 수료' },
    { value: 'TRAINING_INTERRUPTED', label: '연수 중단' },
  ],
};

export const TOPIK_LEVEL_OPTIONS: Array<{ label: string; value: TopikLevel }> =
  [
    { value: 'NONE', label: 'TOPIK 없음' },
    { value: 'LEVEL_1', label: '1급' },
    { value: 'LEVEL_2', label: '2급' },
    { value: 'LEVEL_3', label: '3급' },
    { value: 'LEVEL_4', label: '4급' },
    { value: 'LEVEL_5', label: '5급' },
    { value: 'LEVEL_6', label: '6급' },
  ];
