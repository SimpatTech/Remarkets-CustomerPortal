# ReMarkets Customer Portal

Phase 2 of the ReMarkets program: a customer-facing web application where ReMarkets customers sign in to see the offers curated for their account and **bid directly on their own behalf**, instead of working exclusively through their assigned sales representative.

Phase 1 — the internal system of record (inventory, offers, bids, allocations, exports) — lives in the sibling repo [`remarkets-bid`](../../remarkets-bid).

## Current state: clickable prototype

This repo currently contains a **clickable prototype** — a React + Material-UI SPA that runs entirely on mock data, no backend required. It exists to align stakeholders on the customer experience before functional development starts.

```bash
cd src/ReMarkets.CustomerPortal.Client
npm install
npm run dev
```

Open the printed URL (usually `http://localhost:5173`). The Login page is the entry point — the "Sign in" buttons click straight through to the portal.

### Screens

| Route | What it shows |
|---|---|
| `/` | Customer sign-in (Microsoft Entra External ID placeholder) |
| `/home` | KPIs, attention items (cancelled / quantity-adjusted bids), open offers, activity feed |
| `/offers` | Marketplace-style browse: open offers vs closed & results |
| `/offers/:offerId` | Offer detail with line table and interactive bid entry (place / revise / withdraw) |
| `/bids` | Every bid on the account with revision history, statuses, and award outcomes |
| `/account` | Company profile, authorized contacts, assigned rep, notification preferences |

See [`src/ReMarkets.CustomerPortal.Client/src/prototype/README.md`](src/ReMarkets.CustomerPortal.Client/src/prototype/README.md) for the product-owner guide to running and modifying the prototype.

## Repository layout

```
CLAUDE.md          # AI guidance — domain language + customer data-visibility rules
AGENTS.md          # Index of project agents / skills / commands
.claude/           # Agents, skills, hooks, launch config
src/
  ReMarkets.CustomerPortal.Client/   # React + TypeScript SPA (Vite / MUI)
    src/prototype/                   # Prototype pages, layout, typed mocks
```

A .NET backend (or integration with the Phase 1 API) is planned for the functional build-out and intentionally does not exist yet.
