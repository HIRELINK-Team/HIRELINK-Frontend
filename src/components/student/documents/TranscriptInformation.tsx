import backIcon from '../../../assets/icons/student/documents/back.svg';
import issuedDateIcon from '../../../assets/images/student/documents/transcript/guide-issued-date.png';
import illustration from '../../../assets/images/student/documents/transcript/guide-illustration.png';
import scoreIcon from '../../../assets/images/student/documents/transcript/guide-score.png';
import semesterIcon from '../../../assets/images/student/documents/transcript/guide-semester.png';

type TranscriptInformationProps = {
  onBack: () => void;
  onRegister: () => void;
};

const GUIDE_ITEMS = [
  { icon: scoreIcon, label: '성적 확인' },
  { icon: semesterIcon, label: '직전 · 이수학기 확인' },
  { icon: issuedDateIcon, label: '발급일 확인' },
] as const;

export function TranscriptInformation({
  onBack,
  onRegister,
}: TranscriptInformationProps) {
  return (
    <main className="relative mx-auto h-[min(844px,100dvh)] w-full max-w-[390px] overflow-hidden bg-[#F5F5F5] px-6 pt-[61px] pb-[37px] font-['Pretendard','Apple_SD_Gothic_Neo','Noto_Sans_KR',sans-serif] tracking-[-0.02em] text-[#191F28]">
      <button
        aria-label="뒤로가기"
        className="grid size-8 -ml-2 place-items-center border-0 bg-transparent p-0"
        type="button"
        onClick={onBack}
      >
        <img alt="" src={backIcon} />
      </button>
      <h1 className="m-0 mt-[19px] text-[26px] leading-[1.5] font-semibold">
        성적증명서 등록
      </h1>
      <img
        alt=""
        className="mx-auto mt-5 h-[60px] w-[62px] object-contain"
        src={illustration}
      />
      <h2 className="m-0 mt-[6px] text-center text-[20px] leading-[1.5] font-semibold">
        본인의 성적증명서를
        <br />
        등록해주세요.
      </h2>
      <p className="m-0 mt-[6px] text-center text-[13px] leading-[1.5] text-[#8B95A1]">
        성적과 이수학기, 발급일을
        <br />
        확인하기 위해 필요해요.
      </p>
      <section
        aria-label="성적증명서 확인 항목"
        className="mt-[14px] space-y-2"
      >
        {GUIDE_ITEMS.map((item) => (
          <article
            className="flex h-14 items-center rounded-[20px] bg-[#E5E8EB] px-[25px]"
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
