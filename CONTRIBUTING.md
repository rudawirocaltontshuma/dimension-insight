# Contributing to Dimension Insight

Thanks for your interest in improving Dimension Insight. This guide covers how to set up your environment
and where things live in this codebase.

---

## Overview

Dimension Insight is built with **Next.js**, **TypeScript**, **Tailwind CSS**, and **shadcn/ui**. The goal
is to keep the codebase modular, scalable, and easy to extend.

---

## Project Layout

The project uses a **colocation-based file system**: each route keeps its own page, components, and logic
next to it, while shared code lives one level up.

```
src
├── app
│   ├── dimension-insight     # The application: routes, shared shell, shared components
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── _lib/              # Navigation config
│   │   ├── _components/       # Shared across every module (charts, tables, header, sidebar, search…)
│   │   ├── dashboard/
│   │   ├── analytics/
│   │   ├── performance/  kpis/  data-explorer/  report-builder/
│   │   └── reports/  reports/[id]/  alerts/  saved-views/  settings/
│   └── (main)/auth           # Auth screens
├── data
│   └── dimension-insight     # The mock data layer (seeded, deterministic generators)
├── components/ui             # shadcn/ui primitives
├── hooks                     # Reusable hooks
├── lib                       # Config & utilities
├── stores                    # Preference store (theme, layout)
└── styles                    # Tailwind / theme setup
```

---

## Getting Started

### Fork and clone the repository

1. Fork the repository, then clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/business_intelligence_platform.git
   cd business_intelligence_platform
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the dev server:
   ```bash
   npm run dev
   ```
   The app runs at [http://localhost:3000](http://localhost:3000) and redirects into `/dimension-insight`.

---

## Contribution Flow

- Always create a new branch before working on changes:
  ```bash
  git checkout -b feature/my-update
  ```

- Use clear, conventional commit messages:
  ```bash
  git commit -m "feat: add churn cohort chart to customer analytics"
  ```

- Open a pull request once ready. If your change adds a new screen or visible component, include a
  screenshot in the PR description.

---

## Where to Contribute

- **Modules and routes** — new or updated screens go in `src/app/dimension-insight/<module>/`, following the
  existing colocation pattern (`_components/` for route-local pieces).
- **Shared platform components** — charts, tables, the KPI card, the header/sidebar shell, and the command
  menu live in `src/app/dimension-insight/_components/`. Extend these rather than creating parallel
  one-off implementations.
- **Mock data** — everything under `src/data/dimension-insight/`. Keep new data **deterministic**: derive it
  from the seeded `mulberry32` PRNG in `random.ts` rather than `Math.random()`, so the dataset stays
  reproducible and every module's figures keep reconciling with one another.
- **shadcn/ui primitives** — `src/components/ui/`. Add new primitives via the shadcn CLI rather than hand
  authoring, to stay consistent with the rest of the kit.
- **Theming / preferences** — `src/stores/preferences/` and `src/lib/preferences/`.

---

## Guidelines

- Prefer **TypeScript types** over `any`.
- Husky pre-commit hooks are enabled — linting and formatting run automatically on commit, and the commit is
  blocked until any errors are fixed.
- Follow the existing **shadcn/ui** and Tailwind conventions already used across the app.
- Keep accessibility in mind (ARIA, keyboard navigation).
- No backend, database, authentication, or external network calls — this stays a frontend application over
  generated data. Interactions that would normally persist somewhere (saving a view, exporting a report,
  acknowledging an alert) should update local state and show a toast, not attempt to write anywhere real.
- Avoid unnecessary dependencies — prefer what's already in the project.

---

## Verifying your change

Before opening a PR, run:

```bash
npx tsc --noEmit
npm run lint
npm run build
```

All three should complete without errors.

---

## Submitting PRs

- Ensure your branch is up to date with `main` before submitting.
- Reference any related issue in your PR description for context.

---

## Questions & Support

Report bugs, suggestions, or questions via [GitHub Issues](https://github.com/rudawirocaltontshuma/business_intelligence_platform/issues).
