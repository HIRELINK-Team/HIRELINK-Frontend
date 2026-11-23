import { useMemo, useState } from 'react';

import {
  confirmPhoneVerification,
  createStudentCareer,
  deleteStudentCareer,
  requestPhoneVerification,
  updateStudentCareer,
} from '../../api/student';
import calendarIcon from '../../assets/icons/student/calendar.svg';
import locationIcon from '../../assets/icons/student/location.svg';
import { mapWorkLocationToUpdateRequest } from '../../adapters/studentMatchingPreferences';
import { ExperienceCard } from '../../components/student/onboarding/ExperienceCard';
import { ExperienceForm } from '../../components/student/onboarding/ExperienceForm';
import { OnboardingField } from '../../components/student/onboarding/OnboardingField';
import { OnboardingScaffold } from '../../components/student/onboarding/OnboardingScaffold';
import { ResidenceExpiryDatePicker } from '../../components/student/onboarding/ResidenceExpiryDatePicker';
import { SelectionCard } from '../../components/student/onboarding/SelectionCard';
import { WorkLocationRadiusMap } from '../../components/student/onboarding/WorkLocationRadiusMap';
import { KOREAN_LEVELS } from '../../constants/studentOnboardingOptions';
import { IS_DEMO_MODE } from '../../config/demoMode';
import { studentDataSource } from '../../services/studentDataSource';
import type { Experience, ExperienceDraft, StudentCareerResponse } from '../../types/experience';
import type { StudentPreferredLocation } from '../../types/studentMatchingPreferences';
import type { WorkLocation, WorkLocationRadius } from '../../types/workLocation';
import type {
  StudentProfileEditField,
  StudentProfileValues,
} from './StudentProfileManagementPage';

const RADIUS_OPTIONS: WorkLocationRadius[] = [100, 500, 1000];
const EMPTY_EXPERIENCE: ExperienceDraft = {
  duties: '',
  endMonth: '',
  startMonth: '',
  workplace: '',
};

type StudentProfileEditPageProps = {
  careers: readonly StudentCareerResponse[];
  field: StudentProfileEditField;
  onBack: () => void;
  onCareersChange: (careers: readonly StudentCareerResponse[]) => void;
  onPhoneChange: (phoneNumber: string) => void;
  onProfileSave: (
    view: 'basic',
    values: readonly string[],
  ) => Promise<boolean>;
  onPreferredLocationChange: (location: StudentPreferredLocation) => void;
  preferredLocation: StudentPreferredLocation | null;
  profileValues: StudentProfileValues;
};

function ProfileEditScaffold({
  children,
  ctaLabel = '저장',
  disabled = false,
  onBack,
  onSubmit,
  question,
}: {
  children: React.ReactNode;
  ctaLabel?: string;
  disabled?: boolean;
  onBack: () => void;
  onSubmit: () => void;
  question: string;
}) {
  return (
    <OnboardingScaffold
      activeSubStep={1}
      contentClassName="mt-[64px]"
      ctaLabel={ctaLabel}
      currentStage={1}
      isCtaDisabled={disabled}
      onBack={onBack}
      onCtaClick={onSubmit}
      question={question}
      responsive
      showProgress={false}
      showStageLabel={false}
      stageLabel=""
      totalSubSteps={1}
    >
      {children}
    </OnboardingScaffold>
  );
}

function LocationAddressEditor({
  address,
  onAddressChange,
  onBack,
  onSubmit,
  title,
}: {
  address: string;
  onAddressChange: (value: string) => void;
  onBack: () => void;
  onSubmit: () => void;
  title: string;
}) {
  return (
    <ProfileEditScaffold
      disabled={!address.trim()}
      onBack={onBack}
      onSubmit={onSubmit}
      question={title}
    >
      <label className="mt-[39px] block">
        <span className="block text-[17px] leading-[1.5]">주소 검색</span>
        <span className="flex h-[58px] items-center gap-3 border-b border-[#B0B8C1] focus-within:border-[#00B894]">
          <img alt="" className="size-6" src={locationIcon} />
          <input
            className="min-w-0 flex-1 border-0 bg-transparent p-0 text-[26px] leading-[1.5] font-semibold outline-none placeholder:text-[#B0B8C1]"
            placeholder="주소를 입력해주세요"
            value={address}
            onChange={(event) => onAddressChange(event.target.value)}
          />
        </span>
      </label>
      <button
        className="mt-6 h-[54px] w-full rounded-[15px] border-[0.7px] border-[#B3B8B9] bg-transparent text-[17px] leading-[1.5]"
        type="button"
        onClick={() => navigator.geolocation?.getCurrentPosition(() => undefined)}
      >
        현재 위치 불러오기
      </button>
    </ProfileEditScaffold>
  );
}

function toExperience(career: StudentCareerResponse): Experience {
  return {
    duties: career.description ?? '',
    endMonth: career.endMonth.replace('-', '.'),
    id: String(career.careerId),
    startMonth: career.startMonth.replace('-', '.'),
    workplace: career.careerName,
  };
}

function toCareerDraft(draft: ExperienceDraft) {
  return {
    careerName: draft.workplace.trim(),
    description: draft.duties.trim() || null,
    endMonth: draft.endMonth.replace('.', '-'),
    startMonth: draft.startMonth.replace('.', '-'),
  };
}

export default function StudentProfileEditPage({
  careers,
  field,
  onBack,
  onCareersChange,
  onPhoneChange,
  onPreferredLocationChange,
  onProfileSave,
  preferredLocation,
  profileValues,
}: StudentProfileEditPageProps) {
  const basicValues = [...(profileValues.basic ?? [])];
  const [birthDate, setBirthDate] = useState(basicValues[1] ?? '');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [phone, setPhone] = useState(basicValues[5] ?? '');
  const [phoneStep, setPhoneStep] = useState<'phone' | 'verification'>('phone');
  const [verificationCode, setVerificationCode] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [isPhonePending, setIsPhonePending] = useState(false);
  const [currentRegion, setCurrentRegion] = useState(basicValues[3] ?? '');
  const [preferredAddress, setPreferredAddress] = useState(
    preferredLocation?.locationName ?? '',
  );
  const [preferredRadius, setPreferredRadius] = useState<WorkLocationRadius>(
    preferredLocation?.radiusM ?? 500,
  );
  const [isRadiusStep, setIsRadiusStep] = useState(false);
  const [selectedKoreanLevel, setSelectedKoreanLevel] = useState(
    () =>
      KOREAN_LEVELS.find((option) => option.label === basicValues[4])?.value ??
      KOREAN_LEVELS[0].value,
  );
  const [careerItems, setCareerItems] = useState(() => careers.map(toExperience));
  const [careerDraft, setCareerDraft] = useState<ExperienceDraft>(EMPTY_EXPERIENCE);
  const [editingCareerId, setEditingCareerId] = useState<string | null>(null);
  const [isCareerFormOpen, setIsCareerFormOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const isCareerDraftInvalid = useMemo(
    () =>
      !careerDraft.workplace.trim() ||
      !/^\d{4}\.\d{2}$/.test(careerDraft.startMonth) ||
      !/^\d{4}\.\d{2}$/.test(careerDraft.endMonth),
    [careerDraft],
  );

  const saveBasicValue = async (index: number, value: string) => {
    const values = [...basicValues];
    values[index] = value;
    if (await onProfileSave('basic', values)) onBack();
  };

  if (field === 'birth-date') {
    return (
      <div className="relative mx-auto min-h-[100dvh] w-full max-w-[430px] overflow-hidden">
        <ProfileEditScaffold
          disabled={!/^\d{4}-\d{2}-\d{2}$/.test(birthDate)}
          onBack={onBack}
          onSubmit={() => void saveBasicValue(1, birthDate)}
          question={'본인의 생년월일을\n입력해주세요'}
        >
          <button
            className="mt-[39px] flex w-full flex-col border-0 bg-transparent p-0 text-left"
            type="button"
            onClick={() => setIsCalendarOpen(true)}
          >
            <span className="text-[17px] leading-[1.5]">생년월일</span>
            <span className="flex h-[58px] w-full items-center border-b border-[#B0B8C1] text-[26px] leading-[1.5] font-semibold">
              {birthDate.replaceAll('-', '.')}
              <img alt="" className="ml-auto size-6" src={calendarIcon} />
            </span>
          </button>
        </ProfileEditScaffold>
        {isCalendarOpen ? (
          <ResidenceExpiryDatePicker
            emptyInitialDate="2000-01-01"
            initialDate={birthDate}
            title="생년월일 선택"
            onClose={() => setIsCalendarOpen(false)}
            onConfirm={(date) => {
              setBirthDate(date);
              setIsCalendarOpen(false);
            }}
          />
        ) : null}
      </div>
    );
  }

  if (field === 'phone') {
    const requestVerification = async () => {
      if (!/^01\d{8,9}$/.test(phone.replaceAll('-', ''))) {
        setPhoneError('다시 입력해주세요.');
        return;
      }
      setIsPhonePending(true);
      try {
        if (!IS_DEMO_MODE) {
          await requestPhoneVerification({ phoneNumber: phone });
        }
        setPhoneError('');
        setPhoneStep('verification');
      } catch {
        setPhoneError('인증번호를 전송하지 못했어요. 다시 시도해주세요.');
      } finally {
        setIsPhonePending(false);
      }
    };
    const confirmVerification = async () => {
      if (!/^\d{6}$/.test(verificationCode)) {
        setPhoneError('인증번호가 틀렸어요. 다시 입력해주세요.');
        return;
      }
      setIsPhonePending(true);
      try {
        if (!IS_DEMO_MODE) {
          await confirmPhoneVerification({ code: verificationCode, phoneNumber: phone });
        }
        onPhoneChange(phone);
        onBack();
      } catch {
        setPhoneError('인증번호가 틀렸어요. 다시 입력해주세요.');
      } finally {
        setIsPhonePending(false);
      }
    };
    return (
      <ProfileEditScaffold
        ctaLabel={phoneStep === 'phone' ? '인증번호 받기' : '확인'}
        disabled={isPhonePending}
        onBack={phoneStep === 'verification' ? () => setPhoneStep('phone') : onBack}
        onSubmit={() => void (phoneStep === 'phone' ? requestVerification() : confirmVerification())}
        question={'본인의 전화번호를\n입력해주세요.'}
      >
        <OnboardingField
          errorMessage={phoneStep === 'phone' ? phoneError : undefined}
          inputMode="tel"
          label="전화번호"
          spacing="first"
          value={phone}
          onChange={(event) => setPhone(event.target.value.replace(/[^\d-]/g, ''))}
        />
        {phoneStep === 'verification' ? (
          <OnboardingField
            errorMessage={phoneError}
            inputMode="numeric"
            label="인증번호"
            maxLength={6}
            spacing="next"
            value={verificationCode}
            onChange={(event) => setVerificationCode(event.target.value.replace(/\D/g, ''))}
          />
        ) : null}
      </ProfileEditScaffold>
    );
  }

  if (field === 'current-region') {
    return (
      <LocationAddressEditor
        address={currentRegion}
        onAddressChange={setCurrentRegion}
        onBack={onBack}
        onSubmit={() => void saveBasicValue(3, currentRegion.trim())}
        title={'현재 거주 지역을\n입력해주세요.'}
      />
    );
  }

  if (field === 'preferred-region') {
    if (isRadiusStep) {
      return (
        <WorkLocationRadiusMap
          address={preferredAddress}
          isConfirming={isSaving}
          onBack={() => setIsRadiusStep(false)}
          onConfirm={() => {
            const location: WorkLocation = {
              address: preferredAddress,
              radius: preferredRadius,
            };
            const request = mapWorkLocationToUpdateRequest(location);
            if (!request || !('preferredLocation' in request)) return;
            setIsSaving(true);
            void studentDataSource
              .updateMatchingPreferences(request)
              .then((response) => {
                if (response.preferredLocation) {
                  onPreferredLocationChange(response.preferredLocation);
                }
                onBack();
              })
              .finally(() => setIsSaving(false));
          }}
          onRadiusChange={setPreferredRadius}
          radius={preferredRadius}
          radiusOptions={RADIUS_OPTIONS}
        />
      );
    }
    return (
      <LocationAddressEditor
        address={preferredAddress}
        onAddressChange={setPreferredAddress}
        onBack={onBack}
        onSubmit={() => setIsRadiusStep(true)}
        title={'희망 근무 지역을\n입력해주세요.'}
      />
    );
  }

  if (field === 'korean-level') {
    return (
      <ProfileEditScaffold
        onBack={onBack}
        onSubmit={() => {
          const label = KOREAN_LEVELS.find((option) => option.value === selectedKoreanLevel)?.label;
          if (label) void saveBasicValue(4, label);
        }}
        question={'한국어 실력은\n어느 정도인가요?'}
      >
        <div className="mt-[35px] space-y-[10px]">
          {KOREAN_LEVELS.map((option) => (
            <SelectionCard
              description={option.description}
              isSelected={selectedKoreanLevel === option.value}
              key={option.value}
              onClick={() => setSelectedKoreanLevel(option.value)}
            >
              {option.label}
            </SelectionCard>
          ))}
        </div>
      </ProfileEditScaffold>
    );
  }

  if (isCareerFormOpen) {
    return (
      <ExperienceForm
        draft={careerDraft}
        isEditing={editingCareerId !== null}
        isSubmitDisabled={isCareerDraftInvalid || isSaving}
        onBack={() => setIsCareerFormOpen(false)}
        onChange={(key, value) => setCareerDraft((current) => ({ ...current, [key]: value }))}
        onSubmit={() => {
          setIsSaving(true);
          const request = toCareerDraft(careerDraft);
          if (IS_DEMO_MODE) {
            const next = editingCareerId
              ? careerItems.map((item) =>
                  item.id === editingCareerId ? { ...item, ...careerDraft } : item,
                )
              : [...careerItems, { ...careerDraft, id: `demo-${Date.now()}` }];
            setCareerItems(next);
            setIsCareerFormOpen(false);
            setIsSaving(false);
            return;
          }
          const operation = editingCareerId
            ? updateStudentCareer(editingCareerId, request)
            : createStudentCareer(request);
          void operation
            .then((saved) => {
              const next = editingCareerId
                ? careers.map((career) =>
                    career.careerId === Number(editingCareerId) ? saved : career,
                  )
                : [...careers, saved];
              onCareersChange(next);
              setCareerItems(next.map(toExperience));
              setIsCareerFormOpen(false);
            })
            .finally(() => setIsSaving(false));
        }}
      />
    );
  }

  return (
    <ProfileEditScaffold
      ctaLabel="저장"
      onBack={onBack}
      onSubmit={() => {
        if (IS_DEMO_MODE) {
          onCareersChange(
            careerItems.map((item, index) => ({
              careerId: Number(item.id.replace(/\D/g, '')) || index + 1,
              careerName: item.workplace,
              description: item.duties || null,
              endMonth: item.endMonth.replace('.', '-'),
              startMonth: item.startMonth.replace('.', '-'),
            })),
          );
        }
        onBack();
      }}
      question={'이전에 해본 아르바이트나\n근무경험을 알려주세요.'}
    >
      <button
        className="mt-[35px] h-[54px] w-full rounded-[15px] border-[0.7px] border-[#B3B8B9] bg-transparent text-[17px] leading-[1.5]"
        type="button"
        onClick={() => {
          setEditingCareerId(null);
          setCareerDraft(EMPTY_EXPERIENCE);
          setIsCareerFormOpen(true);
        }}
      >
        + 경력 추가하기
      </button>
      <div className="mt-[22px] space-y-[10px]">
        {careerItems.map((experience) => (
          <ExperienceCard
            experience={experience}
            key={experience.id}
            onDelete={(id) => {
              if (IS_DEMO_MODE) {
                setCareerItems((items) => items.filter((item) => item.id !== id));
                return;
              }
              void deleteStudentCareer(id).then(() => {
                const next = careers.filter((career) => career.careerId !== Number(id));
                onCareersChange(next);
                setCareerItems(next.map(toExperience));
              });
            }}
            onEdit={(id) => {
              const selected = careerItems.find((item) => item.id === id);
              if (!selected) return;
              setEditingCareerId(id);
              setCareerDraft({
                duties: selected.duties,
                endMonth: selected.endMonth,
                startMonth: selected.startMonth,
                workplace: selected.workplace,
              });
              setIsCareerFormOpen(true);
            }}
          />
        ))}
      </div>
    </ProfileEditScaffold>
  );
}
