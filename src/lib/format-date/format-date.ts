// Fixed to UTC so the server-rendered HTML and the client render match (no hydration mismatch).
export const formatDate = (iso: string, locale: string) =>
  new Date(iso).toLocaleString(locale, {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'UTC',
  });

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ['year', 31_536_000],
  ['month', 2_592_000],
  ['day', 86_400],
  ['hour', 3_600],
  ['minute', 60],
];

// "2 hours ago". Depends on the current time, so callers render it with suppressHydrationWarning.
export const formatRelative = (iso: string, locale: string, now = Date.now()) => {
  const formatter = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  const seconds = Math.round((new Date(iso).getTime() - now) / 1000);
  const [unit, size] = UNITS.find(([, size]) => Math.abs(seconds) >= size) ?? ['second', 1];

  return formatter.format(Math.round(seconds / size), unit);
};
