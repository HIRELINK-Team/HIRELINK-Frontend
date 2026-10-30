import { useState } from 'react';

import backIcon from '../../assets/icons/student/documents/back.svg';
import dropdownChevronIcon from '../../assets/icons/student/profile/dropdown-chevron.svg';

type ProfileManagementView =
  'main' | 'basic' | 'residence' | 'academic' | 'language';

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
  onBack?: () => void;
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
    <main className="mx-auto flex h-[100dvh] w-full max-w-[430px] flex-col bg-[#F5F5F5] px-6 pt-[61px] font-['Pretendard','Apple_SD_Gothic_Neo','Noto_Sans_KR',sans-serif] tracking-[-0.02em] text-[#191F28]">
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
      >
        수정하기
      </button>
    </main>
  );
}

function BasicInformationPage({
  fields,
  onBack,
}: {
  fields: readonly ProfileField[];
  onBack: () => void;
}) {
  return (
    <main className="mx-auto h-[844px] w-full max-w-[430px] bg-[#F5F5F5] px-6 pt-[61px] pb-[37px] font-['Pretendard','Apple_SD_Gothic_Neo','Noto_Sans_KR',sans-serif] tracking-[-0.02em] text-[#191F28]">
      <BackButton onClick={onBack} />
      <h1 className="m-0 mt-[18px] text-[26px] leading-[1.5] font-semibold">
        기본정보
      </h1>
      <section className="mt-[40px] space-y-[10.5px]">
        {fields.map((field) => (
          <div key={field.label}>
            <p className="m-0 whitespace-nowrap text-[15px] leading-[1.5]">
              {field.label}
            </p>
            <div className="mt-2 flex h-14 items-center rounded-[15px] bg-[#E5E8EB] px-[25px] text-[17px] leading-[1.5]">
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
            </div>
          </div>
        ))}
      </section>
      <button
        className="mt-[85px] h-[57px] w-full rounded-[15px] border-0 bg-[#00B894] text-[20px] leading-[1.5] font-medium text-[#F5F5F5]"
        type="button"
      >
        수정하기
      </button>
    </main>
  );
}

export default function StudentProfileManagementPage({
  onBack,
}: StudentProfileManagementPageProps) {
  const [view, setView] = useState<ProfileManagementView>('main');

  if (view === 'basic') {
    return (
      <BasicInformationPage
        fields={DETAIL_FIELDS.basic}
        onBack={() => setView('main')}
      />
    );
  }

  if (view !== 'main') {
    return (
      <DetailPage
        fields={DETAIL_FIELDS[view]}
        title={DETAIL_TITLES[view]}
        onBack={() => setView('main')}
      />
    );
  }

  return (
    <main className="mx-auto min-h-[954px] w-full max-w-[430px] bg-[#F5F5F5] px-6 pt-[61px] pb-[29px] font-['Pretendard','Apple_SD_Gothic_Neo','Noto_Sans_KR',sans-serif] tracking-[-0.02em] text-[#191F28]">
      <BackButton onClick={onBack ?? (() => undefined)} />
      <h1 className="m-0 mt-[18px] text-[26px] leading-[1.5] font-semibold">
        내 정보 관리
      </h1>
      <section className="mt-[27px] space-y-[10px]">
        {PROFILE_CARDS.map((card) => (
          <ProfileCard
            card={card}
            key={card.view}
            onClick={() => setView(card.view)}
          />
        ))}
      </section>
      <button
        className="relative left-[-2px] mt-[60px] h-[57px] w-full rounded-[15px] border-0 bg-[#00B894] text-[20px] leading-[1.5] font-medium text-[#F5F5F5]"
        type="button"
      >
        수정 반영하기
      </button>
    </main>
  );
}
