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
  getStudentProfile,
  requestPhoneVerification,
  updateStudentCareer,
  updateStudentMatchingPreferences,
} from '../../api/student';
import { mapIndustrySelectionToUpdateRequest } from '../../adapters/studentMatchingPreferences';
import { mapStudentOnboardingToCreateRequest } from '../../adapters/studentProfile';
import {
  isExperienceDraftValid,
  mapExperienceDraftToCreateRequest,
  mapExperienceDraftToUpdateRequest,
  mapStudentCareerToExperience,
} from '../../adapters/studentExperience';
import { COUNTRY_ICON_BY_NAME } from '../../constants/studentCountryIcons';
import {
  ACADEMIC_STATUS_OPTIONS,
  COUNTRY_OPTIONS,
  KOREAN_LEVELS,
  RESIDENCE_QUALIFICATION_OPTIONS,
  TOPIK_LEVEL_OPTIONS,
} from '../../constants/studentOnboardingOptions';
import { ExperienceCard } from '../../components/student/onboarding/ExperienceCard';
import { ExperienceForm } from '../../components/student/onboarding/ExperienceForm';
import { IndustryChip } from '../../components/student/onboarding/IndustryChip';
import { MatchingPriorityList } from '../../components/student/onboarding/MatchingPriorityList';
import { OnboardingBottomSheet } from '../../components/student/onboarding/OnboardingBottomSheet';
import { OnboardingField } from '../../components/student/onboarding/OnboardingField';
import { OnboardingScaffold } from '../../components/student/onboarding/OnboardingScaffold';
import { ResidenceExpiryDatePicker } from '../../components/student/onboarding/ResidenceExpiryDatePicker';
import { SelectionCard } from '../../components/student/onboarding/SelectionCard';
import { WorkTimeGrid } from '../../components/student/onboarding/WorkTimeGrid';
import { WorkLocationRadiusMap } from '../../components/student/onboarding/WorkLocationRadiusMap';
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
  | 'nationality'
  | 'location'
  | 'koreanLevel';

type BasicInfoView = BasicInfoStep | 'ageRestricted';

type OnboardingView =
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
  birthYear: string;
  koreanLevel: KoreanLevel;
  location: string;
  name: string;
  nationality: CountryOption;
  phone: string;
  verificationCode: string;
};

const STEP_ORDER: BasicInfoStep[] = [
  'name',
  'phone',
  'verification',
  'birthYear',
  'nationality',
  'location',
  'koreanLevel',
];

const BASIC_INFO_PROGRESS: Record<BasicInfoStep, number> = {
  name: 1,
  phone: 2,
  verification: 2,
  birthYear: 3,
  nationality: 4,
  location: 5,
  koreanLevel: 6,
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
  birthYear: '',
  nationality: '베트남',
  location: '',
  koreanLevel: 'beginner',
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

export default function StudentOnboardingPage({
  enableCareerApi = false,
  initialStep = 'name',
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
  const [isIndustrySelectionSubmitted, setIsIndustrySelectionSubmitted] =
    useState(false);
  const [isIndustrySaving, setIsIndustrySaving] = useState(false);
  const [otherIndustry, setOtherIndustry] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [isPhoneVerificationPending, setIsPhoneVerificationPending] =
    useState(false);
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

    void getStudentProfile()
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
    } catch {
      // Keep the server-backed and UI lists unchanged when deletion fails.
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

    if (!requestBody) return;

    setIsIndustrySaving(true);

    try {
      await updateStudentMatchingPreferences(requestBody);

      if (businessTypeFlexible) {
        setSelectedIndustries([]);
        setOtherIndustry('');
      }

      setIsIndustrySelectionSubmitted(true);
      setStep('workTimeSelection');
    } catch {
      // Keep the industry selection unchanged when the server save fails.
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
    if (!workLocation.address.trim()) return;

    setIsWorkLocationRadiusSelectionOpen(true);
  };

  const handleWorkLocationRadiusChange = (radius: WorkLocationRadius) => {
    setWorkLocation((currentLocation) => ({ ...currentLocation, radius }));
    setIsWorkLocationSubmitted(false);
  };

  const handleWorkLocationRadiusConfirm = () => {
    setIsWorkLocationRadiusSelectionOpen(false);
    setIsWorkLocationSubmitted(true);
    setStep('residenceQualification');
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
    if (!residenceInfo.residenceExpiryDate) return;

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

    setIsProfileSubmitting(true);

    try {
      const didComplete = await onComplete(requestBody);
      if (didComplete !== false) setIsMatchingPrioritySubmitted(true);
    } catch {
      // Keep the final onboarding step open when profile registration fails.
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
      } catch {
        // Keep the form and the last saved career list when the request fails.
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
      <main className="mx-auto flex h-[min(844px,100dvh)] w-full max-w-[390px] flex-col items-center bg-[#F5F5F5] px-6 pt-[218px] pb-[calc(37px+env(safe-area-inset-bottom))] text-center font-['Pretendard','Apple_SD_Gothic_Neo','Noto_Sans_KR',sans-serif] tracking-[-0.02em] text-[#191F28]">
        <img alt="" className="h-auto w-[106px]" src={ageRestrictionImage} />
        <h1 className="mt-[14px] mb-0 whitespace-pre-line text-[26px] leading-[1.5] font-semibold">
          아직은 서비스를{`\n`}이용할 수 없어요
        </h1>
        <p className="mt-[39px] mb-0 whitespace-pre-line text-[13px] leading-[1.5] text-[#8B95A1]">
          하이어링크는 만 18세 이상부터 이용할 수 있어요.{`\n`}
          이용 가능 연령이 되면 다시 찾아주세요!
        </p>
        <button
          className="mt-auto h-[57px] w-full rounded-[15px] border-0 bg-[#00B894] text-[20px] leading-[1.5] font-medium text-[#F5F5F5]"
          type="button"
          onClick={() => {
            updateInfo('birthYear', '');
            setStep('birthYear');
          }}
        >
          확인
        </button>
      </main>
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
        ctaContainerClassName="mt-auto shrink-0 pt-8 mb-[30px]"
        contentClassName="mt-2"
        currentStage={2}
        question={'이전에 해본 아르바이트나\n근무경험을 알려주세요.'}
        showProgress={false}
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
          onBack={() => setIsWorkLocationRadiusSelectionOpen(false)}
          onConfirm={handleWorkLocationRadiusConfirm}
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
      const response = await requestPhoneVerification({
        phoneNumber: info.phone,
      });

      setRemainingSeconds(response.expiresIn);
      setPhoneError('');
      setVerificationError('');
      if (shouldMoveToVerification) setStep('verification');

      return true;
    } catch {
      if (shouldMoveToVerification) {
        setPhoneError('인증번호를 보내지 못했어요. 다시 시도해주세요.');
      } else {
        setVerificationError('인증번호를 다시 보내지 못했어요.');
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
      if (!/^\d{6}$/.test(info.verificationCode) || isPhoneVerificationPending) {
        setVerificationError('인증번호 6자리를 입력해주세요.');
        return;
      }

      setIsPhoneVerificationPending(true);

      try {
        await confirmPhoneVerification({
          phoneNumber: info.phone,
          code: info.verificationCode,
        });
        setVerificationError('');
      } catch {
        setVerificationError('인증번호가 틀렸어요. 다시 입력해주세요.');
        return;
      } finally {
        setIsPhoneVerificationPending(false);
      }
    }

    if (step === 'birthYear') {
      if (!/^\d{4}$/.test(info.birthYear)) return;

      const latestEligibleBirthYear = new Date().getFullYear() - 19;
      if (Number(info.birthYear) > latestEligibleBirthYear) {
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
    (step === 'birthYear' && !/^\d{4}$/.test(info.birthYear)) ||
    (step === 'location' && !info.location.trim());

  const questions: Record<BasicInfoStep, string> = {
    name: '본인의 이름을\n적어주세요.',
    phone: '본인의 전화번호를\n입력해주세요.',
    verification: '인증 번호를\n입력해 주세요.',
    birthYear: '본인의 나이를\n선택해주세요.',
    nationality: '본인의 국적을\n선택해주세요.',
    location: '현재 거주지역을\n입력해주세요.',
    koreanLevel: '한국어 실력은\n어느 정도인가요?',
  };

  const ctaLabel = step === 'phone' ? '인증번호 받기' : '확인';

  return (
    <OnboardingScaffold
      activeSubStep={BASIC_INFO_PROGRESS[step]}
      ctaLabel={ctaLabel}
      currentStage={1}
      isCtaDisabled={isCtaDisabled}
      question={questions[step]}
      questionClassName={step === 'name' ? 'translate-y-[5.5px]' : undefined}
      onBack={handleBack}
      onCtaClick={() => void handleNext()}
      onEnter={() => void handleNext()}
      stageLabel="기본정보 입력"
      totalSubSteps={BASIC_INFO_TOTAL_SUB_STEPS}
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
            <span className="flex shrink-0 items-center gap-[7px]">
              <span className="text-[15px] leading-[1.5] font-medium text-[#00B894]">
                {remainingTime}
              </span>
              <button
                className="rounded-[44px] border-[0.7px] border-[#B0B8C1] bg-transparent px-2.5 py-1.5 text-[13px] leading-[1.5] text-[#191F28]"
                type="button"
                disabled={isPhoneVerificationPending}
                onClick={() => {
                  void handlePhoneVerificationRequest(false);
                }}
              >
                재요청
              </button>
            </span>
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
        <OnboardingField
          inputMode="numeric"
          label="출생년도"
          maxLength={4}
          placeholder="2000"
          value={info.birthYear}
          onChange={(event) =>
            updateInfo('birthYear', event.target.value.replace(/\D/g, ''))
          }
        />
      ) : null}

      {step === 'nationality' ? (
        <label className="relative mt-[27px] block">
          <span className="block text-[17px] leading-[1.5] text-[#191F28]">
            국적
          </span>
          <img
            alt=""
            className="pointer-events-none absolute top-[41px] left-0 h-[23px] w-[23px] object-contain"
            src={COUNTRY_ICON_BY_NAME[info.nationality]}
          />
          <select
            className="h-[57px] w-full appearance-auto border-0 border-b border-[#B0B8C1] bg-transparent py-0 pr-0 pl-[37px] text-[26px] leading-[1.5] font-semibold tracking-[-0.02em] text-[#191F28] outline-none"
            value={info.nationality}
            onChange={(event) =>
              updateInfo('nationality', event.target.value as CountryOption)
            }
          >
            {COUNTRY_OPTIONS.map((country) => (
              <option key={country}>{country}</option>
            ))}
          </select>
        </label>
      ) : null}

      {step === 'location' ? (
        <div>
          <OnboardingField
            autoComplete="street-address"
            label="주소"
            name="currentRegion"
            placeholder="주소 검색"
            trailing={
              <img
                alt=""
                className="h-[22px] w-[22px] shrink-0"
                src={searchIcon}
              />
            }
            value={info.location}
            type="text"
            onChange={(event) => updateInfo('location', event.target.value)}
          />
          <button
            className="mt-[15px] flex h-[54px] w-full items-center gap-4 rounded-[15px] border-[0.7px] border-[#B0B8C1] bg-transparent px-[23px] text-left text-[17px] leading-[1.5] text-[#191F28]"
            type="button"
            onClick={() => updateInfo('location', '서울특별시 동작구 상도동')}
          >
            <img alt="" className="h-[14px] w-[14px]" src={locationIcon} />
            현재 위치로 찾기
          </button>
        </div>
      ) : null}

      {step === 'koreanLevel' ? (
        <div className="mt-[27px] space-y-2.5">
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
