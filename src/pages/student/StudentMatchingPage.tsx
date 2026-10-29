import backIcon from '../../assets/icons/student/back.svg';
import { RecommendedJobCard } from '../../components/student/matching/RecommendedJobCard';
import { StudentBottomNavigation } from '../../components/student/navigation/StudentBottomNavigation';
import {
  MAX_RECOMMENDED_JOBS,
  STUDENT_RECOMMENDED_JOBS,
} from '../../mocks/studentMatching';
import type { StudentNavigationTab } from '../../types/studentHome';
import type { RecommendedJob } from '../../types/studentMatching';

type StudentMatchingPageProps = {
  onBack?: () => void;
  onJobDetail?: (job: RecommendedJob) => void;
  onTabChange?: (tab: StudentNavigationTab) => void;
};

export default function StudentMatchingPage({
  onBack,
  onJobDetail,
  onTabChange,
}: StudentMatchingPageProps) {
  const recommendedJobs = STUDENT_RECOMMENDED_JOBS.slice(
    0,
    MAX_RECOMMENDED_JOBS,
  );

  const handleBack = () => {
    onBack?.();
  };

  const handleDetailClick = (job: RecommendedJob) => {
    onJobDetail?.(job);
  };

  const handleTabChange = (tab: StudentNavigationTab) => {
    onTabChange?.(tab);
  };

  return (
    <main className="relative mx-auto min-h-[100svh] w-full max-w-[430px] bg-[#F5F5F5] px-6 pt-[67px] pb-[136px] font-['Pretendard','Apple_SD_Gothic_Neo','Noto_Sans_KR',sans-serif] tracking-[-0.02em] text-[#191F28]">
      <button
        aria-label="이전 화면으로 이동"
        className="flex h-[19px] w-[11px] items-center justify-center border-0 bg-transparent p-0"
        type="button"
        onClick={handleBack}
      >
        <img alt="" className="block" src={backIcon} />
      </button>

      <h1 className="mt-[29px] text-[26px] leading-[1.5] font-semibold">
        지금 조건에 딱 맞는
        <br />
        일자리를 추천해드려요.
      </h1>

      <section aria-label="추천 근무지 목록" className="mt-[30px] space-y-2.5">
        {recommendedJobs.map((job) => (
          <RecommendedJobCard
            job={job}
            key={job.id}
            onDetailClick={handleDetailClick}
          />
        ))}
      </section>

      <StudentBottomNavigation
        activeTab="matching"
        isFixed
        onTabChange={handleTabChange}
      />
    </main>
  );
}
