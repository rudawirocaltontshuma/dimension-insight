import packageJson from "../../package.json";

const currentYear = new Date().getFullYear();

export const APP_CONFIG = {
  name: "Dimension Insight",
  version: packageJson.version,
  copyright: `© ${currentYear}, Dimension Insight.`,
  meta: {
    title: "Dimension Insight — Business Intelligence & Executive Analytics Platform",
    description:
      "Dimension Insight is a business intelligence and executive analytics platform built with Next.js, TypeScript, Tailwind CSS and shadcn/ui — executive dashboards, analytics workspaces, a KPI centre, a data explorer, a report builder and more, on generated mock data.",
  },
};
