import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type PointerEvent,
} from 'react';

import dragHandleIcon from '../../../assets/icons/student/priority-drag-handle.svg';
import type {
  MatchingPriority,
  MatchingPriorityId,
} from '../../../types/matchingPriority';

type MatchingPriorityListProps = {
  priorities: MatchingPriority[];
  onChange: (priorities: MatchingPriority[]) => void;
};

function movePriority(
  priorities: MatchingPriority[],
  sourceId: MatchingPriorityId,
  destinationId: MatchingPriorityId | null,
) {
  const sourceIndex = priorities.findIndex(
    (priority) => priority.id === sourceId,
  );

  if (sourceIndex < 0) {
    return priorities;
  }

  const nextPriorities = [...priorities];
  const [movedPriority] = nextPriorities.splice(sourceIndex, 1);
  const destinationIndex = destinationId
    ? nextPriorities.findIndex((priority) => priority.id === destinationId)
    : nextPriorities.length;

  if (destinationIndex < 0) return priorities;

  nextPriorities.splice(destinationIndex, 0, movedPriority);

  return nextPriorities;
}

export function MatchingPriorityList({
  priorities,
  onChange,
}: MatchingPriorityListProps) {
  const cardElementsRef = useRef(new Map<MatchingPriorityId, HTMLLIElement>());
  const draggedPriorityIdRef = useRef<MatchingPriorityId | null>(null);
  const dragPointerOffsetYRef = useRef(0);
  const layoutPositionsRef = useRef(new Map<MatchingPriorityId, number>());
  const layoutAnimationFrameRef = useRef<number | null>(null);
  const [draggedPriorityId, setDraggedPriorityId] =
    useState<MatchingPriorityId | null>(null);
  const [draggedCardBaseTop, setDraggedCardBaseTop] = useState<number | null>(
    null,
  );
  const [draggedCardVisualTop, setDraggedCardVisualTop] = useState<
    number | null
  >(null);
  const [flipOffsets, setFlipOffsets] = useState(
    new Map<MatchingPriorityId, number>(),
  );

  useEffect(
    () => () => {
      if (layoutAnimationFrameRef.current !== null) {
        window.cancelAnimationFrame(layoutAnimationFrameRef.current);
      }
    },
    [],
  );

  useLayoutEffect(() => {
    const nextPositions = new Map<MatchingPriorityId, number>();

    priorities.forEach((priority) => {
      const element = cardElementsRef.current.get(priority.id);
      if (element) {
        nextPositions.set(priority.id, element.getBoundingClientRect().top);
      }
    });

    if (draggedPriorityId) {
      const draggedCardTop = nextPositions.get(draggedPriorityId);
      if (draggedCardTop !== undefined) {
        setDraggedCardBaseTop(draggedCardTop);
      }

      const nextFlipOffsets = new Map<MatchingPriorityId, number>();
      nextPositions.forEach((top, priorityId) => {
        if (priorityId === draggedPriorityId) return;

        const previousTop = layoutPositionsRef.current.get(priorityId);
        if (previousTop !== undefined && previousTop !== top) {
          nextFlipOffsets.set(priorityId, previousTop - top);
        }
      });

      if (nextFlipOffsets.size > 0) {
        setFlipOffsets(nextFlipOffsets);
        if (layoutAnimationFrameRef.current !== null) {
          window.cancelAnimationFrame(layoutAnimationFrameRef.current);
        }
        layoutAnimationFrameRef.current = window.requestAnimationFrame(() => {
          setFlipOffsets(new Map());
          layoutAnimationFrameRef.current = null;
        });
      }
    } else {
      setFlipOffsets(new Map());
    }

    layoutPositionsRef.current = nextPositions;
  }, [draggedPriorityId, priorities]);

  const handlePointerDown = (
    event: PointerEvent<HTMLButtonElement>,
    priorityId: MatchingPriorityId,
  ) => {
    if (!event.isPrimary) return;

    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    const cardElement = cardElementsRef.current.get(priorityId);
    const cardTop = cardElement?.getBoundingClientRect().top;

    if (cardTop === undefined) return;

    dragPointerOffsetYRef.current = event.clientY - cardTop;
    draggedPriorityIdRef.current = priorityId;
    setDraggedCardBaseTop(cardTop);
    setDraggedCardVisualTop(cardTop);
    setDraggedPriorityId(priorityId);
  };

  const handlePointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    const sourceId = draggedPriorityIdRef.current;
    if (!sourceId) return;

    setDraggedCardVisualTop(event.clientY - dragPointerOffsetYRef.current);

    const destination = priorities.find((priority) => {
      if (priority.id === sourceId) return false;

      const element = cardElementsRef.current.get(priority.id);
      if (!element) return false;

      const { top, height } = element.getBoundingClientRect();
      return event.clientY < top + height / 2;
    });
    const destinationId = destination?.id ?? null;

    onChange(movePriority(priorities, sourceId, destinationId));
  };

  const handlePointerEnd = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    draggedPriorityIdRef.current = null;
    setDraggedCardBaseTop(null);
    setDraggedCardVisualTop(null);
    setDraggedPriorityId(null);
  };

  return (
    <ul className="m-0 mt-[24px] list-none space-y-2.5 p-0" role="list">
      {priorities.map((priority) => {
        const isDragging = draggedPriorityId === priority.id;
        const dragOffset =
          isDragging &&
          draggedCardVisualTop !== null &&
          draggedCardBaseTop !== null
            ? draggedCardVisualTop - draggedCardBaseTop
            : 0;
        const flipOffset = flipOffsets.get(priority.id) ?? 0;
        const transform = isDragging
          ? `translateY(${dragOffset}px) scale(1.015)`
          : flipOffset
            ? `translateY(${flipOffset}px)`
            : undefined;

        return (
          <li
            className="relative h-[89px]"
            key={priority.id}
            ref={(element) => {
              if (element) {
                cardElementsRef.current.set(priority.id, element);
                return;
              }

              cardElementsRef.current.delete(priority.id);
            }}
          >
            <div
              className={`relative size-full rounded-[20px] border-[0.7px] border-[#B0B8C1] bg-[#F5F5F5] ${
                isDragging
                  ? 'z-10 opacity-95 shadow-[0_8px_20px_rgba(25,31,40,0.18)] transition-none'
                  : flipOffset
                    ? 'transition-none'
                    : 'transition-[transform,box-shadow,opacity] duration-150 ease-out'
              }`}
              style={{ transform }}
            >
              <strong className="absolute top-[19.3px] left-[30.3px] text-[17px] leading-[1.5] font-bold text-[#191F28]">
                {priority.label}
              </strong>
              <p className="absolute top-[45.3px] left-[30.3px] text-[15px] leading-[1.5] text-[#8B95A1]">
                {priority.description}
              </p>
              <button
                aria-label={`${priority.label} 우선순위 이동`}
                aria-pressed={isDragging}
                className="absolute top-[21.8px] right-[19.2px] flex size-11 touch-none cursor-grab items-center justify-center border-0 bg-transparent p-0 active:cursor-grabbing"
                type="button"
                onPointerCancel={handlePointerEnd}
                onPointerDown={(event) => handlePointerDown(event, priority.id)}
                onLostPointerCapture={handlePointerEnd}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerEnd}
              >
                <img alt="" className="block" src={dragHandleIcon} />
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
