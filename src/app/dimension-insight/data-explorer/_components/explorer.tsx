"use client";

import * as React from "react";

import type { ColumnDef } from "@tanstack/react-table";
import { Bookmark, Database, Filter, RotateCcw, SlidersHorizontal } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ANALYTICS_RECORDS, type AnalyticsRecord, PERIODS } from "@/data/dimension-insight/datasets";
import { formatCurrency, formatNumber, formatPercent } from "@/data/dimension-insight/format";
import type { DataTableFeatures } from "@/lib/data-table-features";

import { DimensionInsightBarChart } from "../../_components/charts";
import { DimensionInsightDataTable } from "../../_components/data-table";
import { ChartCard } from "../../_components/ui-blocks";

/* ------------------------------------------------------------------ */

const DATASETS = [
  { id: "analytics", label: "Analytics fact table", rows: ANALYTICS_RECORDS.length },
  { id: "revenue", label: "Revenue detail", rows: ANALYTICS_RECORDS.length },
  { id: "margin", label: "Margin detail", rows: ANALYTICS_RECORDS.length },
] as const;

const DIMENSIONS = [
  { id: "region", label: "Region" },
  { id: "country", label: "Country" },
  { id: "segment", label: "Segment" },
  { id: "channel", label: "Channel" },
  { id: "category", label: "Product category" },
  { id: "department", label: "Department" },
  { id: "period", label: "Period" },
] as const;

type DimensionId = (typeof DIMENSIONS)[number]["id"];

const METRICS = [
  { id: "revenue", label: "Revenue", format: "currency" },
  { id: "cost", label: "Cost", format: "currency" },
  { id: "profit", label: "Profit", format: "currency" },
  { id: "margin", label: "Margin", format: "percent" },
  { id: "orders", label: "Orders", format: "number" },
  { id: "customers", label: "Customers", format: "number" },
  { id: "sessions", label: "Sessions", format: "number" },
  { id: "conversionRate", label: "Conversion rate", format: "percent" },
] as const;

type MetricId = (typeof METRICS)[number]["id"];

const DATE_RANGES = [
  { id: "3", label: "Last 3 periods" },
  { id: "6", label: "Last 6 periods" },
  { id: "12", label: "Last 12 periods" },
  { id: "24", label: "All 24 periods" },
] as const;

const SAVED_VIEWS = [
  "Regional revenue by segment",
  "Channel margin analysis",
  "Category performance by period",
  "Department cost allocation",
];

type GroupedRow = Record<string, string | number>;

function aggregate(records: AnalyticsRecord[], groupBy: DimensionId, metrics: MetricId[]): GroupedRow[] {
  const buckets = new Map<string, AnalyticsRecord[]>();
  for (const record of records) {
    const key = String(record[groupBy]);
    const existing = buckets.get(key);
    if (existing) existing.push(record);
    else buckets.set(key, [record]);
  }

  return [...buckets.entries()]
    .map(([key, rows]) => {
      const row: GroupedRow = { group: key, records: rows.length };
      for (const metric of metrics) {
        const definition = METRICS.find((entry) => entry.id === metric);
        const total = rows.reduce((sum, record) => sum + Number(record[metric]), 0);
        row[metric] =
          definition?.format === "percent" ? Math.round((total / rows.length) * 100) / 100 : Math.round(total);
      }
      return row;
    })
    .sort((a, b) => Number(b[metrics[0]] ?? 0) - Number(a[metrics[0]] ?? 0));
}

function chartFormat(metric: MetricId) {
  const format = METRICS.find((entry) => entry.id === metric)?.format;
  if (format === "currency") return "currency" as const;
  return format === "percent" ? ("percent" as const) : ("number" as const);
}

function formatMetric(metric: MetricId, value: number) {
  const definition = METRICS.find((entry) => entry.id === metric);
  if (definition?.format === "currency") return formatCurrency(value, { compact: Math.abs(value) >= 100_000 });
  if (definition?.format === "percent") return formatPercent(value, 2);
  return formatNumber(value);
}

/* ------------------------------------------------------------------ */

export function DataExplorer() {
  const [dataset, setDataset] = React.useState<string>(DATASETS[0].id);
  const [groupBy, setGroupBy] = React.useState<DimensionId>("region");
  const [secondary, setSecondary] = React.useState<DimensionId | "none">("segment");
  const [metrics, setMetrics] = React.useState<MetricId[]>(["revenue", "profit", "margin", "orders"]);
  const [range, setRange] = React.useState<string>("12");
  const [regionFilter, setRegionFilter] = React.useState("All regions");
  const [segmentFilter, setSegmentFilter] = React.useState("All segments");
  const [channelFilter, setChannelFilter] = React.useState("All channels");
  const [savedView, setSavedView] = React.useState(SAVED_VIEWS[0]);
  const [filtersOpen, setFiltersOpen] = React.useState(false);

  const periodKeys = React.useMemo(() => new Set(PERIODS.slice(-Number(range)).map((period) => period.key)), [range]);

  const filtered = React.useMemo(
    () =>
      ANALYTICS_RECORDS.filter((record) => periodKeys.has(record.period))
        .filter((record) => regionFilter === "All regions" || record.region === regionFilter)
        .filter((record) => segmentFilter === "All segments" || record.segment === segmentFilter)
        .filter((record) => channelFilter === "All channels" || record.channel === channelFilter),
    [periodKeys, regionFilter, segmentFilter, channelFilter],
  );

  const grouped = React.useMemo(() => aggregate(filtered, groupBy, metrics), [filtered, groupBy, metrics]);

  const detail = React.useMemo(
    () => (secondary === "none" ? [] : aggregate(filtered, secondary, metrics.slice(0, 2)).slice(0, 12)),
    [filtered, secondary, metrics],
  );

  const columns = React.useMemo<ColumnDef<DataTableFeatures, GroupedRow>[]>(() => {
    const dimensionLabel = DIMENSIONS.find((entry) => entry.id === groupBy)?.label ?? "Group";
    return [
      {
        id: "group",
        accessorKey: "group",
        header: dimensionLabel,
        enableHiding: false,
        cell: ({ row }) => <span className="font-medium">{String(row.original.group)}</span>,
      },
      {
        id: "records",
        accessorKey: "records",
        header: "Records",
        cell: ({ row }) => <div className="text-right tabular-nums">{formatNumber(Number(row.original.records))}</div>,
      },
      ...metrics.map<ColumnDef<DataTableFeatures, GroupedRow>>((metric) => ({
        id: metric,
        accessorFn: (row: GroupedRow) => Number(row[metric] ?? 0),
        header: METRICS.find((entry) => entry.id === metric)?.label ?? metric,
        cell: ({ row }) => (
          <div className="text-right tabular-nums">{formatMetric(metric, Number(row.original[metric] ?? 0))}</div>
        ),
      })),
    ];
  }, [groupBy, metrics]);

  const toggleMetric = (metric: MetricId) => {
    setMetrics((current) => {
      if (current.includes(metric)) {
        if (current.length === 1) {
          toast.warning("At least one metric must remain selected.");
          return current;
        }
        return current.filter((entry) => entry !== metric);
      }
      return [...current, metric];
    });
  };

  const reset = () => {
    setDataset(DATASETS[0].id);
    setGroupBy("region");
    setSecondary("segment");
    setMetrics(["revenue", "profit", "margin", "orders"]);
    setRange("12");
    setRegionFilter("All regions");
    setSegmentFilter("All segments");
    setChannelFilter("All channels");
    toast.success("Exploration reset to the default configuration.");
  };

  const regionOptions = ["All regions", ...new Set(ANALYTICS_RECORDS.map((record) => record.region))];
  const segmentOptions = ["All segments", ...new Set(ANALYTICS_RECORDS.map((record) => record.segment))];
  const channelOptions = ["All channels", ...new Set(ANALYTICS_RECORDS.map((record) => record.channel))];

  const controls = (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="explorer-dataset">Dataset</Label>
        <Select value={dataset} onValueChange={setDataset}>
          <SelectTrigger id="explorer-dataset" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {DATASETS.map((item) => (
              <SelectItem key={item.id} value={item.id}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="explorer-dimension">Primary dimension</Label>
        <Select value={groupBy} onValueChange={(value) => setGroupBy(value as DimensionId)}>
          <SelectTrigger id="explorer-dimension" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {DIMENSIONS.map((item) => (
              <SelectItem key={item.id} value={item.id}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="explorer-secondary">Secondary dimension</Label>
        <Select value={secondary} onValueChange={(value) => setSecondary(value as DimensionId | "none")}>
          <SelectTrigger id="explorer-secondary" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            {DIMENSIONS.map((item) => (
              <SelectItem key={item.id} value={item.id}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Metrics</Label>
        <div className="grid grid-cols-1 gap-2">
          {METRICS.map((metric) => (
            <label key={metric.id} className="flex items-center gap-2 text-sm" htmlFor={`metric-${metric.id}`}>
              <Checkbox
                id={`metric-${metric.id}`}
                checked={metrics.includes(metric.id)}
                onCheckedChange={() => toggleMetric(metric.id)}
              />
              {metric.label}
            </label>
          ))}
        </div>
      </div>

      <Separator />

      <div className="space-y-1.5">
        <Label htmlFor="explorer-range">Date range</Label>
        <Select value={range} onValueChange={setRange}>
          <SelectTrigger id="explorer-range" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {DATE_RANGES.map((item) => (
              <SelectItem key={item.id} value={item.id}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="explorer-region">Region filter</Label>
        <Select value={regionFilter} onValueChange={setRegionFilter}>
          <SelectTrigger id="explorer-region" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {regionOptions.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="explorer-segment">Segment filter</Label>
        <Select value={segmentFilter} onValueChange={setSegmentFilter}>
          <SelectTrigger id="explorer-segment" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {segmentOptions.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="explorer-channel">Channel filter</Label>
        <Select value={channelFilter} onValueChange={setChannelFilter}>
          <SelectTrigger id="explorer-channel" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {channelOptions.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      <div className="space-y-1.5">
        <Label htmlFor="explorer-view">Saved view</Label>
        <Select value={savedView} onValueChange={setSavedView}>
          <SelectTrigger id="explorer-view" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SAVED_VIEWS.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          onClick={() =>
            toast.success("View saved for this session", {
              description: `${savedView} · grouped by ${groupBy} · ${metrics.length} metrics. Saved views are temporary in this demo.`,
            })
          }
        >
          <Bookmark className="size-4" />
          Save view
        </Button>
        <Button size="sm" variant="outline" onClick={reset}>
          <RotateCcw className="size-4" />
          Reset
        </Button>
      </div>
    </div>
  );

  const totalRevenue = filtered.reduce((sum, record) => sum + record.revenue, 0);
  const totalProfit = filtered.reduce((sum, record) => sum + record.profit, 0);

  return (
    <div className="grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-[300px_minmax(0,1fr)]">
      <Card className="hidden h-fit xl:block">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2 text-base">
            <SlidersHorizontal className="size-4" />
            Exploration
          </CardTitle>
          <CardDescription className="text-xs">
            Configure the dataset, dimensions, metrics and filters for this analysis.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">{controls}</CardContent>
      </Card>

      <div className="flex min-w-0 flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="xl:hidden">
                <Filter className="size-4" />
                Exploration settings
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[min(22rem,92vw)] overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Exploration settings</SheetTitle>
                <SheetDescription>Dataset, dimensions, metrics, date range and filters.</SheetDescription>
              </SheetHeader>
              <div className="px-4 pb-8">{controls}</div>
            </SheetContent>
          </Sheet>

          <Badge variant="outline" className="gap-1">
            <Database className="size-3" />
            {formatNumber(filtered.length)} of {formatNumber(ANALYTICS_RECORDS.length)} rows
          </Badge>
          <Badge variant="outline">Revenue {formatCurrency(totalRevenue, { compact: true })}</Badge>
          <Badge variant="outline">Profit {formatCurrency(totalProfit, { compact: true })}</Badge>
          <Badge variant="outline">Grouped by {DIMENSIONS.find((entry) => entry.id === groupBy)?.label}</Badge>
        </div>

        <ChartCard
          title={`${METRICS.find((entry) => entry.id === metrics[0])?.label ?? "Metric"} by ${
            DIMENSIONS.find((entry) => entry.id === groupBy)?.label.toLowerCase() ?? "group"
          }`}
          description="Aggregated from the filtered analytics fact table"
        >
          <DimensionInsightBarChart
            data={grouped.slice(0, 12).map((row) => ({ name: String(row.group), value: Number(row[metrics[0]] ?? 0) }))}
            series={[{ key: "value", label: METRICS.find((entry) => entry.id === metrics[0])?.label ?? "Value" }]}
            xKey="name"
            layout="horizontal"
            format={chartFormat(metrics[0])}
            height={grouped.length > 7 ? "h-96" : "h-72"}
          />
        </ChartCard>

        <Card className="overflow-hidden">
          <CardHeader className="border-b">
            <CardTitle className="text-base">Analytical table</CardTitle>
            <CardDescription className="text-xs">
              Search, sort, hide columns and page through the aggregated result set.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <DimensionInsightDataTable
              data={grouped}
              columns={columns}
              pageSize={10}
              searchPlaceholder="Search grouped results"
            />
          </CardContent>
        </Card>

        {secondary !== "none" && detail.length > 0 ? (
          <ChartCard
            title={`Breakdown by ${DIMENSIONS.find((entry) => entry.id === secondary)?.label.toLowerCase()}`}
            description="Secondary dimension applied to the same filtered result set"
          >
            <DimensionInsightBarChart
              data={detail.map((row) => ({ name: String(row.group), value: Number(row[metrics[0]] ?? 0) }))}
              series={[{ key: "value", label: METRICS.find((entry) => entry.id === metrics[0])?.label ?? "Value" }]}
              xKey="name"
              layout="horizontal"
              format={METRICS.find((entry) => entry.id === metrics[0])?.format === "currency" ? "currency" : "number"}
              height="h-80"
            />
          </ChartCard>
        ) : null}
      </div>
    </div>
  );
}
