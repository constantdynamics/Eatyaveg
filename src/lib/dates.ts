import { format, formatDistanceStrict, parseISO } from 'date-fns';
import { nl } from 'date-fns/locale';

/** Kalenderdag in lokale tijd, 'yyyy-MM-dd'. */
export function dayKey(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

export function dayKeyOfIso(iso: string): string {
  return dayKey(parseISO(iso));
}

export function formatDate(iso: string): string {
  return format(parseISO(iso), 'EEEE d MMMM', { locale: nl });
}

export function formatDateShort(iso: string): string {
  return format(parseISO(iso), 'd MMM', { locale: nl });
}

export function formatDateTime(iso: string): string {
  return format(parseISO(iso), "d MMM 'om' HH:mm", { locale: nl });
}

export function formatAgo(iso: string, now: Date): string {
  return formatDistanceStrict(parseISO(iso), now, { locale: nl, addSuffix: true });
}

export function isWeekendDay(date: Date): boolean {
  const d = date.getDay();
  return d === 0 || d === 6;
}

export const DAY_MS = 24 * 60 * 60 * 1000;
