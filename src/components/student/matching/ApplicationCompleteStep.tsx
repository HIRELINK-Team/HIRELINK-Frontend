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
  const companyName = job.companyName || '근무지 정보';
  const commuteAndWage = job.commuteAndWage || '근무 조건 정보';
  const matchDescription = job.matchDescription || '지원 정보가 접수되었어요.';

  return (
    <main className="relative mx-auto h-[min(844px,100dvh)] w-full max-w-[390px] overflow-hidden bg-[#F5F5F5] font-['Pretendard','Apple_SD_Gothic_Neo','Noto_Sans_KR',sans-serif] tracking-[-0.02em] text-[#191F28]">
      <button
        aria-label="지원 전 확인으로 돌아가기"
        className="absolute top-[clamp(44px,8.2dvh,69px)] left-[26px] flex h-[19px] w-[11px] items-center justify-center border-0 bg-transparent p-0"
        type="button"
        onClick={onBack}
      >
        <img alt="" src={backIcon} />
      </button>

      <div className="absolute top-[clamp(178px,25.8dvh,218px)] left-1/2 h-[clamp(102px,14.6dvh,123px)] w-[clamp(100px,14.3dvh,121px)] -translate-x-1/2 pointer-events-none">
        <img
          alt=""
          className="absolute top-[0.04%] left-[0.25%] h-[99.84%] w-[99.52%] max-w-none"
          src={completeIllustration}
        />
      </div>

      <h1 className="absolute top-[clamp(310px,45dvh,380px)] left-0 m-0 w-full text-center text-[26px] leading-[1.5] font-semibold">
        지원이 완료되었어요!
      </h1>

      <section className="absolute top-[clamp(387px,56.1dvh,473px)] right-6 left-6 h-[clamp(108px,15.6dvh,132px)] overflow-hidden rounded-[20px] border-[0.7px] border-[#B0B8C1]">
        <h2 className="absolute top-[16px] right-[95px] left-[23px] m-0 truncate text-[17px] leading-[1.5] font-semibold">
          {companyName}
        </h2>
        <p className="absolute top-[45px] right-[23px] left-[23px] m-0 truncate text-[13px] leading-[1.5] text-[#8B95A1]">
          {commuteAndWage}
        </p>
        <p className="absolute top-[68px] right-[23px] left-[23px] m-0 truncate text-[13px] leading-[1.5] text-[#8B95A1]">
          {matchDescription}
        </p>
        <button
          className="absolute top-[16px] right-[23px] h-[22px] rounded-[30px] border-0 bg-[#E5E8EB] px-[11px] text-[11px] leading-[1.5]"
          type="button"
          onClick={onDetail}
        >
          상세보기
        </button>
      </section>

      <button
        className="absolute top-[clamp(517px,75dvh,633px)] right-6 left-6 h-[clamp(49px,6.75dvh,57px)] rounded-[15px] border border-[#191F28] bg-transparent text-[16px] leading-[1.5] font-medium"
        type="button"
        onClick={onHome}
      >
        홈으로 돌아가기
      </button>
    </main>
  );
}
