/** Datums in het Nederlands via Intl (ingebouwd in de browser, geen extra bundel). */
const LONG = new Intl.DateTimeFormat('nl-NL', { weekday: 'long', day: 'numeric', month: 'long' });
const SHORT = new Intl.DateTimeFormat('nl-NL', { day: 'numeric', month: 'short' });
const TIME = new Intl.DateTimeFormat('nl-NL', { hour: '2-digit', minute: '2-digit' });

/** Kalenderdag in lokale tijd, 'yyyy-MM-dd'. */
export function dayKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** "zaterdag 31 oktober" */
export function formatDate(iso: string): string {
  return LONG.format(new Date(iso));
}

/** "31 okt. om 12:51" */
export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return `${SHORT.format(d)} om ${TIME.format(d)}`;
}

export function isWeekendDay(date: Date): boolean {
  const d = date.getDay();
  return d === 0 || d === 6;
}

export const DAY_MS = 24 * 60 * 60 * 1000;
