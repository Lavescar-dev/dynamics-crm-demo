# Vertex CRM — Implementation Guide

## Overview
- **Name**: Vertex CRM
- **Type**: Static files (Nginx)
- **Stack**: SvelteKit, Svelte 5, TypeScript, Tailwind CSS v4, bits-ui, lucide-svelte
- **Subdomain**: vertex.lavescar.com.tr
- **Idle RAM**: 0MB (static)
- **Disk**: ~6MB

## Architecture
Fully client-side SvelteKit application inspired by Microsoft Dynamics 365 CRM. Built as static files with no backend. Data is managed through an `EntityStore` pattern -- a generic localStorage-backed store that handles CRUD operations for all entity types (accounts, contacts, opportunities, leads, cases). The UI follows Microsoft Fluent Design principles with a navigation structure mirroring Dynamics 365's Sales and Service modules. Components include grid-based entity lists, detail forms, dashboards, timeline/activity views, and business process flows.

## Features
- **Sales Module**:
  - Accounts: list, detail view with related entities
  - Contacts: list, detail view
  - Opportunities: list, detail view with sales process flow
  - Leads: list, detail view with qualification process
- **Service Module**:
  - Cases: list, detail view with resolution tracking
- **Dashboards**:
  - Sales dashboard with pipeline and revenue charts
  - Service dashboard with case metrics
- Entity detail views with:
  - Business process flow bars
  - Timeline / activity history
  - Related entity sections
  - Command bar actions
- Grid-based entity lists with filtering and sorting
- Microsoft Fluent Design-inspired UI (color scheme, typography, layout)
- localStorage persistence via generic EntityStore

## Demo Credentials
No credentials needed. The demo is publicly accessible (no login gate).

## Demo Safety Measures
- DEMO watermark displayed in the UI
- `noindex` meta tag and `robots.txt` with `Disallow: /`
- Console warning indicating this is a demo environment
- All data stored in localStorage only
- No external API calls or backend services
- Fictional business data (seed data)

## Build & Deploy
```bash
# Install dependencies
cd demos/dynamics-crm-demo
bun install   # or npm install

# Build static files
bun run build
# Output: build/ directory

# Deploy
sudo cp -r build/* /var/www/vertex/

# Nginx serves the build/ directory with SPA fallback:
# try_files $uri $uri/ /index.html;
```

## File Structure
```
dynamics-crm-demo/
├── package.json                # Dependencies
├── svelte.config.js            # SvelteKit config (static adapter)
├── vite.config.ts              # Vite config
├── tsconfig.json               # TypeScript config
├── postcss.config.js           # PostCSS / Tailwind
├── tailwind.config.js          # Tailwind configuration
├── components.json             # bits-ui component config
├── static/
│   └── robots.txt              # noindex directive
├── build/                      # Production output
└── src/
    ├── app.html                # HTML shell
    ├── app.css                 # Global styles
    ├── app.d.ts                # Type declarations
    ├── lib/
    │   ├── index.ts            # Lib barrel export
    │   ├── utils.ts            # Utility functions
    │   ├── assets/             # Static assets
    │   ├── config/             # App configuration
    │   ├── data/               # Seed/mock entity data
    │   ├── stores/             # EntityStore and other Svelte stores
    │   ├── types/              # TypeScript type definitions
    │   ├── utils/              # Utility modules
    │   └── components/
    │       ├── layout/         # App shell, navigation sidebar
    │       ├── navigation/     # Nav components (sitemap, breadcrumbs)
    │       ├── grids/          # Entity grid/list components
    │       ├── forms/          # Entity form components
    │       │   └── fields/     # Form field primitives
    │       ├── dashboard/      # Dashboard widgets and charts
    │       ├── charts/         # Chart components
    │       ├── command/        # Command bar (action toolbar)
    │       ├── process/        # Business process flow bar
    │       ├── timeline/       # Activity timeline
    │       │   └── activity-types/  # Activity type renderers
    │       └── ui/             # bits-ui primitives (badge, button, checkbox, etc.)
    └── routes/
        ├── +layout.svelte      # Root layout with navigation
        ├── +page.svelte        # Root redirect
        ├── dashboard/
        │   ├── sales/          # Sales dashboard
        │   └── service/        # Service dashboard
        ├── sales/
        │   ├── accounts/       # /sales/accounts, /sales/accounts/[id]
        │   ├── contacts/       # /sales/contacts, /sales/contacts/[id]
        │   ├── opportunities/  # /sales/opportunities, /sales/opportunities/[id]
        │   └── leads/          # /sales/leads, /sales/leads/[id]
        └── service/
            └── cases/          # /service/cases, /service/cases/[id]
```

## Key Design Decisions
- **Fluent Design language**: Mirrors Microsoft Dynamics 365 visual style to demonstrate familiarity with the platform's UX patterns.
- **Generic EntityStore**: A single reusable store class handles CRUD for all entity types, reducing boilerplate and ensuring consistent data management.
- **No login gate**: Removes friction for demo visitors; the CRM is immediately accessible.
- **Business process flow component**: Simulates Dynamics 365's guided process bars on entity detail pages.
- **Grid-first entity views**: Entity lists use a data grid pattern with column sorting and filtering, matching CRM user expectations.
- **Separate dashboard routes**: Sales and Service dashboards have distinct routes and data views, reflecting real Dynamics 365 module separation.

## Verification Checklist
- [ ] `bun install` completes without errors
- [ ] `bun run build` produces a `build/` directory with `index.html`
- [ ] App loads directly (no login required)
- [ ] Sales dashboard displays pipeline and revenue data
- [ ] Service dashboard displays case metrics
- [ ] Accounts list loads with sortable/filterable grid
- [ ] Contacts list loads and links to detail views
- [ ] Opportunities list shows sales stage indicators
- [ ] Leads list shows qualification status
- [ ] Cases list shows resolution status
- [ ] Entity detail pages show business process flow bar
- [ ] Timeline/activity section renders on detail pages
- [ ] DEMO watermark is visible
- [ ] `robots.txt` contains `Disallow: /`
- [ ] Data persists after page reload (localStorage)
