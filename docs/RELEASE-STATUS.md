# Release preparation status: 3.0.0

Prepared on 2026-11-04. The original compatibility audit is a historical baseline.
Consult release-verification.json for the tested artifact integrity and exact
React/Next versions; release-security.json records the root dependency audit.
No npm publication, git push or release tag is performed by this preparation.

## Latest feature candidate verification: 2026-11-12

The package remains `react-responsive-datatable-kit@3.0.0`. New opt-in APIs add
column visibility, CSV/XLSX/PDF export scopes and formatters, async server export
rows and expandable details. Public exports and the internal request protocol
remain intact. The default table is light; explicit hex themes such as #121212
and root className/style overrides are supported.

The demo is a monochrome light site with the user-supplied logo and favicon.
English documentation is organized by short examples with View/Code tabs,
copyable snippets, the original GIF, searchable topics and collapsible reference.
Version 3.0.0 has its own guide, examples and change notes. Snapshot creation
refuses overwrite; the package check rejects missing or mismatched release docs.
No future version or translated documentation is presented as available.

Validation completed:

- All 42 root tests pass, including export contents, visibility, controlled row
  details, theme/class overrides, hydration and immediate search clearing.
- All 42 tests pass against the actual tarball with React 18.0.0, 18.3.1, 19.0.0
  and 19.3.1. TypeScript bundler and NodeNext fixtures pass.
- Production Next 15.5.29 Pages/App and Next 16.4.6 App pass SSR and desktop/mobile
  Chrome checks, including real CSV/XLSX/PDF downloads and the new controls.
- Desktop skeleton geometry is sampled across 2.2 seconds of animation and after
  data replacement. There is no extra horizontal overflow, scaling or change to
  header widths and row height in these fixtures. Animation changes opacity only;
  loading/data share colgroup widths and desktop reserves a scrollbar gutter.
- Library build/typecheck, package surface and Node SSR checks pass. The complete
  dist includes lazy export/font chunks and the bundled font's license.
- Demo build and desktop/mobile documentation checks pass: real logo/favicon,
  GIF, version routing, clipboard, search, light auto-size example, light Category/
  Brand controls and mobile filter reset. See documentation-verification.json.
- Independent openpyxl parsing verified the XLSX sample's text and numeric cells;
  rendered PDF samples were visually checked, including Persian text direction.
- A full root dependency audit reports zero vulnerabilities. Next fixture
  advisories are separate and are not dependencies shipped with the library.
- npm ci succeeds from the authoritative lockfile in an isolated workspace copy.
  Root reinstall initially encountered Windows dev-server native-file locks;
  npm install restored the root install without stopping the user's server.

Exact artifact integrity and combinations are in release-verification.json.
Screenshots and sample downloads are retained in ignored .release-tests folders.
This run does not verify Firefox, WebKit, React 16/17 or CommonJS consumers.
Publication, git push and release tags remain separate manual actions.
## Package rename verification: 2026-11-12

The npm package is now named `react-responsive-datatable-kit`, retaining version
3.0.0. Installation/import examples, demo npm links, the lockfile, test aliases
and packed consumer fixtures use the new name. GitHub repository and demo hosting
URLs retain their existing paths. The internal query cache namespace is unchanged.

The root 21-test suite, library build/typecheck, package surface/Node SSR check,
demo build and complete packed consumer matrix passed after the rename. Exact
React/Next versions and the new tarball integrity are in
`release-verification.json`. This run did not repeat the root security audit;
the security results below belong to the earlier preparation. Existing generated
dist changes were backed up in `.release-tests/pre-rename-dist/dist` before build.
No npm publish, git push or release tag was performed.

## Usability verification: 2026-11-12

- Page-size callbacks now follow restored URL values, host navigation and auto
  sizing without duplicate notifications. The original history state, hash and
  unrelated query parameters remain intact.
- Initial API sorting derives its request column from the configured field;
  explicit `columnNumber` overrides remain supported.
- `rowClassName` applies to desktop rows, mobile lists and swipe cards.
- Internal request failures show an accessible error message and retry action,
  including when no `notify` callback or host QueryClientProvider is supplied.
  `textsConfig.errorText` and `retryText` customize the labels.
- Quick-start and demo snippets include the required stylesheet import. The
  README explains common setup problems and the supported integration paths.

All 25 root regressions pass. The same 25 tests pass against the packed package
with React 18.0.0, 18.3.1, 19.0.0 and 19.3.1; TypeScript bundler and NodeNext
fixtures pass. Production Next 15.5.29 Pages/App and Next 16.4.6 App fixtures pass
SSR, desktop/mobile Chrome hydration, styles, retry recovery and row-class checks.
Library build, package surface/Node SSR and demo build pass. Full root and
production-only dependency audits report zero vulnerabilities; the refreshed root
summary is in `release-security.json`. Next fixture advisories are separate from
the root audit and are not dependencies shipped with the library.

The tarball integrity and exact combinations are in `release-verification.json`.
Firefox, WebKit, React 16/17 and CommonJS consumers are not verified by this run.
This work remains local; no publication, push or release tag was performed.
## Changes against the audit

| Findings | Implementation and verification |
| --- | --- |
| PKG-01/02/03 | Dedicated Rollup library build, Vite demo-dist, ESM metadata/NodeNext declarations, public exports, explicit CSS export, corrected version/metadata/license and authoritative npm lock |
| SSR-01/02 | Server-safe state, post-mount storage/portals, deterministic responsive initialization, preserved client banner; Node SSR + hydration in regressions and production Next |
| DEP-01 | Explicit matching React/DOM 18/19 peers and Query v5 peer; minimum/modern React installs and type fixtures |
| SEC-01 | Runtime dependencies patched; demo dependencies moved to development; final full root audit reports zero affected nodes |
| REACT-01/02 | No Hooks in cell loops or conditional modes; dynamic columns and mode-switch tests |
| QUERY-01/02/03 | Query-derived state, fresh-cache remounts, request identities without credentials in keys, AbortSignal, error notification and obsolete-response tests |
| API-01/02/03 | Optional/absolute URL handling, GET params vs POST data, deep-link preservation, filter reset only on actual changes |
| STATE-01/02/03 | Shared URL subscription including host history updates, atomic updates preserving hash/history metadata, custom size keys, positive integer validation and page clamping |
| STATIC-01 / SEARCH-01 | Single local data pipeline and single debounce, safe restored persistence, noSearch sorting and original-order restoration |
| SELECT-01 / ID-01 | Zero IDs, stable configurable row identity, identity-based scoped select-all, preservation of other pages' selection and indeterminate state |
| SORT-01 | Request indexes derived from request columns; sort state and keyboard header indicators share one source |
| SIZE-01 | Scoped DOM refs, valid fallbacks, configurable buffers, ResizeObserver fallback and row numbering derived from current page size |
| MOBILE-01 | Virtual slide indexes supplied; mobile list/cards exercised in hydration/browser tests |
| UI-01 / A11Y-01 | Non-submitting buttons, one semantic table, accessible controls, keyboard sorting/menu navigation, Escape, focus trap/restore and visible checkbox focus |
| STYLE-01 | Scoped extracted selectors/animations including portal roots, CSS sideEffects, no runtime CSS injection, standalone CSS and computed-style/browser screenshot checks |
| TYPES-01 | Export public types, optional defaults, typed auto-size options, rowKey/clear callback; React 18/19 bundler and NodeNext consumer compilation |
| QA-01 / DOC-01 / CLEANUP-01 | Regression suite, packed consumers, CI, current examples/migration/publish guide, unconditional listener cleanup and removal of library debug logging |

## Release checks

- Root React 18.2: 42 regression/file tests pass.
- Clean npm ci from package-lock.json succeeds; tests, library build, Node SSR/
  package-surface checks and demo production build pass in an isolated copy.
- The tarball matrix runs the same regressions with React 18.0, 18.3, 19.0 and
  current stable 19 plus their matching DOM/type packages.
- TypeScript fixtures compile with bundler and NodeNext module resolution.
- Production Next 15 Pages + React 18, Next 15 App + React 19 and Next 16 App +
  React 19 are built, served locally and checked in desktop/mobile Chromium.
- Browser checks cover hydration errors, real CSS, visible rows, responsive
  layout, page navigation, menu behavior, selection/checkbox pseudo-elements,
  RTL and function renderers inside a client wrapper. Screenshots are retained
  in the ignored .release-tests consumer directories for visual inspection.
- Full root advisory audit: zero vulnerabilities. Advisory reports for old
  versions under audit-evidence/ are retained as historical evidence.

## Intentional limits and migration

Version 3 is a major release: minimum React 18, ESM, explicit global CSS import,
preserved static input order until sorted and onClearFilters for host filter
reset. See CHANGELOG.md/README.md before upgrading.

Mobile has no new built-in sort header. Server modes require the documented API
contract. Stable IDs and unique URL/cache names are the host's responsibility.
This verifies the recorded browser/framework pairs, not all historic/future Next
versions or Firefox/WebKit. Browser tests used installed Chrome on Windows;
Linux CI is configured but was not executed locally. Fixture Next dependencies
may have their own advisories; they are not library dependencies and do not enter
the npm package. No exploitability assessment of consumers' applications is made.

A passing matrix reduces regression risk; it is not a proof that software has no
bugs. Changes after verification require rerunning the relevant release checks.
See PUBLISHING.md for the manual publication commands.
