# Workspace Provisioning Engine — TODO

## Step 1 — Route delegation

- [ ] Update `POST /business/workspace` to call `WorkspaceProvisioningService.provisionWorkspace(dto)` instead of `BusinessService.createWorkspace(dto)`.

## Step 2 — Make pipeline compile with current lint rules

Lint currently fails heavily, including in existing workspace-provisioning pipeline stubs (no-op methods using `any`).

- [ ] Replace `any` parameters in provisioners with properly typed Prisma transaction client and input types.
- [ ] Fix `require-await` issues by either removing `async` from no-op methods or adding explicit `return undefined;` with `await` where appropriate.
- [ ] Fix `no-unsafe-*` errors by avoiding `any` and using Prisma types.

## Step 3 — Deterministic/no-op contract for Module/AI/etc

- [ ] Decide whether these provisioners remain no-op.
- [ ] If no-op, ensure they still satisfy test expectations and don’t claim side effects in audit logs.

## Step 4 — Tests

- [ ] Add/extend tests for provisioning transaction behavior.
- [ ] Add rollback tests by forcing one provisioner to throw.
- [ ] Add duplicate business name + duplicate owner email tests.

## Step 5 — CI verification

- [ ] `npm run build` and `npm run lint` pass.
- [ ] `npm test` passes (note: currently failing auth specs unrelated to workspace provisioning).
