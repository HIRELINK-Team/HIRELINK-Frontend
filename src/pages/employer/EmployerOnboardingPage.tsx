import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SelectField from '../../components/common/SelectField';
import EmployerAddressSearchModal from '../../components/employer/EmployerAddressSearchModal';
import hirelinkLogo from '../../assets/hirelink-logo.svg';
import { requestPhoneVerification, verifyPhone } from '../../api/auth';
import { getApiErrorResponse, getApiErrorStatus } from '../../api/errors';
import { updateTermAgreements } from '../../api/termAgreements';
import {
  createWorkplace,
  extractBusinessRegistration,
  verifyBusinessRegistration,
} from '../../api/workplaces';
import {
  BETA_DEFAULT_WORKPLACE_COORDINATES,
  EMPLOYEE_COUNT_OPTIONS,
  EMPLOYEE_COUNT_RANGE_BY_CODE,
  MAX_REGISTRATION_FILE_SIZE,
  REFERRAL_SOURCE_OPTIONS,
} from '../../data/employerOnboardingData';
import {
  EMPLOYER_ADDRESS_MOCKS,
  EMPLOYER_INDUSTRY_OPTIONS,
} from '../../data/employerProfileData';
import { useEmployerProfile } from '../../hooks/useEmployerProfile';
import type { SelectOption } from '../../components/common/SelectField';
import type {
  EmployerOnboardingForm,
  EmployeeCountCode,
  OnboardingStep,
  ReferralSourceCode,
} from '../../types/employerOnboarding';
import type {
  EmployerIndustryCode,
  EmployerProfileResponse,
} from '../../types/employerProfile';
import type {
  CreateWorkplaceRequest,
  CreateWorkplaceResponse,
} from '../../types/workplace';

type OpenSelect = 'referral' | 'industry' | 'employeeCount' | null;

const INITIAL_FORM: EmployerOnboardingForm = {
  manager: {
    name: '',
    phoneParts: ['', '', ''],
    verificationCode: '',
    referralSource: '',
  },
  business: {
    name: '',
    registrationNumberParts: ['', '', ''],
    registrationFile: null,
    industry: '',
    employeeCount: '',
    address: '',
    detailAddress: '',
  },
  agreements: {
    terms: false,
    privacy: false,
    marketing: false,
  },
};

const inputClassName =
  'h-[58px] w-full rounded-[10px] border border-[rgba(112,115,124,0.22)] bg-white px-4 text-base text-[#171719] outline-none transition-colors placeholder:text-[#8b95a1] hover:border-[#aeb4bc] focus:border-[#00b894] focus:ring-2 focus:ring-[#00b894]/10';

const ALLOWED_REGISTRATION_FILE_TYPES = new Set([
  'application/pdf',
  'image/jpeg',
  'image/png',
]);
const ALLOWED_REGISTRATION_FILE_EXTENSION = /\.(pdf|jpe?g|png)$/i;

const TERM_AGREEMENTS = [
  { field: 'terms', termTypeId: 1, label: '이용약관에 동의합니다 (선택)' },
  {
    field: 'privacy',
    termTypeId: 2,
    label: '개인정보처리방침에 동의합니다 (선택)',
  },
  {
    field: 'marketing',
    termTypeId: 3,
    label: '광고성 정보 수신에 동의합니다 (선택)',
  },
] as const;

function formatRemainingTime(seconds: number) {
  const minute = Math.floor(seconds / 60);
  const second = String(seconds % 60).padStart(2, '0');
  return `${minute}:${second}`;
}

function getPhoneRequestErrorMessage(error: unknown) {
  const status = getApiErrorStatus(error);
  const apiError = getApiErrorResponse(error);

  if (status === 400) return apiError?.message ?? '전화번호를 확인해 주세요.';
  if (status === 401) return '로그인 정보를 확인하지 못했습니다.';
  if (status === 403) return '휴대전화 인증을 요청할 수 없는 계정이에요.';
  if (status === 429)
    return (
      apiError?.message ?? '요청 횟수가 초과됐어요. 잠시 후 다시 시도해 주세요.'
    );
  if (status && status >= 500)
    return '인증번호를 전송하지 못했어요. 잠시 후 다시 시도해 주세요.';
  return apiError?.message ?? '인증번호 요청을 완료하지 못했어요.';
}

function getPhoneVerificationErrorMessage(error: unknown) {
  const status = getApiErrorStatus(error);
  const apiError = getApiErrorResponse(error);

  if (status === 400)
    return apiError?.message ?? '인증번호가 일치하지 않거나 만료됐어요.';
  if (status === 401) return '로그인 정보를 확인하지 못했습니다.';
  if (status === 409)
    return apiError?.message ?? '이미 다른 계정에서 사용 중인 전화번호예요.';
  if (status === 429)
    return apiError?.message ?? '인증번호 입력 횟수가 초과됐어요.';
  if (status && status >= 500)
    return '인증번호를 확인하지 못했어요. 잠시 후 다시 시도해 주세요.';
  return apiError?.message ?? '인증번호 확인을 완료하지 못했어요.';
}

function getTermAgreementErrorMessage(error: unknown) {
  const status = getApiErrorStatus(error);
  const apiError = getApiErrorResponse(error);

  if (status === 400) return apiError?.message ?? '약관 동의를 확인해 주세요.';
  if (status === 401) return '로그인 정보를 확인하지 못했습니다.';
  if (status === 403) return '약관 동의를 저장할 권한이 없습니다.';
  if (status === 404) return '약관 정보를 찾지 못했습니다.';
  if (status && status >= 500)
    return '약관 동의를 저장하지 못했어요. 잠시 후 다시 시도해 주세요.';
  return apiError?.message ?? '약관 동의를 저장하지 못했어요.';
}

function getProfileCreationErrorMessage(error: unknown) {
  const status = getApiErrorStatus(error);
  const apiError = getApiErrorResponse(error);

  if (status === 400)
    return apiError?.message ?? '담당자 정보를 다시 확인해 주세요.';
  if (status === 401) return '로그인 정보를 확인하지 못했습니다.';
  if (status === 403) return '사업주 프로필을 등록할 권한이 없습니다.';
  if (status === 409 && apiError?.code === 'PHONE_NOT_VERIFIED')
    return '휴대전화 인증을 완료한 후 다시 시도해 주세요.';
  if (status === 409 && apiError?.code === 'DUPLICATE_EMPLOYER_PROFILE')
    return '이미 등록된 사업주 프로필이에요.';
  if (status && status >= 500)
    return '사업주 프로필을 등록하지 못했어요. 잠시 후 다시 시도해 주세요.';
  return apiError?.message ?? '사업주 프로필을 등록하지 못했어요.';
}

function getOcrErrorMessage(error: unknown) {
  const status = getApiErrorStatus(error);
  const apiError = getApiErrorResponse(error);

  if (status === 400) return apiError?.message ?? '파일을 다시 확인해 주세요.';
  if (status === 401) return '로그인 정보를 확인하지 못했습니다.';
  if (status === 403) return '사업주 계정만 사업자등록증을 확인할 수 있어요.';
  if (status === 413) return '5MB 이하의 파일을 선택해 주세요.';
  if (status === 415) return 'PDF, JPG, PNG 파일만 선택할 수 있어요.';
  if (status === 422)
    return apiError?.message ?? '사업자등록번호를 인식하지 못했어요.';
  if (status === 502)
    return 'OCR 서비스에 연결하지 못했어요. 잠시 후 다시 시도해 주세요.';
  if (status && status >= 500)
    return '서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.';

  return apiError?.message ?? '사업자등록증을 확인하지 못했어요.';
}

function getVerificationErrorMessage(error: unknown) {
  const status = getApiErrorStatus(error);
  const apiError = getApiErrorResponse(error);

  if (status === 400)
    return apiError?.message ?? '사업자등록번호를 다시 확인해 주세요.';
  if (status === 401) return '로그인 정보를 확인하지 못했습니다.';
  if (status === 403) return '사업주 계정만 사업자번호를 조회할 수 있어요.';
  if (status === 502)
    return '국세청 조회 서비스에 연결하지 못했어요. 잠시 후 다시 시도해 주세요.';
  if (status && status >= 500)
    return '서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.';

  return apiError?.message ?? '사업자등록번호를 조회하지 못했어요.';
}

function getWorkplaceCreationErrorMessage(error: unknown) {
  const status = getApiErrorStatus(error);
  const apiError = getApiErrorResponse(error);

  if (status === 400)
    return apiError?.message ?? '사업장 정보를 다시 확인해 주세요.';
  if (status === 401) return '로그인 정보를 확인하지 못했습니다.';
  if (status === 403) return '사업주 계정만 사업장을 등록할 수 있어요.';
  if (status === 404) return '선택한 업종 정보를 찾지 못했어요.';
  if (status === 409) return '이미 등록된 사업자등록번호예요.';
  if (status === 415) return '사업장 등록 요청 형식이 올바르지 않아요.';
  if (status === 502)
    return '국세청 조회 서비스에 연결하지 못했어요. 잠시 후 다시 시도해 주세요.';
  if (status && status >= 500)
    return '서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.';

  return apiError?.message ?? '사업장을 등록하지 못했어요.';
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-1.5 block text-base leading-6 font-semibold tracking-[-0.16px] text-[#171719]">
      {children}
    </span>
  );
}

function AgreementCheckbox({
  checked,
  onChange,
  ariaLabel,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  ariaLabel: string;
}) {
  return (
    <span className="relative flex size-5 shrink-0 items-center justify-center">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        aria-label={ariaLabel}
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
  );
}

function StepProgress({ step }: { step: OnboardingStep }) {
  return (
    <div className="mt-4">
      <p className="text-sm font-medium text-[#70737c]">
        {step}/2 {step === 1 ? '담당자 정보' : '사업장 정보'}
      </p>
      <div className="mt-2 flex gap-2.5">
        <span className="h-[7px] flex-1 rounded-[3px] bg-[#00b894]" />
        <span
          className={`h-[7px] flex-1 rounded-[3px] ${step === 2 ? 'bg-[#00b894]' : 'bg-[#e1e2e4]'}`}
        />
      </div>
    </div>
  );
}

function SplitNumberInput({
  parts,
  lengths,
  label,
  onChange,
}: {
  parts: [string, string, string];
  lengths: [number, number, number];
  label: string;
  onChange: (index: number, value: string) => void;
}) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      {parts.map((part, index) => (
        <div key={index} className="contents">
          {index > 0 && (
            <span className="shrink-0 text-[13px] text-[#70737c]">-</span>
          )}
          <input
            type="text"
            inputMode="numeric"
            value={part}
            maxLength={lengths[index]}
            aria-label={`${label} ${index + 1}번째 자리`}
            onChange={(event) => onChange(index, event.target.value)}
            className={`${inputClassName} min-w-0 flex-1`}
          />
        </div>
      ))}
    </div>
  );
}

function FormSelect<T extends string>({
  label,
  value,
  options,
  placeholder,
  name,
  openSelect,
  onOpenSelect,
  onChange,
}: {
  label: string;
  value: T | '';
  options: SelectOption<T>[];
  placeholder: string;
  name: Exclude<OpenSelect, null>;
  openSelect: OpenSelect;
  onOpenSelect: (name: OpenSelect) => void;
  onChange: (value: T) => void;
}) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <SelectField
        value={value as T}
        options={options}
        placeholder={placeholder}
        ariaLabel={label}
        isOpen={openSelect === name}
        onOpenChange={(isOpen) => onOpenSelect(isOpen ? name : null)}
        onChange={onChange}
      />
    </div>
  );
}

function getInitialOnboardingStep(): OnboardingStep {
  if (!import.meta.env.DEV) return 1;

  const requestedStep = new URLSearchParams(window.location.search).get('step');
  return requestedStep === '2' ? 2 : 1;
}

function EmployerOnboardingPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const serverProfileRef = useRef<EmployerProfileResponse | null>(null);
  const { profile, createProfile, loadProfile, updateProfile } =
    useEmployerProfile();
  const [step, setStep] = useState<OnboardingStep>(getInitialOnboardingStep);
  const [form, setForm] = useState<EmployerOnboardingForm>(INITIAL_FORM);
  const [openSelect, setOpenSelect] = useState<OpenSelect>(null);
  const [isVerificationRequested, setIsVerificationRequested] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [isPhoneRequesting, setIsPhoneRequesting] = useState(false);
  const [isPhoneVerifying, setIsPhoneVerifying] = useState(false);
  const [verificationExpiresAt, setVerificationExpiresAt] = useState<
    number | null
  >(null);
  const [verificationRemainingSeconds, setVerificationRemainingSeconds] =
    useState(0);
  const [phoneVerificationMessage, setPhoneVerificationMessage] = useState<
    string | null
  >(null);
  const [phoneVerificationError, setPhoneVerificationError] = useState<
    string | null
  >(null);
  const [isRegistrationChecked, setIsRegistrationChecked] = useState(false);
  const [isOcrComplete, setIsOcrComplete] = useState(false);
  const [isOcrLoading, setIsOcrLoading] = useState(false);
  const [isRegistrationChecking, setIsRegistrationChecking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [ocrMessage, setOcrMessage] = useState<string | null>(null);
  const [registrationMessage, setRegistrationMessage] = useState<string | null>(
    null,
  );
  const [registrationError, setRegistrationError] = useState<string | null>(
    null,
  );
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!verificationExpiresAt || isPhoneVerified) return;

    const intervalId = window.setInterval(() => {
      setVerificationRemainingSeconds(
        Math.max(0, Math.ceil((verificationExpiresAt - Date.now()) / 1000)),
      );
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [isPhoneVerified, verificationExpiresAt]);

  useEffect(() => {
    if (!import.meta.env.DEV) return;
    const requestedStep = new URLSearchParams(window.location.search).get(
      'step',
    );
    if (requestedStep !== '2') return;

    let isActive = true;
    loadProfile()
      .then((response) => {
        if (isActive) serverProfileRef.current = response;
      })
      .catch(() => undefined);

    return () => {
      isActive = false;
    };
  }, [loadProfile]);

  const isPhoneComplete = form.manager.phoneParts.every(
    (part, index) => part.length === (index === 0 ? 3 : 4),
  );
  const isRegistrationNumberComplete =
    form.business.registrationNumberParts.every(
      (part, index) => part.length === [3, 2, 5][index],
    );
  const isStepOneComplete = Boolean(
    form.manager.name.trim() &&
    isPhoneComplete &&
    isPhoneVerified &&
    form.manager.referralSource,
  );
  const isVerificationExpired =
    isVerificationRequested &&
    verificationRemainingSeconds <= 0 &&
    !isPhoneVerified;
  const isStepTwoComplete = Boolean(
    form.business.name.trim() &&
    isRegistrationNumberComplete &&
    isRegistrationChecked &&
    form.business.registrationFile &&
    isOcrComplete &&
    form.business.industry &&
    form.business.employeeCount &&
    form.business.address.trim(),
  );

  const updateManager = <K extends keyof EmployerOnboardingForm['manager']>(
    field: K,
    value: EmployerOnboardingForm['manager'][K],
  ) => {
    setForm((current) => ({
      ...current,
      manager: { ...current.manager, [field]: value },
    }));
  };

  const updateBusiness = <K extends keyof EmployerOnboardingForm['business']>(
    field: K,
    value: EmployerOnboardingForm['business'][K],
  ) => {
    setForm((current) => ({
      ...current,
      business: { ...current.business, [field]: value },
    }));
    setSubmitError(null);
  };

  const updateBusinessFields = (
    fields: Partial<EmployerOnboardingForm['business']>,
  ) => {
    setForm((current) => ({
      ...current,
      business: { ...current.business, ...fields },
    }));
  };

  const handlePhonePartChange = (index: number, value: string) => {
    const nextParts = [...form.manager.phoneParts] as [string, string, string];
    const maxLength = index === 0 ? 3 : 4;
    nextParts[index] = value.replace(/\D/g, '').slice(0, maxLength);
    updateManager('phoneParts', nextParts);
    setIsVerificationRequested(false);
    setIsPhoneVerified(false);
    setVerificationExpiresAt(null);
    setVerificationRemainingSeconds(0);
    setPhoneVerificationMessage(null);
    setPhoneVerificationError(null);
    updateManager('verificationCode', '');
  };

  const handleVerificationCodeChange = (value: string) => {
    const nextCode = value.replace(/\D/g, '').slice(0, 6);
    updateManager('verificationCode', nextCode);
    setPhoneVerificationError(null);
  };

  const getPhoneNumber = () => form.manager.phoneParts.join('-');

  const handleRequestPhoneVerification = async () => {
    if (!isPhoneComplete || isPhoneRequesting || isPhoneVerified) return;

    setIsPhoneRequesting(true);
    setPhoneVerificationError(null);
    setPhoneVerificationMessage(null);
    setIsPhoneVerified(false);

    try {
      const response = await requestPhoneVerification({
        phoneNumber: getPhoneNumber(),
      });
      setIsVerificationRequested(true);
      updateManager('verificationCode', '');
      setVerificationRemainingSeconds(response.expiresIn);
      setVerificationExpiresAt(Date.now() + response.expiresIn * 1000);
      setPhoneVerificationMessage(response.message);
    } catch (error: unknown) {
      setPhoneVerificationError(getPhoneRequestErrorMessage(error));
    } finally {
      setIsPhoneRequesting(false);
    }
  };

  const handleVerifyPhone = async () => {
    if (
      !isVerificationRequested ||
      form.manager.verificationCode.length !== 6 ||
      isVerificationExpired ||
      isPhoneVerifying ||
      isPhoneVerified
    ) {
      return;
    }

    setIsPhoneVerifying(true);
    setPhoneVerificationError(null);

    try {
      const response = await verifyPhone({
        phoneNumber: getPhoneNumber(),
        code: form.manager.verificationCode,
      });
      setIsPhoneVerified(true);
      setVerificationExpiresAt(null);
      setVerificationRemainingSeconds(0);
      setPhoneVerificationMessage(response.message);
    } catch (error: unknown) {
      setIsPhoneVerified(false);
      setPhoneVerificationError(getPhoneVerificationErrorMessage(error));
    } finally {
      setIsPhoneVerifying(false);
    }
  };

  const handleRegistrationNumberChange = (index: number, value: string) => {
    const nextParts = [...form.business.registrationNumberParts] as [
      string,
      string,
      string,
    ];
    const maxLength = [3, 2, 5][index];
    nextParts[index] = value.replace(/\D/g, '').slice(0, maxLength);
    updateBusinessFields({ registrationNumberParts: nextParts });
    setIsRegistrationChecked(false);
    setRegistrationMessage(null);
    setRegistrationError(null);
    setSubmitError(null);
  };

  const applyBusinessAutofill = ({
    registrationNumber,
    address,
  }: {
    registrationNumber?: string;
    address?: string;
  }) => {
    const fields: Partial<EmployerOnboardingForm['business']> = {};

    if (registrationNumber !== undefined) {
      const digits = registrationNumber.replace(/\D/g, '');
      fields.registrationNumberParts = [
        digits.slice(0, 3),
        digits.slice(3, 5),
        digits.slice(5, 10),
      ];
      setIsRegistrationChecked(false);
      setRegistrationMessage(null);
      setRegistrationError(null);
    }

    if (address !== undefined) {
      fields.address = address;
    }

    updateBusinessFields(fields);
    setSubmitError(null);
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0] ?? null;
    if (!file) return;

    event.target.value = '';

    const isSupportedType =
      ALLOWED_REGISTRATION_FILE_TYPES.has(file.type) ||
      ALLOWED_REGISTRATION_FILE_EXTENSION.test(file.name);

    if (!isSupportedType) {
      setFileError('PDF, JPG, PNG 파일만 선택할 수 있어요.');
      setOcrMessage(null);
      return;
    }

    if (file.size > MAX_REGISTRATION_FILE_SIZE) {
      setFileError('5MB 이하의 파일을 선택해 주세요.');
      setOcrMessage(null);
      return;
    }

    setFileError(null);
    setOcrMessage(null);
    setIsOcrComplete(false);
    setIsRegistrationChecked(false);
    setRegistrationMessage(null);
    setRegistrationError(null);
    setSubmitError(null);
    updateBusiness('registrationFile', file);

    setIsOcrLoading(true);
    try {
      const response = await extractBusinessRegistration(file);
      applyBusinessAutofill({
        registrationNumber: response.businessRegistrationNumber,
        address: response.workplaceAddress ?? '',
      });
      setIsOcrComplete(true);
      setOcrMessage(
        response.workplaceAddress
          ? '사업자등록번호와 주소를 불러왔어요. 내용을 확인해 주세요.'
          : '사업자등록번호를 불러왔어요. 주소를 직접 확인해 주세요.',
      );
    } catch (error: unknown) {
      setFileError(getOcrErrorMessage(error));
    } finally {
      setIsOcrLoading(false);
    }
  };

  const handleRegistrationCheck = async () => {
    if (!isRegistrationNumberComplete || isRegistrationChecking) return;

    setIsRegistrationChecking(true);
    setIsRegistrationChecked(false);
    setRegistrationMessage(null);
    setRegistrationError(null);
    setSubmitError(null);

    try {
      const response = await verifyBusinessRegistration({
        businessRegistrationNumber:
          form.business.registrationNumberParts.join('-'),
      });

      if (response.valid) {
        setIsRegistrationChecked(true);
        setRegistrationMessage(response.message);
      } else {
        setRegistrationError(
          response.message || '유효하지 않은 사업자등록번호예요.',
        );
      }
    } catch (error: unknown) {
      setRegistrationError(getVerificationErrorMessage(error));
    } finally {
      setIsRegistrationChecking(false);
    }
  };

  const handleAgreementChange = (
    field: keyof EmployerOnboardingForm['agreements'],
    checked: boolean,
  ) => {
    setForm((current) => ({
      ...current,
      agreements: { ...current.agreements, [field]: checked },
    }));
  };

  const handleComplete = async () => {
    if (
      !isStepTwoComplete ||
      isOcrLoading ||
      isRegistrationChecking ||
      isSubmitting
    ) {
      return;
    }

    const selectedBusinessType = EMPLOYER_INDUSTRY_OPTIONS.find(
      (option) => option.value === form.business.industry,
    );

    if (!selectedBusinessType || !form.business.employeeCount) {
      setSubmitError('업종과 직원 수를 다시 선택해 주세요.');
      return;
    }

    const workplaceAddress = [
      form.business.address.trim(),
      form.business.detailAddress.trim(),
    ]
      .filter(Boolean)
      .join(' ');

    const request: CreateWorkplaceRequest = {
      workplaceName: form.business.name.trim(),
      businessRegistrationNumber:
        form.business.registrationNumberParts.join('-'),
      businessTypeId: selectedBusinessType.id,
      employeeCountRange:
        EMPLOYEE_COUNT_RANGE_BY_CODE[form.business.employeeCount],
      workplaceAddress,
      ...BETA_DEFAULT_WORKPLACE_COORDINATES,
    };

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      try {
        await updateTermAgreements({
          agreements: TERM_AGREEMENTS.map(({ field, termTypeId }) => ({
            termTypeId,
            isAgreed: form.agreements[field],
          })),
        });
      } catch (error: unknown) {
        setSubmitError(getTermAgreementErrorMessage(error));
        return;
      }

      if (!serverProfileRef.current) {
        if (!form.manager.name.trim() || !form.manager.referralSource) {
          setSubmitError('이전 단계에서 담당자 정보를 먼저 입력해 주세요.');
          return;
        }

        try {
          const response = await createProfile({
            name: form.manager.name.trim(),
            acquisitionChannel: form.manager.referralSource,
          });
          serverProfileRef.current = response;
        } catch (error: unknown) {
          const apiError = getApiErrorResponse(error);
          if (
            getApiErrorStatus(error) === 409 &&
            apiError?.code === 'DUPLICATE_EMPLOYER_PROFILE'
          ) {
            try {
              serverProfileRef.current = await loadProfile();
            } catch (loadError: unknown) {
              setSubmitError(getProfileCreationErrorMessage(loadError));
              return;
            }
          } else {
            setSubmitError(getProfileCreationErrorMessage(error));
            return;
          }
        }
      }

      let response: CreateWorkplaceResponse;
      try {
        response = await createWorkplace(request);
      } catch (error: unknown) {
        setSubmitError(getWorkplaceCreationErrorMessage(error));
        return;
      }

      const serverProfile = serverProfileRef.current;

      updateProfile({
        ...profile,
        ...(serverProfile
          ? {
              name: serverProfile.name,
              email: serverProfile.email,
              phone: serverProfile.phoneNumber,
              position: serverProfile.position,
            }
          : {}),
        business: {
          ...profile.business,
          name: response.workplaceName,
          industry: response.businessTypeName,
          address: response.workplaceAddress,
          detailAddress: '',
          registrationNumber: response.businessRegistrationNumber,
        },
      });
      navigate('/employer/dashboard', { replace: true });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="h-[86px] px-6 pt-[27px] sm:px-[54px]">
        <img src={hirelinkLogo} alt="HIRELINK" width={183} height={27} />
      </header>

      <main className="mx-auto w-full max-w-[588px] px-6 pt-9 pb-20">
        <h1 className="text-center text-[32px] leading-[45px] font-semibold tracking-[-0.32px] text-[#171719]">
          회원 정보 입력
        </h1>
        <StepProgress step={step} />

        {step === 1 ? (
          <section className="mt-14">
            <label className="block">
              <FieldLabel>이름</FieldLabel>
              <input
                type="text"
                value={form.manager.name}
                onChange={(event) => updateManager('name', event.target.value)}
                placeholder="이름을 입력해주세요"
                className={inputClassName}
              />
            </label>

            <div className="mt-6">
              <FieldLabel>전화번호</FieldLabel>
              <div className="grid grid-cols-[minmax(0,1fr)_96px] gap-2">
                <SplitNumberInput
                  parts={form.manager.phoneParts}
                  lengths={[3, 4, 4]}
                  label="전화번호"
                  onChange={handlePhonePartChange}
                />
                <button
                  type="button"
                  disabled={
                    !isPhoneComplete || isPhoneVerified || isPhoneRequesting
                  }
                  onClick={handleRequestPhoneVerification}
                  className="h-[58px] cursor-pointer rounded-xl bg-[#00b894] text-base font-semibold text-white transition-colors hover:bg-[#00a886] disabled:cursor-not-allowed disabled:bg-[#e1e2e4] disabled:text-[#8b95a1]"
                >
                  {isPhoneVerified
                    ? '완료'
                    : isPhoneRequesting
                      ? '전송 중'
                      : isVerificationRequested
                        ? '재전송'
                        : '인증'}
                </button>
              </div>
              {phoneVerificationError && !isVerificationRequested && (
                <p role="alert" className="mt-1.5 text-xs text-[#e11e1e]">
                  {phoneVerificationError}
                </p>
              )}
            </div>

            {isVerificationRequested && (
              <div className="mt-6">
                <FieldLabel>인증번호 입력</FieldLabel>
                <div className="grid grid-cols-[minmax(0,1fr)_96px] gap-2">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={form.manager.verificationCode}
                    onChange={(event) =>
                      handleVerificationCodeChange(event.target.value)
                    }
                    placeholder="인증번호 6자리를 입력해주세요"
                    aria-label="인증번호"
                    className={inputClassName}
                  />
                  <button
                    type="button"
                    disabled={
                      form.manager.verificationCode.length !== 6 ||
                      isVerificationExpired ||
                      isPhoneVerifying ||
                      isPhoneVerified
                    }
                    onClick={handleVerifyPhone}
                    className="h-[58px] cursor-pointer rounded-xl bg-[#00b894] text-base font-semibold text-white transition-colors hover:bg-[#00a886] disabled:cursor-not-allowed disabled:bg-[#e1e2e4] disabled:text-[#8b95a1]"
                  >
                    {isPhoneVerified
                      ? '확인 완료'
                      : isPhoneVerifying
                        ? '확인 중'
                        : '확인'}
                  </button>
                </div>
                <p
                  className={`mt-1.5 text-xs font-medium ${isPhoneVerified ? 'text-[#007a63]' : isVerificationExpired ? 'text-[#e11e1e]' : 'text-[#70737c]'}`}
                >
                  {isPhoneVerified
                    ? (phoneVerificationMessage ?? '인증이 완료되었어요.')
                    : isVerificationExpired
                      ? '인증번호가 만료됐어요. 다시 요청해 주세요.'
                      : `${phoneVerificationMessage ?? '인증번호가 전송되었어요.'} 남은 시간 ${formatRemainingTime(verificationRemainingSeconds)}`}
                </p>
                {phoneVerificationError && (
                  <p role="alert" className="mt-1 text-xs text-[#e11e1e]">
                    {phoneVerificationError}
                  </p>
                )}
              </div>
            )}

            <div className="mt-6">
              <FormSelect<ReferralSourceCode>
                label="처음 알게 된 경로"
                value={form.manager.referralSource}
                options={REFERRAL_SOURCE_OPTIONS}
                placeholder="경로를 선택해주세요"
                name="referral"
                openSelect={openSelect}
                onOpenSelect={setOpenSelect}
                onChange={(value) => updateManager('referralSource', value)}
              />
            </div>

            <div className="mt-10 flex justify-end">
              <button
                type="button"
                disabled={
                  !isStepOneComplete || isPhoneRequesting || isPhoneVerifying
                }
                onClick={() => {
                  setOpenSelect(null);
                  setStep(2);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="h-[58px] w-40 cursor-pointer rounded-xl bg-[#00b894] text-lg font-semibold text-white transition-colors hover:bg-[#00a886] disabled:cursor-not-allowed disabled:bg-[#e1e2e4] disabled:text-[#8b95a1]"
              >
                다음
              </button>
            </div>
          </section>
        ) : (
          <section className="mt-14">
            <label className="block">
              <FieldLabel>사업장명</FieldLabel>
              <input
                type="text"
                value={form.business.name}
                onChange={(event) => updateBusiness('name', event.target.value)}
                placeholder="사업장명을 입력해주세요"
                className={inputClassName}
              />
            </label>

            <div className="mt-6">
              <FieldLabel>사업자등록증</FieldLabel>
              <p className="mb-2 text-[13px] text-[#70737c]">
                5MB 이하의 PDF, JPG, PNG 파일만 올릴 수 있어요
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                onChange={handleFileChange}
                className="sr-only"
              />
              <button
                type="button"
                disabled={isOcrLoading}
                onClick={() => fileInputRef.current?.click()}
                className="flex h-[58px] w-full cursor-pointer items-center justify-center rounded-[10px] border border-dashed border-[rgba(112,115,124,0.32)] bg-white px-4 text-base font-medium text-[#171719] transition-colors hover:bg-[#f7f7f8] disabled:cursor-not-allowed disabled:bg-[#f7f7f8] disabled:text-[#8b95a1]"
              >
                <span className="max-w-full truncate">
                  {isOcrLoading
                    ? 'OCR 확인 중'
                    : (form.business.registrationFile?.name ?? '업로드하기')}
                </span>
              </button>
              {fileError && (
                <p role="alert" className="mt-1.5 text-xs text-[#e11e1e]">
                  {fileError}
                </p>
              )}
              {ocrMessage && (
                <p role="status" className="mt-1.5 text-xs text-[#008f73]">
                  {ocrMessage}
                </p>
              )}
            </div>

            <div className="mt-6">
              <FieldLabel>사업자 등록 번호</FieldLabel>
              <div className="grid grid-cols-[minmax(0,1fr)_96px] gap-2">
                <SplitNumberInput
                  parts={form.business.registrationNumberParts}
                  lengths={[3, 2, 5]}
                  label="사업자 등록 번호"
                  onChange={handleRegistrationNumberChange}
                />
                <button
                  type="button"
                  disabled={
                    !isRegistrationNumberComplete ||
                    isRegistrationChecked ||
                    isRegistrationChecking
                  }
                  onClick={handleRegistrationCheck}
                  className="h-[58px] cursor-pointer rounded-xl bg-[#00b894] text-base font-semibold text-white transition-colors hover:bg-[#00a886] disabled:cursor-not-allowed disabled:bg-[#e1e2e4] disabled:text-[#8b95a1]"
                >
                  {isRegistrationChecking
                    ? '조회 중'
                    : isRegistrationChecked
                      ? '조회 완료'
                      : '조회'}
                </button>
              </div>
              {registrationMessage && (
                <p role="status" className="mt-1.5 text-xs text-[#008f73]">
                  {registrationMessage}
                </p>
              )}
              {registrationError && (
                <p role="alert" className="mt-1.5 text-xs text-[#e11e1e]">
                  {registrationError}
                </p>
              )}
            </div>

            <div className="mt-6">
              <FieldLabel>사업장 주소</FieldLabel>
              <div className="grid grid-cols-[minmax(0,1fr)_96px] gap-2">
                <input
                  value={form.business.address}
                  onChange={(event) =>
                    applyBusinessAutofill({ address: event.target.value })
                  }
                  placeholder="오른쪽 버튼을 눌러 주소를 검색해주세요"
                  className={inputClassName}
                />
                <button
                  type="button"
                  onClick={() => {
                    setOpenSelect(null);
                    setIsAddressModalOpen(true);
                  }}
                  className="h-[58px] cursor-pointer rounded-xl border border-[rgba(112,115,124,0.32)] bg-white text-base font-medium text-[#171719] transition-colors hover:bg-[#f4f4f5]"
                >
                  검색
                </button>
              </div>
              <input
                type="text"
                value={form.business.detailAddress}
                onChange={(event) =>
                  updateBusiness('detailAddress', event.target.value)
                }
                placeholder="상세 주소를 입력해주세요"
                aria-label="상세 주소"
                className={`${inputClassName} mt-2`}
              />
            </div>

            <div className="mt-6">
              <FormSelect<EmployerIndustryCode>
                label="업종"
                value={form.business.industry}
                options={EMPLOYER_INDUSTRY_OPTIONS}
                placeholder="업종을 선택해주세요"
                name="industry"
                openSelect={openSelect}
                onOpenSelect={setOpenSelect}
                onChange={(value) => updateBusiness('industry', value)}
              />
            </div>

            <div className="mt-6">
              <FormSelect<EmployeeCountCode>
                label="직원 수"
                value={form.business.employeeCount}
                options={EMPLOYEE_COUNT_OPTIONS}
                placeholder="직원 수 범위를 선택해주세요"
                name="employeeCount"
                openSelect={openSelect}
                onOpenSelect={setOpenSelect}
                onChange={(value) => updateBusiness('employeeCount', value)}
              />
            </div>

            <div className="mt-8">
              <FieldLabel>약관을 확인해주세요</FieldLabel>
              <label className="flex h-[58px] cursor-pointer items-center gap-2.5 rounded-[10px] border border-[rgba(112,115,124,0.16)] px-4 text-base font-medium text-[#171719]">
                <AgreementCheckbox
                  checked={Object.values(form.agreements).every(Boolean)}
                  ariaLabel="모든 약관 동의"
                  onChange={(checked) => {
                    setForm((current) => ({
                      ...current,
                      agreements: {
                        terms: checked,
                        privacy: checked,
                        marketing: checked,
                      },
                    }));
                  }}
                />
                모든 약관에 동의합니다
              </label>
              <div className="mt-1 rounded-[10px] border border-[#e1e2e4] px-4 py-4">
                {TERM_AGREEMENTS.map(({ field, label }) => (
                  <label
                    key={field}
                    className="flex cursor-pointer items-center gap-2.5 py-1 text-sm font-medium text-[#70737c]"
                  >
                    <AgreementCheckbox
                      checked={form.agreements[field]}
                      ariaLabel={label}
                      onChange={(checked) =>
                        handleAgreementChange(field, checked)
                      }
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>

            {submitError && (
              <p
                role="alert"
                className="mt-6 text-right text-sm text-[#e11e1e]"
              >
                {submitError}
              </p>
            )}

            <div className="mt-10 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setOpenSelect(null);
                  setStep(1);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="h-[58px] w-40 cursor-pointer rounded-xl border border-[rgba(112,115,124,0.32)] bg-white text-lg font-medium text-[#171719] transition-colors hover:bg-[#f4f4f5]"
              >
                이전
              </button>
              <button
                type="button"
                disabled={
                  !isStepTwoComplete ||
                  isOcrLoading ||
                  isRegistrationChecking ||
                  isSubmitting
                }
                onClick={handleComplete}
                className="h-[58px] w-40 cursor-pointer rounded-xl bg-[#00b894] text-lg font-semibold text-white transition-colors hover:bg-[#00a886] disabled:cursor-not-allowed disabled:bg-[#e1e2e4] disabled:text-[#8b95a1]"
              >
                {isSubmitting ? '등록 중' : '완료'}
              </button>
            </div>
          </section>
        )}
      </main>

      {isAddressModalOpen && (
        <EmployerAddressSearchModal
          addresses={EMPLOYER_ADDRESS_MOCKS}
          onClose={() => setIsAddressModalOpen(false)}
          onSelect={(address) => {
            applyBusinessAutofill({ address: address.roadAddress });
            setIsAddressModalOpen(false);
          }}
        />
      )}
    </div>
  );
}

export default EmployerOnboardingPage;
