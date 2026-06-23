# TODO: Fix Next.js build hang (postcss.js)

- [ ] Inspect Tailwind v4 configuration presence (tailwind.config.\*). If missing, align PostCSS/Tailwind setup so build doesn’t hang.
- [ ] Verify PostCSS config for Tailwind v4 compatibility.
- [ ] Validate CSS entrypoints: apps/web/app/globals.css (ensure no recursive imports).
- [ ] Apply minimal non-UI fixes only (no page removals, no design/UX changes, no fetcher logic changes).
- [ ] Run `npm install` and then `npm run build` in `apps/web`.
- [ ] If build still hangs, capture the exact hanging file by running build with verbose logging and adjust further.
