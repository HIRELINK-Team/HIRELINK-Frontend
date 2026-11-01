import type { SelectOption } from "../components/common/SelectField";
import type {
  EmployeeCountCode,
  ReferralSourceCode,
} from "../types/employerOnboarding";

export const REFERRAL_SOURCE_OPTIONS: SelectOption<ReferralSourceCode>[] = [
  { value: "SEARCH", label: "검색" },
  { value: "REFERRAL", label: "지인 추천" },
  { value: "OTHER", label: "기타" },
];

export const EMPLOYEE_COUNT_OPTIONS: SelectOption<EmployeeCountCode>[] = [
  { value: "UNDER_FIVE", label: "5인 미만" },
  { value: "FIVE_OR_MORE", label: "5인 이상" },
];

export const MOCK_PHONE_VERIFICATION_CODE = "121221";
export const MAX_REGISTRATION_FILE_SIZE = 5 * 1024 * 1024;
