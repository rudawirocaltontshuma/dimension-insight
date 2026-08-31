"use client";

import { EXPENSE_BREAKDOWN, REVENUE_BY_CATEGORY, REVENUE_BY_REGION } from "@/data/dimension-insight/aggregates";
import { MONTHLY } from "@/data/dimension-insight/datasets";

import {
  DimensionInsightAreaChart,
  DimensionInsightBarChart,
  DimensionInsightComposedChart,
  DimensionInsightLineChart,
  DimensionInsightPieChart,
} from "../../_components/charts";
import { ChartCard } from "../../_components/ui-blocks";

const TREND = MONTHLY.map((row) => ({
  label: row.label,
  revenue: row.revenue,
  profit: row.profit,
  expenses: row.expenses,
  customers: row.customers,
  newCustomers: row.newCustomers,
  headcount: row.headcount,
  hires: row.hires,
  efficiency: row.efficiency,
  fulfillmentRate: row.fulfillmentRate,
  onTimeDelivery: row.onTimeDelivery,
  netMargin: row.netMargin,
}));

export function RevenueTrendChart() {
  return (
    <ChartCard
      title="Revenue trend"
      description="Monthly recognised revenue across the trailing 24 periods"
      className="xl:col-span-2"
    >
      <DimensionInsightAreaChart
        data={TREND}
        series={[{ key: "revenue", label: "Revenue" }]}
        xKey="label"
        format="currency"
      />
    </ChartCard>
  );
}

export function ProfitTrendChart() {
  return (
    <ChartCard title="Profit trend" description="Operating profit and net margin by period">
      <DimensionInsightComposedChart
        data={TREND}
        series={[
          { key: "profit", label: "Profit", type: "bar" },
          { key: "netMargin", label: "Net margin %", type: "line", yAxisId: "right" },
        ]}
        xKey="label"
        format="currency"
      />
    </ChartCard>
  );
}

export function CustomerGrowthChart() {
  return (
    <ChartCard title="Customer growth" description="Active customer base and new logos per period">
      <DimensionInsightComposedChart
        data={TREND}
        series={[
          { key: "newCustomers", label: "New customers", type: "bar", yAxisId: "right" },
          { key: "customers", label: "Total customers", type: "line" },
        ]}
        xKey="label"
      />
    </ChartCard>
  );
}

export function SalesByRegionChart() {
  return (
    <ChartCard title="Sales by region" description="Trailing twelve month revenue contribution by region">
      <DimensionInsightBarChart
        data={REVENUE_BY_REGION.map((entry) => ({ name: entry.name, value: entry.value }))}
        series={[{ key: "value", label: "Revenue" }]}
        xKey="name"
        layout="horizontal"
        format="currency"
      />
    </ChartCard>
  );
}

export function RevenueByProductChart() {
  return (
    <ChartCard title="Revenue by product category" description="Catalogue revenue split across product families">
      <DimensionInsightPieChart
        data={REVENUE_BY_CATEGORY.map((entry) => ({ name: entry.name, value: entry.value }))}
        donut
      />
    </ChartCard>
  );
}

export function ExpenseBreakdownChart() {
  return (
    <ChartCard title="Expense breakdown" description="Actual spend against budget by expense category">
      <DimensionInsightBarChart
        data={EXPENSE_BREAKDOWN.map((entry) => ({
          name: entry.name,
          actual: entry.value,
          budget: entry.secondary ?? 0,
        }))}
        series={[
          { key: "actual", label: "Actual" },
          { key: "budget", label: "Budget" },
        ]}
        xKey="name"
        layout="horizontal"
        format="currency"
        height="h-80"
      />
    </ChartCard>
  );
}

export function OperationalPerformanceChart() {
  return (
    <ChartCard title="Operational performance" description="Efficiency, fulfilment and delivery service levels">
      <DimensionInsightLineChart
        data={TREND}
        series={[
          { key: "efficiency", label: "Efficiency index" },
          { key: "fulfillmentRate", label: "Fulfilment rate" },
          { key: "onTimeDelivery", label: "On-time delivery" },
        ]}
        xKey="label"
        format="percent"
      />
    </ChartCard>
  );
}

export function WorkforceTrendChart() {
  return (
    <ChartCard title="Workforce trend" description="Headcount and hiring volume across the trailing periods">
      <DimensionInsightComposedChart
        data={TREND}
        series={[
          { key: "hires", label: "Hires", type: "bar", yAxisId: "right" },
          { key: "headcount", label: "Headcount", type: "area" },
        ]}
        xKey="label"
      />
    </ChartCard>
  );
}
