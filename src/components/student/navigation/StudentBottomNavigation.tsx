import applicationsActiveIcon from '../../../assets/icons/student/navigation/applications-active.svg';
import applicationsInactiveIcon from '../../../assets/icons/student/navigation/applications-inactive.svg';
import homeActiveIcon from '../../../assets/icons/student/navigation/home-active.svg';
import homeInactiveIcon from '../../../assets/icons/student/navigation/home-inactive.svg';
import matchingActiveIcon from '../../../assets/icons/student/navigation/matching-active.svg';
import matchingInactiveIcon from '../../../assets/icons/student/navigation/matching-inactive.svg';
import myActiveIcon from '../../../assets/icons/student/navigation/my-active.svg';
import myInactiveIcon from '../../../assets/icons/student/navigation/my-inactive.svg';
import homeFrameApplicationsIcon from '../../../assets/icons/student/home/applications.svg';
import homeFrameMatchingIcon from '../../../assets/icons/student/home/matching.svg';
import homeFrameMyIcon from '../../../assets/icons/student/home/my.svg';
import type { StudentNavigationTab } from '../../../types/studentHome';

type StudentBottomNavigationProps = {
  activeTab: StudentNavigationTab;
  bottomOffset?: number;
  isFixed?: boolean;
  onTabChange?: (tab: StudentNavigationTab) => void;
};

const NAVIGATION_ITEMS: Array<{
  label: string;
  tab: StudentNavigationTab;
}> = [
  { tab: 'home', label: '홈' },
  { tab: 'matching', label: '매칭' },
  { tab: 'applications', label: '지원내역' },
  { tab: 'my', label: '마이' },
];

const ACTIVE_ICONS: Record<StudentNavigationTab, string> = {
  applications: applicationsActiveIcon,
  home: homeActiveIcon,
  matching: matchingActiveIcon,
  my: myActiveIcon,
};

const INACTIVE_ICONS: Record<StudentNavigationTab, string> = {
  applications: applicationsInactiveIcon,
  home: homeInactiveIcon,
  matching: matchingInactiveIcon,
  my: myInactiveIcon,
};

const HOME_FRAME_ICONS: Record<StudentNavigationTab, string> = {
  applications: homeFrameApplicationsIcon,
  home: homeActiveIcon,
  matching: homeFrameMatchingIcon,
  my: homeFrameMyIcon,
};

function NavigationTabIcon({
  activeTab,
  isActive,
  tab,
}: {
  activeTab: StudentNavigationTab;
  isActive: boolean;
  tab: StudentNavigationTab;
}) {
  const iconSource =
    activeTab === 'home'
      ? HOME_FRAME_ICONS[tab]
      : isActive
        ? ACTIVE_ICONS[tab]
        : INACTIVE_ICONS[tab];
  const iconSizeClassName =
    tab === 'matching'
      ? isActive
        ? 'h-[20.4px] w-[20.4px]'
        : 'h-[19.8px] w-[19.8px]'
      : 'h-6 w-6';

  return (
    <span className="flex h-6 w-6 shrink-0 items-center justify-center">
      <img
        alt=""
        aria-hidden="true"
        className={`block max-w-none ${iconSizeClassName}`}
        src={iconSource}
      />
    </span>
  );
}

export function StudentBottomNavigation({
  activeTab,
  bottomOffset = 36,
  isFixed = false,
  onTabChange,
}: StudentBottomNavigationProps) {
  const activeIndex = Math.max(
    NAVIGATION_ITEMS.findIndex((item) => item.tab === activeTab),
    0,
  );
  const isHomeFrame = activeTab === 'home';

  return (
    <nav
      aria-label="학생 하단 내비게이션"
      className={`${
        isFixed ? 'fixed left-1/2 -translate-x-1/2' : 'absolute left-[11px]'
      } z-20 flex h-[70px] w-[calc(100%_-_22px)] max-w-[367px] items-center justify-center gap-[25px] rounded-[51px] bg-white/30`}
      style={{ bottom: bottomOffset }}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute top-[5px] left-0 h-[60px] w-[83px] rounded-[50px] ${
          isHomeFrame ? 'bg-[#E5E8EB]/20' : 'bg-[#E5E8EB]/90'
        }`}
        style={{
          left: `calc((100% - 308px) / 2 + ${activeIndex * 75}px)`,
        }}
      />
      {NAVIGATION_ITEMS.map((item) => {
        const isActive = activeTab === item.tab;

        return (
          <button
            aria-current={isActive ? 'page' : undefined}
            className={`relative z-10 flex h-[52px] w-[50px] shrink-0 flex-col items-center justify-center gap-[5px] border-0 bg-transparent p-0 ${
              isHomeFrame ? 'text-[#00251E]' : 'text-[#1D1F20]'
            }`}
            key={item.tab}
            type="button"
            onClick={() => onTabChange?.(item.tab)}
          >
            <NavigationTabIcon
              activeTab={activeTab}
              isActive={isActive}
              tab={item.tab}
            />
            <span
              className={`min-w-full text-center text-[13px] leading-[1.5] tracking-[-0.02em] ${
                isActive ? 'font-bold' : 'font-normal'
              }`}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
