import type { ReactNode } from "react";

import { ArrowDownRight, ArrowRight, ArrowUpRight, type LucideIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/* --------------------------------------------------------- Page header */

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
      <div className="min-w-0 space-y-1">
        {eyebrow ? (
          <p className="font-medium text-muted-foreground text-xs uppercase tracking-[0.14em]">{eyebrow}</p>
        ) : null}
        <h1 className="text-balance font-semibold text-2xl tracking-tight md:text-3xl">{title}</h1>
        <p className="max-w-3xl text-pretty text-muted-foreground text-sm">{description}</p>
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}

/* ------------------------------------------------------------ KPI card */

export type TrendDirection = "up" | "down" | "flat";

const TREND_ICONS: Record<TrendDirection, LucideIcon> = {
  up: ArrowUpRight,
  down: ArrowDownRight,
  flat: ArrowRight,
};

function trendDirection(change: number | undefined): TrendDirection {
  if (change === undefined || change === 0) return "flat";
  return change > 0 ? "up" : "down";
}

function isFavourable(direction: TrendDirection, invertTrend: boolean): boolean | null {
  if (direction === "flat") return null;
  return invertTrend ? direction === "down" : direction === "up";
}

function progressTone(progress: number) {
  if (progress >= 100) return "bg-emerald-500";
  return progress >= 90 ? "bg-amber-500" : "bg-rose-500";
}

export interface KpiCardProps {
  label: string;
  value: string;
  change?: number;
  changeLabel?: string;
  icon?: LucideIcon;
  invertTrend?: boolean;
  footnote?: string;
  progress?: number;
}

export function KpiCard({
  label,
  value,
  change,
  changeLabel = "vs prior period",
  icon: Icon,
  invertTrend = false,
  footnote,
  progress,
}: KpiCardProps) {
  const direction = trendDirection(change);
  const good = isFavourable(direction, invertTrend);
  const TrendIcon = TREND_ICONS[direction];

  return (
    <Card className="gap-3 overflow-hidden">
      <CardHeader className="pb-0">
        <CardDescription className="flex items-center gap-2 text-xs">
          {Icon ? <Icon className="size-3.5" aria-hidden /> : null}
          {label}
        </CardDescription>
        <CardTitle className="font-semibold text-2xl tabular-nums tracking-tight">{value}</CardTitle>
        {change !== undefined ? (
          <CardAction>
            <Badge
              variant="outline"
              className={cn(
                "gap-1 tabular-nums",
                good === true && "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
                good === false && "border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300",
              )}
            >
              <TrendIcon className="size-3" />
              {`${change > 0 ? "+" : ""}${change.toFixed(1)}%`}
            </Badge>
          </CardAction>
        ) : null}
      </CardHeader>
      <CardContent className="space-y-2">
        {progress !== undefined ? (
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={cn("h-full rounded-full", progressTone(progress))}
              style={{ width: `${Math.min(100, Math.max(3, progress))}%` }}
            />
          </div>
        ) : null}
        <p className="text-muted-foreground text-xs">{footnote ?? changeLabel}</p>
      </CardContent>
    </Card>
  );
}

export function KpiGrid({ children, columns = 5 }: { children: ReactNode; columns?: 3 | 4 | 5 }) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
        columns === 4 && "xl:grid-cols-4",
        columns === 5 && "xl:grid-cols-5",
      )}
    >
      {children}
    </div>
  );
}

/* ---------------------------------------------------------- Chart card */

export function ChartCard({
  title,
  description,
  action,
  children,
  className,
  footer,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  footer?: ReactNode;
}) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="border-b">
        <CardTitle className="text-base">{title}</CardTitle>
        {description ? <CardDescription className="text-xs">{description}</CardDescription> : null}
        {action ? <CardAction>{action}</CardAction> : null}
      </CardHeader>
      <CardContent className="min-w-0 pt-4">{children}</CardContent>
      {footer ? <div className="border-t px-6 py-3 text-muted-foreground text-xs">{footer}</div> : null}
    </Card>
  );
}

/* --------------------------------------------------------- Status pill */

export function StatusPill({
  status,
  tone,
}: {
  status: string;
  tone: "positive" | "warning" | "negative" | "neutral" | "info";
}) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1.5 font-medium",
        tone === "positive" && "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
        tone === "warning" && "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
        tone === "negative" && "border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300",
        tone === "info" && "border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300",
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full",
          tone === "positive" && "bg-emerald-500",
          tone === "warning" && "bg-amber-500",
          tone === "negative" && "bg-rose-500",
          tone === "info" && "bg-sky-500",
          tone === "neutral" && "bg-muted-foreground",
        )}
      />
      {status}
    </Badge>
  );
}

/* ------------------------------------------------------- Metric stat */

export function MetricRow({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b py-2 last:border-b-0">
      <span className="min-w-0 truncate text-muted-foreground text-sm">{label}</span>
      <span className="text-right">
        <span className="font-medium text-sm tabular-nums">{value}</span>
        {hint ? <span className="ml-2 text-muted-foreground text-xs">{hint}</span> : null}
      </span>
    </div>
  );
}

export function DemoNotice({ className }: { className?: string }) {
  return (
    <p className={cn("text-muted-foreground text-xs", className)}>
      Frontend demonstration using fictional data. Figures are generated locally and do not represent a real business.
    </p>
  );
}
