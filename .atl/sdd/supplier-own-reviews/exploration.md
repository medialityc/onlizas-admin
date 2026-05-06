## Exploration: Supplier Own Reviews

### Current State

The codebase already has a review system for inventory products, but it is currently only consumed in the **admin inventory list** to show aggregated review summaries (average score, total count) per inventory card.

**Existing review artifacts:**
- `src/types/reviews.ts` — `InventoryReview`, `GetInventoryReviewsResponse`, `InventoryReviewSummary`, `InventoryReviewsSummaryMap`
- `src/services/reviews.ts` — single function `getReviewsByInventoryId(inventoryId, pagination?)` that fetches reviews for a specific inventory ID via `GET /reviews/{inventoryId}`
- `src/utils/reviews.ts` — `buildInventoryReviewSummary(reviews)` helper to aggregate scores
- `src/sections/inventory-provider/containers/inventory-server-wrapper.tsx` — already fetches review summaries for each inventory and passes them to the card grid

There is **no supplier-scoped review endpoint**, **no "my reviews" page**, and **no sidebar navigation** for suppliers to see reviews of their own products.

### Affected Areas

| File | Why affected |
|------|-------------|
| `src/lib/endpoint.ts` | Must add a supplier-scoped review backend route |
| `src/services/reviews.ts` | Must add a server action to fetch the authenticated supplier's reviews |
| `src/types/reviews.ts` | May need to extend `InventoryReview` if backend enriches with product/store names |
| `src/config/paths.ts` | Must add a new route path (e.g. `/dashboard/my-reviews`) |
| `src/layouts/sidebar/sidebar-config.tsx` | Must add a new sidebar menu item for supplier users |
| `src/app/dashboard/my-reviews/page.tsx` | New page — async server component |
| `src/sections/reviews/containers/my-reviews-container.tsx` | New container — client component that bridges URL filters + DataGrid |
| `src/sections/reviews/list/reviews-list.tsx` | New list component — defines DataGrid columns for reviews |

### Approaches

#### 1. Reuse existing `getReviewsByInventoryId` per inventory (client-side aggregation)
- **Description:** The supplier inventory list already knows the supplier's inventories. Fetch reviews for each inventory individually on the client and merge them into a single table.
- **Pros:** No backend changes needed; uses existing endpoint.
- **Cons:** N+1 query problem; loses server-side pagination/search across all reviews; slow and unscalable.
- **Effort:** Low

#### 2. New backend endpoint `GET /suppliers/reviews` + full supplier-scoped page (recommended)
- **Description:** Add a new backend endpoint that returns all reviews belonging to the authenticated supplier's inventories, with pagination, search, and sorting. Build a standard server-wrapper → container → DataGrid page following the exact pattern used by `my-zones`, `my-accounts`, and the admin suppliers list.
- **Pros:** Single request, server-side pagination/search, consistent with existing architecture, scalable.
- **Cons:** Requires a small backend endpoint addition.
- **Effort:** Medium

#### 3. Add reviews as a tab inside the existing Provider Inventory page
- **Description:** Instead of a standalone page, add a "Reseñas" tab on the provider inventory detail or list view that shows reviews for the selected inventory.
- **Pros:** Contextual; reuses existing `getReviewsByInventoryId`.
- **Cons:** Doesn't give a global view of all reviews across all products; not what the feature request describes.
- **Effort:** Low

### Recommendation

**Go with Approach 2** — a dedicated supplier-scoped reviews page at `/dashboard/my-reviews` (or similar). This follows the exact established pattern in the codebase for supplier-specific features (`my-zones`, `my-accounts`) and provides the best UX.

The exact pattern to replicate:

1. **Endpoint** (`src/lib/endpoint.ts`)
   ```ts
   reviews: {
     byInventoryId: (inventoryId: string | number) => `${process.env.NEXT_PUBLIC_API_URL}reviews/${inventoryId}`,
     myReviews: `${process.env.NEXT_PUBLIC_API_URL}suppliers/reviews`, // NEW
   }
   ```

2. **Service** (`src/services/reviews.ts`)
   ```ts
   export async function getMyReviews(
     params: IQueryable
   ): Promise<ApiResponse<GetInventoryReviewsResponse>> {
     const url = new QueryParamsURLFactory(
       { ...params },
       backendRoutes.reviews.myReviews
     ).build();
     const res = await nextAuthFetch({ url, method: "GET", useAuth: true, next: { tags: [INVENTORY_REVIEWS_TAG_KEY] } });
     if (!res.ok) return handleApiServerError(res);
     return buildApiResponseAsync<GetInventoryReviewsResponse>(res);
   }
   ```

3. **Types** (`src/types/reviews.ts`)
   - `InventoryReview` and `GetInventoryReviewsResponse` already exist. If the backend returns `productName`, `storeName`, `productImage`, etc., extend the type accordingly.

4. **Page** (`src/app/dashboard/my-reviews/page.tsx`)
   - Async server component.
   - Get session via `getServerSession()`.
   - Build query with `buildQueryParams(searchParams)`.
   - Call `getMyReviews(apiQuery)`.
   - Pass data to `MyReviewsContainer` inside `<Suspense>`.

5. **Container** (`src/sections/reviews/containers/my-reviews-container.tsx`)
   - `"use client"`.
   - Receives `initialData: ApiResponse<GetInventoryReviewsResponse>` and `query: SearchParams`.
   - Uses `useFiltersUrl()` for `handleSearchParamsChange`.
   - Renders `<ReviewsList data={initialData.data} searchParams={query} onSearchParamsChange={...} />`.

6. **List** (`src/sections/reviews/list/reviews-list.tsx`)
   - `"use client"`.
   - Defines `DataTableColumn<InventoryReview>[]` columns: product name, store name, user name, average score, product quality, supplier quality, delivery quality, message, date, active status.
   - Uses `<DataGrid<InventoryReview> data={data} columns={columns} searchParams={searchParams} onSearchParamsChange={onSearchParamsChange} ... />`.

7. **Paths** (`src/config/paths.ts`)
   ```ts
   provider: {
     // ... existing
     reviews: {
       list: `${DASHBOARD}/my-reviews`,
     },
   }
   ```

8. **Sidebar** (`src/layouts/sidebar/sidebar-config.tsx`)
   - Add under the existing provider-relevant section (e.g. inside `inventory` or `sales` section, or create a provider-specific section).
   - Use `paths.provider.reviews.list` and `permissions: [PERMISSION_ENUM.SUPPLIER_RETRIEVE]`.

### Risks

- **Backend endpoint does not exist yet.** The frontend team needs to coordinate with backend to create `GET /suppliers/reviews` (or equivalent) that returns paginated reviews scoped to the authenticated supplier.
- **Type enrichment.** The current `InventoryReview` type only has `inventoryId` and `userName`. For a useful supplier table, the backend likely needs to include `productName`, `storeName`, and possibly `productImage`. Confirm the backend contract before finalizing types.
- **Permission scope.** Ensure the supplier role has `SUPPLIER_RETRIEVE` or a more specific review-read permission. The sidebar item should be gated correctly.
- **No existing `app/provider` routes.** Although `paths.provider.*` exists in config, there are no physical `app/provider/*` pages. All supplier pages live under `app/dashboard/my-*`. Stick to that convention.

### Missing Pieces

1. **Backend endpoint** for supplier-scoped reviews.
2. **Enriched review DTO** (product/store names) — confirm with backend.
3. **Permission enum** for supplier reviews (can reuse `SUPPLIER_RETRIEVE` if sufficient).
4. **Icon** for the sidebar menu item (can reuse `StarIcon` from Heroicons or Lucide).

### Ready for Proposal

**Yes.** The orchestrator should tell the user that exploration is complete and the implementation path is clear. The next step is to create the change proposal (`sdd-propose`) which will cover:
- Backend endpoint contract agreement
- File creation list (service, types, page, container, list, paths, sidebar)
- Permission verification

### Key Learnings

- **Auth pattern:** `getServerSession()` from `zas-sso-client` returns `{ user: { id } }`. Supplier ID is `session.user.id`.
- **Supplier-scoped endpoints:** The backend derives the supplier from the JWT; the frontend calls `/suppliers/...` routes without passing an explicit ID (e.g. `getAllMyInventoryProvider` hits `/suppliers/inventories`).
- **Pagination pattern:** Server page awaits `searchParams`, builds `IQueryable` via `buildQueryParams`, passes to server wrapper. Client uses `DataGrid` + `useFiltersUrl` to sync pagination/search/sort to the URL query string.
- **UI pattern:** `DataGrid<T>` from `src/components/datagrid/datagrid.tsx` wraps `mantine-datatable` and expects `PaginatedResponse<T>` or `simpleData`. It handles pagination, sorting, search, and column visibility out of the box.
- **File structure:** New features live in `src/sections/{feature}/list/` for list components, `src/sections/{feature}/containers/` for container components, and `src/app/dashboard/.../page.tsx` for pages.
