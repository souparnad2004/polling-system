# Frontend Architecture

This frontend uses Next.js App Router routes with feature-based application code.
The important rule is: **routes decide where a page is available; features decide how the page works.**

## Where To Start

| I need to... | Start here |
| --- | --- |
| Add or change a URL | `src/app/**/page.tsx` |
| Change a complete screen | `src/features/<feature>/pages/` |
| Change domain-specific UI | `src/features/<feature>/components/` |
| Fetch or mutate server data | `src/features/<feature>/api/` and `hooks/` |
| Change shared UI | `components/` or `components/ui/` |
| Change shared request behavior | `lib/api/client.ts` |
| Change shared styling helpers | `lib/utils.ts` and `src/app/globals.css` |
| Change a domain data shape | `src/features/<feature>/types/` |
| Change form validation | `src/features/<feature>/schemas/` |

## Folder Responsibilities

```text
frontend/
  components/                 Shared application UI and reusable UI primitives
    ui/                       Base UI components (Button, Card, Select, etc.)
  lib/                        Shared non-domain utilities and API client
  public/                     Static assets
  src/
    app/                      Next.js routing, layouts, providers, and route entrypoints
    features/
      auth/                   Login, registration, session, protected-route behavior
      dashboard/              Dashboard screen and dashboard-specific UI
      polls/                  Poll discovery, creation, voting, management, analytics
      user/                   Profile and account screens
```

## Route To Feature Map

Route files in `src/app` should stay small. They normally read route parameters and
render the matching feature page.

| URL | Route entrypoint | Feature page |
| --- | --- | --- |
| `/` | `src/app/page.tsx` | Home screen in the route file |
| `/login` | `src/app/(auth)/login/page.tsx` | `features/auth/pages/login-page.tsx` |
| `/register` | `src/app/(auth)/register/page.tsx` | `features/auth/pages/register-page.tsx` |
| `/dashboard` | `src/app/(protected)/dashboard/page.tsx` | `features/dashboard/pages/dashboard-page.tsx` |
| `/polls` | `src/app/(protected)/polls/page.tsx` | `features/polls/pages/polls-page.tsx` |
| `/polls/mine` | `src/app/(protected)/polls/mine/page.tsx` | `features/polls/pages/my-polls-page.tsx` |
| `/polls/create` | `src/app/(protected)/polls/create/page.tsx` | `features/polls/pages/create-poll-page.tsx` |
| `/polls/[pollId]` | `src/app/(protected)/polls/[pollId]/page.tsx` | `features/polls/pages/protected-poll-page.tsx` |
| `/poll/[pollId]` | `src/app/poll/[pollId]/page.tsx` | `features/polls/pages/public-poll-page.tsx` |
| `/polls/[pollId]/analytics` | `src/app/(protected)/polls/[pollId]/analytics/page.tsx` | `features/polls/pages/poll-analytics-page.tsx` |
| `/profile` | `src/app/(protected)/profile/page.tsx` | `features/user/pages/profile-page.tsx` |

The parentheses in `(auth)` and `(protected)` are Next.js route groups. They do
not appear in the URL. The protected group applies the authenticated layout to
its routes.

## Poll Feature Flow

```text
Route entrypoint
  -> feature page
    -> feature hooks (React Query server state)
      -> feature API functions
        -> lib/api/client.ts
          -> backend API

Feature page
  -> feature components
    -> shared components/ui primitives
```

Examples:

- `polls-page.tsx` loads polls with `use-polls.ts` and renders the explore view.
- `my-polls-page.tsx` filters and sorts the creator's polls and renders `my-poll-row.tsx`.
- `protected-poll-page.tsx` loads a poll and results, shows creator management actions,
  and passes voting behavior into `poll-detail.tsx`.
- `poll-detail.tsx` owns voting presentation and local selection state.
- `poll-management-actions.tsx` owns the publish, close, and delete controls while
  `use-poll-management.ts` owns their server mutations.

## Naming Pattern

Use names that describe the role of the file:

- `*-page.tsx`: a complete feature screen composed by a route entrypoint.
- `*-form.tsx`: a form and its field-level interaction.
- `*-card.tsx`, `*-row.tsx`, `*-header.tsx`: focused visual components.
- `use-*.ts`: a React hook, usually for server state or reusable feature behavior.
- `*.api.ts`: request functions and API response handling.
- `*.types.ts`: shared TypeScript types for that feature.
- `*.schema.ts`: validation schemas.

Prefer a feature-local component when it only makes sense for one domain. Put a
component in root `components/` only when multiple features can use it without
poll-specific or feature-specific assumptions.

## Adding A New Feature

Follow these steps in order. The feature name should be short, lowercase, and
domain-oriented, such as `notifications`, `comments`, or `billing`.

### 1. Define The Feature Before Creating Files

Write down these answers first:

- What user problem does the feature solve?
- Which URL or URLs will expose it?
- Is the feature public, authenticated, or creator/admin-only?
- What data does it read from the backend?
- What data can the user create, update, or delete?
- Which existing feature or shared component can be reused?

Use an existing feature as a reference before inventing a new pattern. For
example, use `features/polls` for a server-backed feature and `features/auth`
for form-heavy screens.

### 2. Create The Feature Folders In This Order

Start with the feature root and create folders only when they are needed:

```text
src/features/<feature>/
  types/          Data contracts used by the feature
  api/            HTTP request functions
  schemas/        Form and input validation rules
  hooks/          React Query hooks and reusable feature behavior
  components/     Domain-specific UI pieces
  pages/          Complete screens rendered by routes
  utils/          Feature-only pure helper functions
```

The practical creation order is:

1. `types/` - define the entities and API response shapes.
2. `api/` - add typed functions that call `lib/api/client.ts`.
3. `schemas/` - add Zod schemas when the feature accepts user input.
4. `hooks/` - wrap reads and mutations with the project's React Query pattern.
5. `components/` - build reusable feature UI from props and callbacks.
6. `pages/` - compose the complete feature screens.
7. `src/app/` - add the thin route entrypoint last, after the page exists.

Do not create every folder automatically. A read-only feature may need only
`types`, `api`, `hooks`, `components`, and `pages`. A small static feature may
need only `components` and `pages`.

### 3. Add Types First

Create types for data crossing a module boundary. Keep them in the feature,
not in a component file.

```text
src/features/<feature>/types/<feature>.types.ts
```

Include the fields used by the UI and the allowed status values as literal
unions. Reuse an existing type instead of creating a second shape for the same
backend entity.

### 4. Add API Functions Second

Put request functions in:

```text
src/features/<feature>/api/<feature>.api.ts
```

API functions should:

- Call `apiClient` from `lib/api/client.ts`.
- Accept explicit arguments such as an ID or request body.
- Return typed data from the feature's `types/` files.
- Know HTTP paths and request details, but not React state or JSX.
- Throw or propagate errors so hooks and pages can display the correct state.

Keep authentication, caching, loading, and invalidation out of API functions.

### 5. Add Validation Schemas When Needed

For create or edit forms, add:

```text
src/features/<feature>/schemas/<feature>.schema.ts
```

Keep validation rules in Zod schemas and use them through the existing
React Hook Form resolver pattern. The schema validates user input; the API
module sends the resulting data.

### 6. Add Hooks For Server State

Put React Query hooks in:

```text
src/features/<feature>/hooks/use-<feature>.ts
src/features/<feature>/hooks/use-<feature>-<action>.ts
```

Use hooks for:

- Queries that load server data.
- Mutations that create, update, or delete server data.
- Query keys and cache invalidation.
- Loading, error, and success state needed by the screen.

A hook may call the feature API, but an API function should never call a hook.
After a mutation, invalidate the smallest relevant query key so related screens
receive fresh data.

### 7. Build Components From The Outside In

Create domain-specific components in:

```text
src/features/<feature>/components/
```

Recommended order:

1. Small display components such as `item-card.tsx` or `status-badge.tsx`.
2. Interactive components such as `item-form.tsx` or `item-actions.tsx`.
3. Feature layout components such as `feature-header.tsx` or `feature-layout.tsx`.
4. The page component that composes them all.

Components should receive data and callbacks through props. They should not
duplicate API request logic. Use `components/ui` for buttons, cards, inputs,
dialogs, menus, and other shared primitives. Use a root `components/` file only
when the component is genuinely reusable by multiple features.

### 8. Create The Feature Page

Create one page component per complete screen:

```text
src/features/<feature>/pages/<feature>-page.tsx
```

The page is responsible for composing the screen and handling screen-level
states:

- Loading or skeleton state.
- Request error and retry state.
- Empty state.
- Loaded content.
- Page-level navigation or query parameters.

Keep detailed visual sections in components once the page becomes difficult to
scan. A page can call hooks, but a presentational child should receive data and
callbacks rather than fetch the same data independently.

### 9. Add The Next.js Route Entrypoint

Add a thin file under `src/app` that imports the feature page:

```text
src/app/<route>/page.tsx
```

For authenticated routes, place it under `src/app/(protected)/`. For login or
registration routes, use `src/app/(auth)/`. Route groups in parentheses do not
appear in the browser URL.

Typical route entrypoint:

```tsx
import { FeaturePage } from "@/src/features/<feature>/pages/feature-page";

export default function Page() {
  return <FeaturePage />;
}
```

For a dynamic route, read the route parameter here and pass it to the feature
page. Keep business logic in the feature page and hooks, not in the route file.

### 10. Wire Shared Navigation Only If Required

If users need to reach the feature, add one navigation item in the existing
sidebar or navigation component. Reuse the existing icon and item shape. Do not
create a second navigation system inside the feature.

### 11. Verify The Feature Before Calling It Complete

From `frontend/`, run the focused checks first:

```bash
pnpm exec eslint src/features/<feature> src/app/<route>
```

Then run the full checks used by the project:

```bash
pnpm lint
pnpm exec tsc --noEmit
pnpm build
```

Manually verify the feature at its route in these states:

- Narrow mobile viewport and desktop viewport.
- Loading.
- Empty result.
- Request failure and retry.
- Successful result.
- Invalid form input.
- Disabled or pending mutation.
- Permission or unauthenticated access when applicable.

Finally, update the route map in this file and add or update the relevant
documentation in `docs/` if the feature changes a user workflow or API contract.

### Feature Creation Checklist

```text
[ ] Feature purpose and access rules are clear
[ ] types/ defines the feature data contract
[ ] api/ contains typed request functions
[ ] schemas/ validates user input, when needed
[ ] hooks/ owns React Query server state and invalidation
[ ] components/ contains focused domain UI
[ ] pages/ composes complete screens and UI states
[ ] src/app/ contains a thin route entrypoint
[ ] Navigation is updated, when the feature needs a link
[ ] Loading, error, empty, success, and pending states are handled
[ ] Mobile and desktop layouts are checked
[ ] ESLint, TypeScript, and build checks pass
[ ] Route map and workflow documentation are updated
```

## Current Notes

- `src/app` is the routing layer, not a second feature layer.
- `frontend/components` contains shared shell and UI code; it is intentionally
  separate from domain components under `src/features`.
- Existing code can remain where it is. This guide documents the current pattern;
  no file moves are required to follow it.
