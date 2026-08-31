"use client";

import * as React from "react";

import { useRouter } from "next/navigation";

import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Kbd } from "@/components/ui/kbd";
import { KPIS, REPORTS } from "@/data/dimension-insight/content";
import { CUSTOMERS, EMPLOYEES, PRODUCTS } from "@/data/dimension-insight/datasets";
import { formatCurrency } from "@/data/dimension-insight/format";

import { ANALYTICS_MODULES, DIMENSION_INSIGHT_BASE, DIMENSION_INSIGHT_NAV } from "../_lib/navigation";

interface SearchEntry {
  id: string;
  group: string;
  label: string;
  hint: string;
  href: string;
}

function buildEntries(): SearchEntry[] {
  const navigation: SearchEntry[] = [
    ...DIMENSION_INSIGHT_NAV.flatMap((group) => group.items),
    ...ANALYTICS_MODULES,
  ].map((item) => ({
    id: `nav-${item.href}`,
    group: "Navigation",
    label: item.title,
    hint: item.description,
    href: item.href,
  }));

  const reports: SearchEntry[] = REPORTS.map((report) => ({
    id: `report-${report.id}`,
    group: "Reports",
    label: report.name,
    hint: `${report.category} · ${report.owner}`,
    href: `${DIMENSION_INSIGHT_BASE}/reports/${report.id}`,
  }));

  const kpis: SearchEntry[] = KPIS.map((kpi) => ({
    id: `kpi-${kpi.id}`,
    group: "KPIs",
    label: kpi.name,
    hint: `${kpi.category} · owned by ${kpi.owner}`,
    href: `${DIMENSION_INSIGHT_BASE}/kpis?kpi=${kpi.id}`,
  }));

  const customers: SearchEntry[] = CUSTOMERS.slice(0, 40).map((customer) => ({
    id: `customer-${customer.id}`,
    group: "Customers",
    label: customer.name,
    hint: `${customer.segment} · ${customer.region} · ${formatCurrency(customer.revenue, { compact: true })}`,
    href: `${DIMENSION_INSIGHT_BASE}/analytics/customers`,
  }));

  const products: SearchEntry[] = PRODUCTS.slice(0, 40).map((product) => ({
    id: `product-${product.id}`,
    group: "Products",
    label: product.name,
    hint: `${product.category} · ${formatCurrency(product.revenue, { compact: true })}`,
    href: `${DIMENSION_INSIGHT_BASE}/analytics/sales`,
  }));

  const employees: SearchEntry[] = EMPLOYEES.slice(0, 40).map((employee) => ({
    id: `employee-${employee.id}`,
    group: "Employees",
    label: employee.name,
    hint: `${employee.role} · ${employee.department}`,
    href: `${DIMENSION_INSIGHT_BASE}/analytics/workforce`,
  }));

  const projects: SearchEntry[] = [
    "Data Platform Migration",
    "Enterprise Renewal Program",
    "Fulfilment Network Redesign",
    "Marketing Attribution Rebuild",
    "Workforce Planning Refresh",
    "Security Layer Rollout",
  ].map((name, index) => ({
    id: `project-${index}`,
    group: "Projects",
    label: name,
    hint: "Strategic initiative · in flight",
    href: `${DIMENSION_INSIGHT_BASE}/performance`,
  }));

  const analytics: SearchEntry[] = [
    {
      label: "Revenue Trend",
      href: `${DIMENSION_INSIGHT_BASE}/analytics/finance`,
      hint: "Trailing 24 month revenue series",
    },
    {
      label: "Sales by Region",
      href: `${DIMENSION_INSIGHT_BASE}/analytics/sales`,
      hint: "Regional revenue contribution",
    },
    {
      label: "Churn Analysis",
      href: `${DIMENSION_INSIGHT_BASE}/analytics/customers`,
      hint: "Churn and retention movement",
    },
    {
      label: "Fulfilment Mix",
      href: `${DIMENSION_INSIGHT_BASE}/analytics/operations`,
      hint: "Order fulfilment distribution",
    },
    {
      label: "Channel ROI",
      href: `${DIMENSION_INSIGHT_BASE}/analytics/marketing`,
      hint: "Return on marketing investment",
    },
    {
      label: "Headcount Trend",
      href: `${DIMENSION_INSIGHT_BASE}/analytics/workforce`,
      hint: "Headcount and hiring movement",
    },
    {
      label: "Data Explorer",
      href: `${DIMENSION_INSIGHT_BASE}/data-explorer`,
      hint: "Ad hoc dimension and metric analysis",
    },
  ].map((entry, index) => ({ id: `analytics-${index}`, group: "Analytics", ...entry }));

  return [...navigation, ...reports, ...kpis, ...customers, ...products, ...employees, ...projects, ...analytics];
}

const ENTRIES = buildEntries();
const GROUP_ORDER = [
  "Navigation",
  "Analytics",
  "Reports",
  "KPIs",
  "Customers",
  "Products",
  "Employees",
  "Projects",
] as const;

export function GlobalSearch() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((value) => !value);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const navigate = React.useCallback(
    (href: string) => {
      setOpen(false);
      router.push(href);
    },
    [router],
  );

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="text-muted-foreground md:w-64 md:justify-between"
        onClick={() => setOpen(true)}
      >
        <span className="flex items-center gap-2">
          <Search className="size-4" />
          <span className="hidden md:inline">Search the platform</span>
          <span className="md:hidden">Search</span>
        </span>
        <Kbd className="hidden md:inline-flex">⌘K</Kbd>
      </Button>

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Global search"
        description="Search reports, KPIs, customers, products, projects, employees and analytics"
      >
        <CommandInput placeholder="Search reports, KPIs, customers, products, employees..." />
        <CommandList>
          <CommandEmpty>No matching records in this demonstration dataset.</CommandEmpty>
          {GROUP_ORDER.map((group, index) => {
            const items = ENTRIES.filter((entry) => entry.group === group);
            if (items.length === 0) return null;
            return (
              <React.Fragment key={group}>
                {index > 0 ? <CommandSeparator /> : null}
                <CommandGroup heading={group}>
                  {items.map((entry) => (
                    <CommandItem
                      key={entry.id}
                      value={`${entry.label} ${entry.hint} ${entry.group}`}
                      onSelect={() => navigate(entry.href)}
                    >
                      <div className="flex min-w-0 flex-col">
                        <span className="truncate">{entry.label}</span>
                        <span className="truncate text-muted-foreground text-xs">{entry.hint}</span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </React.Fragment>
            );
          })}
        </CommandList>
      </CommandDialog>
    </>
  );
}
