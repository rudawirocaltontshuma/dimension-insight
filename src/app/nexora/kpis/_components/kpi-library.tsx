"use client";

import * as React from "react";

import type { ColumnDef } from "@tanstack/react-table";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { KPIS, type KpiDefinition, kpiStatus, kpiTrend, kpiVariance } from "@/data/nexora/content";
import { formatCurrency, formatNumber, formatPercent, formatSigned } from "@/data/nexora/format";
import type { DataTableFeatures } from "@/lib/data-table-features";
import { cn } from "@/lib/utils";

import { NexoraLineChart, NexoraSparkline } from "../../_components/charts";
import { NexoraDataTable } from "../../_components/data-table";
import { MetricRow, StatusPill } from "../../_components/ui-blocks";

export function formatKpiValue(kpi: Pick<KpiDefinition, "unit">, value: number) {
  switch (kpi.unit) {
    case "currency":
      return formatCurrency(value, { compact: value >= 100_000 });
    case "percent":
      return formatPercent(value, 2);
    case "score":
      return value.toFixed(2);
    case "days":
      return `${value.toFixed(1)} days`;
    default:
      return formatNumber(value, value % 1 === 0 ? 0 : 2);
  }
}

function trendIcon(trend: number) {
  if (trend > 0.5) return ArrowUpRight;
  return trend < -0.5 ? ArrowDownRight : Minus;
}

function chartFormat(unit: KpiDefinition["unit"]) {
  if (unit === "currency") return "currency" as const;
  return unit === "percent" ? ("percent" as const) : ("number" as const);
}

const STATUS_TONE = {
  "On Track": "positive",
  "At Risk": "warning",
  Critical: "negative",
} as const;

const CATEGORIES = ["All categories", "Finance", "Sales", "Customers", "Operations", "Marketing", "Workforce"];
const STATUSES = ["All statuses", "On Track", "At Risk", "Critical"];

export function KpiLibrary({ initialKpiId }: { initialKpiId?: string }) {
  const [category, setCategory] = React.useState("All categories");
  const [status, setStatus] = React.useState("All statuses");
  const [selected, setSelected] = React.useState<KpiDefinition | null>(
    initialKpiId ? (KPIS.find((kpi) => kpi.id === initialKpiId) ?? null) : null,
  );

  const rows = React.useMemo(
    () =>
      KPIS.filter((kpi) => category === "All categories" || kpi.category === category).filter(
        (kpi) => status === "All statuses" || kpiStatus(kpi) === status,
      ),
    [category, status],
  );

  const columns = React.useMemo<ColumnDef<DataTableFeatures, KpiDefinition>[]>(
    () => [
      {
        id: "name",
        accessorKey: "name",
        header: "KPI",
        cell: ({ row }) => (
          <div className="flex min-w-0 flex-col">
            <span className="font-medium">{row.original.name}</span>
            <span className="text-muted-foreground text-xs">
              {row.original.category} · {row.original.frequency}
            </span>
          </div>
        ),
      },
      {
        id: "value",
        accessorFn: (row) => row.value,
        header: "Value",
        cell: ({ row }) => <span className="tabular-nums">{formatKpiValue(row.original, row.original.value)}</span>,
      },
      {
        id: "target",
        accessorFn: (row) => row.target,
        header: "Target",
        cell: ({ row }) => (
          <span className="text-muted-foreground tabular-nums">
            {formatKpiValue(row.original, row.original.target)}
          </span>
        ),
      },
      {
        id: "variance",
        accessorFn: (row) => kpiVariance(row),
        header: "Variance",
        cell: ({ row }) => {
          const variance = kpiVariance(row.original);
          return (
            <span
              className={cn(
                "tabular-nums",
                variance >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400",
              )}
            >
              {formatSigned(variance)}
            </span>
          );
        },
      },
      {
        id: "trend",
        accessorFn: (row) => kpiTrend(row),
        header: "Trend",
        cell: ({ row }) => {
          const trend = kpiTrend(row.original);
          const Icon = trendIcon(trend);
          return (
            <div className="flex items-center gap-2">
              <NexoraSparkline values={row.original.history} positive={trend >= 0} />
              <span
                className={cn(
                  "inline-flex items-center gap-0.5 text-xs tabular-nums",
                  trend >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400",
                )}
              >
                <Icon className="size-3" />
                {formatSigned(trend)}
              </span>
            </div>
          );
        },
      },
      { id: "owner", accessorKey: "owner", header: "Owner" },
      {
        id: "status",
        accessorFn: (row) => kpiStatus(row),
        header: "Status",
        cell: ({ row }) => {
          const value = kpiStatus(row.original);
          return <StatusPill status={value} tone={STATUS_TONE[value]} />;
        },
      },
    ],
    [],
  );

  return (
    <>
      <NexoraDataTable
        data={rows}
        columns={columns}
        pageSize={10}
        searchPlaceholder="Search the KPI library"
        onRowClick={(kpi) => setSelected(kpi)}
        toolbar={
          <>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger size="sm" className="w-44" aria-label="Filter by category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger size="sm" className="w-40" aria-label="Filter by status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUSES.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </>
        }
      />

      <Dialog open={selected !== null} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          {selected ? (
            <>
              <DialogHeader>
                <DialogTitle className="flex flex-wrap items-center gap-2">
                  {selected.name}
                  <StatusPill status={kpiStatus(selected)} tone={STATUS_TONE[kpiStatus(selected)]} />
                </DialogTitle>
                <DialogDescription>{selected.definition}</DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-lg border p-3">
                  <p className="text-muted-foreground text-xs">Current</p>
                  <p className="font-semibold text-lg tabular-nums">{formatKpiValue(selected, selected.value)}</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-muted-foreground text-xs">Target</p>
                  <p className="font-semibold text-lg tabular-nums">{formatKpiValue(selected, selected.target)}</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-muted-foreground text-xs">Variance</p>
                  <p className="font-semibold text-lg tabular-nums">{formatSigned(kpiVariance(selected))}</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-muted-foreground text-xs">12 period trend</p>
                  <p className="font-semibold text-lg tabular-nums">{formatSigned(kpiTrend(selected))}</p>
                </div>
              </div>

              <NexoraLineChart
                data={selected.history.map((value, index) => ({ label: `P${index + 1}`, value }))}
                series={[{ key: "value", label: selected.name }]}
                xKey="label"
                height="h-56"
                format={chartFormat(selected.unit)}
              />

              <div>
                <MetricRow label="Owner" value={selected.owner} />
                <MetricRow label="Category" value={selected.category} />
                <MetricRow label="Reporting frequency" value={selected.frequency} />
                <MetricRow label="Source" value={selected.source} />
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setSelected(null)}>
                  Close
                </Button>
                <Button
                  onClick={() =>
                    toast.success(`${selected.name} subscribed`, {
                      description: "Threshold notifications are simulated in this demonstration.",
                    })
                  }
                >
                  Subscribe to alerts
                </Button>
              </DialogFooter>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
