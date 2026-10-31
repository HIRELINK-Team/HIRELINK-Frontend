import { useState } from "react";
import DateField from "../common/DateField";
import SelectField, { type SelectOption } from "../common/SelectField";
import WorkTimeGrid from "../common/WorkTimeGrid";
import type {
  IndustryCode,
  JobFormValues,
  KoreanLevelCode,
  SalaryType,
} from "../../types/jobForm";
import { getWeeklyTotalHours } from "../../utils/workSchedule";

type JobFormMode = "CREATE" | "EDIT";
type OpenControl = "industry" | "koreanLevel" | "startDate" | "deadline" | null;
type JobFormErrors = Partial<Record<keyof JobFormValues, string>>;

interface JobFormProps {
  mode: JobFormMode;
  initialValues: JobFormValues;
  onCancel: () => void;
  onSaveDraft: (values: JobFormValues) => void;
  onSubmit: (values: JobFormValues) => void;
}

const INDUSTRY_OPTIONS: SelectOption<IndustryCode>[] = [
  { value: "FOOD_AND_CAFE", label: "음식점 · 카페" },
  { value: "RETAIL", label: "판매 · 유통" },
  { value: "OFFICE", label: "사무 · 행정" },
  { value: "EDUCATION", label: "교육" },
  { value: "MANUFACTURING", label: "생산 · 제조" },
];

const KOREAN_LEVEL_OPTIONS: SelectOption<KoreanLevelCode>[] = [
  { value: "BEGINNER", label: "초급 · 기초 대화" },
  { value: "INTERMEDIATE", label: "중급 · 일상 대화" },
  { value: "ADVANCED", label: "고급 · 업무 대화" },
  { value: "NO_PREFERENCE", label: "무관" },
];

const fieldClassName =
  "h-[58px] w-full rounded-[10px] border border-[rgba(112,115,124,0.22)] bg-white px-4 text-base text-[#171719] outline-none transition-colors placeholder:text-[#8b95a1] hover:border-[#aeb4bc] focus:border-[#00b894] focus:ring-2 focus:ring-[#00b894]/10";

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

  const validate = () => {
    const nextErrors: JobFormErrors = {};

    if (!values.jobTitle.trim()) nextErrors.jobTitle = "직무를 입력해주세요.";
    if (!values.workplace.trim())
      nextErrors.workplace = "사업장을 입력해주세요.";
    if (!values.headcount.trim())
      nextErrors.headcount = "채용 인원을 입력해주세요.";
    if (!values.salary.trim()) nextErrors.salary = "급여를 입력해주세요.";
    if (!values.startDate) nextErrors.startDate = "근무 시작일을 선택해주세요.";
    if (!values.koreanLevel)
      nextErrors.koreanLevel = "한국어 수준을 선택해주세요.";
    if (!values.deadline) nextErrors.deadline = "모집 마감일을 선택해주세요.";
    if (getWeeklyTotalHours(values.schedule) === 0) {
      nextErrors.schedule = "근무시간을 한 구간 이상 선택해주세요.";
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
    values.salaryType === "MONTHLY" && Number(values.salary) > 0
      ? Math.round(Number(values.salary) / 209).toLocaleString("ko-KR")
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
          {mode === "CREATE" ? (
            <button
              type="button"
              onClick={() => onSaveDraft(values)}
              className="h-12 cursor-pointer rounded-xl border border-[rgba(112,115,124,0.22)] bg-white px-5 text-sm font-semibold whitespace-nowrap text-[#171719] hover:bg-[#f7f7f8]"
            >
              임시 저장
            </button>
          ) : (
            <button
              type="button"
              onClick={onCancel}
              className="h-12 cursor-pointer rounded-xl border border-[rgba(112,115,124,0.22)] bg-white px-6 text-sm font-semibold whitespace-nowrap text-[#171719] hover:bg-[#f7f7f8]"
            >
              취소
            </button>
          )}
          <button
            type="submit"
            className="h-12 cursor-pointer rounded-xl bg-[#00b894] px-6 text-sm font-semibold whitespace-nowrap text-white transition-colors hover:bg-[#00a886] active:bg-[#00997a]"
          >
            {mode === "CREATE" ? "공고 등록" : "수정 저장"}
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
                handleFieldChange("jobTitle", event.target.value)
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
            <label>
              <FieldLabel>사업장</FieldLabel>
              <input
                type="text"
                value={values.workplace}
                onChange={(event) =>
                  handleFieldChange("workplace", event.target.value)
                }
                placeholder="사업장을 입력해주세요"
                className={fieldClassName}
                aria-invalid={Boolean(errors.workplace)}
              />
            </label>
            <FieldError message={errors.workplace} />
          </div>

          <div>
            <FieldLabel>업종</FieldLabel>
            <SelectField
              value={values.industry}
              options={INDUSTRY_OPTIONS}
              placeholder="업종을 선택해주세요"
              ariaLabel="업종"
              isOpen={openControl === "industry"}
              onOpenChange={(isOpen) => handleControlOpen("industry", isOpen)}
              onChange={(value) => handleFieldChange("industry", value)}
            />
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
                      "headcount",
                      event.target.value.replace(/\D/g, ""),
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
                {(["HOURLY", "MONTHLY"] as SalaryType[]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    aria-pressed={values.salaryType === type}
                    onClick={() => handleFieldChange("salaryType", type)}
                    className={`h-[22px] w-[43px] cursor-pointer rounded-md text-xs transition-colors ${
                      values.salaryType === type
                        ? "bg-[#00b894] text-white"
                        : "text-[#70737c]"
                    }`}
                  >
                    {type === "HOURLY" ? "시급" : "월급"}
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
                    ? Number(values.salary).toLocaleString("ko-KR")
                    : ""
                }
                onChange={(event) =>
                  handleFieldChange(
                    "salary",
                    event.target.value.replace(/\D/g, ""),
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
              isOpen={openControl === "startDate"}
              onOpenChange={(isOpen) => handleControlOpen("startDate", isOpen)}
              onChange={(value) => handleFieldChange("startDate", value)}
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
              isOpen={openControl === "koreanLevel"}
              onOpenChange={(isOpen) =>
                handleControlOpen("koreanLevel", isOpen)
              }
              onChange={(value) => handleFieldChange("koreanLevel", value)}
            />
            <FieldError message={errors.koreanLevel} />
          </div>

          <label>
            <FieldLabel>우대 경력</FieldLabel>
            <input
              type="text"
              value={values.preferredExperience}
              onChange={(event) =>
                handleFieldChange("preferredExperience", event.target.value)
              }
              placeholder="우대 경력을 입력해주세요"
              className={fieldClassName}
            />
          </label>

          <div>
            <FieldLabel>모집 마감일</FieldLabel>
            <DateField
              value={values.deadline}
              placeholder="모집 마감일을 선택해주세요"
              ariaLabel="모집 마감일"
              isOpen={openControl === "deadline"}
              onOpenChange={(isOpen) => handleControlOpen("deadline", isOpen)}
              onChange={(value) => handleFieldChange("deadline", value)}
            />
            <FieldError message={errors.deadline} />
          </div>
        </div>

        <div className="my-8 h-px bg-[#e1e2e4]" />

        <div className="overflow-x-auto pb-1">
          <WorkTimeGrid
            value={values.schedule}
            onChange={(schedule) => handleFieldChange("schedule", schedule)}
          />
        </div>
        <FieldError message={errors.schedule} />

        <div className="mt-1 flex justify-end">
          <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-[#171719]">
            <input
              type="checkbox"
              checked={values.isScheduleNegotiable}
              onChange={(event) =>
                handleFieldChange("isScheduleNegotiable", event.target.checked)
              }
              className="size-5 cursor-pointer accent-[#00b894]"
            />
            근무 시간 협의 가능
          </label>
        </div>
      </div>
    </form>
  );
}

export default JobForm;
