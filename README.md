# React Responsive DataTable Kit

A responsive data table for React 18 and 19, with desktop tables, mobile cards,
static or server data, search, sorting, pagination, selection and Persian/RTL.

[Live demo](https://fatemeh-bd.github.io/responsive-react-datatable/) ?
[Migration notes](https://github.com/fatemeh-bd/responsive-react-datatable/blob/main/CHANGELOG.md)

## Install

```sh
npm install react-responsive-datatable-kit @tanstack/react-query
```

React and React DOM must use matching supported versions (`^18.0.0 || ^19.0.0`).
TanStack Query v5 is a peer dependency; npm 7+ installs peers automatically, but
listing it in your app explicitly helps share a single QueryClient context.
This package is ESM. Future React major versions require separate verification.

Import the stylesheet once in your application entry:

```tsx
import "react-responsive-datatable-kit/styles.css";
```

Version 3 extracts and scopes CSS instead of injecting it into the document.
No Tailwind installation is required.

## Quick start: static rows

This example works in a React/Vite application without a QueryClientProvider or
Tailwind. Supply the complete rows array; filtering, sorting and pagination run
locally.

```tsx
import Table, { type ColumnType } from "react-responsive-datatable-kit";
import "react-responsive-datatable-kit/styles.css";

const columns: ColumnType[] = [
  { data: "name", title: "Name", searchable: true, orderable: true },
  { data: "age", title: "Age", orderable: true },
];
const rows = [{ id: 0, name: "Amy", age: 30 }, { id: 1, name: "Bob", age: 24 }];

export default function People() {
  return <Table mode="static" columns={columns} staticRows={rows} pageSize={10} />;
}
```

Static mode derives the count from the supplied rows. Input order is preserved
until sorted; the third sort click restores input order. Local search respects
`searchable: false`. Searching resets the page. Sorting works with `noSearch`.
The table prepends a row-number column, as in previous releases.

## Next.js

Import the stylesheet in `app/layout.tsx` (App Router) or `pages/_app.tsx` (Pages
Router). The published entry preserves `"use client"` and supports server
prerendering without disabling SSR.

Plain serializable columns/rows can be passed from a Server Component. When
columns use render functions or you pass event callbacks, define those in a
Client Component:

```tsx
"use client";
import Table, { rowRenderer, type ColumnType } from "react-responsive-datatable-kit";
const columns: ColumnType[] = [
  { data: "name", title: "Name" },
  { data: null, title: "Action", render: rowRenderer((_cell, row) =>
    <button type="button" onClick={() => alert(row.name)}>View</button>) },
];
export default function PeopleTable() {
  return <Table mode="static" columns={columns} staticRows={[{ id: 0, name: "Amy" }]} />;
}
```

See the repository's `docs/release-verification.json` for exact tested React/Next
versions. Only the pairs in that report have been verified; this is not a promise
of compatibility with every historical or future Next release.

## Internal API mode

```tsx
import Table from "react-responsive-datatable-kit";

<Table mode="internal" tableName="people" columns={columns}
  internalApiConfig={{
    endpoint: "/api/people",
    method: "POST",
    defaultSortBy: "id",
    sortType: "desc",
    customBody: [{ active: true, isFilter: true }],
  }}
  notify={(message, type) => console.log(type, message)}
/>;
```

The table uses a surrounding QueryClientProvider when present, otherwise a
private client. Requests are cancelled when obsolete. Query data/loading/errors
are derived from the active request, including fresh cached results.
Failed requests display an accessible error message and a **Try again** button,
even without `notify`. Customize these with `textsConfig.errorText` and
`textsConfig.retryText`; `notify` remains available for your own notifications.
GET sends query parameters; POST sends JSON data. `baseUrl` is optional, and
absolute endpoints are supported. Never pass private server credentials through
client props.

Request body/query parameters use a DataTables-like shape:

```ts
{
  draw: currentPage,
  columns: [{ data, name, searchable, orderable, search: { value: "", regex: false, fixed: [] } }],
  order: [{ column: 0, name: "id", dir: "desc" }],
  start: (currentPage - 1) * pageSize,
  length: pageSize,
  search: { value: searchText, regex: false, fixed: [] },
}
```

The server response must be an object with `data` (an array, or null to signal an
empty warning response) and `recordsFiltered` (the total count after filtering).
`onFetch` receives that response. `customBody` fields are merged into the request;
`noRefresh` and `isFilter` are metadata and are not sent. `noRefresh: true` means
changes to that item alone do not refetch. `payload` replaces the generated
payload when provided.

## External API mode

The host owns fetching and passes the loaded page, total count and loading flag:

```tsx
<Table mode="external" columns={columns} externalRows={rows} totalItems={total}
  isLoading={loading} onPageChange={setPage} onPageSizeChange={setPageSize}
  onSearch={setSearch} onSortChange={setOrder} />
```

Callbacks also notify the host when search/sizing resets the page or a deep-linked
page or page size is restored. `onPageSizeChange` also runs when the effective
size changes through browser navigation or automatic sizing; it fires once per
size change. Pass stable row IDs with `rowKey` when data does not use `id`.

## Public API

Default export and named `Table` refer to the same component. Also exported:
`rowRenderer`, `ActionDropDown`, and public table/configuration/selection types.

| Prop | Default / behavior |
| --- | --- |
| `mode` | Required: `static`, `external` or `internal` |
| `columns` | Required `ColumnType[]`; `data: null` for action cells |
| `staticRows` | All rows in static mode |
| `externalRows`, `totalItems` | Loaded page and server count in external mode |
| `internalApiConfig` | Required in internal mode |
| `pageSize` | 10; positive integer; prop updates are respected unless URL overrides it |
| `pageQueryName`, `pageSizeQueryName` | `page`, `pageSize`; use distinct names for independent tables |
| `tableName` | Optional; identifies query cache and saved search; use a stable unique name |
| `rowKey` | `id`; a field name or `(row) => string | number`; stable IDs are recommended |
| `isSelectable` | false; provide `selectedIds` and `onSelectChange` when enabled |
| `selectedKey` | `id`; supports string/number IDs, including zero |
| `onSelectChange` | Controlled selection callback; update your `selectedIds` state |
| `noSearch`, `noPageSize` | Hide the respective controls |
| `saveSearch` | false; optional sessionStorage persistence, requires `tableName` |
| `lang` | `en`; `fa` enables Persian labels and RTL |
| `textsConfig`, `colorTheme` | Override texts/colors; see exported types |
| `height` | Desktop maximum scroll height, e.g. `70vh` |
| `startMobileSize` | 768; mobile cards below this width |
| `listMode` | false; use a mobile list instead of swipe cards |
| `autoPageSizeConfig` | Disabled by default; containerSelector, rowHeight, subtractSelectors and row buffers |
| `columnNumber` | Optional override for the initial request sort index; otherwise derived from `defaultSortBy` |
| `rowClassName` | `(row) => string`; applied to desktop rows and mobile cards |
| `filters`, `topFilter`, `actionButtons` | Host-owned content slots |
| `onClearFilters` | Reset host-owned filters; clearing no longer reloads the app |
| `removeFilterKey` | Optional sessionStorage key removed when clearing filters |
| `notify`, `isLoading` | Request notifications / host loading state |
| `onPageChange`, `onPageSizeChange`, `onSearch`, `onSortChange` | Interaction callbacks |

Select-all includes all filtered static rows, or the loaded server page. It keeps
selected IDs outside that scope. Mobile sorting has no built-in header control;
server-side sorting can be provided by host-owned controls.

## Common setup issues

| Symptom | What to check |
| --- | --- |
| Table is unstyled | Import `react-responsive-datatable-kit/styles.css` once; in Next, use the root layout or `_app.tsx` |
| Next rejects function props | Put render functions and callbacks inside a component marked `"use client"` |
| Two tables change pages together | Give each table distinct `pageQueryName` and `pageSizeQueryName` values |
| Selection or state follows the wrong row | Use stable, unique IDs; configure `rowKey` and `selectedKey` for your data |
| API mode cannot show results | Return `{ data: [...], recordsFiltered: total }`; external mode expects the loaded page and the filtered total separately |

## Development and release

Use Node 20.19+ and npm 10+. The npm lockfile is authoritative.

```sh
npm ci
npm test
npm run build
npm run test:package
npm run test:release
npm run build:demo
```

Library output is `dist/`; demo output is `demo-dist/`. `npm run deploy` deploys
only the demo. The release matrix installs the actual tarball into isolated
React/Next consumers and uses Playwright Chromium (or `RELEASE_CHROME_PATH`).
For Windows PowerShell, use `npm.cmd` if execution policy blocks `npm.ps1`.

Maintainers/AI: start with [AGENTS.md](https://github.com/fatemeh-bd/responsive-react-datatable/blob/main/AGENTS.md)
and `docs/MAINTAINER-README.md`. The original audit is historical; consult the
release verification and changelog for the stabilized version.

MIT License.
