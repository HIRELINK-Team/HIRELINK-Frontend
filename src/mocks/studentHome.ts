import type { StudentHomeSummary } from '../types/studentHome';

export const STUDENT_HOME_MOCK: StudentHomeSummary = {
  greetingName: '\uAE40\uC22D\uC2E4',
  recommendedJobCount: 3,
  applications: {
    total: 5,
    reviewing: 2,
    offer: 1,
    completed: 1,
  },
  conditions: [
    { label: '\uADFC\uBB34\uC2DC\uAC04', value: '\uD3C9\uC77C \uC800\uB141' },
    { label: '\uAC70\uB9AC', value: '\uC11C\uC6B8 \uD30C\uBAA8\uAD6C' },
    { label: '\uAE09\uC5EC', value: '\uC2DC\uAE09 12,000\uC6D0 \uC774\uC0C1' },
    { label: '\uC9C1\uC885', value: '\uCE74\uD398-\uC74C\uC2DD\uC810' },
    { label: '\uADFC\uBB34\uC2DC\uC791', value: '1\uAC1C\uC6D4 \uC774\uB0B4' },
  ],
};
