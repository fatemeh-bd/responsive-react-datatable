# Working context for coding agents

Read this file first, then `docs/MAINTAINER-README.md`. Read only the relevant
finding IDs in `docs/COMPATIBILITY-AUDIT.md`; raw audit JSON is for investigation,
not routine context loading.

## Product and scope

- This repository contains the npm library `responsive-react-datatable` and its
  Vite documentation/demo site. Keep their dependency graphs and builds separate.
- The user requested an audit of `main` and `dev` before stabilization and new
  features. The 2026-11-04 audit is complete; runtime fixes are NOT implemented.
- Confirmed user requirement: minimum React/React DOM 18. React 16/17 support
  is out of scope. Validate React 18 and 19, and test future majors before
  claiming support. Next.js integration remains in scope.
- Preserve the current `<Table />` API and the main branch's existing public
  exports when stabilizing. Do not silently drop older consumers.
- Do not claim compatibility with every React/Next.js version. State the tested
  matrix and distinguish proposed support from verified support.

## Repository map

- `src/index.ts`: library entry (currently regressed to default export only).
- `src/components/table/`: entire shared library implementation and CSS.
- `src/components/table/Table.tsx`: orchestration, modes, URL state, requests.
- `DesktopTable.tsx`, `MobileTable.tsx`: renderers.
- `types.ts`, `tableConfigs.tsx`, `helper.ts`: API types, defaults, helpers.
- `hooks/`, `tools/`: URL/responsive hooks, search, paging, selection, overlays.
- `src/main.tsx`, `App.tsx`, `routes.tsx`, `pages/`: demo, not library entrypoints.
- `docs/COMPATIBILITY-AUDIT.md`: evidence, priorities, reproduction scenarios.
- `docs/RELEASE-PLAN.md`: ordered stabilization work and release acceptance gates.
- `scripts/audit-compatibility.cjs`: local diagnostic probes; not a test suite.

## Commands and constraints

- Windows PowerShell: use `npm.cmd`; `npm.ps1` may be blocked by execution policy.
- Type check: `node node_modules/typescript/bin/tsc --noEmit --pretty false`.
- Audit probes: `node scripts/audit-compatibility.cjs` (requires existing
  React/React DOM and Vite's transitive esbuild; no new installs or requests).
- `npm run build` currently builds the DEMO into tracked `dist`; do not use it
  to validate/publish the library. Prefer a temporary `--outDir` for demo checks.
- `npm run rollup` currently fails on dev: config is missing. `npm test` is a
  placeholder that exits 1. Neither means stabilization has been tested.
- Recheck git status before editing. At audit start the user had staged edits in
  package.json, package-lock.json, src/main.tsx and SidebarFooter.tsx. Do not undo,
  restage, or overwrite them. Do not switch branches over a dirty workspace.
- Never hand-edit generated bundles. Test the packed library in consumers.
- Keep hooks unconditional and out of loops; do not read browser globals during
  SSR; keep server and initial client markup consistent.
- Record fixes by finding ID and update verification evidence after meaningful
  changes. Do not mark an open finding resolved based on source inspection alone.
