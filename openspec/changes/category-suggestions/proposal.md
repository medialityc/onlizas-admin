# Proposal: Category Suggestions

## Intent

Enable approved suppliers to suggest new categories and give administrators a dedicated UI to review, approve, or reject them. Today this workflow lacks a frontend view.

## Scope

### In Scope
- Types, services, and server actions for `category-suggestions` endpoints.
- New `src/sections/category-suggestions/` UI section.
- Admin view with tabs (Categories / Suggestions) using `NavigationTabs`.
- Supplier view: list own suggestions + "Suggest category" modal/form.
- Admin review modal: suggestion details, Approve/Reject buttons, optional `adminNotes`.
- Filters by state and supplier (`approvalProcessId`), synced via `useFiltersUrl`.
- Sidebar and path registration.

### Out of Scope
- Backend API changes (endpoints are already defined).
- Modifications to the existing `approval-processes` flow.
- Push/email notifications.

## Capabilities

### New Capabilities
- `category-suggestions`: Create, list own, list all (admin), and review suggestions.

### Modified Capabilities
- `categories`: Add "Sugerencias de categorías" tab in admin list view.

## Approach

Replicate the `warehouses` pattern exactly:

1. **Server Component page** at `src/app/dashboard/(catalog)/category-suggestions/page.tsx`.
2. **Server Wrapper** (`category-suggestions-server-wrapper.tsx`) resolves `isAdmin`/`isSupplier` via `getModulePermissions`, then pre-fetches data with `nextAuthFetch` and tags.
3. **Admin**: renders `NavigationTabs` (Categories / Suggestions) + `DataGrid` with `ActionsMenu` ("Ver detalles").
4. **Supplier**: renders `DataGrid` with "Sugerir" button.
5. **Review**: clicking "Ver detalles" opens a Mantine modal with `ConfirmModal` flows for Approve (`actionType="approve"`) and Reject (`customAction` danger).
6. **Cache invalidation**: `updateTag("category-suggestions")` on create/review; `QueryParamsURLFactory` builds URLs.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/types/category-suggestions.ts` | New | DTOs and filters |
| `src/services/category-suggestions.ts` | New | Server actions with tags |
| `src/sections/category-suggestions/` | New | Components, containers, modals, tabs config |
| `src/app/dashboard/(catalog)/category-suggestions/page.tsx` | New | Route entry |
| `src/config/paths.ts` | Modified | Add `categorySuggestions` paths |
| `src/layouts/sidebar/sidebar-config.tsx` | Modified | Link under Catálogo |
| `src/sections/categories/list/categories-list-container.tsx` | Modified | Inject tabs for admin |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|-------------|
| Backend DTO contract drift | Low | Validate shape against spec before merge; add runtime guards if needed |
| Confusion with existing `approval-processes` | Med | Explicit naming (`category-suggestions`) and docs in design phase |

## Rollback Plan

Revert the commit. Delete new files and revert changes in `paths.ts`, `sidebar-config.tsx`, and `categories-list-container.tsx`. No DB migrations involved.

## Dependencies

- Backend endpoints (`POST`, `GET /mine`, `GET`, `PATCH /review`) deployed and reachable.

## Success Criteria

- [ ] Admin sees tabs "Categorías" and "Sugerencias de categorías", can filter by state/supplier, and approve/reject with notes.
- [ ] Supplier sees own suggestions list and can submit a new suggestion via modal.
- [ ] Cache is invalidated after create/review so lists refresh without manual reload.
- [ ] `npm run tsc` and `npm run lint` pass cleanly.
