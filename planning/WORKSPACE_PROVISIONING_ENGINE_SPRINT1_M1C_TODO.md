# WORKSPACE_PROVISIONING_ENGINE_SPRINT1_M1C_TODO

## Steps

1. Create new Nest module + `WorkspaceProvisioningService` scaffold.
2. Implement provisioning pipeline components (isolated methods/classes).
3. Reuse existing provisioning logic and keep it inside **one** `prisma.$transaction`.
4. Delegate `POST /business/workspace` to `WorkspaceProvisioningService` (no API redesign).
5. Add unit/integration tests:
   - complete transaction
   - rollback on failure
   - duplicate workspace
   - duplicate owner
   - failed module installation
   - failed AI provisioning
6. Add/update documentation (business core + architecture + implementation notes).
7. Run tests/build to verify.
