import { BadgeDollarSign, Package, Percent, Receipt, Target, TrendingUp } from "lucide-react";

import {
  PIPELINE_BY_STAGE,
  REGIONAL_PERFORMANCE,
  REVENUE_BY_REGION,
  TOP_PRODUCTS,
} from "@/data/dimension-insight/aggregates";
import { CURRENT, delta, MONTHLY, PREVIOUS } from "@/data/dimension-insight/datasets";
import { formatCurrency, formatNumber, formatPercent } from "@/data/dimension-insight/format";

import {
  DimensionInsightBarChart,
  DimensionInsightComposedChart,
  DimensionInsightFunnelChart,
  DimensionInsightLineChart,
} from "../../_components/charts";
import { ModuleTabs } from "../../_components/module-tabs";
import { PeriodControls } from "../../_components/period-controls";
import { QuickTable } from "../../_components/quick-table";
import { RevenueDrilldown } from "../../_components/revenue-drilldown";
import { ChartCard, DemoNotice, KpiCard, KpiGrid, PageHeader } from "../../_components/ui-blocks";

const TREND = MONTHLY.map((row) => ({
  label: row.label,
  revenue: row.revenue,
  orders: row.orders,
  averageOrderValue: row.averageOrderValue,
  conversionRate: row.conversionRate,
  pipeline: row.pipeline,
}));

export default function SalesAnalyticsPage() {
  return (
    <div className="flex min-w-0 flex-col gap-6">
      <PageHeader
        eyebrow="Analytics · Sales"
        title="Sales analytics"
        description="Revenue, order volume, deal economics and pipeline coverage across every region and product category."
        actions={<PeriodControls />}
      />

      <ModuleTabs />

      <KpiGrid columns={4}>
        <KpiCard
          label="Revenue"
          value={formatCurrency(CURRENT.revenue, { compact: true })}
          change={delta(CURRENT.revenue, PREVIOUS.revenue)}
          icon={BadgeDollarSign}
          footnote="Closed period revenue"
        />
        <KpiCard
          label="Orders"
          value={formatNumber(CURRENT.orders)}
          change={delta(CURRENT.orders, PREVIOUS.orders)}
          icon={Package}
          footnote="Closed orders this period"
        />
        <KpiCard
          label="Average Order Value"
          value={formatCurrency(CURRENT.averageOrderValue)}
          change={delta(CURRENT.averageOrderValue, PREVIOUS.averageOrderValue)}
          icon={Receipt}
          footnote="Revenue per closed order"
        />
        <KpiCard
          label="Conversion"
          value={formatPercent(CURRENT.conversionRate, 2)}
          change={delta(CURRENT.conversionRate, PREVIOUS.conversionRate)}
          icon={Percent}
          footnote="Qualified lead to customer conversion"
        />
        <KpiCard
          label="Pipeline"
          value={formatCurrency(CURRENT.pipeline, { compact: true })}
          change={delta(CURRENT.pipeline, PREVIOUS.pipeline)}
          icon={Target}
          footnote="Open weighted opportunity value"
        />
        <KpiCard
          label="Regional Sales"
          value={formatCurrency(REVENUE_BY_REGION[0].value, { compact: true })}
          icon={TrendingUp}
          footnote={`${REVENUE_BY_REGION[0].name} leads with ${formatPercent(REVENUE_BY_REGION[0].share ?? 0)} share`}
        />
        <KpiCard
          label="Product Sales"
          value={formatCurrency(TOP_PRODUCTS[0].revenue, { compact: true })}
          change={TOP_PRODUCTS[0].growth}
          icon={Package}
          footnote={`${TOP_PRODUCTS[0].name} is the leading product line`}
        />
        <KpiCard
          label="Quota Attainment"
          value={formatPercent(
            (REGIONAL_PERFORMANCE.reduce((total, region) => total + region.revenue, 0) /
              REGIONAL_PERFORMANCE.reduce((total, region) => total + region.target, 0)) *
              100,
          )}
          footnote="Consolidated revenue against regional targets"
        />
      </KpiGrid>

      <div className="grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-2">
        <ChartCard title="Revenue trend" description="Revenue and order volume across the trailing 24 periods">
          <DimensionInsightComposedChart
            data={TREND}
            series={[
              { key: "revenue", label: "Revenue", type: "bar" },
              { key: "averageOrderValue", label: "Average order value", type: "line", yAxisId: "right" },
            ]}
            xKey="label"
            format="currency"
          />
        </ChartCard>

        <ChartCard title="Sales by region" description="Revenue contribution and attainment against regional target">
          <DimensionInsightBarChart
            data={REGIONAL_PERFORMANCE.map((region) => ({
              name: region.name,
              revenue: region.revenue,
              target: region.target,
            }))}
            series={[
              { key: "revenue", label: "Revenue" },
              { key: "target", label: "Target" },
            ]}
            xKey="name"
            layout="horizontal"
            format="currency"
            height="h-80"
          />
        </ChartCard>

        <ChartCard title="Top products" description="Ten highest revenue product lines in the catalogue">
          <DimensionInsightBarChart
            data={TOP_PRODUCTS.map((product) => ({ name: product.name, revenue: product.revenue }))}
            series={[{ key: "revenue", label: "Revenue" }]}
            xKey="name"
            layout="horizontal"
            format="currency"
            height="h-96"
          />
        </ChartCard>

        <ChartCard title="Pipeline" description="Weighted opportunity value by sales stage">
          <DimensionInsightFunnelChart
            data={PIPELINE_BY_STAGE.map((stage) => ({ name: stage.name, value: stage.value }))}
          />
        </ChartCard>

        <ChartCard title="Conversion and pipeline coverage" description="Conversion rate against open pipeline value">
          <DimensionInsightLineChart
            data={TREND}
            series={[{ key: "conversionRate", label: "Conversion rate" }]}
            xKey="label"
            format="percent"
          />
        </ChartCard>

        <RevenueDrilldown />
      </div>

      <ChartCard title="Product performance" description="Sortable, searchable view of the highest revenue products">
        <QuickTable
          searchPlaceholder="Search products"
          rows={TOP_PRODUCTS.map((product) => ({
            product: product.name,
            category: product.category,
            units: product.unitsSold,
            price: product.unitPrice,
            revenue: product.revenue,
            margin: product.margin,
            growth: product.growth,
            status: product.status,
          }))}
          columns={[
            { key: "product", header: "Product" },
            { key: "category", header: "Category" },
            { key: "units", header: "Units", format: "number" },
            { key: "price", header: "Unit price", format: "currency" },
            { key: "revenue", header: "Revenue", format: "compactCurrency" },
            { key: "margin", header: "Margin", format: "percent" },
            { key: "growth", header: "Growth", format: "signed" },
            {
              key: "status",
              header: "Status",
              format: "status",
              tones: { Active: "positive", Beta: "info", Sunset: "warning" },
            },
          ]}
        />
      </ChartCard>

      <DemoNotice />
    </div>
  );
}
