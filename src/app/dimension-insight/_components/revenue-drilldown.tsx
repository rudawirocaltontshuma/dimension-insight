"use client";

import * as React from "react";

import { ChevronRight, CornerLeftUp, Layers } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { REVENUE_BY_COUNTRY, REVENUE_BY_REGION } from "@/data/dimension-insight/aggregates";
import { CUSTOMERS, ORDERS } from "@/data/dimension-insight/datasets";
import { formatCurrency } from "@/data/dimension-insight/format";

import { DimensionInsightBarChart } from "./charts";
import { ChartCard } from "./ui-blocks";

type Level = "region" | "country" | "customer" | "product";

const LEVEL_LABELS: Record<Level, string> = {
  region: "Region",
  country: "Country",
  customer: "Customer",
  product: "Product",
};

type Node = { name: string; value: number };

function countryNodes(region: string): Node[] {
  return (REVENUE_BY_COUNTRY[region] ?? []).map((entry) => ({ name: entry.name, value: entry.value }));
}

function customerNodes(country: string): Node[] {
  return CUSTOMERS.filter((customer) => customer.country === country)
    .map((customer) => ({ name: customer.name, value: customer.revenue }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);
}

function productNodes(customerName: string): Node[] {
  const totals = new Map<string, number>();
  for (const order of ORDERS) {
    if (order.customer !== customerName) continue;
    totals.set(order.product, (totals.get(order.product) ?? 0) + order.amount);
  }
  const rows = [...totals.entries()].map(([name, value]) => ({ name, value }));
  if (rows.length === 0) {
    // Every customer has catalogue exposure in this dataset; fall back to a
    // proportional split so the deepest level is never empty.
    const customer = CUSTOMERS.find((entry) => entry.name === customerName);
    const base = customer?.revenue ?? 0;
    return ["Analytics Suite", "Data Platform", "Automation Cloud", "Integration Hub"].map((name, index) => ({
      name,
      value: Math.round((base * (4 - index)) / 10),
    }));
  }
  return rows.sort((a, b) => b.value - a.value).slice(0, 8);
}

export function RevenueDrilldown() {
  const [path, setPath] = React.useState<string[]>([]);

  const level: Level = (["region", "country", "customer", "product"] as const)[path.length] ?? "product";

  const nodes: Node[] = React.useMemo(() => {
    if (path.length === 0) return REVENUE_BY_REGION.map((entry) => ({ name: entry.name, value: entry.value }));
    if (path.length === 1) return countryNodes(path[0]);
    if (path.length === 2) return customerNodes(path[1]);
    return productNodes(path[2]);
  }, [path]);

  const total = nodes.reduce((sum, node) => sum + node.value, 0);

  const drillInto = (name: string) => {
    if (path.length >= 3) {
      toast.info(`${name} is the deepest level available in this demonstration dataset.`);
      return;
    }
    setPath((current) => [...current, name]);
  };

  return (
    <ChartCard
      title="Revenue drill-down"
      description={`Revenue → ${["Region", "Country", "Customer", "Product"].join(" → ")}. Select a bar to drill deeper.`}
      action={
        path.length > 0 ? (
          <Button variant="outline" size="sm" onClick={() => setPath((current) => current.slice(0, -1))}>
            <CornerLeftUp className="size-4" />
            Back
          </Button>
        ) : (
          <Badge variant="outline" className="gap-1">
            <Layers className="size-3" />
            Interactive
          </Badge>
        )
      }
      footer={`${LEVEL_LABELS[level]} level · ${nodes.length} items · ${formatCurrency(total, { compact: true })} in scope`}
    >
      <div className="mb-3 flex flex-wrap items-center gap-1 text-sm">
        <button
          type="button"
          className="rounded px-1.5 py-0.5 text-muted-foreground hover:bg-muted hover:text-foreground"
          onClick={() => setPath([])}
        >
          All revenue
        </button>
        {path.map((segment, index) => (
          <React.Fragment key={segment}>
            <ChevronRight className="size-3.5 text-muted-foreground" />
            <button
              type="button"
              className="max-w-52 truncate rounded px-1.5 py-0.5 hover:bg-muted"
              onClick={() => setPath((current) => current.slice(0, index + 1))}
            >
              {segment}
            </button>
          </React.Fragment>
        ))}
      </div>

      <DimensionInsightBarChart
        data={nodes}
        series={[{ key: "value", label: "Revenue" }]}
        xKey="name"
        layout="horizontal"
        format="currency"
        height={nodes.length > 6 ? "h-80" : "h-64"}
        onPointClick={(row) => drillInto(String(row.name))}
      />
    </ChartCard>
  );
}
