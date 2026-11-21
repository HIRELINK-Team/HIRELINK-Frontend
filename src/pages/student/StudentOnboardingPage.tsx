import { useEffect, useMemo, useState } from 'react';

import academicStatusChevronIcon from '../../assets/icons/student/academic-status-chevron.svg';
import residenceExpiryCalendarIcon from '../../assets/icons/student/residence-expiry-calendar.svg';
import locationIcon from '../../assets/icons/student/location.svg';
import searchIcon from '../../assets/icons/student/search.svg';
import clearIcon from '../../assets/icons/student/clear.svg';
import ageRestrictionImage from '../../assets/images/student/age-restriction.png';
import {
  createStudentCareer,
  confirmPhoneVerification,
  deleteStudentCareer,
  requestPhoneVerification,
  updateStudentCareer,
} from '../../api/student';
import { getApiErrorResponse, getApiErrorStatus } from '../../api/errors';
import { IS_DEMO_MODE } from '../../config/demoMode';
import { studentDataSource } from '../../services/studentDataSource';
import {
  mapIndustrySelectionToUpdateRequest,
  mapPriorityOrderToUpdateRequest,
  mapWorkLocationToUpdateRequest,
} from '../../adapters/studentMatchingPreferences';
import { mapStudentOnboardingToCreateRequest } from '../../adapters/studentProfile';
import {
  isExperienceDraftValid,
  mapExperienceDraftToCreateRequest,
  mapExperienceDraftToUpdateRequest,
  mapStudentCareerToExperience,
} from '../../adapters/studentExperience';
import {
  ACADEMIC_STATUS_OPTIONS,
  KOREAN_LEVELS,
  RESIDENCE_QUALIFICATION_OPTIONS,
  TOPIK_LEVEL_OPTIONS,
} from '../../constants/studentOnboardingOptions';
import { ExperienceCard } from '../../components/student/onboarding/ExperienceCard';
import { ExperienceForm } from '../../components/student/onboarding/ExperienceForm';
import type { AlienRegistrationFormValues } from '../../components/student/onboarding/AlienRegistrationEdit';
import { AlienRegistrationBackCamera } from '../../components/student/onboarding/AlienRegistrationBackCamera';
import {
  AlienRegistrationBackInfo,
  type AlienRegistrationBackInfoValues,
} from '../../components/student/onboarding/AlienRegistrationBackInfo';
import { AlienRegistrationBackGuide } from '../../components/student/onboarding/AlienRegistrationBackGuide';
import { AlienRegistrationBUpload } from '../../components/student/onboarding/AlienRegistrationBUpload';
import { AlienRegistrationBUploadComplete } from '../../components/student/onboarding/AlienRegistrationBUploadComplete';
import { AlienRegistrationFrontComplete } from '../../components/student/onboarding/AlienRegistrationFrontComplete';
import { AlienRegistrationFrontInfo } from '../../components/student/onboarding/AlienRegistrationFrontInfo';
import {
  AlienRegistrationResidencePeriod,
  type ResidencePeriodMethod,
} from '../../components/student/onboarding/AlienRegistrationResidencePeriod';
import { AlienRegistrationValidationModal } from '../../components/student/onboarding/AlienRegistrationValidationModal';
import { AlienRegistrationResidenceComplete } from '../../components/student/onboarding/AlienRegistrationResidenceComplete';
import { IndustryChip } from '../../components/student/onboarding/IndustryChip';
import { MatchingPriorityList } from '../../components/student/onboarding/MatchingPriorityList';
import { OnboardingBottomSheet } from '../../components/student/onboarding/OnboardingBottomSheet';
import { OnboardingField } from '../../components/student/onboarding/OnboardingField';
import { OnboardingScaffold } from '../../components/student/onboarding/OnboardingScaffold';
import { LocationServiceTermsPage } from '../../components/student/onboarding/LocationServiceTermsPage';
import { ResidenceExpiryDatePicker } from '../../components/student/onboarding/ResidenceExpiryDatePicker';
import { SelectionCard } from '../../components/student/onboarding/SelectionCard';
import { WorkTimeGrid } from '../../components/student/onboarding/WorkTimeGrid';
import { WorkLocationRadiusMap } from '../../components/student/onboarding/WorkLocationRadiusMap';
import { AlienRegistrationCamera } from '../../components/student/documents/AlienRegistrationCamera';
import { AlienRegistrationInformation } from '../../components/student/documents/AlienRegistrationInformation';
import type {
  Experience,
  ExperienceDraft,
  StudentCareerResponse,
} from '../../types/experience';
import type { IndustryId, IndustryOption } from '../../types/industry';
import type { StudentProfileCreateRequest } from '../../types/studentProfile';
import type { MatchingPriority } from '../../types/matchingPriority';
import type {
  CountryOption,
  KoreanLevel,
} from '../../constants/studentOnboardingOptions';
import type {
  AcademicStatus,
  ResidenceInfo,
  ResidenceQualification,
  TopikLevel,
} from '../../types/residence';
import type {
  Weekday,
  WorkAvailability,
  WorkTimeMode,
} from '../../types/workAvailability';
import type {
  WorkLocation,
  WorkLocationRadius,
} from '../../types/workLocation';

type BasicInfoStep =
  | 'name'
  | 'phone'
  | 'verification'
  | 'birthYear'
  | 'location'
  | 'koreanLevel';

type BasicInfoView = BasicInfoStep | 'ageRestricted';

type AlienRegistrationStep =
  | 'alienRegistrationInformation'
  | 'alienRegistrationCamera'
  | 'alienRegistrationFrontInfo'
  | 'alienRegistrationFrontComplete'
  | 'alienRegistrationResidencePeriod'
  | 'alienRegistrationA'
  | 'alienRegistrationBackCamera'
  | 'alienRegistrationBackInfo'
  | 'alienRegistrationBackInfoExpired'
  | 'alienRegistrationBackInfoInvalid'
  | 'alienRegistrationBUpload'
  | 'alienRegistrationBUploadComplete'
  | 'alienRegistrationBBackInfo'
  | 'alienRegistrationResidenceComplete';

export type OnboardingView =
  | AlienRegistrationStep
  | BasicInfoView
  | 'experienceForm'
  | 'experienceList'
  | 'industrySelection'
  | 'workTimeSelection'
  | 'workLocationSelection'
  | 'residenceQualification'
  | 'academicStatus'
  | 'topikLevel'
  | 'residenceExpiry'
  | 'matchingPriority';

type StudentOnboardingPageProps = {
  enableCareerApi?: boolean;
  initialStep?: OnboardingView;
  onBack?: () => void;
  onComplete?: (
    requestBody: StudentProfileCreateRequest,
  ) => boolean | Promise<boolean | void> | void;
};

type BasicInfo = {
  birthDate: string;
  koreanLevel: KoreanLevel;
  location: string;
  name: string;
  nationality: CountryOption;
  phone: string;
  verificationCode: string;
};

const STEP_ORDER: BasicInfoStep[] = [
  'name',
  'birthYear',
  'phone',
  'verification',
  'location',
  'koreanLevel',
];

const BASIC_INFO_PROGRESS: Record<BasicInfoStep, number> = {
  name: 1,
  phone: 2,
  verification: 2,
  birthYear: 3,
  location: 4,
  koreanLevel: 5,
};

const BASIC_INFO_TOTAL_SUB_STEPS = Math.max(
  ...Object.values(BASIC_INFO_PROGRESS),
);

function isBasicInfoStep(step: OnboardingView): step is BasicInfoStep {
  return STEP_ORDER.some((basicInfoStep) => basicInfoStep === step);
}

const INITIAL_INFO: BasicInfo = {
  name: '',
  phone: '',
  verificationCode: '',
  birthDate: '',
  nationality: '베트남',
  location: '',
  koreanLevel: 'beginner',
};

const INITIAL_ALIEN_REGISTRATION_VALUES: AlienRegistrationFormValues = {
  name: 'LIN MAI',
  nationality: '베트남',
  residenceQualification: 'D-2',
  registrationNumber: '*******-********',
  issueDate: '인식된 날짜',
  serialNumber: '인식된 번호',
  expiryDate: '2027.09.23',
};

const INITIAL_ALIEN_REGISTRATION_BACK_VALUES: AlienRegistrationBackInfoValues = {
  permissionDate: '2022.05.25',
  expirationDate: '2023.05.11',
  reportDate: '2021.04.23',
  serialNumber: '인식된 일련번호',
};

const EMPTY_EXPERIENCE_DRAFT: ExperienceDraft = {
  workplace: '',
  startMonth: '',
  endMonth: '',
  duties: '',
};

const INITIAL_EXPERIENCES: Experience[] = [
  {
    id: 'cafe-part-time',
    workplace: '카페 아르바이트',
    startMonth: '2023.03',
    endMonth: '2023.09',
    duties: '음료 제조, 고객 응대',
  },
];

const INDUSTRY_ROWS: IndustryOption[][] = [
  [
    { id: 'foodCafe', label: '음식점·카페' },
    { id: 'retail', label: '매장·판매' },
  ],
  [
    { id: 'officeTourism', label: '사무·행사·관광' },
    { id: 'translation', label: '통·번역' },
    { id: 'dutyFree', label: '면세점' },
  ],
  [
    { id: 'majorStudy', label: '전공·학업' },
    { id: 'internship', label: '인턴십' },
    { id: 'other', label: '기타' },
  ],
];

const INITIAL_SELECTED_INDUSTRIES: IndustryId[] = ['foodCafe', 'dutyFree'];

const INITIAL_WORK_AVAILABILITY: WorkAvailability = {
  daytime: {
    mon: [0, 1, 2, 3, 4, 5, 6, 7],
    tue: [],
    wed: [12, 13, 14, 15, 16, 17, 18, 19],
    thu: [],
    fri: [],
    sat: [],
    sun: [],
  },
  nighttime: {
    mon: [0, 1, 2, 3, 4, 5, 6, 7],
    tue: [],
    wed: [10, 11, 12, 13, 14, 15],
    thu: [],
    fri: [],
    sat: [],
    sun: [],
  },
};

const WORK_LOCATION_RADIUS_OPTIONS: WorkLocationRadius[] = [100, 500, 1000];

const INITIAL_WORK_LOCATION: WorkLocation = {
  address: '',
  radius: 100,
};

const INITIAL_RESIDENCE_INFO: ResidenceInfo = {
  residenceQualification: 'D2_1',
  academicStatus: 'ENROLLED',
  residenceExpiryDate: '',
  topikLevel: 'LEVEL_4',
};

const INITIAL_MATCHING_PRIORITIES: MatchingPriority[] = [
  {
    id: 'workTime',
    label: '\uADFC\uBB34\uC2DC\uAC04',
    description:
      '\uC6D0\uD558\uB294 \uC2DC\uAC04\uB300\uC5D0 \uC77C\uD558\uACE0 \uC2F6\uC5B4\uC694.',
  },
  {
    id: 'wage',
    label: '\uAE09\uC5EC',
    description:
      '\uB9CC\uC871\uC2A4\uB7EC\uC6B4 \uAE09\uC5EC\uB97C \uBC1B\uACE0 \uC2F6\uC5B4\uC694.',
  },
  {
    id: 'distance',
    label: '\uAC70\uB9AC',
    description:
      '\uC9D1 \uAC00\uAE4C\uC6B4 \uACF3\uC5D0\uC11C \uC77C\uD558\uACE0 \uC2F6\uC5B4\uC694.',
  },
  {
    id: 'industry',
    label: '\uC5C5\uC885',
    description:
      '\uC6D0\uD558\uB294 \uBD84\uC57C\uC5D0\uC11C \uC77C\uD558\uACE0 \uC2F6\uC5B4\uC694.',
  },
];

function formatResidenceExpiryDate(date: string) {
  return date ? date.replaceAll('-', '.') : '';
}

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 11);

  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}

function isValidPhone(value: string) {
  return /^01[0-9]-\d{3,4}-\d{4}$/.test(value);
}

function isValidBirthDate(value: string) {
  const matched = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!matched) return false;

  const [, year, month, day] = matched;
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  return (
    date.getFullYear() === Number(year) &&
    date.getMonth() === Number(month) - 1 &&
    date.getDate() === Number(day)
  );
}

function isAgeEligible(birthDate: string) {
  if (!isValidBirthDate(birthDate)) return false;

  const [year, month, day] = birthDate.split('-').map(Number);
  const eligibilityDate = new Date(year + 19, month - 1, day);
  return new Date() >= eligibilityDate;
}

function formatBirthDate(birthDate: string) {
  return birthDate.replaceAll('-', '.');
}

function formatBirthDateInput(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 4) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 4)}.${digits.slice(4)}`;
  return `${digits.slice(0, 4)}.${digits.slice(4, 6)}.${digits.slice(6)}`;
}

function toIsoBirthDate(value: string) {
  const normalizedValue = value.replaceAll('.', '-');
  return isValidBirthDate(normalizedValue) ? normalizedValue : null;
}

function getPhoneVerificationRequestErrorMessage(error: unknown) {
  const status = getApiErrorStatus(error);
  const apiError = getApiErrorResponse(error);
  const serverMessage = apiError?.message.trim();

  if (status === 401 && apiError?.code === 'UNAUTHORIZED') {
    return '로그인 정보가 만료되었어요. 다시 로그인해주세요.';
  }

  if (status === 409 && apiError?.code === 'DUPLICATE_PHONE_NUMBER') {
    return '이미 사용 중인 휴대전화 번호예요.';
  }

  return serverMessage ?? '인증번호를 보내지 못했어요. 다시 시도해주세요.';
}

function getPhoneVerificationConfirmErrorMessage(error: unknown) {
  const apiError = getApiErrorResponse(error);
  const serverMessage = apiError?.message.trim();

  if (serverMessage) return serverMessage;

  if (
    apiError?.code === 'PHONE_VERIFICATION_EXPIRED' ||
    apiError?.code === 'VERIFICATION_CODE_EXPIRED'
  ) {
    return '인증번호가 만료되었어요. 다시 요청해주세요.';
  }

  if (
    apiError?.code === 'PHONE_VERIFICATION_MISMATCH' ||
    apiError?.code === 'INVALID_VERIFICATION_CODE' ||
    apiError?.code === 'VERIFICATION_CODE_MISMATCH'
  ) {
    return '인증번호가 일치하지 않아요. 다시 입력해주세요.';
  }

  return '인증번호가 틀렸어요. 다시 입력해주세요.';
}

export default function StudentOnboardingPage({
  enableCareerApi = false,
  initialStep = 'alienRegistrationInformation',
  onBack,
  onComplete,
}: StudentOnboardingPageProps) {
  const [experienceDraft, setExperienceDraft] = useState<ExperienceDraft>(
    EMPTY_EXPERIENCE_DRAFT,
  );
  const [experienceEditingId, setExperienceEditingId] = useState<string | null>(
    null,
  );
  const [experiences, setExperiences] = useState<Experience[]>(() =>
    enableCareerApi ? [] : INITIAL_EXPERIENCES,
  );
  const [studentCareers, setStudentCareers] = useState<StudentCareerResponse[]>(
    [],
  );
  const [isCareerSaving, setIsCareerSaving] = useState(false);
  const [deletingCareerIds, setDeletingCareerIds] = useState<Set<string>>(
    () => new Set(),
  );
  const [info, setInfo] = useState<BasicInfo>(INITIAL_INFO);
  const [alienRegistrationValues] = useState<AlienRegistrationFormValues>(
    INITIAL_ALIEN_REGISTRATION_VALUES,
  );
  const [alienRegistrationBackValues] =
    useState<AlienRegistrationBackInfoValues>(
      INITIAL_ALIEN_REGISTRATION_BACK_VALUES,
    );
  const [isIndustrySelectionSubmitted, setIsIndustrySelectionSubmitted] =
    useState(false);
  const [isIndustrySaving, setIsIndustrySaving] = useState(false);
  const [otherIndustry, setOtherIndustry] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [isPhoneVerificationPending, setIsPhoneVerificationPending] =
    useState(false);
  const [isBirthDatePickerOpen, setIsBirthDatePickerOpen] = useState(false);
  const [birthDateInput, setBirthDateInput] = useState('');
  const [birthDateError, setBirthDateError] = useState('');
  const [isLocationConsentOpen, setIsLocationConsentOpen] = useState(false);
  const [isLocationServiceAgreed, setIsLocationServiceAgreed] = useState(false);
  const [isLocationTermsOpen, setIsLocationTermsOpen] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(143);
  const [selectedIndustries, setSelectedIndustries] = useState<IndustryId[]>(
    INITIAL_SELECTED_INDUSTRIES,
  );
  const [step, setStep] = useState<OnboardingView>(initialStep);
  const [verificationError, setVerificationError] = useState('');
  const [workAvailability, setWorkAvailability] = useState<WorkAvailability>(
    INITIAL_WORK_AVAILABILITY,
  );
  const [workTimeMode, setWorkTimeMode] = useState<WorkTimeMode>('daytime');
  const [isWorkTimeSelectionSubmitted, setIsWorkTimeSelectionSubmitted] =
    useState(false);
  const [
    isWorkLocationRadiusSelectionOpen,
    setIsWorkLocationRadiusSelectionOpen,
  ] = useState(false);
  const [isWorkLocationSubmitted, setIsWorkLocationSubmitted] = useState(false);
  const [isWorkLocationSaving, setIsWorkLocationSaving] = useState(false);
  const [
    isResidenceQualificationSheetOpen,
    setIsResidenceQualificationSheetOpen,
  ] = useState(false);
  const [isAcademicStatusSheetOpen, setIsAcademicStatusSheetOpen] =
    useState(false);
  const [isTopikLevelSheetOpen, setIsTopikLevelSheetOpen] = useState(false);
  const [isResidenceExpiryDatePickerOpen, setIsResidenceExpiryDatePickerOpen] =
    useState(false);
  const [isAcademicStatusSubmitted, setIsAcademicStatusSubmitted] =
    useState(false);
  const [isTopikLevelSubmitted, setIsTopikLevelSubmitted] = useState(false);
  const [isResidenceExpirySubmitted, setIsResidenceExpirySubmitted] =
    useState(false);

  useEffect(() => {
    if (!enableCareerApi) return;

    let isActive = true;

    void studentDataSource
      .getProfile()
      .then((profile) => {
        if (!isActive) return;

        setStudentCareers(profile.careers);
        setExperiences(profile.careers.map(mapStudentCareerToExperience));
      })
      .catch(() => {
        // Keep the empty career list when the profile is unavailable.
      });

    return () => {
      isActive = false;
    };
  }, [enableCareerApi]);
  const [isMatchingPrioritySubmitted, setIsMatchingPrioritySubmitted] =
    useState(false);
  const [isProfileSubmitting, setIsProfileSubmitting] = useState(false);
  const [residenceInfo, setResidenceInfo] = useState<ResidenceInfo>(
    INITIAL_RESIDENCE_INFO,
  );
  const [residenceQualificationDraft, setResidenceQualificationDraft] =
    useState<ResidenceQualification>(
      INITIAL_RESIDENCE_INFO.residenceQualification,
    );
  const [academicStatusDraft, setAcademicStatusDraft] =
    useState<AcademicStatus>(INITIAL_RESIDENCE_INFO.academicStatus);
  const [topikLevelDraft, setTopikLevelDraft] = useState<TopikLevel>(
    INITIAL_RESIDENCE_INFO.topikLevel,
  );
  const [residenceExpiryDateDraft, setResidenceExpiryDateDraft] = useState(
    INITIAL_RESIDENCE_INFO.residenceExpiryDate,
  );
  const [matchingPriorities, setMatchingPriorities] = useState<
    MatchingPriority[]
  >(INITIAL_MATCHING_PRIORITIES);
  const [workLocation, setWorkLocation] = useState<WorkLocation>(
    INITIAL_WORK_LOCATION,
  );

  useEffect(() => {
    if (step !== 'verification' || remainingSeconds === 0) return undefined;

    const timerId = window.setInterval(() => {
      setRemainingSeconds((currentSeconds) => Math.max(0, currentSeconds - 1));
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [remainingSeconds, step]);

  const currentIndex = isBasicInfoStep(step) ? STEP_ORDER.indexOf(step) : -1;
  const remainingTime = useMemo(() => {
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }, [remainingSeconds]);

  const updateInfo = <Key extends keyof BasicInfo>(
    key: Key,
    value: BasicInfo[Key],
  ) => {
    setInfo((currentInfo) => ({ ...currentInfo, [key]: value }));
  };

  const handleResidencePeriodConfirm = (method: ResidencePeriodMethod) => {
    if (method === 'cardBack') {
      setStep('alienRegistrationA');
      return;
    }

    setStep('alienRegistrationBUpload');
  };

  const updateExperienceDraft = <Key extends keyof ExperienceDraft>(
    key: Key,
    value: ExperienceDraft[Key],
  ) => {
    setExperienceDraft((currentDraft) => ({ ...currentDraft, [key]: value }));
  };

  const handleExperienceCreate = () => {
    setExperienceDraft(EMPTY_EXPERIENCE_DRAFT);
    setExperienceEditingId(null);
    setStep('experienceForm');
  };

  const handleExperienceEdit = (experienceId: string) => {
    const experience = experiences.find((item) => item.id === experienceId);
    if (!experience) return;

    setExperienceDraft({
      workplace: experience.workplace,
      startMonth: experience.startMonth,
      endMonth: experience.endMonth,
      duties: experience.duties,
    });
    setExperienceEditingId(experienceId);
    setStep('experienceForm');
  };

  const handleExperienceDelete = async (experienceId: string) => {
    if (!enableCareerApi) {
      setExperiences((currentExperiences) =>
        currentExperiences.filter(
          (experience) => experience.id !== experienceId,
        ),
      );
      return;
    }

    if (deletingCareerIds.has(experienceId)) return;

    const career = studentCareers.find(
      (studentCareer) => String(studentCareer.careerId) === experienceId,
    );

    if (!career) return;

    setDeletingCareerIds((currentIds) => new Set(currentIds).add(experienceId));

    try {
      await deleteStudentCareer(career.careerId);

      setStudentCareers((currentCareers) =>
        currentCareers.filter(
          (studentCareer) => studentCareer.careerId !== career.careerId,
        ),
      );
      setExperiences((currentExperiences) =>
        currentExperiences.filter(
          (experience) => experience.id !== experienceId,
        ),
      );
    } catch (error) {
      window.alert(
        getApiErrorResponse(error)?.message ??
          '경력 삭제에 실패했어요. 다시 시도해 주세요.',
      );
    } finally {
      setDeletingCareerIds((currentIds) => {
        const nextIds = new Set(currentIds);
        nextIds.delete(experienceId);
        return nextIds;
      });
    }
  };

  const handleIndustryToggle = (industryId: IndustryId) => {
    setIsIndustrySelectionSubmitted(false);
    const isOtherBeingDeselected =
      industryId === 'other' && selectedIndustries.includes('other');

    if (isOtherBeingDeselected) {
      setOtherIndustry('');
    }

    setSelectedIndustries((currentIndustries) => {
      const isSelected = currentIndustries.includes(industryId);

      return isSelected
        ? currentIndustries.filter(
            (currentIndustry) => currentIndustry !== industryId,
          )
        : [...currentIndustries, industryId];
    });
  };

  const handleIndustrySave = async (businessTypeFlexible: boolean) => {
    if (isIndustrySaving) return;

    const requestBody = mapIndustrySelectionToUpdateRequest(
      selectedIndustries,
      otherIndustry,
      businessTypeFlexible,
    );

    if (!requestBody) {
      window.alert('희망 직종을 하나 이상 선택해 주세요.');
      return;
    }

    setIsIndustrySaving(true);

    try {
      await studentDataSource.updateMatchingPreferences(requestBody);

      if (businessTypeFlexible) {
        setSelectedIndustries([]);
        setOtherIndustry('');
      }

      setIsIndustrySelectionSubmitted(true);
      setStep('workTimeSelection');
    } catch (error) {
      window.alert(
        getApiErrorResponse(error)?.message ??
          '희망 직종 저장에 실패했어요. 다시 시도해 주세요.',
      );
    } finally {
      setIsIndustrySaving(false);
    }
  };

  const handleIndustryConfirm = () => void handleIndustrySave(false);

  const handleIndustryNoPreference = () => void handleIndustrySave(true);

  const handleWorkTimeSlotsChange = (day: Weekday, slots: number[]) => {
    setIsWorkTimeSelectionSubmitted(false);
    setWorkAvailability((currentAvailability) => ({
      ...currentAvailability,
      [workTimeMode]: {
        ...currentAvailability[workTimeMode],
        [day]: slots,
      },
    }));
  };

  const handleWorkTimeConfirm = () => {
    setIsWorkTimeSelectionSubmitted(true);
    setStep('workLocationSelection');
  };

  const handleWorkLocationChange = (address: string) => {
    setWorkLocation((currentLocation) => ({
      ...currentLocation,
      address,
    }));
    setIsWorkLocationSubmitted(false);
  };

  const handleCurrentWorkLocation = () => {
    handleWorkLocationChange('강남역');
  };

  const handleWorkLocationConfirm = () => {
    if (!workLocation.address.trim()) {
      window.alert('희망 근무위치를 입력해 주세요.');
      return;
    }

    setIsWorkLocationRadiusSelectionOpen(true);
  };

  const handleWorkLocationRadiusChange = (radius: WorkLocationRadius) => {
    setWorkLocation((currentLocation) => ({ ...currentLocation, radius }));
    setIsWorkLocationSubmitted(false);
  };

  const handleWorkLocationRadiusConfirm = async () => {
    if (isWorkLocationSaving) return;

    const requestBody = mapWorkLocationToUpdateRequest(workLocation);
    if (!requestBody) {
      window.alert('희망 근무위치를 입력해 주세요.');
      return;
    }

    setIsWorkLocationSaving(true);

    try {
      await studentDataSource.updateMatchingPreferences(requestBody);
      setIsWorkLocationRadiusSelectionOpen(false);
      setIsWorkLocationSubmitted(true);
      setStep('residenceQualification');
    } catch (error) {
      window.alert(
        getApiErrorResponse(error)?.message ??
          '희망 근무위치 저장에 실패했어요. 다시 시도해 주세요.',
      );
    } finally {
      setIsWorkLocationSaving(false);
    }
  };

  const handleResidenceQualificationConfirm = () => {
    const firstAcademicStatus =
      ACADEMIC_STATUS_OPTIONS[residenceQualificationDraft][0].value;

    setResidenceInfo({
      residenceQualification: residenceQualificationDraft,
      academicStatus: firstAcademicStatus,
      residenceExpiryDate: residenceInfo.residenceExpiryDate,
      topikLevel: residenceInfo.topikLevel,
    });
    setAcademicStatusDraft(firstAcademicStatus);
    setIsResidenceQualificationSheetOpen(false);
  };

  const handleResidenceQualificationNext = () => {
    setStep('academicStatus');
  };

  const handleAcademicStatusConfirm = () => {
    setResidenceInfo((currentResidenceInfo) => ({
      ...currentResidenceInfo,
      academicStatus: academicStatusDraft,
    }));
    setIsAcademicStatusSheetOpen(false);
  };

  const handleAcademicStatusNext = () => {
    setIsAcademicStatusSubmitted(true);
    setStep('topikLevel');
  };

  const handleTopikLevelConfirm = () => {
    setResidenceInfo((currentResidenceInfo) => ({
      ...currentResidenceInfo,
      topikLevel: topikLevelDraft,
    }));
    setIsTopikLevelSheetOpen(false);
  };

  const handleTopikLevelNext = () => {
    setIsTopikLevelSubmitted(true);
    setStep('residenceExpiry');
  };

  const handleResidenceExpiryDateConfirm = (date: string) => {
    setResidenceInfo((currentResidenceInfo) => ({
      ...currentResidenceInfo,
      residenceExpiryDate: date,
    }));
    setResidenceExpiryDateDraft(date);
    setIsResidenceExpiryDatePickerOpen(false);
  };

  const handleResidenceExpiryNext = () => {
    if (!residenceInfo.residenceExpiryDate) {
      window.alert('체류 만료일을 선택해 주세요.');
      return;
    }

    setIsResidenceExpirySubmitted(true);
    setStep('matchingPriority');
  };

  const handleMatchingPrioritySubmit = async () => {
    if (isProfileSubmitting) return;

    if (!onComplete) {
      setIsMatchingPrioritySubmitted(true);
      return;
    }

    const requestBody = mapStudentOnboardingToCreateRequest(info);
    if (!requestBody) return;

    const priorityRequest = mapPriorityOrderToUpdateRequest(
      matchingPriorities.map((priority) => priority.id),
    );
    if (!priorityRequest) return;

    setIsProfileSubmitting(true);

    try {
      await studentDataSource.updateMatchingPreferences(priorityRequest);
      const didComplete = await onComplete(requestBody);
      if (didComplete !== false) setIsMatchingPrioritySubmitted(true);
    } catch (error) {
      window.alert(
        getApiErrorResponse(error)?.message ??
          '프로필 등록에 실패했어요. 다시 시도해 주세요.',
      );
    } finally {
      setIsProfileSubmitting(false);
    }
  };

  const isCurrentExperienceDraftValid = isExperienceDraftValid(experienceDraft);

  const handleExperienceSave = async () => {
    if (!isCurrentExperienceDraftValid || isCareerSaving) return;

    if (enableCareerApi) {
      setIsCareerSaving(true);

      try {
        if (experienceEditingId) {
          const originalCareer = studentCareers.find(
            (career) => String(career.careerId) === experienceEditingId,
          );

          if (!originalCareer) return;

          const mappingResult = mapExperienceDraftToUpdateRequest(
            experienceDraft,
            originalCareer,
          );

          if (mappingResult.status === 'invalid') return;
          if (mappingResult.status === 'unchanged') {
            setStep('experienceList');
            return;
          }

          const updatedCareer = await updateStudentCareer(
            originalCareer.careerId,
            mappingResult.requestBody,
          );

          setStudentCareers((currentCareers) =>
            currentCareers.map((career) =>
              career.careerId === updatedCareer.careerId
                ? updatedCareer
                : career,
            ),
          );
          setExperiences((currentExperiences) =>
            currentExperiences.map((experience) =>
              experience.id === String(updatedCareer.careerId)
                ? mapStudentCareerToExperience(updatedCareer)
                : experience,
            ),
          );
        } else {
          const requestBody =
            mapExperienceDraftToCreateRequest(experienceDraft);

          if (!requestBody) return;

          const createdCareer = await createStudentCareer(requestBody);

          setStudentCareers((currentCareers) => [
            ...currentCareers,
            createdCareer,
          ]);
          setExperiences((currentExperiences) => [
            ...currentExperiences,
            mapStudentCareerToExperience(createdCareer),
          ]);
        }

        setStep('experienceList');
      } catch (error) {
        const serverMessage = getApiErrorResponse(error)?.message;
        window.alert(
          serverMessage ?? '경력 저장에 실패했어요. 다시 시도해 주세요.',
        );
      } finally {
        setIsCareerSaving(false);
      }

      return;
    }

    if (experienceEditingId) {
      setExperiences((currentExperiences) =>
        currentExperiences.map((experience) =>
          experience.id === experienceEditingId
            ? { ...experience, ...experienceDraft }
            : experience,
        ),
      );
    } else {
      setExperiences((currentExperiences) => [
        ...currentExperiences,
        { ...experienceDraft, id: `experience-${Date.now()}` },
      ]);
    }

    setStep('experienceList');
  };

  if (step === 'ageRestricted') {
    return (
      <main className="relative mx-auto h-[844px] w-[390px] max-w-none overflow-hidden bg-[#F5F5F5] text-center font-['Pretendard','Apple_SD_Gothic_Neo','Noto_Sans_KR',sans-serif] tracking-[-0.02em] text-[#191F28]">
        <img
          alt=""
          className="absolute top-[278px] left-1/2 h-[113px] w-[88px] -translate-x-1/2 object-contain drop-shadow-[1px_1px_38.7px_rgba(0,184,148,0.28)]"
          src={ageRestrictionImage}
        />
        <h1 className="absolute top-[410px] left-1/2 m-0 w-full -translate-x-1/2 whitespace-pre-line text-[22px] leading-[1.5] font-semibold">
          아직은 서비스를{`\n`}이용할 수 없어요
        </h1>
        <p className="absolute top-[482px] left-1/2 m-0 w-full -translate-x-1/2 whitespace-pre-line text-[13px] leading-[1.5] text-[#909597]">
          하이어링크는 만 18세 이상부터 이용할 수 있어요.{`\n`}
          이용 가능 연령이 되면 다시 찾아주세요!
        </p>
        <button
          className="absolute top-[750px] left-6 h-[57px] w-[342px] rounded-[15px] border-0 bg-[#00B894] text-[20px] leading-[1.5] font-medium text-[#F5F5F5]"
          type="button"
          onClick={() => {
            updateInfo('birthDate', '');
            setBirthDateInput('');
            setBirthDateError('');
            setStep('birthYear');
          }}
        >
          확인
        </button>
      </main>
    );
  }

  if (step === 'alienRegistrationInformation') {
    return (
      <AlienRegistrationInformation
        onBack={() => onBack?.()}
        onRegister={() => setStep('alienRegistrationCamera')}
      />
    );
  }

  if (step === 'alienRegistrationCamera') {
    return (
      <AlienRegistrationCamera
        onBack={() => setStep('alienRegistrationInformation')}
        onCapture={() => setStep('alienRegistrationFrontInfo')}
      />
    );
  }

  if (step === 'alienRegistrationFrontInfo') {
    return (
      <AlienRegistrationFrontInfo
        onBack={() => setStep('alienRegistrationCamera')}
        onConfirm={() => setStep('alienRegistrationFrontComplete')}
        onRetry={() => setStep('alienRegistrationCamera')}
        values={alienRegistrationValues}
      />
    );
  }

  if (step === 'alienRegistrationFrontComplete') {
    return (
      <AlienRegistrationFrontComplete
        onBack={() => setStep('alienRegistrationFrontInfo')}
        onConfirm={() => setStep('alienRegistrationResidencePeriod')}
      />
    );
  }

  if (step === 'alienRegistrationResidencePeriod') {
    return (
      <AlienRegistrationResidencePeriod
        onBack={() => setStep('alienRegistrationFrontComplete')}
        onConfirm={handleResidencePeriodConfirm}
      />
    );
  }

  if (step === 'alienRegistrationA') {
    return (
      <AlienRegistrationBackGuide
        onBack={() => setStep('alienRegistrationResidencePeriod')}
        onConfirm={() => setStep('alienRegistrationBackCamera')}
      />
    );
  }

  if (step === 'alienRegistrationBackCamera') {
    return (
      <AlienRegistrationBackCamera
        onBack={() => setStep('alienRegistrationA')}
        onCapture={() => setStep('alienRegistrationBackInfo')}
      />
    );
  }

  if (step === 'alienRegistrationBackInfo') {
    return (
      <AlienRegistrationBackInfo
        onBack={() => setStep('alienRegistrationBackCamera')}
        onConfirm={() => setStep('alienRegistrationResidenceComplete')}
        onRetry={() => setStep('alienRegistrationBackCamera')}
        values={alienRegistrationBackValues}
      />
    );
  }

  if (
    step === 'alienRegistrationBackInfoExpired' ||
    step === 'alienRegistrationBackInfoInvalid'
  ) {
    const isExpired = step === 'alienRegistrationBackInfoExpired';

    return (
      <>
        <AlienRegistrationBackInfo
          onBack={() => setStep('alienRegistrationBackCamera')}
          onConfirm={() => undefined}
          onRetry={() => setStep('alienRegistrationBackCamera')}
          values={alienRegistrationBackValues}
        />
        <AlienRegistrationValidationModal
          onUploadPdf={
            isExpired ? () => setStep('alienRegistrationBUpload') : undefined
          }
          type={isExpired ? 'expired' : 'invalid'}
          onRetry={() => setStep('alienRegistrationBackCamera')}
        />
      </>
    );
  }

  if (step === 'alienRegistrationBUpload') {
    return (
      <AlienRegistrationBUpload
        onBack={() => setStep('alienRegistrationResidencePeriod')}
        onUpload={() => setStep('alienRegistrationBUploadComplete')}
      />
    );
  }

  if (step === 'alienRegistrationBUploadComplete') {
    return (
      <AlienRegistrationBUploadComplete
        onBack={() => setStep('alienRegistrationBUpload')}
        onConfirm={() => setStep('alienRegistrationBBackInfo')}
      />
    );
  }

  if (step === 'alienRegistrationBBackInfo') {
    return (
      <AlienRegistrationBackInfo
        onBack={() => setStep('alienRegistrationBUploadComplete')}
        onConfirm={() => setStep('alienRegistrationResidenceComplete')}
        onRetry={() => setStep('alienRegistrationBUpload')}
        values={alienRegistrationBackValues}
      />
    );
  }

  if (step === 'alienRegistrationResidenceComplete') {
    return (
      <AlienRegistrationResidenceComplete
        onBack={() => setStep('alienRegistrationBBackInfo')}
        onConfirm={() => setStep('birthYear')}
      />
    );
  }

  if (step === 'experienceForm') {
    return (
      <ExperienceForm
        draft={experienceDraft}
        isEditing={Boolean(experienceEditingId)}
        isSubmitDisabled={!isCurrentExperienceDraftValid || isCareerSaving}
        onBack={() => setStep('experienceList')}
        onChange={updateExperienceDraft}
        onSubmit={() => void handleExperienceSave()}
      />
    );
  }

  if (step === 'experienceList') {
    return (
      <OnboardingScaffold
        activeSubStep={0}
        ctaLabel="확인"
        ctaContainerClassName="mt-auto shrink-0 pt-8"
        contentClassName="mt-[28px]"
        currentStage={3}
        isPageScrollable
        question={'이전에 해본 아르바이트나\n근무경험을 알려주세요.'}
        showProgress={false}
        responsive
        totalStages={6}
        stageLabel="경력 입력"
        totalSubSteps={1}
        onBack={() => setStep('koreanLevel')}
        onCtaClick={() => setStep('industrySelection')}
      >
        <button
          className="mt-[27px] flex h-[54px] w-full items-center gap-4 rounded-[15px] border-[0.7px] border-[#B0B8C1] bg-transparent px-[29px] text-[17px] leading-[1.5]"
          type="button"
          onClick={handleExperienceCreate}
        >
          <span aria-hidden="true">+</span>
          경력 추가하기
        </button>

        {experiences.length > 0 ? (
          <div className="mt-2.5 max-h-[282px] space-y-2.5 overflow-y-auto overscroll-contain pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {experiences.map((experience) => (
              <ExperienceCard
                experience={experience}
                isDeleting={deletingCareerIds.has(experience.id)}
                key={experience.id}
                onDelete={(experienceId) =>
                  void handleExperienceDelete(experienceId)
                }
                onEdit={handleExperienceEdit}
              />
            ))}
          </div>
        ) : (
          <p className="mt-6 text-center text-[15px] leading-[1.5] text-[#8B95A1]">
            등록한 경력이 없어요. 필요하면 나중에 추가할 수 있어요.
          </p>
        )}
      </OnboardingScaffold>
    );
  }

  if (step === 'industrySelection') {
    const isOtherSelected = selectedIndustries.includes('other');

    return (
      <OnboardingScaffold
        activeSubStep={1}
        ctaLabel="확인"
        currentStage={3}
        footer={
          <div className="grid grid-cols-2 gap-3">
            <button
              className="h-[57px] rounded-[15px] border-0 bg-[#00B894] text-[20px] leading-[1.5] font-medium text-[#F5F5F5] active:bg-[#009376]"
              type="button"
              onClick={handleIndustryConfirm}
            >
              확인
            </button>
            <button
              className="h-[57px] rounded-[15px] border-[0.7px] border-[#191F28] bg-transparent text-[20px] leading-[1.5] font-normal text-[#191F28]"
              type="button"
              onClick={handleIndustryNoPreference}
            >
              상관없어요
            </button>
          </div>
        }
        question={'원하는 업종을\n선택해주세요.'}
        stageLabel="구직조건 입력"
        totalSubSteps={3}
        onBack={() => setStep('experienceList')}
        onCtaClick={handleIndustryConfirm}
      >
        <div className="mt-[27px] space-y-[5px]">
          {INDUSTRY_ROWS.map((industryRow) => (
            <div className="flex items-center gap-2" key={industryRow[0].id}>
              {industryRow.map((industry) => (
                <IndustryChip
                  isSelected={selectedIndustries.includes(industry.id)}
                  key={industry.id}
                  label={industry.label}
                  onClick={() => handleIndustryToggle(industry.id)}
                />
              ))}
            </div>
          ))}
        </div>

        {isOtherSelected ? (
          <label className="mt-[27px] block">
            <span className="block text-[17px] leading-[1.5] text-[#191F28]">
              기타:
            </span>
            <span className="relative mt-2 block">
              <input
                className="h-[57px] w-full border-0 border-b border-[#B0B8C1] bg-transparent py-0 pr-8 text-[26px] leading-[1.5] font-semibold tracking-[-0.02em] text-[#191F28] outline-none placeholder:text-[#B0B8C1]"
                placeholder="업종 입력"
                value={otherIndustry}
                onChange={(event) => {
                  setOtherIndustry(event.target.value);
                  setIsIndustrySelectionSubmitted(false);
                }}
              />
              {otherIndustry ? (
                <button
                  aria-label="기타 업종 입력 지우기"
                  className="absolute top-1/2 right-4 -translate-y-1/2"
                  type="button"
                  onClick={() => setOtherIndustry('')}
                >
                  <img alt="" src={clearIcon} />
                </button>
              ) : null}
            </span>
          </label>
        ) : null}

        <p aria-live="polite" className="sr-only">
          {isIndustrySelectionSubmitted
            ? '희망 업종 선택이 저장되었습니다.'
            : ''}
        </p>
      </OnboardingScaffold>
    );
  }

  if (step === 'workTimeSelection') {
    return (
      <OnboardingScaffold
        activeSubStep={2}
        ctaLabel="확인"
        currentStage={3}
        isPageScrollable
        question={'원하는 근무시간대를\n선택해주세요.'}
        stageLabel="구직조건 입력"
        totalSubSteps={3}
        onBack={() => setStep('industrySelection')}
        onCtaClick={handleWorkTimeConfirm}
      >
        <p className="mt-[14px] text-[15px] leading-[1.5] text-[#939393]">
          드래그하여 선택해주세요.
        </p>
        <WorkTimeGrid
          mode={workTimeMode}
          selectedSlots={workAvailability[workTimeMode]}
          onModeChange={setWorkTimeMode}
          onSlotsChange={handleWorkTimeSlotsChange}
        />
        <p aria-live="polite" className="sr-only">
          {isWorkTimeSelectionSubmitted
            ? '근무 가능 시간이 저장되었습니다.'
            : ''}
        </p>
      </OnboardingScaffold>
    );
  }

  if (step === 'workLocationSelection') {
    if (isWorkLocationRadiusSelectionOpen) {
      return (
        <WorkLocationRadiusMap
          address={workLocation.address}
          radius={workLocation.radius}
          radiusOptions={WORK_LOCATION_RADIUS_OPTIONS}
          isConfirming={isWorkLocationSaving}
          onBack={() => setIsWorkLocationRadiusSelectionOpen(false)}
          onConfirm={() => void handleWorkLocationRadiusConfirm()}
          onRadiusChange={handleWorkLocationRadiusChange}
        />
      );
    }

    return (
      <OnboardingScaffold
        activeSubStep={3}
        ctaLabel="확인"
        currentStage={3}
        isCtaDisabled={!workLocation.address.trim()}
        question={'원하는 근무 희망위치를\n입력해주세요.'}
        stageLabel="구직조건 입력"
        totalSubSteps={3}
        onBack={() => setStep('workTimeSelection')}
        onCtaClick={handleWorkLocationConfirm}
      >
        <label className="mt-[27px] block">
          <span className="block text-[17px] leading-[1.5] text-[#191F28]">
            주소
          </span>
          <span className="relative mt-2 flex h-[57px] items-center border-0 border-b border-[#B0B8C1]">
            <img
              alt=""
              className="h-[22px] w-[22px] shrink-0"
              src={searchIcon}
            />
            <input
              autoComplete="street-address"
              className="h-full min-w-0 flex-1 border-0 bg-transparent pl-[14px] text-[26px] leading-[1.5] font-semibold tracking-[-0.02em] text-[#191F28] outline-none placeholder:font-normal placeholder:text-[#B0B8C1]"
              name="preferredWorkLocation"
              placeholder="주소 검색"
              type="text"
              value={workLocation.address}
              onChange={(event) => handleWorkLocationChange(event.target.value)}
            />
          </span>
        </label>
        <button
          className="mt-[15px] flex h-[54px] w-full items-center gap-4 rounded-[15px] border-[0.7px] border-[#B0B8C1] bg-transparent px-[23px] text-left text-[17px] leading-[1.5] text-[#191F28]"
          type="button"
          onClick={handleCurrentWorkLocation}
        >
          <img alt="" className="h-[14px] w-[14px]" src={locationIcon} />
          현재 위치로 찾기
        </button>
        <p aria-live="polite" className="sr-only">
          {isWorkLocationSubmitted
            ? '희망 근무 위치와 이동 가능 범위가 저장되었습니다.'
            : ''}
        </p>
      </OnboardingScaffold>
    );
  }

  if (step === 'residenceQualification') {
    const residenceQualificationLabel = RESIDENCE_QUALIFICATION_OPTIONS.find(
      (option) => option.value === residenceInfo.residenceQualification,
    )?.label;

    return (
      <OnboardingScaffold
        activeSubStep={1}
        ctaLabel="확인"
        currentStage={4}
        question={'현재 체류자격이\n무엇인가요?'}
        stageLabel="체류자격 입력"
        totalSubSteps={4}
        onBack={() => setStep('workLocationSelection')}
        onCtaClick={handleResidenceQualificationNext}
      >
        <button
          aria-haspopup="dialog"
          className="mt-[27px] flex h-[68px] w-full items-center border-0 border-b border-[#B0B8C1] bg-transparent p-0 text-left"
          type="button"
          onClick={() => {
            setResidenceQualificationDraft(
              residenceInfo.residenceQualification,
            );
            setIsResidenceQualificationSheetOpen(true);
          }}
        >
          <span>
            <span className="block text-[15px] leading-[1.2]">체류자격</span>
            <span className="mt-1 block text-[26px] leading-[1.2] font-semibold">
              {residenceQualificationLabel}
            </span>
          </span>
          <span
            aria-hidden="true"
            className="ml-auto flex h-[8.5px] w-[17px] items-center justify-center"
          >
            <img
              alt=""
              className="h-[17px] w-[8.5px] -rotate-90"
              src={academicStatusChevronIcon}
            />
          </span>
        </button>
        {isResidenceQualificationSheetOpen ? (
          <OnboardingBottomSheet
            options={RESIDENCE_QUALIFICATION_OPTIONS}
            selectedValue={residenceQualificationDraft}
            title="체류자격 선택"
            onClose={() => setIsResidenceQualificationSheetOpen(false)}
            onConfirm={handleResidenceQualificationConfirm}
            onSelect={setResidenceQualificationDraft}
          />
        ) : null}
      </OnboardingScaffold>
    );
  }

  if (step === 'academicStatus') {
    const academicStatusOptions =
      ACADEMIC_STATUS_OPTIONS[residenceInfo.residenceQualification];
    const academicStatusLabel = academicStatusOptions.find(
      (option) => option.value === residenceInfo.academicStatus,
    )?.label;

    return (
      <OnboardingScaffold
        activeSubStep={2}
        ctaLabel="확인"
        currentStage={4}
        question={'현재 학업상태를\n알려주세요.'}
        stageLabel="체류자격 입력"
        totalSubSteps={4}
        onBack={() => setStep('residenceQualification')}
        onCtaClick={handleAcademicStatusNext}
      >
        <button
          aria-haspopup="dialog"
          className="mt-[27px] flex h-[57px] w-full items-center border-0 border-b border-[#B0B8C1] bg-transparent p-0 text-left"
          type="button"
          onClick={() => {
            setAcademicStatusDraft(residenceInfo.academicStatus);
            setIsAcademicStatusSheetOpen(true);
          }}
        >
          <span>
            <span className="block text-[17px] leading-[1.5]">학업상태</span>
            <span className="block text-[26px] leading-[1.5] font-semibold">
              {academicStatusLabel}
            </span>
          </span>
          <span
            aria-hidden="true"
            className="ml-auto flex h-[8.5px] w-[17px] items-center justify-center"
          >
            <img
              alt=""
              className="h-[17px] w-[8.5px] -rotate-90"
              src={academicStatusChevronIcon}
            />
          </span>
        </button>
        <p aria-live="polite" className="sr-only">
          {isAcademicStatusSubmitted
            ? '체류자격과 학업상태가 저장되었습니다. 다음 단계는 TOPIK 등급 입력입니다.'
            : ''}
        </p>
        {isAcademicStatusSheetOpen ? (
          <OnboardingBottomSheet
            options={academicStatusOptions}
            selectedValue={academicStatusDraft}
            title="학업상태 선택"
            onClose={() => setIsAcademicStatusSheetOpen(false)}
            onConfirm={handleAcademicStatusConfirm}
            onSelect={setAcademicStatusDraft}
          />
        ) : null}
      </OnboardingScaffold>
    );
  }

  if (step === 'topikLevel') {
    const topikLevelLabel = TOPIK_LEVEL_OPTIONS.find(
      (option) => option.value === residenceInfo.topikLevel,
    )?.label;

    return (
      <OnboardingScaffold
        activeSubStep={3}
        ctaLabel="확인"
        currentStage={4}
        question={'현재 보유하고 있는\nTOPIK 등급을 선택해주세요.'}
        stageLabel="체류자격 입력"
        totalSubSteps={4}
        onBack={() => setStep('academicStatus')}
        onCtaClick={handleTopikLevelNext}
      >
        <button
          aria-haspopup="dialog"
          className="mt-[27px] flex h-[68px] w-full items-center border-0 border-b border-[#B0B8C1] bg-transparent p-0 text-left"
          type="button"
          onClick={() => {
            setTopikLevelDraft(residenceInfo.topikLevel);
            setIsTopikLevelSheetOpen(true);
          }}
        >
          <span>
            <span className="block text-[15px] leading-[1.2]">TOPIK</span>
            <span className="mt-1 block text-[26px] leading-[1.2] font-semibold">
              {topikLevelLabel}
            </span>
          </span>
          <span
            aria-hidden="true"
            className="ml-auto flex h-[8.5px] w-[17px] items-center justify-center"
          >
            <img
              alt=""
              className="h-[17px] w-[8.5px] -rotate-90"
              src={academicStatusChevronIcon}
            />
          </span>
        </button>
        <p aria-live="polite" className="sr-only">
          {isTopikLevelSubmitted
            ? 'TOPIK 등급이 저장되었습니다. 다음 단계는 체류기간 만료일 입력입니다.'
            : ''}
        </p>
        {isTopikLevelSheetOpen ? (
          <OnboardingBottomSheet
            options={TOPIK_LEVEL_OPTIONS}
            selectedValue={topikLevelDraft}
            title="등급 선택"
            onClose={() => setIsTopikLevelSheetOpen(false)}
            onConfirm={handleTopikLevelConfirm}
            onSelect={setTopikLevelDraft}
          />
        ) : null}
      </OnboardingScaffold>
    );
  }

  if (step === 'residenceExpiry') {
    const residenceExpiryDateLabel = residenceInfo.residenceExpiryDate
      ? formatResidenceExpiryDate(residenceInfo.residenceExpiryDate)
      : 'YYYY.MM.DD';

    return (
      <OnboardingScaffold
        activeSubStep={4}
        ctaLabel="확인"
        currentStage={4}
        isCtaDisabled={!residenceInfo.residenceExpiryDate}
        question={'체류기간 만료일을\n적어주세요.'}
        stageLabel="체류자격 입력"
        totalSubSteps={4}
        onBack={() => setStep('topikLevel')}
        onCtaClick={handleResidenceExpiryNext}
      >
        <button
          aria-haspopup="dialog"
          className="mt-[27px] flex h-[57px] w-full items-center border-0 border-b border-[#B0B8C1] bg-transparent p-0 text-left"
          type="button"
          onClick={() => {
            setResidenceExpiryDateDraft(residenceInfo.residenceExpiryDate);
            setIsResidenceExpiryDatePickerOpen(true);
          }}
        >
          <span>
            <span className="block text-[17px] leading-[1.5]">
              체류기간 만료일
            </span>
            <span
              className={`block text-[26px] leading-[1.5] ${
                residenceInfo.residenceExpiryDate
                  ? 'font-semibold text-[#191F28]'
                  : 'font-normal text-[#B0B8C1]'
              }`}
            >
              {residenceExpiryDateLabel}
            </span>
          </span>
          <img
            alt=""
            className="ml-auto size-6"
            src={residenceExpiryCalendarIcon}
          />
        </button>
        <p className="mt-[9px] text-[15px] leading-[1.5] text-[#B0B8C1]">
          근무 허가 여부는 별도 확인이 필요해요.
        </p>
        <p aria-live="polite" className="sr-only">
          {isResidenceExpirySubmitted
            ? '체류기간 만료일이 저장되었습니다. 다음 단계인 매칭 우선순위 화면은 아직 준비 중입니다.'
            : ''}
        </p>
        {isResidenceExpiryDatePickerOpen ? (
          <ResidenceExpiryDatePicker
            initialDate={residenceExpiryDateDraft}
            onClose={() => setIsResidenceExpiryDatePickerOpen(false)}
            onConfirm={handleResidenceExpiryDateConfirm}
            onDateChange={setResidenceExpiryDateDraft}
          />
        ) : null}
      </OnboardingScaffold>
    );
  }

  if (step === 'matchingPriority') {
    return (
      <OnboardingScaffold
        activeSubStep={0}
        contentClassName="mt-6"
        ctaContainerClassName="mt-auto shrink-0 pt-6"
        ctaLabel={'\uB9C8\uCE58\uAE30'}
        currentStage={5}
        isCtaDisabled={isProfileSubmitting}
        question={
          '\uC6B0\uC120\uC21C\uC704\uB97C \uC815\uD574\uC8FC\uC138\uC694.'
        }
        showProgress={false}
        stageLabel={'\uC6B0\uC120\uC21C\uC704 \uC120\uD0DD'}
        stageLabelLayout="stacked"
        totalSubSteps={1}
        onBack={() => setStep('residenceExpiry')}
        onCtaClick={handleMatchingPrioritySubmit}
      >
        <p className="mt-2 text-[15px] leading-[1.5] text-[#B0B8C1]">
          {
            '\uC911\uC694\uD55C \uC21C\uC11C\uB300\uB85C \uB04C\uC5B4\uB2E4 \uB193\uC73C\uC138\uC694.'
          }
        </p>
        <MatchingPriorityList
          priorities={matchingPriorities}
          onChange={setMatchingPriorities}
        />
        <p aria-live="polite" className="sr-only">
          {isMatchingPrioritySubmitted
            ? '\uB9E4\uCE6D \uC870\uAC74\uC774 \uC800\uC7A5\uB418\uC5C8\uC2B5\uB2C8\uB2E4. \uD648\uACFC \uB9E4\uCE6D \uACB0\uACFC \uD654\uBA74\uC740 \uC544\uC9C1 \uC900\uBE44 \uC911\uC785\uB2C8\uB2E4.'
            : ''}
        </p>
      </OnboardingScaffold>
    );
  }

  const handleBack = () => {
    if (currentIndex === 0) {
      onBack?.();
      return;
    }

    setPhoneError('');
    setVerificationError('');
    setStep(STEP_ORDER[currentIndex - 1]);
  };

  const handlePhoneVerificationRequest = async (
    shouldMoveToVerification: boolean,
  ) => {
    if (isPhoneVerificationPending || !isValidPhone(info.phone)) return false;

    setIsPhoneVerificationPending(true);

    try {
      if (IS_DEMO_MODE) {
        setRemainingSeconds(180);
        setPhoneError('');
        setVerificationError('');
        if (shouldMoveToVerification) setStep('verification');
        return true;
      }

      const response = await requestPhoneVerification({
        phoneNumber: info.phone,
      });

      setRemainingSeconds(response.expiresIn);
      setPhoneError('');
      setVerificationError('');
      if (shouldMoveToVerification) setStep('verification');

      return true;
    } catch (error) {
      const errorMessage = getPhoneVerificationRequestErrorMessage(error);

      if (shouldMoveToVerification) {
        setPhoneError(errorMessage);
      } else {
        setVerificationError(errorMessage);
      }

      return false;
    } finally {
      setIsPhoneVerificationPending(false);
    }
  };

  const handleNext = async () => {
    if (step === 'phone') {
      if (!isValidPhone(info.phone)) {
        setPhoneError('다시 입력해주세요.');
        return;
      }

      await handlePhoneVerificationRequest(true);

      return;
    }

    if (step === 'verification') {
      if (
        !/^\d{6}$/.test(info.verificationCode) ||
        isPhoneVerificationPending
      ) {
        setVerificationError('인증번호 6자리를 입력해주세요.');
        return;
      }

      setIsPhoneVerificationPending(true);

      try {
        if (!IS_DEMO_MODE) {
          await confirmPhoneVerification({
            phoneNumber: info.phone,
            code: info.verificationCode,
          });
        }
        setVerificationError('');
      } catch (error) {
        setVerificationError(getPhoneVerificationConfirmErrorMessage(error));
        return;
      } finally {
        setIsPhoneVerificationPending(false);
      }
    }

    if (step === 'birthYear') {
      if (!isValidBirthDate(info.birthDate)) {
        setBirthDateError('올바른 생년월일을 입력해주세요.');
        return;
      }

      if (info.birthDate > new Date().toISOString().slice(0, 10)) {
        setBirthDateError('오늘 이후의 날짜는 입력할 수 없어요.');
        return;
      }

      if (!isAgeEligible(info.birthDate)) {
        setStep('ageRestricted');
        return;
      }
    }
    if (step === 'location' && !info.location.trim()) return;

    if (step === 'koreanLevel') {
      setStep('experienceList');
      return;
    }

    if (currentIndex < STEP_ORDER.length - 1) {
      setStep(STEP_ORDER[currentIndex + 1]);
    }
  };

  const handlePhoneChange = (value: string) => {
    updateInfo('phone', formatPhone(value));
    setPhoneError('');
  };

  const isCtaDisabled =
    isPhoneVerificationPending ||
    (step === 'name' && !info.name.trim()) ||
    (step === 'verification' && !/^\d{6}$/.test(info.verificationCode)) ||
    (step === 'birthYear' && !isValidBirthDate(info.birthDate)) ||
    (step === 'location' && !info.location.trim());

  const questions: Record<BasicInfoStep, string> = {
    name: '본인의 이름을\n적어주세요.',
    phone: '본인의 전화번호를\n입력해주세요.',
    verification: '인증 번호를\n입력해 주세요.',
    birthYear: '본인의 생년월일을\n입력해주세요',
    location: '현재 거주지역을\n입력해주세요.',
    koreanLevel: '한국어 실력은\n어느 정도인가요?',
  };

  if (isLocationTermsOpen) {
    return (
      <LocationServiceTermsPage
        onBack={() => setIsLocationTermsOpen(false)}
      />
    );
  }

  const ctaLabel = step === 'phone' ? '인증번호 받기' : '확인';
  const basicInfoProgressByStep: Partial<Record<BasicInfoStep, number>> = {
    birthYear: 1,
    phone: 2,
    verification: 2,
    location: 3,
    koreanLevel: 4,
  };
  const basicInfoProgress = basicInfoProgressByStep[step];
  const isBasicInfoFigmaStep = basicInfoProgress !== undefined;

  return (
    <OnboardingScaffold
      activeSubStep={basicInfoProgress ?? BASIC_INFO_PROGRESS[step]}
      ctaLabel={ctaLabel}
      currentStage={isBasicInfoFigmaStep ? 2 : 1}
      isCtaDisabled={isCtaDisabled}
      isPageScrollable={step === 'location' || step === 'koreanLevel'}
      question={questions[step]}
      questionClassName={step === 'name' ? 'translate-y-[5.5px]' : undefined}
      onBack={handleBack}
      onCtaClick={() => void handleNext()}
      onEnter={() => void handleNext()}
      stageLabel="기본정보 입력"
      totalStages={isBasicInfoFigmaStep ? 6 : 5}
      totalSubSteps={isBasicInfoFigmaStep ? 4 : BASIC_INFO_TOTAL_SUB_STEPS}
    >
      {step === 'name' ? (
        <OnboardingField
          label="이름"
          placeholder="이름 입력"
          value={info.name}
          onChange={(event) => updateInfo('name', event.target.value)}
        />
      ) : null}

      {step === 'phone' ? (
        <OnboardingField
          errorMessage={phoneError}
          inputMode="tel"
          label="전화번호"
          placeholder="010-1234-5678"
          trailing={
            phoneError ? (
              <img
                alt=""
                className="mr-4 size-[21px] shrink-0"
                src={clearIcon}
              />
            ) : undefined
          }
          value={info.phone}
          onChange={(event) => handlePhoneChange(event.target.value)}
        />
      ) : null}

      {step === 'verification' ? (
        <OnboardingField
          errorMessage={verificationError}
          inputMode="numeric"
          label="인증번호"
          maxLength={6}
          placeholder="인증번호 6자리"
          trailing={
            verificationError ? (
              <img
                alt=""
                className="mr-4 size-[21px] shrink-0"
                src={clearIcon}
              />
            ) : (
              <span className="flex shrink-0 items-center gap-[7px]">
                <span className="text-[15px] leading-[1.5] font-medium text-[#009376]">
                  {remainingTime}
                </span>
                <button
                  className="h-[34px] rounded-[44px] border-[0.7px] border-[#D3D6D7] bg-transparent px-2.5 text-[13px] leading-[1.5] text-[#55595B]"
                  type="button"
                  disabled={isPhoneVerificationPending}
                  onClick={() => {
                    void handlePhoneVerificationRequest(false);
                  }}
                >
                  재요청
                </button>
              </span>
            )
          }
          value={info.verificationCode}
          onChange={(event) => {
            updateInfo(
              'verificationCode',
              event.target.value.replace(/\D/g, ''),
            );
            setVerificationError('');
          }}
        />
      ) : null}

      {step === 'birthYear' ? (
        <>
          <div className="relative mt-[27px] flex h-[83px] w-full items-center border-b border-[#B0B8C1]">
            <label className="flex min-w-0 flex-1 flex-col text-left">
              <span className="block text-[17px] leading-[1.5] text-[#191F28]">
                생년월일
              </span>
              <input
                aria-invalid={Boolean(birthDateError)}
                className="w-full border-0 bg-transparent p-0 text-[26px] leading-[1.5] font-semibold text-[#191F28] outline-none placeholder:text-[#B0B8C1]"
                inputMode="numeric"
                maxLength={10}
                placeholder="YYYY.MM.DD"
                value={birthDateInput}
                onBlur={() => {
                  if (birthDateInput && !isValidBirthDate(info.birthDate)) {
                    setBirthDateError('올바른 생년월일을 입력해주세요.');
                  }
                }}
                onChange={(event) => {
                  const value = formatBirthDateInput(event.target.value);
                  const birthDate = toIsoBirthDate(value);
                  setBirthDateInput(value);
                  updateInfo('birthDate', birthDate ?? '');
                  setBirthDateError('');
                }}
              />
            </label>
            <button
              aria-label="생년월일 선택"
              className="ml-3 flex size-6 shrink-0 items-center justify-center border-0 bg-transparent p-0"
              type="button"
              onClick={() => setIsBirthDatePickerOpen(true)}
            >
              <img
                alt=""
                className="size-6"
                src={residenceExpiryCalendarIcon}
              />
            </button>
          </div>
          {birthDateError ? (
            <p className="mt-2 mb-0 text-[15px] leading-[1.5] text-[#E05260]">
              {birthDateError}
            </p>
          ) : null}
          {isBirthDatePickerOpen ? (
            <ResidenceExpiryDatePicker
              emptyInitialDate="2000-01-01"
              initialDate={info.birthDate}
              title="생년월일 선택"
              onClose={() => setIsBirthDatePickerOpen(false)}
              onConfirm={(birthDate) => {
                updateInfo('birthDate', birthDate);
                setBirthDateInput(formatBirthDate(birthDate));
                setBirthDateError('');
                setIsBirthDatePickerOpen(false);
              }}
            />
          ) : null}
        </>
      ) : null}

      {step === 'location' ? (
        <div>
          <label className="mt-[35px] block">
            <span className="block text-[17px] leading-[1.5] text-[#1D1F20]">
              주소
            </span>
            <span className="flex h-[57px] items-center border-b border-[#B3B8B9]">
              <img alt="" className="size-[22px] shrink-0" src={searchIcon} />
              <input
                autoComplete="street-address"
                className="h-full min-w-0 flex-1 border-0 bg-transparent pl-[14px] text-[26px] leading-[1.5] font-normal tracking-[-0.02em] text-[#1D1F20] outline-none placeholder:text-[#B3B8B9]"
                name="currentRegion"
                placeholder="주소 검색"
                type="text"
                value={info.location}
                onChange={(event) => updateInfo('location', event.target.value)}
              />
            </span>
          </label>
          <button
            className="mx-auto mt-[15px] flex h-[54px] w-[340px] items-center gap-4 rounded-[15px] border-[0.7px] border-[#B3B8B9] bg-transparent px-[23px] text-left text-[17px] leading-[1.5] text-[#1D1F20]"
            type="button"
            onClick={() => setIsLocationConsentOpen(true)}
          >
            <img alt="" className="h-[14px] w-[14px]" src={locationIcon} />
            현재 위치로 찾기
          </button>
          {isLocationConsentOpen ? (
            <>
              <div aria-hidden="true" className="absolute inset-0 z-20 bg-black/50" />
              <section
                aria-label="위치기반 서비스 이용약관 동의"
                className="absolute bottom-0 left-0 z-30 min-h-[368px] w-[390px] rounded-t-[20px] bg-[#F5F5F5] px-6 pt-7"
              >
                <h2 className="m-0 text-[20px] leading-[1.5] font-semibold text-[#1D1F20]">
                  위치기반 서비스 이용약관 동의
                </h2>
                <p className="mt-[22px] mb-0 whitespace-pre-line text-[15px] leading-[1.5] text-[#55595B]">
                  내 주변 일자리를 찾기 위해 현재 위치(GPS)를 사용해요.{`\n`}
                  위치 정보는 검색에만 이용하며 계속 추적하지 않아요.{`\n`}
                  동의하지 않아도 주소를 직접 선택해 이용할 수 있어요.
                </p>
                <div className="mt-[11px] flex h-[23px] items-center gap-3">
                  <button
                    aria-pressed={isLocationServiceAgreed}
                    aria-label="위치기반 서비스 이용약관 동의"
                    className={`flex size-5 shrink-0 items-center justify-center rounded-md border ${
                      isLocationServiceAgreed
                        ? 'border-[#00B894] bg-[#00B894] text-white'
                        : 'border-[rgba(112,115,124,0.32)] bg-white'
                    }`}
                    type="button"
                    onClick={() => setIsLocationServiceAgreed((current) => !current)}
                  >
                    {isLocationServiceAgreed ? '✓' : ''}
                  </button>
                  <button
                    className="min-w-0 flex-1 p-0 text-left text-[15px] leading-[1.5] text-[#1D1F20]"
                    type="button"
                    onClick={() => setIsLocationTermsOpen(true)}
                  >
                    [필수] 위치기반 서비스 이용약관 동의
                  </button>
                  <button
                    aria-label="위치기반 서비스 이용약관 보기"
                    className="flex size-[18px] shrink-0 items-center justify-center p-0 text-[#55595B]"
                    type="button"
                    onClick={() => setIsLocationTermsOpen(true)}
                  >
                    ›
                  </button>
                </div>
                <button
                  className="mt-[23px] h-[54px] w-full rounded-[15px] border-0 bg-[#00B894] text-[17px] leading-[1.5] font-medium text-[#F5F5F5] disabled:bg-[#B0B8C1]"
                  disabled={!isLocationServiceAgreed}
                  type="button"
                  onClick={() => {
                    updateInfo('location', '서울특별시 동작구 상도동');
                    setIsLocationConsentOpen(false);
                  }}
                >
                  동의하고 현재 위치 찾기
                </button>
                <button
                  className="mt-2.5 h-[54px] w-full rounded-[15px] border-0 bg-[#B8EBDD] text-[17px] leading-[1.5] font-medium text-[#006E59]"
                  type="button"
                  onClick={() => setIsLocationConsentOpen(false)}
                >
                  직접 선택할래요
                </button>
              </section>
            </>
          ) : null}
        </div>
      ) : null}

      {step === 'koreanLevel' ? (
        <div className="mt-[46px] space-y-2.5">
          {KOREAN_LEVELS.map((level) => (
            <SelectionCard
              description={level.description}
              isSelected={info.koreanLevel === level.value}
              key={level.value}
              onClick={() => updateInfo('koreanLevel', level.value)}
            >
              {level.label}
            </SelectionCard>
          ))}
        </div>
      ) : null}
    </OnboardingScaffold>
  );
}
