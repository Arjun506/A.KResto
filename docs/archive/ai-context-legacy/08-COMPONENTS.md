# Components

## Auth / Routing

- `apps/web/components/protected-route.tsx`
  - Client-side redirect to `/login` when token absent

## Dashboard Components

- `apps/web/app/dashboard/page.tsx` dynamically imports:
  - `@/components/dashboard/OwnerDashboard`
  - `@/components/dashboard/CashierDashboard`
  - `@/components/dashboard/WaiterDashboard`
  - `@/components/dashboard/ChefDashboard`

> Note: current docs do not yet include the content of these component files.

## TODO

- Read and document `apps/web/components/dashboard/*`.
- Read and document any shared components under `apps/web/components/common/*`.
