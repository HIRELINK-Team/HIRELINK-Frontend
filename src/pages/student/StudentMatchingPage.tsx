import { useState } from 'react';

import backIcon from '../../assets/icons/student/matching/back.svg';
import { RecommendedJobDetail } from '../../components/student/matching/RecommendedJobDetail';
import { RecommendedJobCard } from '../../components/student/matching/RecommendedJobCard';
import { StudentBottomNavigation } from '../../components/student/navigation/StudentBottomNavigation';
import {
  MAX_RECOMMENDED_JOBS,
  STUDENT_RECOMMENDED_JOBS,
} from '../../mocks/studentMatching';
import type { StudentNavigationTab } from '../../types/studentHome';
import type {
  RecommendedJob,
  StudentMatchingView,
} from '../../types/studentMatching';

type StudentMatchingPageProps = {
  initialSelectedJob?: RecommendedJob | null;
  initialView?: StudentMatchingView;
  onBack?: () => void;
  onTabChange?: (tab: StudentNavigationTab) => void;
  onViewChange?: (
    view: Exclude<StudentMatchingView, 'result'>,
    job: RecommendedJob,
  ) => void;
};

export default function StudentMatchingPage({
  initialSelectedJob = null,
  initialView = 'result',
  onBack,
  onTabChange,
  onViewChange,
}: StudentMatchingPageProps) {
  const [matchingView, setMatchingView] =
    useState<StudentMatchingView>(initialView);
  const [selectedJob, setSelectedJob] = useState<RecommendedJob | null>(
    initialSelectedJob,
  );
  const recommendedJobs = STUDENT_RECOMMENDED_JOBS.slice(
    0,
    MAX_RECOMMENDED_JOBS,
  );

  const handleBack = () => {
    onBack?.();
  };

  const handleDetailClick = (job: RecommendedJob) => {
    setSelectedJob(job);
    setMatchingView('detail');
    onViewChange?.('detail', job);
  };

  const handleTabChange = (tab: StudentNavigationTab) => {
    onTabChange?.(tab);
  };

  const handleDetailBack = () => {
    setMatchingView('result');
  };

  const handleApply = (job: RecommendedJob) => {
    onViewChange?.('startDate', job);
  };

  if (matchingView === 'detail' && selectedJob) {
    return (
      <RecommendedJobDetail
        job={selectedJob}
        onApply={handleApply}
        onBack={handleDetailBack}
      />
    );
  }

  return (
    <main
      className="relative mx-auto min-h-[990px] w-full max-w-[430px] bg-[#F5F5F5] font-['Pretendard','Apple_SD_Gothic_Neo','Noto_Sans_KR',sans-serif] tracking-[-0.02em] text-[#191F28]"
      data-matching-view={matchingView}
      data-selected-job-id={selectedJob?.id}
    >
      <button
        aria-label="이전 화면으로 이동"
        className="absolute top-[69px] left-[26px] flex h-[16px] w-[8px] items-center justify-center border-0 bg-transparent p-0"
        type="button"
        onClick={handleBack}
      >
        <img alt="" className="block" src={backIcon} />
      </button>

      <h1 className="absolute top-[112px] left-6 m-0 text-[26px] leading-[1.5] font-semibold">
        지금 조건에 딱 맞는
        <br />
        일자리를 추천해드려요.
      </h1>

      <p className="absolute top-[198px] left-6 text-[15px] leading-[1.5] text-[#B0B8C1]">
        지원하면 24시간 타이머가 시작돼요.
      </p>

      <section
        aria-label="추천 근무지 목록"
        className="absolute top-[248px] left-6 w-[342px] space-y-2.5"
      >
        {recommendedJobs.map((job) => (
          <RecommendedJobCard
            job={job}
            key={job.id}
            onDetailClick={handleDetailClick}
          />
        ))}
      </section>

      <StudentBottomNavigation
        activeBackgroundClassName="bg-[#E5E8EB]/90"
        activeTab="matching"
        bottomOffsetClassName="bottom-[31px]"
        onTabChange={handleTabChange}
      />
    </main>
  );
}
