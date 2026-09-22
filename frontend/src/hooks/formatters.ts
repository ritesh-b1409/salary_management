import { format, parseISO } from "date-fns";

const currencyFormatterCache = new Map<string, Intl.NumberFormat>();

function getCurrencyFormatter(currency: string): Intl.NumberFormat {
  let formatter = currencyFormatterCache.get(currency);
  if (!formatter) {
    formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    });
    currencyFormatterCache.set(currency, formatter);
  }
  return formatter;
}

export function formatCurrency(amount: number, currency: string): string {
  try {
    return getCurrencyFormatter(currency).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString("en-US")}`;
  }
}

export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "—";
  try {
    return format(parseISO(dateString), "MMM d, yyyy");
  } catch {
    return dateString;
  }
}

export function calculatePercentChange(previous: number, current: number): number {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}

export function formatPercentChange(previous: number, current: number): string {
  const change = calculatePercentChange(previous, current);
  const sign = change > 0 ? "+" : "";
  return `${sign}${change.toFixed(1)}%`;
}
