import backIcon from '../../../assets/icons/student/matching/back.svg';
import completeIllustration from '../../../assets/images/student/matching/application-complete-illustration.png';
import type { RecommendedJob } from '../../../types/studentMatching';

type ApplicationCompleteStepProps = {
  job: RecommendedJob;
  onBack: () => void;
  onDetail: () => void;
  onHome: () => void;
};

/** Local success state displayed after confirming a student application. */
export function ApplicationCompleteStep({
  job,
  onBack,
  onDetail,
  onHome,
}: ApplicationCompleteStepProps) {
  return (
    <main className="relative mx-auto h-[844px] w-full max-w-[390px] overflow-hidden bg-[#F5F5F5] font-['Pretendard','Apple_SD_Gothic_Neo','Noto_Sans_KR',sans-serif] tracking-[-0.02em] text-[#191F28]">
      <button
        aria-label="지원 전 확인으로 돌아가기"
        className="absolute top-[69px] left-[26px] flex h-[19px] w-[11px] items-center justify-center border-0 bg-transparent p-0"
        type="button"
        onClick={onBack}
      >
        <img alt="" src={backIcon} />
      </button>

      <div className="absolute top-[224px] left-1/2 h-[123px] w-[122px] -translate-x-1/2 pointer-events-none">
        <img
          alt=""
          className="absolute top-[0.04%] left-[0.25%] h-[99.84%] w-[99.52%] max-w-none"
          src={completeIllustration}
        />
      </div>

      <h1 className="absolute top-[370px] left-0 m-0 w-full text-center text-[26px] leading-[1.5] font-semibold">
        지원이 완료되었어요!
      </h1>

      <section className="absolute top-[473px] right-6 left-6 h-[132px] rounded-[20px] border-[0.7px] border-[#B0B8C1]">
        <h2 className="absolute top-[20px] left-[23px] m-0 text-[20px] leading-[1.5] font-semibold">
          {job.companyName}
        </h2>
        <p className="absolute top-[57px] left-[23px] m-0 text-[15px] leading-[1.5] text-[#8B95A1]">
          {job.commuteAndWage}
        </p>
        <p className="absolute top-[87px] left-[23px] m-0 text-[15px] leading-[1.5] text-[#8B95A1]">
          {job.matchDescription}
        </p>
        <button
          className="absolute top-[21px] right-[23px] h-[27px] rounded-[30px] border-0 bg-[#E5E8EB] px-[13px] text-[13px] leading-[1.5]"
          type="button"
          onClick={onDetail}
        >
          상세보기
        </button>
      </section>

      <button
        className="absolute top-[628px] right-6 left-6 h-[57px] rounded-[15px] border border-[#191F28] bg-transparent text-[20px] leading-[1.5] font-medium"
        type="button"
        onClick={onHome}
      >
        홈으로 돌아가기
      </button>
    </main>
  );
}
