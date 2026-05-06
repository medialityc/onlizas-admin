# Tasks: Category Suggestions

## Phase 1: Foundation

- [ ] 1.1 Create `src/types/category-suggestions.ts` — interfaces, enums, query params
- [ ] 1.2 Create `src/sections/category-suggestions/constants/suggestion-state.ts` — `PENDING`, `APPROVED`, `REJECTED`
- [ ] 1.3 Create `src/sections/category-suggestions/schemas/suggestion-schema.ts` — Zod schema for name (min 1) and description

## Phase 2: API & Config

- [ ] 2.1 Add `categorySuggestions` endpoints to `src/lib/endpoint.ts` — POST, GET /mine, GET /, PATCH /:id/review
- [ ] 2.2 Create `src/services/category-suggestions.ts` — `getAll`, `getMine`, `create`, `review` with cache tags
- [ ] 2.3 Add `categorySuggestions.list` path to `src/config/paths.ts`
- [ ] 2.4 Register `categorySuggestions` module in `src/lib/permission-utils.ts`

## Phase 3: UI Components

- [ ] 3.1 Create `src/sections/category-suggestions/config/tabs.ts` — `NavigationTabs` linking categories and suggestions
- [ ] 3.2 Create `src/sections/category-suggestions/modals/create-suggestion-modal.tsx` — Mantine modal form with Zod validation and submit
- [ ] 3.3 Create `src/sections/category-suggestions/modals/review-suggestion-modal.tsx` — Details + `ConfirmationDialog` approve/reject + `adminNotes`

## Phase 4: Containers & Page

- [ ] 4.1 Create `src/sections/category-suggestions/containers/category-suggestions-admin-container.tsx` — DataGrid with state/supplier filters, `ActionsMenu`, `useFiltersUrl`
- [ ] 4.2 Create `src/sections/category-suggestions/containers/category-suggestions-supplier-container.tsx` — DataGrid with state badges and "Sugerir" button
- [ ] 4.3 Create `src/sections/category-suggestions/containers/category-suggestions-server-wrapper.tsx` — `getModulePermissions`, prefetch admin or supplier data
- [ ] 4.4 Create `src/app/dashboard/(catalog)/category-suggestions/page.tsx` — server component building query, rendering wrapper

## Phase 5: Final Wiring

- [ ] 5.1 Add "Sugerencias de categorías" sidebar link to `src/layouts/sidebar/sidebar-config.tsx` under Catálogo
- [ ] 5.2 Inject `NavigationTabs` into `src/sections/categories/list/categories-list-container.tsx` for admin users

## Phase 6: Verification

- [ ] 6.1 Verify FR-001/FR-002: supplier creates suggestion and views own list with state badges
- [ ] 6.2 Verify FR-003/FR-004/FR-005: admin lists all, filters by state/supplier, approves and rejects with notes
- [ ] 6.3 Verify unauthorized roles are redirected away from `/dashboard/category-suggestions`
