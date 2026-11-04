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
    <main className="relative mx-auto h-[100dvh] max-h-[844px] w-full max-w-[390px] overflow-hidden bg-[#F5F5F5] px-6 pt-[clamp(32px,7.2dvh,61px)] pb-5 font-['Pretendard','Apple_SD_Gothic_Neo','Noto_Sans_KR',sans-serif] tracking-[-0.02em] text-[#191F28]">
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
        className="mx-auto mt-0 h-[clamp(52px,9.7dvh,82px)] w-[clamp(48px,8.5dvh,72px)] object-contain"
        src={guideIllustration}
      />
      <h1 className="m-0 mt-[clamp(4px,1.1dvh,9px)] text-center text-[clamp(18px,2.37dvh,20px)] leading-[1.5] font-semibold">
        서류를 등록하고
        <br />
        HIRELINK 인증을 받아보세요!
      </h1>
      <p className="m-0 mt-[clamp(2px,0.83dvh,7px)] text-center text-[clamp(11px,1.54dvh,13px)] leading-[1.5] text-[#8B95A1]">
        내 정보를 확인하면 더 정확한 매칭과
        <br />
        빠른 채용 기회를 얻을 수 있어요.
      </p>

      <section
        aria-label="서류 등록 안내"
        className="mt-[clamp(10px,2.84dvh,24px)] space-y-[clamp(6px,1.18dvh,10px)]"
      >
        {STUDENT_DOCUMENT_GUIDE_ITEMS.map((item) => (
          <article
            className="flex h-[clamp(54px,8.9dvh,75px)] items-center rounded-[20px] bg-[#E5E8EB] px-[clamp(18px,3dvh,25px)]"
            key={item.title}
          >
            <img
              alt=""
              className="h-[clamp(30px,5dvh,42px)] w-[clamp(31px,5.1dvh,43px)] shrink-0 object-contain"
              src={item.icon}
            />
            <div className="ml-[clamp(11px,2dvh,17px)] min-w-0">
              <h2 className="m-0 text-[clamp(13px,1.78dvh,15px)] leading-[1.5] font-bold">
                {item.title}
              </h2>
              <p className="m-0 mt-[clamp(0px,0.48dvh,4px)] text-[clamp(10px,1.42dvh,12px)] leading-normal text-[#8B95A1]">
                {item.description}
              </p>
            </div>
          </article>
        ))}
      </section>

      <button
        className="absolute right-6 bottom-[clamp(20px,4.38dvh,37px)] left-6 h-[clamp(52px,6.75dvh,57px)] rounded-[15px] border-0 bg-[#00B894] p-0 text-[clamp(17px,2.37dvh,20px)] leading-[1.5] font-medium text-[#F5F5F5]"
        type="button"
        onClick={onStart}
      >
        인증 시작하기
      </button>
    </main>
  );
}
