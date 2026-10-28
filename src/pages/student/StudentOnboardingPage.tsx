import { useEffect, useMemo, useState } from 'react';

import locationIcon from '../../assets/icons/student/location.svg';
import searchIcon from '../../assets/icons/student/search.svg';
import clearIcon from '../../assets/icons/student/clear.svg';
import ageRestrictionImage from '../../assets/images/student/age-restriction.png';
import { ExperienceCard } from '../../components/student/onboarding/ExperienceCard';
import { ExperienceForm } from '../../components/student/onboarding/ExperienceForm';
import { IndustryChip } from '../../components/student/onboarding/IndustryChip';
import { OnboardingField } from '../../components/student/onboarding/OnboardingField';
import { OnboardingScaffold } from '../../components/student/onboarding/OnboardingScaffold';
import { SelectionCard } from '../../components/student/onboarding/SelectionCard';
import type { Experience, ExperienceDraft } from '../../types/experience';
import type { IndustryId, IndustryOption } from '../../types/industry';

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
  BasicInfoView | 'experienceForm' | 'experienceList' | 'industrySelection';

type StudentOnboardingPageProps = {
  initialStep?: OnboardingView;
};

type KoreanLevel = 'beginner' | 'intermediate' | 'advanced';

type BasicInfo = {
  birthYear: string;
  koreanLevel: KoreanLevel;
  location: string;
  name: string;
  nationality: string;
  phone: string;
  verificationCode: string;
};

const COUNTRY_OPTIONS = [
  '베트남',
  '중국',
  '몽골',
  '우즈베키스탄',
  '일본',
  '기타',
];

const KOREAN_LEVELS: Array<{
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
  initialStep = 'name',
}: StudentOnboardingPageProps) {
  const [experienceDraft, setExperienceDraft] = useState<ExperienceDraft>(
    EMPTY_EXPERIENCE_DRAFT,
  );
  const [experienceEditingId, setExperienceEditingId] = useState<string | null>(
    null,
  );
  const [experiences, setExperiences] =
    useState<Experience[]>(INITIAL_EXPERIENCES);
  const [info, setInfo] = useState<BasicInfo>(INITIAL_INFO);
  const [isIndustrySelectionSubmitted, setIsIndustrySelectionSubmitted] =
    useState(false);
  const [otherIndustry, setOtherIndustry] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [remainingSeconds, setRemainingSeconds] = useState(143);
  const [selectedIndustries, setSelectedIndustries] = useState<IndustryId[]>(
    INITIAL_SELECTED_INDUSTRIES,
  );
  const [step, setStep] = useState<OnboardingView>(initialStep);
  const [verificationError, setVerificationError] = useState('');

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

  const handleExperienceDelete = (experienceId: string) => {
    setExperiences((currentExperiences) =>
      currentExperiences.filter((experience) => experience.id !== experienceId),
    );
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

  const handleIndustryConfirm = () => {
    setIsIndustrySelectionSubmitted(true);
  };

  const handleIndustryNoPreference = () => {
    setSelectedIndustries([]);
    setOtherIndustry('');
    setIsIndustrySelectionSubmitted(true);
  };

  const isExperienceDraftValid =
    experienceDraft.workplace.trim().length > 0 &&
    /^\d{4}\.\d{2}$/.test(experienceDraft.startMonth) &&
    /^\d{4}\.\d{2}$/.test(experienceDraft.endMonth) &&
    experienceDraft.startMonth <= experienceDraft.endMonth &&
    experienceDraft.duties.trim().length > 0;

  const handleExperienceSave = () => {
    if (!isExperienceDraftValid) return;

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
      <main className="mx-auto flex min-h-[100svh] w-full max-w-[430px] flex-col items-center bg-[#F5F5F5] px-6 pt-[262px] pb-[calc(37px+env(safe-area-inset-bottom))] text-center font-['Pretendard','Apple_SD_Gothic_Neo','Noto_Sans_KR',sans-serif] tracking-[-0.02em] text-[#191F28]">
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
        isSubmitDisabled={!isExperienceDraftValid}
        onBack={() => setStep('experienceList')}
        onChange={updateExperienceDraft}
        onSubmit={handleExperienceSave}
      />
    );
  }

  if (step === 'experienceList') {
    return (
      <OnboardingScaffold
        activeSubStep={0}
        ctaLabel="확인"
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
          <div className="mt-2.5 space-y-2.5">
            {experiences.map((experience) => (
              <ExperienceCard
                experience={experience}
                key={experience.id}
                onDelete={handleExperienceDelete}
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

  const handleBack = () => {
    if (currentIndex === 0) return;

    setPhoneError('');
    setVerificationError('');
    setStep(STEP_ORDER[currentIndex - 1]);
  };

  const handleNext = () => {
    if (step === 'phone') {
      if (!isValidPhone(info.phone)) {
        setPhoneError('다시 입력해주세요.');
        return;
      }

      setPhoneError('');
      setRemainingSeconds(143);
      setStep('verification');
      return;
    }

    if (step === 'verification') {
      if (info.verificationCode !== '578412') {
        setVerificationError('인증번호가 틀렸어요. 다시 입력해주세요.');
        return;
      }

      setVerificationError('');
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
    (step === 'name' && !info.name.trim()) ||
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
      onBack={handleBack}
      onCtaClick={handleNext}
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
                onClick={() => setRemainingSeconds(143)}
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
        <label className="mt-[27px] block">
          <span className="block text-[17px] leading-[1.5] text-[#191F28]">
            국적
          </span>
          <select
            className="h-[57px] w-full appearance-auto border-0 border-b border-[#B0B8C1] bg-transparent py-0 pr-0 pl-[37px] text-[26px] leading-[1.5] font-semibold tracking-[-0.02em] text-[#191F28] outline-none"
            value={info.nationality}
            onChange={(event) => updateInfo('nationality', event.target.value)}
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
            label="주소"
            placeholder="주소 검색"
            trailing={
              <img
                alt=""
                className="h-[22px] w-[22px] shrink-0"
                src={searchIcon}
              />
            }
            value={info.location}
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
