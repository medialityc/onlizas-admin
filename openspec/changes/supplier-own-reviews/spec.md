# Supplier Reviews List

## Purpose
Authenticated suppliers view paginated customer reviews for their own inventory products.

## Data Contract
Reuse `InventoryReview` and `GetInventoryReviewsResponse` from `src/types/reviews.ts`.

| Field | Type |
|---|---|
| id | string |
| productQuality | number |
| supplierQuality | number |
| deliveryQuality | number |
| averageScore | number |
| message | string |
| inventoryId | string |
| userId | string |
| userName | string |
| active | boolean |
| media | string[] |

No type changes required; `media` already exists.

## Functional Requirements

### Requirement: Review List
The system MUST render a paginated table of supplier reviews at `/dashboard/my-reviews`.

#### Scenario: Happy path
- GIVEN an authenticated supplier with reviews
- WHEN they navigate to `/dashboard/my-reviews`
- THEN a `DataGrid` displays columns: `userName`, `productQuality`, `supplierQuality`, `deliveryQuality`, `averageScore`, `message`, `active`, `media`

#### Scenario: Empty state
- GIVEN an authenticated supplier with zero reviews
- WHEN the page loads
- THEN the `DataGrid` shows "No hay reseñas"

#### Scenario: Pagination
- GIVEN more than 10 reviews
- WHEN the user clicks page 2
- THEN the URL updates `?page=2` and the table fetches the next set

### Requirement: Access Control
The system MUST restrict `/dashboard/my-reviews` to authenticated users.

#### Scenario: Auth guard
- GIVEN an unauthenticated user
- WHEN they request `/dashboard/my-reviews`
- THEN the server redirects to `/dashboard`

#### Scenario: Sidebar visibility
- GIVEN a user without `SUPPLIER_RETRIEVE`
- WHEN the sidebar renders
- THEN the "Mis reseñas" link is hidden

## Non-Functional Requirements

| Aspect | Requirement |
|---|---|
| Performance | Server-side initial fetch; client pagination via URL query params without full reload. |
| Accessibility | Score columns MUST have `aria-label` describing the metric. |
| Responsive | Table panel MUST scroll horizontally on viewports < 768px. |

## Validation & Error Handling

### Requirement: Error Resilience
The system MUST handle fetch failures gracefully.

#### Scenario: Network error
- GIVEN `GET /reviews/my` returns 5xx
- WHEN the list loads
- THEN a toast displays "Error cargando reseñas"

#### Scenario: Empty response
- GIVEN the backend returns `data: []`
- WHEN the page renders
- THEN the empty state is shown with zero records

## UI/UX Details

| Element | Detail |
|---|---|
| Columns | userName, productQuality (1–5), supplierQuality (1–5), deliveryQuality (1–5), averageScore (1–5), message (truncated to 80 chars; "—" if empty), active (badge Activo/Inactivo), media (icon with count or "—") |
| Sorting | Not required for MVP. |
| Mobile | Horizontal scroll enabled; `pinLastColumn` behavior follows `DataGrid` defaults. |
| Pagination | Default `pageSize` = 10; synced via `useFiltersUrl`. |
