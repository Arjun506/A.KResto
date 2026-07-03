# Known Issues & Tech Debt

This document tracks system limitations and technical debt within the codebase.

## 1. Tech Debt Candidates

- **Legacy Restaurant Monolith Controllers:** Controllers like `RestaurantsController` and DTOs like `CreateRestaurantDto` are highly specific to the restaurant domain. They need to be refactored into generic Business entities.
- **Hardcoded Role Decorators:** Role restrictions (e.g. `@Roles('OWNER', 'CASHIER')`) are hardcoded into NestJS endpoints. These should be refactored to check permissions dynamically.
- **Mock Data reliance:** Frontend pages still utilize mock items instead of querying the backend APIs.

## 2. Active Bugs

*None registered currently.*
