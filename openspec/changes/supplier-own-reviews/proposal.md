# Proposal: Supplier Own Reviews

## Intent

Give authenticated suppliers a dedicated view to see all customer reviews of their own inventory products. Today suppliers have no way to monitor their product feedback.

## Scope

### In Scope
- Backend route config for `GET /reviews/my`.
- Server action `getMyReviews` with pagination.
- New `src/app/dashboard/my-reviews/page.tsx` following supplier-scoped pattern.
- `src/sections/reviews/list/` container, client wrapper, and `DataGrid` list.
- Sidebar entry under Inventario with `PERMISSION_ENUM.SUPPLIER_RETRIEVE`.
- Path registration in `paths.ts`.

### Out of Scope
- Admin review management UI.
- Replying to reviews.
- Review analytics / aggregations.
- Mutations (activate/deactivate reviews).

## Capabilities

### New Capabilities
- `supplier-reviews-list`: Paginated list of reviews scoped to the authenticated supplier.

### Modified Capabilities
- None

## Approach

Reuse the `my-zones` pattern:
1. Add `my` to `backendRoutes.reviews`.
2. Create `getMyReviews` in `src/services/reviews.ts` using `QueryParamsURLFactory` and `nextAuthFetch`.
3. Reuse existing `InventoryReview` and `GetInventoryReviewsResponse` types — they already match the backend contract.
4. Server page fetches initial data via `getServerSession` + `getMyReviews`, then passes to a client container.
5. Container uses `useFiltersUrl` for pagination and renders a `DataGrid` with columns: userName, productQuality, supplierQuality, deliveryQuality, averageScore, message, active, media.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/lib/endpoint.ts` | Modified | Add `reviews.my` route |
| `src/services/reviews.ts` | Modified | Add `getMyReviews` server action |
| `src/types/reviews.ts` | None | Reuse existing `InventoryReview` |
| `src/app/dashboard/my-reviews/page.tsx` | New | Server component page |
| `src/sections/reviews/list/` | New | Container, client wrapper, list |
| `src/config/paths.ts` | Modified | Add `provider.reviews.list` |
| `src/layouts/sidebar/sidebar-config.tsx` | Modified | Add "Mis reseñas" link under Inventario |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|-------------|
| Backend `GET /reviews/my` not yet deployed | Med | Gate behind feature flag or coordinate deployment |
| Type drift in `media` field | Low | `InventoryReview` already includes `media: string[]`; validate at runtime if needed |

## Rollback Plan

Revert commit or delete new files and revert modifications in `endpoint.ts`, `reviews.ts`, `paths.ts`, and `sidebar-config.tsx`. No DB migrations.

## Dependencies

- Backend `GET /reviews/my` endpoint live and returning confirmed shape.

## Success Criteria

- [ ] Supplier navigates to "Mis reseñas" and sees a paginated table.
- [ ] Columns show scores, message, userName, active status, and media count.
- [ ] Pagination syncs with URL via `useFiltersUrl`.
- [ ] `npm run tsc` and `npm run lint` pass.
