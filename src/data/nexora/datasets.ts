/**
 * NEXORA INSIGHT — fictional dataset layer.
 *
 * All figures are generated deterministically from fixed seeds so the numbers
 * stay coherent across the executive dashboard, analytics workspaces, KPI
 * center, data explorer and reports. Nothing here talks to a network.
 */

import {
  COMPANY_PREFIXES,
  COMPANY_SUFFIXES,
  CUSTOMER_SEGMENTS,
  type CustomerSegment,
  DEPARTMENTS,
  type Department,
  EXPENSE_CATEGORIES,
  type ExpenseCategory,
  FIRST_NAMES,
  INDUSTRIES,
  LAST_NAMES,
  MARKETING_CHANNELS,
  type MarketingChannel,
  PRODUCT_CATEGORIES,
  type ProductCategory,
  REGIONS,
} from "./dimensions";
import { createRng, type Rng, round } from "./random";

export const MONTH_COUNT = 24;
export const ANCHOR_YEAR = 2026;
export const ANCHOR_MONTH = 8; // August 2026 is the latest closed period.

export interface PeriodPoint {
  /** `2026-08` */
  key: string;
  /** `Aug 26` */
  label: string;
  /** `Aug` */
  short: string;
  year: number;
  month: number;
  quarter: string;
  date: string;
}

function buildPeriods(): PeriodPoint[] {
  const periods: PeriodPoint[] = [];
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  for (let offset = MONTH_COUNT - 1; offset >= 0; offset--) {
    const absolute = ANCHOR_YEAR * 12 + (ANCHOR_MONTH - 1) - offset;
    const year = Math.floor(absolute / 12);
    const month = (absolute % 12) + 1;
    const short = monthNames[month - 1];
    periods.push({
      key: `${year}-${String(month).padStart(2, "0")}`,
      label: `${short} ${String(year).slice(2)}`,
      short,
      year,
      month,
      quarter: `Q${Math.ceil(month / 3)} ${year}`,
      date: `${year}-${String(month).padStart(2, "0")}-01`,
    });
  }
  return periods;
}

export const PERIODS = buildPeriods();

/* ------------------------------------------------------------------ */
/* Core monthly financial + operating series                           */
/* ------------------------------------------------------------------ */

export interface MonthlyMetrics extends PeriodPoint {
  revenue: number;
  expenses: number;
  profit: number;
  grossMargin: number;
  netMargin: number;
  cashFlow: number;
  budget: number;
  orders: number;
  averageOrderValue: number;
  customers: number;
  newCustomers: number;
  churnedCustomers: number;
  churnRate: number;
  retentionRate: number;
  leads: number;
  qualifiedLeads: number;
  conversionRate: number;
  marketingSpend: number;
  cac: number;
  ltv: number;
  headcount: number;
  hires: number;
  departures: number;
  turnoverRate: number;
  attendanceRate: number;
  productivityIndex: number;
  performanceScore: number;
  fulfillmentRate: number;
  onTimeDelivery: number;
  inventoryTurnover: number;
  supportTickets: number;
  incidents: number;
  efficiency: number;
  satisfaction: number;
  nps: number;
  pipeline: number;
}

function buildMonthlyMetrics(): MonthlyMetrics[] {
  const rng = createRng(20260831);
  const seasonality = [1.02, 0.94, 1.0, 1.03, 1.01, 1.08, 0.96, 0.99, 1.05, 1.06, 1.04, 1.14];

  let customers = 2140;
  let headcount = 612;

  return PERIODS.map((period, index) => {
    const growthCurve = 1 + index * 0.0187;
    const noise = rng.float(0.965, 1.035);
    const season = seasonality[period.month - 1];
    const revenue = round(3_180_000 * growthCurve * season * noise);

    const expenseRatio = 0.741 - index * 0.0016 + rng.float(-0.012, 0.012);
    const expenses = round(revenue * expenseRatio);
    const profit = revenue - expenses;
    const grossMargin = round(62.4 + index * 0.09 + rng.float(-1.1, 1.1), 1);
    const netMargin = round((profit / revenue) * 100, 1);
    const cashFlow = round(profit * rng.float(0.72, 0.96));
    const budget = round(revenue * rng.float(0.94, 1.07));

    const averageOrderValue = round(1_640 + index * 7.4 + rng.float(-70, 70));
    const orders = Math.round(revenue / averageOrderValue);

    const newCustomers = Math.round(84 + index * 1.9 + rng.float(-11, 11));
    const churnRate = round(2.42 - index * 0.021 + rng.float(-0.2, 0.2), 2);
    const churnedCustomers = Math.round(customers * (churnRate / 100));
    customers = customers + newCustomers - churnedCustomers;
    const retentionRate = round(100 - churnRate, 2);

    const leads = Math.round(2_950 + index * 34 + rng.float(-180, 180));
    const qualifiedLeads = Math.round(leads * rng.float(0.36, 0.44));
    const conversionRate = round((newCustomers / qualifiedLeads) * 100, 2);
    const marketingSpend = round(expenses * rng.float(0.16, 0.2));
    const cac = round(marketingSpend / newCustomers);
    const ltv = round(averageOrderValue * rng.float(11.5, 14.2));

    const hires = Math.round(11 + rng.float(-4, 7));
    const departures = Math.round(6 + rng.float(-3, 4));
    headcount = headcount + hires - departures;
    const turnoverRate = round((departures / headcount) * 100 * 12, 1);

    return {
      ...period,
      revenue,
      expenses,
      profit,
      grossMargin,
      netMargin,
      cashFlow,
      budget,
      orders,
      averageOrderValue,
      customers,
      newCustomers,
      churnedCustomers,
      churnRate,
      retentionRate,
      leads,
      qualifiedLeads,
      conversionRate,
      marketingSpend,
      cac,
      ltv,
      headcount,
      hires,
      departures,
      turnoverRate,
      attendanceRate: round(94.1 + rng.float(-1.6, 2.2), 1),
      productivityIndex: round(101 + index * 0.36 + rng.float(-2.4, 2.4), 1),
      performanceScore: round(78.4 + index * 0.24 + rng.float(-2.1, 2.1), 1),
      fulfillmentRate: round(95.2 + index * 0.09 + rng.float(-1.2, 1.2), 1),
      onTimeDelivery: round(93.1 + index * 0.11 + rng.float(-1.5, 1.5), 1),
      inventoryTurnover: round(6.1 + index * 0.021 + rng.float(-0.35, 0.35), 2),
      supportTickets: Math.round(1_420 + rng.float(-160, 210)),
      incidents: Math.round(18 + rng.float(-7, 9)),
      efficiency: round(86.3 + index * 0.19 + rng.float(-1.7, 1.7), 1),
      satisfaction: round(4.21 + index * 0.008 + rng.float(-0.09, 0.09), 2),
      nps: Math.round(41 + index * 0.42 + rng.float(-3, 3)),
      pipeline: round(revenue * rng.float(2.6, 3.3)),
    };
  });
}

export const MONTHLY: MonthlyMetrics[] = buildMonthlyMetrics();
export const CURRENT = MONTHLY[MONTHLY.length - 1];
export const PREVIOUS = MONTHLY[MONTHLY.length - 2];
export const LAST_12 = MONTHLY.slice(-12);
export const PRIOR_12 = MONTHLY.slice(-24, -12);

export function sum<T>(rows: T[], selector: (row: T) => number) {
  return rows.reduce((total, row) => total + selector(row), 0);
}

export function average<T>(rows: T[], selector: (row: T) => number) {
  return rows.length === 0 ? 0 : sum(rows, selector) / rows.length;
}

export function delta(current: number, previous: number) {
  if (previous === 0) return 0;
  return round(((current - previous) / previous) * 100, 1);
}

/* ------------------------------------------------------------------ */
/* Products                                                            */
/* ------------------------------------------------------------------ */

const PRODUCT_LINES: Record<ProductCategory, string[]> = {
  "Analytics Suite": ["Pulse", "Signal", "Atlas", "Vector", "Prism"],
  "Data Platform": ["Foundry", "Lakehouse", "Stream", "Catalog", "Vault"],
  "Automation Cloud": ["Flow", "Orchestrate", "Trigger", "Runbook", "Scheduler"],
  "Security Layer": ["Sentinel", "Guardrail", "Cipher", "Perimeter", "Audit"],
  "Integration Hub": ["Bridge", "Connector", "Relay", "Gateway", "Sync"],
  "Professional Services": ["Onboarding", "Advisory", "Migration", "Enablement", "Support"],
};

const PRODUCT_TIERS = ["Core", "Pro", "Enterprise", "Scale", "Edge"];

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: ProductCategory;
  tier: string;
  unitPrice: number;
  unitsSold: number;
  revenue: number;
  margin: number;
  growth: number;
  stock: number;
  reorderPoint: number;
  rating: number;
  status: "Active" | "Beta" | "Sunset";
}

function buildProducts(): Product[] {
  const rng = createRng(881204);
  const products: Product[] = [];
  let index = 0;
  while (products.length < 156) {
    const category = PRODUCT_CATEGORIES[index % PRODUCT_CATEGORIES.length];
    const line = PRODUCT_LINES[category][Math.floor(index / PRODUCT_CATEGORIES.length) % 5];
    const tier = PRODUCT_TIERS[Math.floor(index / (PRODUCT_CATEGORIES.length * 5)) % PRODUCT_TIERS.length];
    const unitPrice = round(rng.float(320, 9_800), 2);
    const unitsSold = rng.int(120, 3_400);
    const revenue = round(unitPrice * unitsSold);
    products.push({
      id: `PRD-${String(1000 + index)}`,
      name: `${line} ${tier}`,
      sku: `NX-${category.slice(0, 2).toUpperCase()}-${String(1000 + index)}`,
      category,
      tier,
      unitPrice,
      unitsSold,
      revenue,
      margin: round(rng.float(38, 79), 1),
      growth: round(rng.float(-14, 42), 1),
      stock: rng.int(0, 4_200),
      reorderPoint: rng.int(120, 900),
      rating: round(rng.float(3.4, 4.9), 1),
      status: rng.weighted([
        { value: "Active" as const, weight: 8 },
        { value: "Beta" as const, weight: 1.4 },
        { value: "Sunset" as const, weight: 0.6 },
      ]),
    });
    index++;
  }
  return products;
}

export const PRODUCTS = buildProducts();

/* ------------------------------------------------------------------ */
/* Customers                                                           */
/* ------------------------------------------------------------------ */

export interface Customer {
  id: string;
  name: string;
  segment: CustomerSegment;
  industry: string;
  region: string;
  country: string;
  accountManager: string;
  revenue: number;
  orders: number;
  lifetimeValue: number;
  healthScore: number;
  satisfaction: number;
  churnRisk: "Low" | "Medium" | "High";
  status: "Active" | "At Risk" | "Churned" | "Onboarding";
  since: string;
  lastOrder: string;
}

function personName(rng: ReturnType<typeof createRng>) {
  return `${rng.pick(FIRST_NAMES)} ${rng.pick(LAST_NAMES)}`;
}

const SEGMENT_REVENUE_MULTIPLIER: Record<CustomerSegment, number> = {
  Enterprise: 5.4,
  "Mid-Market": 2.6,
  "Public Sector": 3.1,
  Growth: 1,
  Startup: 1,
};

function customerChurnRisk(healthScore: number): Customer["churnRisk"] {
  if (healthScore > 78) return "Low";
  return healthScore > 58 ? "Medium" : "High";
}

function customerStatus(churnRisk: Customer["churnRisk"], rng: Rng): Customer["status"] {
  if (churnRisk === "High" && rng.bool(0.34)) return "At Risk";
  if (rng.bool(0.05)) return "Churned";
  return rng.bool(0.07) ? "Onboarding" : "Active";
}

function buildCustomers(): Customer[] {
  const rng = createRng(430991);
  const customers: Customer[] = [];
  for (let index = 0; index < 324; index++) {
    const region = REGIONS[index % REGIONS.length];
    const country = region.countries[index % region.countries.length];
    const segment = CUSTOMER_SEGMENTS[index % CUSTOMER_SEGMENTS.length];
    const segmentMultiplier = SEGMENT_REVENUE_MULTIPLIER[segment] ?? 1;
    const revenue = round(rng.float(24_000, 210_000) * segmentMultiplier);
    const orders = rng.int(6, 148);
    const healthScore = round(rng.float(38, 98), 1);
    const churnRisk = customerChurnRisk(healthScore);
    const status = customerStatus(churnRisk, rng);
    customers.push({
      id: `CUS-${String(4000 + index)}`,
      name: `${COMPANY_PREFIXES[index % COMPANY_PREFIXES.length]} ${
        COMPANY_SUFFIXES[Math.floor(index / COMPANY_PREFIXES.length) % COMPANY_SUFFIXES.length]
      }`,
      segment,
      industry: INDUSTRIES[index % INDUSTRIES.length],
      region: region.name,
      country: country.name,
      accountManager: personName(rng),
      revenue,
      orders,
      lifetimeValue: round(revenue * rng.float(2.1, 4.6)),
      healthScore,
      satisfaction: round(rng.float(3.1, 5), 1),
      churnRisk,
      status,
      since: `${2018 + (index % 8)}-${String((index % 12) + 1).padStart(2, "0")}-${String((index % 27) + 1).padStart(2, "0")}`,
      lastOrder: `2026-0${(index % 8) + 1}-${String((index % 27) + 1).padStart(2, "0")}`,
    });
  }
  return customers;
}

export const CUSTOMERS = buildCustomers();

/* ------------------------------------------------------------------ */
/* Employees                                                           */
/* ------------------------------------------------------------------ */

const ROLES: Record<Department, string[]> = {
  Sales: ["Account Executive", "Sales Director", "Solutions Consultant", "Sales Operations Analyst"],
  Marketing: ["Campaign Manager", "Content Strategist", "Demand Generation Lead", "Brand Designer"],
  Engineering: ["Platform Engineer", "Frontend Engineer", "Site Reliability Engineer", "Engineering Manager"],
  Finance: ["Financial Analyst", "Controller", "Treasury Manager", "FP&A Lead"],
  Operations: ["Operations Manager", "Fulfilment Lead", "Logistics Analyst", "Process Engineer"],
  "Customer Success": ["Customer Success Manager", "Onboarding Specialist", "Renewals Manager", "Support Lead"],
  People: ["Talent Partner", "People Operations Lead", "Learning Designer", "Compensation Analyst"],
  "Data & Analytics": ["Data Engineer", "Analytics Lead", "BI Developer", "Data Scientist"],
};

export interface Employee {
  id: string;
  name: string;
  department: Department;
  role: string;
  region: string;
  tenureYears: number;
  performance: number;
  productivity: number;
  attendance: number;
  engagement: number;
  status: "Active" | "On Leave" | "Notice Period";
}

function buildEmployees(): Employee[] {
  const rng = createRng(770123);
  const employees: Employee[] = [];
  for (let index = 0; index < 118; index++) {
    const department = DEPARTMENTS[index % DEPARTMENTS.length];
    employees.push({
      id: `EMP-${String(2000 + index)}`,
      name: personName(rng),
      department,
      role: ROLES[department][index % ROLES[department].length],
      region: REGIONS[index % REGIONS.length].name,
      tenureYears: round(rng.float(0.3, 11.4), 1),
      performance: round(rng.float(62, 98), 1),
      productivity: round(rng.float(74, 126), 1),
      attendance: round(rng.float(88, 100), 1),
      engagement: round(rng.float(55, 96), 1),
      status: rng.weighted([
        { value: "Active" as const, weight: 9 },
        { value: "On Leave" as const, weight: 0.7 },
        { value: "Notice Period" as const, weight: 0.4 },
      ]),
    });
  }
  return employees;
}

export const EMPLOYEES = buildEmployees();

/* ------------------------------------------------------------------ */
/* Orders, sales records, expenses, transactions                       */
/* ------------------------------------------------------------------ */

export interface Order {
  id: string;
  date: string;
  customer: string;
  customerId: string;
  product: string;
  category: ProductCategory;
  region: string;
  country: string;
  units: number;
  amount: number;
  channel: "Direct" | "Partner" | "Self-Serve" | "Marketplace";
  fulfillment: "Fulfilled" | "Processing" | "Delayed" | "Cancelled";
  deliveryDays: number;
}

function buildOrders(): Order[] {
  const rng = createRng(101577);
  const orders: Order[] = [];
  for (let index = 0; index < 540; index++) {
    const customer = CUSTOMERS[index % CUSTOMERS.length];
    const product = PRODUCTS[(index * 7) % PRODUCTS.length];
    const period = PERIODS[index % PERIODS.length];
    const units = rng.int(1, 42);
    orders.push({
      id: `ORD-${String(90000 + index)}`,
      date: `${period.key}-${String((index % 27) + 1).padStart(2, "0")}`,
      customer: customer.name,
      customerId: customer.id,
      product: product.name,
      category: product.category,
      region: customer.region,
      country: customer.country,
      units,
      amount: round(units * product.unitPrice),
      channel: rng.weighted([
        { value: "Direct" as const, weight: 5 },
        { value: "Partner" as const, weight: 2.6 },
        { value: "Self-Serve" as const, weight: 1.8 },
        { value: "Marketplace" as const, weight: 1.1 },
      ]),
      fulfillment: rng.weighted([
        { value: "Fulfilled" as const, weight: 8 },
        { value: "Processing" as const, weight: 1.6 },
        { value: "Delayed" as const, weight: 0.8 },
        { value: "Cancelled" as const, weight: 0.3 },
      ]),
      deliveryDays: rng.int(1, 14),
    });
  }
  return orders;
}

export const ORDERS = buildOrders();

export interface SalesRecord {
  id: string;
  date: string;
  period: string;
  rep: string;
  region: string;
  country: string;
  segment: CustomerSegment;
  product: string;
  category: ProductCategory;
  stage: "Prospect" | "Qualified" | "Proposal" | "Negotiation" | "Closed Won" | "Closed Lost";
  amount: number;
  probability: number;
}

const PIPELINE_STAGES = ["Prospect", "Qualified", "Proposal", "Negotiation", "Closed Won", "Closed Lost"] as const;

const STAGE_PROBABILITY: Record<SalesRecord["stage"], number> = {
  Prospect: 15,
  Qualified: 35,
  Proposal: 55,
  Negotiation: 75,
  "Closed Won": 100,
  "Closed Lost": 0,
};

function buildSales(): SalesRecord[] {
  const rng = createRng(556677);
  const reps = Array.from({ length: 24 }, () => personName(rng));
  const records: SalesRecord[] = [];
  for (let index = 0; index < 520; index++) {
    const customer = CUSTOMERS[(index * 3) % CUSTOMERS.length];
    const product = PRODUCTS[(index * 5) % PRODUCTS.length];
    const period = PERIODS[index % PERIODS.length];
    const stage = rng.weighted([
      { value: "Prospect" as const, weight: 3.2 },
      { value: "Qualified" as const, weight: 2.8 },
      { value: "Proposal" as const, weight: 2.2 },
      { value: "Negotiation" as const, weight: 1.6 },
      { value: "Closed Won" as const, weight: 3.4 },
      { value: "Closed Lost" as const, weight: 1.4 },
    ]);
    const probability = STAGE_PROBABILITY[stage];
    records.push({
      id: `OPP-${String(70000 + index)}`,
      date: `${period.key}-${String((index % 27) + 1).padStart(2, "0")}`,
      period: period.key,
      rep: reps[index % reps.length],
      region: customer.region,
      country: customer.country,
      segment: customer.segment,
      product: product.name,
      category: product.category,
      stage,
      amount: round(rng.float(14_000, 640_000)),
      probability,
    });
  }
  return records;
}

export const SALES = buildSales();
export const SALES_STAGES = PIPELINE_STAGES;

export interface Expense {
  id: string;
  date: string;
  period: string;
  category: ExpenseCategory;
  department: Department;
  vendor: string;
  amount: number;
  budget: number;
  status: "Approved" | "Pending" | "Flagged";
}

function buildExpenses(): Expense[] {
  const rng = createRng(334455);
  const expenses: Expense[] = [];
  for (let index = 0; index < 336; index++) {
    const period = PERIODS[index % PERIODS.length];
    const amount = round(rng.float(18_000, 620_000));
    expenses.push({
      id: `EXP-${String(50000 + index)}`,
      date: `${period.key}-${String((index % 27) + 1).padStart(2, "0")}`,
      period: period.key,
      category: EXPENSE_CATEGORIES[index % EXPENSE_CATEGORIES.length],
      department: DEPARTMENTS[index % DEPARTMENTS.length],
      vendor: `${COMPANY_PREFIXES[(index * 3) % COMPANY_PREFIXES.length]} ${
        COMPANY_SUFFIXES[index % COMPANY_SUFFIXES.length]
      }`,
      amount,
      budget: round(amount * rng.float(0.86, 1.24)),
      status: rng.weighted([
        { value: "Approved" as const, weight: 8 },
        { value: "Pending" as const, weight: 1.6 },
        { value: "Flagged" as const, weight: 0.7 },
      ]),
    });
  }
  return expenses;
}

export const EXPENSES = buildExpenses();

export interface Transaction {
  id: string;
  date: string;
  period: string;
  type: "Invoice" | "Payment" | "Refund" | "Credit Note" | "Payout";
  account: string;
  counterparty: string;
  amount: number;
  currency: "USD" | "EUR" | "GBP" | "JPY";
  status: "Cleared" | "Pending" | "Failed";
}

const NEGATIVE_TRANSACTION_TYPES = new Set<Transaction["type"]>(["Refund", "Credit Note", "Payout"]);

function buildTransactions(): Transaction[] {
  const rng = createRng(998877);
  const accounts = ["Operating", "Treasury", "Payroll", "Reserve", "Merchant"];
  const rows: Transaction[] = [];
  for (let index = 0; index < 540; index++) {
    const period = PERIODS[index % PERIODS.length];
    const customer = CUSTOMERS[(index * 11) % CUSTOMERS.length];
    const type = rng.weighted([
      { value: "Invoice" as const, weight: 4 },
      { value: "Payment" as const, weight: 3.6 },
      { value: "Refund" as const, weight: 0.8 },
      { value: "Credit Note" as const, weight: 0.6 },
      { value: "Payout" as const, weight: 1.2 },
    ]);
    const magnitude = round(rng.float(4_200, 480_000), 2);
    rows.push({
      id: `TRX-${String(600000 + index)}`,
      date: `${period.key}-${String((index % 27) + 1).padStart(2, "0")}`,
      period: period.key,
      type,
      account: accounts[index % accounts.length],
      counterparty: customer.name,
      amount: NEGATIVE_TRANSACTION_TYPES.has(type) ? -magnitude : magnitude,
      currency: rng.weighted([
        { value: "USD" as const, weight: 6 },
        { value: "EUR" as const, weight: 2.4 },
        { value: "GBP" as const, weight: 1.2 },
        { value: "JPY" as const, weight: 0.8 },
      ]),
      status: rng.weighted([
        { value: "Cleared" as const, weight: 8.4 },
        { value: "Pending" as const, weight: 1.2 },
        { value: "Failed" as const, weight: 0.4 },
      ]),
    });
  }
  return rows;
}

export const TRANSACTIONS = buildTransactions();

/* ------------------------------------------------------------------ */
/* Analytics fact table (the Data Explorer source)                     */
/* ------------------------------------------------------------------ */

export interface AnalyticsRecord {
  id: string;
  period: string;
  date: string;
  region: string;
  country: string;
  segment: CustomerSegment;
  channel: MarketingChannel;
  category: ProductCategory;
  department: Department;
  revenue: number;
  cost: number;
  profit: number;
  margin: number;
  orders: number;
  customers: number;
  sessions: number;
  conversionRate: number;
  satisfaction: number;
}

function buildAnalyticsRecords(): AnalyticsRecord[] {
  const rng = createRng(20240917);
  const rows: AnalyticsRecord[] = [];
  for (let index = 0; index < 1_080; index++) {
    const period = PERIODS[index % PERIODS.length];
    const region = REGIONS[index % REGIONS.length];
    const country = region.countries[index % region.countries.length];
    const revenue = round(rng.float(48_000, 1_240_000) * region.share * 3.4);
    const cost = round(revenue * rng.float(0.42, 0.78));
    const profit = revenue - cost;
    const orders = rng.int(24, 620);
    rows.push({
      id: `ANL-${String(300000 + index)}`,
      period: period.key,
      date: `${period.key}-${String((index % 27) + 1).padStart(2, "0")}`,
      region: region.name,
      country: country.name,
      segment: CUSTOMER_SEGMENTS[index % CUSTOMER_SEGMENTS.length],
      channel: MARKETING_CHANNELS[index % MARKETING_CHANNELS.length],
      category: PRODUCT_CATEGORIES[index % PRODUCT_CATEGORIES.length],
      department: DEPARTMENTS[index % DEPARTMENTS.length],
      revenue,
      cost,
      profit,
      margin: round((profit / revenue) * 100, 1),
      orders,
      customers: rng.int(8, 210),
      sessions: rng.int(1_200, 42_000),
      conversionRate: round(rng.float(1.4, 8.6), 2),
      satisfaction: round(rng.float(3.2, 4.9), 2),
    });
  }
  return rows;
}

export const ANALYTICS_RECORDS = buildAnalyticsRecords();

export const DATASET_COUNTS = {
  sales: SALES.length,
  customers: CUSTOMERS.length,
  orders: ORDERS.length,
  products: PRODUCTS.length,
  employees: EMPLOYEES.length,
  expenses: EXPENSES.length,
  transactions: TRANSACTIONS.length,
  analytics: ANALYTICS_RECORDS.length,
};
