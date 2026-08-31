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

export const NEXORA_BASE = "/nexora";

export interface NexoraNavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  description: string;
  items?: NexoraNavItem[];
}

export interface NexoraNavGroup {
  label: string;
  items: NexoraNavItem[];
}

export const ANALYTICS_MODULES: NexoraNavItem[] = [
  {
    title: "Sales",
    href: `${NEXORA_BASE}/analytics/sales`,
    icon: TrendingUp,
    description: "Revenue, orders, pipeline and regional attainment",
  },
  {
    title: "Finance",
    href: `${NEXORA_BASE}/analytics/finance`,
    icon: Wallet,
    description: "Revenue, expenses, margin and budget variance",
  },
  {
    title: "Customers",
    href: `${NEXORA_BASE}/analytics/customers`,
    icon: Users,
    description: "Acquisition, retention, churn, lifetime value",
  },
  {
    title: "Operations",
    href: `${NEXORA_BASE}/analytics/operations`,
    icon: Truck,
    description: "Fulfilment, delivery, inventory and incidents",
  },
  {
    title: "Marketing",
    href: `${NEXORA_BASE}/analytics/marketing`,
    icon: Megaphone,
    description: "Campaigns, leads, acquisition cost and channel ROI",
  },
  {
    title: "Workforce",
    href: `${NEXORA_BASE}/analytics/workforce`,
    icon: Building2,
    description: "Headcount, hiring, turnover and productivity",
  },
  {
    title: "Performance",
    href: `${NEXORA_BASE}/performance`,
    icon: Activity,
    description: "Department, regional, team and KPI performance",
  },
];

export const NEXORA_NAV: NexoraNavGroup[] = [
  {
    label: "Overview",
    items: [
      {
        title: "Executive Dashboard",
        href: `${NEXORA_BASE}/dashboard`,
        icon: LayoutDashboard,
        description: "Consolidated executive position across the business",
      },
      {
        title: "Platform Overview",
        href: NEXORA_BASE,
        icon: Sparkles,
        description: "Portfolio showcase for NEXORA INSIGHT",
      },
    ],
  },
  {
    label: "Analytics",
    items: [
      {
        title: "Analytics Workspace",
        href: `${NEXORA_BASE}/analytics`,
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
        href: `${NEXORA_BASE}/kpis`,
        icon: Target,
        description: "KPI library with targets, variance and ownership",
      },
      {
        title: "Data Explorer",
        href: `${NEXORA_BASE}/data-explorer`,
        icon: Compass,
        description: "Dimension and metric exploration across datasets",
      },
      {
        title: "Report Builder",
        href: `${NEXORA_BASE}/report-builder`,
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
        href: `${NEXORA_BASE}/reports`,
        icon: FileBarChart,
        description: "Report library and published deliverables",
      },
      {
        title: "Alerts",
        href: `${NEXORA_BASE}/alerts`,
        icon: Bell,
        description: "Analytics alerts by severity and category",
      },
      {
        title: "Saved Views",
        href: `${NEXORA_BASE}/saved-views`,
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
        href: `${NEXORA_BASE}/settings`,
        icon: Settings,
        description: "Appearance, dashboard, notification and display preferences",
      },
    ],
  },
];

export const NAV_ICONS = { Gauge, PieChart, Table2 };
