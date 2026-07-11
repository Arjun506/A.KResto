# Engineering Standard: API Standards

## 1. REST Conventions

- **Path Naming:** Use plural nouns for resources (e.g. `/api/v1/business-entities`, `/api/v1/orders`).
- **HTTP Methods:**
  - `GET`: Retrieve a resource or catalog list.
  - `POST`: Create a new resource.
  - `PUT`: Replace an entire resource structure.
  - `PATCH`: Perform partial edits.
  - `DELETE`: Remove a resource or mark as inactive.
- **Versioning:** Require major version prefix selectors (e.g. `/api/v1/`).

## 2. Response Framework

API responses must follow a structured envelope:
- **Success:** `{ success: true, data: { ... }, message: "Optional action summary" }`
- **Error:** `{ success: false, error: { code: "BAD_REQUEST", message: "Details", details: [ ... ] } }`

## 3. Rate-Limiting & Validation

- Throw validation exceptions automatically when input DTO checks fail.
- Document endpoints using Swagger annotations to generate OpenAPI specifications.
