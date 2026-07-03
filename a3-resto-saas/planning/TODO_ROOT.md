# Linux compatibility fix: lightningcss-win32 EBADPLATFORM

## Steps

1. Remove `lightningcss-win32-x64-msvc` from root `package.json`.
2. Delete root `package-lock.json`.
3. Search repo for any other `package-lock.json` under workspaces and delete them (Windows-pinned locks).
4. Run `npm install` from repo root to regenerate a Linux-compatible lockfile.
5. Run `npm run build` (turbo) from repo root.
6. Run `npm run build` inside `a3-resto-saas/apps/web` as a sanity check.
7. Confirm no `lightningcss-win32-*` remains in lockfile.
8. Report all files changed/deleted and include final git diff + successful build output.
