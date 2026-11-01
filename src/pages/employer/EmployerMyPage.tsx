import { useEffect, useState } from "react";
import SelectField from "../../components/common/SelectField";
import Toast from "../../components/common/Toast";
import EmployerAddressSearchModal from "../../components/employer/EmployerAddressSearchModal";
import {
  EMPLOYER_ADDRESS_MOCKS,
  EMPLOYER_INDUSTRY_OPTIONS,
} from "../../data/employerProfileData";
import { useEmployerProfile } from "../../hooks/useEmployerProfile";
import type { EmployerProfile } from "../../types/employerProfile";

type ProfileErrorKey =
  "name" | "phone" | "businessName" | "industry" | "address";
type ProfileErrors = Partial<Record<ProfileErrorKey, string>>;

const inputClassName =
  "h-[58px] w-full rounded-[10px] border border-[rgba(112,115,124,0.22)] bg-white px-4 text-base text-[#171719] outline-none transition-colors placeholder:text-[#8b95a1] hover:border-[#aeb4bc] focus:border-[#00b894] focus:ring-2 focus:ring-[#00b894]/10 aria-invalid:border-[#e11e1e]";
const disabledInputClassName = `${inputClassName} cursor-not-allowed !text-[#8b95a1] disabled:!text-[#8b95a1] hover:border-[rgba(112,115,124,0.22)]`;

function cloneProfile(profile: EmployerProfile): EmployerProfile {
  return { ...profile, business: { ...profile.business } };
}

function splitValue(value: string, partCount: number) {
  const parts = value.split("-");
  return Array.from({ length: partCount }, (_, index) => parts[index] ?? "");
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
      className={`mb-1.5 block text-base leading-6 font-semibold ${disabled ? "text-[#8b95a1]" : "text-[#171719]"}`}
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

function EmployerMyPage() {
  const { profile, updateProfile } = useEmployerProfile();
  const [draft, setDraft] = useState(() => cloneProfile(profile));
  const [isEditing, setIsEditing] = useState(false);
  const [isIndustryOpen, setIsIndustryOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [errors, setErrors] = useState<ProfileErrors>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!toastMessage) return;
    const timeoutId = window.setTimeout(() => setToastMessage(null), 4000);
    return () => window.clearTimeout(timeoutId);
  }, [toastMessage]);

  const industryLabel =
    EMPLOYER_INDUSTRY_OPTIONS.find(
      (option) => option.value === profile.business.industry,
    )?.label ?? "";

  const handleStartEditing = () => {
    setDraft(cloneProfile(profile));
    setErrors({});
    setIsEditing(true);
  };

  const handleCancel = () => {
    setDraft(cloneProfile(profile));
    setErrors({});
    setIsIndustryOpen(false);
    setIsAddressModalOpen(false);
    setIsEditing(false);
  };

  const updateProfileField = (field: "name" | "phone", value: string) => {
    setDraft((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const updateBusinessField = <K extends keyof EmployerProfile["business"]>(
    field: K,
    value: EmployerProfile["business"][K],
  ) => {
    setDraft((current) => ({
      ...current,
      business: { ...current.business, [field]: value },
    }));
    const errorKey = field === "name" ? "businessName" : field;
    if (
      errorKey === "businessName" ||
      errorKey === "industry" ||
      errorKey === "address"
    ) {
      setErrors((current) => ({ ...current, [errorKey]: undefined }));
    }
  };

  const updatePhonePart = (index: number, value: string) => {
    const parts = splitValue(draft.phone, 3);
    parts[index] = value.replace(/\D/g, "").slice(0, index === 0 ? 3 : 4);
    updateProfileField("phone", parts.join("-"));
  };

  const validate = () => {
    const nextErrors: ProfileErrors = {};
    if (!draft.name.trim()) nextErrors.name = "이름을 입력해 주세요.";
    if (splitValue(draft.phone, 3).some((part) => !part)) {
      nextErrors.phone = "전화번호를 입력해 주세요.";
    }
    if (!draft.business.name.trim())
      nextErrors.businessName = "사업장명을 입력해 주세요.";
    if (!draft.business.industry) nextErrors.industry = "업종을 선택해 주세요.";
    if (!draft.business.address.trim())
      nextErrors.address = "사업장 주소를 선택해 주세요.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsIndustryOpen(false);
    if (!validate()) return;

    updateProfile(draft);
    setIsEditing(false);
    setToastMessage("수정이 적용되었어요");
  };

  const phoneParts = splitValue(draft.phone, 3);
  const registrationParts = splitValue(draft.business.registrationNumber, 3);

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
                { label: "이름", value: profile.name },
                { label: "전화번호", value: profile.phone },
                { label: "이메일", value: profile.email },
              ]}
            />
          </section>

          <section className="mt-9">
            <SectionTitle>등록된 사업장</SectionTitle>
            <InfoCard
              rows={[
                { label: "사업장명", value: profile.business.name },
                { label: "업종", value: industryLabel },
                {
                  label: "사업장 주소",
                  value: (
                    <span className="block leading-6">
                      {profile.business.address}
                      <br />
                      {profile.business.detailAddress}
                    </span>
                  ),
                },
                {
                  label: "사업자 등록 번호",
                  value: profile.business.registrationNumber,
                },
                {
                  label: "대표자명",
                  value: profile.business.representativeName,
                },
              ]}
            />
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
                    onChange={(event) =>
                      updateProfileField("name", event.target.value)
                    }
                    className={inputClassName}
                    aria-invalid={Boolean(errors.name)}
                  />
                  <FieldError message={errors.name} />
                </label>

                <div>
                  <FieldLabel>전화번호</FieldLabel>
                  <div className="flex items-center gap-2">
                    {phoneParts.map((part, index) => (
                      <div key={index} className="contents">
                        {index > 0 && (
                          <span className="text-[13px] text-[#70737c]">-</span>
                        )}
                        <input
                          type="text"
                          inputMode="numeric"
                          aria-label={`전화번호 ${index + 1}번째 자리`}
                          value={part}
                          onChange={(event) =>
                            updatePhonePart(index, event.target.value)
                          }
                          className={`${inputClassName} min-w-0`}
                          aria-invalid={Boolean(errors.phone)}
                        />
                      </div>
                    ))}
                  </div>
                  <FieldError message={errors.phone} />
                </div>

                <label>
                  <FieldLabel disabled>이메일</FieldLabel>
                  <input
                    disabled
                    value={draft.email}
                    className={disabledInputClassName}
                  />
                </label>
              </div>
            </div>
          </section>

          <section className="mt-7">
            <SectionTitle>등록된 사업장</SectionTitle>
            <div className="mt-3 rounded-xl border border-[rgba(112,115,124,0.16)] bg-white p-8 shadow-[0_2px_8px_-2px_rgba(23,23,25,0.10),0_1px_2px_rgba(23,23,25,0.06)]">
              <div className="grid grid-cols-1 gap-x-6 gap-y-6 lg:grid-cols-2">
                <label>
                  <FieldLabel>사업장명</FieldLabel>
                  <input
                    type="text"
                    value={draft.business.name}
                    onChange={(event) =>
                      updateBusinessField("name", event.target.value)
                    }
                    className={inputClassName}
                    aria-invalid={Boolean(errors.businessName)}
                  />
                  <FieldError message={errors.businessName} />
                </label>

                <div>
                  <FieldLabel>업종</FieldLabel>
                  <SelectField
                    value={draft.business.industry}
                    options={EMPLOYER_INDUSTRY_OPTIONS}
                    placeholder="업종을 선택해 주세요"
                    ariaLabel="업종"
                    isOpen={isIndustryOpen}
                    onOpenChange={setIsIndustryOpen}
                    onChange={(value) => updateBusinessField("industry", value)}
                  />
                  <FieldError message={errors.industry} />
                </div>

                <div className="lg:col-span-2">
                  <FieldLabel>사업장 주소</FieldLabel>
                  <div className="flex gap-2">
                    <input
                      readOnly
                      value={draft.business.address}
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
                    value={draft.business.detailAddress}
                    onChange={(event) =>
                      updateBusinessField("detailAddress", event.target.value)
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
                          <span className="text-[13px] text-[#8b95a1]">-</span>
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
                  <FieldLabel disabled>대표자명</FieldLabel>
                  <input
                    disabled
                    value={draft.business.representativeName}
                    className={disabledInputClassName}
                  />
                </label>
              </div>
              <p className="mt-2 text-[13px] font-medium text-[#70737c]">
                사업자 등록번호와 대표자명은 직접 바꿀 수 없어요
              </p>
            </div>
          </section>

          <div className="mt-6 flex justify-end gap-2">
            <button
              type="button"
              onClick={handleCancel}
              className="h-[58px] w-40 cursor-pointer rounded-xl border border-[rgba(112,115,124,0.32)] bg-white text-lg font-medium text-[#171719] transition-colors hover:bg-[#f4f4f5]"
            >
              취소
            </button>
            <button
              type="submit"
              className="h-[58px] w-40 cursor-pointer rounded-xl bg-[#00b894] text-lg font-semibold text-white transition-colors hover:bg-[#00a886] active:bg-[#00997a]"
            >
              저장
            </button>
          </div>
        </form>
      )}

      {isAddressModalOpen && (
        <EmployerAddressSearchModal
          addresses={EMPLOYER_ADDRESS_MOCKS}
          onClose={() => setIsAddressModalOpen(false)}
          onSelect={(address) => {
            updateBusinessField("address", address.roadAddress);
            setIsAddressModalOpen(false);
          }}
        />
      )}
      {toastMessage && <Toast message={toastMessage} />}
    </div>
  );
}

export default EmployerMyPage;
