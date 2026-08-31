"use client";

import * as React from "react";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Funnel,
  FunnelChart,
  LabelList,
  Line,
  LineChart,
  Pie,
  PieChart,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";

import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { formatCompact } from "@/data/nexora/format";
import { cn } from "@/lib/utils";

import { AXIS_PROPS, GRID_PROPS, seriesColor } from "./chart-theme";

export interface SeriesSpec {
  key: string;
  label: string;
  color?: string;
  /** Only used by the composed chart. */
  type?: "bar" | "line" | "area";
  yAxisId?: "left" | "right";
}

type ChartRow = Record<string, string | number>;

/** Recharts does not expose the active payload in its public handler type. */
function readActivePayload(state: unknown): ChartRow | undefined {
  const active = (state as { activePayload?: { payload?: ChartRow }[] } | undefined)?.activePayload;
  return active?.[0]?.payload;
}

function buildConfig(series: SeriesSpec[]): ChartConfig {
  return Object.fromEntries(
    series.map((entry, index) => [entry.key, { label: entry.label, color: entry.color ?? seriesColor(index) }]),
  );
}

const currencyTick = (value: number) => formatCompact(value);
const plainTick = (value: number) => (Math.abs(value) >= 10_000 ? formatCompact(value) : value.toLocaleString("en-US"));

export type ValueFormat = "currency" | "number" | "percent";

function tickFormatter(format: ValueFormat) {
  if (format === "currency") return (value: number) => `$${currencyTick(value)}`;
  if (format === "percent") return (value: number) => `${value}%`;
  return plainTick;
}

interface BaseChartProps {
  data: ChartRow[];
  series: SeriesSpec[];
  xKey: string;
  height?: string;
  format?: ValueFormat;
  className?: string;
  onPointClick?: (row: ChartRow) => void;
}

/* ---------------------------------------------------------------- Line */

export function NexoraLineChart({
  data,
  series,
  xKey,
  height = "h-72",
  format = "number",
  className,
  onPointClick,
}: BaseChartProps) {
  const config = buildConfig(series);
  return (
    <ChartContainer config={config} className={cn(height, "w-full", className)}>
      <LineChart
        data={data}
        margin={{ left: 4, right: 8, top: 8, bottom: 0 }}
        onClick={(state) => {
          const payload = readActivePayload(state);
          if (payload && onPointClick) onPointClick(payload);
        }}
      >
        <CartesianGrid {...GRID_PROPS} />
        <XAxis dataKey={xKey} {...AXIS_PROPS} minTickGap={16} />
        <YAxis {...AXIS_PROPS} width={52} tickFormatter={tickFormatter(format)} />
        <ChartTooltip content={<ChartTooltipContent />} />
        {series.map((entry, index) => (
          <Line
            key={entry.key}
            dataKey={entry.key}
            type="monotone"
            stroke={entry.color ?? seriesColor(index)}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        ))}
      </LineChart>
    </ChartContainer>
  );
}

/* ---------------------------------------------------------------- Area */

export function NexoraAreaChart({
  data,
  series,
  xKey,
  height = "h-72",
  format = "number",
  className,
  stacked = false,
  onPointClick,
}: BaseChartProps & { stacked?: boolean }) {
  const config = buildConfig(series);
  const gradientId = React.useId().replace(/:/g, "");
  return (
    <ChartContainer config={config} className={cn(height, "w-full", className)}>
      <AreaChart
        data={data}
        margin={{ left: 4, right: 8, top: 8, bottom: 0 }}
        onClick={(state) => {
          const payload = readActivePayload(state);
          if (payload && onPointClick) onPointClick(payload);
        }}
      >
        <defs>
          {series.map((entry, index) => (
            <linearGradient key={entry.key} id={`${gradientId}-${entry.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={entry.color ?? seriesColor(index)} stopOpacity={0.45} />
              <stop offset="95%" stopColor={entry.color ?? seriesColor(index)} stopOpacity={0.02} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid {...GRID_PROPS} />
        <XAxis dataKey={xKey} {...AXIS_PROPS} minTickGap={16} />
        <YAxis {...AXIS_PROPS} width={52} tickFormatter={tickFormatter(format)} />
        <ChartTooltip content={<ChartTooltipContent />} />
        {series.map((entry, index) => (
          <Area
            key={entry.key}
            dataKey={entry.key}
            type="monotone"
            stackId={stacked ? "stack" : undefined}
            stroke={entry.color ?? seriesColor(index)}
            strokeWidth={2}
            fill={`url(#${gradientId}-${entry.key})`}
          />
        ))}
      </AreaChart>
    </ChartContainer>
  );
}

/* ----------------------------------------------------------------- Bar */

export function NexoraBarChart({
  data,
  series,
  xKey,
  height = "h-72",
  format = "number",
  className,
  layout = "vertical",
  stacked = false,
  onPointClick,
}: BaseChartProps & { layout?: "vertical" | "horizontal"; stacked?: boolean }) {
  const config = buildConfig(series);
  const horizontal = layout === "horizontal";
  return (
    <ChartContainer config={config} className={cn(height, "w-full", className)}>
      <BarChart
        data={data}
        layout={horizontal ? "vertical" : "horizontal"}
        margin={{ left: horizontal ? 8 : 4, right: 12, top: 8, bottom: 0 }}
        onClick={(state) => {
          const payload = readActivePayload(state);
          if (payload && onPointClick) onPointClick(payload);
        }}
      >
        <CartesianGrid {...GRID_PROPS} vertical={horizontal} horizontal={!horizontal} />
        {horizontal ? (
          <>
            <XAxis type="number" {...AXIS_PROPS} tickFormatter={tickFormatter(format)} />
            <YAxis type="category" dataKey={xKey} {...AXIS_PROPS} width={120} />
          </>
        ) : (
          <>
            <XAxis dataKey={xKey} {...AXIS_PROPS} minTickGap={12} />
            <YAxis {...AXIS_PROPS} width={52} tickFormatter={tickFormatter(format)} />
          </>
        )}
        <ChartTooltip content={<ChartTooltipContent />} />
        {series.map((entry, index) => (
          <Bar
            key={entry.key}
            dataKey={entry.key}
            stackId={stacked ? "stack" : undefined}
            fill={entry.color ?? seriesColor(index)}
            radius={horizontal ? [0, 4, 4, 0] : [4, 4, 0, 0]}
            maxBarSize={horizontal ? 22 : 46}
            className={onPointClick ? "cursor-pointer" : undefined}
          />
        ))}
      </BarChart>
    </ChartContainer>
  );
}

/* ------------------------------------------------------------ Pie/Donut */

export function NexoraPieChart({
  data,
  nameKey = "name",
  valueKey = "value",
  height = "h-72",
  donut = false,
  className,
  onPointClick,
}: {
  data: ChartRow[];
  nameKey?: string;
  valueKey?: string;
  height?: string;
  donut?: boolean;
  className?: string;
  onPointClick?: (row: ChartRow) => void;
}) {
  const config = Object.fromEntries(
    data.map((row, index) => [String(row[nameKey]), { label: String(row[nameKey]), color: seriesColor(index) }]),
  ) as ChartConfig;

  return (
    <ChartContainer config={config} className={cn(height, "w-full", className)}>
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent nameKey={nameKey} />} />
        <Pie
          data={data}
          dataKey={valueKey}
          nameKey={nameKey}
          innerRadius={donut ? "52%" : 0}
          outerRadius="78%"
          paddingAngle={donut ? 2 : 0}
          strokeWidth={1}
          onClick={(entry: unknown) => onPointClick?.(entry as ChartRow)}
        >
          {data.map((row, index) => (
            <Cell
              key={String(row[nameKey])}
              fill={seriesColor(index)}
              className={onPointClick ? "cursor-pointer" : undefined}
            />
          ))}
        </Pie>
      </PieChart>
    </ChartContainer>
  );
}

/* ------------------------------------------------------------- Scatter */

export function NexoraScatterChart({
  data,
  xKey,
  yKey,
  zKey,
  xLabel,
  yLabel,
  height = "h-72",
  className,
}: {
  data: ChartRow[];
  xKey: string;
  yKey: string;
  zKey?: string;
  xLabel: string;
  yLabel: string;
  height?: string;
  className?: string;
}) {
  const config: ChartConfig = { [yKey]: { label: yLabel, color: seriesColor(0) } };
  return (
    <ChartContainer config={config} className={cn(height, "w-full", className)}>
      <ScatterChart margin={{ left: 4, right: 12, top: 8, bottom: 4 }}>
        <CartesianGrid {...GRID_PROPS} vertical />
        <XAxis type="number" dataKey={xKey} name={xLabel} {...AXIS_PROPS} />
        <YAxis type="number" dataKey={yKey} name={yLabel} {...AXIS_PROPS} width={52} />
        {zKey ? <ZAxis type="number" dataKey={zKey} range={[40, 320]} /> : null}
        <ChartTooltip content={<ChartTooltipContent nameKey="name" />} cursor={{ strokeDasharray: "3 3" }} />
        <Scatter data={data} fill={seriesColor(0)} fillOpacity={0.65} />
      </ScatterChart>
    </ChartContainer>
  );
}

/* ------------------------------------------------------------ Composed */

export function NexoraComposedChart({
  data,
  series,
  xKey,
  height = "h-72",
  format = "number",
  className,
}: BaseChartProps) {
  const config = buildConfig(series);
  return (
    <ChartContainer config={config} className={cn(height, "w-full", className)}>
      <ComposedChart data={data} margin={{ left: 4, right: 8, top: 8, bottom: 0 }}>
        <CartesianGrid {...GRID_PROPS} />
        <XAxis dataKey={xKey} {...AXIS_PROPS} minTickGap={16} />
        <YAxis yAxisId="left" {...AXIS_PROPS} width={52} tickFormatter={tickFormatter(format)} />
        <YAxis yAxisId="right" orientation="right" {...AXIS_PROPS} width={44} />
        <ChartTooltip content={<ChartTooltipContent />} />
        {series.map((entry, index) => {
          const color = entry.color ?? seriesColor(index);
          const axis = entry.yAxisId ?? "left";
          if (entry.type === "line") {
            return (
              <Line
                key={entry.key}
                yAxisId={axis}
                dataKey={entry.key}
                type="monotone"
                stroke={color}
                strokeWidth={2}
                dot={false}
              />
            );
          }
          if (entry.type === "area") {
            return (
              <Area
                key={entry.key}
                yAxisId={axis}
                dataKey={entry.key}
                type="monotone"
                stroke={color}
                fill={color}
                fillOpacity={0.16}
                strokeWidth={2}
              />
            );
          }
          return (
            <Bar
              key={entry.key}
              yAxisId={axis}
              dataKey={entry.key}
              fill={color}
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
          );
        })}
      </ComposedChart>
    </ChartContainer>
  );
}

/* -------------------------------------------------------------- Funnel */

export function NexoraFunnelChart({
  data,
  height = "h-72",
  className,
}: {
  data: { name: string; value: number }[];
  height?: string;
  className?: string;
}) {
  const config = Object.fromEntries(
    data.map((row, index) => [row.name, { label: row.name, color: seriesColor(index) }]),
  ) as ChartConfig;

  const shaped = data.map((row, index) => ({ ...row, fill: seriesColor(index) }));

  return (
    <ChartContainer config={config} className={cn(height, "w-full", className)}>
      <FunnelChart margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
        <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
        <Funnel dataKey="value" data={shaped} isAnimationActive stroke="none">
          <LabelList position="right" dataKey="name" className="fill-foreground text-xs" stroke="none" />
        </Funnel>
      </FunnelChart>
    </ChartContainer>
  );
}

/* ---------------------------------------------------------- Sparkline */

export function NexoraSparkline({ values, positive = true }: { values: number[]; positive?: boolean }) {
  const data = values.map((value, index) => ({ index, value }));
  const color = positive ? "var(--color-emerald-500)" : "var(--color-rose-500)";
  return (
    <ChartContainer config={{ value: { label: "Value", color } }} className="h-9 w-24">
      <LineChart data={data} margin={{ top: 2, bottom: 2, left: 0, right: 0 }}>
        <Line dataKey="value" type="monotone" stroke={color} strokeWidth={1.6} dot={false} isAnimationActive={false} />
      </LineChart>
    </ChartContainer>
  );
}
