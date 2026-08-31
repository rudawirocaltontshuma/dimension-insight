import { Banknote, PiggyBank, Receipt, Scale, TrendingUp, Wallet } from "lucide-react";

import { EXPENSE_BREAKDOWN } from "@/data/dimension-insight/aggregates";
import { CURRENT, delta, EXPENSES, MONTHLY, PREVIOUS } from "@/data/dimension-insight/datasets";
import { formatCurrency, formatPercent } from "@/data/dimension-insight/format";

import {
  DimensionInsightAreaChart,
  DimensionInsightBarChart,
  DimensionInsightComposedChart,
  DimensionInsightLineChart,
} from "../../_components/charts";
import { ModuleTabs } from "../../_components/module-tabs";
import { PeriodControls } from "../../_components/period-controls";
import { QuickTable } from "../../_components/quick-table";
import { ChartCard, DemoNotice, KpiCard, KpiGrid, PageHeader } from "../../_components/ui-blocks";

const TREND = MONTHLY.map((row) => ({
  label: row.label,
  revenue: row.revenue,
  expenses: row.expenses,
  profit: row.profit,
  cashFlow: row.cashFlow,
  budget: row.budget,
  grossMargin: row.grossMargin,
  netMargin: row.netMargin,
  variance: Math.round(((row.revenue - row.budget) / row.budget) * 1000) / 10,
}));

export default function FinanceAnalyticsPage() {
  return (
    <div className="flex min-w-0 flex-col gap-6">
      <PageHeader
        eyebrow="Analytics · Finance"
        title="Finance analytics"
        description="Revenue, expenditure, profitability, margin structure, cash generation and budget variance for the consolidated entity."
        actions={<PeriodControls />}
      />

      <ModuleTabs />

      <KpiGrid columns={4}>
        <KpiCard
          label="Revenue"
          value={formatCurrency(CURRENT.revenue, { compact: true })}
          change={delta(CURRENT.revenue, PREVIOUS.revenue)}
          icon={TrendingUp}
          footnote="Recognised revenue for the closed period"
        />
        <KpiCard
          label="Expenses"
          value={formatCurrency(CURRENT.expenses, { compact: true })}
          change={delta(CURRENT.expenses, PREVIOUS.expenses)}
          invertTrend
          icon={Receipt}
          footnote="Total operating expenditure"
        />
        <KpiCard
          label="Profit"
          value={formatCurrency(CURRENT.profit, { compact: true })}
          change={delta(CURRENT.profit, PREVIOUS.profit)}
          icon={PiggyBank}
          footnote="Operating profit after all costs"
        />
        <KpiCard
          label="Gross Margin"
          value={formatPercent(CURRENT.grossMargin)}
          change={delta(CURRENT.grossMargin, PREVIOUS.grossMargin)}
          icon={Scale}
          progress={(CURRENT.grossMargin / 66) * 100}
          footnote="Against a 66% target"
        />
        <KpiCard
          label="Net Margin"
          value={formatPercent(CURRENT.netMargin)}
          change={delta(CURRENT.netMargin, PREVIOUS.netMargin)}
          icon={Scale}
          progress={(CURRENT.netMargin / 27) * 100}
          footnote="Against a 27% target"
        />
        <KpiCard
          label="Cash Flow"
          value={formatCurrency(CURRENT.cashFlow, { compact: true })}
          change={delta(CURRENT.cashFlow, PREVIOUS.cashFlow)}
          icon={Banknote}
          footnote="Net cash generated from operations"
        />
        <KpiCard
          label="Budget vs Actual"
          value={formatPercent(((CURRENT.revenue - CURRENT.budget) / CURRENT.budget) * 100)}
          change={((CURRENT.revenue - CURRENT.budget) / CURRENT.budget) * 100}
          icon={Wallet}
          footnote="Revenue variance against the approved budget"
        />
        <KpiCard
          label="Flagged Expenses"
          value={formatCurrency(
            EXPENSES.filter((expense) => expense.status === "Flagged").reduce((sum, row) => sum + row.amount, 0),
            { compact: true },
          )}
          icon={Receipt}
          footnote={`${EXPENSES.filter((expense) => expense.status === "Flagged").length} transactions under review`}
        />
      </KpiGrid>

      <div className="grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-2">
        <ChartCard title="Revenue" description="Recognised revenue against approved budget by period">
          <DimensionInsightAreaChart
            data={TREND}
            series={[
              { key: "revenue", label: "Revenue" },
              { key: "budget", label: "Budget" },
            ]}
            xKey="label"
            format="currency"
          />
        </ChartCard>

        <ChartCard title="Expenses" description="Operating expenditure by period">
          <DimensionInsightBarChart
            data={TREND}
            series={[{ key: "expenses", label: "Expenses" }]}
            xKey="label"
            format="currency"
          />
        </ChartCard>

        <ChartCard title="Profit" description="Operating profit and cash generation">
          <DimensionInsightComposedChart
            data={TREND}
            series={[
              { key: "profit", label: "Profit", type: "bar" },
              { key: "cashFlow", label: "Cash flow", type: "line" },
            ]}
            xKey="label"
            format="currency"
          />
        </ChartCard>

        <ChartCard title="Margins" description="Gross and net margin structure across the trailing periods">
          <DimensionInsightLineChart
            data={TREND}
            series={[
              { key: "grossMargin", label: "Gross margin" },
              { key: "netMargin", label: "Net margin" },
            ]}
            xKey="label"
            format="percent"
          />
        </ChartCard>

        <ChartCard
          title="Budget variance"
          description="Revenue variance against budget, expressed in percentage points"
          className="xl:col-span-2"
        >
          <DimensionInsightBarChart
            data={TREND}
            series={[{ key: "variance", label: "Variance" }]}
            xKey="label"
            format="percent"
          />
        </ChartCard>
      </div>

      <ChartCard title="Expense categories" description="Actual spend against budget by expense category">
        <QuickTable
          searchPlaceholder="Search expense categories"
          pageSize={10}
          rows={EXPENSE_BREAKDOWN.map((entry) => ({
            category: entry.name,
            actual: entry.value,
            budget: entry.secondary ?? 0,
            variance: Math.round(((entry.value - (entry.secondary ?? 0)) / (entry.secondary ?? 1)) * 1000) / 10,
            share: Math.round((entry.value / EXPENSE_BREAKDOWN.reduce((sum, row) => sum + row.value, 0)) * 1000) / 10,
          }))}
          columns={[
            { key: "category", header: "Category" },
            { key: "actual", header: "Actual", format: "compactCurrency" },
            { key: "budget", header: "Budget", format: "compactCurrency" },
            { key: "variance", header: "Variance", format: "signed" },
            { key: "share", header: "Share of spend", format: "percent" },
          ]}
        />
      </ChartCard>

      <DemoNotice />
    </div>
  );
}
