import {
  Activity,
  BadgeDollarSign,
  Banknote,
  Gauge,
  HeartHandshake,
  Package,
  Receipt,
  TrendingUp,
  UserRound,
  Users,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HEADLINE } from "@/data/dimension-insight/aggregates";
import { ACTIVITY, ALERTS } from "@/data/dimension-insight/content";
import { CURRENT } from "@/data/dimension-insight/datasets";
import { formatCurrency, formatNumber, formatPercent } from "@/data/dimension-insight/format";

import { RecentAlertsCard } from "../_components/alert-list";
import { PeriodControls } from "../_components/period-controls";
import { RevenueDrilldown } from "../_components/revenue-drilldown";
import { DemoNotice, KpiCard, KpiGrid, PageHeader } from "../_components/ui-blocks";
import {
  CustomerGrowthChart,
  ExpenseBreakdownChart,
  OperationalPerformanceChart,
  ProfitTrendChart,
  RevenueByProductChart,
  RevenueTrendChart,
  SalesByRegionChart,
  WorkforceTrendChart,
} from "./_components/dashboard-charts";

export default function ExecutiveDashboardPage() {
  return (
    <div className="flex min-w-0 flex-col gap-6">
      <PageHeader
        eyebrow="Executive Dashboard"
        title="Consolidated business position"
        description="Trailing twelve month performance across revenue, profitability, customers, operations and workforce for the period closing August 2026."
        actions={<PeriodControls />}
      />

      <KpiGrid columns={5}>
        <KpiCard
          label="Revenue"
          value={formatCurrency(HEADLINE.revenue, { compact: true })}
          change={HEADLINE.revenueDelta}
          icon={BadgeDollarSign}
          footnote="Trailing twelve months vs prior year"
        />
        <KpiCard
          label="Profit"
          value={formatCurrency(HEADLINE.profit, { compact: true })}
          change={HEADLINE.profitDelta}
          icon={TrendingUp}
          footnote={`Net margin ${formatPercent(HEADLINE.netMargin)}`}
        />
        <KpiCard
          label="Growth"
          value={formatPercent(HEADLINE.growth)}
          change={HEADLINE.growth}
          icon={Activity}
          footnote="Year over year revenue growth"
        />
        <KpiCard
          label="Customers"
          value={formatNumber(HEADLINE.customers)}
          change={HEADLINE.customersDelta}
          icon={Users}
          footnote={`${formatNumber(CURRENT.newCustomers)} new logos this period`}
        />
        <KpiCard
          label="Orders"
          value={formatNumber(HEADLINE.orders)}
          change={HEADLINE.ordersDelta}
          icon={Package}
          footnote={`Average order value ${formatCurrency(HEADLINE.averageOrderValue)}`}
        />
        <KpiCard
          label="Expenses"
          value={formatCurrency(HEADLINE.expenses, { compact: true })}
          change={HEADLINE.expensesDelta}
          invertTrend
          icon={Receipt}
          footnote="Total operating expenditure"
        />
        <KpiCard
          label="Cash Flow"
          value={formatCurrency(HEADLINE.cashFlow, { compact: true })}
          change={HEADLINE.cashFlowDelta}
          icon={Banknote}
          footnote="Net cash generated from operations"
        />
        <KpiCard
          label="Employees"
          value={formatNumber(HEADLINE.employees)}
          change={HEADLINE.employeesDelta}
          icon={UserRound}
          footnote={`Turnover ${formatPercent(CURRENT.turnoverRate)} annualised`}
        />
        <KpiCard
          label="Operational Efficiency"
          value={formatPercent(HEADLINE.efficiency)}
          change={HEADLINE.efficiencyDelta}
          icon={Gauge}
          progress={(HEADLINE.efficiency / 90) * 100}
          footnote="Composite index against a 90% target"
        />
        <KpiCard
          label="Customer Satisfaction"
          value={`${HEADLINE.satisfaction.toFixed(2)} / 5`}
          change={HEADLINE.satisfactionDelta}
          icon={HeartHandshake}
          progress={(HEADLINE.satisfaction / 4.5) * 100}
          footnote={`Net promoter score ${HEADLINE.nps}`}
        />
      </KpiGrid>

      <div className="grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-3">
        <RevenueTrendChart />
        <ProfitTrendChart />
        <CustomerGrowthChart />
        <SalesByRegionChart />
        <RevenueByProductChart />
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-2">
        <RevenueDrilldown />
        <ExpenseBreakdownChart />
        <OperationalPerformanceChart />
        <WorkforceTrendChart />
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-2">
        <RecentAlertsCard alerts={ALERTS.slice(0, 5)} />

        <Card className="overflow-hidden">
          <CardHeader className="border-b">
            <CardTitle className="text-base">Recent activity</CardTitle>
            <CardDescription className="text-xs">Workspace events across reports, alerts and views</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {ACTIVITY.map((entry) => (
              <div key={entry.id} className="flex items-center gap-3 border-b p-4 last:border-b-0">
                <Avatar className="size-8">
                  <AvatarFallback className="text-xs">
                    {entry.actor
                      .split(" ")
                      .map((part) => part[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm">
                    <span className="font-medium">{entry.actor}</span> {entry.action}{" "}
                    <span className="font-medium">{entry.target}</span>
                  </p>
                  <p className="text-muted-foreground text-xs">{entry.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <DemoNotice />
    </div>
  );
}
