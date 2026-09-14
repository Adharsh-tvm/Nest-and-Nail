const TIMEZONE = "Asia/Kolkata";

/**
 * Formats a date into full date string in IST, e.g. "Monday, September 14, 2026"
 */
export function formatMeetingDateLong(d?: string | Date | null): string {
  if (!d) return "—";
  const date = new Date(d);
  if (isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", {
    timeZone: TIMEZONE,
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Formats a date into short date string in IST, e.g. "Sep 14, 2026"
 */
export function formatMeetingDate(d?: string | Date | null): string {
  if (!d) return "—";
  const date = new Date(d);
  if (isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", {
    timeZone: TIMEZONE,
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Formats a time into 12-hour AM/PM string in IST, e.g. "12:04 PM"
 */
export function formatMeetingTime(d?: string | Date | null): string {
  if (!d) return "—";
  const date = new Date(d);
  if (isNaN(date.getTime())) return "—";
  return date.toLocaleTimeString("en-US", {
    timeZone: TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * Formats a date and time into 12-hour AM/PM string in IST, e.g. "Sep 14, 2026, 12:04 PM"
 */
export function formatMeetingDateTime(d?: string | Date | null): string {
  if (!d) return "—";
  const date = new Date(d);
  if (isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-US", {
    timeZone: TIMEZONE,
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * Formats a date and time with seconds into 12-hour AM/PM string in IST, e.g. "Sep 14, 2026, 12:04:15 PM"
 */
export function formatMeetingDateTimeWithSeconds(d?: string | Date | null): string {
  if (!d) return "—";
  const date = new Date(d);
  if (isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-US", {
    timeZone: TIMEZONE,
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}
