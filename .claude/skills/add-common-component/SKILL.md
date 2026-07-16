---
name: add-common-component
description: Use when adding a reusable MUI-based wrapper component to the ReMarkets shared UI library (e.g., BIDCard, BIDGrid, BIDInput, BIDSlider, BIDAlert, BIDButton). Enforces the `BID` naming prefix, the wrap-don't-recreate pattern, theme-token-only styling, a required Storybook story per component, and a consistent prop surface so features stay visually uniform.
---

# Add a reusable common component

The ReMarkets client has a shared UI library under `src/ReMarkets.CustomerPortal.Client/src/common/` that wraps Material-UI primitives. Features **import from `common/` first**; raw MUI imports are only allowed when the wrapper doesn't exist yet (and the next step is to add the wrapper).

Every wrapper is named with a `BID` prefix (`BIDCard`, `BIDAlert`, `BIDSlider`, …) so it never collides with or shadows the raw MUI export it composes. Every wrapper ships with a Storybook story alongside it so design, props, and interactions can be reviewed and tested in isolation.

> The folder may later be promoted to its own `remarkets-common` workspace package. Keep components self-contained (no imports from `features/`, `api/`, `stores/`) so promotion is a path rename, not a rewrite.

## Inputs

1. **Component name** — PascalCase, singular, **always prefixed with `BID`** so the wrapper never shadows the MUI name it composes. Examples: `BIDCard`, `BIDPrimaryButton`, `BIDNumericInput`, `BIDAlert`. Reject any requested name that matches a raw MUI export (e.g., `Card`, `Button`, `TextField`) — rename it to `BID<Name>` before continuing.
2. **MUI base** it wraps (e.g., `@mui/material/Card`, `@mui/material/TextField`). If there is no suitable MUI base, stop and ask the user — the common library composes MUI, it does not invent from scratch.
3. **Variants / props** to expose (subset of the MUI props plus any ReMarkets-specific additions, e.g., `severity` pre-sets for `BIDAlert`).
4. **Ref forwarding** — yes if the MUI base accepts a ref and a consumer might need it (forms, focus management). Default yes.

> **Why the `BID` prefix?** `import { Card } from '@/common'` next to `import { Card } from '@mui/material'` is ambiguous at a glance and hostile to grep. `BIDCard` makes the house wrapper visually distinct, prevents accidental raw-MUI drift, and stays stable if the common library is later promoted to a `remarkets-common` package.

## Target layout

```
src/ReMarkets.CustomerPortal.Client/src/common/
  BID<Name>/
    BID<Name>.tsx            the component
    BID<Name>.types.ts       prop types (only if non-trivial)
    BID<Name>.stories.tsx    Storybook story — required, one per component
    index.ts                 re-export
  index.ts                   barrel re-exporting every component
```

Keep one component per folder. If the folder already exists, **edit the existing file** rather than creating a sibling.

## Wrapper pattern

1. **Extend the MUI props, don't re-declare them.** Type aliases follow the same `BID` prefix as the component (`BIDCardProps`, not `CardProps`) so the exported API is unambiguous.

   ```tsx
   import { Card as MuiCard, CardProps as MuiCardProps } from '@mui/material';
   import { forwardRef } from 'react';

   export type BIDCardProps = Omit<MuiCardProps, 'variant'> & {
     tone?: 'default' | 'muted' | 'accent';
   };

   export const BIDCard = forwardRef<HTMLDivElement, BIDCardProps>(function BIDCard(
     { tone = 'default', children, ...rest },
     ref,
   ) {
     return (
       <MuiCard ref={ref} {...rest} variant={tone === 'muted' ? 'outlined' : 'elevation'}>
         {children}
       </MuiCard>
     );
   });
   ```

2. **Theme tokens only.** No hex colors, no pixel literals except spacing that comes from `theme.spacing`. If a new token is needed, add it to `src/themes/theme.ts` first.
3. **`forwardRef`** when the MUI base forwards a ref. Use `displayName` (the function name in the `forwardRef` callback is sufficient) so React DevTools labels it correctly.
4. **No behavior injection from outside.** Common components don't read stores, call APIs, or reach into `useAppConfig()`. They are presentational. Business behavior goes in feature hooks that consume these components.
5. **Prop discipline.** Prefer overriding with defaults and `Omit`-ing props the wrapper controls (e.g., `Omit<MuiAlertProps, 'variant'>`) so callers can't bypass the house style.
6. **Named export** (no default exports) to keep imports stable across refactors.

## Storybook story (required, one per component)

Every component in `common/` ships with a `BID<Name>.stories.tsx` alongside the component. Stories are how we review design, exercise each prop combination, and test the component in isolation before wiring it into a feature.

Minimum story set:

- **Default** — the component with only required props.
- **One story per prop variant** you introduced on top of the MUI base (e.g., each value of `tone`, `severity`, `size`).
- **Interactive** — at least one story that exercises user interaction (click, focus, input change) via `@storybook/test` `userEvent` + `expect`, when the component accepts user input or callbacks.

Skeleton (Component Story Format 3, TypeScript):

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite';
import { BIDCard } from './BIDCard';

const meta = {
  title: 'Common/BIDCard',
  component: BIDCard,
  tags: ['autodocs'],
  argTypes: {
    tone: { control: 'select', options: ['default', 'muted', 'accent'] },
  },
} satisfies Meta<typeof BIDCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { children: 'Default card' } };
export const Muted: Story = { args: { tone: 'muted', children: 'Muted card' } };
export const Accent: Story = { args: { tone: 'accent', children: 'Accent card' } };
```

Rules for stories:

- Use the component's real types — don't cast to `any`.
- Provide realistic args, not lorem ipsum, when the component renders text.
- Wrap stories in the real `ThemeProvider` via a global `decorator` in `.storybook/preview.ts` — do not re-wrap per story.
- Never reach into a Zustand store or the API client from a story. If a story needs data, accept it as args.
- Interaction tests use `play()` with `@storybook/test`; keep them focused (one behavior per story).

## One-time Storybook bootstrap (if not yet installed)

If `src/ReMarkets.CustomerPortal.Client/.storybook/` does not exist, set it up **before** adding the first component's story. Run from `src/ReMarkets.CustomerPortal.Client/`:

```bash
npx storybook@latest init --builder vite --type react --package-manager npm --yes
```

Then tighten the generated config so it matches the rest of the project:

1. Edit `.storybook/main.ts`:
   - `stories: ['../src/common/**/*.stories.@(ts|tsx)']` — only the common library, not `src/stories/` demos.
   - Keep `@storybook/addon-essentials` and `@storybook/addon-interactions`; drop `@storybook/addon-onboarding`.
2. Replace `.storybook/preview.ts` with one that imports `ThemeProvider` from `@mui/material` and the app theme from `src/themes/theme.ts`, and registers it as a global decorator.
3. Delete the generated `src/stories/` demo folder — we only ship stories next to their components.
4. Add scripts to `package.json`:
   ```json
   "storybook": "storybook dev -p 6006",
   "build-storybook": "storybook build"
   ```
5. Add `storybook-static/` to `.gitignore`.
6. Confirm `npm run storybook` boots and `npm run build-storybook` succeeds before moving on to the component itself.

Once bootstrapped, subsequent runs of this skill only add the component + its `.stories.tsx` — the infra is already there.

## Files to create / edit

1. `src/ReMarkets.CustomerPortal.Client/src/common/BID<Name>/BID<Name>.tsx` — the component, following the pattern above.
2. `src/ReMarkets.CustomerPortal.Client/src/common/BID<Name>/BID<Name>.stories.tsx` — the Storybook story set (see above).
3. `src/ReMarkets.CustomerPortal.Client/src/common/BID<Name>/index.ts`:

   ```ts
   export * from './BID<Name>';
   ```

4. `src/ReMarkets.CustomerPortal.Client/src/common/index.ts` — append:

   ```ts
   export * from './BID<Name>';
   ```

   If the barrel file does not exist yet, create it and include every component under `common/`.
5. If you added a theme token, update `src/ReMarkets.CustomerPortal.Client/src/themes/theme.ts` — keep the change minimal and local to your component's need.

## Guardrails — reject the request if…

- The proposed name is a raw MUI export (`Card`, `Button`, `Alert`, …). Require the `BID` prefix before proceeding.
- The proposed component has no MUI base and is genuinely novel UI. Common is a wrapper layer, not a design system from scratch — escalate to the user.
- The component needs to fetch data or read from a Zustand store. That belongs in a feature, not common. Compose a common presentational component inside the feature instead.
- Theming would require a raw color or pixel value not expressible in `theme.*`. Add the token first, then the component.
- A wrapper with that name already exists and the user's request is "a different one" — encourage variants via props (`tone`, `size`, `density`) rather than forks.
- The requester wants to skip the Storybook story. Every common component must ship with one — if Storybook is not bootstrapped yet, run the bootstrap step first.

## Before you finish

1. `cd src/ReMarkets.CustomerPortal.Client && npm run build` — TypeScript must compile without warnings.
2. `cd src/ReMarkets.CustomerPortal.Client && npm run lint` — no new ESLint errors.
3. `cd src/ReMarkets.CustomerPortal.Client && npm run build-storybook` — the story must build cleanly alongside the rest of the library.
4. `cd src/ReMarkets.CustomerPortal.Client && npm run storybook` (manual smoke) — confirm the new component renders in each variant story and any interaction `play()` passes.
5. `npx prettier --write src/common/BID<Name>` on changed files.
6. Skim other components in `common/` and confirm your new one matches their API shape (naming, prop ordering, `Omit` boundaries). Consistency across the library is the whole point.
7. If the component replaces a raw MUI usage already present in a feature, update that call site in the same change so the rule is enforced as new code lands.

## Not yet

- **Vitest / React Testing Library** — client unit-test infra is TBD. Interaction coverage via Storybook `play()` is the current bar; full RTL tests are deferred until the user adds Vitest.
- **`remarkets-common` as a separate package** — remains a folder until the user explicitly promotes it (npm workspaces + `package.json` + build tooling). Keep the barrel and folder shape so promotion is just a move.
