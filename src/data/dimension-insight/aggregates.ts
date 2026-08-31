/** Derived aggregations shared by dashboards, analytics workspaces and reports. */

import {
  ANALYTICS_RECORDS,
  average,
  CURRENT,
  CUSTOMERS,
  delta,
  EMPLOYEES,
  EXPENSES,
  LAST_12,
  MONTHLY,
  ORDERS,
  PRIOR_12,
  PRODUCTS,
  SALES,
  sum,
} from "./datasets";
import {
  CUSTOMER_SEGMENTS,
  DEPARTMENTS,
  EXPENSE_CATEGORIES,
  MARKETING_CHANNELS,
  PRODUCT_CATEGORIES,
  REGIONS,
} from "./dimensions";
import { round } from "./random";

export interface CategoryDatum {
  name: string;
  value: number;
  secondary?: number;
  share?: number;
}

const last12Revenue = sum(LAST_12, (row) => row.revenue);

export const REVENUE_BY_REGION: CategoryDatum[] = REGIONS.map((region) => ({
  name: region.name,
  value: round(last12Revenue * region.share),
  share: round(region.share * 100, 1),
  secondary: round(last12Revenue * region.share * 0.34),
}));

export const REVENUE_BY_COUNTRY: Record<string, CategoryDatum[]> = Object.fromEntries(
  REGIONS.map((region) => [
    region.name,
    region.countries.map((country) => ({
      name: country.name,
      value: round(last12Revenue * region.share * country.share),
      share: round(country.share * 100, 1),
    })),
  ]),
);

export const REVENUE_BY_CATEGORY: CategoryDatum[] = PRODUCT_CATEGORIES.map((category) => {
  const value = sum(
    PRODUCTS.filter((product) => product.category === category),
    (product) => product.revenue,
  );
  return { name: category, value: round(value) };
}).sort((a, b) => b.value - a.value);

export const TOP_PRODUCTS = [...PRODUCTS].sort((a, b) => b.revenue - a.revenue).slice(0, 10);

export const EXPENSE_BREAKDOWN: CategoryDatum[] = EXPENSE_CATEGORIES.map((category) => {
  const rows = EXPENSES.filter((expense) => expense.category === category);
  return {
    name: category,
    value: round(sum(rows, (row) => row.amount)),
    secondary: round(sum(rows, (row) => row.budget)),
  };
}).sort((a, b) => b.value - a.value);

export const CUSTOMER_SEGMENT_BREAKDOWN: CategoryDatum[] = CUSTOMER_SEGMENTS.map((segment) => {
  const rows = CUSTOMERS.filter((customer) => customer.segment === segment);
  return {
    name: segment,
    value: rows.length,
    secondary: round(sum(rows, (row) => row.revenue)),
  };
});

export const CHANNEL_PERFORMANCE = MARKETING_CHANNELS.map((channel) => {
  const rows = ANALYTICS_RECORDS.filter((record) => record.channel === channel);
  const revenue = round(sum(rows, (row) => row.revenue));
  const cost = round(sum(rows, (row) => row.cost) * 0.22);
  return {
    name: channel,
    revenue,
    spend: cost,
    leads: Math.round(sum(rows, (row) => row.sessions) / 42),
    conversionRate: round(
      average(rows, (row) => row.conversionRate),
      2,
    ),
    roi: round(((revenue - cost) / cost) * 100, 1),
    cac: round(cost / Math.max(1, Math.round(sum(rows, (row) => row.customers) / 6))),
  };
}).sort((a, b) => b.revenue - a.revenue);

export const DEPARTMENT_PERFORMANCE = DEPARTMENTS.map((department) => {
  const staff = EMPLOYEES.filter((employee) => employee.department === department);
  const facts = ANALYTICS_RECORDS.filter((record) => record.department === department);
  return {
    name: department,
    headcount: staff.length,
    performance: round(
      average(staff, (row) => row.performance),
      1,
    ),
    productivity: round(
      average(staff, (row) => row.productivity),
      1,
    ),
    engagement: round(
      average(staff, (row) => row.engagement),
      1,
    ),
    attendance: round(
      average(staff, (row) => row.attendance),
      1,
    ),
    revenue: round(sum(facts, (row) => row.revenue)),
    target: round(sum(facts, (row) => row.revenue) * 1.06),
  };
});

export const REGIONAL_PERFORMANCE = REGIONS.map((region) => {
  const facts = ANALYTICS_RECORDS.filter((record) => record.region === region.name);
  const revenue = round(sum(facts, (row) => row.revenue));
  return {
    name: region.name,
    revenue,
    target: round(revenue * (1 + (region.share - 0.2))),
    margin: round(
      average(facts, (row) => row.margin),
      1,
    ),
    orders: sum(facts, (row) => row.orders),
    customers: CUSTOMERS.filter((customer) => customer.region === region.name).length,
    satisfaction: round(
      average(facts, (row) => row.satisfaction),
      2,
    ),
  };
});

export const TEAM_PERFORMANCE = [
  "Enterprise Sales",
  "Commercial Sales",
  "Growth Marketing",
  "Platform Engineering",
  "Customer Success",
  "Revenue Operations",
  "Data & Analytics",
  "Fulfilment",
].map((team, index) => {
  const base = 72 + ((index * 13) % 21);
  return {
    name: team,
    score: round(base + (index % 4) * 1.7, 1),
    target: 82,
    trend: round(((index % 5) - 1.6) * 2.4, 1),
    members: 9 + ((index * 5) % 18),
  };
});

export const PIPELINE_BY_STAGE = ["Prospect", "Qualified", "Proposal", "Negotiation", "Closed Won"].map((stage) => {
  const rows = SALES.filter((record) => record.stage === stage);
  return {
    name: stage,
    value: round(sum(rows, (row) => row.amount)),
    count: rows.length,
  };
});

export const FULFILLMENT_BREAKDOWN: CategoryDatum[] = ["Fulfilled", "Processing", "Delayed", "Cancelled"].map(
  (status) => ({
    name: status,
    value: ORDERS.filter((order) => order.fulfillment === status).length,
  }),
);

export const DELIVERY_DISTRIBUTION = [
  { name: "1-2 days", value: ORDERS.filter((order) => order.deliveryDays <= 2).length },
  { name: "3-5 days", value: ORDERS.filter((order) => order.deliveryDays > 2 && order.deliveryDays <= 5).length },
  { name: "6-9 days", value: ORDERS.filter((order) => order.deliveryDays > 5 && order.deliveryDays <= 9).length },
  { name: "10+ days", value: ORDERS.filter((order) => order.deliveryDays > 9).length },
];

export const INVENTORY_BY_CATEGORY = PRODUCT_CATEGORIES.map((category) => {
  const rows = PRODUCTS.filter((product) => product.category === category);
  return {
    name: category,
    stock: sum(rows, (row) => row.stock),
    reorder: sum(rows, (row) => row.reorderPoint),
    belowReorder: rows.filter((row) => row.stock < row.reorderPoint).length,
  };
});

function campaignStatus(index: number) {
  if (index < 4) return "Active" as const;
  return index < 6 ? ("Scheduled" as const) : ("Completed" as const);
}

export const CAMPAIGNS = [
  "Q3 Enterprise Expansion",
  "Data Platform Launch",
  "Partner Co-Marketing",
  "Lifecycle Reactivation",
  "Industry Summit Series",
  "Security Layer Awareness",
  "Self-Serve Onboarding",
].map((name, index) => {
  const spend = 180_000 + index * 46_500;
  const revenue = round(spend * (2.4 + ((index * 7) % 19) / 10));
  const leads = 1_240 + index * 318;
  return {
    name,
    channel: MARKETING_CHANNELS[index % MARKETING_CHANNELS.length],
    spend,
    revenue,
    leads,
    conversions: Math.round(leads * (0.06 + (index % 5) * 0.011)),
    roi: round(((revenue - spend) / spend) * 100, 1),
    status: campaignStatus(index),
  };
});

export const SCATTER_PRODUCTS = PRODUCTS.slice(0, 90).map((product) => ({
  name: product.name,
  margin: product.margin,
  revenue: round(product.revenue / 1000),
  units: product.unitsSold,
}));

/* Executive headline metrics ---------------------------------------- */

export const HEADLINE = {
  revenue: sum(LAST_12, (row) => row.revenue),
  revenueDelta: delta(
    sum(LAST_12, (row) => row.revenue),
    sum(PRIOR_12, (row) => row.revenue),
  ),
  profit: sum(LAST_12, (row) => row.profit),
  profitDelta: delta(
    sum(LAST_12, (row) => row.profit),
    sum(PRIOR_12, (row) => row.profit),
  ),
  expenses: sum(LAST_12, (row) => row.expenses),
  expensesDelta: delta(
    sum(LAST_12, (row) => row.expenses),
    sum(PRIOR_12, (row) => row.expenses),
  ),
  cashFlow: sum(LAST_12, (row) => row.cashFlow),
  cashFlowDelta: delta(
    sum(LAST_12, (row) => row.cashFlow),
    sum(PRIOR_12, (row) => row.cashFlow),
  ),
  orders: sum(LAST_12, (row) => row.orders),
  ordersDelta: delta(
    sum(LAST_12, (row) => row.orders),
    sum(PRIOR_12, (row) => row.orders),
  ),
  customers: CURRENT.customers,
  customersDelta: delta(CURRENT.customers, MONTHLY[MONTHLY.length - 13].customers),
  employees: CURRENT.headcount,
  employeesDelta: delta(CURRENT.headcount, MONTHLY[MONTHLY.length - 13].headcount),
  efficiency: CURRENT.efficiency,
  efficiencyDelta: delta(CURRENT.efficiency, MONTHLY[MONTHLY.length - 13].efficiency),
  satisfaction: CURRENT.satisfaction,
  satisfactionDelta: delta(CURRENT.satisfaction, MONTHLY[MONTHLY.length - 13].satisfaction),
  growth: delta(CURRENT.revenue, MONTHLY[MONTHLY.length - 13].revenue),
  netMargin: CURRENT.netMargin,
  grossMargin: CURRENT.grossMargin,
  averageOrderValue: CURRENT.averageOrderValue,
  conversionRate: CURRENT.conversionRate,
  churnRate: CURRENT.churnRate,
  retentionRate: CURRENT.retentionRate,
  ltv: CURRENT.ltv,
  cac: CURRENT.cac,
  pipeline: CURRENT.pipeline,
  nps: CURRENT.nps,
};
