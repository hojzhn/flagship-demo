// Formatting helpers used across views.

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const usdCents = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const fmtMoney = (n) => usd.format(n);
export const fmtMoneyCents = (n) => usdCents.format(n);

export const fmtPct = (n, digits = 0) => `${(n * 100).toFixed(digits)}%`;

export const fmtShares = (n) =>
  n.toLocaleString("en-US", { maximumFractionDigits: 2 });

export const fmtDays = (n) => `${n} day${n === 1 ? "" : "s"}`;

// Relative date string suitable for activity feeds.
//   Today / Yesterday / N days ago for the last week
//   "Apr 1" for the same year
//   "Nov 18, 2025" for prior years
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function fmtRelativeDate(dateStr, now = new Date()) {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;

  // Compare on day boundaries so "Today" doesn't depend on the time of day.
  const startOfDay = (d) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const days = Math.round(
    (startOfDay(now) - startOfDay(date)) / (1000 * 60 * 60 * 24),
  );

  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days > 1 && days < 7) return `${days} days ago`;

  const month = MONTHS[date.getMonth()];
  const day = date.getDate();
  if (date.getFullYear() === now.getFullYear()) return `${month} ${day}`;
  return `${month} ${day}, ${date.getFullYear()}`;
}
