import Link from "next/link";

import { ArrowUpRight } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HEADLINE } from "@/data/nexora/aggregates";
import { DATASET_COUNTS, MONTHLY } from "@/data/nexora/datasets";
import { formatCurrency, formatNumber, formatPercent } from "@/data/nexora/format";

import { NexoraAreaChart, NexoraBarChart } from "../_components/charts";
import { ModuleTabs } from "../_components/module-tabs";
import { ChartCard, DemoNotice, KpiCard, KpiGrid, PageHeader } from "../_components/ui-blocks";
import { ANALYTICS_MODULES } from "../_lib/navigation";

const TREND = MONTHLY.map((row) => ({
  label: row.label,
  revenue: row.revenue,
  profit: row.profit,
  orders: row.orders,
}));

export default function AnalyticsOverviewPage() {
  return (
    <div className="flex min-w-0 flex-col gap-6">
      <PageHeader
        eyebrow="Analytics Workspace"
        title="Analytics workspace"
        description="Seven connected analysis modules built on a single coherent dataset covering sales, finance, customers, operations, marketing, workforce and performance."
      />

      <ModuleTabs />

      <KpiGrid columns={4}>
        <KpiCard
          label="Revenue analysed"
          value={formatCurrency(HEADLINE.revenue, { compact: true })}
          change={HEADLINE.revenueDelta}
          footnote="Trailing twelve months"
        />
        <KpiCard
          label="Profit analysed"
          value={formatCurrency(HEADLINE.profit, { compact: true })}
          change={HEADLINE.profitDelta}
          footnote={`Net margin ${formatPercent(HEADLINE.netMargin)}`}
        />
        <KpiCard
          label="Orders analysed"
          value={formatNumber(HEADLINE.orders)}
          change={HEADLINE.ordersDelta}
          footnote={`Average order value ${formatCurrency(HEADLINE.averageOrderValue)}`}
        />
        <KpiCard
          label="Analytics records"
          value={formatNumber(DATASET_COUNTS.analytics)}
          footnote="Fact rows available to the data explorer"
        />
      </KpiGrid>

      <div className="grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-2">
        <ChartCard title="Revenue and profit" description="Trailing 24 period movement across the consolidated entity">
          <NexoraAreaChart
            data={TREND}
            series={[
              { key: "revenue", label: "Revenue" },
              { key: "profit", label: "Profit" },
            ]}
            xKey="label"
            format="currency"
          />
        </ChartCard>
        <ChartCard title="Order volume" description="Closed order count by period">
          <NexoraBarChart data={TREND} series={[{ key: "orders", label: "Orders" }]} xKey="label" />
        </ChartCard>
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {ANALYTICS_MODULES.map((module) => (
          <Card key={module.href} className="group transition-colors hover:border-primary/40">
            <CardHeader>
              <div className="flex size-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                <module.icon className="size-4" />
              </div>
              <CardTitle className="mt-3 text-base">{module.title}</CardTitle>
              <CardDescription className="text-xs leading-relaxed">{module.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href={module.href} className="inline-flex items-center gap-1 font-medium text-sm hover:underline">
                Open module
                <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      <DemoNotice />
    </div>
  );
}
