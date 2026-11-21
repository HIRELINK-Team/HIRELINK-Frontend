import airplaneImage from '../../assets/images/student/home/figma/airplane.png';
import cloudImage from '../../assets/images/student/home/figma/cloud.png';
import ellipseShadowLeft from '../../assets/images/student/home/figma/ellipse-shadow-left.svg';
import ellipseShadowRight from '../../assets/images/student/home/figma/ellipse-shadow-right.svg';
import homeBackgroundImage from '../../assets/images/student/home/figma/home-background.png';
import luggageImage from '../../assets/images/student/home/figma/luggage.png';
import travelerImage from '../../assets/images/student/home/figma/traveler.png';
import { StudentBottomNavigation } from '../../components/student/navigation/StudentBottomNavigation';
import { STUDENT_HOME_MOCK } from '../../mocks/studentHome';
import type {
  StudentHomeSummary,
  StudentNavigationTab,
} from '../../types/studentHome';

type ApplicationStatusItemProps = {
  className: string;
  label: string;
  value: number;
};

function ApplicationStatusItem({
  className,
  label,
  value,
}: ApplicationStatusItemProps) {
  return (
    <div
      className={`absolute top-[45px] flex h-[47px] w-[37px] flex-col items-center gap-[3px] text-center ${className}`}
    >
      <span className="whitespace-nowrap text-[13px] leading-[1.5] font-normal text-[#707577]">
        {label}
      </span>
      <p className="m-0 leading-[1.5] whitespace-nowrap">
        <strong className="text-[20px] font-bold text-[#707577]">
          {value}
        </strong>
        <span className="ml-[2px] text-[13px] font-normal text-[#909597]">
          곳
        </span>
      </p>
    </div>
  );
}

type StudentHomePageProps = {
  homeSummary?: StudentHomeSummary;
  isBottomNavigationFixed?: boolean;
  onMatchingClick?: () => void;
  onTabChange?: (tab: StudentNavigationTab) => void;
};

export default function StudentHomePage({
  homeSummary = STUDENT_HOME_MOCK,
  isBottomNavigationFixed = false,
  onMatchingClick,
  onTabChange,
}: StudentHomePageProps) {
  const { applications, greetingName } = homeSummary;

  return (
    <main className="relative mx-auto h-[844px] min-h-[844px] w-full max-w-[390px] overflow-hidden bg-[#F5F5F5] font-['Pretendard','Apple_SD_Gothic_Neo','Noto_Sans_KR',sans-serif] tracking-[-0.02em] text-[#1D1F20]">
      <img
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute top-[-1px] left-0 h-[845px] w-[390px] max-w-none object-cover"
        src={homeBackgroundImage}
      />

      <header className="absolute top-[96px] right-6 left-6 z-30">
        <h1 className="m-0 text-[26px] leading-[1.5] font-semibold">
          안녕하세요, {greetingName}님!
        </h1>
        <p className="mt-[3px] text-[15px] leading-[1.5] font-normal text-[#B3B8B9]">
          오늘도 좋은 일자리를 찾아볼까요?
        </p>
      </header>

      <section
        aria-label="지원 현황"
        className="absolute top-[181px] left-6 z-30 h-[121px] w-[342px] overflow-hidden rounded-[20px] bg-white/10"
      >
        <h2 className="absolute top-[18px] left-6 m-0 text-[17px] leading-[1.5] font-semibold">
          지원현황
        </h2>
        <p className="absolute top-[37px] left-6 m-0 flex h-[84px] items-baseline leading-[1.5]">
          <strong className="text-[50px] font-bold tracking-[0.038em] text-[#00B894]">
            {applications.total}
          </strong>
          <span className="ml-[2px] text-[20px] font-medium tracking-[0.05em] text-[#909597]">
            곳
          </span>
        </p>
        <ApplicationStatusItem
          className="left-[133px]"
          label="검토 중"
          value={applications.reviewing}
        />
        <ApplicationStatusItem
          className="left-[205px]"
          label="채용완료"
          value={applications.completed}
        />
        <ApplicationStatusItem
          className="left-[277px]"
          label="채용제안"
          value={applications.offer}
        />
      </section>

      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <img
          alt=""
          className="absolute top-[211px] left-[353px] z-10 h-8 w-[68px] max-w-none object-cover shadow-[1px_1px_77.4px_rgba(0,184,148,0.28)]"
          src={cloudImage}
        />
        <img
          alt=""
          className="absolute top-[302px] left-[-23px] z-10 h-8 w-[68px] max-w-none object-cover shadow-[1px_1px_77.4px_rgba(0,184,148,0.28)]"
          src={cloudImage}
        />
        <img
          alt=""
          className="absolute top-[308px] left-[239px] z-10 h-[26px] w-14 max-w-none object-cover shadow-[1px_1px_77.4px_rgba(0,184,148,0.28)]"
          src={cloudImage}
        />
        <img
          alt=""
          className="absolute top-[340px] left-[272px] z-10 h-[65px] w-[139px] max-w-none object-cover shadow-[1px_1px_77.4px_rgba(0,184,148,0.28)]"
          src={cloudImage}
        />
        <img
          alt=""
          className="absolute top-[377.45px] left-[-19px] z-20 h-[51px] w-[110px] max-w-none object-cover shadow-[1px_1px_77.4px_rgba(0,184,148,0.28)]"
          src={cloudImage}
        />
        <div className="absolute top-[296px] left-2 z-20 flex h-[142.002px] w-[205.588px] items-center justify-center">
          <img
            alt=""
            className="h-[112.615px] w-[189.791px] max-w-none rotate-[9.37deg] object-cover shadow-[1px_1px_77.4px_rgba(0,184,148,0.28)]"
            src={airplaneImage}
          />
        </div>
        <div className="absolute top-[531.69px] left-10 z-10 flex h-[82.144px] w-[157.263px] items-center justify-center">
          <div className="relative h-[28.625px] w-[157.25px] rotate-[20.61deg]">
            <img
              alt=""
              className="absolute top-[-25px] left-[-25px] block h-[78.6255px] w-[207.25px] max-w-none"
              src={ellipseShadowLeft}
            />
          </div>
        </div>
        <div className="absolute top-[546px] left-[180px] z-10 flex h-[48.635px] w-[93.83px] items-center justify-center">
          <div className="relative h-[23.401px] w-[90.946px] rotate-[16.76deg]">
            <img
              alt=""
              className="absolute top-[-25px] left-[-25px] block h-[73.4012px] w-[140.946px] max-w-none"
              src={ellipseShadowRight}
            />
          </div>
        </div>
        <div className="absolute top-[398px] left-[120.266px] z-20 h-[204.843px] w-[75.868px] overflow-hidden shadow-[1px_1px_77.4px_rgba(0,184,148,0.28)]">
          <img
            alt=""
            className="absolute top-0 left-[-37.07%] h-[99.96%] w-[179.93%] max-w-none"
            src={travelerImage}
          />
        </div>
        <div className="absolute top-[505.64px] left-[209.859px] z-20 h-[93.8px] w-[76.154px] overflow-hidden shadow-[1px_1px_77.4px_rgba(0,184,148,0.28)]">
          <img
            alt=""
            className="absolute top-[0.31%] left-[0.14%] h-[99.66%] w-[99.58%] max-w-none"
            src={luggageImage}
          />
        </div>
      </div>

      <div className="absolute right-0 bottom-0 left-0 z-30 h-[213px] rounded-t-[20px] bg-[#F5F5F5] shadow-[0_-6px_20px_rgba(0,0,0,0.05)]">
        <button
          className="absolute top-[21px] right-6 left-6 h-[57px] rounded-[15px] border-0 bg-[#00B894] text-[20px] leading-[1.5] font-medium text-[#F5F5F5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#009376]"
          type="button"
          onClick={onMatchingClick}
        >
          매칭하러 가기 →
        </button>
        <StudentBottomNavigation
          activeTab="home"
          isFixed={isBottomNavigationFixed}
          onTabChange={onTabChange}
        />
      </div>
    </main>
  );
}
