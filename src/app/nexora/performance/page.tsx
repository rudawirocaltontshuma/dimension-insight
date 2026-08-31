import { Activity, Building2, Gauge, Globe2, Target, Users } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DEPARTMENT_PERFORMANCE,
  REGIONAL_PERFORMANCE,
  SCATTER_PRODUCTS,
  TEAM_PERFORMANCE,
} from "@/data/nexora/aggregates";
import { KPIS, kpiStatus, kpiTrend, kpiVariance } from "@/data/nexora/content";
import { CURRENT, delta, MONTHLY, PREVIOUS } from "@/data/nexora/datasets";
import { formatCurrency, formatNumber, formatPercent } from "@/data/nexora/format";

import { NexoraBarChart, NexoraLineChart, NexoraScatterChart } from "../_components/charts";
import { ModuleTabs } from "../_components/module-tabs";
import { PeriodControls } from "../_components/period-controls";
import { QuickTable } from "../_components/quick-table";
import { ChartCard, DemoNotice, KpiCard, KpiGrid, PageHeader } from "../_components/ui-blocks";

const TREND = MONTHLY.map((row) => ({
  label: row.label,
  efficiency: row.efficiency,
  performanceScore: row.performanceScore,
  productivityIndex: row.productivityIndex,
  netMargin: row.netMargin,
}));

const ON_TRACK = KPIS.filter((kpi) => kpiStatus(kpi) === "On Track").length;
const AT_RISK = KPIS.filter((kpi) => kpiStatus(kpi) === "At Risk").length;
const CRITICAL = KPIS.filter((kpi) => kpiStatus(kpi) === "Critical").length;

export default function PerformancePage() {
  return (
    <div className="flex min-w-0 flex-col gap-6">
      <PageHeader
        eyebrow="Analytics · Performance"
        title="Executive performance"
        description="Department, regional, team and KPI performance with trend comparison against targets across the operating plan."
        actions={<PeriodControls />}
      />

      <ModuleTabs />

      <KpiGrid columns={4}>
        <KpiCard
          label="Composite Performance"
          value={CURRENT.performanceScore.toFixed(1)}
          change={delta(CURRENT.performanceScore, PREVIOUS.performanceScore)}
          icon={Activity}
          footnote="Organisation-wide performance score"
        />
        <KpiCard
          label="Operating Efficiency"
          value={formatPercent(CURRENT.efficiency)}
          change={delta(CURRENT.efficiency, PREVIOUS.efficiency)}
          icon={Gauge}
          progress={(CURRENT.efficiency / 90) * 100}
          footnote="Against a 90% operating target"
        />
        <KpiCard
          label="KPIs On Track"
          value={`${ON_TRACK} / ${KPIS.length}`}
          icon={Target}
          progress={(ON_TRACK / KPIS.length) * 100}
          footnote={`${AT_RISK} at risk · ${CRITICAL} critical`}
        />
        <KpiCard
          label="Regional Attainment"
          value={formatPercent(
            (REGIONAL_PERFORMANCE.reduce((total, region) => total + region.revenue, 0) /
              REGIONAL_PERFORMANCE.reduce((total, region) => total + region.target, 0)) *
              100,
          )}
          icon={Globe2}
          footnote="Consolidated revenue against regional targets"
        />
      </KpiGrid>

      <Tabs defaultValue="department" className="flex min-w-0 flex-col gap-4">
        <TabsList variant="line" className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="department">Department</TabsTrigger>
          <TabsTrigger value="regional">Regional</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="kpi">KPI performance</TabsTrigger>
        </TabsList>

        <TabsContent value="department" className="flex min-w-0 flex-col gap-4">
          <div className="grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-2">
            <ChartCard title="Department revenue" description="Attributed revenue against departmental target">
              <NexoraBarChart
                data={DEPARTMENT_PERFORMANCE.map((department) => ({
                  name: department.name,
                  revenue: department.revenue,
                  target: department.target,
                }))}
                series={[
                  { key: "revenue", label: "Revenue" },
                  { key: "target", label: "Target" },
                ]}
                xKey="name"
                layout="horizontal"
                format="currency"
                height="h-96"
              />
            </ChartCard>
            <ChartCard
              title="Department scorecard"
              description="Performance, productivity and engagement by department"
            >
              <NexoraBarChart
                data={DEPARTMENT_PERFORMANCE.map((department) => ({
                  name: department.name,
                  performance: department.performance,
                  productivity: department.productivity,
                  engagement: department.engagement,
                }))}
                series={[
                  { key: "performance", label: "Performance" },
                  { key: "productivity", label: "Productivity" },
                  { key: "engagement", label: "Engagement" },
                ]}
                xKey="name"
                layout="horizontal"
                height="h-96"
              />
            </ChartCard>
          </div>

          <ChartCard title="Department detail" description="Headcount and outcome metrics for every department">
            <QuickTable
              showColumnToggle={false}
              searchPlaceholder="Search departments"
              rows={DEPARTMENT_PERFORMANCE.map((department) => ({
                department: department.name,
                headcount: department.headcount,
                revenue: department.revenue,
                target: department.target,
                attainment: Math.round((department.revenue / department.target) * 1000) / 10,
                performance: department.performance,
                productivity: department.productivity,
                engagement: department.engagement,
              }))}
              columns={[
                { key: "department", header: "Department", format: "text" },
                { key: "headcount", header: "Headcount", format: "number" },
                { key: "revenue", header: "Revenue", format: "compactCurrency" },
                { key: "target", header: "Target", format: "compactCurrency" },
                { key: "attainment", header: "Attainment", format: "percent" },
                { key: "performance", header: "Performance", format: "number" },
                { key: "productivity", header: "Productivity", format: "number" },
                { key: "engagement", header: "Engagement", format: "number" },
              ]}
            />
          </ChartCard>
        </TabsContent>

        <TabsContent value="regional" className="flex min-w-0 flex-col gap-4">
          <div className="grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-2">
            <ChartCard title="Regional attainment" description="Revenue against target by region">
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
            <ChartCard title="Regional margin" description="Contribution margin and satisfaction by region">
              <NexoraBarChart
                data={REGIONAL_PERFORMANCE.map((region) => ({ name: region.name, margin: region.margin }))}
                series={[{ key: "margin", label: "Margin" }]}
                xKey="name"
                layout="horizontal"
                format="percent"
                height="h-80"
              />
            </ChartCard>
          </div>

          <ChartCard title="Regional detail" description="Revenue, orders, customers and satisfaction by region">
            <QuickTable
              showColumnToggle={false}
              showSearch={false}
              rows={REGIONAL_PERFORMANCE.map((region) => ({
                region: region.name,
                revenue: region.revenue,
                target: region.target,
                attainment: Math.round((region.revenue / region.target) * 1000) / 10,
                margin: region.margin,
                orders: region.orders,
                customers: region.customers,
                satisfaction: region.satisfaction,
              }))}
              columns={[
                { key: "region", header: "Region" },
                { key: "revenue", header: "Revenue", format: "compactCurrency" },
                { key: "target", header: "Target", format: "compactCurrency" },
                { key: "attainment", header: "Attainment", format: "percent" },
                { key: "margin", header: "Margin", format: "percent" },
                { key: "orders", header: "Orders", format: "number" },
                { key: "customers", header: "Customers", format: "number" },
                { key: "satisfaction", header: "Satisfaction", align: "right" },
              ]}
            />
          </ChartCard>
        </TabsContent>

        <TabsContent value="team" className="flex min-w-0 flex-col gap-4">
          <div className="grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-2">
            <ChartCard title="Team scores" description="Team performance score against the 82 point standard">
              <NexoraBarChart
                data={TEAM_PERFORMANCE.map((team) => ({ name: team.name, score: team.score, target: team.target }))}
                series={[
                  { key: "score", label: "Score" },
                  { key: "target", label: "Standard" },
                ]}
                xKey="name"
                layout="horizontal"
                height="h-96"
              />
            </ChartCard>
            <ChartCard title="Product economics" description="Revenue against margin, sized by unit volume">
              <NexoraScatterChart
                data={SCATTER_PRODUCTS.map((product) => ({
                  name: product.name,
                  margin: product.margin,
                  revenue: product.revenue,
                  units: product.units,
                }))}
                xKey="margin"
                yKey="revenue"
                zKey="units"
                xLabel="Margin %"
                yLabel="Revenue (thousands)"
                height="h-96"
              />
            </ChartCard>
          </div>

          <ChartCard title="Team detail" description="Score, movement and team size across the operating teams">
            <QuickTable
              showColumnToggle={false}
              showSearch={false}
              rows={TEAM_PERFORMANCE.map((team) => ({
                team: team.name,
                members: team.members,
                score: team.score,
                target: team.target,
                trend: team.trend,
              }))}
              columns={[
                { key: "team", header: "Team" },
                { key: "members", header: "Members", format: "number" },
                { key: "score", header: "Score", align: "right" },
                { key: "target", header: "Standard", align: "right" },
                { key: "trend", header: "Trend", format: "signed" },
              ]}
            />
          </ChartCard>
        </TabsContent>

        <TabsContent value="kpi" className="flex min-w-0 flex-col gap-4">
          <div className="grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-2">
            <ChartCard title="Trend comparison" description="Performance, productivity and efficiency movement">
              <NexoraLineChart
                data={TREND}
                series={[
                  { key: "performanceScore", label: "Performance score" },
                  { key: "productivityIndex", label: "Productivity index" },
                  { key: "efficiency", label: "Efficiency index" },
                ]}
                xKey="label"
              />
            </ChartCard>
            <ChartCard title="KPI variance" description="Variance against target for every tracked KPI">
              <NexoraBarChart
                data={KPIS.map((kpi) => ({ name: kpi.name, variance: kpiVariance(kpi) }))}
                series={[{ key: "variance", label: "Variance" }]}
                xKey="name"
                layout="horizontal"
                format="percent"
                height="h-[32rem]"
              />
            </ChartCard>
          </div>

          <ChartCard title="KPI performance" description="Every KPI with its target, variance, movement and owner">
            <QuickTable
              searchPlaceholder="Search KPIs"
              rows={KPIS.map((kpi) => ({
                kpi: kpi.name,
                category: kpi.category,
                owner: kpi.owner,
                variance: kpiVariance(kpi),
                trend: kpiTrend(kpi),
                status: kpiStatus(kpi),
              }))}
              columns={[
                { key: "kpi", header: "KPI" },
                { key: "category", header: "Category" },
                { key: "owner", header: "Owner" },
                { key: "variance", header: "Variance", format: "signed" },
                { key: "trend", header: "Trend", format: "signed" },
                {
                  key: "status",
                  header: "Status",
                  format: "status",
                  tones: { "On Track": "positive", "At Risk": "warning", Critical: "negative" },
                },
              ]}
            />
          </ChartCard>
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Largest department"
          value={[...DEPARTMENT_PERFORMANCE].sort((a, b) => b.headcount - a.headcount)[0].name}
          icon={Building2}
          footnote={`${formatNumber([...DEPARTMENT_PERFORMANCE].sort((a, b) => b.headcount - a.headcount)[0].headcount)} employees`}
        />
        <KpiCard
          label="Leading region"
          value={[...REGIONAL_PERFORMANCE].sort((a, b) => b.revenue - a.revenue)[0].name}
          icon={Globe2}
          footnote={formatCurrency([...REGIONAL_PERFORMANCE].sort((a, b) => b.revenue - a.revenue)[0].revenue, {
            compact: true,
          })}
        />
        <KpiCard
          label="Top team"
          value={[...TEAM_PERFORMANCE].sort((a, b) => b.score - a.score)[0].name}
          icon={Users}
          footnote={`Score ${[...TEAM_PERFORMANCE].sort((a, b) => b.score - a.score)[0].score.toFixed(1)}`}
        />
        <KpiCard
          label="Net margin"
          value={formatPercent(CURRENT.netMargin)}
          change={delta(CURRENT.netMargin, PREVIOUS.netMargin)}
          icon={Target}
          footnote="Consolidated net margin for the closed period"
        />
      </div>

      <DemoNotice />
    </div>
  );
}
