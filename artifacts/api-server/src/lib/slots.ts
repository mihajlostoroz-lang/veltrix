export const ALL_SLOTS = [
  { time: "08:00", label: "8:00 AM" },
  { time: "09:00", label: "9:00 AM" },
  { time: "10:00", label: "10:00 AM" },
  { time: "11:00", label: "11:00 AM" },
  { time: "12:00", label: "12:00 PM" },
  { time: "13:00", label: "1:00 PM" },
  { time: "14:00", label: "2:00 PM" },
  { time: "15:00", label: "3:00 PM" },
  { time: "16:00", label: "4:00 PM" },
  { time: "17:00", label: "5:00 PM" },
];

// Weekdays (Mon–Fri): 3 PM – 5 PM only
export const WEEKDAY_SLOTS = [
  { time: "15:00", label: "3:00 PM" },
  { time: "16:00", label: "4:00 PM" },
];

export function getSlotsForDate(dateStr: string) {
  return isWeekend(dateStr) ? ALL_SLOTS : WEEKDAY_SLOTS;
}

// Duration in hours for each service
export const SERVICE_DURATIONS: Record<string, number> = {
  "Exterior Wash": 1,
  "Full Interior Detail": 4,
  "Full Detail": 5,
  "Engine Bay Cleaning": 2,
  "Pet Hair Removal": 2,
  "Custom Quote": 5,
};

export const DEFAULT_DURATION = 5;

export function getServiceDuration(service: string): number {
  return SERVICE_DURATIONS[service] ?? DEFAULT_DURATION;
}

export function getSlotIndex(time: string): number {
  return ALL_SLOTS.findIndex((s) => s.time === time);
}

export function isWeekend(dateStr: string): boolean {
  const [year, month, day] = dateStr.split("-").map(Number);
  const d = new Date(year, month - 1, day);
  const dow = d.getDay();
  return dow === 0 || dow === 6;
}

// Returns true if a new booking at slotIndex with newDuration hours conflicts
// with any existing booking. existingBookings is [{timeSlot, service}].
export function hasConflict(
  existingBookings: { timeSlot: string; service: string }[],
  newSlotIndex: number,
  newDuration: number,
): boolean {
  return existingBookings.some((b) => {
    const bi = getSlotIndex(b.timeSlot);
    if (bi === -1) return false;
    const dExisting = getServiceDuration(b.service);
    // Intervals [newSlotIndex, newSlotIndex+newDuration) and [bi, bi+dExisting) overlap if:
    return newSlotIndex < bi + dExisting && bi < newSlotIndex + newDuration;
  });
}
