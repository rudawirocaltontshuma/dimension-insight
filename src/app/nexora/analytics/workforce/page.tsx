import { CalendarCheck, Gauge, LogOut, Sparkles, UserPlus, Users } from "lucide-react";

import { DEPARTMENT_PERFORMANCE } from "@/data/nexora/aggregates";
import { CURRENT, delta, EMPLOYEES, MONTHLY, PREVIOUS } from "@/data/nexora/datasets";
import { formatNumber, formatPercent } from "@/data/nexora/format";

import { NexoraAreaChart, NexoraBarChart, NexoraComposedChart, NexoraLineChart } from "../../_components/charts";
import { ModuleTabs } from "../../_components/module-tabs";
import { PeriodControls } from "../../_components/period-controls";
import { QuickTable } from "../../_components/quick-table";
import { ChartCard, DemoNotice, KpiCard, KpiGrid, PageHeader } from "../../_components/ui-blocks";

const TREND = MONTHLY.map((row) => ({
  label: row.label,
  headcount: row.headcount,
  hires: row.hires,
  departures: row.departures,
  turnoverRate: row.turnoverRate,
  attendanceRate: row.attendanceRate,
  productivityIndex: row.productivityIndex,
  performanceScore: row.performanceScore,
}));

export default function WorkforceAnalyticsPage() {
  return (
    <div className="flex min-w-0 flex-col gap-6">
      <PageHeader
        eyebrow="Analytics · Workforce"
        title="Workforce analytics"
        description="Headcount composition, hiring throughput, turnover, attendance, performance distribution and productivity by department."
        actions={<PeriodControls />}
      />

      <ModuleTabs />

      <KpiGrid columns={4}>
        <KpiCard
          label="Headcount"
          value={formatNumber(CURRENT.headcount)}
          change={delta(CURRENT.headcount, PREVIOUS.headcount)}
          icon={Users}
          footnote="Active employees at period close"
        />
        <KpiCard
          label="Hiring"
          value={formatNumber(CURRENT.hires)}
          change={delta(CURRENT.hires, PREVIOUS.hires)}
          icon={UserPlus}
          footnote={`${formatNumber(CURRENT.departures)} departures in the same period`}
        />
        <KpiCard
          label="Turnover"
          value={formatPercent(CURRENT.turnoverRate)}
          change={delta(CURRENT.turnoverRate, PREVIOUS.turnoverRate)}
          invertTrend
          icon={LogOut}
          footnote="Annualised against an 11% plan"
        />
        <KpiCard
          label="Attendance"
          value={formatPercent(CURRENT.attendanceRate)}
          change={delta(CURRENT.attendanceRate, PREVIOUS.attendanceRate)}
          icon={CalendarCheck}
          footnote="Scheduled hours attended"
        />
        <KpiCard
          label="Performance"
          value={CURRENT.performanceScore.toFixed(1)}
          change={delta(CURRENT.performanceScore, PREVIOUS.performanceScore)}
          icon={Sparkles}
          footnote="Mean performance score across the organisation"
        />
        <KpiCard
          label="Productivity"
          value={CURRENT.productivityIndex.toFixed(1)}
          change={delta(CURRENT.productivityIndex, PREVIOUS.productivityIndex)}
          icon={Gauge}
          progress={(CURRENT.productivityIndex / 110) * 100}
          footnote="Output per full-time equivalent, indexed"
        />
        <KpiCard
          label="Departments"
          value={formatNumber(DEPARTMENT_PERFORMANCE.length)}
          icon={Users}
          footnote={`${[...DEPARTMENT_PERFORMANCE].sort((a, b) => b.headcount - a.headcount)[0].name} is the largest`}
        />
        <KpiCard
          label="On Leave or Notice"
          value={formatNumber(EMPLOYEES.filter((employee) => employee.status !== "Active").length)}
          icon={LogOut}
          invertTrend
          footnote="Employees not currently in an active working state"
        />
      </KpiGrid>

      <div className="grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-2">
        <ChartCard title="Headcount" description="Total headcount across the trailing 24 periods">
          <NexoraAreaChart data={TREND} series={[{ key: "headcount", label: "Headcount" }]} xKey="label" />
        </ChartCard>

        <ChartCard title="Hiring" description="Hires against departures by period">
          <NexoraComposedChart
            data={TREND}
            series={[
              { key: "hires", label: "Hires", type: "bar" },
              { key: "departures", label: "Departures", type: "bar" },
            ]}
            xKey="label"
          />
        </ChartCard>

        <ChartCard title="Turnover" description="Annualised turnover rate by period">
          <NexoraLineChart
            data={TREND}
            series={[{ key: "turnoverRate", label: "Turnover rate" }]}
            xKey="label"
            format="percent"
          />
        </ChartCard>

        <ChartCard title="Performance" description="Performance score, productivity index and attendance">
          <NexoraLineChart
            data={TREND}
            series={[
              { key: "performanceScore", label: "Performance score" },
              { key: "productivityIndex", label: "Productivity index" },
              { key: "attendanceRate", label: "Attendance rate" },
            ]}
            xKey="label"
          />
        </ChartCard>

        <ChartCard
          title="Department headcount"
          description="Headcount distribution across departments"
          className="xl:col-span-2"
        >
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

      <ChartCard title="Employee register" description="Performance, productivity and engagement by individual">
        <QuickTable
          searchPlaceholder="Search employees, departments, roles"
          rows={EMPLOYEES.map((employee) => ({
            employee: employee.name,
            department: employee.department,
            role: employee.role,
            region: employee.region,
            tenure: employee.tenureYears,
            performance: employee.performance,
            productivity: employee.productivity,
            attendance: employee.attendance,
            engagement: employee.engagement,
            status: employee.status,
          }))}
          columns={[
            { key: "employee", header: "Employee" },
            { key: "department", header: "Department" },
            { key: "role", header: "Role" },
            { key: "region", header: "Region" },
            { key: "tenure", header: "Tenure (yrs)", align: "right" },
            { key: "performance", header: "Performance", format: "number" },
            { key: "productivity", header: "Productivity", format: "number" },
            { key: "attendance", header: "Attendance", format: "percent" },
            { key: "engagement", header: "Engagement", format: "number" },
            {
              key: "status",
              header: "Status",
              format: "status",
              tones: { Active: "positive", "On Leave": "info", "Notice Period": "warning" },
            },
          ]}
        />
      </ChartCard>

      <DemoNotice />
    </div>
  );
}
