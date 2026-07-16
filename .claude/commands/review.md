---
description: Run the ReMarkets code reviewer against the current working tree.
argument-hint: "[optional scope — feature name or paths]"
---

Invoke the `remarkets-code-reviewer` subagent via the `Agent` tool.

Brief it as follows:

> Review the current working tree against ReMarkets conventions: Clean Architecture dependency rule, CQRS handler shape, thin controllers with `[Authorize(Policy = …)]`, EF Core confined to `Infrastructure`, MUI/Zustand/`ROUTES` patterns in `src/ReMarkets.CustomerPortal.Client`, no committed secrets, and test coverage at the right tier.
>
> Run `dotnet build`, `dotnet test`, `npm run lint`, and `npm run build` as blocker gates — report any failure verbatim.
>
> Return a severity-ranked report (`blocker` / `major` / `minor` / `nit`) with `file:line` citations, and a go/no-go verdict at the top. Do not edit any files.

Scope for this run: $ARGUMENTS

When the subagent returns, relay the verdict and any blockers to the user. If there are no blockers, summarize majors and suggest what to address before merging.
