export type ClassValue = string | false | null | undefined;

/** Tiny classNames joiner (no dependency). */
export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(' ');
}

/** Format a number as Thai Baht. */
export function formatTHB(amount: number): string {
  if (amount === 0) return 'Free';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'THB',
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Format an ISO date string for display. */
export function formatDate(iso: string, locale = 'en'): string {
  const map: Record<string, string> = { en: 'en-GB', de: 'de-DE', th: 'th-TH' };
  try {
    return new Date(iso).toLocaleDateString(map[locale] ?? 'en-GB', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}

export function formatTime(time: string): string {
  return time;
}

/** Convert array-of-objects to a CSV string. */
export function toCSV(rows: Record<string, unknown>[]): string {
  if (!rows.length) return '';
  const headers = Object.keys(rows[0]);
  const escape = (v: unknown) => {
    const s = v == null ? '' : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [headers.join(','), ...rows.map((r) => headers.map((h) => escape(r[h])).join(','))].join('\n');
}

export function downloadCSV(filename: string, rows: Record<string, unknown>[]): void {
  if (typeof window === 'undefined') return;
  const blob = new Blob([toCSV(rows)], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
