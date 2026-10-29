import backIcon from '../../../assets/icons/student/matching/back.svg';
import checklistImage from '../../../assets/images/student/matching/application-checklist.png';
import experienceImage from '../../../assets/images/student/matching/application-experience.png';
import profileImage from '../../../assets/images/student/matching/application-profile.png';
import type { RecommendedJob } from '../../../types/studentMatching';

type ApplicationConfirmationStepProps = {
  job: RecommendedJob;
  workStartDate: string;
  onBack: () => void;
  onConfirm: () => void;
};

type InformationCardProps = {
  description: string;
  image: string;
  title: string;
};

function formatWorkStartDate(date: string) {
  return date.replaceAll('-', '.');
}

function InformationCard({ description, image, title }: InformationCardProps) {
  return (
    <article className="relative h-[83px] rounded-[20px] border border-[#D9D9D9]">
      <img
        alt=""
        className="absolute top-[15px] left-[23px] h-[52px] w-[53px] object-cover"
        src={image}
      />
      <h3 className="absolute top-[17px] left-24 m-0 text-[15px] leading-[1.5] font-bold">
        {title}
      </h3>
      <p className="absolute top-[44px] left-24 m-0 text-[13px] leading-[1.5] text-[#8B95A1]">
        {description}
      </p>
    </article>
  );
}

/** Final local review step before sending a student application. */
export function ApplicationConfirmationStep({
  job,
  workStartDate,
  onBack,
  onConfirm,
}: ApplicationConfirmationStepProps) {
  return (
    <main className="relative mx-auto min-h-[844px] w-full max-w-[430px] overflow-hidden bg-[#F5F5F5] font-['Pretendard','Apple_SD_Gothic_Neo','Noto_Sans_KR',sans-serif] tracking-[-0.02em] text-[#191F28]">
      <button
        aria-label="근무 시작일 선택으로 돌아가기"
        className="absolute top-[69px] left-[26px] flex h-[19px] w-[11px] items-center justify-center border-0 bg-transparent p-0"
        type="button"
        onClick={onBack}
      >
        <img alt="" src={backIcon} />
      </button>

      <h1 className="absolute top-[112px] left-6 m-0 text-[26px] leading-[1.5] font-semibold">
        지원 전 꼭 확인해주세요!
      </h1>

      <section className="absolute top-[174px] right-6 left-6 h-[132px] rounded-[20px] border-[0.7px] border-[#B0B8C1]">
        <h2 className="absolute top-[20px] left-[23px] m-0 text-[20px] leading-[1.5] font-semibold">
          김숭실
        </h2>
        <p className="absolute top-[57px] left-[23px] m-0 text-[15px] leading-[1.5] text-[#8B95A1]">
          베트남 | 22세 | D-2 (유학) | TOPIK 4급 | 학기 중
        </p>
        <p className="absolute top-[87px] left-[23px] m-0 text-[15px] leading-[1.5] text-[#8B95A1]">
          {job.companyName} | {formatWorkStartDate(workStartDate)}부터
        </p>
      </section>

      <section className="absolute top-[333px] right-6 left-6">
        <h2 className="m-0 text-[20px] leading-[1.5] font-semibold">
          사업주에게 전달되는 정보
        </h2>
        <div className="mt-[16px] space-y-[10px]">
          <InformationCard
            description="국적, 지역 한국어 수준이에요."
            image={profileImage}
            title="기본 프로필"
          />
          <InformationCard
            description="카페 8개월 외 1건이에요."
            image={experienceImage}
            title="경력"
          />
          <InformationCard
            description="시간, 급여, 직종 내용이에요."
            image={checklistImage}
            title="구직조건"
          />
        </div>
      </section>

      <div className="absolute top-[678px] right-6 left-6 text-center text-[13px] leading-[1.5] text-[#8B95A1]">
        <p className="m-0">
          지원 후 사업주는 24시간 안에 채용 진행 여부를 결정해야 해요.
        </p>
        <p className="mt-[2px] mb-0">
          사업주가 응답하지 않으면{' '}
          <span className="font-medium text-[#006E59]">
            24시간 후 지원이 자동 종료 돼요.
          </span>
        </p>
      </div>

      <button
        className="absolute right-6 bottom-[37px] left-6 h-[57px] rounded-[15px] border-0 bg-[#00B894] text-[20px] leading-[1.5] font-medium text-[#F5F5F5] active:bg-[#009376]"
        type="button"
        onClick={onConfirm}
      >
        동의하고 지원할래요
      </button>
    </main>
  );
}
