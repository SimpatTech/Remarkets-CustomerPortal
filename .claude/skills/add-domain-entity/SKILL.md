---
name: add-domain-entity
description: Use when the user wants a new Domain entity (plus EF configuration and migration) without touching the Api surface or the client. Good for internal model additions or supporting entities referenced by an existing aggregate.
---

# Add a Domain entity (backend-only)

## Inputs

1. **Entity name** (singular, PascalCase).
2. **Aggregate** it belongs to (standalone, or child of an existing entity).
3. **Fields** and invariants.

## Workflow

Delegate to `remarkets-dotnet-engineer`.

1. Create `src/ReMarkets.Domain/<Aggregate>/<Entity>.cs` (or top-level if it is its own aggregate root).
   - Private setters on state-bearing properties.
   - Constructor and methods enforce invariants.
2. Add tests under `tests/ReMarkets.Domain.Tests/<Aggregate>/<Entity>Tests.cs`.
3. Add `src/ReMarkets.Infrastructure/Persistence/Configurations/<Entity>Configuration.cs` implementing `IEntityTypeConfiguration<<Entity>>`.
4. Add `DbSet<<Entity>>` to the `DbContext`.
5. Generate the migration:
   `dotnet ef migrations add Add<Entity> -p src/ReMarkets.Infrastructure -s src/ReMarkets.Api`
6. Run `dotnet build` and `dotnet test` — both must pass.

## Do NOT

- Add a controller or DTO for this entity in this skill. That belongs to `scaffold-feature` or `add-api-endpoint`.
- Reference EF Core from `Domain`.
- Make properties public-settable on invariant-bearing state.

## Done when

- `dotnet build` succeeds.
- `dotnet test` passes.
- The migration file exists under `src/ReMarkets.Infrastructure/Migrations/`.
