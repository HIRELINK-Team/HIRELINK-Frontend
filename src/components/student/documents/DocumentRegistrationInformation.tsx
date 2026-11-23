import backIcon from '../../../assets/icons/student/documents/back.svg';

type GuideItem = {
  icon: string;
  label: string;
};

type DocumentRegistrationInformationProps = {
  title: string;
  illustration: string;
  heading: readonly [string, string];
  description: string;
  guideItems: readonly GuideItem[];
  compactGuidePosition?: boolean;
  onBack: () => void;
  onRegister: () => void;
};

export function DocumentRegistrationInformation({
  title,
  illustration,
  heading,
  description,
  guideItems,
  compactGuidePosition = false,
  onBack,
  onRegister,
}: DocumentRegistrationInformationProps) {
  return (
    <main className="relative mx-auto h-[min(844px,100dvh)] w-full max-w-[390px] overflow-hidden bg-[#F5F5F5] font-['Pretendard','Apple_SD_Gothic_Neo','Noto_Sans_KR',sans-serif] tracking-[-0.02em] text-[#191F28]">
      <button
        aria-label="뒤로가기"
        className="absolute top-[61px] left-4 grid size-8 place-items-center border-0 bg-transparent p-0"
        type="button"
        onClick={onBack}
      >
        <img alt="" src={backIcon} />
      </button>
      <h1 className="absolute top-[112px] left-6 m-0 text-[26px] leading-[1.5] font-semibold">
        {title}
      </h1>
      <img
        alt=""
        className="student-3d-illustration absolute top-[196px] left-1/2 h-[81px] w-[83px] -translate-x-1/2 object-contain"
        src={illustration}
      />
      <h2 className="absolute top-[286px] right-6 left-6 m-0 text-center text-[22px] leading-[1.5] font-semibold">
        {heading[0]}
        <br />
        {heading[1]}
      </h2>
      <p className="absolute top-[360px] right-6 left-6 m-0 text-center text-[13px] leading-[1.5] text-[#8B95A1]">
        {description}
      </p>
      <section
        aria-label={`${title} 확인 항목`}
        className={`absolute right-6 left-6 space-y-2.5 ${
          compactGuidePosition ? 'top-[424px]' : 'top-[445px]'
        }`}
      >
        {guideItems.map((item) => (
          <article
            className="flex h-[65px] items-center rounded-[20px] bg-[#E6E8E9] px-[25px]"
            key={item.label}
          >
            <img
              alt=""
              className="h-[47px] w-[48px] shrink-0 object-contain"
              src={item.icon}
            />
            <p className="m-0 ml-[23px] text-[15px] leading-[1.5] font-medium">
              {item.label}
            </p>
          </article>
        ))}
      </section>
      <button
        className="absolute right-6 bottom-[37px] left-6 h-[57px] rounded-[15px] border-0 bg-[#00B894] p-0 text-[20px] leading-[1.5] font-medium text-[#F5F5F5]"
        type="button"
        onClick={onRegister}
      >
        등록하기
      </button>
    </main>
  );
}
