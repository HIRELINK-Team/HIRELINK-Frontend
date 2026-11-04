import {
  ACADEMIC_STATUS_OPTIONS,
  KOREAN_LEVELS,
  RESIDENCE_QUALIFICATION_OPTIONS,
} from '../constants/studentOnboardingOptions';
import type { StudentProfileValues } from '../pages/student/StudentProfileManagementPage';
import type { StudentProfileResponse } from '../types/studentProfile';

const NATIONALITY_LABEL_BY_CODE: Readonly<Record<string, string>> = {
  VN: '베트남',
};

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
    language: [`${profile.topikLevel}급`, koreanLevelLabel, '미등록'],
  };
}
