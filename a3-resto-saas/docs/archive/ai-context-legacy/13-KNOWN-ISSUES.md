# Known Issues

## Current Observations

- Backend auth service seeds **in-memory** users for local development (AuthService.seedUsers()).
- Frontend dashboard pages (billing/kitchen/waiter) are largely **mock-data heavy** and do not fully represent backend integration yet.
- Tooling: `search_files` may be limited in some environments (earlier failure due to missing `ripgrep`).

## TODO

- Expand discovery of remaining endpoints and modules (menu, inventory, reservations, uploads, analytics).
- Identify any build/deploy issues referenced in repo docs (e.g. `apps/web/TODO_BUILD_HANG_FIX.md`).
