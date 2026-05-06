# Tasks: Supplier Own Reviews

## Phase 1: Foundation

- [ ] 1.1 Add `reviews.my` route to `src/lib/endpoint.ts` — `my: ${process.env.NEXT_PUBLIC_API_URL}reviews/my`
- [ ] 1.2 Add `getMyReviews(params)` server action to `src/services/reviews.ts` using `QueryParamsURLFactory`, `backendRoutes.reviews.my`, and `nextAuthFetch`; returns `ApiResponse<GetInventoryReviewsResponse>`
- [ ] 1.3 Verify `src/types/reviews.ts` — confirm `InventoryReview` includes `media: string[]` (no changes expected)
- [ ] 1.4 Add `provider.reviews.list` path to `src/config/paths.ts` as `${DASHBOARD}/my-reviews`

## Phase 2: Core Implementation

- [ ] 2.1 Add "Mis reseñas" menu item to `src/layouts/sidebar/sidebar-config.tsx` under Inventario section with `PERMISSION_ENUM.SUPPLIER_RETRIEVE` and appropriate icon
- [ ] 2.2 Create `src/app/dashboard/my-reviews/page.tsx` — async server component that checks `getServerSession`, redirects unauthenticated to `/dashboard`, fetches initial data via `getMyReviews`, and renders `MyReviewsContainer`
- [ ] 2.3 Create `src/sections/reviews/containers/my-reviews-container.tsx` — client container receiving `initialData: GetInventoryReviewsResponse`, using `useFiltersUrl` to sync `page`/`pageSize` with URL query params, and rendering `ReviewsList`
- [ ] 2.4 Create `src/sections/reviews/list/reviews-list.tsx` — `DataGrid<InventoryReview>` with columns: `userName`, `productQuality`, `supplierQuality`, `deliveryQuality`, `averageScore`, `message` (truncated to 80 chars; "—" if empty), `active` (badge Activo/Inactivo), `media` (icon with count or "—"); empty state "No hay reseñas"; default `pageSize=10`; horizontal scroll on mobile

## Phase 3: Verification

- [ ] 3.1 Run `npm run tsc` — fix any type errors across modified and new files
- [ ] 3.2 Run `npm run lint` — resolve all lint violations
- [ ] 3.3 Run `npm run build` to verify the new page compiles and all imports resolve correctly
