import { useCallback, useEffect, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';

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
  label: string;
  tab: StudentNavigationTab;
}> = [
  { tab: 'home', label: '\uD648' },
  { tab: 'matching', label: '\uB9E4\uCE6D' },
  {
    tab: 'applications',
    label: '\uC9C0\uC6D0\uB0B4\uC5ED',
  },
  { tab: 'my', label: '\uB9C8\uC774' },
];

const ACTIVE_INDICATOR_WIDTH = 83;
const DRAG_THRESHOLD_PX = 4;
const FIRST_TAB_INDICATOR_OFFSET = 29.5;
const TAB_INDICATOR_INTERVAL = 75;

function getInitialIndicatorOffset(activeTab: StudentNavigationTab) {
  const activeIndex = NAVIGATION_ITEMS.findIndex(
    (item) => item.tab === activeTab,
  );

  return (
    FIRST_TAB_INDICATOR_OFFSET +
    Math.max(activeIndex, 0) * TAB_INDICATOR_INTERVAL
  );
}

function NavigationTabIcon({
  isActive,
  tab,
}: {
  isActive: boolean;
  tab: StudentNavigationTab;
}) {
  const color = '#00251E';
  const inactiveStrokeWidth = 1.8;

  if (tab === 'home') {
    return isActive ? (
      <svg aria-hidden="true" height="24" viewBox="0 0 24 24" width="24">
        <path
          d="M12.82 2.72a1.2 1.2 0 0 0-1.63 0l-8.4 7.8a1.2 1.2 0 0 0 .81 2.08h.6v6.6a2.4 2.4 0 0 0 2.4 2.4h10.8a2.4 2.4 0 0 0 2.4-2.4v-6.6h.6a1.2 1.2 0 0 0 .82-2.08l-8.4-7.8Zm-.22 11.68c.99 0 1.8.81 1.8 1.8v3.6H9.6v-3.6c0-.99.81-1.8 1.8-1.8h1.2Z"
          fill={color}
        />
      </svg>
    ) : (
      <svg
        aria-hidden="true"
        fill="none"
        height="24"
        viewBox="0 0 24 24"
        width="24"
      >
        <path
          d="m3 10.5 9-7.5 9 7.5v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-9Z"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={inactiveStrokeWidth}
        />
        <path
          d="M9 21v-6h6v6"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={inactiveStrokeWidth}
        />
      </svg>
    );
  }

  if (tab === 'matching') {
    return (
      <svg
        aria-hidden="true"
        fill="none"
        height="22"
        viewBox="0 0 19.8 19.8"
        width="22"
      >
        <path
          d="M11.44 8.36a4.39 4.39 0 0 0-6.18 0L2.18 11.44a4.39 4.39 0 1 0 6.18 6.18l1.54-1.54"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={isActive ? 2.5 : inactiveStrokeWidth}
        />
        <path
          d="M8.36 11.44a4.39 4.39 0 0 0 6.18 0l3.08-3.08a4.39 4.39 0 1 0-6.18-6.18L9.9 3.72"
          stroke={color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={isActive ? 2.5 : inactiveStrokeWidth}
        />
      </svg>
    );
  }

  if (tab === 'applications') {
    return (
      <svg
        aria-hidden="true"
        fill="none"
        height="24"
        viewBox="0 0 24 24"
        width="24"
      >
        <path
          d="M19.5 10.37V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5v-15A2.25 2.25 0 0 1 6.75 2.25h4.63c.4 0 .78.16 1.06.44l6.62 6.62c.28.28.44.68.44 1.06Z"
          fill={isActive ? color : 'none'}
          stroke={color}
          strokeLinejoin="round"
          strokeWidth={isActive ? 1 : 1.5}
        />
        <path
          d="M12 2.63v5.62c0 .83.67 1.5 1.5 1.5h5.63M8.25 13.5h7.5m-7.5 3.75h7.5"
          stroke={isActive ? '#F5F5F5' : color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
      </svg>
    );
  }

  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="24"
      viewBox="0 0 24 24"
      width="24"
    >
      <path
        d="M16.13 6.75c-.18 2.48-2.06 4.5-4.13 4.5-2.06 0-3.94-2.02-4.13-4.5C7.69 4.17 9.52 2.25 12 2.25s4.31 1.97 4.13 4.5Z"
        fill={isActive ? color : 'none'}
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={isActive ? 1 : inactiveStrokeWidth}
      />
      <path
        d="M12 14.25c-4.08 0-8.22 2.25-8.98 6.5-.09.51.2 1 .73 1h16.5c.54 0 .83-.49.73-1-.76-4.25-4.9-6.5-8.98-6.5Z"
        fill={isActive ? color : 'none'}
        stroke={color}
        strokeMiterlimit="10"
        strokeWidth={isActive ? 1 : inactiveStrokeWidth}
      />
    </svg>
  );
}

export function StudentBottomNavigation({
  activeBackgroundClassName = 'bg-[#E5E8EB]/90',
  activeTab,
  bottomOffsetClassName = 'bottom-9',
  isFixed = false,
  onTabChange,
  widthClassName = 'w-[367px]',
}: StudentBottomNavigationProps) {
  const [indicatorOffset, setIndicatorOffset] = useState(() =>
    getInitialIndicatorOffset(activeTab),
  );
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

    const tabIndex = NAVIGATION_ITEMS.findIndex((item) => item.tab === tab);
    setIndicatorOffset(getIndicatorOffset(Math.max(tabIndex, 0)));
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
            <NavigationTabIcon isActive={isActive} tab={item.tab} />
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
