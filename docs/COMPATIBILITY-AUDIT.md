# Compatibility audit: main and dev

Date: 2026-11-04. HISTORICAL BASELINE before stabilization.
This document preserves original findings and reproduction evidence. For the
current implementation and verification outcome, see [RELEASE-STATUS.md](RELEASE-STATUS.md)
and `release-verification.json`; findings below describe the audited old versions.

Scope update after audit (2026-11-04): the user confirmed React 18 and above.
React 16/17 support is out of scope. Findings about the historical >=16.8 claim
remain evidence of incorrect metadata; no legacy implementation is planned.

## Scope and evidence

- `main`: `1a6f20516b4ec44ba5752d8b03b008902e4f7755`.
- `dev`: `7a71022da336770c6348ec54b34795ba1985df40` (active).
- Both remote heads matched local heads when checked against GitHub.
- Direct `git diff main dev -- src/components/table` is empty. All shared-core
  findings therefore apply to both branches, unless stated otherwise.
- Manifest/build/exports, all shared component/hook/tool sources, CSS, types,
  README, demo integration, lockfiles and tracked artifacts were inspected.
- Four pre-existing staged user edits were preserved (manifest/lockfile,
  src/main.tsx, SidebarFooter.tsx). The working tree includes a Query dependency
  added to the lockfile that is absent from committed dev's lockfile.
- Runtime probes: Node 22.16.0, React/React DOM 18.2.0, TypeScript 5.9.3,
  installed Query 5.105.3 and Swiper 11.2.10. No install was performed.
- Main was rebuilt in an isolated git-archive snapshot with the CURRENT local
  toolchain resolved from the parent workspace, not a clean historical npm ci.

Evidence labels: **reproduced** means executed locally; **source** means a
deterministic source/config defect with its trigger described; **risk** means a
behavior that still needs a browser/integration test. Severity is release impact:
P0 blocks release, P1 breaks supported usage, P2 is a correctness/quality gap.

## Executed checks

| Check | Result |
| --- | --- |
| TypeScript --noEmit (working dev) | Pass; this does not check Hook rules or package exports |
| Vite build to separate temporary directory | Pass; demo JS ~1.49 MB, gzip ~490 KB; chunk-size warning |
| dev npm run rollup | Fail: Could not resolve entry module rollup.config.js |
| main isolated Rollup build | Pass: JS + declarations; CSS minifier warns on calc(infinity * 1px) |
| npm test | Fail by design: placeholder, no tests |
| dev pack dry-run, scripts disabled | ~2.69 MB tarball; 13 entries; demo assets, no declared library entrypoints |
| main rebuilt pack dry-run | ~49 KB tarball; 4 entries including JS + declarations |
| dev source Table renderToString | Fail: window is not defined |
| main committed bundle renderToString | Fail: window is not defined |
| closed ActionDropDown renderToString | Fail: document is not defined |
| saved search render (location stub only) | Fail: sessionStorage is not defined |
| internal render without provider (location stub only) | Fail: No QueryClient set |
| breakpoint initial markup, server vs 375px | false vs true; mismatch reproduced, actual hydration not run |
| npm runtime audit, current dev lock | 10 affected package nodes: 1 critical, 4 high, 5 moderate |
| npm runtime audit, main lock snapshot | 4 affected package nodes: 1 critical, 2 high, 1 moderate |

Replay runtime observations with `node scripts/audit-compatibility.cjs`.
Raw advisory reports are in `audit-evidence/`; counts are affected dependency
nodes, not counts of independently exploitable vulnerabilities.

## Release blockers

### PKG-01 — dev cannot produce the package it declares (P0, reproduced)

`package.json: main/module/types/exports/scripts`, `vite.config.ts`, deleted
`rollup.config.js`. Build and prepublishOnly invoke Vite in application mode;
`dist/index.js`, `dist/index.mjs`, `dist/index.d.ts` do not exist. Pack includes
HTML, demo screenshots/GIFs and app chunks. A successful demo deploy can replace
the directory intended for npm. Separate demo/library builds and output paths;
verify every manifest target exists inside an actual tarball before release.

### PKG-02 — public API regression (P0, reproduced)

`src/index.ts:1`. Main exports default + named Table, rowRenderer, ActionDropDown,
and ColumnType/CustomBody/AutoPageSizeConfig types. Dev exports only default.
README examples and existing named-import consumers break. Restore established
exports, explicitly export public configuration/prop types, and compile consumer
fixtures against the PACKED entry, not private source paths.

### SSR-01 — server render crashes (P0, reproduced)

`hooks/useQueryParams.tsx:4`, `tools/actionDropDown/DropDownMenu.tsx:51`,
`tools/SearchBox.tsx:29`. Query state reads window in a state initializer. A
closed dropdown still evaluates document.body as a portal argument. Saved-search
initialization reads storage outside a browser guard; getItem is outside try/catch.
Make initial state deterministic, read browser state after mount, guard portals
and unavailable storage. Test both source and published artifacts via SSR.

### DEP-01 — advertised React compatibility is false (P0, source + metadata)

Main advertises `react >=16.8` without an upper bound; Query v5 requires React 18+.
The build uses react/jsx-runtime, absent from React 16.8–16.13. Dev has no React
peerDependencies and puts demo dependencies requiring React >=18 in dependencies.
Dependencies can force or conflict with the consumer's React version. Choose a
tested baseline; legacy support requires architectural work, not relaxed peers.

### SEC-01 — vulnerable locked runtime dependencies (P0 release gate, reproduced)

Both locks include Swiper 11.2.10, reported critical under
[GHSA-hmx5-qpq5-p643](https://github.com/advisories/GHSA-hmx5-qpq5-p643).
The advisory fixes that issue at 12.1.2; the existing ^11 range cannot reach it.
Both locks also have affected Axios, follow-redirects and form-data. Dev adds
affected Markdown/syntax-highlighting and router dependency chains.
Full evidence: [dev](audit-evidence/npm-runtime-dev-2026-11-04.json) and
[main](audit-evidence/npm-runtime-main-2026-11-04.json).
Review reachability and upgrade the relevant dependency chains with regression
checks. Do not run npm audit fix --force blindly: suggested changes include major
versions. Package advisory severity does not prove exploitability in this table;
several Axios/router issues depend on server-only or attacker-controlled inputs.

## React, SSR and integration correctness

### REACT-01 — Hooks inside column loops (P1, source)

`DesktopTable.tsx:134`, `MobileTable.tsx:31`: useMemo is called inside columns.map.
Adding/removing columns for the same mounted row changes Hook count and can throw
Rendered more/fewer hooks than expected. Render without that memo or extract a
cell component. Test dynamic columns in both renderers, including StrictMode.

### REACT-02 — conditional internal-mode Hooks (P1, source)

`Table.tsx:402`: useEffect/useQuery are inside if (mode === internal). Changing
mode on the same instance violates Hook ordering. Isolate the internal controller
or use an unconditional hook design; static/external consumers must not inherit
a QueryClient requirement merely to satisfy Hook ordering.

### SSR-02 — hydration parity and RSC boundary absent (P1, reproduced + risk)

`hooks/useIsMobile.ts:4` initializes from window width on the client and false on
the server. Mobile markup differs on first render; the independent breakpoint
probe confirms this. No library source/output starts with use client. Next App
Router needs a preserved client boundary; adding the directive alone does not
fix SSR because Client Components are also prerendered. Callback/render props
belong in a client wrapper; document that boundary. Test actual hydration and
production Next builds rather than hiding the issue with ssr:false.

### QUERY-01 — cache data and loading state are ignored (P1, source + reproduced provider error)

`Table.tsx:415`: useQuery's result is discarded. Rows/loading are mutated only
inside queryFn. A host QueryClient with fresh cached data (nonzero staleTime) can
skip queryFn on remount, leaving rows empty. Shared-key observers do not all get
state mutations from the one queryFn that runs. Document/repair the required
provider integration and derive data, errors and loading from query state.

### QUERY-02 — query identity omits request-defining inputs (P1, source)

`Table.tsx:417`: key contains tableName/page/search/order/body/size, but omits
endpoint, baseUrl, payload, method, columns and auth context. Reusing tableName or
changing request configuration can reuse/deduplicate a different request. Include
stable request identity without exposing raw credentials in query keys. Include
tests with two tables/endpoints and changed credentials/configuration.

### QUERY-03 — stale request races and swallowed errors (P1, source)

`Table.tsx:427`: queryFn mutates component state, ignores Query's AbortSignal,
and catches without rethrowing or a defined error result. A slow old request can
overwrite current rows/loading; undefined success is invalid for Query v5.
Use cancellation, declarative query data and consistent error propagation. Do
not notify as a side effect of obsolete/unmounted requests.

### API-01 — optional baseUrl generates an invalid URL (P1, source)

`Table.tsx:458`: `undefined + '/api/data' || '' + endpoint` produces the truthy
string `undefined/api/data`, so the fallback never runs. Use explicit optional
base handling and test relative endpoints, full URLs and trailing slashes.

### API-02 — GET sends payload as data instead of query params (P1, source)

`Table.tsx:456`: GET and POST share Axios data; browser GET will not transmit
pagination/search as intended. Select params vs data according to method.
The static JSON demo endpoint cannot validate real server-side paging semantics.

### API-03 — mount resets deep-linked internal page (P1, source)

`Table.tsx:410`: customBody effect resets page to 1 on initial mount as well as
filter changes. A URL with page=3 loses its page and can start a redundant request.
Distinguish initial hydration from a meaningful body change.

## Data, URL state and selection

### STATE-01 — URL hook instances do not notify each other (P1, source)

`hooks/useQueryParams.tsx:3`, `tools/SearchBox.tsx:125`: each caller owns a search
snapshot; pushState/replaceState update only that hook's state and do not emit
popstate. SearchBox removes page in the URL while Table can stay on page 5, so
filtered results appear empty. Search/sizing/filter changes do not consistently
call onPageChange(1), so an external host can continue requesting the old page.
Centralize state changes/subscription and verify callbacks as well as the URL.

### STATE-02 — URL updates discard hash and router state (P1, source)

`hooks/useQueryParams.tsx:29,49`, `Table.tsx:710`: URLs are rebuilt without hash
and history state is replaced with {}. This can destroy hash-based navigation
(the demo uses HashRouter) or host router metadata. Filter clearing removes ALL
query parameters and reloads the whole app. Preserve unrelated URL/hash/state;
test router integration, including back/forward and externally changed params.
Native History API use is not itself categorically incompatible with Next.

### STATE-03 — invalid values, multiple instances and prop updates (P1, source)

`Table.tsx:113,156`, `tools/PageSizeSelect.tsx:23`: Number(value)||default accepts
negative/fractional/Infinity values. pageSize is globally hardcoded, colliding
across tables. useState snapshots do not follow later pageSize prop changes or
all URL changes. Current pages are not clamped after data/filter shrinkage. Define
validated positive integers and a consistent controlled/uncontrolled contract.

### STATIC-01 — displayed rows rely on the search UI (P1, source)

`Table.tsx:301,321,366,515`: duplicate effects set static rows/count differently;
sort updates tableRows but rendered static data comes from filteredRows. Only
SearchBox normally copies the sorted rows into filteredRows, so sorting with
noSearch does not change displayed rows. Clearing sort does not restore the input
order; initial state also forces id descending. Derive filtered/sorted/paged rows
in a single pipeline independent of whether the search input is visible.

### SEARCH-01 — duplicated debounce, unstable callbacks and storage (P1, source)

`tools/SearchBox.tsx:61,77`: two 400ms effects invoke onSearch for one input.
One depends on onSearch, which Table recreates each render, causing unnecessary
callbacks/timers on unrelated updates. Persistence writes can throw when storage
is blocked/full; tableName changes do not reload saved input. Keep one debounce,
latest callback handling and guarded persistence; test restoration and switching.

### SELECT-01 — zero IDs and select-all semantics (P1, source)

`tools/SelectableCheckbox.tsx:28`: if (!id) excludes valid numeric ID 0.
`Table.tsx:638`: select-all compares counts, not set membership, and header state
compares against totalItems while server modes only have current-page IDs. Equal
length but different IDs can clear selection incorrectly. Static select-all uses
all raw rows, including hidden filtered rows. Define scope, use identity sets,
preserve selection across pages and support indeterminate state.

### SORT-01 — displayed and payload column indexes can diverge (P2, source)

`Table.tsx:222,253,432`: synthetic row/selection columns, filtered-out operation
columns and desktop-local sort state use different indexes. A null-data column
before a sortable data column shifts the payload index. handleOrderChange omits
isSelectable from dependencies. Map displayed columns to request columns
explicitly; synchronize default/reset sort indicators with the actual order.

## Layout, accessibility and package quality

### SIZE-01 — auto sizing can remain at zero and target the wrong table (P1, source)

`Table.tsx:130,156,165`: auto mode starts at zero. Missing/tiny container can
leave zero forever (empty rows, disabled fetching, division by zero in pagination).
Fixed repeated IDs + document.querySelector target the first table's elements.
ResizeObserver lacks a fallback/feature check; config changes are missing from
effect dependencies; optional selectors copy subtractSelectors; buffers are
hardcoded or use ||, losing valid zero. Memoized row numbering omits dynamicPageSize.
Use scoped refs, validated fallback sizes, proper dependencies and cleanup.

### MOBILE-01 — virtual slide indexing is missing (P2, source + risk)

`MobileTable.tsx:147`: virtual SwiperSlide elements lack virtualIndex. Test index
mapping and updates to rows/filters after upgrading the vulnerable dependency.
Mobile mode also offers no equivalent sorting UI; document that existing gap.

### ID-01 — row and column identity assumes id (P2, source)

`DesktopTable.tsx:292`, `MobileTable.tsx:130`: row.id||rowIndex ignores selectedKey
and ID 0. Sorting/filtering rows without id can reuse stateful cells by index.
Synthetic id and a user id column can duplicate header keys. Add stable identity
handling while keeping existing selectedKey behavior compatible.

### UI-01 — form embedding can submit unexpectedly (P1, source)

Buttons across pagination, modal/filter controls and dropdown lack type=button.
Inside a host form they default to submit. Test the table nested in a form.

### A11Y-01 — keyboard and assistive-technology gaps (P2, source)

Sortable th cells have click handlers but no keyboard control/aria-sort. Search,
selection and icon-only buttons lack accessible names. Dialog has no role,
aria-modal, focus trap/restore or Escape support; dropdown options are clickable
li elements with no keyboard navigation. Header/body are separate table elements,
so body cells lack native association with those headers. Test keyboard, screen
reader relationships, focus handling and loading announcements in both views.

### STYLE-01 — CSS packaging and isolation are unreliable (P1, source + warning)

Dev sets sideEffects=false despite CSS imports. Main injects CSS at runtime with
no explicit style export (CSP/no-JS styling implications); some Swiper subpaths
are bundled despite root externals. Shared classes such as .checkbox/.space-items
and fixed IDs may collide with host styles. calc(infinity * 1px) raises the main
minifier warning. Specify CSS distribution, mark CSS side effects, scope selectors
and test an optimized packed consumer without Tailwind or demo CSS.

### TYPES-01 — public types do not fully describe the API (P2, source)

`types.ts:83,118`: rowClassName returns void rather than a CSS class string;
auto-size options used in implementation are commented out and hidden by ts-ignore.
Row/render/payload types use any/Object widely; several public props are required
despite README claiming defaults or omitting them (tableName, selectedKey/IDs).
Public TableProps/theme/text/order types are not explicitly re-exported in main.
Correct types without silently breaking callers; compile examples with React
18 AND 19 typings, current TypeScript and NodeNext/bundler resolution.

### PKG-03 — release metadata/tooling do not agree (P2, source)

Dev version is 0.0.6 vs main 2.1.8; main lock root still says 1.0.52. Both npm and
Bun locks exist with no documented authority. Node >=14/npm >=6 contradict modern
build requirements: installed Vite needs Node ^20.19 or >=22.12, dev router >=20,
and lockfile is v3. main has ESM-only exports (no require condition); dev main
points at nonexistent index.js. Decide whether CJS is supported instead of
promising it implicitly. Metadata keywords mention unrelated image-upload tools.
No tracked LICENSE file accompanies the MIT declaration. Verify public npm tags
and version before choosing the next release number; do not infer registry state
from local branch versions.

### QA-01 — no release regression protection (P1, reproduced + source)

No tracked CI workflow, meaningful test script, lint/Hook rules, browser matrix,
SSR/Next fixtures or packed-consumer checks. Demo imports private source paths,
hiding export/declaration/CSS failures. Main's committed bundle and a new rebuild
are not a substitute for testing the tarball. See RELEASE-PLAN.md for gates.

### DOC-01 — examples overpromise and hide integration requirements (P2, source)

README mixes TS annotations into jsx examples, omits tableName and the required
QueryClientProvider, documents an inaccurate selectedKey default, and advertises
column reordering without an implemented reorder interaction. Inline editing is
mentioned in dev metadata without a defined API. Screenshot URL points at root
main/table.gif, absent at current main HEAD. Move demo-only packages out of npm
dependencies; document the real supported API and tested compatibility matrix.

### CLEANUP-01 — effect cleanup and production diagnostics (P2, source)

`hooks/useClickOutside.ts:19` removes the listener only if ref.current is still
non-null; after unmount it may already be cleared, retaining callbacks. Auto-size
and request paths log in production. Remove stale comments/debug logging and
always clean subscriptions. This hook is currently unused by the main render path.

## Compatibility conclusion

No React/Next version is certified by this audit. Existing runtime probes use
React 18.2; they find failures, not a supported release matrix. React 19 types,
real hydration, mobile browsers, Next Pages/App production builds, clean npm ci,
installed tarball consumers, and actual server pagination were NOT executed.
The npm registry tarball currently published under the package name was not
downloaded; main's committed and locally rebuilt artifacts were inspected instead.

Confirmed minimum: React 18, with React 18 and 19 as the initial validation matrix
and production Next Pages/App integration in scope. React 16/17 support is excluded.
Future React majors require validation before a support claim. Fix the present
release gates before new features, then expand the documented matrix based on
passing consumer tests.

## Primary references consulted

- [React Hook rules](https://react.dev/reference/eslint-plugin-react-hooks/lints/rules-of-hooks).
- [TanStack Query v5 migration / React 18 minimum](https://tanstack.com/query/latest/docs/framework/react/guides/migrating-to-v5).
- [Next server/client components and library guidance](https://nextjs.org/docs/app/getting-started/server-and-client-components).
- [React 19 upgrade guidance](https://react.dev/blog/2024/04/25/react-19-upgrade-guide).
- [Swiper advisory](https://github.com/advisories/GHSA-hmx5-qpq5-p643).
