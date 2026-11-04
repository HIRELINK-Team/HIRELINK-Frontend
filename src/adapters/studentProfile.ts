import {
  ACADEMIC_STATUS_OPTIONS,
  KOREAN_LEVELS,
  RESIDENCE_QUALIFICATION_OPTIONS,
  TOPIK_LEVEL_OPTIONS,
} from '../constants/studentOnboardingOptions';
import type {
  CountryOption,
  KoreanLevel,
} from '../constants/studentOnboardingOptions';
import type {
  ProfileDetailView,
  StudentProfileValues,
} from '../pages/student/StudentProfileManagementPage';
import type {
  StudentKoreanLevel,
  StudentProfileCreateRequest,
  StudentProfileResponse,
  StudentProfileUpdateRequest,
  StudentTopikLevel,
} from '../types/studentProfile';

const NATIONALITY_LABEL_BY_CODE: Readonly<Record<string, string>> = {
  CN: '중국',
  JP: '일본',
  MN: '몽골',
  UZ: '우즈베키스탄',
  VN: '베트남',
};

const NATIONALITY_CODE_BY_LABEL = Object.fromEntries(
  Object.entries(NATIONALITY_LABEL_BY_CODE).map(([code, label]) => [
    label,
    code,
  ]),
) as Readonly<Record<string, string>>;

const ONBOARDING_KOREAN_LEVEL_CODE: Record<KoreanLevel, StudentKoreanLevel> = {
  advanced: 'ADVANCED',
  beginner: 'BEGINNER',
  intermediate: 'INTERMEDIATE',
};

export function mapStudentOnboardingToCreateRequest({
  birthYear,
  koreanLevel,
  location,
  name,
  nationality,
}: {
  birthYear: string;
  koreanLevel: KoreanLevel;
  location: string;
  name: string;
  nationality: CountryOption;
}): StudentProfileCreateRequest | null {
  const trimmedName = name.trim();
  const trimmedLocation = location.trim();
  const nationalityCode = NATIONALITY_CODE_BY_LABEL[nationality];

  if (
    !trimmedName ||
    !trimmedLocation ||
    !nationalityCode ||
    !/^\d{4}$/.test(birthYear)
  ) {
    return null;
  }

  return {
    name: trimmedName,
    // Temporary demo conversion. Replace this when onboarding collects a full birth date.
    birthDate: `${birthYear}-01-01`,
    nationality: nationalityCode,
    currentRegion: trimmedLocation,
    koreanLevel: ONBOARDING_KOREAN_LEVEL_CODE[koreanLevel],
  };
}

export type StudentProfileUpdateMappingResult =
  | { status: 'ready'; requestBody: StudentProfileUpdateRequest }
  | { status: 'unchanged' }
  | { status: 'invalid' };

function calculateAge(birthDate: string) {
  const [birthYear, birthMonth, birthDay] = birthDate.split('-').map(Number);
  const today = new Date();
  let age = today.getFullYear() - birthYear;

  if (
    today.getMonth() + 1 < birthMonth ||
    (today.getMonth() + 1 === birthMonth && today.getDate() < birthDay)
  ) {
    age -= 1;
  }

  return `${age}세`;
}

function getVisaLabel(visaCode: string) {
  const qualification = visaCode.replace(/^D-/, 'D').replaceAll('-', '_');

  return (
    RESIDENCE_QUALIFICATION_OPTIONS.find(
      (option) => option.value === qualification,
    )?.label ?? visaCode
  );
}

function getAcademicStateLabel(academicState: string) {
  return (
    Object.values(ACADEMIC_STATUS_OPTIONS)
      .flat()
      .find((option) => option.value === academicState)?.label ?? academicState
  );
}

function getKoreanLevelLabel(
  koreanLevel: StudentProfileResponse['koreanLevel'],
) {
  return (
    KOREAN_LEVELS.find((option) => option.value === koreanLevel.toLowerCase())
      ?.label ?? koreanLevel
  );
}

function getKoreanLevelCode(value: string): StudentKoreanLevel | null {
  const option = KOREAN_LEVELS.find(({ label }) => label === value);

  return option ? (option.value.toUpperCase() as StudentKoreanLevel) : null;
}

function getNationalityCode(value: string) {
  if (NATIONALITY_CODE_BY_LABEL[value]) {
    return NATIONALITY_CODE_BY_LABEL[value];
  }

  const normalizedValue = value.trim().toUpperCase();

  return /^[A-Z]{2}$/.test(normalizedValue) ? normalizedValue : null;
}

function getVisaCode(value: string) {
  const qualification = RESIDENCE_QUALIFICATION_OPTIONS.find(
    (option) => option.label === value,
  )?.value;

  if (!qualification) return null;

  const [, category, detail] = qualification.match(/^([A-Z]\d)_(\d)$/) ?? [];

  return category && detail
    ? `${category.slice(0, 1)}-${category.slice(1)}-${detail}`
    : null;
}

function getAcademicStateCode(value: string) {
  return (
    Object.values(ACADEMIC_STATUS_OPTIONS)
      .flat()
      .find((option) => option.label === value)?.value ?? null
  );
}

function getTopikLevel(value: string) {
  const option = TOPIK_LEVEL_OPTIONS.find(({ label }) => label === value);

  if (!option) return undefined;
  if (option.value === 'NONE') return null;

  return Number(option.value.replace('LEVEL_', '')) as StudentTopikLevel;
}

function getDateValue(value: string) {
  const normalizedValue = value.replaceAll('.', '-').trim();

  return /^\d{4}-\d{2}-\d{2}$/.test(normalizedValue) ? normalizedValue : null;
}

function setChangedString(
  requestBody: StudentProfileUpdateRequest,
  key:
    | 'name'
    | 'nationality'
    | 'currentRegion'
    | 'visaCode'
    | 'stayExpirationDate'
    | 'universityName'
    | 'academicState',
  value: string | null,
  currentValue: string,
) {
  if (value === null || value.trim() === '') return false;
  if (value !== currentValue) requestBody[key] = value;

  return true;
}

export function mapStudentProfileResponseToValues(
  profile: StudentProfileResponse,
): StudentProfileValues {
  const koreanLevelLabel = getKoreanLevelLabel(profile.koreanLevel);

  return {
    basic: [
      profile.name,
      calculateAge(profile.birthDate),
      NATIONALITY_LABEL_BY_CODE[profile.nationality] ?? profile.nationality,
      profile.currentRegion,
      koreanLevelLabel,
      profile.phoneNumber,
    ],
    residence: [
      getVisaLabel(profile.visaCode),
      profile.stayExpirationDate.replaceAll('-', '.'),
      '등록 완료',
    ],
    academic: [
      profile.universityName,
      '학사',
      getAcademicStateLabel(profile.academicState),
    ],
    language: [
      profile.topikLevel === null ? 'TOPIK 없음' : `${profile.topikLevel}급`,
      koreanLevelLabel,
      '미등록',
    ],
  };
}

export function mapStudentProfileValuesToUpdateRequest(
  view: ProfileDetailView,
  values: readonly string[],
  profile: StudentProfileResponse,
): StudentProfileUpdateMappingResult {
  const requestBody: StudentProfileUpdateRequest = {};

  if (view === 'basic') {
    const name = values[0]?.trim() ?? '';
    const nationality = getNationalityCode(values[2] ?? '');
    const currentRegion = values[3]?.trim() ?? '';
    const koreanLevel = getKoreanLevelCode(values[4] ?? '');

    if (
      !setChangedString(requestBody, 'name', name, profile.name) ||
      !setChangedString(
        requestBody,
        'nationality',
        nationality,
        profile.nationality,
      ) ||
      !setChangedString(
        requestBody,
        'currentRegion',
        currentRegion,
        profile.currentRegion,
      ) ||
      koreanLevel === null
    ) {
      return { status: 'invalid' };
    }

    if (koreanLevel !== profile.koreanLevel)
      requestBody.koreanLevel = koreanLevel;
  }

  if (view === 'residence') {
    const visaCode = getVisaCode(values[0] ?? '');
    const stayExpirationDate = getDateValue(values[1] ?? '');

    if (
      !setChangedString(requestBody, 'visaCode', visaCode, profile.visaCode) ||
      !setChangedString(
        requestBody,
        'stayExpirationDate',
        stayExpirationDate,
        profile.stayExpirationDate,
      )
    ) {
      return { status: 'invalid' };
    }
  }

  if (view === 'academic') {
    const universityName = values[0]?.trim() ?? '';
    const academicState = getAcademicStateCode(values[2] ?? '');

    if (
      !setChangedString(
        requestBody,
        'universityName',
        universityName,
        profile.universityName,
      ) ||
      !setChangedString(
        requestBody,
        'academicState',
        academicState,
        profile.academicState,
      )
    ) {
      return { status: 'invalid' };
    }
  }

  if (view === 'language') {
    const topikLevel = getTopikLevel(values[0] ?? '');
    const koreanLevel = getKoreanLevelCode(values[1] ?? '');

    if (topikLevel === undefined || koreanLevel === null) {
      return { status: 'invalid' };
    }

    if (topikLevel !== profile.topikLevel) requestBody.topikLevel = topikLevel;
    if (koreanLevel !== profile.koreanLevel)
      requestBody.koreanLevel = koreanLevel;
  }

  return Object.keys(requestBody).length > 0
    ? { status: 'ready', requestBody }
    : { status: 'unchanged' };
}
