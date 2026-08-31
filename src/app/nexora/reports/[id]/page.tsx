import Link from "next/link";
import { notFound } from "next/navigation";

import { ArrowLeft, CheckCircle2, CircleAlert, Lightbulb } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  CUSTOMER_SEGMENT_BREAKDOWN,
  DEPARTMENT_PERFORMANCE,
  EXPENSE_BREAKDOWN,
  FULFILLMENT_BREAKDOWN,
  HEADLINE,
  REGIONAL_PERFORMANCE,
  REVENUE_BY_CATEGORY,
} from "@/data/nexora/aggregates";
import { REPORTS } from "@/data/nexora/content";
import { CURRENT, delta, MONTHLY, PREVIOUS } from "@/data/nexora/datasets";
import { formatCurrency, formatDate, formatNumber, formatPercent } from "@/data/nexora/format";

import {
  NexoraAreaChart,
  NexoraBarChart,
  NexoraComposedChart,
  NexoraLineChart,
  NexoraPieChart,
} from "../../_components/charts";
import { ReportActions } from "../../_components/report-actions";
import { ChartCard, DemoNotice, KpiCard, KpiGrid, PageHeader, StatusPill } from "../../_components/ui-blocks";

const TREND = MONTHLY.map((row) => ({
  label: row.label,
  revenue: row.revenue,
  profit: row.profit,
  expenses: row.expenses,
  netMargin: row.netMargin,
  grossMargin: row.grossMargin,
  customers: row.customers,
  newCustomers: row.newCustomers,
  churnRate: row.churnRate,
  efficiency: row.efficiency,
  fulfillmentRate: row.fulfillmentRate,
  onTimeDelivery: row.onTimeDelivery,
  headcount: row.headcount,
  hires: row.hires,
  productivityIndex: row.productivityIndex,
}));

const REPORT_STATUS_TONE = {
  Published: "positive",
  Draft: "warning",
  Scheduled: "info",
  Archived: "neutral",
} as const;

function PointIcon({ sectionId }: { sectionId: string }) {
  if (sectionId === "risks")
    return <CircleAlert className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" />;
  if (sectionId === "opportunities")
    return <Lightbulb className="mt-0.5 size-4 shrink-0 text-sky-600 dark:text-sky-400" />;
  return <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />;
}

export function generateStaticParams() {
  return REPORTS.map((report) => ({ id: report.id }));
}

function SectionVisual({ sectionId }: { sectionId: string }) {
  switch (sectionId) {
    case "revenue":
      return (
        <div className="grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-2">
          <ChartCard title="Revenue trend" description="Recognised revenue across the trailing 24 periods">
            <NexoraAreaChart
              data={TREND}
              series={[{ key: "revenue", label: "Revenue" }]}
              xKey="label"
              format="currency"
            />
          </ChartCard>
          <ChartCard title="Revenue by category" description="Contribution by product family">
            <NexoraPieChart
              data={REVENUE_BY_CATEGORY.map((entry) => ({ name: entry.name, value: entry.value }))}
              donut
            />
          </ChartCard>
        </div>
      );
    case "profitability":
      return (
        <div className="grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-2">
          <ChartCard title="Profit and margin" description="Operating profit against net margin">
            <NexoraComposedChart
              data={TREND}
              series={[
                { key: "profit", label: "Profit", type: "bar" },
                { key: "netMargin", label: "Net margin", type: "line", yAxisId: "right" },
              ]}
              xKey="label"
              format="currency"
            />
          </ChartCard>
          <ChartCard title="Expense structure" description="Actual spend against budget by category">
            <NexoraBarChart
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
        </div>
      );
    case "customers":
      return (
        <div className="grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-2">
          <ChartCard title="Customer base" description="Active customers and new logo acquisition">
            <NexoraComposedChart
              data={TREND}
              series={[
                { key: "newCustomers", label: "New customers", type: "bar", yAxisId: "right" },
                { key: "customers", label: "Total customers", type: "line" },
              ]}
              xKey="label"
            />
          </ChartCard>
          <ChartCard title="Segment mix" description="Logo distribution across commercial segments">
            <NexoraPieChart
              data={CUSTOMER_SEGMENT_BREAKDOWN.map((entry) => ({ name: entry.name, value: entry.value }))}
              donut
            />
          </ChartCard>
        </div>
      );
    case "operations":
      return (
        <div className="grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-2">
          <ChartCard title="Service levels" description="Fulfilment, delivery and efficiency movement">
            <NexoraLineChart
              data={TREND}
              series={[
                { key: "efficiency", label: "Efficiency" },
                { key: "fulfillmentRate", label: "Fulfilment" },
                { key: "onTimeDelivery", label: "On-time delivery" },
              ]}
              xKey="label"
              format="percent"
            />
          </ChartCard>
          <ChartCard title="Fulfilment mix" description="Order status distribution across the network">
            <NexoraPieChart
              data={FULFILLMENT_BREAKDOWN.map((entry) => ({ name: entry.name, value: entry.value }))}
              donut
            />
          </ChartCard>
        </div>
      );
    case "workforce":
      return (
        <div className="grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-2">
          <ChartCard title="Headcount and hiring" description="Headcount trend against hiring volume">
            <NexoraComposedChart
              data={TREND}
              series={[
                { key: "hires", label: "Hires", type: "bar", yAxisId: "right" },
                { key: "headcount", label: "Headcount", type: "area" },
              ]}
              xKey="label"
            />
          </ChartCard>
          <ChartCard title="Department headcount" description="Distribution across departments">
            <NexoraBarChart
              data={DEPARTMENT_PERFORMANCE.map((department) => ({
                name: department.name,
                headcount: department.headcount,
              }))}
              series={[{ key: "headcount", label: "Headcount" }]}
              xKey="name"
              layout="horizontal"
              height="h-80"
            />
          </ChartCard>
        </div>
      );
    case "executive-summary":
      return (
        <ChartCard title="Regional attainment" description="Revenue against target for every region">
          <NexoraBarChart
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
      );
    default:
      return null;
  }
}

export default async function ReportDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const report = REPORTS.find((entry) => entry.id === id);
  if (!report) notFound();

  return (
    <div className="flex min-w-0 flex-col gap-6">
      <Link
        href="/nexora/reports"
        className="inline-flex w-fit items-center gap-1 text-muted-foreground text-sm hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to the report library
      </Link>

      <PageHeader
        eyebrow={`${report.category} report`}
        title={report.name}
        description={report.description}
        actions={<ReportActions reportName={report.name} />}
      />

      <div className="flex flex-wrap items-center gap-2">
        <StatusPill status={report.status} tone={REPORT_STATUS_TONE[report.status]} />
        <Badge variant="outline">Owner · {report.owner}</Badge>
        <Badge variant="outline">Updated {formatDate(report.updated)}</Badge>
        <Badge variant="outline">{formatNumber(report.views)} views</Badge>
        <Badge variant="outline">{report.schedule}</Badge>
        <Badge variant="outline">{report.audience}</Badge>
      </div>

      <KpiGrid columns={4}>
        <KpiCard
          label="Revenue"
          value={formatCurrency(HEADLINE.revenue, { compact: true })}
          change={HEADLINE.revenueDelta}
          footnote="Trailing twelve months"
        />
        <KpiCard
          label="Profit"
          value={formatCurrency(HEADLINE.profit, { compact: true })}
          change={HEADLINE.profitDelta}
          footnote={`Net margin ${formatPercent(HEADLINE.netMargin)}`}
        />
        <KpiCard
          label="Customers"
          value={formatNumber(HEADLINE.customers)}
          change={HEADLINE.customersDelta}
          footnote={`Churn ${formatPercent(CURRENT.churnRate, 2)}`}
        />
        <KpiCard
          label="Efficiency"
          value={formatPercent(CURRENT.efficiency)}
          change={delta(CURRENT.efficiency, PREVIOUS.efficiency)}
          footnote="Composite operating efficiency index"
        />
      </KpiGrid>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Contents</CardTitle>
          <CardDescription className="text-xs">Sections included in this report</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {report.sections.map((section, index) => (
            <Badge key={section.id} variant="outline">
              {index + 1}. {section.title}
            </Badge>
          ))}
        </CardContent>
      </Card>

      {report.sections.map((section, index) => (
        <section key={section.id} className="flex min-w-0 flex-col gap-4">
          <div className="space-y-1">
            <p className="font-medium text-muted-foreground text-xs uppercase tracking-[0.14em]">Section {index + 1}</p>
            <h2 className="font-semibold text-xl tracking-tight">{section.title}</h2>
            <p className="max-w-4xl text-pretty text-muted-foreground text-sm leading-relaxed">{section.summary}</p>
          </div>

          <Card>
            <CardContent className="pt-6">
              <ul className="space-y-3">
                {section.points.map((point) => (
                  <li key={point} className="flex items-start gap-3 text-sm">
                    <PointIcon sectionId={section.id} />
                    <span className="leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <SectionVisual sectionId={section.id} />
          {index < report.sections.length - 1 ? <Separator className="mt-2" /> : null}
        </section>
      ))}

      <DemoNotice />
    </div>
  );
}
