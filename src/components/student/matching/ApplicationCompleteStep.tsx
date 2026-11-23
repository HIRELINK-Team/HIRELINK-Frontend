import backIcon from '../../../assets/icons/student/matching/back.svg';
import completeIllustration from '../../../assets/images/student/matching/application-complete-illustration.png';
import type { RecommendedJob } from '../../../types/studentMatching';
import { formatMatchingSummary } from '../../../utils/studentMatchingDisplay';

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
  const matchDescription = formatMatchingSummary(
    job.detail.comparisonTags,
    job.matchDescription || '지원 정보가 접수되었어요.',
  );

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
          className="student-3d-illustration absolute top-[0.04%] left-[0.25%] h-[99.84%] w-[99.52%] max-w-none"
          src={completeIllustration}
        />
      </div>

      <h1 className="absolute top-[clamp(310px,45dvh,380px)] left-0 m-0 w-full text-center text-[22px] leading-[1.5] font-semibold">
        지원이 완료되었어요!
      </h1>

      <section className="absolute top-[clamp(387px,56.1dvh,473px)] right-6 left-6 h-[clamp(108px,15.6dvh,132px)] overflow-hidden rounded-[20px] bg-white shadow-[1px_1px_20px_rgba(0,0,0,0.04)]">
        <h2 className="absolute top-[21px] right-[95px] left-[24px] m-0 truncate text-[20px] leading-[1.5] font-semibold">
          {companyName}
        </h2>
        <p className="absolute top-[58px] right-[23px] left-[24px] m-0 truncate text-[15px] leading-[1.5]">
          <span className="font-semibold text-[#009376]">
            {job.matchRate}%{' '}
          </span>
          <span className="text-[#909597]">일치</span>
        </p>
        <p className="absolute top-[88px] right-[105px] left-[24px] m-0 truncate text-[15px] leading-[1.5] text-[#909597]">
          {matchDescription}
        </p>
        <span className="absolute top-[25px] right-[27px] flex size-[26px] items-center justify-center rounded-full bg-[#E2F8F3] text-[16px] font-semibold text-[#00B894]">
          ✓
        </span>
        <button
          className="absolute right-[27px] bottom-[21px] flex h-[27px] items-center justify-center rounded-[30px] border-[0.7px] border-[#D3D6D7] bg-white px-[13.636px] py-0 text-[#55595B]"
          type="button"
          onClick={onDetail}
        >
          <span className="text-[13px] leading-[1.5]">상세보기</span>
        </button>
      </section>

      <button
        className="absolute top-[clamp(517px,75dvh,633px)] right-6 left-6 h-[clamp(49px,6.75dvh,57px)] rounded-[15px] border-0 bg-[#B8EBDD] text-[#006E59]"
        type="button"
        onClick={onHome}
      >
        <span className="text-[20px] leading-[1.5] font-medium">
          홈으로 돌아가기
        </span>
      </button>
    </main>
  );
}
