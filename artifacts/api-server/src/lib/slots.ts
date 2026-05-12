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

// Each appointment is 5 hours; a booking at index T blocks T through T+5
export const APPOINTMENT_SPAN = 5;

export function getSlotIndex(time: string): number {
  return ALL_SLOTS.findIndex((s) => s.time === time);
}

export function isWeekend(dateStr: string): boolean {
  const [year, month, day] = dateStr.split("-").map(Number);
  const d = new Date(year, month - 1, day);
  const dow = d.getDay();
  return dow === 0 || dow === 6;
}

export function hasConflict(
  existingSlots: string[],
  newSlotTime: string,
  excludeSlotTime?: string,
): boolean {
  const newIndex = getSlotIndex(newSlotTime);
  return existingSlots.some((t) => {
    if (excludeSlotTime && t === excludeSlotTime) return false;
    const bi = getSlotIndex(t);
    return bi >= 0 && Math.abs(newIndex - bi) <= APPOINTMENT_SPAN;
  });
}
