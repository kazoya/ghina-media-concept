// تواريخ يوم محلية YYYY-MM-DD. الحساب عبر Date.UTC حتى لا ينزاح اليوم بسبب المنطقة الزمنية.
const RE = /^(\d{4})-(\d{2})-(\d{2})$/;

export function isIsoDate(s: unknown): s is string {
  if (typeof s !== "string") return false;
  const m = RE.exec(s);
  if (!m) return false;
  const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
  return d.getUTCFullYear() === +m[1] && d.getUTCMonth() === +m[2] - 1 && d.getUTCDate() === +m[3];
}

export function addDays(iso: string, days: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10);
}

export function diffDays(from: string, to: string): number {
  const [a, b] = [from, to].map((s) => {
    const [y, m, d] = s.split("-").map(Number);
    return Date.UTC(y, m - 1, d);
  });
  return Math.round((b - a) / 86_400_000);
}

/** تاريخ اليوم في المنطقة الزمنية المعطاة (افتراضياً توقيت الجهاز) */
export function todayIso(timeZone?: string, now: Date = new Date()): string {
  const p = new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(now);
  const g = (t: string) => p.find((x) => x.type === t)!.value;
  return `${g("year")}-${g("month")}-${g("day")}`;
}

const weekday = new Intl.DateTimeFormat("ar-JO-u-nu-latn", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" });
export function formatDayAr(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return weekday.format(new Date(Date.UTC(y, m - 1, d)));
}
