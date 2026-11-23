import {
  ACADEMIC_STATUS_OPTIONS,
  KOREAN_LEVELS,
  RESIDENCE_QUALIFICATION_OPTIONS,
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
  birthDate,
  koreanLevel,
  location,
  name,
  nationality,
}: {
  birthDate: string;
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
    !/^\d{4}-\d{2}-\d{2}$/.test(birthDate)
  ) {
    return null;
  }

  return {
    name: trimmedName,
    birthDate,
    nationality: nationalityCode,
    currentRegion: trimmedLocation,
    koreanLevel: ONBOARDING_KOREAN_LEVEL_CODE[koreanLevel],
  };
}

export type StudentProfileUpdateMappingResult =
  | { status: 'ready'; requestBody: StudentProfileUpdateRequest }
  | { status: 'unchanged' }
  | { status: 'unsupported' }
  | { status: 'invalid' };

function getVisaLabel(visaCode: string | null) {
  if (visaCode === null) return '미등록';

  const qualification = visaCode.replace(/^D-/, 'D').replaceAll('-', '_');

  return (
    RESIDENCE_QUALIFICATION_OPTIONS.find(
      (option) => option.value === qualification,
    )?.label ?? visaCode
  );
}

function getAcademicStateLabel(academicState: string | null) {
  if (academicState === null) return '미등록';

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

function getDateValue(value: string) {
  const normalizedValue = value.replaceAll('.', '-').trim();

  return /^\d{4}-\d{2}-\d{2}$/.test(normalizedValue) ? normalizedValue : null;
}

export function mapStudentProfileResponseToValues(
  profile: StudentProfileResponse,
): StudentProfileValues {
  const koreanLevelLabel = getKoreanLevelLabel(profile.koreanLevel);
  const studyProgramLabels = {
    ASSOCIATE: '전문학사',
    BACHELOR: '학사',
    MASTER: '석사',
    DOCTORATE: '박사',
    EXCHANGE: '교환학생',
  };

  return {
    basic: [
      profile.name,
      profile.birthDate,
      NATIONALITY_LABEL_BY_CODE[profile.nationality] ?? profile.nationality,
      profile.currentRegion,
      koreanLevelLabel,
      profile.phoneNumber,
    ],
    residence: [
      getVisaLabel(profile.visaCode),
      profile.stayExpirationDate?.replaceAll('-', '.') ?? '미등록',
      '등록 완료',
    ],
    academic: [
      profile.universityName ?? '미등록',
      profile.studyProgram
        ? studyProgramLabels[profile.studyProgram]
        : '미등록',
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
  const displayed = mapStudentProfileResponseToValues(profile);

  if (view === 'basic') {
    if (
      values[0] !== displayed.basic?.[0] ||
      values[2] !== displayed.basic?.[2]
    ) {
      return { status: 'unsupported' };
    }
    const birthDate = getDateValue(values[1] ?? '');
    const currentRegion = values[3]?.trim() ?? '';
    const koreanLevel = getKoreanLevelCode(values[4] ?? '');
    if (!birthDate || !currentRegion || koreanLevel === null)
      return { status: 'invalid' };
    if (birthDate !== profile.birthDate) requestBody.birthDate = birthDate;
    if (currentRegion !== profile.currentRegion)
      requestBody.currentRegion = currentRegion;
    if (koreanLevel !== profile.koreanLevel)
      requestBody.koreanLevel = koreanLevel;
    if (values[5] !== undefined && values[5] !== profile.phoneNumber) {
      if (!/^010(?:[0-9]{8}|-[0-9]{4}-[0-9]{4})$/.test(values[5]))
        return { status: 'invalid' };
      requestBody.phoneNumber = values[5];
    }
  } else if (view === 'language') {
    if (
      values[0] !== displayed.language?.[0] ||
      values[2] !== displayed.language?.[2]
    ) {
      return { status: 'unsupported' };
    }
    const koreanLevel = getKoreanLevelCode(values[1] ?? '');
    if (koreanLevel === null) return { status: 'invalid' };
    if (koreanLevel !== profile.koreanLevel)
      requestBody.koreanLevel = koreanLevel;
  } else if (
    values.some((value, index) => value !== displayed[view]?.[index])
  ) {
    return { status: 'unsupported' };
  }

  return Object.keys(requestBody).length > 0
    ? { status: 'ready', requestBody }
    : { status: 'unchanged' };
}
