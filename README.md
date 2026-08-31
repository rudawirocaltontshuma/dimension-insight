# Dimension Insight

**Business Intelligence & Executive Analytics Platform**

Dimension Insight is a frontend business intelligence application: an executive dashboard, seven analytics
workspaces, a governed KPI centre, an ad hoc data explorer, a report builder, a report library, an alert
centre, saved views and workspace settings — all built on Next.js, TypeScript, React, Tailwind CSS and
shadcn/ui.

> [!IMPORTANT]
> **This is a frontend application over generated data.** There is no backend, database, authentication or
> external integration. Every number, customer, product, employee and report is generated locally by
> deterministic TypeScript modules from a fixed seed, so the same dataset renders on every load and every
> module's figures reconcile with one another.

## Project Overview

Dimension Insight covers the full analytical workflow you'd expect from an enterprise BI tool:

- an **executive dashboard** for the consolidated position across the business
- **seven analytics workspaces** — Sales, Finance, Customers, Operations, Marketing, Workforce, Performance
  — for departmental depth
- a **KPI centre** — a governed library of measures with targets, variance and trend
- a **data explorer** for ad hoc dimension/metric analysis over the fact table
- a **report builder** for composing and previewing a report from a dataset, dimensions, metrics and a chart
  type
- a **report library** with full report pages, including a multi-section executive report
- an **alert centre** and **saved views**
- **global search** (⌘K / Ctrl+K) across navigation, reports, KPIs, customers, products, employees and
  analytics

Every module reads from the same generated dataset, so figures reconcile from the board summary down to an
individual customer's product mix.

## Features

- **Executive dashboard** — ten headline KPIs (revenue, profit, growth, customers, orders, expenses, cash
  flow, employees, operational efficiency, customer satisfaction), eight executive charts, an interactive
  revenue drill-down, recent alerts and a workspace activity feed.
- **Seven analytics modules** — Sales, Finance, Customers, Operations, Marketing, Workforce and Performance,
  each with its own KPI set, chart suite and analytical table.
- **KPI centre** — a library of twenty measures with value, target, variance, a twelve-period sparkline
  trend, owner and an On Track / At Risk / Critical status, plus a detail dialog per measure.
- **Data explorer** — dataset, primary and secondary dimension and metric selection over a 1,080-row fact
  table, with search, filters, sorting, grouping, column visibility, date range and saved views.
- **Report builder** — dataset, dimension, metrics, ten chart types, filters, date range and layout, with a
  preview that recomputes as the configuration changes.
- **Reports** — a filterable library (report, category, owner, updated, views, status) and a full report
  page for every entry, including a multi-section Executive Performance Review.
- **Alerts** — severity, category and status filtering with an acknowledgement workflow.
- **Saved views** — six seeded views plus session-local creation and pinning.
- **Drill-down** — Revenue → Region → Country → Customer → Product, driven entirely by local state.
- **Global search** — a command menu over navigation, reports, KPIs, customers, products, employees, projects
  and analytics.
- **Toasts, dialogs, sheets, tabs, dropdowns** — throughout, all with local state only.
- **Responsive design** — dense desktop layouts down to a fully mobile-adapted sidebar, filters and tables.
- **Theming** — Light, Dark and System modes.

## Architecture

The project follows a colocation-based file system: route-specific code lives beside its route, shared
platform code lives one level up.

```
src/app/dimension-insight/
├── layout.tsx                    Sidebar + header shell for the whole platform
├── page.tsx                      Platform overview / entry point
├── _lib/navigation.ts            Single source of truth for the nav tree
├── _components/                  Shared across every module
│   ├── charts.tsx                Recharts wrappers for all chart types
│   ├── chart-theme.ts            Palette, axis and grid conventions
│   ├── data-table.tsx            Generic TanStack Table v9 table
│   ├── quick-table.tsx           Declarative table for simple column specs
│   ├── ui-blocks.tsx             PageHeader, KpiCard, KpiGrid, ChartCard, StatusPill
│   ├── revenue-drilldown.tsx     Four-level drill-down
│   ├── global-search.tsx         Command menu
│   ├── theme-switcher.tsx        Light / dark / system toggle
│   ├── period-controls.tsx       Period / region / segment filters (Sheet on mobile)
│   ├── module-tabs.tsx           Analytics module navigation
│   └── alert-list.tsx            Alert presentation shared by dashboard and alert centre
├── dashboard/                    Executive dashboard
├── analytics/                    Overview + sales, finance, customers, operations, marketing, workforce
├── performance/  kpis/  data-explorer/  report-builder/
└── reports/  reports/[id]/  alerts/  saved-views/  settings/

src/data/dimension-insight/       The mock data layer (see below)
```

Pages are React Server Components by default; only genuinely interactive pieces are marked as client
components.

## Technology

- **Next.js** (App Router, React Server Components by default)
- **TypeScript** in strict mode, no `any`
- **React 19**
- **Tailwind CSS v4** with semantic theme tokens
- **shadcn/ui** components, reused rather than reimplemented
- **Recharts** for every visualisation
- **TanStack Table v9** for every data grid
- **Lucide** icons, **sonner** toasts, **cmdk** command menu, a small **Zustand**-backed preference store

## Analytics Modules

| Module | Metrics | Charts |
| --- | --- | --- |
| Sales | Revenue, Orders, AOV, Conversion, Pipeline, Regional, Product | Revenue trend, Sales by region, Top products, Pipeline funnel |
| Finance | Revenue, Expenses, Profit, Margins, Cash flow, Budget vs actual | Revenue, Expenses, Profit, Margins, Budget variance |
| Customers | Customers, Acquisition, Retention, Churn, LTV, Segments | Growth, Acquisition, Retention, Churn, Segments |
| Operations | Orders, Fulfilment, Inventory, Delivery, Efficiency, Issues | Efficiency, Fulfilment, Delivery, Inventory |
| Marketing | Campaigns, Leads, Conversions, CAC, ROI, Channels | Campaign performance, Lead conversion, ROI, Channels |
| Workforce | Headcount, Hiring, Turnover, Attendance, Performance, Productivity | Headcount, Hiring, Turnover, Performance |
| Performance | Department, Regional, Team and KPI performance | Attainment, scorecards, scatter, trend comparison |

## Dashboard

The executive dashboard is the densest screen in the platform: a five-column KPI grid on large displays, a
three-column chart band, a two-column analytical band containing the drill-down, and a two-column footer of
alerts and activity. It collapses to two columns on tablet and a single column on mobile.

## Data Visualization

Ten chart forms are demonstrated — Line, Bar, Area, Pie, Donut, Scatter, Composed, Funnel, KPI and Table —
all built through one wrapper layer over Recharts (`_components/charts.tsx`), so axis formatting, grid
treatment, tooltips and the colour sequence stay consistent everywhere. Colours are driven by CSS custom
properties, keeping charts legible in both light and dark mode.

## Responsive Design

- **Desktop** — dense multi-column executive layouts, a persistent collapsible sidebar, inline filter
  controls.
- **Tablet** — grids reflow to two columns; charts resize with their containers.
- **Mobile** — the sidebar becomes a Sheet, cards stack, filters and the data explorer's configuration panel
  move into Sheets, tables scroll horizontally inside their own container, and the report builder becomes a
  vertical flow. No page scrolls horizontally at any width.

Dark mode is wired to the app's own preference store with Light, Dark and System options, exposed both in
the header and in Settings → Appearance.

## Component Architecture

Reuse is deliberate: one `KpiCard` powers every KPI across all modules, one `ChartCard` frames every
visualisation, one chart wrapper module serves all ten chart types, and two table layers cover every grid —
`DimensionInsightDataTable` for typed columns with custom cells, and `QuickTable` for declarative column
specs.

## Mock Data Disclaimer

All data is fictional and generated locally by `src/data/dimension-insight/`:

| Module | Purpose |
| --- | --- |
| `random.ts` | Seeded `mulberry32` PRNG — the same seed always yields the same dataset |
| `dimensions.ts` | Regions, countries, categories, departments, segments, channels, name pools |
| `datasets.ts` | 24 monthly periods, 156 products, 324 customers, 118 employees, 540 orders, 520 sales opportunities, 336 expenses, 540 transactions, 1,080 analytics fact rows |
| `aggregates.ts` | Regional, category, channel, department and headline roll-ups |
| `content.ts` | KPI library, alerts, reports, saved views and the activity feed |
| `format.ts` | Currency, compact, percentage and date formatting |

No network request is made, nothing is persisted, and no company, person, product or figure named anywhere
in the platform is real. Interactions that would normally write somewhere — exporting, sharing, subscribing,
saving a view or a report draft — raise a toast and change local state only.

## Getting Started

### Run locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/rudawirocaltontshuma/business_intelligence_platform.git
   cd business_intelligence_platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

   The app runs at [http://localhost:3000](http://localhost:3000) — root, `/dashboard` and any `/dashboard/*`
   path all redirect to `/dimension-insight`, the platform's entry point.

### Formatting and linting

```bash
npm run lint       # Biome lint
npm run check       # Biome check
npm run check:fix    # Biome check --write
```

### Production build

```bash
npm run build
npm run start
```

## License

MIT — see [LICENSE](./LICENSE).
