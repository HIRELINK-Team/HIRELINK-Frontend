import backIcon from '../../assets/icons/student/matching/back.svg';
import hiringCompleteIllustration from '../../assets/images/student/matching/application-complete-illustration.png';
import type { RecommendedJob } from '../../types/studentMatching';

type StudentHiringCompletePageProps = {
  job: RecommendedJob;
  onBack?: () => void;
  onDetailClick?: (job: RecommendedJob) => void;
  onViewApplications?: () => void;
};

/** The completion state shown immediately after a student accepts an offer. */
export default function StudentHiringCompletePage({
  job,
  onBack,
  onDetailClick,
  onViewApplications,
}: StudentHiringCompletePageProps) {
  return (
    <main className="relative mx-auto h-[100dvh] min-h-[697px] w-full max-w-[430px] overflow-hidden bg-[#F5F5F5] font-['Pretendard','Apple_SD_Gothic_Neo','Noto_Sans_KR',sans-serif] tracking-[-0.02em] text-[#191F28]">
      <button
        aria-label="채용 제안으로 돌아가기"
        className="absolute top-[49px] left-[26px] flex h-4 w-2 items-center justify-center border-0 bg-transparent p-0"
        type="button"
        onClick={onBack}
      >
        <img alt="" className="block h-4 w-2" src={backIcon} />
      </button>

      <img
        alt="채용 완료 일러스트"
        className="absolute top-[194px] left-1/2 h-[123px] w-[121px] -translate-x-1/2 object-contain"
        src={hiringCompleteIllustration}
      />

      <section className="absolute top-[340px] right-6 left-6 text-center">
        <h1 className="m-0 text-[26px] leading-[1.5] font-semibold tracking-[-0.02em] text-[#191F28]">
          채용이 완료되었어요!
        </h1>
        <p className="mt-[6px] text-[13px] leading-[1.5] tracking-[-0.02em] text-[#8B95A1]">
          제공된 전화번호로 사장님께
          <br />
          직접 연락을 드려보세요!
        </p>
      </section>

      <article className="absolute top-[455px] right-6 left-6 h-[132px] rounded-[20px] border-[0.7px] border-[#B0B8C1]">
        <h2 className="absolute top-[20px] left-[23px] m-0 text-[20px] leading-[1.5] font-semibold tracking-[-0.02em] text-[#191F28]">
          {job.companyName}
        </h2>
        <p className="absolute top-[57px] left-[23px] m-0 text-[15px] leading-[1.5] tracking-[-0.02em] text-[#8B95A1]">
          채용 연락처
        </p>
        <span className="absolute top-[87px] left-[23px] text-[15px] leading-[1.5] font-medium tracking-[-0.02em] text-[#009376] underline underline-offset-2">
          T. 010-1234-5678
        </span>
        <button
          className="absolute top-[21px] right-[23px] flex h-[27px] items-center justify-center rounded-[30px] border-0 bg-[#E5E8EB] px-[13.636px] text-[13px] leading-[1.5] tracking-[-0.02em] text-[#191F28]"
          type="button"
          onClick={() => onDetailClick?.(job)}
        >
          상세보기
        </button>
      </article>

      <button
        className="absolute top-[610px] right-6 left-6 h-[57px] rounded-[15px] border border-[#191F28] bg-transparent text-[20px] leading-[1.5] font-medium tracking-[-0.02em] text-[#191F28]"
        type="button"
        onClick={onViewApplications}
      >
        지원내역 보기
      </button>
    </main>
  );
}
