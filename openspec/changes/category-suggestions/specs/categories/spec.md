# Categories

## Purpose
Manage product categories.

## Requirements

### Requirement: Admin Category List Tabs
Admins MUST see "Categorías" and "Sugerencias de categorías" tabs on the category list page.

#### Scenario: Tab navigation
- GIVEN an admin on `/dashboard/categories`
- WHEN the page loads
- THEN `NavigationTabs` renders both tabs
- AND clicking "Sugerencias" navigates to `/dashboard/category-suggestions`
