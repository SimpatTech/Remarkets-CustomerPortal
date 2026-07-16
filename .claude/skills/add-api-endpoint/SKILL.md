---
name: add-api-endpoint
description: Use when the user wants a new API endpoint backed by an Application CQRS handler, plus an integration test. Assumes the Domain entity already exists — use add-domain-entity or scaffold-feature first if it doesn't.
---

# Add an API endpoint (CQRS + controller + integration test)

## Inputs

1. **Feature** it belongs to (e.g., `Offers`, `Bids`).
2. **Operation** — command or query, and the verb (`Create`, `Get`, `List`, `Award`, …).
3. **Authorization policy** to require. If unclear, consult `remarkets-entra-auth`.

## Workflow

Delegate to `remarkets-dotnet-engineer`; consult `remarkets-entra-auth` for the policy name and `remarkets-domain-expert` if the operation maps to a lifecycle transition you want to verify.

1. Under `src/ReMarkets.Application/<Feature>/<Commands|Queries>/<UseCase>/` create:
   - `<UseCase>Command.cs` or `<UseCase>Query.cs` (record)
   - `<UseCase>Handler.cs`
   - `<UseCase>Validator.cs` (if non-trivial)
2. Add handler tests under `tests/ReMarkets.Application.Tests/<Feature>/<Commands|Queries>/<UseCase>/` using hand-rolled fakes of the `Application` abstractions.
3. Add the action to `src/ReMarkets.Api/Controllers/<Feature>Controller.cs` (create the controller if it doesn't exist yet). Controller action:
   - Accepts the request, dispatches to the handler, maps result to HTTP.
   - Carries `[Authorize(Policy = "...")]`.
   - Documents the response with `[ProducesResponseType(...)]`.
4. Add an integration test under `tests/ReMarkets.Api.IntegrationTests/<Feature>/<UseCase>Tests.cs` using `WebApplicationFactory<Program>`.
5. If this is a new public contract, note that `schema.d.ts` on the client is now stale — regenerate it with `openapi-typescript`.

## Guardrails

- No business logic in the controller — all of it lives in the handler.
- No `DbContext` in the handler — depend on an abstraction in `Application`.
- No inline role checks — use a policy.

## Done when

- `dotnet build` succeeds.
- `dotnet test --filter "FullyQualifiedName~<UseCase>"` passes.
- The integration test exercises the endpoint end-to-end and asserts the expected HTTP status + body shape.
