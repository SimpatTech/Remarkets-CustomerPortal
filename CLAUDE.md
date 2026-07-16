# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**ReMarkets Customer Portal** is Phase 2 of the ReMarkets program: a customer-facing web application where ReMarkets customers sign in to see the offers curated for their account and **place bids directly on their own behalf**, instead of relaying everything through their assigned sales representative.

Phase 1 (the internal system of record — inventory, offers, bids, allocations, exports) lives in the sibling repo **`remarkets-bid`**. That repo's `CLAUDE.md` is the source of truth for the full ubiquitous language and internal invariants; this file covers the customer-facing subset and what differs.

**Current state: clickable prototype only.** The repo ships a React SPA under `src/ReMarkets.CustomerPortal.Client` with every screen running on typed mock data (`src/prototype/`). No backend exists here yet — when real development starts, the portal is expected to either consume the Phase 1 API or add a Clean Architecture .NET solution mirroring `remarkets-bid` (`Domain`/`Application`/`Infrastructure`/`Api`). Do not scaffold backend projects without an explicit request.

## Ubiquitous language (customer-facing subset)

Terms mean exactly what they mean in Phase 1. The portal renames nothing — it *filters* what the customer sees.

- **Offer** — a curated grouping of inventory offered to assigned customers. Customers only ever see offers curated for their account, and only in customer-safe terms. Internal statuses map to a customer vocabulary: `Open for Bids`, `Closing Soon`, `Bid Window Ended` (Bid End is advisory — bids may still be accepted until ReMarkets closes the offer), `Pending Results` (offer Closed, allocation not finalized), `Results Posted` (allocation Completed). Customers never see `Potential` vs `Active`, allocation phases, or reservation mechanics.
- **Offer line (customer view)** — exactly the bid-sheet columns from Phase 1: Line #, Part/Product, Manufacturer, Condition, Available Qty, **Offer Price** — plus the customer's own bid. A populated Offer Price means *Priced Offer* mode; an empty one means *Soliciting Bids* ("name your price"). Mixed-mode offers are normal.
- **Bid** — a per-unit price commitment on one offer line. **One active bid per (customer, offer line, offer)**; every change creates a new revision (`Active | Superseded | Withdrawn | Cancelled`) with full history retained. Validated at entry: `qty ≤ available line quantity` and `price > 0`. `Withdrawn` is **customer-initiated**; `Cancelled` is **company-initiated** (a cascade from Edit Offer / inventory adjustment — the customer is told to re-bid). An Active revision flagged **`SystemCapped`** was re-issued by ReMarkets at the original price and a reduced quantity; the portal surfaces it as a "quantity adjusted" notice.
- **Allocation outcome** — once results are posted, each live bid resolves to `Awarded | Partially Allocated | Not Awarded`. Customers see their own outcomes only. Award is always at the customer's bid price.
- **Sales Rep Assignment** — every customer has ≥ 1 assigned rep. Reps can still enter bids on the customer's behalf (Phase 1 masquerade); the portal shows those bids with explicit rep attribution ("Placed by Jerry Lee") alongside self-service bids ("Placed by You").

### Customer data-visibility rules (hard rules, not styling)

1. **Never expose internal pricing** — Spot, Cost, Floor, Target. The only price a customer sees is Offer Price and their own bids.
2. **Never expose sourcing** — supplier names, SourceIds, lot identity, upload batches, deal types (Consignment/Fixed Price).
3. **Never expose other customers** — no competing bids, no bid counts by others, no customer lists. A customer sees their own account only.
4. **Never expose internal actors' workflows** — allocation queues, approval reasons, audit internals. Outcomes only.

Anything that violates these is a blocker finding in review, prototype or production alike.

## Identity

Customers authenticate with **Microsoft Entra External ID** (external identities), not the five internal Entra groups from Phase 1. Internal-role policies (`CanManageOffers`, `CanApproveAllocation`, …) have no meaning in the portal; the portal's authorization question is always "which customer account does this principal belong to, and is this resource scoped to it?" — enforced server-side when the API lands.

## Common Commands

### Frontend (React)

```bash
cd src/ReMarkets.CustomerPortal.Client
npm install
npm run dev          # Vite dev server
npm run build        # Type-check + production build
npm run lint         # ESLint
npx prettier --write src
```

## Architecture

### Frontend pattern (same discipline as Phase 1)

- **React + TypeScript SPA** built with Vite, Material-UI, and (when real features land) Zustand.
- **Config-driven wiring**: route paths live in the `ROUTES` enum (`src/router/ROUTES.ts`) + typed `getRoutePath()` — never hardcode paths.
- **Theme**: light/dark pair via `buildTheme(mode)` in `src/themes/theme.ts` — the same ReMarkets palette as the internal app. Style from semantic tokens (`text.primary`, `background.paper`, `divider`); no raw hex in feature/page `sx`. The portal chrome is a customer-facing **top-nav storefront layout** (`src/prototype/layout/PortalLayout.tsx`), deliberately distinct from the internal app's dark admin sidebar.
- **Prototype**: pages under `src/prototype/pages/` import typed mock modules from `src/prototype/mocks/` directly — no `fetch`, no stores. See `src/prototype/README.md`.
- **When real features land**: generated API types via `openapi-typescript`/`openapi-fetch`, Zustand stores per feature, components never call `fetch` directly.

### Mock-data continuity

The prototype's data universe is shared with `remarkets-bid`'s prototype: same offer IDs (OFF-2026-0147, -0148, -0146, -0144…), same fixed "today" (`2026-05-17`), and the logged-in customer is **Pinnacle IT Solutions** — the same customer the internal demo bids on behalf of. The two prototypes tell one story from both sides; keep them consistent when editing mock data.

## Conventions — what NOT to do

- Don't hardcode route strings — use the `ROUTES` enum.
- Don't put raw hex in pages/components — theme tokens only (the Login brand panel and status-chip tone map follow the same fixed-surface exception as the internal app's sidebar).
- Don't call `fetch` from components — mocks now, typed client + store later.
- Don't add internal-only fields (Spot/Cost/Floor/Target, supplier, SourceId, deal type, other customers' bids) to any customer-facing type, mock, or screen — see the data-visibility rules above.
- Don't rename ubiquitous-language terms; the customer vocabulary above is a *projection* of Phase 1 terms, not new ones.
- Don't scaffold .NET projects, MSAL wiring, or real API calls in the prototype without an explicit scope change.
- Don't commit Entra IDs, client secrets, or connection strings.

## AI tooling

See `AGENTS.md` for the index of project-specific agents and skills (copied from `remarkets-bid` and path-adapted). Subagents and skills live under `.claude/`; hooks are in `.claude/settings.json`. Backend-oriented agents (`remarkets-dotnet-engineer`, `remarkets-entra-auth`, …) become relevant only once a backend exists here.
