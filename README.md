# 📊 Responsive React DataTable

[Click Here To Show Demo](https://fatemeh-bd.github.io/responsive-react-datatable/#/)

![npm](https://img.shields.io/npm/dm/responsive-react-datatable) ![npm version](https://img.shields.io/npm/v/responsive-react-datatable) ![license](https://img.shields.io/npm/l/responsive-react-datatable)

A modern, flexible, and high-performance table component for React applications.

---

## Features

- Responsive design for desktop and mobile.
- Multiple data modes: Internal, External, Static.
- Pagination, search, sorting, selection, and column reordering.
- Auto page size calculation.
- Customizable themes.
- Multi-language support (English, Persian, RTL).

## Installation

```bash
npm install responsive-react-datatable
```

### Dependencies

Ensure the following dependencies are installed:

```bash
npm install @tanstack/react-query axios swiper
```

## Usage

### Internal Mode

```jsx
import Table, { ColumnType } from "responsive-react-datatable";
const columns: ColumnType[] = [
  {
    data: "avatar",
    title: "Profile",
    searchable: false,
    orderable: false,
    width: 80,
    render: rowRenderer((_cell, _row) => (
      <img src={_cell} alt={_row?.profileAlt} />
    )),
  },
  {
    data: "name",
    title: "Name",
    searchable: true,
    orderable: true,
    width: 150,
  },
  // if it is an operation column, it must be null.
  {
    data: null,
    orderable: false,
    title: "Operation",
    searchable: false,
    width: 140,
    render: rowRenderer(() => <button>details</button>),
  },
];
const internalApiConfig = {
  endpoint: "/api/data",
  baseUrl: "https://example.com",
  method: "POST",
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
  lang="en"
  notify={(message, type) => console.log(`${type}: ${message}`)}
/>;
```

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
```

### Static Mode

```jsx
const staticRows = [{ id: 1, name: "max", age: 30 }];

<Table
  columns={columns}
  mode="static"
  staticRows={staticRows}
  totalItems={staticRows.length}
  pageSize={5}
/>;
```

## Props

| Prop               | Type                                          | Default | Description                                                           |
| ------------------ | --------------------------------------------- | ------- | --------------------------------------------------------------------- |
| columns            | ColumnType[]                                  | []      | Column definitions                                                    |
| mode               | `'internal' \| 'external' \| 'static'`        | -       | Table mode                                                            |
| internalApiConfig  | object                                        | —       | Internal API config                                                   |
| staticRows         | any[]                                         | []      | Static rows                                                           |
| externalRows       | any[]                                         | []      | External rows                                                         |
| totalItems         | number                                        | 0       | Total row count                                                       |
| pageSize           | number                                        | 10      | Rows per page                                                         |
| isSelectable       | boolean                                       | false   | Enable row selection                                                  |
| selectedKey        | string                                        | 'id'    | Key for selected rows                                                 |
| onSelectChange     | (selectedIds: any[]) => void                  | -       | Callback for selection                                                |
| pageQueryName      | string                                        | 'page'  | Query param name for pagination.                                      |
| startMobileSize    | number                                        | 768     | Breakpoint for mobile detection (e.g., 768).                          |
| colorTheme         | ColorTheme                                    | Default | Custom theme colors                                                   |
| textsConfig        | object                                        | Default | Override table texts                                                  |
| lang               | `'en' \| 'fa'`                                | 'en'    | Language                                                              |
| noSearch           | boolean                                       | false   | don't show search box                                                 |
| saveSearch         | boolean                                       | false   | save search value in sessionStorage                                   |
| hasColumnOrder     | boolean                                       | false   | Enable column reordering ( column: hasColumnOrder ? 8 : 0)            |
| notify             | (text:string,type:"warning" \| "error")=>void | —       | return error message after calling api in "internal" mode             |
| isLoading          | boolean                                       | false   | Loading state                                                         |
| autoPageSizeConfig | AutoPageSizeConfig                            | Default | Auto page size settings (Show number of rows relative to page height) |
| height             | string                                        | Auto    | Table max-height (example:"80vh")                                     |
| onPageChange       | function                                      | —       | Page change callback                                                  |
| onSortChange       | function                                      | —       | Sort change callback                                                  |
| onSearch           | function                                      | —       | Search callback                                                       |
| onPageSizeChange   | `(size: number) => void`                      | -       | Page size change callback                                             |
| listMode           | boolean                                       | false   | Mobile list view mode                                                 |
