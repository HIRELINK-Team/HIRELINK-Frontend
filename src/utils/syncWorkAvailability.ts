import type {
  Weekday,
  WorkAvailability,
  WorkTimeMode,
} from '../types/workAvailability';

export function syncWorkAvailability(
  availability: WorkAvailability,
  mode: WorkTimeMode,
  day: Weekday,
  slots: number[],
): WorkAvailability {
  const otherMode = mode === 'daytime' ? 'nighttime' : 'daytime';
  const otherSlots = new Set(availability[otherMode][day]);

  for (let index = 0; index < 2; index += 1) {
    const selectedSlot = mode === 'daytime' ? 26 + index : index;
    const otherSlot = mode === 'daytime' ? index : 26 + index;
    if (
      slots.includes(selectedSlot) ===
      availability[mode][day].includes(selectedSlot)
    )
      continue;
    if (slots.includes(selectedSlot)) otherSlots.add(otherSlot);
    else otherSlots.delete(otherSlot);
  }

  return {
    ...availability,
    [mode]: { ...availability[mode], [day]: slots },
    [otherMode]: {
      ...availability[otherMode],
      [day]: [...otherSlots].sort((a, b) => a - b),
    },
  };
}
