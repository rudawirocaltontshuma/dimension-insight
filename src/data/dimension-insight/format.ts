export function formatCurrency(value: number, options?: { compact?: boolean; decimals?: number }) {
  const { compact = false, decimals = 0 } = options ?? {};
  if (compact) return `$${formatCompact(value)}`;
  return `$${value.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;
}

export function formatCompact(value: number) {
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  if (abs >= 1_000_000_000) return `${sign}${(abs / 1_000_000_000).toFixed(2)}B`;
  if (abs >= 1_000_000) return `${sign}${(abs / 1_000_000).toFixed(2)}M`;
  if (abs >= 1_000) return `${sign}${(abs / 1_000).toFixed(1)}K`;
  return `${sign}${abs.toFixed(0)}`;
}

export function formatNumber(value: number, decimals = 0) {
  return value.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

export function formatPercent(value: number, decimals = 1) {
  return `${value.toFixed(decimals)}%`;
}

export function formatSigned(value: number, decimals = 1) {
  return `${value > 0 ? "+" : ""}${value.toFixed(decimals)}%`;
}

export function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}
