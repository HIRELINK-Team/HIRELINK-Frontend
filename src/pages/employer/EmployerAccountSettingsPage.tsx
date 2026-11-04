import { useEffect, useState } from 'react';
import Toast from '../../components/common/Toast';
import { getApiErrorResponse, getApiErrorStatus } from '../../api/errors';
import { EMPLOYER_INDUSTRY_OPTIONS } from '../../data/employerProfileData';
import { useEmployerProfile } from '../../hooks/useEmployerProfile';
import type {
  EmployerProfile,
  UpdateEmployerProfileRequest,
} from '../../types/employerProfile';

type AccountErrorKey = 'name' | 'position';
type AccountErrors = Partial<Record<AccountErrorKey, string>>;

const inputClassName =
  'h-[58px] w-full rounded-[10px] border border-[rgba(112,115,124,0.22)] bg-white px-4 text-base text-[#171719] outline-none transition-colors hover:border-[#aeb4bc] focus:border-[#00b894] focus:ring-2 focus:ring-[#00b894]/10 aria-invalid:border-[#e11e1e]';
const disabledInputClassName = `${inputClassName} cursor-not-allowed bg-[#f7f7f8] !text-[#8b95a1] disabled:!text-[#8b95a1] hover:border-[rgba(112,115,124,0.22)]`;

function cloneProfile(profile: EmployerProfile): EmployerProfile {
  return { ...profile, business: { ...profile.business } };
}

function splitPhone(phone: string) {
  const parts = phone.split('-');
  return [parts[0] ?? '', parts[1] ?? '', parts[2] ?? ''];
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-1.5 block text-base leading-6 font-semibold text-[#171719]">
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

function EmployerAccountSettingsPage() {
  const { profile, saveProfile } = useEmployerProfile();
  const [draft, setDraft] = useState(() => cloneProfile(profile));
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<AccountErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!toastMessage) return;
    const timeoutId = window.setTimeout(() => setToastMessage(null), 4000);
    return () => window.clearTimeout(timeoutId);
  }, [toastMessage]);

  const industryLabel =
    EMPLOYER_INDUSTRY_OPTIONS.find(
      (option) => option.value === profile.business.industry,
    )?.label ?? '';

  const handleStartEditing = () => {
    setDraft(cloneProfile(profile));
    setErrors({});
    setSubmitError(null);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setDraft(cloneProfile(profile));
    setErrors({});
    setSubmitError(null);
    setIsEditing(false);
  };

  const updateField = (field: 'name' | 'position', value: string) => {
    setDraft((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setSubmitError(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = draft.name.trim();
    const position = draft.position?.trim() || null;
    const nextErrors: AccountErrors = {};
    if (!name) nextErrors.name = '이름을 입력해 주세요.';
    if (name.length > 100)
      nextErrors.name = '이름은 100자 이하로 입력해 주세요.';
    if (position && position.length > 50)
      nextErrors.position = '직책은 50자 이하로 입력해 주세요.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const request: UpdateEmployerProfileRequest = {};
    if (name !== profile.name) request.name = name;

    const currentPosition = profile.position?.trim() || null;
    if (position !== currentPosition) request.position = position;

    if (Object.keys(request).length === 0) {
      setIsEditing(false);
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await saveProfile(request);
      setIsEditing(false);
      setToastMessage('수정이 적용되었어요');
    } catch (error: unknown) {
      const status = getApiErrorStatus(error);
      const apiError = getApiErrorResponse(error);

      if (status === 400) {
        setSubmitError(
          apiError?.message ?? '입력한 이름과 직책을 확인해 주세요.',
        );
      } else if (status === 401) {
        setSubmitError(
          '로그인 정보를 확인하지 못했습니다. 다시 시도해 주세요.',
        );
      } else if (status === 403) {
        setSubmitError('사업주 프로필을 수정할 권한이 없습니다.');
      } else if (status === 404) {
        setSubmitError('수정할 사업주 프로필을 찾지 못했습니다.');
      } else if (status && status >= 500) {
        setSubmitError('서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
      } else {
        setSubmitError(
          apiError?.message ??
            '프로필을 수정하지 못했습니다. 잠시 후 다시 시도해 주세요.',
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full pt-[45px] pb-16">
      <header className="flex items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl leading-[43px] font-semibold tracking-[-0.8px] text-black">
            계정 정보 관리
          </h1>
          <p className="mt-1.5 text-xl leading-6 font-semibold text-black/60">
            내 정보를 최신 상태로 유지해보세요
          </p>
        </div>
        {!isEditing && (
          <button
            type="button"
            onClick={handleStartEditing}
            className="h-8 w-24 cursor-pointer rounded-lg border border-[rgba(112,115,124,0.32)] bg-white text-sm font-medium text-[#171719] transition-colors hover:bg-[#f4f4f5]"
          >
            수정
          </button>
        )}
      </header>

      {isEditing ? (
        <form className="mt-8" noValidate onSubmit={handleSubmit}>
          <section>
            <h2 className="text-xl font-semibold text-[#171719]">
              담당자 정보
            </h2>
            <div className="mt-3 rounded-xl border border-[rgba(112,115,124,0.16)] bg-white p-8 shadow-[0_2px_8px_-2px_rgba(23,23,25,0.10),0_1px_2px_rgba(23,23,25,0.06)]">
              <div className="grid grid-cols-1 gap-x-6 gap-y-6 lg:grid-cols-2">
                <label>
                  <FieldLabel>이름</FieldLabel>
                  <input
                    value={draft.name}
                    maxLength={100}
                    onChange={(event) =>
                      updateField('name', event.target.value)
                    }
                    className={inputClassName}
                    aria-invalid={Boolean(errors.name)}
                  />
                  <FieldError message={errors.name} />
                </label>

                <div>
                  <FieldLabel>전화번호</FieldLabel>
                  <div className="flex items-center gap-2">
                    {splitPhone(draft.phone).map((part, index) => (
                      <div key={index} className="contents">
                        {index > 0 && (
                          <span className="text-[13px] text-[#70737c]">-</span>
                        )}
                        <input
                          value={part}
                          inputMode="numeric"
                          aria-label={`전화번호 ${index + 1}번째 자리`}
                          disabled
                          className={`${disabledInputClassName} min-w-0`}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <label>
                  <FieldLabel>이메일</FieldLabel>
                  <input
                    disabled
                    value={draft.email}
                    className={disabledInputClassName}
                  />
                  <p className="mt-1.5 text-[13px] font-medium text-[#70737c]">
                    이메일은 직접 바꿀 수 없어요
                  </p>
                </label>

                <label>
                  <FieldLabel>직책</FieldLabel>
                  <input
                    value={draft.position ?? ''}
                    maxLength={50}
                    onChange={(event) =>
                      updateField('position', event.target.value)
                    }
                    className={inputClassName}
                    aria-invalid={Boolean(errors.position)}
                  />
                  <FieldError message={errors.position} />
                </label>
              </div>
            </div>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-[#171719]">
              연결된 사업장
            </h2>
            <BusinessCard
              name={draft.business.name}
              industry={industryLabel}
              address={draft.business.address}
            />
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
      ) : (
        <div className="mt-8">
          <section>
            <h2 className="text-xl font-semibold text-[#171719]">
              담당자 정보
            </h2>
            <dl className="mt-3 grid grid-cols-[160px_minmax(0,1fr)] gap-y-4 rounded-xl border border-[rgba(112,115,124,0.16)] bg-white px-8 py-6 shadow-[0_2px_8px_-2px_rgba(23,23,25,0.10),0_1px_2px_rgba(23,23,25,0.06)]">
              {[
                ['이름', profile.name],
                ['전화번호', profile.phone],
                ['이메일', profile.email],
                ['직책', profile.position ?? '미등록'],
              ].map(([label, value]) => (
                <div key={label} className="contents">
                  <dt className="text-base font-medium text-[#70737c]">
                    {label}
                  </dt>
                  <dd className="text-base font-medium text-[#171719]">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-[#171719]">
              연결된 사업장
            </h2>
            <BusinessCard
              name={profile.business.name}
              industry={industryLabel}
              address={profile.business.address}
            />
          </section>
        </div>
      )}

      {toastMessage && <Toast message={toastMessage} />}
    </div>
  );
}

function BusinessCard({
  name,
  industry,
  address,
}: {
  name: string;
  industry: string;
  address: string;
}) {
  return (
    <div className="mt-3 rounded-xl border border-[rgba(112,115,124,0.16)] bg-white px-8 py-6 shadow-[0_2px_8px_-2px_rgba(23,23,25,0.10),0_1px_2px_rgba(23,23,25,0.06)]">
      <div className="flex items-center gap-3">
        <p className="text-xl font-semibold text-[#171719]">{name}</p>
        <span className="rounded-md bg-[#e5f8f3] px-2 py-1 text-xs font-semibold text-[#006e59]">
          사업자 확인 완료
        </span>
      </div>
      <p className="mt-2 text-[15px] font-medium text-[#70737c]">
        {industry} · {address}
      </p>
      <p className="mt-4 text-[13px] font-medium text-[#8b95a1]">
        사업장 정보는 마이페이지에서 관리해요
      </p>
    </div>
  );
}

export default EmployerAccountSettingsPage;
