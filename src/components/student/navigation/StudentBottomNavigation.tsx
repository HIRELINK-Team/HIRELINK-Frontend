import applicationsIcon from '../../../assets/icons/student/home/applications.svg';
import homeIcon from '../../../assets/icons/student/home/home.svg';
import matchingIcon from '../../../assets/icons/student/home/matching.svg';
import myIcon from '../../../assets/icons/student/home/my.svg';
import type { StudentNavigationTab } from '../../../types/studentHome';

type StudentBottomNavigationProps = {
  activeBackgroundClassName?: string;
  activeTab: StudentNavigationTab;
  bottomOffsetClassName?: string;
  isFixed?: boolean;
  onTabChange?: (tab: StudentNavigationTab) => void;
  widthClassName?: string;
};

const NAVIGATION_ITEMS: Array<{
  icon: string;
  label: string;
  tab: StudentNavigationTab;
}> = [
  { tab: 'home', label: '\uD648', icon: homeIcon },
  { tab: 'matching', label: '\uB9E4\uCE6D', icon: matchingIcon },
  {
    tab: 'applications',
    label: '\uC9C0\uC6D0\uB0B4\uC5ED',
    icon: applicationsIcon,
  },
  { tab: 'my', label: '\uB9C8\uC774', icon: myIcon },
];

export function StudentBottomNavigation({
  activeBackgroundClassName = 'bg-[#E5E8EB]/20',
  activeTab,
  bottomOffsetClassName = 'bottom-9',
  isFixed = false,
  onTabChange,
  widthClassName = 'w-[367px]',
}: StudentBottomNavigationProps) {
  const handleTabClick = (tab: StudentNavigationTab) => {
    onTabChange?.(tab);
  };

  return (
    <nav
      aria-label={'\uD559\uC0DD \uD558\uB2E8 \uB0B4\uBE44\uAC8C\uC774\uC158'}
      className={`${isFixed ? 'fixed left-1/2 -translate-x-1/2' : 'absolute left-[11px]'} ${bottomOffsetClassName} ${widthClassName} z-20 flex h-[70px] items-center justify-center gap-[25px] rounded-[51px] bg-white/30`}
    >
      {NAVIGATION_ITEMS.map((item) => {
        const isActive = activeTab === item.tab;

        return (
          <button
            aria-current={isActive ? 'page' : undefined}
            className="relative flex h-[52px] w-[50px] flex-col items-center justify-center gap-[5px] border-0 bg-transparent p-0 text-[#00251E]"
            key={item.tab}
            type="button"
            onClick={() => handleTabClick(item.tab)}
          >
            {isActive ? (
              <span
                aria-hidden="true"
                className={`absolute h-[60px] w-[83px] rounded-[50px] ${activeBackgroundClassName}`}
              />
            ) : null}
            <img alt="" className="relative z-10 block" src={item.icon} />
            <span
              className={`relative z-10 min-w-full text-center text-[13px] leading-[1.5] ${
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
