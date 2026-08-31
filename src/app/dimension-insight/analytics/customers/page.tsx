import { HeartHandshake, RefreshCcw, TrendingDown, UserPlus, Users, Wallet } from "lucide-react";

import { CUSTOMER_SEGMENT_BREAKDOWN } from "@/data/dimension-insight/aggregates";
import { CURRENT, CUSTOMERS, delta, MONTHLY, PREVIOUS } from "@/data/dimension-insight/datasets";
import { formatCurrency, formatNumber, formatPercent } from "@/data/dimension-insight/format";

import {
  DimensionInsightAreaChart,
  DimensionInsightBarChart,
  DimensionInsightLineChart,
  DimensionInsightPieChart,
} from "../../_components/charts";
import { ModuleTabs } from "../../_components/module-tabs";
import { PeriodControls } from "../../_components/period-controls";
import { QuickTable } from "../../_components/quick-table";
import { ChartCard, DemoNotice, KpiCard, KpiGrid, PageHeader } from "../../_components/ui-blocks";

const TREND = MONTHLY.map((row) => ({
  label: row.label,
  customers: row.customers,
  newCustomers: row.newCustomers,
  churnedCustomers: row.churnedCustomers,
  churnRate: row.churnRate,
  retentionRate: row.retentionRate,
  ltv: row.ltv,
  satisfaction: row.satisfaction,
}));

const TOP_CUSTOMERS = [...CUSTOMERS].sort((a, b) => b.revenue - a.revenue).slice(0, 60);

export default function CustomerAnalyticsPage() {
  return (
    <div className="flex min-w-0 flex-col gap-6">
      <PageHeader
        eyebrow="Analytics · Customers"
        title="Customer analytics"
        description="Acquisition, retention, churn and lifetime value across every customer segment, industry and region."
        actions={<PeriodControls />}
      />

      <ModuleTabs />

      <KpiGrid columns={4}>
        <KpiCard
          label="Customers"
          value={formatNumber(CURRENT.customers)}
          change={delta(CURRENT.customers, PREVIOUS.customers)}
          icon={Users}
          footnote="Active customer base at period close"
        />
        <KpiCard
          label="Acquisition"
          value={formatNumber(CURRENT.newCustomers)}
          change={delta(CURRENT.newCustomers, PREVIOUS.newCustomers)}
          icon={UserPlus}
          footnote={`Acquisition cost ${formatCurrency(CURRENT.cac)}`}
        />
        <KpiCard
          label="Retention"
          value={formatPercent(CURRENT.retentionRate, 2)}
          change={delta(CURRENT.retentionRate, PREVIOUS.retentionRate)}
          icon={RefreshCcw}
          progress={(CURRENT.retentionRate / 98) * 100}
          footnote="Logo retention against a 98% target"
        />
        <KpiCard
          label="Churn"
          value={formatPercent(CURRENT.churnRate, 2)}
          change={delta(CURRENT.churnRate, PREVIOUS.churnRate)}
          invertTrend
          icon={TrendingDown}
          footnote={`${formatNumber(CURRENT.churnedCustomers)} logos lapsed this period`}
        />
        <KpiCard
          label="Lifetime Value"
          value={formatCurrency(CURRENT.ltv)}
          change={delta(CURRENT.ltv, PREVIOUS.ltv)}
          icon={Wallet}
          footnote={`LTV to CAC ratio ${(CURRENT.ltv / CURRENT.cac).toFixed(1)}x`}
        />
        <KpiCard
          label="Segments"
          value={formatNumber(CUSTOMER_SEGMENT_BREAKDOWN.length)}
          icon={Users}
          footnote={`${CUSTOMER_SEGMENT_BREAKDOWN[0].name} is the largest by logo count`}
        />
        <KpiCard
          label="Satisfaction"
          value={`${CURRENT.satisfaction.toFixed(2)} / 5`}
          change={delta(CURRENT.satisfaction, PREVIOUS.satisfaction)}
          icon={HeartHandshake}
          footnote={`Net promoter score ${CURRENT.nps}`}
        />
        <KpiCard
          label="High Churn Risk"
          value={formatNumber(CUSTOMERS.filter((customer) => customer.churnRisk === "High").length)}
          icon={TrendingDown}
          invertTrend
          footnote="Accounts with a health score below 58"
        />
      </KpiGrid>

      <div className="grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-2">
        <ChartCard title="Customer growth" description="Active customer base across the trailing 24 periods">
          <DimensionInsightAreaChart data={TREND} series={[{ key: "customers", label: "Customers" }]} xKey="label" />
        </ChartCard>

        <ChartCard title="Acquisition" description="New logos acquired per period">
          <DimensionInsightBarChart
            data={TREND}
            series={[{ key: "newCustomers", label: "New customers" }]}
            xKey="label"
          />
        </ChartCard>

        <ChartCard title="Retention" description="Logo retention rate by period">
          <DimensionInsightLineChart
            data={TREND}
            series={[{ key: "retentionRate", label: "Retention rate" }]}
            xKey="label"
            format="percent"
          />
        </ChartCard>

        <ChartCard title="Churn" description="Churn rate and lapsed logo volume">
          <DimensionInsightLineChart
            data={TREND}
            series={[{ key: "churnRate", label: "Churn rate" }]}
            xKey="label"
            format="percent"
          />
        </ChartCard>

        <ChartCard title="Customer segments" description="Logo distribution across commercial segments">
          <DimensionInsightPieChart
            data={CUSTOMER_SEGMENT_BREAKDOWN.map((entry) => ({ name: entry.name, value: entry.value }))}
            donut
          />
        </ChartCard>

        <ChartCard title="Segment revenue" description="Revenue contribution by customer segment">
          <DimensionInsightBarChart
            data={CUSTOMER_SEGMENT_BREAKDOWN.map((entry) => ({ name: entry.name, revenue: entry.secondary ?? 0 }))}
            series={[{ key: "revenue", label: "Revenue" }]}
            xKey="name"
            layout="horizontal"
            format="currency"
          />
        </ChartCard>
      </div>

      <ChartCard title="Customer book" description="Highest revenue accounts with health, risk and lifecycle status">
        <QuickTable
          searchPlaceholder="Search customers, segments, regions"
          pageSize={10}
          rows={TOP_CUSTOMERS.map((customer) => ({
            customer: customer.name,
            segment: customer.segment,
            industry: customer.industry,
            region: customer.region,
            revenue: customer.revenue,
            ltv: customer.lifetimeValue,
            health: customer.healthScore,
            risk: customer.churnRisk,
            status: customer.status,
          }))}
          columns={[
            { key: "customer", header: "Customer" },
            { key: "segment", header: "Segment" },
            { key: "industry", header: "Industry" },
            { key: "region", header: "Region" },
            { key: "revenue", header: "Revenue", format: "compactCurrency" },
            { key: "ltv", header: "Lifetime value", format: "compactCurrency" },
            { key: "health", header: "Health", format: "number" },
            {
              key: "risk",
              header: "Churn risk",
              format: "status",
              tones: { Low: "positive", Medium: "warning", High: "negative" },
            },
            {
              key: "status",
              header: "Status",
              format: "status",
              tones: {
                Active: "positive",
                "At Risk": "warning",
                Churned: "negative",
                Onboarding: "info",
              },
            },
          ]}
        />
      </ChartCard>

      <DemoNotice />
    </div>
  );
}
