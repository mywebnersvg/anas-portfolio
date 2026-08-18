import {
  MIN_NOTICE_MINUTES,
  OWNER_TIMEZONE,
  OWNER_WORK_END,
  OWNER_WORK_START,
  SLOT_INTERVAL_MINUTES,
} from "../data/meetingLocations";

export interface TimeSlot {
  id: string;
  /** ISO string in UTC — send this to backend */
  utcIso: string;
  /** Display label in client's timezone */
  clientLabel: string;
  /** Display label in owner's timezone (for your reference) */
  ownerLabel: string;
  dateKey: string;
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function formatInTimezone(date: Date, timezone: string) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

function getZonedParts(date: Date, timezone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);

  const get = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((p) => p.type === type)?.value ?? 0);

  return {
    year: get("year"),
    month: get("month"),
    day: get("day"),
    hour: get("hour"),
    minute: get("minute"),
  };
}

/** Convert owner-local wall time to UTC Date */
function ownerLocalToUtc(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number
): Date {
  const guess = new Date(Date.UTC(year, month - 1, day, hour, minute));
  const ownerParts = getZonedParts(guess, OWNER_TIMEZONE);
  const offsetMinutes =
    ownerParts.hour * 60 +
    ownerParts.minute -
    (hour * 60 + minute) +
    (ownerParts.day - day) * 24 * 60;

  return new Date(guess.getTime() - offsetMinutes * 60_000);
}

function dateKeyInTimezone(date: Date, timezone: string) {
  const p = getZonedParts(date, timezone);
  return `${p.year}-${pad(p.month)}-${pad(p.day)}`;
}

export function generateAvailableSlots(
  clientTimezone: string,
  daysAhead = 14,
  bookedUtcIsos: string[] = []
): Record<string, TimeSlot[]> {
  const booked = new Set(bookedUtcIsos);
  const now = new Date();
  const minStart = new Date(now.getTime() + MIN_NOTICE_MINUTES * 60_000);
  const slotsByDate: Record<string, TimeSlot[]> = {};

  for (let d = 0; d < daysAhead; d++) {
    const base = new Date();
    base.setDate(base.getDate() + d);

    const ownerToday = getZonedParts(base, OWNER_TIMEZONE);

    for (let hour = OWNER_WORK_START; hour < OWNER_WORK_END; hour++) {
      for (let minute = 0; minute < 60; minute += SLOT_INTERVAL_MINUTES) {
        const utcDate = ownerLocalToUtc(
          ownerToday.year,
          ownerToday.month,
          ownerToday.day,
          hour,
          minute
        );

        if (utcDate < minStart) continue;
        if (booked.has(utcDate.toISOString())) continue;

        const clientKey = dateKeyInTimezone(utcDate, clientTimezone);
        const slot: TimeSlot = {
          id: utcDate.toISOString(),
          utcIso: utcDate.toISOString(),
          clientLabel: formatInTimezone(utcDate, clientTimezone),
          ownerLabel: formatInTimezone(utcDate, OWNER_TIMEZONE),
          dateKey: clientKey,
        };

        if (!slotsByDate[clientKey]) slotsByDate[clientKey] = [];
        slotsByDate[clientKey].push(slot);
      }
    }
  }

  return slotsByDate;
}

export function isValidCustomTime(
  utcIso: string,
  bookedUtcIsos: string[] = []
): boolean {
  const date = new Date(utcIso);
  if (Number.isNaN(date.getTime())) return false;

  const now = new Date();
  const minStart = new Date(now.getTime() + MIN_NOTICE_MINUTES * 60_000);
  if (date < minStart) return false;
  if (bookedUtcIsos.includes(date.toISOString())) return false;

  const ownerParts = getZonedParts(date, OWNER_TIMEZONE);
  const ownerMinutes = ownerParts.hour * 60 + ownerParts.minute;
  const start = OWNER_WORK_START * 60;
  const end = OWNER_WORK_END * 60;

  return ownerMinutes >= start && ownerMinutes < end;
}

export function clientLocalInputToUtc(
  dateStr: string,
  timeStr: string,
  clientTimezone: string
): string | null {
  const [year, month, day] = dateStr.split("-").map(Number);
  const [hour, minute] = timeStr.split(":").map(Number);
  if (!year || !month || !day || Number.isNaN(hour) || Number.isNaN(minute)) {
    return null;
  }

  const guess = new Date(Date.UTC(year, month - 1, day, hour, minute));
  const clientParts = getZonedParts(guess, clientTimezone);
  const offsetMinutes =
    clientParts.hour * 60 +
    clientParts.minute -
    (hour * 60 + minute) +
    (clientParts.day - day) * 24 * 60;

  return new Date(guess.getTime() - offsetMinutes * 60_000).toISOString();
}
