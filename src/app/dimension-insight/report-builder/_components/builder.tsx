"use client";

import * as React from "react";

import {
  AreaChart,
  BarChart3,
  CircleDot,
  Filter,
  LayoutGrid,
  LineChart,
  ListFilter,
  PieChart,
  Play,
  Rows3,
  Save,
  ScatterChart,
  Table2,
  Trash2,
  TrendingDown,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ANALYTICS_RECORDS, MONTHLY } from "@/data/dimension-insight/datasets";
import { formatCurrency, formatNumber, formatPercent } from "@/data/dimension-insight/format";
import { cn } from "@/lib/utils";

import {
  DimensionInsightAreaChart,
  DimensionInsightBarChart,
  DimensionInsightComposedChart,
  DimensionInsightFunnelChart,
  DimensionInsightLineChart,
  DimensionInsightPieChart,
  DimensionInsightScatterChart,
} from "../../_components/charts";
import { QuickTable } from "../../_components/quick-table";
import { ChartCard, KpiCard } from "../../_components/ui-blocks";

const DATASETS = [
  { id: "analytics", label: "Analytics fact table" },
  { id: "monthly", label: "Monthly performance series" },
] as const;

const DIMENSIONS = [
  { id: "region", label: "Region" },
  { id: "country", label: "Country" },
  { id: "segment", label: "Segment" },
  { id: "channel", label: "Channel" },
  { id: "category", label: "Product category" },
  { id: "department", label: "Department" },
] as const;

type DimensionId = (typeof DIMENSIONS)[number]["id"];

const METRICS = [
  { id: "revenue", label: "Revenue", format: "currency" as const },
  { id: "cost", label: "Cost", format: "currency" as const },
  { id: "profit", label: "Profit", format: "currency" as const },
  { id: "margin", label: "Margin", format: "percent" as const },
  { id: "orders", label: "Orders", format: "number" as const },
  { id: "customers", label: "Customers", format: "number" as const },
] as const;

type MetricId = (typeof METRICS)[number]["id"];

const CHART_TYPES = [
  { id: "line", label: "Line", icon: LineChart },
  { id: "bar", label: "Bar", icon: BarChart3 },
  { id: "area", label: "Area", icon: AreaChart },
  { id: "pie", label: "Pie", icon: PieChart },
  { id: "donut", label: "Donut", icon: CircleDot },
  { id: "scatter", label: "Scatter", icon: ScatterChart },
  { id: "composed", label: "Composed", icon: Rows3 },
  { id: "funnel", label: "Funnel", icon: TrendingDown },
  { id: "kpi", label: "KPI", icon: LayoutGrid },
  { id: "table", label: "Table", icon: Table2 },
] as const;

type ChartTypeId = (typeof CHART_TYPES)[number]["id"];

const LAYOUTS = [
  { id: "single", label: "Single column" },
  { id: "split", label: "Two column split" },
  { id: "grid", label: "Summary grid" },
] as const;

type LayoutId = (typeof LAYOUTS)[number]["id"];

const DATE_RANGES = ["Last 3 periods", "Last 6 periods", "Last 12 periods", "All 24 periods"];
const RANGE_TO_COUNT: Record<string, number> = {
  "Last 3 periods": 3,
  "Last 6 periods": 6,
  "Last 12 periods": 12,
  "All 24 periods": 24,
};

function metricFormat(metric: MetricId) {
  return METRICS.find((entry) => entry.id === metric)?.format ?? "number";
}

function metricLabel(metric: MetricId) {
  return METRICS.find((entry) => entry.id === metric)?.label ?? metric;
}

function quickFormat(metric: MetricId) {
  const format = metricFormat(metric);
  if (format === "currency") return "compactCurrency" as const;
  return format === "percent" ? ("percent" as const) : ("number" as const);
}

function formatByType(format: "currency" | "percent" | "number", value: number) {
  if (format === "currency") return formatCurrency(value, { compact: true });
  return format === "percent" ? formatPercent(value) : formatNumber(value);
}

interface BuilderFilter {
  id: string;
  field: DimensionId;
  operator: "is" | "is not";
  value: string;
}

/* ------------------------------------------------------------------ */

export function ReportBuilder() {
  const [name, setName] = React.useState("Untitled analysis");
  const [dataset, setDataset] = React.useState<string>("analytics");
  const [dimension, setDimension] = React.useState<DimensionId>("region");
  const [metrics, setMetrics] = React.useState<MetricId[]>(["revenue", "profit"]);
  const [chartType, setChartType] = React.useState<ChartTypeId>("bar");
  const [layout, setLayout] = React.useState<LayoutId>("split");
  const [range, setRange] = React.useState(DATE_RANGES[2]);
  const [filters, setFilters] = React.useState<BuilderFilter[]>([
    { id: "filter-1", field: "segment", operator: "is", value: "Enterprise" },
  ]);

  const periodCount = RANGE_TO_COUNT[range] ?? 12;
  const periodKeys = React.useMemo(() => new Set(MONTHLY.slice(-periodCount).map((row) => row.key)), [periodCount]);

  const filteredRecords = React.useMemo(
    () =>
      ANALYTICS_RECORDS.filter((record) => periodKeys.has(record.period)).filter((record) =>
        filters.every((filter) => {
          const value = String(record[filter.field]);
          return filter.operator === "is" ? value === filter.value : value !== filter.value;
        }),
      ),
    [periodKeys, filters],
  );

  const grouped = React.useMemo(() => {
    const buckets = new Map<string, typeof ANALYTICS_RECORDS>();
    for (const record of filteredRecords) {
      const key = String(record[dimension]);
      const existing = buckets.get(key);
      if (existing) existing.push(record);
      else buckets.set(key, [record]);
    }
    return [...buckets.entries()]
      .map(([key, rows]) => {
        const row: Record<string, string | number> = { name: key };
        for (const metric of metrics) {
          const definition = METRICS.find((entry) => entry.id === metric);
          const total = rows.reduce((sum, record) => sum + Number(record[metric]), 0);
          row[metric] =
            definition?.format === "percent" ? Math.round((total / rows.length) * 100) / 100 : Math.round(total);
        }
        row.value = Number(row[metrics[0]] ?? 0);
        return row;
      })
      .sort((a, b) => Number(b.value) - Number(a.value));
  }, [filteredRecords, dimension, metrics]);

  const timeSeries = React.useMemo(
    () =>
      MONTHLY.slice(-periodCount).map((row) => ({
        label: row.label,
        revenue: row.revenue,
        cost: row.expenses,
        profit: row.profit,
        margin: row.netMargin,
        orders: row.orders,
        customers: row.customers,
      })),
    [periodCount],
  );

  const primaryFormat = METRICS.find((entry) => entry.id === metrics[0])?.format ?? "number";
  const series = metrics.map((metric) => ({
    key: metric,
    label: METRICS.find((entry) => entry.id === metric)?.label ?? metric,
  }));

  const toggleMetric = (metric: MetricId) => {
    setMetrics((current) => {
      if (current.includes(metric)) {
        if (current.length === 1) {
          toast.warning("Keep at least one metric in the report.");
          return current;
        }
        return current.filter((entry) => entry !== metric);
      }
      return [...current, metric];
    });
  };

  const addFilter = () => {
    const values = [...new Set(ANALYTICS_RECORDS.map((record) => String(record.region)))];
    setFilters((current) => [
      ...current,
      { id: `filter-${current.length + 1}-${Date.now()}`, field: "region", operator: "is", value: values[0] },
    ]);
  };

  const filterValues = (field: DimensionId) => [...new Set(ANALYTICS_RECORDS.map((record) => String(record[field])))];

  const renderVisual = () => {
    switch (chartType) {
      case "line":
        return <DimensionInsightLineChart data={timeSeries} series={series} xKey="label" format={primaryFormat} />;
      case "area":
        return <DimensionInsightAreaChart data={timeSeries} series={series} xKey="label" format={primaryFormat} />;
      case "composed":
        return (
          <DimensionInsightComposedChart
            data={timeSeries}
            series={series.map((entry, index) => ({ ...entry, type: index === 0 ? "bar" : "line" }))}
            xKey="label"
            format={primaryFormat}
          />
        );
      case "pie":
        return (
          <DimensionInsightPieChart
            data={grouped.map((row) => ({ name: String(row.name), value: Number(row.value) }))}
          />
        );
      case "donut":
        return (
          <DimensionInsightPieChart
            data={grouped.map((row) => ({ name: String(row.name), value: Number(row.value) }))}
            donut
          />
        );
      case "scatter":
        return (
          <DimensionInsightScatterChart
            data={grouped.map((row) => ({
              name: String(row.name),
              x: Number(row[metrics[0]] ?? 0),
              y: Number(row[metrics[1] ?? metrics[0]] ?? 0),
            }))}
            xKey="x"
            yKey="y"
            xLabel={METRICS.find((entry) => entry.id === metrics[0])?.label ?? "Metric"}
            yLabel={METRICS.find((entry) => entry.id === (metrics[1] ?? metrics[0]))?.label ?? "Metric"}
          />
        );
      case "funnel":
        return (
          <DimensionInsightFunnelChart
            data={grouped.slice(0, 6).map((row) => ({ name: String(row.name), value: Number(row.value) }))}
          />
        );
      case "kpi":
        return (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {grouped.slice(0, 6).map((row) => (
              <KpiCard
                key={String(row.name)}
                label={String(row.name)}
                value={formatByType(primaryFormat, Number(row.value))}
                footnote={`${METRICS.find((entry) => entry.id === metrics[0])?.label} · ${range.toLowerCase()}`}
              />
            ))}
          </div>
        );
      case "table":
        return (
          <QuickTable
            showColumnToggle={false}
            searchPlaceholder="Search report rows"
            rows={grouped.map((row) => {
              const output: Record<string, string | number> = { name: String(row.name) };
              for (const metric of metrics) output[metric] = Number(row[metric] ?? 0);
              return output;
            })}
            columns={[
              { key: "name", header: DIMENSIONS.find((entry) => entry.id === dimension)?.label ?? "Group" },
              ...metrics.map((metric) => ({
                key: metric,
                header: metricLabel(metric),
                format: quickFormat(metric),
              })),
            ]}
          />
        );
      default:
        return (
          <DimensionInsightBarChart
            data={grouped}
            series={series}
            xKey="name"
            layout="horizontal"
            format={primaryFormat}
            height={grouped.length > 6 ? "h-96" : "h-72"}
          />
        );
    }
  };

  const totalPrimary = grouped.reduce((sum, row) => sum + Number(row[metrics[0]] ?? 0), 0);

  const configPanel = (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="builder-name">Report name</Label>
        <Input id="builder-name" value={name} onChange={(event) => setName(event.target.value)} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="builder-dataset">Dataset</Label>
        <Select value={dataset} onValueChange={setDataset}>
          <SelectTrigger id="builder-dataset" className="w-full">
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
        <Label htmlFor="builder-dimension">Dimension</Label>
        <Select value={dimension} onValueChange={(value) => setDimension(value as DimensionId)}>
          <SelectTrigger id="builder-dimension" className="w-full">
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

      <div className="space-y-2">
        <Label>Metrics</Label>
        <div className="grid grid-cols-2 gap-2">
          {METRICS.map((metric) => (
            <label key={metric.id} className="flex items-center gap-2 text-sm" htmlFor={`builder-metric-${metric.id}`}>
              <Checkbox
                id={`builder-metric-${metric.id}`}
                checked={metrics.includes(metric.id)}
                onCheckedChange={() => toggleMetric(metric.id)}
              />
              {metric.label}
            </label>
          ))}
        </div>
      </div>

      <Separator />

      <div className="space-y-2">
        <Label>Chart type</Label>
        <div className="grid grid-cols-2 gap-2">
          {CHART_TYPES.map((type) => (
            <Button
              key={type.id}
              type="button"
              variant={chartType === type.id ? "default" : "outline"}
              size="sm"
              className={cn("justify-start")}
              onClick={() => setChartType(type.id)}
            >
              <type.icon className="size-4" />
              {type.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="builder-range">Date range</Label>
        <Select value={range} onValueChange={setRange}>
          <SelectTrigger id="builder-range" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {DATE_RANGES.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="builder-layout">Layout</Label>
        <Select value={layout} onValueChange={(value) => setLayout(value as LayoutId)}>
          <SelectTrigger id="builder-layout" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {LAYOUTS.map((item) => (
              <SelectItem key={item.id} value={item.id}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Filters</Label>
          <Button type="button" variant="ghost" size="sm" onClick={addFilter}>
            <ListFilter className="size-4" />
            Add
          </Button>
        </div>
        <div className="space-y-3">
          {filters.length === 0 ? (
            <p className="text-muted-foreground text-xs">No filters applied. The full result set is included.</p>
          ) : null}
          {filters.map((filter) => (
            <div key={filter.id} className="space-y-2 rounded-lg border p-3">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="gap-1">
                  <Filter className="size-3" />
                  Filter
                </Badge>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Remove filter"
                  onClick={() => setFilters((current) => current.filter((entry) => entry.id !== filter.id))}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
              <Select
                value={filter.field}
                onValueChange={(value) =>
                  setFilters((current) =>
                    current.map((entry) =>
                      entry.id === filter.id
                        ? { ...entry, field: value as DimensionId, value: filterValues(value as DimensionId)[0] }
                        : entry,
                    ),
                  )
                }
              >
                <SelectTrigger size="sm" className="w-full" aria-label="Filter field">
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
              <div className="flex gap-2">
                <Select
                  value={filter.operator}
                  onValueChange={(value) =>
                    setFilters((current) =>
                      current.map((entry) =>
                        entry.id === filter.id ? { ...entry, operator: value as "is" | "is not" } : entry,
                      ),
                    )
                  }
                >
                  <SelectTrigger size="sm" className="w-24" aria-label="Filter operator">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="is">is</SelectItem>
                    <SelectItem value="is not">is not</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={filter.value}
                  onValueChange={(value) =>
                    setFilters((current) =>
                      current.map((entry) => (entry.id === filter.id ? { ...entry, value } : entry)),
                    )
                  }
                >
                  <SelectTrigger size="sm" className="flex-1" aria-label="Filter value">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {filterValues(filter.field).map((value) => (
                      <SelectItem key={value} value={value}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          onClick={() =>
            toast.success(`${name} generated`, {
              description: `${chartType} visual · ${metrics.length} metrics · ${grouped.length} groups. Report generation is simulated.`,
            })
          }
        >
          <Play className="size-4" />
          Generate
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() =>
            toast.message("Draft kept for this session", {
              description: "Report builder state is temporary and is not persisted in this demonstration.",
            })
          }
        >
          <Save className="size-4" />
          Save draft
        </Button>
      </div>
    </div>
  );

  return (
    <div className="grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-[340px_minmax(0,1fr)]">
      <Card className="h-fit">
        <CardHeader className="border-b">
          <CardTitle className="text-base">Report configuration</CardTitle>
          <CardDescription className="text-xs">
            Every selection updates the preview immediately. All state is local to this session.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">{configPanel}</CardContent>
      </Card>

      <div className="flex min-w-0 flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline">{DATASETS.find((entry) => entry.id === dataset)?.label}</Badge>
          <Badge variant="outline">{DIMENSIONS.find((entry) => entry.id === dimension)?.label}</Badge>
          <Badge variant="outline">{metrics.length} metrics</Badge>
          <Badge variant="outline">{range}</Badge>
          <Badge variant="outline">{filters.length} filters</Badge>
          <Badge variant="outline">{LAYOUTS.find((entry) => entry.id === layout)?.label}</Badge>
        </div>

        <div
          className={cn(
            "grid min-w-0 gap-4",
            layout === "split" && "xl:grid-cols-2",
            layout === "grid" && "md:grid-cols-2 xl:grid-cols-3",
          )}
        >
          <ChartCard
            title={name}
            description={`${CHART_TYPES.find((entry) => entry.id === chartType)?.label} visual over ${filteredRecords.length} filtered records`}
            className={cn(layout === "grid" && "md:col-span-2 xl:col-span-3")}
          >
            {renderVisual()}
          </ChartCard>

          <KpiCard
            label={`Total ${METRICS.find((entry) => entry.id === metrics[0])?.label.toLowerCase()}`}
            value={formatByType(
              primaryFormat,
              primaryFormat === "percent" ? totalPrimary / Math.max(1, grouped.length) : totalPrimary,
            )}
            footnote={`Across ${grouped.length} ${DIMENSIONS.find((entry) => entry.id === dimension)?.label.toLowerCase()} groups`}
          />

          <KpiCard
            label="Records in scope"
            value={formatNumber(filteredRecords.length)}
            footnote={`${range} · ${filters.length} filters applied`}
          />

          {layout !== "single" ? (
            <ChartCard title="Distribution" description="Share of the primary metric by group">
              <DimensionInsightPieChart
                data={grouped.slice(0, 8).map((row) => ({ name: String(row.name), value: Number(row.value) }))}
                donut
              />
            </ChartCard>
          ) : null}
        </div>
      </div>
    </div>
  );
}
