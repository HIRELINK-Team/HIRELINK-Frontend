import { useState } from 'react';

import backIcon from '../../assets/icons/student/documents/back.svg';
import dropdownChevronIcon from '../../assets/icons/student/profile/dropdown-chevron.svg';
import { OnboardingBottomSheet } from '../../components/student/onboarding/OnboardingBottomSheet';

type ProfileManagementView =
  'main' | 'basic' | 'residence' | 'academic' | 'language';

export type ProfileDetailView = Exclude<ProfileManagementView, 'main'>;
export type StudentProfileValues = Partial<
  Record<ProfileDetailView, readonly string[]>
>;

type ProfileField = {
  isSelectable?: boolean;
  label: string;
  value: string;
};

type ProfileCard = {
  fields: readonly ProfileField[];
  title: string;
  view: Exclude<ProfileManagementView, 'main'>;
};

type StudentProfileManagementPageProps = {
  initialView?: ProfileManagementView;
  onApply?: () => void;
  onBack?: () => void;
  onSave?: (view: ProfileDetailView, values: readonly string[]) => void;
  onViewChange?: (view: Exclude<ProfileManagementView, 'main'>) => void;
  profileValues?: StudentProfileValues;
};

const PROFILE_CARDS: readonly ProfileCard[] = [
  {
    title: '기본 정보',
    view: 'basic',
    fields: [
      { label: '이름', value: '김숭실' },
      { label: '나이', value: '2002' },
      { label: '국적', value: '베트남' },
      { label: '전화번호', value: '010-1234-5678' },
      { label: '현재거주지', value: '서울 마포구' },
    ],
  },
  {
    title: '체류 정보',
    view: 'residence',
    fields: [
      { label: '체류자격', value: 'D-2-2 (학사)' },
      { label: '체류기간 만료일', value: '2027.02.28' },
      { label: '외국인 등록 여부', value: '등록 완료' },
    ],
  },
  {
    title: '학업 정보',
    view: 'academic',
    fields: [
      { label: '학교', value: '숭실대학교' },
      { label: '학위과정', value: '학사' },
      { label: '학적상태', value: '재학 중' },
    ],
  },
  {
    title: '어학 정보',
    view: 'language',
    fields: [
      { label: 'TOPIK', value: '4급' },
      { label: '한국어실력', value: '상' },
      { label: '영어 성적', value: '미등록' },
    ],
  },
];

const DETAIL_FIELDS: Record<
  Exclude<ProfileManagementView, 'main'>,
  readonly ProfileField[]
> = {
  basic: [
    { label: '이름', value: '카페 아르바이트' },
    { label: '나이', value: '22세', isSelectable: true },
    { label: '국적', value: '베트남', isSelectable: true },
    { label: '거주지역', value: '서울 마포구', isSelectable: true },
    { label: '한국어 수준', value: '중급', isSelectable: true },
  ],
  residence: [
    { label: '체류자격', value: 'D-D-2', isSelectable: true },
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

const DETAIL_TITLES: Record<Exclude<ProfileManagementView, 'main'>, string> = {
  basic: '기본정보',
  residence: '체류정보',
  academic: '학업정보',
  language: '어학정보',
};

const SELECTABLE_FIELD_VALUES: Record<
  ProfileDetailView,
  Partial<Record<number, readonly string[]>>
> = {
  academic: {
    1: ['학사', '석사'],
    2: ['재학 중', '휴학 중'],
  },
  basic: {
    1: ['22세', '23세'],
    2: ['베트남', '중국'],
    3: ['서울 마포구', '서울 성동구'],
    4: ['중급', '고급'],
  },
  language: {
    0: ['4급', '5급'],
    1: ['중', '상'],
  },
  residence: {
    0: ['D-2', 'D-4'],
    1: ['2027.02.28', '2027.08.31'],
  },
};

const PROFILE_CARD_VALUE_MAPPINGS: Record<
  ProfileDetailView,
  readonly (number | undefined)[]
> = {
  academic: [0, 1, 2],
  basic: [undefined, 1, 2, undefined, 3],
  language: [0, 1, 2],
  residence: [0, 1, 2],
};

function getDetailFields(
  view: ProfileDetailView,
  profileValues: StudentProfileValues,
) {
  return DETAIL_FIELDS[view].map((field, index) => ({
    ...field,
    value: profileValues[view]?.[index] ?? field.value,
  }));
}

function getProfileCards(profileValues: StudentProfileValues) {
  return PROFILE_CARDS.map((card) => {
    const valueMappings = PROFILE_CARD_VALUE_MAPPINGS[card.view];

    return {
      ...card,
      fields: card.fields.map((field, index) => {
        const detailIndex = valueMappings[index];

        return {
          ...field,
          value:
            detailIndex === undefined
              ? field.value
              : (profileValues[card.view]?.[detailIndex] ?? field.value),
        };
      }),
    };
  });
}

function getNextProfileValue(
  view: ProfileDetailView,
  fieldIndex: number,
  value: string,
) {
  const options = SELECTABLE_FIELD_VALUES[view][fieldIndex];

  if (!options) {
    return value;
  }

  const currentIndex = options.indexOf(value);

  return options[(currentIndex + 1) % options.length];
}

function EditableProfileValue({
  field,
  onChange,
}: {
  field: ProfileField;
  onChange: () => void;
}) {
  const className =
    'mt-2 flex h-14 w-full items-center rounded-[15px] bg-[#E5E8EB] px-[25px] text-left text-[17px] leading-[1.5]';

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
  return (
    <button
      aria-label="뒤로가기"
      className="grid size-8 -ml-[10px] place-items-center border-0 bg-transparent p-0"
      type="button"
      onClick={onClick}
    >
      <img alt="" className="h-4 w-2" src={backIcon} />
    </button>
  );
}

function ProfileCard({
  card,
  onClick,
}: {
  card: ProfileCard;
  onClick: () => void;
}) {
  const isBasicInformation = card.fields.length === 5;

  return (
    <section
      className={`relative w-full overflow-hidden rounded-[20px] bg-[#E5E8EB] ${
        isBasicInformation ? 'h-[186px]' : 'h-[138px]'
      }`}
    >
      <h2 className="absolute top-[19px] left-[30px] m-0 text-[15px] leading-[1.5] font-bold">
        {card.title}
      </h2>
      <button
        className="absolute top-[22px] right-[22px] h-[27px] rounded-[30px] border border-[#B0B8C1] bg-transparent px-[13px] text-[13px] leading-[1.5] text-[#4E5968]"
        type="button"
        onClick={onClick}
      >
        수정하기
      </button>
      <dl className="absolute top-[51px] left-[31px] m-0 space-y-1 text-[13px] leading-[1.5]">
        {card.fields.map((field) => (
          <div className="grid grid-cols-[45px_1fr] gap-x-12" key={field.label}>
            <dt className="whitespace-nowrap text-[#8B95A1]">{field.label}</dt>
            <dd className="m-0 whitespace-nowrap text-[#191F28]">
              {field.value}
            </dd>
          </div>
        ))}
      </dl>
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
        수정하기
      </button>
    </main>
  );
}

function BasicInformationPage({
  fields,
  onBack,
  onSave,
}: {
  fields: readonly ProfileField[];
  onBack: () => void;
  onSave: (values: readonly string[]) => void;
}) {
  const [values, setValues] = useState(() =>
    fields.map((field) => field.value),
  );

  return (
    <main className="mx-auto h-[844px] w-full max-w-[390px] bg-[#F5F5F5] px-6 pt-[61px] pb-[37px] font-['Pretendard','Apple_SD_Gothic_Neo','Noto_Sans_KR',sans-serif] tracking-[-0.02em] text-[#191F28]">
      <BackButton onClick={onBack} />
      <h1 className="m-0 mt-[18px] text-[26px] leading-[1.5] font-semibold">
        기본정보
      </h1>
      <section className="mt-[40px] space-y-[10.5px]">
        {fields.map((field, index) => (
          <div key={field.label}>
            <p className="m-0 whitespace-nowrap text-[15px] leading-[1.5]">
              {field.label}
            </p>
            <EditableProfileValue
              field={{ ...field, value: values[index] ?? field.value }}
              onChange={() =>
                setValues((currentValues) =>
                  currentValues.map((value, valueIndex) =>
                    valueIndex === index
                      ? getNextProfileValue('basic', index, value)
                      : value,
                  ),
                )
              }
            />
          </div>
        ))}
      </section>
      <button
        className="mt-[85px] h-[57px] w-full rounded-[15px] border-0 bg-[#00B894] text-[20px] leading-[1.5] font-medium text-[#F5F5F5]"
        type="button"
        onClick={() => onSave(values)}
      >
        수정하기
      </button>
    </main>
  );
}

function ResidenceInformationPage({
  fields,
  onBack,
  onSave,
}: {
  fields: readonly ProfileField[];
  onBack: () => void;
  onSave: (values: readonly string[]) => void;
}) {
  const [values, setValues] = useState(() =>
    fields.map((field) => field.value),
  );

  return (
    <main className="mx-auto h-[844px] w-full max-w-[390px] bg-[#F5F5F5] px-6 pt-[61px] pb-[37px] font-['Pretendard','Apple_SD_Gothic_Neo','Noto_Sans_KR',sans-serif] tracking-[-0.02em] text-[#191F28]">
      <BackButton onClick={onBack} />
      <h1 className="m-0 mt-[18px] text-[26px] leading-[1.5] font-semibold">
        체류정보
      </h1>
      <section className="mt-[40px] space-y-[10.5px]">
        {fields.map((field, index) => (
          <div key={field.label}>
            <p className="m-0 whitespace-nowrap text-[15px] leading-[1.5]">
              {field.label}
            </p>
            <EditableProfileValue
              field={{ ...field, value: values[index] ?? field.value }}
              onChange={() =>
                setValues((currentValues) =>
                  currentValues.map((value, valueIndex) =>
                    valueIndex === index
                      ? getNextProfileValue('residence', index, value)
                      : value,
                  ),
                )
              }
            />
          </div>
        ))}
      </section>
      <button
        className="mt-[279.5px] h-[57px] w-full rounded-[15px] border-0 bg-[#00B894] text-[20px] leading-[1.5] font-medium text-[#F5F5F5]"
        type="button"
        onClick={() => onSave(values)}
      >
        수정하기
      </button>
    </main>
  );
}

function AcademicInformationPage({
  fields,
  onBack,
  onSave,
}: {
  fields: readonly ProfileField[];
  onBack: () => void;
  onSave: (values: readonly string[]) => void;
}) {
  const [values, setValues] = useState(() =>
    fields.map((field) => field.value),
  );

  return (
    <main className="mx-auto h-[844px] w-full max-w-[390px] bg-[#F5F5F5] px-6 pt-[61px] pb-[37px] font-['Pretendard','Apple_SD_Gothic_Neo','Noto_Sans_KR',sans-serif] tracking-[-0.02em] text-[#191F28]">
      <BackButton onClick={onBack} />
      <h1 className="m-0 mt-[18px] text-[26px] leading-[1.5] font-semibold">
        학업정보
      </h1>
      <section className="mt-[40px] space-y-[10.5px]">
        {fields.map((field, index) => (
          <div key={field.label}>
            <p className="m-0 whitespace-nowrap text-[15px] leading-[1.5]">
              {field.label}
            </p>
            <EditableProfileValue
              field={{ ...field, value: values[index] ?? field.value }}
              onChange={() =>
                setValues((currentValues) =>
                  currentValues.map((value, valueIndex) =>
                    valueIndex === index
                      ? getNextProfileValue('academic', index, value)
                      : value,
                  ),
                )
              }
            />
          </div>
        ))}
      </section>
      <button
        className="mt-[279.5px] h-[57px] w-full rounded-[15px] border-0 bg-[#00B894] text-[20px] leading-[1.5] font-medium text-[#F5F5F5]"
        type="button"
        onClick={() => onSave(values)}
      >
        수정하기
      </button>
    </main>
  );
}

function LanguageInformationPage({
  fields,
  onBack,
  onSave,
}: {
  fields: readonly ProfileField[];
  onBack: () => void;
  onSave: (values: readonly string[]) => void;
}) {
  const [values, setValues] = useState(() =>
    fields.map((field) => field.value),
  );
  const [openFieldIndex, setOpenFieldIndex] = useState<number | null>(null);
  const [pendingValue, setPendingValue] = useState<string | null>(null);
  const options =
    openFieldIndex === null
      ? undefined
      : SELECTABLE_FIELD_VALUES.language[openFieldIndex];

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
    <main className="relative mx-auto h-[844px] w-full max-w-[390px] bg-[#F5F5F5] px-6 pt-[61px] pb-[37px] font-['Pretendard','Apple_SD_Gothic_Neo','Noto_Sans_KR',sans-serif] tracking-[-0.02em] text-[#191F28]">
      <BackButton onClick={onBack} />
      <h1 className="m-0 mt-[18px] text-[26px] leading-[1.5] font-semibold">
        어학정보
      </h1>
      <section className="mt-[40px] space-y-[10.5px]">
        {fields.map((field, index) => (
          <div key={field.label}>
            <p className="m-0 whitespace-nowrap text-[15px] leading-[1.5]">
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
        className="mt-[279.5px] h-[57px] w-full rounded-[15px] border-0 bg-[#00B894] text-[20px] leading-[1.5] font-medium text-[#F5F5F5]"
        type="button"
        onClick={() => onSave(values)}
      >
        수정하기
      </button>
      {openFieldIndex !== null && options && pendingValue !== null ? (
        <OnboardingBottomSheet
          title={fields[openFieldIndex]?.label ?? ''}
          options={options.map((value) => ({ label: value, value }))}
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
  initialView = 'main',
  onApply,
  onBack,
  onSave,
  onViewChange,
  profileValues,
}: StudentProfileManagementPageProps) {
  const [view, setView] = useState<ProfileManagementView>(initialView);
  const [localProfileValues, setLocalProfileValues] =
    useState<StudentProfileValues>({});
  const resolvedProfileValues = profileValues ?? localProfileValues;

  const handleSave = (
    profileView: ProfileDetailView,
    values: readonly string[],
  ) => {
    if (onSave) {
      onSave(profileView, values);
    } else {
      setLocalProfileValues((currentValues) => ({
        ...currentValues,
        [profileView]: values,
      }));
    }

    handleDetailBack();
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
        fields={getDetailFields('basic', resolvedProfileValues)}
        onBack={handleDetailBack}
        onSave={(values) => handleSave('basic', values)}
      />
    );
  }

  if (view === 'residence') {
    return (
      <ResidenceInformationPage
        fields={getDetailFields('residence', resolvedProfileValues)}
        onBack={handleDetailBack}
        onSave={(values) => handleSave('residence', values)}
      />
    );
  }

  if (view === 'academic') {
    return (
      <AcademicInformationPage
        fields={getDetailFields('academic', resolvedProfileValues)}
        onBack={handleDetailBack}
        onSave={(values) => handleSave('academic', values)}
      />
    );
  }

  if (view === 'language') {
    return (
      <LanguageInformationPage
        fields={getDetailFields('language', resolvedProfileValues)}
        onBack={handleDetailBack}
        onSave={(values) => handleSave('language', values)}
      />
    );
  }

  if (view !== 'main') {
    return (
      <DetailPage
        fields={DETAIL_FIELDS[view]}
        title={DETAIL_TITLES[view]}
        onBack={handleDetailBack}
      />
    );
  }

  return (
    <main className="mx-auto h-[954px] w-full max-w-[390px] bg-[#F5F5F5] px-6 pt-[61px] pb-[29px] font-['Pretendard','Apple_SD_Gothic_Neo','Noto_Sans_KR',sans-serif] tracking-[-0.02em] text-[#191F28]">
      <BackButton onClick={onBack ?? (() => undefined)} />
      <h1 className="m-0 mt-[18px] text-[26px] leading-[1.5] font-semibold">
        내 정보 관리
      </h1>
      <section className="mt-[27px] space-y-[10px]">
        {getProfileCards(resolvedProfileValues).map((card) => (
          <ProfileCard
            card={card}
            key={card.view}
            onClick={() => handleProfileCardClick(card.view)}
          />
        ))}
      </section>
      <button
        className="relative left-[-2px] mt-[60px] h-[57px] w-full rounded-[15px] border-0 bg-[#00B894] text-[20px] leading-[1.5] font-medium text-[#F5F5F5]"
        type="button"
        onClick={onApply}
      >
        수정 반영하기
      </button>
    </main>
  );
}
