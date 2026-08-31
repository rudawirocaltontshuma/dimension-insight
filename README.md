# Next.js Admin Template with TypeScript & Shadcn UI

**Studio Admin** - Includes multiple dashboards, authentication layouts, customizable theme presets, and more.

<img src="https://github.com/arhamkhnz/next-shadcn-admin-dashboard/blob/main/media/dashboard.png?version=5" alt="Dashboard Screenshot">

Most admin templates I found, free or paid, felt cluttered, outdated, or too rigid. I built this as a cleaner alternative with features often missing in others, such as theme toggling and layout controls, while keeping the design modern, minimal, and flexible.

> **View demo:** [studio admin](https://next-shadcn-admin-dashboard.vercel.app)

> [!NOTE]
> Looking for the Base UI version? Check out [next-shadcn-admin-dashboard-baseui](https://github.com/arhamkhnz/next-shadcn-admin-dashboard-baseui).
>
> Looking for the React Aria version? Check out [arhamkhnz/next-shadcn-admin-dashboard-aria](https://github.com/arhamkhnz/next-shadcn-admin-dashboard-aria).
>
> Looking for the TanStack Start version? Check out [tanstack-shadcn-admin-dashboard](https://github.com/arhamkhnz/tanstack-shadcn-admin-dashboard).

> [!TIP]
> I’m also working on Nuxt.js and Svelte versions of this dashboard. They’ll be live soon.

## Features

- Built with Next.js 16, TypeScript, Tailwind CSS v4, and Shadcn UI  
- Responsive and mobile-friendly  
- Customizable theme presets (light/dark modes with color schemes like Tangerine, Brutalist, and more)  
- Flexible layouts (collapsible sidebar, variable content widths)  
- Authentication flows and screens  
- Prebuilt dashboards (Default, CRM, Finance, Analytics, Productivity) plus legacy variants  
- Role-Based Access Control (RBAC) with config-driven UI and multi-tenant support *(planned)*  

> [!NOTE]
> The default dashboard uses the **shadcn neutral** theme.  
> It also includes additional color presets inspired by [Tweakcn](https://tweakcn.com):  
>
> - Tangerine  
> - Neo Brutalism  
> - Soft Pop  
>
> You can create more presets by following the same structure as the existing ones.

> Looking for the **Next.js 15** version?  
> Check out the [`archive/next15`](https://github.com/arhamkhnz/next-shadcn-admin-dashboard/tree/archive/next15) branch.  
> This branch contains the setup prior to upgrading to Next 16 and the React Compiler.

> Looking for the **Next.js 14 + Tailwind CSS v3** version?  
> Check out the [`archive/next14-tailwindv3`](https://github.com/arhamkhnz/next-shadcn-admin-dashboard/tree/archive/next14-tailwindv3) branch.  
> It has a different color theme and is not actively maintained, but I try to keep it updated with major changes.  

## Tech Stack

- **Framework**: Next.js 16 (App Router), TypeScript, Tailwind CSS v4  
- **UI Components**: Shadcn UI  
- **Validation**: Zod  
- **Forms & State Management**: React Hook Form, Zustand  
- **Tables & Data Handling**: TanStack Table  
- **Tooling & DX**: Biome, Husky  

## Screens

### Available
- Default Dashboard  
- CRM Dashboard  
- Finance Dashboard  
- Analytics Dashboard  
- Productivity Dashboard  
- E-commerce Dashboard  
- Academy Dashboard  
- Logistics Dashboard  
- Infrastructure Dashboard  
- File Manager  
- Patient Monitoring  
- Chat Page  
- Email Page  
- Profile  
- Users Management  
- Roles Management  
- Kanban Board  
- Tasks Page  
- Invoice Page  
- Calendar Page  
- Authentication (4 screens)  
- Legacy: Default v1, CRM v1, Finance v1, Analytics v1

### Planned
I’ve added all the planned screens. Feel free to open an issue for requesting something specific.

## Colocation File System Architecture

This project follows a **colocation-based architecture** each feature keeps its own pages, components, and logic inside its route folder.  
Shared UI, hooks, and configuration live at the top level, making the codebase modular, scalable, and easier to maintain as the app grows.

For a full breakdown of the structure with examples, see the [Next Colocation Template](https://github.com/arhamkhnz/next-colocation-template).

## Getting Started

You can run this project locally, or deploy it instantly with Vercel.

### Deploy with Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Farhamkhnz%2Fnext-shadcn-admin-dashboard)

_Deploy your own copy with one click._

### Run locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/arhamkhnz/next-shadcn-admin-dashboard.git
   ```
   
2. **Navigate into the project**
   ```bash
    cd next-shadcn-admin-dashboard
   ```
   
3. **Install dependencies**
   ```bash
    npm install
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

Your app will be running at [http://localhost:3000](http://localhost:3000)

### Formatting and Linting

Format, lint, and organize imports
```bash
npx @biomejs/biome check --write
```
> For more information on available rules, fixes, and CLI options, refer to the [Biome documentation](https://biomejs.dev/).

---

> [!IMPORTANT]  
> This project is updated frequently. If you’re working from a fork or an older clone, pull the latest changes before syncing. Some updates may include breaking changes.

---

Contributions are welcome. Feel free to open issues, feature requests, or start a discussion.


**Happy Vibe Coding!**

---
---

# DIMENSION INSIGHT

**Business Intelligence & Executive Analytics Platform**

> [!IMPORTANT]
> **Frontend demonstration using fictional data.** DIMENSION INSIGHT has no backend, no database, no
> authentication and no external integrations. Every number, customer, product, employee and report in it
> is generated locally by TypeScript modules from a fixed seed. Nothing here represents a real business.

DIMENSION INSIGHT is a portfolio project built inside this repository as a self-contained module. It lives under
the `/dimension-insight` route prefix with its own application shell, so it sits alongside the template's existing
`/dashboard` screens without replacing them.

**Entry point:** [`/dimension-insight`](http://localhost:3000/dimension-insight) — the platform overview — or
[`/dimension-insight/dashboard`](http://localhost:3000/dimension-insight/dashboard) for the executive dashboard.

## Project Overview

An enterprise business intelligence front end covering the full analytical workflow: an executive dashboard
for the consolidated position, seven analytics workspaces for departmental depth, a governed KPI centre, an
ad hoc data explorer, a report builder, a report library with full report pages, an alert centre, saved views
and workspace settings. Every module reads the same generated dataset, so figures reconcile from the board
summary down to an individual customer's product mix.

## Features

- **Executive dashboard** — ten headline KPIs (revenue, profit, growth, customers, orders, expenses, cash
  flow, employees, operational efficiency, customer satisfaction), eight executive charts, an interactive
  revenue drill-down, recent alerts and a workspace activity feed.
- **Seven analytics modules** — Sales, Finance, Customers, Operations, Marketing, Workforce and Performance,
  each with its own KPI set, chart suite and analytical table.
- **KPI centre** — a governed library of twenty measures with value, target, variance, a twelve period
  sparkline trend, owner and an On Track / At Risk / Critical status, plus a detail dialog per measure.
- **Data explorer** — dataset, primary and secondary dimension and metric selection over a 1,080 row fact
  table, with search, filters, sorting, grouping, column visibility, date range and saved views.
- **Report builder** — dataset, dimension, metrics, ten chart types, filters, date range and layout, with a
  preview that recomputes as the configuration changes.
- **Reports** — a filterable library (report, category, owner, updated, views, status) and a full report page
  for every entry, including the Executive Performance Review with its eight sections.
- **Alerts** — severity, category and status filtering with an acknowledgement workflow.
- **Saved views** — six seeded views plus session-local creation and pinning.
- **Global search** — a command menu (⌘K / Ctrl+K) over navigation, reports, KPIs, customers, products,
  employees, projects and analytics.
- **Drill-down** — Revenue → Region → Country → Customer → Product, driven entirely by local state.
- **Toasts, dialogs, sheets, tabs, dropdowns** — throughout, all with local state only.

## Architecture

The project follows this repository's colocation convention. Route-specific code lives beside its route;
shared platform code lives one level up.

```
src/app/dimension-insight/
├── layout.tsx                    Sidebar + header shell for the whole platform
├── page.tsx                      Portfolio showcase / platform overview
├── _lib/navigation.ts            Single source of truth for the nav tree
├── _components/                  Shared across every module
│   ├── charts.tsx                Recharts wrappers for all chart types
│   ├── chart-theme.ts            Palette, axis and grid conventions
│   ├── data-table.tsx            Generic TanStack Table v9 table
│   ├── quick-table.tsx           Declarative table for simple column specs
│   ├── ui-blocks.tsx             PageHeader, KpiCard, KpiGrid, ChartCard, StatusPill
│   ├── revenue-drilldown.tsx     Four level drill-down
│   ├── global-search.tsx         Command menu
│   ├── period-controls.tsx       Period / region / segment filters (Sheet on mobile)
│   ├── module-tabs.tsx           Analytics module navigation
│   └── alert-list.tsx            Alert presentation shared by dashboard and alert centre
├── dashboard/                    Executive dashboard
├── analytics/                    Overview + sales, finance, customers, operations, marketing, workforce
├── performance/  kpis/  data-explorer/  report-builder/
├── reports/  reports/[id]/  alerts/  saved-views/  settings/
└── src/data/dimension-insight/              The mock data layer (see below)
```

## Technology

- **Next.js 16** (App Router, React Server Components by default, client components only where interactive)
- **TypeScript** in strict mode, no `any`
- **React 19**
- **Tailwind CSS v4** with the project's semantic theme tokens
- **shadcn/ui** — the repository's existing local components, reused rather than reimplemented
- **Recharts** for every visualisation
- **TanStack Table v9** via the repository's shared feature registry
- **Lucide** icons, **sonner** toasts, **cmdk** command menu, **next-themes**-style preference store

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

The executive dashboard is the densest screen in the platform: a five column KPI grid on large displays, a
three column chart band, a two column analytical band containing the drill-down, and a two column footer of
alerts and activity. It collapses to two columns on tablet and a single column on mobile.

## Data Visualization

Ten chart forms are demonstrated — Line, Bar, Area, Pie, Donut, Scatter, Composed, Funnel, KPI and Table —
all built through one wrapper layer over Recharts (`_components/charts.tsx`) so axis formatting, grid
treatment, tooltips and the colour sequence stay identical everywhere. Colours come from the Tailwind default
palette exposed as CSS custom properties, keeping charts legible in light mode, dark mode and every theme
preset in the repository.

## Responsive Design

- **Desktop** — dense multi column executive layouts, a persistent collapsible sidebar, inline filter controls.
- **Tablet** — grids reflow to two columns; charts resize with their containers.
- **Mobile** — the sidebar becomes a Sheet, cards stack, filters and the data explorer's configuration panel
  move into Sheets, tables scroll horizontally inside their own container, and the report builder becomes a
  vertical flow. No page scrolls horizontally at any width.

Dark mode is wired to the repository's existing preference store with Light, Dark and System options, exposed
both in the header and in Settings → Appearance.

## Component Architecture

Reuse is deliberate: one `KpiCard` powers every KPI across all modules, one `ChartCard` frames every
visualisation, one chart wrapper module serves all ten chart types, and two table layers cover every grid —
`DimensionInsightDataTable` for typed columns with custom cells, and `QuickTable` for declarative column specs. Pages
stay as Server Components; only genuinely interactive pieces are client components.

## Mock Data Disclaimer

All data is fictional and generated in the browser and at build time by `src/data/dimension-insight/`:

| Module | Purpose |
| --- | --- |
| `random.ts` | Seeded `mulberry32` PRNG — the same seed always yields the same dataset |
| `dimensions.ts` | Regions, countries, categories, departments, segments, channels, name pools |
| `datasets.ts` | 24 monthly periods, 156 products, 324 customers, 118 employees, 540 orders, 520 sales opportunities, 336 expenses, 540 transactions, 1,080 analytics fact rows |
| `aggregates.ts` | Regional, category, channel, department and headline roll-ups |
| `content.ts` | KPI library, alerts, reports, saved views and the activity feed |
| `format.ts` | Currency, compact, percentage and date formatting |

No network request is made, nothing is persisted, and no company, person, product or figure named anywhere in
the platform is real. Interactions that would normally write somewhere — exporting, sharing, subscribing,
saving a view or a report draft — raise a toast and change local state only.

## Portfolio Purpose

DIMENSION INSIGHT is project #8 in a professional portfolio and exists to demonstrate front-end engineering at
enterprise scale: information hierarchy across a large module surface, dashboard and data-visualisation
architecture, advanced table interaction, drill-down and exploration interfaces, disciplined component reuse,
responsive behaviour from wide desktop to small mobile, and full light and dark theming — all with a
production-clean TypeScript build and lint.
