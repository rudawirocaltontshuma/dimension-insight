/**
 * Shared visual language for every DIMENSION INSIGHT chart. Colors come from the
 * Tailwind default palette exposed as CSS custom properties, so charts stay
 * legible in light mode, dark mode and every theme preset in the project.
 */

export const SERIES_COLORS = [
  "var(--color-indigo-500)",
  "var(--color-teal-500)",
  "var(--color-amber-500)",
  "var(--color-rose-500)",
  "var(--color-sky-500)",
  "var(--color-violet-500)",
  "var(--color-emerald-500)",
  "var(--color-orange-500)",
] as const;

export function seriesColor(index: number) {
  return SERIES_COLORS[index % SERIES_COLORS.length];
}

export const POSITIVE = "var(--color-emerald-500)";
export const NEGATIVE = "var(--color-rose-500)";
export const NEUTRAL = "var(--color-slate-400)";

export const GRID_PROPS = {
  strokeDasharray: "3 3",
  vertical: false,
  className: "stroke-border/60",
} as const;

export const AXIS_PROPS = {
  tickLine: false,
  axisLine: false,
  tickMargin: 8,
  className: "text-[11px] fill-muted-foreground",
} as const;
