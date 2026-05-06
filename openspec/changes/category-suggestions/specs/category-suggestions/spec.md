# Category Suggestions

## Purpose
Enable approved suppliers to suggest new product categories and give administrators a dedicated UI to review, approve, or reject them.

## Requirements

### Requirement: FR-001 — Submit Suggestion
Suppliers MUST create category suggestions via `POST /category-suggestions` providing name and description.

#### Scenario: Valid submission
- GIVEN a supplier clicks "Sugerir categoría"
- WHEN they fill the modal form and submit
- THEN a PENDING suggestion is created
- AND the supplier list refreshes via cache invalidation

#### Scenario: Empty name
- GIVEN a supplier submits the form with empty name
- WHEN validation runs
- THEN the form shows an error and no request is sent

### Requirement: FR-002 — List Own Suggestions
Suppliers MUST view only their own suggestions via `GET /category-suggestions/mine`.

#### Scenario: View list
- GIVEN a supplier with existing suggestions
- WHEN they open `/dashboard/category-suggestions`
- THEN the DataGrid shows their suggestions with state badges

### Requirement: FR-003 — Admin List All
Admins MUST view all suggestions via `GET /category-suggestions`.

#### Scenario: View all
- GIVEN an admin clicks the "Sugerencias de categorías" tab
- WHEN the list loads
- THEN the DataGrid shows all suggestions with supplier and state columns

### Requirement: FR-004 — Review Suggestion
Admins MUST approve or reject via `PATCH /category-suggestions/:id/review` with optional `adminNotes`.

#### Scenario: Approve
- GIVEN an admin clicks "Ver detalles"
- WHEN they confirm approval with optional notes
- THEN state becomes APPROVED and the list refreshes

#### Scenario: Reject
- GIVEN an admin clicks "Ver detalles"
- WHEN they confirm rejection with optional notes
- THEN state becomes REJECTED and the list refreshes

### Requirement: FR-005 — Filter Suggestions
Admins MUST filter by state and supplier using `useFiltersUrl`.

#### Scenario: Filter by state
- GIVEN an admin selects a state filter
- WHEN the URL query params update
- THEN the DataGrid refreshes with filtered results

## Non-Functional Requirements
- UI MUST replicate the `warehouses` pattern: Server Wrapper → Tabs → DataGrid → ActionsMenu.
- Page load SHOULD complete within 2 seconds for lists under 100 rows.
- Interactive elements MUST have `aria-label` attributes.

## API Requirements
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | /category-suggestions | Supplier |
| GET | /category-suggestions/mine | Supplier |
| GET | /category-suggestions | Admin |
| PATCH | /category-suggestions/:id/review | Admin |

## UI Requirements
- Admin view: `NavigationTabs` (Categorías / Sugerencias) + `DataGrid` + `ActionsMenu` with "Ver detalles".
- Supplier view: `DataGrid` + "Sugerir" button opening a Mantine modal form.
- Review modal: Mantine modal showing suggestion details, Approve (`actionType="approve"`) and Reject (`customAction` danger) buttons, optional `adminNotes` textarea.

## Permission Requirements
- Suppliers MAY create and read their own suggestions.
- Admins MAY read all suggestions and execute review actions.
- Other roles MUST be redirected away from `/dashboard/category-suggestions`.
