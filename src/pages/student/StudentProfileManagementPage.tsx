import { useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';

import backIcon from '../../assets/icons/student/documents/back.svg';
import rowChevronIcon from '../../assets/icons/student/documents/chevron-right.svg';
import dropdownChevronIcon from '../../assets/icons/student/profile/dropdown-chevron.svg';
import basicInformationIcon from '../../assets/images/student/profile-management/basic-information.png';
import languageInformationIcon from '../../assets/images/student/profile-management/language-information.png';
import residenceInformationIcon from '../../assets/images/student/profile-management/residence-information.png';
import { OnboardingBottomSheet } from '../../components/student/onboarding/OnboardingBottomSheet';
import { ResidenceExpiryDatePicker } from '../../components/student/onboarding/ResidenceExpiryDatePicker';
import {
  ACADEMIC_STATUS_OPTIONS,
  COUNTRY_OPTIONS,
  KOREAN_LEVELS,
  RESIDENCE_QUALIFICATION_OPTIONS,
  TOPIK_LEVEL_OPTIONS,
} from '../../constants/studentOnboardingOptions';
import type { ResidenceQualification } from '../../types/residence';

type ProfileManagementView =
  'main' | 'basic' | 'residence' | 'academic' | 'language';

export type ProfileDetailView = Exclude<ProfileManagementView, 'main'>;
export type StudentProfileEditField =
  | 'birth-date'
  | 'phone'
  | 'current-region'
  | 'preferred-region'
  | 'career'
  | 'korean-level';
export type StudentProfileValues = Partial<
  Record<ProfileDetailView, readonly string[]>
>;

type ProfileField = {
  inputType?: 'date';
  isSelectable?: boolean;
  label: string;
  value: string;
};

const PROFILE_DETAIL_PAGE_CLASS =
  "relative mx-auto flex h-[min(844px,100dvh)] w-full max-w-[390px] flex-col overflow-hidden bg-[#F5F5F5] px-6 pt-[clamp(32px,7.2dvh,61px)] pb-[clamp(20px,4.4dvh,37px)] font-['Pretendard','Apple_SD_Gothic_Neo','Noto_Sans_KR',sans-serif] tracking-[-0.02em] text-[#191F28]";

const PROFILE_DETAIL_TITLE_CLASS =
  'm-0 mt-[clamp(12px,2.2dvh,18px)] text-[clamp(22px,3.1dvh,26px)] leading-[1.5] font-semibold';

const PROFILE_DETAIL_FORM_CLASS =
  'mt-[clamp(14px,2.2dvh,28px)] space-y-[clamp(4px,0.8dvh,8px)]';

const PROFILE_DETAIL_SAVE_BUTTON_CLASS =
  'mt-auto h-[clamp(48px,6.8dvh,57px)] w-full shrink-0 rounded-[15px] border-0 bg-[#00B894] text-[clamp(17px,2.4dvh,20px)] leading-[1.5] font-medium text-[#F5F5F5]';

type StudentProfileManagementPageProps = {
  initialView?: ProfileManagementView;
  isLoading?: boolean;
  isProfileUnavailable?: boolean;
  onApply?: () => void;
  onBack?: () => void;
  onSave?: (
    view: ProfileDetailView,
    values: readonly string[],
  ) => boolean | void | Promise<boolean | void>;
  onViewChange?: (view: Exclude<ProfileManagementView, 'main'>) => void;
  onEditField?: (field: StudentProfileEditField) => void;
  careerCount?: number;
  preferredRegion?: string;
  profileValues?: StudentProfileValues;
};

const DETAIL_FIELDS: Record<
  Exclude<ProfileManagementView, 'main'>,
  readonly ProfileField[]
> = {
  basic: [
    { label: '이름', value: '카페 아르바이트' },
    { label: '생년월일', value: '2002-01-01' },
    { label: '국적', value: '베트남', isSelectable: true },
    { label: '거주지역', value: '서울 마포구', isSelectable: true },
    { label: '한국어 수준', value: '중급', isSelectable: true },
  ],
  residence: [
    { label: '체류자격', value: 'D-2-2 (학사)', isSelectable: true },
    { label: '체류기간 만료일', value: '2027.02.28', isSelectable: true },
    { label: '외국인 등록 여부', value: '등록 완료' },
  ],
  academic: [
    { label: '학교', value: '숭실대학교' },
    { label: '학위과정', value: '학사', isSelectable: true },
    { label: '학적 상태', value: '재학 중', isSelectable: true },
  ],
  language: [
    { label: 'TOPIK', value: '4급', isSelectable: true },
    { label: '한국어 실력', value: '상', isSelectable: true },
    { label: '영어 성적', value: '미등록' },
  ],
};

function getDetailFields(
  view: ProfileDetailView,
  profileValues: StudentProfileValues,
  t: TFunction,
) {
  const labelKeys = {
    basic: ['my.profileDetails.name', 'my.profile.birthDate', 'my.profileDetails.nationality', 'my.profile.currentRegion', 'my.profileDetails.koreanLevel'],
    residence: ['my.profile.visa', 'my.profileDetails.residenceExpiry', 'my.profileDetails.alienRegistered'],
    academic: ['my.profileDetails.school', 'my.profileDetails.degree', 'my.profileDetails.academicStatus'],
    language: ['TOPIK', 'my.profile.koreanLevel', 'my.profileDetails.englishScore'],
  }[view];
  return DETAIL_FIELDS[view].map((field, index) => ({
    ...field,
    label: labelKeys[index] === 'TOPIK' ? 'TOPIK' : t(labelKeys[index]),
    value: profileValues[view]?.[index] ?? field.value,
  }));
}

type ProfileSelectOption = {
  label: string;
};

function ProfileOptionSheet({
  onClose,
  onConfirm,
  onSelect,
  options,
  selectedValue,
  title,
}: {
  onClose: () => void;
  onConfirm: () => void;
  onSelect: (value: string) => void;
  options: readonly ProfileSelectOption[];
  selectedValue: string;
  title: string;
}) {
  return (
    <OnboardingBottomSheet
      title={title}
      options={options.map((option) => ({
        label: option.label,
        value: option.label,
      }))}
      selectedValue={selectedValue}
      onSelect={onSelect}
      onClose={onClose}
      onConfirm={onConfirm}
    />
  );
}

function formatProfileExpiryDate(date: string) {
  return date.replaceAll('-', '.');
}

function toProfileExpiryDate(date: string) {
  return date.replaceAll('.', '-');
}

function getResidenceQualification(
  qualificationLabel: string | undefined,
): ResidenceQualification {
  return (
    RESIDENCE_QUALIFICATION_OPTIONS.find(
      (option) => option.label === qualificationLabel,
    )?.value ?? 'D2_2'
  );
}

function EditableProfileValue({
  field,
  onChange,
  onValueChange,
}: {
  field: ProfileField;
  onChange: () => void;
  onValueChange?: (value: string) => void;
}) {
  const className =
    'mt-[clamp(5px,0.9dvh,8px)] flex h-[clamp(48px,6.6dvh,56px)] w-full items-center rounded-[15px] bg-[#E5E8EB] px-[clamp(22px,3dvw,25px)] text-left text-[clamp(15px,2dvh,17px)] leading-[1.5]';

  if (onValueChange) {
    return (
      <input
        aria-label={field.label}
        className={`${className} border-0 outline-none`}
        type={field.inputType ?? 'text'}
        value={field.value}
        onChange={(event) => onValueChange(event.target.value)}
      />
    );
  }

  const content = (
    <>
      <span className="whitespace-nowrap">{field.value}</span>
      {field.isSelectable ? (
        <span className="ml-auto mr-[3px] flex h-[7px] w-[13px] items-center justify-center">
          <img
            alt=""
            className="h-[13px] w-[7px] -rotate-90"
            src={dropdownChevronIcon}
          />
        </span>
      ) : null}
    </>
  );

  if (!field.isSelectable) {
    return <div className={className}>{content}</div>;
  }

  return (
    <button
      className={`${className} border-0`}
      type="button"
      onClick={onChange}
    >
      {content}
    </button>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  const { t } = useTranslation();
  return (
    <button
      aria-label={t('common.back')}
      className="grid size-8 -ml-[10px] place-items-center border-0 bg-transparent p-0"
      type="button"
      onClick={onClick}
    >
      <img alt="" className="h-4 w-2" src={backIcon} />
    </button>
  );
}

type ProfileInformationRowProps = {
  label: string;
  onClick?: () => void;
  value: string;
};

function ProfileInformationRow({
  label,
  onClick,
  value,
}: ProfileInformationRowProps) {
  const content = (
    <>
      <span className="w-[102px] shrink-0 text-[13px] leading-[1.5] text-[#909597]">
        {label}
      </span>
      <span className="min-w-0 flex-1 truncate text-[13px] leading-[1.5] font-medium text-[#1D1F20]">
        {value || '-'}
      </span>
      {onClick ? (
        <img
          alt=""
          className="h-[13px] w-[6px] shrink-0 rotate-180"
          src={rowChevronIcon}
        />
      ) : null}
    </>
  );

  return onClick ? (
    <button
      className="flex h-[45px] w-full items-center border-0 border-t border-[#E6E8E9] bg-transparent px-6 text-left"
      type="button"
      onClick={onClick}
    >
      {content}
    </button>
  ) : (
    <div className="flex h-[45px] w-full items-center border-t border-[#E6E8E9] px-6">
      {content}
    </div>
  );
}

function ProfileInformationSection({
  children,
  icon,
  title,
}: {
  children: ReactNode;
  icon: string;
  title: string;
}) {
  return (
    <section>
      <div className="flex h-7 items-center gap-1 px-6">
        <img alt="" className="size-7 object-contain" src={icon} />
        <h2 className="m-0 text-[17px] leading-[1.5] font-semibold text-[#393C3E]">
          {title}
        </h2>
      </div>
      <div className="mt-[13px]">{children}</div>
    </section>
  );
}

function DetailPage({
  fields,
  onBack,
  title,
}: {
  fields: readonly ProfileField[];
  onBack: () => void;
  title: string;
}) {
  const { t } = useTranslation();
  return (
    <main className="mx-auto flex h-[844px] w-full max-w-[390px] flex-col bg-[#F5F5F5] px-6 pt-[61px] font-['Pretendard','Apple_SD_Gothic_Neo','Noto_Sans_KR',sans-serif] tracking-[-0.02em] text-[#191F28]">
      <BackButton onClick={onBack} />
      <h1 className="m-0 mt-[18px] text-[26px] leading-[1.5] font-semibold">
        {title}
      </h1>
      <section className="mt-[39px] space-y-[10.5px]">
        {fields.map((field) => (
          <div key={field.label}>
            <p className="m-0 text-[15px] leading-[1.5] font-medium">
              {field.label}
            </p>
            <div className="mt-[8px] flex h-14 items-center rounded-[15px] bg-[#E5E8EB] px-[25px] text-[17px] leading-[1.5] text-[#191F28]">
              <span>{field.value}</span>
              {field.isSelectable ? (
                <span className="ml-auto flex h-[7px] w-[13px] items-center justify-center">
                  <img
                    alt=""
                    className="h-[13px] w-[7px] -rotate-90"
                    src={dropdownChevronIcon}
                  />
                </span>
              ) : null}
            </div>
          </div>
        ))}
      </section>
      <button
        className="mt-auto mb-[37px] h-[57px] w-full rounded-[15px] border-0 bg-[#00B894] text-[20px] leading-[1.5] font-medium text-[#F5F5F5]"
        type="button"
        onClick={onBack}
      >
        {t('my.profile.edit')}
      </button>
    </main>
  );
}

function BasicInformationPage({
  fields,
  isSaving,
  onBack,
  onSave,
}: {
  fields: readonly ProfileField[];
  isSaving: boolean;
  onBack: () => void;
  onSave: (values: readonly string[]) => Promise<void>;
}) {
  const { t } = useTranslation();
  const [values, setValues] = useState(() =>
    fields.map((field) => field.value),
  );
  const [openFieldIndex, setOpenFieldIndex] = useState<number | null>(null);
  const [pendingValue, setPendingValue] = useState('');

  const options =
    openFieldIndex === 2
      ? COUNTRY_OPTIONS.map((label) => ({ label }))
      : openFieldIndex === 4
        ? KOREAN_LEVELS.map(({ label }) => ({ label }))
        : undefined;

  const handleOpen = (index: 2 | 4) => {
    setOpenFieldIndex(index);
    setPendingValue(values[index] ?? fields[index]?.value ?? '');
  };

  const handleConfirm = () => {
    if (openFieldIndex !== null) {
      setValues((currentValues) =>
        currentValues.map((value, index) =>
          index === openFieldIndex ? pendingValue : value,
        ),
      );
    }

    setOpenFieldIndex(null);
  };

  return (
    <main className={PROFILE_DETAIL_PAGE_CLASS}>
      <BackButton onClick={onBack} />
      <h1 className={PROFILE_DETAIL_TITLE_CLASS}>{t('my.profileDetails.basicTitle')}</h1>
      <section className={PROFILE_DETAIL_FORM_CLASS}>
        {fields.map((field, index) => (
          <div key={field.label}>
            <p className="m-0 whitespace-nowrap text-[clamp(13px,1.8dvh,15px)] leading-[1.5]">
              {field.label}
            </p>
            <EditableProfileValue
              field={{
                ...field,
                inputType: index === 1 ? 'date' : undefined,
                // Nationality opens COUNTRY_OPTIONS; Korean proficiency uses KOREAN_LEVELS.
                isSelectable: index === 2 || index === 4,
                value: values[index] ?? field.value,
              }}
              onValueChange={
                index === 1 || index === 3
                  ? (value) =>
                      setValues((currentValues) =>
                        currentValues.map((currentValue, valueIndex) =>
                          valueIndex === index ? value : currentValue,
                        ),
                      )
                  : undefined
              }
              onChange={() => {
                if (index === 2 || index === 4) handleOpen(index);
              }}
            />
          </div>
        ))}
      </section>
      <button
        className={PROFILE_DETAIL_SAVE_BUTTON_CLASS}
        type="button"
        disabled={isSaving}
        onClick={() => void onSave(values)}
      >
        {t('my.profile.edit')}
      </button>
      {openFieldIndex !== null && options ? (
        <ProfileOptionSheet
          title={fields[openFieldIndex]?.label ?? ''}
          options={options}
          selectedValue={pendingValue}
          onSelect={setPendingValue}
          onClose={() => setOpenFieldIndex(null)}
          onConfirm={handleConfirm}
        />
      ) : null}
    </main>
  );
}

function ResidenceInformationPage({
  fields,
  isSaving,
  onBack,
  onSave,
}: {
  fields: readonly ProfileField[];
  isSaving: boolean;
  onBack: () => void;
  onSave: (values: readonly string[]) => Promise<void>;
}) {
  const { t, i18n } = useTranslation();
  const [values, setValues] = useState(() =>
    fields.map((field) => field.value),
  );
  const [isQualificationSheetOpen, setIsQualificationSheetOpen] =
    useState(false);
  const [isExpiryPickerOpen, setIsExpiryPickerOpen] = useState(false);
  const [qualificationDraft, setQualificationDraft] = useState(
    values[0] ?? fields[0]?.value ?? '',
  );

  return (
    <main className={PROFILE_DETAIL_PAGE_CLASS}>
      <BackButton onClick={onBack} />
      <h1 className={PROFILE_DETAIL_TITLE_CLASS}>{t('my.profileDetails.residenceTitle')}</h1>
      <section className={PROFILE_DETAIL_FORM_CLASS}>
        {fields.map((field, index) => (
          <div key={field.label}>
            <p className="m-0 whitespace-nowrap text-[clamp(13px,1.8dvh,15px)] leading-[1.5]">
              {field.label}
            </p>
            <EditableProfileValue
              field={{
                ...field,
                isSelectable: index === 0 || index === 1,
                value: values[index] ?? field.value,
              }}
              onChange={() => {
                if (index === 0) {
                  setQualificationDraft(values[0] ?? field.value);
                  setIsQualificationSheetOpen(true);
                }

                if (index === 1) setIsExpiryPickerOpen(true);
              }}
            />
          </div>
        ))}
      </section>
      <button
        className={PROFILE_DETAIL_SAVE_BUTTON_CLASS}
        type="button"
        disabled={isSaving}
        onClick={() => void onSave(values)}
      >
        {t('my.profile.edit')}
      </button>
      {isQualificationSheetOpen ? (
        <ProfileOptionSheet
          title={fields[0]?.label ?? ''}
          options={RESIDENCE_QUALIFICATION_OPTIONS}
          selectedValue={qualificationDraft}
          onSelect={setQualificationDraft}
          onClose={() => setIsQualificationSheetOpen(false)}
          onConfirm={() => {
            setValues((currentValues) =>
              currentValues.map((value, index) =>
                index === 0 ? qualificationDraft : value,
              ),
            );
            setIsQualificationSheetOpen(false);
          }}
        />
      ) : null}
      {isExpiryPickerOpen ? (
        <ResidenceExpiryDatePicker
          initialDate={toProfileExpiryDate(values[1] ?? '')}
          locale={i18n.resolvedLanguage === 'en' ? 'en' : 'ko'}
          confirmLabel={t('common.confirm')}
          onClose={() => setIsExpiryPickerOpen(false)}
          onConfirm={(date) => {
            setValues((currentValues) =>
              currentValues.map((value, index) =>
                index === 1 ? formatProfileExpiryDate(date) : value,
              ),
            );
            setIsExpiryPickerOpen(false);
          }}
        />
      ) : null}
    </main>
  );
}

function AcademicInformationPage({
  fields,
  isSaving,
  onBack,
  onSave,
  residenceQualification,
}: {
  fields: readonly ProfileField[];
  isSaving: boolean;
  onBack: () => void;
  onSave: (values: readonly string[]) => Promise<void>;
  residenceQualification: ResidenceQualification;
}) {
  const { t } = useTranslation();
  const [values, setValues] = useState(() =>
    fields.map((field) => field.value),
  );
  const [isAcademicStatusSheetOpen, setIsAcademicStatusSheetOpen] =
    useState(false);
  const [academicStatusDraft, setAcademicStatusDraft] = useState(
    values[2] ?? fields[2]?.value ?? '',
  );
  const academicStatusOptions = ACADEMIC_STATUS_OPTIONS[residenceQualification];

  return (
    <main className={PROFILE_DETAIL_PAGE_CLASS}>
      <BackButton onClick={onBack} />
      <h1 className={PROFILE_DETAIL_TITLE_CLASS}>{t('my.profileDetails.academicTitle')}</h1>
      <section className={PROFILE_DETAIL_FORM_CLASS}>
        {fields.map((field, index) => (
          <div key={field.label}>
            <p className="m-0 whitespace-nowrap text-[clamp(13px,1.8dvh,15px)] leading-[1.5]">
              {field.label}
            </p>
            <EditableProfileValue
              field={{
                ...field,
                // studyProgramId is not included in the profile PATCH contract.
                isSelectable: index === 2,
                value: values[index] ?? field.value,
              }}
              onChange={() => {
                if (index === 2) {
                  setAcademicStatusDraft(values[index] ?? field.value);
                  setIsAcademicStatusSheetOpen(true);
                }
              }}
            />
          </div>
        ))}
      </section>
      <button
        className={PROFILE_DETAIL_SAVE_BUTTON_CLASS}
        type="button"
        disabled={isSaving}
        onClick={() => void onSave(values)}
      >
        {t('my.profile.edit')}
      </button>
      {isAcademicStatusSheetOpen ? (
        <ProfileOptionSheet
          title={fields[2]?.label ?? ''}
          options={academicStatusOptions}
          selectedValue={academicStatusDraft}
          onSelect={setAcademicStatusDraft}
          onClose={() => setIsAcademicStatusSheetOpen(false)}
          onConfirm={() => {
            setValues((currentValues) =>
              currentValues.map((value, index) =>
                index === 2 ? academicStatusDraft : value,
              ),
            );
            setIsAcademicStatusSheetOpen(false);
          }}
        />
      ) : null}
    </main>
  );
}

function LanguageInformationPage({
  fields,
  isSaving,
  onBack,
  onSave,
}: {
  fields: readonly ProfileField[];
  isSaving: boolean;
  onBack: () => void;
  onSave: (values: readonly string[]) => Promise<void>;
}) {
  const { t } = useTranslation();
  const [values, setValues] = useState(() =>
    fields.map((field) => field.value),
  );
  const [openFieldIndex, setOpenFieldIndex] = useState<number | null>(null);
  const [pendingValue, setPendingValue] = useState<string | null>(null);

  const options =
    openFieldIndex === 0
      ? TOPIK_LEVEL_OPTIONS.map(({ label }) => ({ label }))
      : openFieldIndex === 1
        ? KOREAN_LEVELS.map(({ label }) => ({ label }))
        : undefined;

  const handleOpen = (index: number) => {
    setOpenFieldIndex(index);
    setPendingValue(values[index] ?? fields[index]?.value ?? null);
  };

  const handleClose = () => {
    setOpenFieldIndex(null);
    setPendingValue(null);
  };

  const handleConfirm = () => {
    if (openFieldIndex !== null && pendingValue !== null) {
      setValues((currentValues) =>
        currentValues.map((value, valueIndex) =>
          valueIndex === openFieldIndex ? pendingValue : value,
        ),
      );
    }

    handleClose();
  };

  return (
    <main className={PROFILE_DETAIL_PAGE_CLASS}>
      <BackButton onClick={onBack} />
      <h1 className={PROFILE_DETAIL_TITLE_CLASS}>{t('my.profileDetails.languageTitle')}</h1>
      <section className={PROFILE_DETAIL_FORM_CLASS}>
        {fields.map((field, index) => (
          <div key={field.label}>
            <p className="m-0 whitespace-nowrap text-[clamp(13px,1.8dvh,15px)] leading-[1.5]">
              {field.label}
            </p>
            <EditableProfileValue
              field={{ ...field, value: values[index] ?? field.value }}
              onChange={() => handleOpen(index)}
            />
          </div>
        ))}
      </section>
      <button
        className={PROFILE_DETAIL_SAVE_BUTTON_CLASS}
        type="button"
        disabled={isSaving}
        onClick={() => void onSave(values)}
      >
        {t('my.profile.edit')}
      </button>
      {openFieldIndex !== null && options && pendingValue !== null ? (
        <ProfileOptionSheet
          title={fields[openFieldIndex]?.label ?? ''}
          options={options}
          selectedValue={pendingValue}
          onSelect={setPendingValue}
          onClose={handleClose}
          onConfirm={handleConfirm}
        />
      ) : null}
    </main>
  );
}

export default function StudentProfileManagementPage({
  careerCount = 0,
  initialView = 'main',
  isLoading = false,
  isProfileUnavailable = false,
  onApply,
  onBack,
  onSave,
  onViewChange,
  onEditField,
  preferredRegion = '-',
  profileValues,
}: StudentProfileManagementPageProps) {
  const { t } = useTranslation();
  const [view, setView] = useState<ProfileManagementView>(initialView);
  const [localProfileValues, setLocalProfileValues] =
    useState<StudentProfileValues>({});
  const [isSaving, setIsSaving] = useState(false);
  const resolvedProfileValues = profileValues ?? localProfileValues;

  if (isLoading || isProfileUnavailable) {
    return (
      <main
        aria-busy={isLoading}
        className="mx-auto flex h-[100dvh] max-h-[844px] w-full max-w-[390px] flex-col bg-[#F5F5F5] px-6 pt-[61px] font-['Pretendard','Apple_SD_Gothic_Neo','Noto_Sans_KR',sans-serif] tracking-[-0.02em] text-[#191F28]"
      >
        <BackButton onClick={onBack ?? (() => undefined)} />
        <p className="mt-10 text-[17px] leading-[1.5] text-[#6B7684]">
          {isLoading
            ? t('my.profile.loading')
            : t('my.profile.loadError')}
        </p>
      </main>
    );
  }

  const handleSave = async (
    profileView: ProfileDetailView,
    values: readonly string[],
  ) => {
    if (isSaving) return;

    setIsSaving(true);

    try {
      if (onSave) {
        const isSaved = await onSave(profileView, values);

        if (isSaved === false) return;
      } else {
        setLocalProfileValues((currentValues) => ({
          ...currentValues,
          [profileView]: values,
        }));
      }

      handleDetailBack();
    } finally {
      setIsSaving(false);
    }
  };

  const handleDetailBack = () => {
    if (initialView !== 'main') {
      onBack?.();
      return;
    }

    setView('main');
  };

  const handleProfileCardClick = (
    profileView: Exclude<ProfileManagementView, 'main'>,
  ) => {
    if (onViewChange) {
      onViewChange(profileView);
      return;
    }

    setView(profileView);
  };

  if (view === 'basic') {
    return (
      <BasicInformationPage
        key={getDetailFields('basic', resolvedProfileValues, t)
          .map((field) => field.value)
          .join('|')}
        fields={getDetailFields('basic', resolvedProfileValues, t)}
        isSaving={isSaving}
        onBack={handleDetailBack}
        onSave={(values) => handleSave('basic', values)}
      />
    );
  }

  if (view === 'residence') {
    return (
      <ResidenceInformationPage
        key={getDetailFields('residence', resolvedProfileValues, t)
          .map((field) => field.value)
          .join('|')}
        fields={getDetailFields('residence', resolvedProfileValues, t)}
        isSaving={isSaving}
        onBack={handleDetailBack}
        onSave={(values) => handleSave('residence', values)}
      />
    );
  }

  if (view === 'academic') {
    return (
      <AcademicInformationPage
        key={getDetailFields('academic', resolvedProfileValues, t)
          .map((field) => field.value)
          .join('|')}
        fields={getDetailFields('academic', resolvedProfileValues, t)}
        isSaving={isSaving}
        onBack={handleDetailBack}
        onSave={(values) => handleSave('academic', values)}
        residenceQualification={getResidenceQualification(
          resolvedProfileValues.residence?.[0] ??
            DETAIL_FIELDS.residence[0]?.value,
        )}
      />
    );
  }

  if (view === 'language') {
    return (
      <LanguageInformationPage
        key={getDetailFields('language', resolvedProfileValues, t)
          .map((field) => field.value)
          .join('|')}
        fields={getDetailFields('language', resolvedProfileValues, t)}
        isSaving={isSaving}
        onBack={handleDetailBack}
        onSave={(values) => handleSave('language', values)}
      />
    );
  }

  if (view !== 'main') {
    return (
      <DetailPage
        fields={getDetailFields(view, resolvedProfileValues, t)}
        title={t(`my.profileDetails.${view}Title`, { defaultValue: '' })}
        onBack={handleDetailBack}
      />
    );
  }

  return (
    <main
      aria-busy={isLoading}
      className="relative mx-auto h-[954px] w-full max-w-[390px] overflow-hidden bg-[#F5F5F5] pt-[61px] font-['Pretendard','Apple_SD_Gothic_Neo','Noto_Sans_KR',sans-serif] tracking-[-0.02em] text-[#1D1F20]"
    >
      <div className="px-6">
        <BackButton onClick={onBack ?? (() => undefined)} />
        <h1 className="m-0 mt-[19px] text-[26px] leading-[1.5] font-semibold">
          {t('my.profile.title')}
        </h1>
      </div>

      <div className="mt-[19px]">
        <ProfileInformationSection
          icon={basicInformationIcon}
          title={t('my.profile.basic')}
        >
          <ProfileInformationRow
            label={t('my.profile.birthDate')}
            value={resolvedProfileValues.basic?.[1] ?? '-'}
            onClick={() =>
              onEditField
                ? onEditField('birth-date')
                : handleProfileCardClick('basic')
            }
          />
          <ProfileInformationRow
            label={t('my.profile.phone')}
            value={resolvedProfileValues.basic?.[5] ?? '-'}
            onClick={() =>
              onEditField ? onEditField('phone') : handleProfileCardClick('basic')
            }
          />
          <ProfileInformationRow
            label={t('my.profile.currentRegion')}
            value={resolvedProfileValues.basic?.[3] ?? '-'}
            onClick={() =>
              onEditField
                ? onEditField('current-region')
                : handleProfileCardClick('basic')
            }
          />
          <ProfileInformationRow
            label={t('my.profile.preferredRegion')}
            value={preferredRegion}
            onClick={() =>
              onEditField
                ? onEditField('preferred-region')
                : handleProfileCardClick('basic')
            }
          />
          <ProfileInformationRow
            label={t('my.profile.career')}
            value={t('my.profile.careerCount', { count: careerCount })}
            onClick={() =>
              onEditField ? onEditField('career') : handleProfileCardClick('basic')
            }
          />
        </ProfileInformationSection>

        <div className="mt-[18px]">
          <ProfileInformationSection
            icon={residenceInformationIcon}
            title={t('my.profile.residence')}
          >
            <ProfileInformationRow
              label={t('my.profile.visa')}
              value={resolvedProfileValues.residence?.[0] ?? '-'}
            />
            <ProfileInformationRow
              label={t('my.profile.expiry')}
              value={resolvedProfileValues.residence?.[1] ?? '-'}
            />
          </ProfileInformationSection>
        </div>

        <div className="mt-[24px]">
          <ProfileInformationSection
            icon={languageInformationIcon}
            title={t('my.profile.language')}
          >
            <ProfileInformationRow
              label="TOPIK"
              value={resolvedProfileValues.language?.[0] ?? '-'}
            />
            <ProfileInformationRow
              label={t('my.profile.koreanLevel')}
              value={resolvedProfileValues.language?.[1] ?? '-'}
              onClick={() =>
                onEditField
                  ? onEditField('korean-level')
                  : handleProfileCardClick('language')
              }
            />
          </ProfileInformationSection>
        </div>
      </div>

      <button
        className="absolute top-[792px] right-6 left-6 h-[57px] rounded-[15px] border-0 bg-[#00B894] text-[20px] leading-[1.5] font-medium text-[#F5F5F5]"
        type="button"
        onClick={onApply}
      >
        {t('my.profile.saveChanges')}
      </button>
    </main>
  );
}
