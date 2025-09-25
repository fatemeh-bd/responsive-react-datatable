# React Table Component

A reusable and responsive table component for React applications, designed to display data with advanced features like pagination, sorting, filtering, searching, and customizable modes.

## Features

- **Responsive Design**: Seamlessly adapts to mobile and desktop views using `useIsMobile` hook.
- **Pagination**: Customizable page sizes with automatic or manual navigation, supports query params for state management.
- **Search**: Real-time search with debouncing (400ms delay) and optional session storage persistence.
- **Sorting**: Column-based sorting with ascending/descending options, supports client-side sorting in static mode.
- **Selectable Rows**: Optional checkbox-based row selection with callbacks for changes.
- **Multiple Modes**:
  - **Internal Mode**: Fetches data from an API using TanStack Query, with customizable payloads, headers, and methods (default: POST).
  - **External Mode**: Uses externally provided data.
  - **Static Mode**: Uses static data with client-side pagination and sorting.
- **Auto Page Size**: Dynamically calculates page size based on container height, with configurable selectors for subtraction and buffers.
- **Customizable Themes**: Configurable colors for borders, headers, rows, pagination, and search box.
- **Multi-Language Support**: Built-in texts for English (`en`) and Persian (`fa`), with overrides via `textsConfig`.
- **Session Storage**: Persists search queries when `saveSearch` is enabled, using table-specific keys.
- **Column Reordering**: Optional support via `hasColumnOrder`.
- **Custom Filters and Actions**: Supports custom filters, top filters for mobile, and action buttons.
- **Loading States**: Handles loading with `isLoading` prop and TanStack Query's `isFetching`.
- **Notifications**: Optional error notifications via `notify` callback.

## Installation

```bash
npm i responsive-react-datatable
```

Ensure the following dependencies are installed:
- `react` (^18.0.0)
- `react-icons` (for icons like SearchIcon, CloseIcon)
- `@tanstack/react-query` (for internal mode API calls)
- `axios` (for HTTP requests in internal mode)
- Custom components: `Pagination`, `PageSizeSelect`, `MobileTable`, `DesktopTable`, `SelectableCheckbox`
- Utilities: `useIsMobile`, `useQueryParams`, `rowRenderer` (from `./helper`)

## Usage

### Basic Example (Internal Mode)

```jsx
import Table from "responsive-react-datatable";

const columns = [
  { data: "name", title: "نام", searchable: true, orderable: true },
  { data: "age", title: "سن", searchable: false, orderable: true },
];

const internalApiConfig = {
  endpoint: "/api/data",
  baseUrl: "https://example.com",
  method: "POST",
  tableName: "users",
  defaultSortBy: "id",
  sortType: "desc",
  customBody: [{ someFilter: "value" }],
  headers: { Authorization: "Bearer token" },
  onFetch: (data) => console.log("Fetched:", data),
};

<Table
  columns={columns}
  mode="internal"
  internalApiConfig={internalApiConfig}
  pageSize={10}
  lang="fa"
  isSelectable={true}
  selectedKey="id"
  onSelectChange={(selectedIds) => console.log(selectedIds)}
  notify={(message, type) => console.log(`${type}: ${message}`)}
/>;
```

### Static Mode Example

```jsx
const staticRows = [
  { id: 1, name: "علی", age: 30 },
  { id: 2, name: "مریم", age: 25 },
];

<Table
  columns={columns}
  mode="static"
  staticRows={staticRows}
  totalItems={staticRows.length}
  pageSize={5}
/>;
```

### External Mode Example

```jsx
const externalRows = [
  { id: 1, name: "علی", age: 30 },
];

<Table
  columns={columns}
  mode="external"
  externalRows={externalRows}
  totalItems={100}
  isLoading={false}
/>;
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `columns` | `ColumnType[]` | `[]` | Array of column definitions (e.g., `{ data: string, title: string, searchable?: boolean, orderable?: boolean, width?: number, render?: Function }`). |
| `mode` | `'internal' \| 'external' \| 'static'` | `'internal'` | Data fetching mode. |
| `internalApiConfig` | `Object` | - | Config for internal mode: `{ endpoint, baseUrl, method, tableName, defaultSortBy, sortType, customBody, headers, onFetch }`. |
| `staticRows` | `any[]` | `[]` | Static data rows (for static mode). |
| `totalItems` | `number` | `0` | Total number of items (for static/external modes). |
| `externalRows` | `any[]` | `[]` | External data rows (for external mode). |
| `pageSize` | `number` | `10` | Number of rows per page. |
| `pageQueryName` | `string` | `'page'` | Query param name for pagination. |
| `startMobileSize` | `number` | - | Breakpoint for mobile detection (e.g., 768). |
| `isSelectable` | `boolean` | `false` | Enable row selection with checkboxes. |
| `selectedKey` | `string` | `'id'` | Key for row selection IDs. |
| `onSelectChange` | `(selectedIds: any[]) => void` | - | Callback for selection changes. |
| `colorTheme` | `ColorTheme` | Default theme | Custom colors (e.g., `{ borderColor: string, headerBg: string, ... }`). |
| `textsConfig` | `Object` | Default texts | Override texts for pagination, search, etc. |
| `lang` | `'en' \| 'fa'` | `'en'` | Language for texts and direction (RTL for 'fa'). |
| `noSearch` | `boolean` | `false` | Disable search input. |
| `saveSearch` | `boolean` | `false` | Persist search in sessionStorage. |
| `hasColumnOrder` | `boolean` | `false` | Enable column reordering. |
| `notify` | `(message: string, type: 'error') => void` | - | Error notification callback. |
| `onPageChange` | `(page: number) => void` | - | Pagination change callback. |
| `onSortChange` | `(order: OrderType) => void` | - | Sorting change callback. |
| `onSearch` | `(search: string) => void` | - | Search change callback. |
| `isLoading` | `boolean` | `false` | Manual loading state (for external/static). |
| `autoPageSizeConfig` | `AutoPageSizeConfig` | Default config | Auto page size settings: `{ enabled, containerSelector, subtractSelectors, rowHeight, baseBufferRows, extraBufferRows }`. |
| `height` | `string` | Auto-calculated | Custom table height (e.g., '400px'). |
| `onPageSizeChange` | `(size: number) => void` | - | Page size change callback. |
| `listMode` | `boolean` | `false` | Mobile list view mode. |

### ColumnType Interface
```typescript
interface ColumnType {
  data: string;
  title: string;
  searchable?: boolean;
  orderable?: boolean;
  width?: number;
  render?: (cell: any, row: any, index?: number) => React.ReactNode;
}
```

### OrderType Interface
```typescript
interface OrderType {
  column: number;
  dir: 'asc' | 'desc';
  name: string;
}
```

## API Payload (Internal Mode)
In internal mode, the component sends a DataTables-compatible payload:
```json
{
  "draw": 1,
  "columns": [{ "data": "name", "name": "name", "searchable": true, "orderable": true, "search": { "value": "", "regex": false, "fixed": [] } }],
  "order": [{ "column": 0, "dir": "desc", "name": "id" }],
  "start": 0,
  "length": 10,
  "search": { "value": "query", "regex": false, "fixed": [] },
  // Custom body fields...
}
```
Response expected: `{ data: any[], recordsFiltered: number }`.

## Customization

### Auto Page Size
Enable dynamic sizing based on viewport:
```jsx
autoPageSizeConfig={{
  enabled: true,
  containerSelector: "#content-wrapper",
  subtractSelectors: ["#filters", "#paging"],
  rowHeight: 51.15,
  baseBufferRows: 2,
  extraBufferRows: 1,
}}
```

### Theme Override
```jsx
colorTheme={{
  primaryColor: "#your-color",
  headerBg: "#custom-bg",
}}
```

### Texts Override
```jsx
textsConfig={{
  searchPlaceholder: "جستجوی سفارشی...",
  noDataText: "داده‌ای یافت نشد",
}}
```

## Dependencies
- `react` (^18.0.0)
- `react-icons` (for icons)
- `@tanstack/react-query` (for internal mode)
- `axios` (for HTTP requests)
- Custom components: `Pagination`, `PageSizeSelect`, `MobileTable`, `DesktopTable`, `SelectableCheckbox`
- Utilities: `useIsMobile`, `useQueryParams`, `rowRenderer`

## Notes
- **Direction**: Automatically sets `dir="rtl"` for Persian (`fa`).
- **Debouncing**: Search updates after 400ms to optimize API calls.
- **Query Management**: Uses `URLSearchParams` for browser history and state persistence.
- **Error Handling**: Catches API errors and calls `notify` if provided.
- **Performance**: Memoized with `React.memo`; uses TanStack Query for caching in internal mode.
- **Mobile**: Switches to `MobileTable` below `startMobileSize`; supports `listMode` for card-like views.
- **Test Mode**: Removed in favor of `mode="static"`. Previously used `mockData.json` for testing.
