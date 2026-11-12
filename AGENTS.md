# Repository context for coding agents

Read this file, then `docs/MAINTAINER-README.md`. Do not reload the entire history,
generated bundles or raw advisory JSON for routine context.

## Product and requirements

- npm library: react-responsive-datatable-kit. React/React DOM 18 and 19 are the
  supported majors; 16/17 are explicitly out of scope. Validate future majors.
- The user authorized stabilizing BOTH dev and main for a manual npm release.
  Do not publish, push, or create a release tag without a separate instruction.
- Release candidate 3.0.0 restores public exports and fixes shared table behavior.
  Version 3 requires an explicit styles.css import and React >=18; see CHANGELOG.
- Exact executed compatibility results live in docs/release-verification.json.
  Do not claim untested browser/framework/version combinations are verified.

## Map

- src/index.ts: public client entry and types. Preserve default/named Table,
  rowRenderer, ActionDropDown and existing public prop/configuration types.
- src/components/table/: shared library; Table.tsx orchestrates data/state;
  data.ts contains pure validation/filter/sort/request helpers.
- hooks/useQueryParams.tsx: useSyncExternalStore + reversible History API
  subscription. Preserve router state, hash, unrelated params and other tables.
- DesktopTable.tsx/MobileTable.tsx: desktop semantic table and mobile cards.
- tools/: search, paging, selection, dialogs, dropdowns.
- src/main.tsx, App.tsx, routes.tsx, pages/: demo only.
- rollup.config.mjs: ESM + declarations + scoped extracted CSS. React, React DOM,
  Query and other runtime packages are external; preserve the use client banner.
- vite.config.ts: demo only. dist/ and demo-dist/ MUST remain separate.
- tests/table.test.tsx: meaningful regressions. Fixture tests import the packed
  public package; do not replace them with private-source-only checks.
- scripts/verify-release.mjs: isolated tarball React/type/production Next/browser
  matrix. Uses system Chrome on Windows or RELEASE_CHROME_PATH, otherwise Chromium.

## Commands and verification

Use npm (package-lock.json is authoritative). On PowerShell use npm.cmd if npm.ps1
is blocked. Use Node 20.19+ on Node 20, or Node 22.12+/a compatible newer line.

- npm test: behavioral regressions, SSR/hydration, cache, cancellation, URL,
  selection, filter clearing, keyboard controls.
- npm run build: clean GENERATED dist, typecheck and library build.
- npm run test:package: exports/types/CSS/Node SSR/pack-list checks.
- npm run test:release: install tarball consumers; React 18/19, TypeScript
  bundler/NodeNext and production Next Pages/App with desktop/mobile Chromium.
- npm run build:demo: demo production build in demo-dist.
- npm audit: root dependency security; fixture dependencies are separate.

## Invariants

Never put Hooks in loops/conditions. Never read window/document/storage while
server-rendering. First client and server markup must match. Portal targets and
persistence are browser-only. Query state is declarative, uses cancellation, and
must not put credentials in cache keys. Static/external modes need no host provider.
Do not break the existing internal request protocol or shared QueryClient support.

Check git status before editing and preserve user changes/staging. The original
attribution edits were committed by the user before stabilization began. Avoid
switching branches over uncommitted work. Keep both branches' shared release
implementation identical; branch updates must preserve existing history.

The original COMPATIBILITY-AUDIT.md and audit-evidence/ are HISTORICAL baseline
records, not a list of current failures. Use RELEASE-STATUS.md and the latest
verification JSON for the outcome. Update evidence after material changes.
