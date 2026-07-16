---
name: scaffold-feature
description: Use when the user asks to create a new end-to-end vertical feature slice in ReMarkets (e.g., "add a Bids feature", "scaffold an Offers module"). Produces a Domain entity, an Application use case, an Api endpoint, an EF migration, a client API call, a Zustand store, a page, and a route registration.
---

# Scaffold a vertical feature slice

Use this when the user wants a new feature and expects backend-to-frontend wiring in one pass. Ask for these inputs up front if they're not specified:

1. **Feature name** (singular, PascalCase — e.g., `Offer`). The plural is used for routes and controllers.
2. **Initial fields** on the primary entity.
3. **Use case** this slice implements first (usually `Create<Feature>`).
4. **Auth policy** the Api endpoint should require (may be TBD).

## Workflow

Delegate each section to the right subagent — do **not** do the work yourself.

### 1. Domain (invoke `remarkets-domain-expert` then `remarkets-dotnet-engineer`)

- Consult `remarkets-domain-expert` first if the feature is in the bid/offer/reconciliation space.
- Create `src/ReMarkets.Domain/<Feature>/<Feature>.cs` with the entity + constructor invariants.
- Add value objects and domain events under `src/ReMarkets.Domain/<Feature>/`.
- Add a corresponding test file under `tests/ReMarkets.Domain.Tests/<Feature>/`.

### 2. Application (invoke `remarkets-dotnet-engineer`)

- Define the abstraction `I<Feature>Repository` (or whatever is needed) under `src/ReMarkets.Application/<Feature>/Abstractions/`.
- Create the use case folder: `src/ReMarkets.Application/<Feature>/Commands/Create<Feature>/` with:
  - `Create<Feature>Command.cs` (record)
  - `Create<Feature>Handler.cs`
  - `Create<Feature>Validator.cs` (if validation is non-trivial)
- Write handler tests under `tests/ReMarkets.Application.Tests/<Feature>/Commands/Create<Feature>/` using hand-rolled fakes.

### 3. Infrastructure (invoke `remarkets-dotnet-engineer`)

- Add `src/ReMarkets.Infrastructure/Persistence/Configurations/<Feature>Configuration.cs`.
- Add `DbSet<<Feature>>` to the `DbContext`.
- Implement `I<Feature>Repository` under `src/ReMarkets.Infrastructure/<Feature>/`.
- Register in `DependencyInjection` extension.
- Create the EF migration:
  `dotnet ef migrations add Add<Feature> -p src/ReMarkets.Infrastructure -s src/ReMarkets.Api`

### 4. Api (invoke `remarkets-dotnet-engineer` and, for the policy, `remarkets-entra-auth`)

- Create `src/ReMarkets.Api/Controllers/<Feature>sController.cs` with the `Create` action.
- Attribute it with `[Authorize(Policy = "...")]` — coordinate the policy name with `remarkets-entra-auth`.
- Write an integration test under `tests/ReMarkets.Api.IntegrationTests/<Feature>s/` that posts to the endpoint and asserts on the response.

### 5. Regenerate client types

- Start the API (`dotnet run --project src/ReMarkets.Api`) or use an already-exported `swagger.json`.
- From `src/ReMarkets.CustomerPortal.Client/`, run `npx openapi-typescript <swagger url> -o src/api/schema.d.ts`.
- Commit the regenerated file.

### 6. Client (invoke `remarkets-react-engineer`)

- Create `src/ReMarkets.CustomerPortal.Client/src/features/<feature>/` with `stores/`, `hooks/`, `pages/`, `components/`, and `index.ts`.
- Add a Zustand store (`use<Feature>Store`) accessed via the `AppConfig` context.
- Add a hook (`use<Feature>s`) that calls the typed client and populates the store.
- Add the page (`<Feature>sPage.tsx`) and a route entry:
  - Append to `src/ReMarkets.CustomerPortal.Client/src/router/ROUTES.ts`.
  - Wire into `src/ReMarkets.CustomerPortal.Client/src/config/App.Config.tsx`.

## Done when

- `dotnet build` succeeds.
- `dotnet test` passes all three test projects.
- `npm run build` succeeds.
- The new route renders without console errors when `npm run dev` is running against a locally-running API.
- `AGENTS.md` does not need changes (this skill only adds features, not new agents).
