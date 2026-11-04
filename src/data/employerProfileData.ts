import type { SelectOption } from '../components/common/SelectField';
import type {
  EmployerAddressMock,
  EmployerIndustryCode,
  EmployerProfile,
} from '../types/employerProfile';

export const EMPLOYER_PROFILE_MOCK: EmployerProfile = {
  name: '김모모',
  phone: '010-1111-1111',
  email: 'hirelink@soongsil.ac.kr',
  position: '사장',
  business: {
    name: '모모카페',
    industry: 'FOOD_CAFE',
    address: '서울 마포구 월드컵북로 00',
    detailAddress: '정보과학관 3층',
    registrationNumber: '000-00-00000',
    representativeName: '김모모',
  },
};

export const EMPLOYER_INDUSTRY_OPTIONS: Array<
  SelectOption<EmployerIndustryCode> & { id: number }
> = [
  { id: 1, value: 'FOOD_CAFE', label: '음식점 · 카페' },
  { id: 2, value: 'RETAIL', label: '매장 · 판매' },
  { id: 3, value: 'OFFICE_EVENT_TOURISM', label: '사무 · 행사 · 관광' },
  {
    id: 4,
    value: 'INTERPRETATION_TRANSLATION',
    label: '통역 · 번역',
  },
  { id: 5, value: 'DUTY_FREE', label: '면세점' },
  { id: 6, value: 'MAJOR_RELATED', label: '전공 · 학업 업무' },
  { id: 7, value: 'INTERNSHIP', label: '인턴십' },
  { id: 8, value: 'OTHER', label: '기타' },
];

export const EMPLOYER_ADDRESS_MOCKS: EmployerAddressMock[] = [
  {
    id: 'address-001',
    postalCode: '03925',
    roadAddress: '서울 마포구 월드컵북로 00',
    lotAddress: '서울 마포구 성산동 000-0',
  },
  {
    id: 'address-002',
    postalCode: '06978',
    roadAddress: '서울 동작구 상도로 369',
    lotAddress: '서울 동작구 상도동 511',
  },
  {
    id: 'address-003',
    postalCode: '04157',
    roadAddress: '서울 마포구 독막로 00',
    lotAddress: '서울 마포구 대흥동 000-0',
  },
];
