# 📊 Responsive React DataTable

A modern, flexible, and high-performance table component for React applications.

## Features

- Responsive design for desktop and mobile.
- Multiple data modes: Internal, External, Static.
- Pagination, search, sorting, selection, and column reordering.
- Auto page size calculation.
- Customizable themes.
- Multi-language support (English, Persian, RTL).
- Notifications via callback.

## Installation

```bash
npm install responsive-react-datatable
```

## Usage

### Internal Mode

````jsx
import Table from "responsive-react-datatable";

const columns = [
  { data: "name", title: "Name", searchable: true, orderable: true },
];

const internalApiConfig = {
  endpoint: "/api/users",
  baseUrl: "https://example.com",
  method: "POST",
  defaultSortBy: "id",
  sortType: "desc",
};

<Table
  columns={columns}
  mode="internal"
  internalApiConfig={internalApiConfig}
  pageSize={10}
  lang="en"
/>;
## Note on Internal Mode Payload

In **Internal Mode**, the table generates a default payload for server requests, inspired by [DataTables.net](https://datatables.net/) structure:

```typescript
let payload: Record<string, any> = {
  draw: currentPage,
  columns: makeCurrentCols,
  order: order || [],
  start: (currentPage - 1) * dynamicPageSize,
  length: dynamicPageSize,
  search: { value: searchText || "", regex: false, fixed: [] },
};

````

### Static Mode

```jsx
const staticRows = [{ id: 1, name: "Ali", age: 30 }];

<Table
  columns={columns}
  mode="static"
  staticRows={staticRows}
  totalItems={staticRows.length}
  pageSize={5}
/>;
```

## Props

| Prop               | Type                                 | Default    | Description              |
| ------------------ | ------------------------------------ | ---------- | ------------------------ |
| columns            | ColumnType[]                         | []         | Column definitions       |
| mode               | 'internal' \| 'external' \| 'static' | 'internal' | Table mode               |
| internalApiConfig  | object                               | —          | Internal API config      |
| staticRows         | any[]                                | []         | Static rows              |
| externalRows       | any[]                                | []         | External rows            |
| totalItems         | number                               | 0          | Total row count          |
| pageSize           | number                               | 10         | Rows per page            |
| isSelectable       | boolean                              | false      | Enable row selection     |
| selectedKey        | string                               | 'id'       | Key for selected rows    |
| colorTheme         | ColorTheme                           | Default    | Custom theme colors      |
| textsConfig        | object                               | Default    | Override table texts     |
| lang               | 'en' \| 'fa'                         | 'en'       | Language                 |
| noSearch           | boolean                              | false      | Disable search           |
| saveSearch         | boolean                              | false      | Persist search           |
| hasColumnOrder     | boolean                              | false      | Enable column reordering |
| notify             | function                             | —          | Notifications            |
| isLoading          | boolean                              | false      | Loading state            |
| autoPageSizeConfig | AutoPageSizeConfig                   | Default    | Auto page size settings  |
| height             | string                               | Auto       | Table height             |
| onPageChange       | function                             | —          | Page change callback     |
| onSortChange       | function                             | —          | Sort change callback     |
| onSearch           | function                             | —          | Search callback          |
