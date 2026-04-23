const DAY_NAMES = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday',
  'Thursday', 'Friday', 'Saturday',
] as const;

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
] as const;

function ordinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

/** Format an ISO date string as "Tuesday 21st January" */
export function formatDeliveryDate(iso: string): string {
  const d = new Date(iso);
  return `${DAY_NAMES[d.getDay()]} ${ordinal(d.getDate())} ${MONTH_NAMES[d.getMonth()]}`;
}

/** Format a price with its symbol and precision */
export function formatPrice(amount: number, precision: number, symbol: string): string {
  return `${symbol}${amount.toFixed(precision)}`;
}
