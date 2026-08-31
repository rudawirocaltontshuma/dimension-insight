import {
  Activity,
  BarChart3,
  Bell,
  Bookmark,
  Building2,
  Compass,
  FileBarChart,
  Gauge,
  LayoutDashboard,
  type LucideIcon,
  Megaphone,
  PieChart,
  Settings,
  Sparkles,
  Table2,
  Target,
  TrendingUp,
  Truck,
  Users,
  Wallet,
  Wrench,
} from "lucide-react";

export const DIMENSION_INSIGHT_BASE = "/dimension-insight";

export interface DimensionInsightNavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  description: string;
  items?: DimensionInsightNavItem[];
}

export interface DimensionInsightNavGroup {
  label: string;
  items: DimensionInsightNavItem[];
}

export const ANALYTICS_MODULES: DimensionInsightNavItem[] = [
  {
    title: "Sales",
    href: `${DIMENSION_INSIGHT_BASE}/analytics/sales`,
    icon: TrendingUp,
    description: "Revenue, orders, pipeline and regional attainment",
  },
  {
    title: "Finance",
    href: `${DIMENSION_INSIGHT_BASE}/analytics/finance`,
    icon: Wallet,
    description: "Revenue, expenses, margin and budget variance",
  },
  {
    title: "Customers",
    href: `${DIMENSION_INSIGHT_BASE}/analytics/customers`,
    icon: Users,
    description: "Acquisition, retention, churn, lifetime value",
  },
  {
    title: "Operations",
    href: `${DIMENSION_INSIGHT_BASE}/analytics/operations`,
    icon: Truck,
    description: "Fulfilment, delivery, inventory and incidents",
  },
  {
    title: "Marketing",
    href: `${DIMENSION_INSIGHT_BASE}/analytics/marketing`,
    icon: Megaphone,
    description: "Campaigns, leads, acquisition cost and channel ROI",
  },
  {
    title: "Workforce",
    href: `${DIMENSION_INSIGHT_BASE}/analytics/workforce`,
    icon: Building2,
    description: "Headcount, hiring, turnover and productivity",
  },
  {
    title: "Performance",
    href: `${DIMENSION_INSIGHT_BASE}/performance`,
    icon: Activity,
    description: "Department, regional, team and KPI performance",
  },
];

export const DIMENSION_INSIGHT_NAV: DimensionInsightNavGroup[] = [
  {
    label: "Overview",
    items: [
      {
        title: "Executive Dashboard",
        href: `${DIMENSION_INSIGHT_BASE}/dashboard`,
        icon: LayoutDashboard,
        description: "Consolidated executive position across the business",
      },
      {
        title: "Platform Overview",
        href: DIMENSION_INSIGHT_BASE,
        icon: Sparkles,
        description: "Portfolio showcase for DIMENSION INSIGHT",
      },
    ],
  },
  {
    label: "Analytics",
    items: [
      {
        title: "Analytics Workspace",
        href: `${DIMENSION_INSIGHT_BASE}/analytics`,
        icon: BarChart3,
        description: "Entry point to every analytics module",
        items: ANALYTICS_MODULES,
      },
    ],
  },
  {
    label: "Intelligence",
    items: [
      {
        title: "KPI Center",
        href: `${DIMENSION_INSIGHT_BASE}/kpis`,
        icon: Target,
        description: "KPI library with targets, variance and ownership",
      },
      {
        title: "Data Explorer",
        href: `${DIMENSION_INSIGHT_BASE}/data-explorer`,
        icon: Compass,
        description: "Dimension and metric exploration across datasets",
      },
      {
        title: "Report Builder",
        href: `${DIMENSION_INSIGHT_BASE}/report-builder`,
        icon: Wrench,
        description: "Compose a report from datasets, metrics and charts",
      },
    ],
  },
  {
    label: "Distribution",
    items: [
      {
        title: "Reports",
        href: `${DIMENSION_INSIGHT_BASE}/reports`,
        icon: FileBarChart,
        description: "Report library and published deliverables",
      },
      {
        title: "Alerts",
        href: `${DIMENSION_INSIGHT_BASE}/alerts`,
        icon: Bell,
        description: "Analytics alerts by severity and category",
      },
      {
        title: "Saved Views",
        href: `${DIMENSION_INSIGHT_BASE}/saved-views`,
        icon: Bookmark,
        description: "Reusable analysis configurations",
      },
    ],
  },
  {
    label: "Workspace",
    items: [
      {
        title: "Settings",
        href: `${DIMENSION_INSIGHT_BASE}/settings`,
        icon: Settings,
        description: "Appearance, dashboard, notification and display preferences",
      },
    ],
  },
];

export const NAV_ICONS = { Gauge, PieChart, Table2 };
