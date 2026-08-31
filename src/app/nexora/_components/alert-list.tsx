import Link from "next/link";

import { AlertTriangle, ArrowUpRight, Info, ShieldAlert, TrendingDown, TriangleAlert } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { AlertSeverity, AnalyticsAlert } from "@/data/nexora/content";
import { formatDate } from "@/data/nexora/format";
import { cn } from "@/lib/utils";

import { StatusPill } from "./ui-blocks";

export const SEVERITY_TONE: Record<AlertSeverity, "negative" | "warning" | "info" | "neutral"> = {
  Critical: "negative",
  High: "negative",
  Medium: "warning",
  Low: "info",
  Info: "info",
};

export const SEVERITY_ICON: Record<AlertSeverity, typeof AlertTriangle> = {
  Critical: ShieldAlert,
  High: TriangleAlert,
  Medium: AlertTriangle,
  Low: TrendingDown,
  Info: Info,
};

export function severityIconClass(severity: AlertSeverity) {
  if (severity === "Critical" || severity === "High") return "bg-rose-500/10 text-rose-600 dark:text-rose-300";
  if (severity === "Medium") return "bg-amber-500/10 text-amber-600 dark:text-amber-300";
  return "bg-sky-500/10 text-sky-600 dark:text-sky-300";
}

export function AlertRow({ alert }: { alert: AnalyticsAlert }) {
  const Icon = SEVERITY_ICON[alert.severity];
  return (
    <div className="flex items-start gap-3 border-b p-4 last:border-b-0">
      <span
        className={cn(
          "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md",
          severityIconClass(alert.severity),
        )}
      >
        <Icon className="size-4" />
      </span>
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-medium text-sm">{alert.title}</p>
          <StatusPill status={alert.severity} tone={SEVERITY_TONE[alert.severity]} />
        </div>
        <p className="line-clamp-2 text-muted-foreground text-xs leading-relaxed">{alert.description}</p>
        <p className="text-muted-foreground text-xs">
          {alert.category} · {alert.metric} · {formatDate(alert.date)} · {alert.status}
        </p>
      </div>
    </div>
  );
}

export function RecentAlertsCard({ alerts }: { alerts: AnalyticsAlert[] }) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b">
        <CardTitle className="text-base">Recent alerts</CardTitle>
        <CardDescription className="text-xs">Analytics thresholds breached across the business</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {alerts.map((alert) => (
          <AlertRow key={alert.id} alert={alert} />
        ))}
      </CardContent>
      <div className="border-t px-6 py-3">
        <Link href="/nexora/alerts" className="inline-flex items-center gap-1 font-medium text-sm hover:underline">
          View all alerts
          <ArrowUpRight className="size-3.5" />
        </Link>
      </div>
    </Card>
  );
}
