import { useEffect, useState } from 'react';
import SelectField from '../../components/common/SelectField';
import Toast from '../../components/common/Toast';
import EmployerAddressSearchModal from '../../components/employer/EmployerAddressSearchModal';
import { getApiErrorResponse, getApiErrorStatus } from '../../api/errors';
import { BETA_DEFAULT_WORKPLACE_COORDINATES } from '../../data/employerOnboardingData';
import {
  EMPLOYER_ADDRESS_MOCKS,
  EMPLOYER_INDUSTRY_OPTIONS,
} from '../../data/employerProfileData';
import { useEmployerProfile } from '../../hooks/useEmployerProfile';
import { useEmployerWorkplaces } from '../../hooks/useEmployerWorkplaces';
import type {
  EmployerProfile,
  UpdateEmployerProfileRequest,
} from '../../types/employerProfile';
import type {
  BusinessTypeName,
  UpdateWorkplaceRequest,
  WorkplaceDetailResponse,
} from '../../types/workplace';

type ProfileErrorKey =
  'name' | 'position' | 'businessName' | 'industry' | 'address';
type ProfileErrors = Partial<Record<ProfileErrorKey, string>>;

interface WorkplaceDraft {
  workplaceName: string;
  businessTypeName: BusinessTypeName;
  workplaceAddress: string;
  detailAddress: string;
}

const inputClassName =
  'h-[58px] w-full rounded-[10px] border border-[rgba(112,115,124,0.22)] bg-white px-4 text-base text-[#171719] outline-none transition-colors placeholder:text-[#8b95a1] hover:border-[#aeb4bc] focus:border-[#00b894] focus:ring-2 focus:ring-[#00b894]/10 aria-invalid:border-[#e11e1e]';
const disabledInputClassName = `${inputClassName} cursor-not-allowed !text-[#8b95a1] disabled:!text-[#8b95a1] hover:border-[rgba(112,115,124,0.22)]`;

function cloneProfile(profile: EmployerProfile): EmployerProfile {
  return { ...profile, business: { ...profile.business } };
}

function createWorkplaceDraft(
  workplace: WorkplaceDetailResponse,
): WorkplaceDraft {
  return {
    workplaceName: workplace.workplaceName,
    businessTypeName: workplace.businessTypeName,
    workplaceAddress: workplace.workplaceAddress,
    detailAddress: '',
  };
}

function splitValue(value: string, partCount: number) {
  const parts = value.split('-');
  return Array.from({ length: partCount }, (_, index) => parts[index] ?? '');
}

function getIndustryLabel(businessTypeName: BusinessTypeName) {
  return (
    EMPLOYER_INDUSTRY_OPTIONS.find(
      (option) => option.value === businessTypeName,
    )?.label ?? businessTypeName
  );
}

function getEmployeeCountLabel(employeeCountRange: string) {
  return employeeCountRange === 'UNDER_5' ? '5인 미만' : '5인 이상';
}

function getSaveErrorMessage(error: unknown) {
  const status = getApiErrorStatus(error);
  const apiError = getApiErrorResponse(error);

  if (status === 400)
    return apiError?.message ?? '입력한 정보를 다시 확인해 주세요.';
  if (status === 401) return '로그인 정보를 확인하지 못했습니다.';
  if (status === 403) return '정보를 수정할 권한이 없습니다.';
  if (status === 404) return '수정할 정보를 찾지 못했습니다.';
  if (status === 409) return '이미 등록된 사업장 정보와 중복됩니다.';
  if (status === 502)
    return '외부 조회 서비스에 연결하지 못했어요. 잠시 후 다시 시도해 주세요.';
  if (status && status >= 500)
    return '서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.';
  return apiError?.message ?? '정보를 수정하지 못했습니다.';
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xl leading-normal font-semibold text-[#171719]">
      {children}
    </h2>
  );
}

function FieldLabel({
  children,
  disabled = false,
}: {
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <span
      className={`mb-1.5 block text-base leading-6 font-semibold ${disabled ? 'text-[#8b95a1]' : 'text-[#171719]'}`}
    >
      {children}
    </span>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="mt-1.5 text-xs font-medium text-[#e11e1e]">
      {message}
    </p>
  );
}

function InfoCard({
  rows,
}: {
  rows: Array<{ label: string; value: React.ReactNode }>;
}) {
  return (
    <dl className="mt-3 rounded-xl border border-[rgba(112,115,124,0.16)] bg-white px-8 py-6 shadow-[0_2px_8px_-2px_rgba(23,23,25,0.10),0_1px_2px_rgba(23,23,25,0.06)]">
      <div className="grid gap-y-3.5 sm:grid-cols-[140px_minmax(0,1fr)]">
        {rows.map((row) => (
          <div key={row.label} className="contents">
            <dt className="text-base font-medium text-[#70737c]">
              {row.label}
            </dt>
            <dd className="text-base font-medium text-[#171719]">
              {row.value}
            </dd>
          </div>
        ))}
      </div>
    </dl>
  );
}

function WorkplaceStateCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-3 rounded-xl border border-[rgba(112,115,124,0.16)] bg-white px-8 py-8 text-center text-base font-medium text-[#70737c] shadow-[0_2px_8px_-2px_rgba(23,23,25,0.10),0_1px_2px_rgba(23,23,25,0.06)]">
      {children}
    </div>
  );
}

function EmployerMyPage() {
  const { profile, saveProfile } = useEmployerProfile();
  const {
    workplaces,
    workplaceDetails,
    loadWorkplaces,
    loadWorkplaceDetail,
    saveWorkplace,
  } = useEmployerWorkplaces();
  const [draft, setDraft] = useState(() => cloneProfile(profile));
  const [workplaceDraft, setWorkplaceDraft] = useState<WorkplaceDraft | null>(
    null,
  );
  const [isEditing, setIsEditing] = useState(false);
  const [isIndustryOpen, setIsIndustryOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isWorkplaceLoading, setIsWorkplaceLoading] = useState(true);
  const [workplaceLoadError, setWorkplaceLoadError] = useState<string | null>(
    null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<ProfileErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const primaryWorkplace = workplaces[0] ?? null;
  const primaryWorkplaceDetail = primaryWorkplace
    ? workplaceDetails[primaryWorkplace.workplaceId]
    : undefined;

  useEffect(() => {
    let isActive = true;

    void loadWorkplaces()
      .then((nextWorkplaces) => {
        const firstWorkplace = nextWorkplaces[0];
        return firstWorkplace
          ? loadWorkplaceDetail(firstWorkplace.workplaceId)
          : null;
      })
      .catch(() => {
        if (isActive) {
          setWorkplaceLoadError('사업장 정보를 불러오지 못했어요.');
        }
      })
      .finally(() => {
        if (isActive) setIsWorkplaceLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [loadWorkplaceDetail, loadWorkplaces]);

  useEffect(() => {
    if (!toastMessage) return;
    const timeoutId = window.setTimeout(() => setToastMessage(null), 4000);
    return () => window.clearTimeout(timeoutId);
  }, [toastMessage]);

  const handleStartEditing = () => {
    setDraft(cloneProfile(profile));
    setWorkplaceDraft(
      primaryWorkplaceDetail
        ? createWorkplaceDraft(primaryWorkplaceDetail)
        : null,
    );
    setErrors({});
    setSubmitError(null);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setDraft(cloneProfile(profile));
    setWorkplaceDraft(
      primaryWorkplaceDetail
        ? createWorkplaceDraft(primaryWorkplaceDetail)
        : null,
    );
    setErrors({});
    setSubmitError(null);
    setIsIndustryOpen(false);
    setIsAddressModalOpen(false);
    setIsEditing(false);
  };

  const updateProfileName = (value: string) => {
    setDraft((current) => ({ ...current, name: value }));
    setErrors((current) => ({ ...current, name: undefined }));
    setSubmitError(null);
  };

  const updateProfilePosition = (value: string) => {
    setDraft((current) => ({ ...current, position: value }));
    setErrors((current) => ({ ...current, position: undefined }));
    setSubmitError(null);
  };

  const updateWorkplaceDraft = <K extends keyof WorkplaceDraft>(
    field: K,
    value: WorkplaceDraft[K],
  ) => {
    setWorkplaceDraft((current) =>
      current ? { ...current, [field]: value } : current,
    );
    const errorKey = field === 'workplaceName' ? 'businessName' : field;
    if (
      errorKey === 'businessName' ||
      errorKey === 'businessTypeName' ||
      errorKey === 'workplaceAddress'
    ) {
      setErrors((current) => ({
        ...current,
        [errorKey === 'businessTypeName'
          ? 'industry'
          : errorKey === 'workplaceAddress'
            ? 'address'
            : errorKey]: undefined,
      }));
    }
    setSubmitError(null);
  };

  const validate = () => {
    const nextErrors: ProfileErrors = {};
    if (!draft.name.trim()) nextErrors.name = '이름을 입력해 주세요.';
    if ((draft.position?.trim().length ?? 0) > 50) {
      nextErrors.position = '직책은 50자 이하로 입력해 주세요.';
    }
    if (workplaceDraft) {
      if (!workplaceDraft.workplaceName.trim())
        nextErrors.businessName = '사업장명을 입력해 주세요.';
      if (!workplaceDraft.businessTypeName)
        nextErrors.industry = '업종을 선택해 주세요.';
      if (!workplaceDraft.workplaceAddress.trim())
        nextErrors.address = '사업장 주소를 선택해 주세요.';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsIndustryOpen(false);
    if (!validate()) return;

    const requests: Array<Promise<unknown>> = [];
    const profileRequest: UpdateEmployerProfileRequest = {};
    const name = draft.name.trim();
    if (name !== profile.name) {
      profileRequest.name = name;
    }
    const position = draft.position?.trim() || null;
    const currentPosition = profile.position?.trim() || null;
    if (position !== currentPosition) {
      profileRequest.position = position;
    }
    if (Object.keys(profileRequest).length > 0) {
      requests.push(saveProfile(profileRequest));
    }

    if (primaryWorkplaceDetail && workplaceDraft) {
      const workplaceRequest: UpdateWorkplaceRequest = {};
      const workplaceName = workplaceDraft.workplaceName.trim();
      if (workplaceName !== primaryWorkplaceDetail.workplaceName) {
        workplaceRequest.workplaceName = workplaceName;
      }

      if (
        workplaceDraft.businessTypeName !==
        primaryWorkplaceDetail.businessTypeName
      ) {
        const selectedIndustry = EMPLOYER_INDUSTRY_OPTIONS.find(
          (option) => option.value === workplaceDraft.businessTypeName,
        );
        if (selectedIndustry) {
          workplaceRequest.businessTypeId = selectedIndustry.id;
        }
      }

      const workplaceAddress = [
        workplaceDraft.workplaceAddress.trim(),
        workplaceDraft.detailAddress.trim(),
      ]
        .filter(Boolean)
        .join(' ');
      if (workplaceAddress !== primaryWorkplaceDetail.workplaceAddress) {
        workplaceRequest.workplaceAddress = workplaceAddress;
        Object.assign(workplaceRequest, BETA_DEFAULT_WORKPLACE_COORDINATES);
      }

      if (Object.keys(workplaceRequest).length > 0) {
        requests.push(
          saveWorkplace(primaryWorkplaceDetail.workplaceId, workplaceRequest),
        );
      }
    }

    if (requests.length === 0) {
      setIsEditing(false);
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await Promise.all(requests);
      setIsEditing(false);
      setToastMessage('수정이 적용되었어요');
    } catch (error: unknown) {
      setSubmitError(getSaveErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const phoneParts = splitValue(draft.phone, 3);
  const registrationParts = splitValue(
    primaryWorkplaceDetail?.businessRegistrationNumber ?? '',
    3,
  );

  const renderWorkplaceView = () => {
    if (isWorkplaceLoading) {
      return (
        <WorkplaceStateCard>
          사업장 정보를 불러오는 중이에요.
        </WorkplaceStateCard>
      );
    }
    if (workplaceLoadError) {
      return <WorkplaceStateCard>{workplaceLoadError}</WorkplaceStateCard>;
    }
    if (!primaryWorkplaceDetail) {
      return <WorkplaceStateCard>등록된 사업장이 없어요.</WorkplaceStateCard>;
    }

    return (
      <InfoCard
        rows={[
          { label: '사업장명', value: primaryWorkplaceDetail.workplaceName },
          {
            label: '업종',
            value: getIndustryLabel(primaryWorkplaceDetail.businessTypeName),
          },
          {
            label: '사업장 주소',
            value: primaryWorkplaceDetail.workplaceAddress,
          },
          {
            label: '사업자 등록 번호',
            value: primaryWorkplaceDetail.businessRegistrationNumber,
          },
          {
            label: '직원 수',
            value: getEmployeeCountLabel(
              primaryWorkplaceDetail.employeeCountRange,
            ),
          },
        ]}
      />
    );
  };

  return (
    <div className="w-full max-w-[970px] pt-10 pb-16">
      <header className="flex items-start justify-between gap-6">
        <div>
          <h1 className="text-4xl leading-[43px] font-semibold tracking-[-0.8px] text-black">
            마이페이지
          </h1>
          <p className="mt-1.5 text-xl leading-6 font-semibold text-black/60">
            내 정보를 최신 상태로 유지해보세요
          </p>
        </div>
        {!isEditing && (
          <button
            type="button"
            onClick={handleStartEditing}
            className="mt-[39px] h-8 w-24 cursor-pointer rounded-lg border border-[rgba(112,115,124,0.32)] bg-white text-sm font-medium text-[#171719] transition-colors hover:bg-[#f4f4f5]"
          >
            수정
          </button>
        )}
      </header>

      {!isEditing ? (
        <div className="mt-7">
          <section>
            <SectionTitle>사업자</SectionTitle>
            <InfoCard
              rows={[
                { label: '이름', value: profile.name },
                { label: '전화번호', value: profile.phone },
                { label: '이메일', value: profile.email },
                { label: '직책', value: profile.position ?? '미등록' },
              ]}
            />
          </section>

          <section className="mt-9">
            <SectionTitle>등록된 사업장</SectionTitle>
            {renderWorkplaceView()}
          </section>
        </div>
      ) : (
        <form className="mt-10" noValidate onSubmit={handleSave}>
          <section>
            <SectionTitle>사업자</SectionTitle>
            <div className="mt-3 rounded-xl border border-[rgba(112,115,124,0.16)] bg-white p-8 shadow-[0_2px_8px_-2px_rgba(23,23,25,0.10),0_1px_2px_rgba(23,23,25,0.06)]">
              <div className="grid grid-cols-1 gap-x-6 gap-y-6 lg:grid-cols-2">
                <label>
                  <FieldLabel>이름</FieldLabel>
                  <input
                    type="text"
                    value={draft.name}
                    onChange={(event) => updateProfileName(event.target.value)}
                    className={inputClassName}
                    aria-invalid={Boolean(errors.name)}
                  />
                  <FieldError message={errors.name} />
                </label>

                <div>
                  <FieldLabel disabled>전화번호</FieldLabel>
                  <div className="flex items-center gap-2">
                    {phoneParts.map((part, index) => (
                      <div key={index} className="contents">
                        {index > 0 && (
                          <span className="text-[13px] text-[#8b95a1]">-</span>
                        )}
                        <input
                          disabled
                          value={part}
                          aria-label={`전화번호 ${index + 1}번째 자리`}
                          className={`${disabledInputClassName} min-w-0`}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <label>
                  <FieldLabel disabled>이메일</FieldLabel>
                  <input
                    disabled
                    value={draft.email}
                    className={disabledInputClassName}
                  />
                </label>

                <label>
                  <FieldLabel>직책</FieldLabel>
                  <input
                    type="text"
                    value={draft.position ?? ''}
                    maxLength={50}
                    onChange={(event) =>
                      updateProfilePosition(event.target.value)
                    }
                    className={inputClassName}
                    aria-invalid={Boolean(errors.position)}
                  />
                  <FieldError message={errors.position} />
                </label>
              </div>
            </div>
          </section>

          <section className="mt-7">
            <SectionTitle>등록된 사업장</SectionTitle>
            {!workplaceDraft || !primaryWorkplaceDetail ? (
              <WorkplaceStateCard>
                {isWorkplaceLoading
                  ? '사업장 정보를 불러오는 중이에요.'
                  : (workplaceLoadError ?? '등록된 사업장이 없어요.')}
              </WorkplaceStateCard>
            ) : (
              <div className="mt-3 rounded-xl border border-[rgba(112,115,124,0.16)] bg-white p-8 shadow-[0_2px_8px_-2px_rgba(23,23,25,0.10),0_1px_2px_rgba(23,23,25,0.06)]">
                <div className="grid grid-cols-1 gap-x-6 gap-y-6 lg:grid-cols-2">
                  <label>
                    <FieldLabel>사업장명</FieldLabel>
                    <input
                      type="text"
                      value={workplaceDraft.workplaceName}
                      onChange={(event) =>
                        updateWorkplaceDraft(
                          'workplaceName',
                          event.target.value,
                        )
                      }
                      className={inputClassName}
                      aria-invalid={Boolean(errors.businessName)}
                    />
                    <FieldError message={errors.businessName} />
                  </label>

                  <div>
                    <FieldLabel>업종</FieldLabel>
                    <SelectField
                      value={workplaceDraft.businessTypeName}
                      options={EMPLOYER_INDUSTRY_OPTIONS}
                      placeholder="업종을 선택해 주세요"
                      ariaLabel="업종"
                      isOpen={isIndustryOpen}
                      onOpenChange={setIsIndustryOpen}
                      onChange={(value) =>
                        updateWorkplaceDraft('businessTypeName', value)
                      }
                    />
                    <FieldError message={errors.industry} />
                  </div>

                  <div className="lg:col-span-2">
                    <FieldLabel>사업장 주소</FieldLabel>
                    <div className="flex gap-2">
                      <input
                        readOnly
                        value={workplaceDraft.workplaceAddress}
                        placeholder="주소를 검색해 주세요"
                        className={`${inputClassName} min-w-0 flex-1 cursor-default`}
                        aria-invalid={Boolean(errors.address)}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setIsIndustryOpen(false);
                          setIsAddressModalOpen(true);
                        }}
                        className="h-[58px] w-24 shrink-0 cursor-pointer rounded-xl border border-[rgba(112,115,124,0.32)] bg-white text-sm font-medium text-[#171719] transition-colors hover:bg-[#f4f4f5]"
                      >
                        검색
                      </button>
                    </div>
                    <FieldError message={errors.address} />
                    <input
                      type="text"
                      value={workplaceDraft.detailAddress}
                      onChange={(event) =>
                        updateWorkplaceDraft(
                          'detailAddress',
                          event.target.value,
                        )
                      }
                      placeholder="상세 주소를 입력해 주세요"
                      aria-label="상세 주소"
                      className={`${inputClassName} mt-1.5`}
                    />
                  </div>

                  <div>
                    <FieldLabel disabled>사업자 등록 번호</FieldLabel>
                    <div className="flex items-center gap-2">
                      {registrationParts.map((part, index) => (
                        <div key={index} className="contents">
                          {index > 0 && (
                            <span className="text-[13px] text-[#8b95a1]">
                              -
                            </span>
                          )}
                          <input
                            disabled
                            value={part}
                            aria-label={`사업자 등록 번호 ${index + 1}번째 자리`}
                            className={`${disabledInputClassName} min-w-0`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <label>
                    <FieldLabel disabled>직원 수</FieldLabel>
                    <input
                      disabled
                      value={getEmployeeCountLabel(
                        primaryWorkplaceDetail.employeeCountRange,
                      )}
                      className={disabledInputClassName}
                    />
                  </label>
                </div>
                <p className="mt-2 text-[13px] font-medium text-[#70737c]">
                  사업자 등록번호와 직원 수는 직접 바꿀 수 없어요
                </p>
              </div>
            )}
          </section>

          <div className="mt-6 flex justify-end gap-2">
            {submitError && (
              <p
                role="alert"
                className="mr-auto self-center text-sm font-medium text-[#e11e1e]"
              >
                {submitError}
              </p>
            )}
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="h-[58px] w-40 cursor-pointer rounded-xl border border-[rgba(112,115,124,0.32)] bg-white text-lg font-medium text-[#171719] transition-colors hover:bg-[#f4f4f5] disabled:cursor-not-allowed disabled:text-[#8b95a1]"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-[58px] w-40 cursor-pointer rounded-xl bg-[#00b894] text-lg font-semibold text-white transition-colors hover:bg-[#00a886] disabled:cursor-not-allowed disabled:bg-[#e1e2e4] disabled:text-[#8b95a1]"
            >
              {isSubmitting ? '저장 중' : '저장'}
            </button>
          </div>
        </form>
      )}

      {isAddressModalOpen && workplaceDraft && (
        <EmployerAddressSearchModal
          addresses={EMPLOYER_ADDRESS_MOCKS}
          onClose={() => setIsAddressModalOpen(false)}
          onSelect={(address) => {
            updateWorkplaceDraft('workplaceAddress', address.roadAddress);
            setIsAddressModalOpen(false);
          }}
        />
      )}
      {toastMessage && <Toast message={toastMessage} />}
    </div>
  );
}

export default EmployerMyPage;
