import Link from "next/link";

import { ArrowUpRight, Hexagon, Info, LayoutDashboard } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ALERTS, KPIS, REPORTS, SAVED_VIEWS } from "@/data/dimension-insight/content";
import { DATASET_COUNTS, MONTHLY } from "@/data/dimension-insight/datasets";
import { formatNumber } from "@/data/dimension-insight/format";

import { DemoNotice } from "./_components/ui-blocks";
import { ANALYTICS_MODULES, DIMENSION_INSIGHT_BASE, DIMENSION_INSIGHT_NAV } from "./_lib/navigation";

const TECH_BADGES = [
  "Next.js",
  "TypeScript",
  "React",
  "Tailwind CSS",
  "shadcn/ui",
  "Recharts",
  "Responsive Design",
  "Enterprise Analytics",
  "Data Visualization",
  "Advanced Tables",
  "Dashboard Architecture",
];

const CHART_TYPES = ["Line", "Bar", "Area", "Pie", "Donut", "Scatter", "Composed", "Funnel", "KPI", "Table"];

const CAPABILITIES = [
  {
    title: "Executive dashboard",
    description:
      "Ten headline KPIs, eight executive charts, a revenue drill-down, recent alerts and a workspace activity feed on a single dense screen.",
  },
  {
    title: "Seven analytics modules",
    description:
      "Sales, finance, customers, operations, marketing, workforce and performance workspaces, each with its own KPI set, chart suite and analytical table.",
  },
  {
    title: "KPI governance",
    description:
      "A KPI library with value, target, variance, twelve period sparkline trend, owner and status, plus a detail dialog for every measure.",
  },
  {
    title: "Data exploration",
    description:
      "Dataset, dimension and metric selection with search, filters, sorting, grouping, column visibility, date range and saved views over a fact table.",
  },
  {
    title: "Report composition",
    description:
      "A builder for datasets, dimensions, metrics, ten chart types, filters, date ranges and layouts, with a preview that updates as you configure it.",
  },
  {
    title: "Distribution surfaces",
    description:
      "A report library with detail pages, an alert centre with severity workflow, and saved views that can be created, pinned and reopened.",
  },
];

export default function PlatformOverviewPage() {
  const totalRecords = Object.values(DATASET_COUNTS).reduce((sum, value) => sum + value, 0);

  return (
    <div className="flex min-w-0 flex-col gap-8">
      <section className="overflow-hidden rounded-2xl border bg-gradient-to-br from-primary/10 via-background to-background p-6 md:p-10">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Hexagon className="size-5" />
            </div>
            <div>
              <h1 className="font-semibold text-3xl tracking-tight md:text-4xl">DIMENSION INSIGHT</h1>
              <p className="text-muted-foreground text-sm md:text-base">
                Business Intelligence &amp; Executive Analytics Platform
              </p>
            </div>
          </div>

          <p className="max-w-3xl text-pretty text-muted-foreground leading-relaxed">
            A complete enterprise analytics front end: an executive dashboard, seven analytics workspaces, a governed
            KPI centre, an interactive data explorer, a report builder, a report library with detail pages, an alert
            centre, saved views and workspace settings. Every figure is generated locally from a deterministic seed so
            the numbers stay coherent from the board summary all the way down to an individual customer.
          </p>

          <div className="flex flex-wrap gap-2">
            {TECH_BADGES.map((badge) => (
              <Badge key={badge} variant="outline" className="bg-background/60">
                {badge}
              </Badge>
            ))}
          </div>

          <div className="flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm">
            <Info className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <p className="font-medium">Frontend demonstration using fictional data.</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button asChild>
              <Link href={`${DIMENSION_INSIGHT_BASE}/dashboard`}>
                <LayoutDashboard className="size-4" />
                Open the executive dashboard
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href={`${DIMENSION_INSIGHT_BASE}/analytics`}>Explore the analytics workspace</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href={`${DIMENSION_INSIGHT_BASE}/report-builder`}>Try the report builder</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        {[
          { label: "Mock records", value: formatNumber(totalRecords) },
          { label: "Analytics rows", value: formatNumber(DATASET_COUNTS.analytics) },
          { label: "Reporting periods", value: formatNumber(MONTHLY.length) },
          { label: "Governed KPIs", value: formatNumber(KPIS.length) },
          { label: "Reports", value: formatNumber(REPORTS.length) },
          { label: "Saved views", value: formatNumber(SAVED_VIEWS.length) },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="pb-2">
              <CardDescription className="text-xs">{stat.label}</CardDescription>
              <CardTitle className="font-semibold text-2xl tabular-nums">{stat.value}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </section>

      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="font-semibold text-xl tracking-tight">What the platform demonstrates</h2>
          <p className="text-muted-foreground text-sm">
            Six capability areas built from one shared component library and one coherent dataset.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {CAPABILITIES.map((capability) => (
            <Card key={capability.title}>
              <CardHeader>
                <CardTitle className="text-base">{capability.title}</CardTitle>
                <CardDescription className="text-xs leading-relaxed">{capability.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="font-semibold text-xl tracking-tight">Analytics modules</h2>
          <p className="text-muted-foreground text-sm">Seven connected workspaces over the same fact table.</p>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
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
                  Open
                  <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader className="border-b">
            <CardTitle className="text-base">Chart types demonstrated</CardTitle>
            <CardDescription className="text-xs">
              Ten visualisation forms built on Recharts through a single shared wrapper layer.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2 pt-4">
            {CHART_TYPES.map((type) => (
              <Badge key={type} variant="outline">
                {type}
              </Badge>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b">
            <CardTitle className="text-base">Dataset composition</CardTitle>
            <CardDescription className="text-xs">
              Every dataset is generated client-side from a fixed seed, so figures reconcile across modules.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
              {Object.entries(DATASET_COUNTS).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between border-b py-1.5">
                  <dt className="text-muted-foreground capitalize">{key}</dt>
                  <dd className="tabular-nums">{formatNumber(value)}</dd>
                </div>
              ))}
              <div className="flex items-center justify-between border-b py-1.5">
                <dt className="text-muted-foreground">Alerts</dt>
                <dd className="tabular-nums">{formatNumber(ALERTS.length)}</dd>
              </div>
              <div className="flex items-center justify-between border-b py-1.5">
                <dt className="text-muted-foreground">Periods</dt>
                <dd className="tabular-nums">{formatNumber(MONTHLY.length)}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="font-semibold text-xl tracking-tight">Every route in the platform</h2>
          <p className="text-muted-foreground text-sm">Seventeen routes, all rendered from local mock data.</p>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {DIMENSION_INSIGHT_NAV.map((group) => (
            <Card key={group.label}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">{group.label}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1.5">
                {group.items
                  .flatMap((item) => [item, ...(item.items ?? [])])
                  .map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center justify-between rounded px-2 py-1.5 text-sm hover:bg-muted"
                    >
                      <span className="flex items-center gap-2">
                        <item.icon className="size-3.5 text-muted-foreground" />
                        {item.title}
                      </span>
                      <span className="text-muted-foreground text-xs">{item.href}</span>
                    </Link>
                  ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator />
      <DemoNotice className="pb-2 text-sm" />
    </div>
  );
}
