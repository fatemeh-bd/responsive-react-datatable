# 📊 Responsive React DataTable

![npm](https://img.shields.io/npm/dm/responsive-react-datatable)  
![npm version](https://img.shields.io/npm/v/responsive-react-datatable)  
![license](https://img.shields.io/npm/l/responsive-react-datatable)

A modern, flexible, and high-performance table component for React applications.

---

## 🌐 Demo

Try it out here:  
🔗 [Responsive React DataTable Demo](https://fatemeh-bd.github.io/responsive-react-datatable/#/example)

---

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

### Dependencies

Ensure the following dependencies are installed:

```bash
npm install @tanstack/react-query axios swiper
```

## Usage

### Internal Mode

```jsx
import Table from "responsive-react-datatable";

const columns = [
  { data: "name", title: "Name", searchable: true, orderable: true },
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
