import { Megaphone, MousePointerClick, Radar, Target, TrendingUp, Users } from "lucide-react";

import { CAMPAIGNS, CHANNEL_PERFORMANCE } from "@/data/nexora/aggregates";
import { CURRENT, delta, MONTHLY, PREVIOUS } from "@/data/nexora/datasets";
import { formatCurrency, formatNumber, formatPercent } from "@/data/nexora/format";

import { NexoraBarChart, NexoraComposedChart, NexoraLineChart, NexoraPieChart } from "../../_components/charts";
import { ModuleTabs } from "../../_components/module-tabs";
import { PeriodControls } from "../../_components/period-controls";
import { QuickTable } from "../../_components/quick-table";
import { ChartCard, DemoNotice, KpiCard, KpiGrid, PageHeader } from "../../_components/ui-blocks";

const TREND = MONTHLY.map((row) => ({
  label: row.label,
  leads: row.leads,
  qualifiedLeads: row.qualifiedLeads,
  newCustomers: row.newCustomers,
  conversionRate: row.conversionRate,
  marketingSpend: row.marketingSpend,
  cac: row.cac,
  roi: Math.round(((row.revenue - row.marketingSpend) / row.marketingSpend) * 100),
}));

const TOTAL_SPEND = CAMPAIGNS.reduce((sum, campaign) => sum + campaign.spend, 0);
const TOTAL_CAMPAIGN_REVENUE = CAMPAIGNS.reduce((sum, campaign) => sum + campaign.revenue, 0);

export default function MarketingAnalyticsPage() {
  return (
    <div className="flex min-w-0 flex-col gap-6">
      <PageHeader
        eyebrow="Analytics · Marketing"
        title="Marketing analytics"
        description="Campaign performance, lead flow, conversion economics, acquisition cost and channel return on investment."
        actions={<PeriodControls />}
      />

      <ModuleTabs />

      <KpiGrid columns={4}>
        <KpiCard
          label="Campaigns"
          value={formatNumber(CAMPAIGNS.length)}
          icon={Megaphone}
          footnote={`${CAMPAIGNS.filter((campaign) => campaign.status === "Active").length} currently active`}
        />
        <KpiCard
          label="Leads"
          value={formatNumber(CURRENT.leads)}
          change={delta(CURRENT.leads, PREVIOUS.leads)}
          icon={Users}
          footnote={`${formatNumber(CURRENT.qualifiedLeads)} marketing qualified`}
        />
        <KpiCard
          label="Conversions"
          value={formatNumber(CURRENT.newCustomers)}
          change={delta(CURRENT.newCustomers, PREVIOUS.newCustomers)}
          icon={MousePointerClick}
          footnote={`Conversion rate ${formatPercent(CURRENT.conversionRate, 2)}`}
        />
        <KpiCard
          label="Acquisition Cost"
          value={formatCurrency(CURRENT.cac)}
          change={delta(CURRENT.cac, PREVIOUS.cac)}
          invertTrend
          icon={Target}
          footnote="Blended cost per new customer"
        />
        <KpiCard
          label="Marketing ROI"
          value={formatPercent(((TOTAL_CAMPAIGN_REVENUE - TOTAL_SPEND) / TOTAL_SPEND) * 100)}
          icon={TrendingUp}
          footnote="Return across the active campaign portfolio"
        />
        <KpiCard
          label="Channels"
          value={formatNumber(CHANNEL_PERFORMANCE.length)}
          icon={Radar}
          footnote={`${CHANNEL_PERFORMANCE[0].name} leads by attributed revenue`}
        />
        <KpiCard
          label="Marketing Spend"
          value={formatCurrency(CURRENT.marketingSpend, { compact: true })}
          change={delta(CURRENT.marketingSpend, PREVIOUS.marketingSpend)}
          invertTrend
          icon={Megaphone}
          footnote="Programme investment for the closed period"
        />
        <KpiCard
          label="Pipeline Contribution"
          value={formatCurrency(TOTAL_CAMPAIGN_REVENUE, { compact: true })}
          icon={Target}
          footnote="Revenue attributed to the campaign portfolio"
        />
      </KpiGrid>

      <div className="grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-2">
        <ChartCard title="Campaign performance" description="Spend against attributed revenue by campaign">
          <NexoraBarChart
            data={CAMPAIGNS.map((campaign) => ({
              name: campaign.name,
              spend: campaign.spend,
              revenue: campaign.revenue,
            }))}
            series={[
              { key: "revenue", label: "Attributed revenue" },
              { key: "spend", label: "Spend" },
            ]}
            xKey="name"
            layout="horizontal"
            format="currency"
            height="h-96"
          />
        </ChartCard>

        <ChartCard title="Lead conversion" description="Lead flow and conversion rate by period">
          <NexoraComposedChart
            data={TREND}
            series={[
              { key: "leads", label: "Leads", type: "bar" },
              { key: "conversionRate", label: "Conversion rate", type: "line", yAxisId: "right" },
            ]}
            xKey="label"
          />
        </ChartCard>

        <ChartCard title="Marketing ROI" description="Return on marketing investment across the trailing periods">
          <NexoraLineChart data={TREND} series={[{ key: "roi", label: "ROI" }]} xKey="label" format="percent" />
        </ChartCard>

        <ChartCard title="Channel performance" description="Attributed revenue share by acquisition channel">
          <NexoraPieChart
            data={CHANNEL_PERFORMANCE.map((channel) => ({ name: channel.name, value: channel.revenue }))}
            donut
          />
        </ChartCard>
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-2">
        <ChartCard title="Channel economics" description="Return, conversion and acquisition cost by channel">
          <QuickTable
            showColumnToggle={false}
            searchPlaceholder="Search channels"
            pageSize={10}
            rows={CHANNEL_PERFORMANCE.map((channel) => ({
              channel: channel.name,
              revenue: channel.revenue,
              spend: channel.spend,
              leads: channel.leads,
              conversion: channel.conversionRate,
              cac: channel.cac,
              roi: channel.roi,
            }))}
            columns={[
              { key: "channel", header: "Channel" },
              { key: "revenue", header: "Revenue", format: "compactCurrency" },
              { key: "spend", header: "Spend", format: "compactCurrency" },
              { key: "leads", header: "Leads", format: "number" },
              { key: "conversion", header: "Conversion", format: "percent" },
              { key: "cac", header: "CAC", format: "currency" },
              { key: "roi", header: "ROI", format: "signed" },
            ]}
          />
        </ChartCard>

        <ChartCard title="Campaign portfolio" description="Status, investment and return for every campaign">
          <QuickTable
            showColumnToggle={false}
            searchPlaceholder="Search campaigns"
            pageSize={10}
            rows={CAMPAIGNS.map((campaign) => ({
              campaign: campaign.name,
              channel: campaign.channel,
              spend: campaign.spend,
              revenue: campaign.revenue,
              leads: campaign.leads,
              conversions: campaign.conversions,
              roi: campaign.roi,
              status: campaign.status,
            }))}
            columns={[
              { key: "campaign", header: "Campaign" },
              { key: "channel", header: "Channel" },
              { key: "spend", header: "Spend", format: "compactCurrency" },
              { key: "revenue", header: "Revenue", format: "compactCurrency" },
              { key: "leads", header: "Leads", format: "number" },
              { key: "conversions", header: "Conversions", format: "number" },
              { key: "roi", header: "ROI", format: "signed" },
              {
                key: "status",
                header: "Status",
                format: "status",
                tones: { Active: "positive", Scheduled: "info", Completed: "neutral" },
              },
            ]}
          />
        </ChartCard>
      </div>

      <DemoNotice />
    </div>
  );
}
