import { useCallback, useEffect, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';

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

const ACTIVE_INDICATOR_WIDTH = 83;
const DRAG_THRESHOLD_PX = 4;

export function StudentBottomNavigation({
  activeBackgroundClassName = 'bg-[#E5E8EB]/20',
  activeTab,
  bottomOffsetClassName = 'bottom-9',
  isFixed = false,
  onTabChange,
  widthClassName = 'w-[367px]',
}: StudentBottomNavigationProps) {
  const [indicatorOffset, setIndicatorOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const navRef = useRef<HTMLElement | null>(null);
  const tabButtonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const dragPointerIdRef = useRef<number | null>(null);
  const dragStartClientXRef = useRef(0);
  const dragStartOffsetRef = useRef(0);
  const didDragRef = useRef(false);

  const getIndicatorOffset = useCallback((index: number) => {
    const nav = navRef.current;
    const tabButton = tabButtonRefs.current[index];

    if (!nav || !tabButton) return 0;

    const navRect = nav.getBoundingClientRect();
    const tabRect = tabButton.getBoundingClientRect();

    return (
      tabRect.left - navRect.left + (tabRect.width - ACTIVE_INDICATOR_WIDTH) / 2
    );
  }, []);

  const getNearestTabIndex = useCallback((clientX: number) => {
    const nav = navRef.current;
    if (!nav) return 0;

    const navRect = nav.getBoundingClientRect();
    const relativeX = clientX - navRect.left;

    return NAVIGATION_ITEMS.reduce((nearestIndex, _, index) => {
      const currentTab = tabButtonRefs.current[index];
      const nearestTab = tabButtonRefs.current[nearestIndex];

      if (!currentTab || !nearestTab) return nearestIndex;

      const currentRect = currentTab.getBoundingClientRect();
      const nearestRect = nearestTab.getBoundingClientRect();
      const currentCenter =
        currentRect.left - navRect.left + currentRect.width / 2;
      const nearestCenter =
        nearestRect.left - navRect.left + nearestRect.width / 2;

      return Math.abs(relativeX - currentCenter) <
        Math.abs(relativeX - nearestCenter)
        ? index
        : nearestIndex;
    }, 0);
  }, []);

  const moveIndicatorToActiveTab = useCallback(() => {
    const activeIndex = NAVIGATION_ITEMS.findIndex(
      (item) => item.tab === activeTab,
    );

    setIndicatorOffset(getIndicatorOffset(Math.max(activeIndex, 0)));
  }, [activeTab, getIndicatorOffset]);

  useEffect(() => {
    if (isDragging) return;

    const animationFrame = window.requestAnimationFrame(
      moveIndicatorToActiveTab,
    );
    window.addEventListener('resize', moveIndicatorToActiveTab);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', moveIndicatorToActiveTab);
    };
  }, [isDragging, moveIndicatorToActiveTab]);

  const handleTabClick = (tab: StudentNavigationTab) => {
    if (didDragRef.current) {
      didDragRef.current = false;
      return;
    }

    onTabChange?.(tab);
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;

    dragPointerIdRef.current = event.pointerId;
    dragStartClientXRef.current = event.clientX;
    dragStartOffsetRef.current = indicatorOffset;
    didDragRef.current = false;
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    if (dragPointerIdRef.current !== event.pointerId) return;

    const firstOffset = getIndicatorOffset(0);
    const lastOffset = getIndicatorOffset(NAVIGATION_ITEMS.length - 1);
    const nextOffset = Math.min(
      Math.max(
        dragStartOffsetRef.current +
          event.clientX -
          dragStartClientXRef.current,
        firstOffset,
      ),
      lastOffset,
    );

    if (
      !didDragRef.current &&
      Math.abs(event.clientX - dragStartClientXRef.current) > DRAG_THRESHOLD_PX
    ) {
      didDragRef.current = true;
      event.currentTarget.setPointerCapture(event.pointerId);
      setIsDragging(true);
    }

    setIndicatorOffset(nextOffset);
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLElement>) => {
    if (dragPointerIdRef.current !== event.pointerId) return;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    dragPointerIdRef.current = null;
    setIsDragging(false);

    if (!didDragRef.current) {
      moveIndicatorToActiveTab();
      return;
    }

    const nextIndex = getNearestTabIndex(event.clientX);
    const nextItem = NAVIGATION_ITEMS[nextIndex];

    if (nextItem) {
      setIndicatorOffset(getIndicatorOffset(nextIndex));
      onTabChange?.(nextItem.tab);
    }

    window.setTimeout(() => {
      didDragRef.current = false;
    }, 0);
  };

  const handlePointerCancel = (event: ReactPointerEvent<HTMLElement>) => {
    if (dragPointerIdRef.current !== event.pointerId) return;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    dragPointerIdRef.current = null;
    didDragRef.current = false;
    setIsDragging(false);
    moveIndicatorToActiveTab();
  };

  return (
    <nav
      aria-label={'\uD559\uC0DD \uD558\uB2E8 \uB0B4\uBE44\uAC8C\uC774\uC158'}
      className={`${isFixed ? 'fixed left-1/2 -translate-x-1/2' : 'absolute left-[11px]'} ${bottomOffsetClassName} ${widthClassName} z-20 flex h-[70px] touch-none select-none items-center justify-center gap-[25px] rounded-[51px] border border-white/65 bg-white/35 shadow-[0_8px_24px_rgba(25,31,40,0.08)] backdrop-blur-xl`}
      ref={navRef}
      onPointerCancel={handlePointerCancel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute top-1/2 left-0 h-[60px] w-[83px] rounded-[50px] border border-white/60 ${activeBackgroundClassName} shadow-[0_5px_14px_rgba(25,31,40,0.08)] backdrop-blur-xl`}
        style={{
          transform: `translate3d(${indicatorOffset}px, -50%, 0)`,
          transition: isDragging
            ? 'none'
            : 'transform 300ms cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      />
      {NAVIGATION_ITEMS.map((item, index) => {
        const isActive = activeTab === item.tab;

        return (
          <button
            aria-current={isActive ? 'page' : undefined}
            className="relative z-10 flex h-[52px] w-[50px] flex-col items-center justify-center gap-[5px] border-0 bg-transparent p-0 text-[#00251E]"
            key={item.tab}
            ref={(element) => {
              tabButtonRefs.current[index] = element;
            }}
            type="button"
            onClick={() => handleTabClick(item.tab)}
          >
            <img alt="" className="block" src={item.icon} />
            <span
              className={`min-w-full text-center text-[13px] leading-[1.5] ${
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
