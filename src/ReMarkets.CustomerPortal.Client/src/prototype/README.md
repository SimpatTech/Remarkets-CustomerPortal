# ReMarkets — Customer Portal Prototype

A **clickable prototype** of the ReMarkets Customer Portal, built with React + Material-UI. It lives inside the real client app so the design stays in sync with the production stack, but it runs end-to-end with **no backend required** — every screen uses mock data.

This folder exists so the Product Owner (and anyone else on the business side) can:

1. Walk stakeholders through the customer bidding flow without a dev environment.
2. Iterate on screens by asking Claude to edit specific pages — no API involved.
3. Share a git branch with engineering that reflects the latest UX direction.

---

## 1. Run it locally

```bash
cd src/ReMarkets.CustomerPortal.Client
npm install          # first time only
npm run dev
```

Then open the URL the terminal prints (usually `http://localhost:5173`). The Login page is the entry point — both sign-in buttons click straight through.

> **No API required.** Everything is mocked. If you see errors about ports or SSL, ask a developer — those are environment issues, not prototype problems.

---

## 2. What's on each screen

| Route | What it shows | Source file |
|---|---|---|
| `/` | Customer sign-in with Microsoft button (clicks straight to Home) | `pages/LoginPage.tsx` |
| `/home` | Greeting, 4 KPI cards, attention alerts (cancelled / quantity-adjusted bids), open offers, activity feed | `pages/HomePage.tsx` |
| `/offers` | Marketplace cards with tabs: Open for bidding / Closed & results | `pages/BrowseOffersPage.tsx` |
| `/offers/OFF-2026-0147` | Offer detail — line table with **interactive bid entry** (place, revise, withdraw; validation included) | `pages/OfferDetailPage.tsx` |
| `/bids` | Every bid with expandable revision history, status chips, and award outcomes | `pages/MyBidsPage.tsx` |
| `/account` | Company profile, contacts, assigned rep card, notification switches | `pages/AccountPage.tsx` |

All navigation links work — no dead `#` links. The top nav highlights the active section.

**The story the demo tells:** the signed-in user is **Dana Whitfield**, purchasing manager at **Pinnacle IT Solutions** — the same customer the internal (Phase 1) demo bids on behalf of. Some of her bids were placed by her rep Jerry Lee (shown with rep attribution), some by her through the portal. One bid was cancelled by an offer change (she's prompted to re-bid) and one was quantity-capped — both surface as attention items on Home.

---

## 3. Where the content lives

All realistic placeholder data is in **typed mock files** under `mocks/`:

```
mocks/
  portalUser.ts    # the signed-in user, company profile, assigned rep
  portalOffers.ts  # customer-facing offers + lines (NO internal pricing)
  myBids.ts        # the customer's bids with revision history + outcomes
  activity.ts      # the Home page activity feed
```

Change a mock, save, and the browser hot-reloads. No build step needed.

The mock universe is shared with the `remarkets-bid` prototype (same offer IDs, same fixed "today" of **May 17, 2026**) so the two demos tell one story from both sides. If you change offer data here, consider whether the internal prototype should match.

**Hard rule baked into the types:** customer-facing mocks never carry Spot / Cost / Floor / Target prices, supplier names, SourceIds, deal types, or other customers' bids. If a request would add one of those to a customer screen, the answer is no (see `CLAUDE.md`).

---

## 4. How to ask Claude to modify the prototype

- **Add or change data**: edit the relevant file under `mocks/`.
- **Add a new screen**: create a file under `pages/`, register it in `src/router/ROUTES.ts` and `src/router/Router.tsx`, and add a nav link in `src/prototype/layout/TopNav.tsx`.
- **Tweak the look**: colors, spacing, and typography are centralized in `src/themes/theme.ts`. Individual pages should not contain hex codes.

### Example prompts you can paste into Claude

- *"On the Home page, add a KPI for 'Total committed $' summing my active bids."*
- *"Add a new open offer 'June Networking Refresh' shipping from Dallas with 5 lines of NICs and switches, closing May 28."*
- *"On Offer Detail, show a countdown chip ('2 days left') next to the status chip when an offer is closing soon."*
- *"On My Bids, add a CSV download button that exports the visible rows."*
- *"Add a Watchlist: a star icon on each Browse card and a new tab on My Bids listing starred offers."*

### What to avoid editing without a developer

- `src/themes/theme.ts` — touches every screen at once.
- `src/router/ROUTES.ts` — changing the enum renames every URL and may break shared links.
- The `@mui/material` imports — production-grade components; changing them is a design-system decision.

---

## 5. Sharing the prototype

```bash
git checkout -b prototype/<your-topic>
# make changes with Claude
git commit -am "prototype: <what changed>"
git push -u origin prototype/<your-topic>
```

Send the branch name to engineering. The prototype does not require CI, production config, or secrets — it's just the mocked client.

---

## 6. Promoting prototype patterns to production

When a screen stabilizes and becomes real, engineering will:

1. Extract reusable pieces into `BID*` common components (see the `add-common-component` skill).
2. Replace the mock imports with real API calls generated from OpenAPI, scoped server-side to the signed-in customer.
3. Move the page out of `src/prototype/pages/` into `src/features/<feature>/pages/` and wire it to a real Zustand store.
4. Swap the Login placeholder for Microsoft Entra External ID via MSAL.

The routes, the theme, and the visual design stay — only the data source changes.
