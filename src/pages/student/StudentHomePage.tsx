import { useNavigate } from 'react-router-dom';

import matchingIllustration from '../../assets/images/student/home/matching-illustration.png';
import chevronRightIcon from '../../assets/icons/student/home/chevron-right.svg';
import { StudentBottomNavigation } from '../../components/student/navigation/StudentBottomNavigation';
import { STUDENT_HOME_MOCK } from '../../mocks/studentHome';
import type { StudentNavigationTab } from '../../types/studentHome';

type SummaryCardProps = {
  label: string;
  value: number;
};

function SummaryCard({ label, value }: SummaryCardProps) {
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center justify-center rounded-[10px] bg-[#E5E8EB] px-2.5 py-[13px]">
      <strong className="text-[22px] leading-[1.5] font-semibold text-[#191F28]">
        {value}
      </strong>
      <span className="mt-[5px] whitespace-nowrap text-[15px] leading-[1.5] text-[#6B7684]">
        {label}
      </span>
    </div>
  );
}

export default function StudentHomePage() {
  const navigate = useNavigate();
  const { applications, conditions, greetingName, recommendedJobCount } =
    STUDENT_HOME_MOCK;

  const handleTabChange = (tab: StudentNavigationTab) => {
    const routes: Record<StudentNavigationTab, string> = {
      applications: '/student/applications',
      home: '/student/home',
      matching: '/student/matching',
      my: '/student/my',
    };

    navigate(routes[tab]);
  };

  return (
    <main className="relative mx-auto min-h-[100svh] w-full max-w-[430px] overflow-hidden bg-[#F5F5F5] px-6 pt-[68px] pb-[152px] font-['Pretendard','Apple_SD_Gothic_Neo','Noto_Sans_KR',sans-serif] tracking-[-0.02em] text-[#191F28]">
      <h1 className="m-0 text-[26px] leading-[1.5] font-semibold">
        {'\uC548\uB155\uD558\uC138\uC694, '}
        {greetingName}
        {'\uB2D8!'}
      </h1>
      <p className="mt-[3px] text-[15px] leading-[1.5] text-[#B0B8C1]">
        {
          '\uC624\uB298\uB3C4 \uC88B\uC740 \uC77C\uC790\uB9AC\uB97C \uCC3E\uC544\uBCFC\uAE4C\uC694?'
        }
      </p>

      <section className="relative mt-[21px] h-[230px] overflow-hidden rounded-[20px] bg-white">
        <p className="absolute top-7 left-6 text-[13px] leading-[1.5] font-bold text-[#00B894]">
          {'\uB098\uC758 \uC77C\uC790\uB9AC \uCC3E\uAE30'}
        </p>
        <h2 className="absolute top-[51px] left-6 m-0 w-[195px] text-[20px] leading-[1.5] font-semibold text-[#191F28]">
          {'\uB098\uC5D0\uAC8C \uB9DE\uB294 \uC77C\uC790\uB9AC'}
          <br />
          {recommendedJobCount}
          {'\uACF3\uC744 \uCD94\uCC9C\uD574\uB4DC\uB824\uC694!'}
        </h2>
        <img
          alt=""
          className="absolute top-[42px] right-[31px] h-[122px] w-[107px] object-contain"
          src={matchingIllustration}
        />
        <button
          className="absolute right-6 bottom-5 left-6 h-[54px] rounded-[42px] border-0 bg-[#00B894] text-[17px] leading-[1.5] font-medium text-[#F5F5F5]"
          type="button"
          onClick={() => navigate('/student/matching')}
        >
          {'\uB9E4\uCE6D\uD558\uB7EC \uAC00\uAE30'}
        </button>
      </section>

      <section className="mt-[15px]">
        <div className="flex items-center justify-between">
          <h2 className="m-0 text-[20px] leading-[1.5] font-semibold text-black">
            {'\uB0B4 \uC9C0\uC6D0 \uD604\uD669'}
          </h2>
          <button
            className="flex items-center gap-2 border-0 bg-transparent p-0 text-[13px] leading-[1.5] text-[#8B95A1]"
            type="button"
          >
            {'\uC804\uCCB4\uBCF4\uAE30'}
            <img alt="" className="block -scale-x-100" src={chevronRightIcon} />
          </button>
        </div>
        <div className="mt-[12px] flex gap-[9px]">
          <SummaryCard label={'\uC804\uCCB4'} value={applications.total} />
          <SummaryCard
            label={'\uAC80\uD1A0 \uC911'}
            value={applications.reviewing}
          />
          <SummaryCard
            label={'\uCC44\uC6A9 \uC81C\uC548'}
            value={applications.offer}
          />
          <SummaryCard
            label={'\uCC44\uC6A9 \uC644\uB8CC'}
            value={applications.completed}
          />
        </div>
      </section>

      <section className="mt-[17px]">
        <div className="flex items-center justify-between">
          <h2 className="m-0 text-[20px] leading-[1.5] font-semibold text-black">
            {'\uB0B4 \uB9E4\uCE6D \uC870\uAC74'}
          </h2>
          <button
            className="flex items-center gap-2 border-0 bg-transparent p-0 text-[13px] leading-[1.5] text-[#8B95A1]"
            type="button"
          >
            {'\uC218\uC815\uD558\uAE30'}
            <img alt="" className="block -scale-x-100" src={chevronRightIcon} />
          </button>
        </div>
        <dl className="m-0 mt-[12px] space-y-2.5">
          {conditions.map((condition) => (
            <div className="flex items-center gap-[15px]" key={condition.label}>
              <dt className="flex h-8 w-[73px] shrink-0 items-center justify-center rounded-[20px] bg-[#E5E8EB] text-[13px] leading-[1.5] font-medium text-[#191F28]">
                {condition.label}
              </dt>
              <dd className="m-0 text-[13px] leading-[1.5] text-[#191F28]">
                {condition.value}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <StudentBottomNavigation activeTab="home" onTabChange={handleTabChange} />
    </main>
  );
}
