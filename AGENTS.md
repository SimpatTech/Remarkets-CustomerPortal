# AGENTS.md

Index of ReMarkets Customer Portal AI tooling. The agent and skill set is inherited from the Phase 1 repo (`remarkets-bid`) with client paths adapted to `src/ReMarkets.CustomerPortal.Client`. Use this to decide which subagent, skill, or slash command to invoke for a given task.

Definitions live under:

- `.claude/agents/backend/` — server-side concerns (.NET, domain, auth). **Dormant until this repo gains a backend** — invoke them for API design questions, not for scaffolding.
- `.claude/agents/frontend/` — client-side concerns (React, UX).
- `.claude/agents/quality-assurance/` — test strategy and code review.
- `.claude/skills/` — scaffolding skills that the agents delegate to.
- `.claude/commands/` — slash-command entry points.

Subagent discovery is by frontmatter `name`, not file path, so invoking an agent uses the same name regardless of which folder it lives in.

## Portal-specific review rule

Every UI/UX or code review in this repo must additionally check the **customer data-visibility rules** in `CLAUDE.md`: no internal pricing (Spot/Cost/Floor/Target), no sourcing (supplier, SourceId, deal type), no other customers' data, no internal workflow surfaces. A violation is a blocker regardless of severity elsewhere.

## Subagents

### Backend (`.claude/agents/backend/`)

| Agent | Use when… |
|-------|-----------|
| `remarkets-dotnet-engineer` | (Later phase) Writing or modifying C# once the portal API exists. Enforces the Clean Architecture dependency rule, CQRS handler shape, and EF Core patterns. |
| `remarkets-domain-expert` | Before non-trivial modeling of Offers, Bids, or outcomes as customers see them — to pin down terminology, invariants, and lifecycle rules. Read-only. |
| `remarkets-entra-auth` | Anything touching authentication or authorization. For the portal this means **Microsoft Entra External ID** (customer identities) rather than the internal five-group model. |

### Frontend (`.claude/agents/frontend/`)

| Agent | Use when… |
|-------|-----------|
| `remarkets-react-engineer` | Building or modifying React code under `src/ReMarkets.CustomerPortal.Client`. Enforces Vite/MUI patterns, theme tokens, and the `ROUTES` enum. |
| `remarkets-ux-reviewer` | Read-only check of a UI change against the portal prototype and UX principles — customer-safe field set, state-chip vocabulary, bid revision/withdraw affordances, attention items for cancelled/capped bids. Returns a severity-ranked report; never edits files. |

### Quality assurance (`.claude/agents/quality-assurance/`)

| Agent | Use when… |
|-------|-----------|
| `remarkets-qa-expert` | Designing a test plan or backfilling missing tests (client tests now; API tiers when a backend lands). |
| `remarkets-code-reviewer` | After a change is complete and before merging — produces a severity-ranked report. Read-only. Apply the portal-specific review rule above. |

## Skills

| Skill | Use when… |
|-------|-----------|
| `build-prototype` | Adding or reworking prototype screens (Variant B — React + MUI, mandatory for this repo). |
| `add-common-component` | Adding a reusable MUI-wrapped component (BID-prefixed) once real features start landing. |
| `scaffold-feature` | (Later phase) Creating an end-to-end vertical slice once the backend exists. |
| `add-domain-entity` | (Later phase) Adding a Domain entity + EF configuration + migration. |
| `add-api-endpoint` | (Later phase) Adding a CQRS handler + controller + integration test. |

## Slash commands

| Command | What it does |
|---------|--------------|
| `/review [scope]` | Delegates to `remarkets-code-reviewer` against the current working tree, optionally scoped. Returns a severity-ranked report with a go/no-go verdict. |

## Hooks

Configured in `.claude/settings.json`:

- **Format on edit** — `*.cs` files run `dotnet format`; `src/ReMarkets.CustomerPortal.Client/**/*.{ts,tsx,js,jsx}` run Prettier.
- **Production config guard** — edits or Bash commands touching `appsettings.PRD.json` / `appsettings.Production.json` or running `dotnet ef database update` against a production connection string require explicit confirmation.

## Decision shortcuts

- "Add or change a portal screen" → `build-prototype` skill (Variant B), then `remarkets-ux-reviewer`.
- "Change what a customer can see on an offer/bid" → `remarkets-domain-expert` first (confirm the customer-safe projection), then `remarkets-react-engineer`.
- "How do customers sign in?" / "Entra External ID setup" → `remarkets-entra-auth`.
- "Review this PR" / "Ready to merge?" → `/review` (or `remarkets-code-reviewer` directly).
- "Does this match the prototype?" → `remarkets-ux-reviewer`.
