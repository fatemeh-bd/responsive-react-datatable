# Maintainer quick start

Release preparation: 3.0.0, 2026-11-04. This is the short entrypoint for future
work; the earlier audit remains a historical snapshot.

## Implementation

The library and demo share one repository. Rollup builds `dist/index.mjs`,
`dist/index.d.ts`, source map and scoped `dist/styles.css`. Vite builds the demo
into `demo-dist/`. Never publish the demo directory as the npm library.

Public exports: default and named Table, rowRenderer, ActionDropDown and public
prop/configuration types. React/React DOM 18/19 and TanStack Query v5 are peers;
Axios and Swiper are runtime dependencies. Demo packages are dev dependencies.
The npm lockfile is authoritative. The package is ESM (`type: module`), including
its .d.ts interpretation under NodeNext. Use `.cjs` for CommonJS tooling configs.

Modes: static derives filter -> sort -> slice; external takes host-owned data and
callbacks; internal uses a host QueryClient or a private fallback, cancellation,
request-specific keys, safe credential scopes and query-derived result state.
GET uses params; POST uses data. Saved search is guarded and restored after mount.

URL state is shared through useSyncExternalStore and a reversible History API
subscription, preserving hash/history state/unrelated query values. Set distinct
pageQueryName and pageSizeQueryName for independent tables. Select-all includes
filtered static rows or the loaded server page, preserving off-scope selections.
Use rowKey/selectedKey for stable identity; numeric zero is valid.

Overlays mount only in the browser. The desktop header/body use one semantic table.
Dialog focus, Escape, menu keyboard controls and non-submitting buttons are tested.
Automatic sizing uses local refs and positive fallbacks, never a zero page size.

## Required checks

```powershell
npm.cmd ci
npm.cmd test
npm.cmd run build
npm.cmd run test:package
npm.cmd run test:release
npm.cmd run build:demo
npm.cmd audit --omit=dev --registry=https://registry.npmjs.org/
```

See [release status](RELEASE-STATUS.md), `release-verification.json` for exact
matrix results, and [publishing instructions](PUBLISHING.md). The release matrix
uses temporary isolated consumers in `.release-tests/` and no public API services.
Its requests are mocked; Next integration is exercised against local servers.
Chromium must be installed, or set RELEASE_CHROME_PATH. On this Windows machine
Chrome was already installed, avoiding a region-blocked Chromium download.

## Migration / limits

Read CHANGELOG.md and the root README. React 16/17 are out of scope. Version 3
requires a global styles.css import, preserves unsorted static input order, and
uses onClearFilters rather than a full-page reload for host-owned filter reset.
Mobile has no built-in sorting header. Server-side filtering/pagination requires
an API implementing the documented response protocol. Stable row IDs are strongly
recommended for stateful cells. Future React majors and other Next/browser pairs
require testing before being advertised as supported.

The original audit and old raw advisories are historical. The audit diagnostic
script is not the current regression suite and imports historical main artifacts;
use npm test/test:package/test:release for release decisions.
