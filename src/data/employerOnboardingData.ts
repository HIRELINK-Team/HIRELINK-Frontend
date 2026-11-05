import type { SelectOption } from '../components/common/SelectField';
import type {
  EmployeeCountCode,
  ReferralSourceCode,
} from '../types/employerOnboarding';
import type { EmployeeCountRange } from '../types/workplace';

export const REFERRAL_SOURCE_OPTIONS: SelectOption<ReferralSourceCode>[] = [
  { value: 'SEARCH', label: '검색' },
  { value: 'REFERRAL', label: '지인 추천' },
  { value: 'OTHER', label: '기타' },
];

export const EMPLOYEE_COUNT_OPTIONS: SelectOption<EmployeeCountCode>[] = [
  { value: 'UNDER_FIVE', label: '5인 미만' },
  { value: 'FIVE_OR_MORE', label: '5인 이상' },
];

export const EMPLOYEE_COUNT_RANGE_BY_CODE: Record<
  EmployeeCountCode,
  EmployeeCountRange
> = {
  UNDER_FIVE: 'UNDER_5',
  FIVE_OR_MORE: 'FIVE_OR_MORE',
};

// Beta에서는 geocoding을 사용하지 않으며 추후 실제 주소 좌표로 교체합니다.
export const BETA_DEFAULT_WORKPLACE_COORDINATES = {
  latitude: 0,
  longitude: 0,
} as const;

export const MOCK_PHONE_VERIFICATION_CODE = '121221';
export const MAX_REGISTRATION_FILE_SIZE = 5 * 1024 * 1024;
