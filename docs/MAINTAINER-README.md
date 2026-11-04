# Maintainer quick start

Last audited: 2026-11-04. This is the short context entrypoint for humans and AI.

## Current state

| Area | main | dev / working tree at audit |
| --- | --- | --- |
| Commit | `1a6f205` | `7a71022` |
| Manifest version | `2.1.8` | `0.0.6` |
| Table implementation | Identical to dev | Identical to main |
| Build | Rollup library; isolated rebuild passed with warnings | Vite demo; library config missing |
| Public JS exports | default, Table, rowRenderer, ActionDropDown | default only |
| React peer dependencies | >=16.8 (inaccurate) | missing |
| SSR | fails on window | fails on window |
| Runtime dependency audit | 4 affected package nodes | 10 affected package nodes |

Remote commit IDs were checked with `git ls-remote`; they matched both local
branches. No branch switch, dependency update, publish, push, or runtime fix was
performed. Do not read `dist` or the entire git history to rediscover this context.

Read [the audit](COMPATIBILITY-AUDIT.md) for findings and
[the release plan](RELEASE-PLAN.md) for the next implementation steps.

## Architecture and behavior

The npm entrypoint is `src/index.ts`. It should expose Table as both the default
and a named export, the existing helper/dropdown, and documented types.
`Table.tsx` renders desktop tables or mobile Swiper cards and owns pagination,
sort/search state, selection wiring, automatic height calculation and filters.

Modes:

- `static`: receives all rows and performs local slicing/search/sort.
- `external`: host fetches rows and listens to callbacks.
- `internal`: table builds a DataTables-like payload and calls Axios via TanStack
  Query. Today it requires the host's QueryClientProvider, which the root README
  example omits. Query result data is currently ignored in favor of queryFn
  state mutations. This is an important stabilization target.

Shared state currently uses URL keys `page` (configurable) and `pageSize`
(hardcoded), plus optional `sessionStorage` search state by `tableName`.
Multiple instances do not have a shared URL subscription. Fixed DOM IDs also
make automatic sizing unsafe across multiple tables.

The demo uses React Router, Markdown, syntax highlighting, icons, OGL and
Tailwind; these are not core library requirements. Demo examples import source
files directly, so a working demo does not verify npm exports or package CSS.

## Safe local checks

Dependencies already existed during the audit; no install was performed.

```powershell
node node_modules/typescript/bin/tsc --noEmit --pretty false
node scripts/audit-compatibility.cjs
node node_modules/vite/bin/vite.js build --outDir .audit-demo-dist --emptyOutDir
npm.cmd pack --dry-run --json --ignore-scripts
npm.cmd audit --omit=dev --json --registry=https://registry.npmjs.org
```

Use an unused temporary output path for the demo command; never point it at a
directory with valuable files. Audit probes print observed errors and exit 0
when the probe run itself completed. They are not passing regression tests.
The probe strips CSS to isolate runtime failures, bundles Swiper from the
installed tree, and tests React 18.2 only. It also imports main's committed bundle
with the installed dependencies; it does not emulate main's historical install.

On this environment, Node entrypoint resolution required sandbox escalation to
read the parent workspace path. That is an environment limitation, not a library
bug. Public npm advisory queries worked after explicitly using the npm registry;
the configured mirror's audit endpoint failed. Do not change the user's registry
settings to work around that.

## Confirmed support requirement (2026-11-04)

The user confirmed React 18 and above as the target, with matching React DOM
versions. React 16/17 compatibility work is out of scope. Validate React 18 and
19 first, including compatible Next.js Pages/App consumers, SSR and hydration.
Future React majors need validation before being advertised as supported.
This is the agreed target, not a claim that the current package already passes.
Query v5 may remain; its cache, provider and request-state defects still need
fixing. Do not remove it solely for legacy React support.

Keep known-good exports and preserve behavior while building the release matrix.
Do not increment from dev's 0.0.6 blindly: inspect the published npm version/tags
first. The registry's published package itself was not downloaded in this audit.
