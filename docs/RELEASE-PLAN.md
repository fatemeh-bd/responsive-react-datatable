# Stabilization plan before feature development

Historical plan from the 2026-11-04 audit. Stabilization has now been implemented;
consult RELEASE-STATUS.md and release-verification.json for current results. Finding IDs refer to COMPATIBILITY-AUDIT.md. This is not a claim that
compatibility changes have already been implemented.

Confirmed user scope: minimum React/React DOM 18. React 16/17 support is excluded.
Certify React 18 and 19 first; validate future majors before declaring support.

## 1. Restore a publishable library

Address PKG-01/02/03, STYLE-01 and SEC-01.

- Preserve the user's edits, stay on a deliberate development branch, and keep
  the release API compatible with main (including named exports).
- Separate library build/typecheck/declarations from the Vite documentation build.
  Use independent output directories so deploy cannot overwrite npm artifacts.
- Externalize React/React DOM and supported peer subpaths. Decide ESM/CJS policy;
  expose explicit CSS with CSS sideEffects and a preserved client entry boundary.
- Move demo-only runtime dependencies into the demo development graph.
- Upgrade affected dependency chains, testing Swiper's major-version changes;
  decide whether a simpler mobile renderer should replace it in a later release.
- Use npm lock as the documented authority unless the maintainer chooses Bun;
  synchronize manifest/lock versions after checking public npm tags.
- Add the actual MIT license and accurate package metadata.

Acceptance: clean checkout install/build, JS + types + CSS paths present inside
the tarball, no demo assets or bundled React, working public imports and documented
CSS in a consumer with no Tailwind. Review security findings by reachability.

## 2. Fix SSR, Hook ordering and request state

Address SSR-01/02, REACT-01/02, QUERY-01/02/03 and API-01/02/03.

- Deterministic SSR/initial client state; guarded portals and storage.
- Extract cells/internal controller where needed; add Hook-rule enforcement.
- Derive rows/loading/errors from query results, propagate cancellation, repair
  request identity and provider integration. Test fresh cached data and remounts.
- Normalize optional base URLs and GET params; avoid resetting initial deep links.
- Keep callbacks/column renderers inside a documented Next client boundary.

Acceptance: server render and hydrate desktop/mobile with no warnings; switch
modes and add/remove columns without Hook errors; cached/remounted tables and
out-of-order requests display the correct latest data.

## 3. Correct state and existing interactions

Address STATE-01/02/03, STATIC-01, SEARCH-01, SELECT-01, SORT-01, SIZE-01,
MOBILE-01, ID-01, UI-01, A11Y-01, TYPES-01 and CLEANUP-01.

- One predictable pipeline for local filter -> sort -> pagination.
- One debounced search callback; optional safe persistence.
- URL subscription/state changes that preserve hash/router metadata and unrelated
  params; independent multiple tables; validate/clamp page and page-size values.
- Consistent page reset callbacks for external mode; define prop control behavior.
- Explicit stable row IDs and selection scope, including ID 0 and indeterminate.
- Scoped sizing refs and positive fallbacks; correct row numbering after resize.
- Non-submitting controls, keyboard sorting/menu/dialogs and accessible labels.
- Complete public types, examples and backwards-compatibility notes.

Acceptance: integration tests cover the actual user triggers in each finding,
both languages/directions, both renderers and nested forms. Avoid tests that
merely reproduce implementation structure.

## 4. Certify the packed artifact and update docs

Address QA-01 and DOC-01. Add CI only after runnable local checks exist.

Proposed matrix (pin concrete mutually supported patch versions when implemented):

| Consumer | Versions / checks |
| --- | --- |
| Plain React | React/DOM 18.2, 18.3, stable 19; production render + StrictMode |
| TypeScript | React 18 and 19 type packages; bundler and NodeNext resolution |
| Vite consumer | Install tarball; optimized build; CSS visible without Tailwind |
| Next Pages Router | Representative maintained Next/React pair; SSR + navigation |
| Next App Router | Next 14/React 18 baseline plus Next 15/16 with supported React 19 pairs; production build + hydrate |
| Browser | Chromium, Firefox, WebKit; desktop/mobile; English/Persian/RTL |

Older Next versions in the matrix are compatibility regression fixtures, not a
recommendation to run unsupported/security-unpatched production versions. Do not
use unsupported Next/React combinations simply to fill a matrix cell.

Add package surface/type tests, client/server markup parity, callback counts,
URL/back-forward/multiple-instance cases, query cancellation/cache/errors and
selection identity cases. Use controlled local APIs for internal/external modes.
Do not use the public JSON demo to certify server pagination.

Release only after these gates pass, the compatibility table reflects actual
results, the README example compiles from installed public exports, and a
changelog describes migration impacts. Choose the release version from registry
history and actual breaking changes. Feature expansion follows stabilization.
