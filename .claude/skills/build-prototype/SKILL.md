---
name: "Build Prototype"
description: "Build a clickable prototype that shows the client what the application will look and feel like — a sales and alignment tool. Two variants: raw HTML (default) or React + MUI (when the repo has a React client)."
version: "2.0"
phase: "2B"
contexts:
  - "empa-project"
  - "remarkets"
triggers:
  - "architecture is decided"
  - "user says 'let's build the prototype'"
  - "user wants to show the client what the app will look like"
  - "user wants to port an existing HTML prototype into the React client"
inputs:
  - "Approved architecture-decision.md"
  - "Brand assets if available (logo, colors, fonts)"
  - "Optional: existing HTML prototype to port"
outputs:
  - "Variant A (default): prototype/ folder with HTML + CSS files"
  - "Variant B (React client): pages under src/<ClientProject>/src/prototype/ wired into the real router, with an MUI theme and typed mock data"
---

# Skill: Build Prototype

## Purpose

Deliver a clickable prototype that shows the client what the application will look and feel like before writing any functional code. This is a sales and alignment tool — de la vista nacen grandes proyectos. A polished prototype closes deals, aligns expectations, and gives the team a visual north star.

## Choose the variant

Inspect the repo **before** writing anything:

- **Variant A — Raw HTML** (default): no React client in the repo, or the audience explicitly wants pure HTML mocks they can host anywhere. Follow Steps 1–6 below.
- **Variant B — React + MUI**: the repo has a client project (`src/*.Client/` or `packages/app`) with `@mui/material` in its `package.json`. The prototype lives inside the real client so it shares the theme and router with production. Follow **Variant B: React + MUI** near the end of this file.

For the ReMarkets repo (`src/ReMarkets.CustomerPortal.Client/`) Variant B is mandatory — the repo-level `CLAUDE.md` already declares React + MUI + Zustand as the stack, and raw HTML would duplicate the design system.

## Prerequisites

- [ ] `architecture-decision.md` exists and is approved
- [ ] Brand info available (or defaults will be used)
- [ ] (Variant B only) `src/<ClientProject>/package.json` contains `@mui/material` and `react-router-dom`

## Process

### Step 1: Define Screens

Based on the charter and architecture, identify which screens to build. Typical set:

| Screen | Purpose |
|--------|---------|
| Login / Sign-in | First impression, sets brand tone |
| Dashboard / Home | Shows main value of the application |
| Navigation / Menu | Demonstrates information architecture |
| Core Feature #1 | The primary thing the app does |
| Core Feature #2 | Secondary key feature (if applicable) |
| Settings / Profile | Shows depth and completeness |

Confirm the screen list with the team lead before building.

### Step 2: Set Up Brand Variables

Every prototype starts with CSS custom properties:

```css
:root {
    --brand-primary: #1a2634;
    --brand-primary-light: #2c3e50;
    --brand-accent: #3498db;
    --brand-accent-hover: #5dade2;
    --brand-white: #ffffff;
    --brand-gray-100: #f8fafc;
    --brand-gray-200: #e2e8f0;
    --brand-gray-400: #94a3b8;
    --brand-gray-600: #64748b;
    --brand-success: #10b981;
    --brand-warning: #f59e0b;
    --brand-danger: #ef4444;
}

body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
```

Replace values with actual brand colors if provided.

### Step 3: Choose CSS Approach

Pick based on project fit:

| Approach | Best For | Vibe |
|----------|----------|------|
| Custom CSS + CSS Variables | Full control, any brand | Tailored, professional |
| Bootstrap 5 (CDN) | Fast prototyping, corporate | Standard, familiar |
| Tailwind CSS (CDN) | Modern look, utility-first | Startup, modern |
| Pure.css (CDN) | Minimal, lightweight | Clean, elegant |
| Bulma (CDN) | Flexbox-based, easy | Clean, modern |
| Pico CSS (CDN) | Classless, semantic HTML | Ultra-minimal |

### Step 4: Build Screens

Build each screen following these mandatory rules:

**HTML:**
- Each screen is its own HTML file
- Every navigation link between screens MUST work (real hrefs, not #)
- Consistent navbar/header on every page
- Footer with copyright and version number on every page

**Icons — INLINE SVG ONLY:**
- NEVER use Font Awesome, Lucide CDN, Feather CDN, or any external icon library
- Every icon is an inline SVG element directly in the HTML
- Use stroke-based SVGs: `viewBox="0 0 24 24"`, `fill="none"`, `stroke="currentColor"`, `stroke-width="2"`

```html
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
     stroke-linecap="round" stroke-linejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
</svg>
```

**Data:**
- ALL placeholder data must look real — real names, dates, amounts, statuses
- NEVER use Lorem ipsum, "John Doe", "test@test.com", or obviously fake data
- Data should tell a story that makes sense for the application domain
- Use fictional/invented data — never real client data unless explicitly provided

**Quality:**
- A client should believe it's a working application at first glance
- Not a wireframe, not a mockup — it looks like a real app
- Transitions and hover states where appropriate (CSS only)
- Consistent spacing, typography, and color usage throughout
- Responsive if the project requires it

### Step 5: Organize File Structure

```
prototype/
    index.html          <- Login or landing (entry point)
    dashboard.html      <- Main dashboard / home
    feature-1.html      <- Core feature screen
    feature-2.html      <- Secondary feature
    settings.html       <- Settings / profile
    css/
        prototype.css   <- Custom styles or overrides
    img/
        logo.png        <- Brand assets if available
```

### Step 6: Review and Iterate

Present the prototype to the team lead. Walk through each screen. Iterate on:
- Look and feel
- Navigation flow
- Data realism
- Missing screens or features

## Verification

- [ ] All planned screens are built
- [ ] Every navigation link works (no broken links, no # placeholders)
- [ ] Every icon is an inline SVG (zero external icon dependencies)
- [ ] Brand colors are in CSS :root variables
- [ ] Placeholder data looks real and domain-appropriate
- [ ] Consistent header/footer across all pages
- [ ] `prototype/index.html` is the entry point
- [ ] Team lead has reviewed and approved

## Common Mistakes

- Using Font Awesome or any external icon CDN — breaks the zero-dependency rule
- Using Lorem ipsum or "John Doe" — kills the illusion of a real app
- Links that go to `#` instead of actual pages — client clicks and nothing happens
- Inconsistent colors — using hardcoded hex instead of CSS variables
- Building too many screens — 4-6 key screens is enough, don't build the whole app
- Forgetting mobile responsiveness when the project requires it

---

# Variant B: React + MUI (for projects with a React client)

Use this variant whenever the repo ships a React client with `@mui/material` in `package.json`. The prototype becomes part of the real client so stakeholders see pixel-accurate production-grade components, and the team inherits the router + theme for free when real features land.

## When to use

- `src/<ClientProject>/package.json` lists `@mui/material`, `@emotion/*`, `react-router-dom`.
- The repo-level `CLAUDE.md` prescribes React + MUI + Zustand (ReMarkets is the canonical case).
- The PO or design team wants to iterate on the prototype via Claude without running the backend.

If only the HTML variant is appropriate (static site, no React), stop here and use Steps 1–6 above.

## Target layout

```
src/<ClientProject>/src/
  themes/
    theme.ts                       # createTheme() with brand palette + Inter typography
  router/
    ROUTES.ts                      # enum of all prototype routes + getRoutePath helper
    Router.tsx                     # createBrowserRouter tree
    index.ts                       # barrel
  config/
    App.Config.tsx                 # minimal context provider (grows with real features)
  prototype/
    README.md                      # PO-facing run + modify guide
    layout/
      PrototypeLayout.tsx          # sidebar + topbar + <Outlet/> + footer
      Sidebar.tsx
      Topbar.tsx
    components/
      StatusChip.tsx               # colored-dot Chip for state labels
      KpiCard.tsx                  # stat card (value + label + trend)
      PageHeader.tsx               # title + subtitle + actions
      DonutChart.tsx               # CSS/SVG donut, no chart lib
      SectionCard.tsx              # titled Card wrapper reused everywhere
    mocks/
      <domain>.ts                  # one typed module per aggregate (offers, inventory, …)
    pages/
      LoginPage.tsx                # / — no layout, entry point
      DashboardPage.tsx
      <feature>Page.tsx            # one file per screen
```

## Mandatory rules

1. **Icons** come from `@mui/icons-material`. Never pull in Font Awesome, Lucide, or any other CDN — MUI icons are SVG and already tree-shake.
2. **No hardcoded hex** in pages or components. Use theme tokens: `sx={{ color: 'primary.main' }}`, `bgcolor: 'grey.100'`, `borderColor: 'divider'`. The only place hex values live is `themes/theme.ts` (and one-off brand accents explicitly tied to palette data, e.g. donut slice colors).
3. **Layout uses `Grid` (two-axis) or `Stack` (one-axis)**. Raw flex/grid CSS is allowed only in the layout shell (fixed sidebar, full-height main).
4. **Navigation uses `ROUTES` + `<NavLink>` / `<Link>` / `useNavigate`**. Never hardcode `"/dashboard"` in a component — import `ROUTES.DASHBOARD`.
5. **Placeholder data is realistic** (real-looking names, lot IDs, dates, amounts, statuses). No Lorem ipsum, no "John Doe", no `test@test.com`.
6. **Mock data lives in typed modules under `prototype/mocks/`**. No `fetch`, no `openapi-fetch`, no Zustand store — just named exports of typed arrays/objects.
7. **Every route works** — no dead links, no `href="#"`.
8. **Self-host fonts via `@fontsource/*`** (e.g., `@fontsource/inter`). Do NOT depend on `fonts.googleapis.com` at runtime.
9. **Wrap the app once** in `App.tsx`: `<AppConfigProvider><ThemeProvider><CssBaseline/><RouterProvider/></ThemeProvider></AppConfigProvider>`.
10. **Raw MUI is fine for prototypes**. Do NOT prematurely extract BID-prefixed wrappers — that's what the `add-common-component` skill does later, once a real feature is scaffolded.

## ReMarkets palette (copy into `themes/theme.ts`)

```ts
createTheme({
  palette: {
    primary:   { main: '#0f172a', light: '#1e293b', dark: '#000000', contrastText: '#ffffff' },
    secondary: { main: '#488B37', light: '#5BA24A', dark: '#3A7430', contrastText: '#ffffff' },
    success:   { main: '#059669', light: '#10b981', dark: '#047857' },
    warning:   { main: '#d97706', light: '#f59e0b', dark: '#b45309' },
    error:     { main: '#dc2626', light: '#ef4444', dark: '#b91c1c' },
    info:      { main: '#0891b2', light: '#06b6d4', dark: '#0e7490' },
    grey: {
      50: '#f8fafc', 100: '#f1f5f9', 200: '#e2e8f0', 300: '#cbd5e1',
      400: '#94a3b8', 500: '#64748b', 600: '#475569', 700: '#334155',
      800: '#1e293b', 900: '#0f172a',
    },
    background: { default: '#f8fafc', paper: '#ffffff' },
  },
  shape: { borderRadius: 8 },
  typography: {
    fontFamily: '"Inter", -apple-system, "Segoe UI", Roboto, sans-serif',
    button: { textTransform: 'none', fontWeight: 600 },
  },
});
```

Sidebar uses `palette.primary` (navy); active state uses `rgba(72, 139, 55, 0.15)` with `secondary.light` text — derived from the palette, not hardcoded elsewhere.

## Recommended screen set (ReMarkets)

Mirrors the ubiquitous language in the repo `CLAUDE.md`:

| Route | Purpose |
|---|---|
| `/` | Login with Microsoft SSO button (clicks through to `/dashboard`) |
| `/dashboard` | KPI cards + Recent Offers + Pending Approvals + Inventory Snapshot |
| `/offers` | List with tabs + filters, and an in-cell editing bid grid with detail sidebar |
| `/inventory` | Upload dropzone + 2 donut charts + Recent Uploads + lots table |
| `/allocations` | KPI row + pending approval cards (with reason flags) + Recently Approved table |
| `/customers` | Customer accounts table + "acting on behalf of" masquerade banner |

For other React projects, adapt the list to the domain but keep the shape: Login → Dashboard → 3-4 core feature screens.

## Mocks shape

Each mock module exports **typed arrays or objects** that pages import directly:

```ts
// src/prototype/mocks/offers.ts
export type OfferStatus = 'Active' | 'Pending' | 'Approved' | 'Rejected' | 'Scheduled' | 'Closed';
export interface Offer { /* ... */ }
export const OFFERS: Offer[] = [ /* 5–20 realistic rows */ ];
```

If the prototype needs cross-page state (e.g., filter selections that persist), use `useState` at the page level or a small `useReducer` — **not** Zustand. The prototype should stay reviewable without hunting through stores.

## Router setup

`router/ROUTES.ts`:

```ts
export const ROUTES = {
  LOGIN:       '/',
  DASHBOARD:   '/dashboard',
  OFFERS:      '/offers',
  INVENTORY:   '/inventory',
  ALLOCATIONS: '/allocations',
  CUSTOMERS:   '/customers',
} as const;
export type RouteKey = keyof typeof ROUTES;
export const getRoutePath = (key: RouteKey) => ROUTES[key];
```

`router/Router.tsx` uses `createBrowserRouter` (react-router v7):
- `/` → `LoginPage` (no shell).
- A layout route wrapping `<PrototypeLayout/>` with children for `/dashboard`, `/offers`, `/inventory`, `/allocations`, `/customers`.
- `*` → `<Navigate to={ROUTES.DASHBOARD} replace />`.

## Verification checklist

- [ ] `npm install` succeeds (adds `@fontsource/<font>` if needed).
- [ ] `npm run build` passes TypeScript + Vite.
- [ ] `npm run lint` passes.
- [ ] `npm run dev` opens the Login screen at `/`.
- [ ] Every `ROUTES.*` value resolves; sidebar highlights the active route.
- [ ] No browser-console errors on any page.
- [ ] No hardcoded hex in `pages/` or `components/` (search: `#[0-9a-fA-F]{3,8}`).
- [ ] No `href="#"` and no `to="/something"` strings bypassing `ROUTES`.
- [ ] A `src/<ClientProject>/src/prototype/README.md` exists explaining how the PO runs and modifies it.

## Common mistakes (React variant)

- Hardcoding `sx={{ color: '#488B37' }}` instead of `sx={{ color: 'secondary.main' }}` — drifts from the theme.
- Hardcoding `<Link to="/offers">` instead of `<Link to={ROUTES.OFFERS}>` — renames break silently.
- Importing a raw `<table>` instead of MUI `<Table>` — loses the theme's cell styles.
- Forgetting `<CssBaseline/>` — padding, margins, and background stay Vite-default.
- Pulling in `fonts.googleapis.com` — use `@fontsource/*` so the prototype works offline.
- Introducing BID-prefixed wrappers during the prototype — premature; let `add-common-component` do that when a real feature lands.
- Wiring real API calls "to make it more realistic" — defeats the point; mocks keep the PO unblocked.
