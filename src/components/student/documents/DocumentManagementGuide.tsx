import backIcon from '../../../assets/icons/student/documents/back.svg';
import guideIllustration from '../../../assets/images/student/documents/guide-illustration.png';
import { STUDENT_DOCUMENT_GUIDE_ITEMS } from '../../../mocks/studentDocuments';

type DocumentManagementGuideProps = {
  onBack: () => void;
  onStart: () => void;
};

export function DocumentManagementGuide({
  onBack,
  onStart,
}: DocumentManagementGuideProps) {
  return (
    <main className="relative mx-auto h-[844px] w-full max-w-[390px] bg-[#F5F5F5] px-6 pt-[61px] pb-[37px] font-['Pretendard','Apple_SD_Gothic_Neo','Noto_Sans_KR',sans-serif] tracking-[-0.02em] text-[#191F28]">
      <button
        aria-label="뒤로가기"
        className="grid size-8 -ml-2 place-items-center border-0 bg-transparent p-0"
        type="button"
        onClick={onBack}
      >
        <img alt="" src={backIcon} />
      </button>

      <img
        alt=""
        className="mx-auto mt-[4px] h-[97px] w-[85px] object-contain"
        src={guideIllustration}
      />
      <h1 className="m-0 mt-[13px] text-center text-[20px] leading-[1.5] font-semibold">
        서류를 등록하고
        <br />
        HIRELINK 인증을 받아보세요!
      </h1>
      <p className="m-0 mt-[7px] text-center text-[13px] leading-[1.5] text-[#8B95A1]">
        내 정보를 확인하면 더 정확한 매칭과
        <br />
        빠른 채용 기회를 얻을 수 있어요.
      </p>

      <section aria-label="서류 등록 안내" className="mt-[33px] space-y-[13px]">
        {STUDENT_DOCUMENT_GUIDE_ITEMS.map((item) => (
          <article
            className="flex h-[83px] items-center rounded-[20px] bg-[#E5E8EB] px-[25px]"
            key={item.title}
          >
            <img
              alt=""
              className="h-[47px] w-[48px] shrink-0 object-contain"
              src={item.icon}
            />
            <div className="ml-[17px] min-w-0">
              <h2 className="m-0 text-[15px] leading-[1.5] font-bold">
                {item.title}
              </h2>
              <p className="m-0 mt-1 text-[12px] leading-normal text-[#8B95A1]">
                {item.description}
              </p>
            </div>
          </article>
        ))}
      </section>

      <button
        className="absolute right-6 bottom-[37px] left-6 h-[57px] rounded-[15px] border-0 bg-[#00B894] p-0 text-[20px] leading-[1.5] font-medium text-[#F5F5F5]"
        type="button"
        onClick={onStart}
      >
        인증 시작하기
      </button>
    </main>
  );
}
