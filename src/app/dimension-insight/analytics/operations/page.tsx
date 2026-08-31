import { AlertTriangle, Boxes, Gauge, PackageCheck, Timer, Truck } from "lucide-react";

import {
  DELIVERY_DISTRIBUTION,
  FULFILLMENT_BREAKDOWN,
  INVENTORY_BY_CATEGORY,
} from "@/data/dimension-insight/aggregates";
import { CURRENT, delta, MONTHLY, ORDERS, PREVIOUS, PRODUCTS } from "@/data/dimension-insight/datasets";
import { formatNumber, formatPercent } from "@/data/dimension-insight/format";

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
  efficiency: row.efficiency,
  fulfillmentRate: row.fulfillmentRate,
  onTimeDelivery: row.onTimeDelivery,
  inventoryTurnover: row.inventoryTurnover,
  incidents: row.incidents,
  supportTickets: row.supportTickets,
  orders: row.orders,
}));

const DELAYED = ORDERS.filter((order) => order.fulfillment === "Delayed" || order.fulfillment === "Processing");

export default function OperationsAnalyticsPage() {
  return (
    <div className="flex min-w-0 flex-col gap-6">
      <PageHeader
        eyebrow="Analytics · Operations"
        title="Operations analytics"
        description="Order flow, fulfilment quality, delivery service levels, inventory health and incident volume across the operating network."
        actions={<PeriodControls />}
      />

      <ModuleTabs />

      <KpiGrid columns={4}>
        <KpiCard
          label="Orders"
          value={formatNumber(CURRENT.orders)}
          change={delta(CURRENT.orders, PREVIOUS.orders)}
          icon={Boxes}
          footnote="Orders processed this period"
        />
        <KpiCard
          label="Fulfilment"
          value={formatPercent(CURRENT.fulfillmentRate)}
          change={delta(CURRENT.fulfillmentRate, PREVIOUS.fulfillmentRate)}
          icon={PackageCheck}
          progress={(CURRENT.fulfillmentRate / 97.5) * 100}
          footnote="Complete first-attempt fulfilment against a 97.5% target"
        />
        <KpiCard
          label="Inventory"
          value={CURRENT.inventoryTurnover.toFixed(2)}
          change={delta(CURRENT.inventoryTurnover, PREVIOUS.inventoryTurnover)}
          icon={Boxes}
          footnote={`${PRODUCTS.filter((product) => product.stock < product.reorderPoint).length} SKUs below reorder point`}
        />
        <KpiCard
          label="Delivery"
          value={formatPercent(CURRENT.onTimeDelivery)}
          change={delta(CURRENT.onTimeDelivery, PREVIOUS.onTimeDelivery)}
          icon={Truck}
          progress={(CURRENT.onTimeDelivery / 96) * 100}
          footnote="On-time delivery against a 96% commitment"
        />
        <KpiCard
          label="Efficiency"
          value={formatPercent(CURRENT.efficiency)}
          change={delta(CURRENT.efficiency, PREVIOUS.efficiency)}
          icon={Gauge}
          progress={(CURRENT.efficiency / 90) * 100}
          footnote="Composite operating efficiency index"
        />
        <KpiCard
          label="Issues"
          value={formatNumber(CURRENT.incidents)}
          change={delta(CURRENT.incidents, PREVIOUS.incidents)}
          invertTrend
          icon={AlertTriangle}
          footnote="Operational incidents raised this period"
        />
        <KpiCard
          label="Support Volume"
          value={formatNumber(CURRENT.supportTickets)}
          change={delta(CURRENT.supportTickets, PREVIOUS.supportTickets)}
          invertTrend
          icon={Timer}
          footnote="Support tickets handled this period"
        />
        <KpiCard
          label="Open Exceptions"
          value={formatNumber(DELAYED.length)}
          invertTrend
          icon={AlertTriangle}
          footnote="Orders delayed or still processing"
        />
      </KpiGrid>

      <div className="grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-2">
        <ChartCard title="Operational efficiency" description="Composite efficiency index across the trailing periods">
          <DimensionInsightAreaChart
            data={TREND}
            series={[{ key: "efficiency", label: "Efficiency index" }]}
            xKey="label"
            format="percent"
          />
        </ChartCard>

        <ChartCard title="Fulfilment" description="Fulfilment status distribution across all recorded orders">
          <DimensionInsightPieChart
            data={FULFILLMENT_BREAKDOWN.map((entry) => ({ name: entry.name, value: entry.value }))}
            donut
          />
        </ChartCard>

        <ChartCard title="Delivery" description="Delivery lead time distribution and on-time performance">
          <DimensionInsightBarChart
            data={DELIVERY_DISTRIBUTION.map((entry) => ({ name: entry.name, orders: entry.value }))}
            series={[{ key: "orders", label: "Orders" }]}
            xKey="name"
          />
        </ChartCard>

        <ChartCard title="Inventory" description="Stock on hand against reorder point by product category">
          <DimensionInsightBarChart
            data={INVENTORY_BY_CATEGORY.map((entry) => ({
              name: entry.name,
              stock: entry.stock,
              reorder: entry.reorder,
            }))}
            series={[
              { key: "stock", label: "Stock on hand" },
              { key: "reorder", label: "Reorder point" },
            ]}
            xKey="name"
            layout="horizontal"
            height="h-80"
          />
        </ChartCard>

        <ChartCard
          title="Service levels"
          description="Fulfilment, delivery and inventory turnover movement"
          className="xl:col-span-2"
        >
          <DimensionInsightLineChart
            data={TREND}
            series={[
              { key: "fulfillmentRate", label: "Fulfilment rate" },
              { key: "onTimeDelivery", label: "On-time delivery" },
            ]}
            xKey="label"
            format="percent"
          />
        </ChartCard>
      </div>

      <ChartCard title="Order exceptions" description="Orders that are delayed or still processing across the network">
        <QuickTable
          searchPlaceholder="Search orders, customers, regions"
          rows={DELAYED.slice(0, 80).map((order) => ({
            order: order.id,
            date: order.date,
            customer: order.customer,
            product: order.product,
            region: order.region,
            channel: order.channel,
            units: order.units,
            amount: order.amount,
            days: order.deliveryDays,
            status: order.fulfillment,
          }))}
          columns={[
            { key: "order", header: "Order" },
            { key: "date", header: "Date" },
            { key: "customer", header: "Customer" },
            { key: "product", header: "Product" },
            { key: "region", header: "Region" },
            { key: "channel", header: "Channel" },
            { key: "units", header: "Units", format: "number" },
            { key: "amount", header: "Amount", format: "compactCurrency" },
            { key: "days", header: "Lead days", format: "number" },
            {
              key: "status",
              header: "Status",
              format: "status",
              tones: { Processing: "info", Delayed: "warning" },
            },
          ]}
        />
      </ChartCard>

      <DemoNotice />
    </div>
  );
}
