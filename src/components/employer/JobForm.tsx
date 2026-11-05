import { useState } from 'react';
import DateField from '../common/DateField';
import SelectField, { type SelectOption } from '../common/SelectField';
import WorkTimeGrid from '../common/WorkTimeGrid';
import { EMPLOYER_INDUSTRY_OPTIONS } from '../../data/employerProfileData';
import type {
  IndustryCode,
  JobFormValues,
  KoreanLevelCode,
  PreferredExperienceCode,
  SalaryType,
} from '../../types/jobForm';
import type { JobPostingStatus } from '../../types/jobPosting';
import { getSeoulTodayIsoDate } from '../../utils/jobPosting';
import { getWeeklyTotalHours } from '../../utils/workSchedule';

type JobFormMode = 'CREATE' | 'EDIT';
type OpenControl =
  | 'workplace'
  | 'industry'
  | 'koreanLevel'
  | 'preferredExperience'
  | 'startDate'
  | 'deadline'
  | null;
type JobFormErrors = Partial<Record<keyof JobFormValues, string>>;

interface JobFormProps {
  mode: JobFormMode;
  initialValues: JobFormValues;
  initialStatus?: JobPostingStatus;
  workplaceOptions: SelectOption<string>[];
  isSubmitting?: boolean;
  onCancel: () => void;
  onSaveDraft: (values: JobFormValues) => void;
  onSubmit: (values: JobFormValues) => void;
}

const INDUSTRY_OPTIONS: SelectOption<IndustryCode>[] =
  EMPLOYER_INDUSTRY_OPTIONS;

const KOREAN_LEVEL_OPTIONS: SelectOption<KoreanLevelCode>[] = [
  { value: 'BEGINNER', label: '초급 · 기초 대화' },
  { value: 'INTERMEDIATE', label: '중급 · 일상 대화' },
  { value: 'ADVANCED', label: '고급 · 업무 대화' },
];

const PREFERRED_EXPERIENCE_OPTIONS: SelectOption<PreferredExperienceCode>[] = [
  { value: 'NONE', label: '경력 무관' },
  { value: 'SIX_MONTHS_OR_MORE', label: '6개월 이상' },
  { value: 'ONE_YEAR_OR_MORE', label: '1년 이상' },
];

const fieldClassName =
  'h-[58px] w-full rounded-[10px] border border-[rgba(112,115,124,0.22)] bg-white px-4 text-base text-[#171719] outline-none transition-colors placeholder:text-[#8b95a1] hover:border-[#aeb4bc] focus:border-[#00b894] focus:ring-2 focus:ring-[#00b894]/10';

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-1.5 block text-base leading-6 font-semibold text-[#171719]">
      {children}
    </span>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return (
    <p role="alert" className="mt-1.5 text-xs font-medium text-[#e11e1e]">
      {message}
    </p>
  );
}

function JobForm({
  mode,
  initialValues,
  initialStatus,
  workplaceOptions,
  isSubmitting = false,
  onCancel,
  onSaveDraft,
  onSubmit,
}: JobFormProps) {
  const [values, setValues] = useState<JobFormValues>(initialValues);
  const [errors, setErrors] = useState<JobFormErrors>({});
  const [openControl, setOpenControl] = useState<OpenControl>(null);

  const handleFieldChange = <K extends keyof JobFormValues>(
    field: K,
    value: JobFormValues[K],
  ) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handleControlOpen = (
    control: Exclude<OpenControl, null>,
    isOpen: boolean,
  ) => {
    setOpenControl(isOpen ? control : null);
  };

  const handleWorkplaceChange = (workplaceId: string) => {
    const selected = workplaceOptions.find(
      (option) => option.value === workplaceId,
    );
    setValues((current) => ({
      ...current,
      workplaceId: Number(workplaceId),
      workplace: selected?.label ?? '',
    }));
    setErrors((current) => ({ ...current, workplace: undefined }));
  };

  const validate = () => {
    const nextErrors: JobFormErrors = {};

    if (!values.jobTitle.trim()) nextErrors.jobTitle = '직무를 입력해주세요.';
    if (!values.workplace.trim())
      nextErrors.workplace = '사업장을 입력해주세요.';
    if (values.workplaceId === null)
      nextErrors.workplace = '사업장을 선택해주세요.';
    if (!values.industry) nextErrors.industry = '업종을 선택해주세요.';
    if (!values.headcount.trim())
      nextErrors.headcount = '채용 인원을 입력해주세요.';
    if (values.headcount && Number(values.headcount) <= 0)
      nextErrors.headcount = '채용 인원은 1명 이상 입력해주세요.';
    if (!values.salary.trim()) nextErrors.salary = '급여를 입력해주세요.';
    if (values.salary && Number(values.salary) <= 0)
      nextErrors.salary = '급여는 0원보다 크게 입력해주세요.';
    if (!values.startDate) nextErrors.startDate = '근무 시작일을 선택해주세요.';
    if (!values.koreanLevel)
      nextErrors.koreanLevel = '한국어 수준을 선택해주세요.';
    if (!values.preferredExperience)
      nextErrors.preferredExperience = '우대 경력을 선택해주세요.';
    if (!values.deadline) nextErrors.deadline = '모집 마감일을 선택해주세요.';
    if (getWeeklyTotalHours(values.schedule) === 0) {
      nextErrors.schedule = '근무시간을 한 구간 이상 선택해주세요.';
    }
    const today = getSeoulTodayIsoDate();
    if (values.startDate && values.startDate < today) {
      nextErrors.startDate = '근무 시작일은 오늘 이후로 선택해주세요.';
    }
    if (values.deadline && values.deadline < today) {
      nextErrors.deadline = '모집 마감일은 오늘 이후로 선택해주세요.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setOpenControl(null);
    if (validate()) {
      onSubmit(values);
    }
  };

  const hourlyEstimate =
    values.salaryType === 'MONTHLY' && Number(values.salary) > 0
      ? Math.round(Number(values.salary) / 209).toLocaleString('ko-KR')
      : null;

  return (
    <form className="pb-12 pt-10" noValidate onSubmit={handleSubmit}>
      <header className="flex items-start justify-between gap-6">
        <div>
          <h1 className="text-[32px] leading-[43px] font-semibold tracking-[-0.7px] text-[#171719]">
            새로운 동료를 찾아요
          </h1>
          <p className="mt-0.5 text-base leading-6 text-[#70737c]">
            근무 조건을 자세히 적으면 더 좋은 만남으로 이어집니다
          </p>
        </div>

        <div className="mt-2 flex shrink-0 gap-3">
          {mode === 'CREATE' || initialStatus === 'DRAFT' ? (
            <button
              type="button"
              onClick={() => onSaveDraft(values)}
              disabled={isSubmitting}
              className="h-12 cursor-pointer rounded-xl border border-[rgba(112,115,124,0.22)] bg-white px-5 text-sm font-semibold whitespace-nowrap text-[#171719] hover:bg-[#f7f7f8] disabled:cursor-not-allowed disabled:text-[#8b95a1]"
            >
              임시 저장
            </button>
          ) : (
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="h-12 cursor-pointer rounded-xl border border-[rgba(112,115,124,0.22)] bg-white px-6 text-sm font-semibold whitespace-nowrap text-[#171719] hover:bg-[#f7f7f8]"
            >
              취소
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="h-12 cursor-pointer rounded-xl bg-[#00b894] px-6 text-sm font-semibold whitespace-nowrap text-white transition-colors hover:bg-[#00a886] active:bg-[#00997a] disabled:cursor-not-allowed disabled:bg-[#e1e2e4] disabled:text-[#8b95a1]"
          >
            {isSubmitting
              ? '저장 중'
              : mode === 'CREATE'
                ? '공고 등록'
                : initialStatus === 'DRAFT'
                  ? '모집 시작'
                  : '수정 저장'}
          </button>
        </div>
      </header>

      <div className="mt-9 rounded-xl border border-[rgba(112,115,124,0.18)] bg-white p-8 shadow-[0_2px_8px_-2px_rgba(23,23,25,0.10),0_1px_2px_rgba(23,23,25,0.06)]">
        <div>
          <label>
            <FieldLabel>직무</FieldLabel>
            <input
              type="text"
              value={values.jobTitle}
              onChange={(event) =>
                handleFieldChange('jobTitle', event.target.value)
              }
              placeholder="직무를 입력해주세요"
              className={fieldClassName}
              aria-invalid={Boolean(errors.jobTitle)}
            />
          </label>
          <FieldError message={errors.jobTitle} />
        </div>

        <div className="mt-7 grid grid-cols-1 gap-x-6 gap-y-7 lg:grid-cols-2">
          <div>
            <FieldLabel>사업장</FieldLabel>
            {mode === 'EDIT' ? (
              <input
                disabled
                value={values.workplace}
                className={`${fieldClassName} cursor-not-allowed bg-[#f7f7f8] text-[#8b95a1]`}
              />
            ) : (
              <SelectField
                value={
                  values.workplaceId === null ? '' : String(values.workplaceId)
                }
                options={workplaceOptions}
                placeholder="사업장을 선택해주세요"
                ariaLabel="사업장"
                isOpen={openControl === 'workplace'}
                onOpenChange={(isOpen) =>
                  handleControlOpen('workplace', isOpen)
                }
                onChange={handleWorkplaceChange}
              />
            )}
            <FieldError message={errors.workplace} />
          </div>

          <div>
            <FieldLabel>업종</FieldLabel>
            <SelectField
              value={values.industry}
              options={INDUSTRY_OPTIONS}
              placeholder="업종을 선택해주세요"
              ariaLabel="업종"
              isOpen={openControl === 'industry'}
              onOpenChange={(isOpen) => handleControlOpen('industry', isOpen)}
              onChange={(value) => handleFieldChange('industry', value)}
            />
            <FieldError message={errors.industry} />
          </div>

          <div>
            <label>
              <FieldLabel>채용 인원</FieldLabel>
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  value={values.headcount}
                  onChange={(event) =>
                    handleFieldChange(
                      'headcount',
                      event.target.value.replace(/\D/g, ''),
                    )
                  }
                  placeholder="0"
                  className={`${fieldClassName} pr-12`}
                  aria-invalid={Boolean(errors.headcount)}
                />
                <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-sm text-[#171719]">
                  명
                </span>
              </div>
            </label>
            <FieldError message={errors.headcount} />
          </div>

          <div>
            <div className="mb-1.5 flex h-6 items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-base font-semibold text-[#171719]">
                  급여
                </span>
                {hourlyEstimate && (
                  <span className="text-xs text-[#8b95a1]">
                    환산 시급 약 {hourlyEstimate}원
                  </span>
                )}
              </div>
              <div className="flex h-7 w-[92px] rounded-lg bg-[#f2f3f5] p-[3px]">
                {(['HOURLY', 'MONTHLY'] as SalaryType[]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    aria-pressed={values.salaryType === type}
                    onClick={() => handleFieldChange('salaryType', type)}
                    className={`h-[22px] w-[43px] cursor-pointer rounded-md text-[9px] leading-none transition-colors ${
                      values.salaryType === type
                        ? 'bg-[#00b894] text-white'
                        : 'text-[#70737c]'
                    }`}
                  >
                    {type === 'HOURLY' ? '시급' : '월급'}
                  </button>
                ))}
              </div>
            </div>
            <label className="relative block">
              <input
                type="text"
                inputMode="numeric"
                value={
                  values.salary
                    ? Number(values.salary).toLocaleString('ko-KR')
                    : ''
                }
                onChange={(event) =>
                  handleFieldChange(
                    'salary',
                    event.target.value.replace(/\D/g, ''),
                  )
                }
                placeholder="급여를 입력해주세요"
                className={`${fieldClassName} pr-12`}
                aria-label="급여"
                aria-invalid={Boolean(errors.salary)}
              />
              <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-sm text-[#171719]">
                원
              </span>
            </label>
            <FieldError message={errors.salary} />
          </div>

          <div>
            <FieldLabel>근무 시작일</FieldLabel>
            <DateField
              value={values.startDate}
              placeholder="근무 시작일을 선택해주세요"
              ariaLabel="근무 시작일"
              isOpen={openControl === 'startDate'}
              onOpenChange={(isOpen) => handleControlOpen('startDate', isOpen)}
              onChange={(value) => handleFieldChange('startDate', value)}
            />
            <FieldError message={errors.startDate} />
          </div>

          <div>
            <FieldLabel>한국어 수준</FieldLabel>
            <SelectField
              value={values.koreanLevel}
              options={KOREAN_LEVEL_OPTIONS}
              placeholder="한국어 수준을 선택해주세요"
              ariaLabel="한국어 수준"
              isOpen={openControl === 'koreanLevel'}
              onOpenChange={(isOpen) =>
                handleControlOpen('koreanLevel', isOpen)
              }
              onChange={(value) => handleFieldChange('koreanLevel', value)}
            />
            <FieldError message={errors.koreanLevel} />
          </div>

          <div>
            <FieldLabel>우대 경력</FieldLabel>
            <SelectField
              value={values.preferredExperience}
              options={PREFERRED_EXPERIENCE_OPTIONS}
              placeholder="우대 경력을 선택해주세요"
              ariaLabel="우대 경력"
              isOpen={openControl === 'preferredExperience'}
              onOpenChange={(isOpen) =>
                handleControlOpen('preferredExperience', isOpen)
              }
              onChange={(value) =>
                handleFieldChange('preferredExperience', value)
              }
            />
            <FieldError message={errors.preferredExperience} />
          </div>

          <div>
            <FieldLabel>모집 마감일</FieldLabel>
            <DateField
              value={values.deadline}
              placeholder="모집 마감일을 선택해주세요"
              ariaLabel="모집 마감일"
              isOpen={openControl === 'deadline'}
              onOpenChange={(isOpen) => handleControlOpen('deadline', isOpen)}
              onChange={(value) => handleFieldChange('deadline', value)}
            />
            <FieldError message={errors.deadline} />
          </div>
        </div>

        <div className="my-8 h-px bg-[#e1e2e4]" />

        <div className="overflow-x-auto pb-1">
          <WorkTimeGrid
            value={values.schedule}
            onChange={(schedule) => handleFieldChange('schedule', schedule)}
          />
        </div>
        <FieldError message={errors.schedule} />

        <div className="mt-1 flex justify-end">
          <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-[#171719]">
            <span className="relative flex size-5 shrink-0 items-center justify-center">
              <input
                type="checkbox"
                checked={values.isScheduleNegotiable}
                onChange={(event) =>
                  handleFieldChange(
                    'isScheduleNegotiable',
                    event.target.checked,
                  )
                }
                className="peer absolute inset-0 z-10 size-full cursor-pointer opacity-0"
              />
              <span className="pointer-events-none absolute inset-0 rounded-[5px] border border-[#c7cbd1] bg-white transition-colors peer-checked:border-[#00b894] peer-checked:bg-[#00b894] peer-focus-visible:ring-2 peer-focus-visible:ring-[#00b894]/20" />
              <svg
                aria-hidden="true"
                viewBox="0 0 16 16"
                className="pointer-events-none absolute hidden size-3.5 text-white peer-checked:block"
                fill="none"
              >
                <path
                  d="m3.25 8.25 3 3 6.5-6.5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            근무 시간 협의 가능
          </label>
        </div>
      </div>
    </form>
  );
}

export default JobForm;
