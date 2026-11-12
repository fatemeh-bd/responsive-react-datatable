# Changelog

## 3.0.0

### Migration

- Minimum React/React DOM is now 18; React 18 and 19 are the supported majors.
- Import `react-responsive-datatable-kit/styles.css` once in the application's global
  entry or Next root layout. Styles are scoped and extracted instead of injected.
- Internal mode works with the host's TanStack Query v5 provider, or a private
  client when no provider is present. Query v5 is an explicit peer dependency.
- Static rows preserve input order until a sort is selected. Clearing sort
  restores that order; search works independently of the search control.
- Select-all targets filtered static rows or the loaded server page and preserves
  selected IDs outside that scope. Numeric ID zero is supported.
- Filter clearing no longer reloads the page or removes unrelated URL parameters.
  Use `onClearFilters` to reset host-owned filters.
- Use `pageQueryName` and `pageSizeQueryName` for independent URL state per table.
- Node 20.19+ and npm 10+ are required for the development/release toolchain.

### Fixes

- Synchronize page-size callbacks with deep links, host navigation and automatic sizing.
- Derive the initial API sort index from its field unless explicitly overridden.
- Apply custom row classes to mobile cards as well as desktop rows.
- Show an accessible API error state with a retry button without requiring notify.
- Restore named exports and public types; separate demo and library builds.
- Preserve Next client boundary; guard server render, storage and portals.
- Correct Hook ordering for dynamic columns and mode changes.
- Repair internal request URLs, GET parameters, request cancellation, query
  identities, fresh-cache rendering and error propagation.
- Consolidate search debounce and local data transformations; validate pagination.
- Improve row identity, scoped sizing, keyboard controls and dialog focus behavior.
- Update vulnerable dependencies; include license and release verification tools.
