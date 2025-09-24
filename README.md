# React Table Component

A reusable and responsive table component for React applications, designed to display data with features like pagination, sorting, filtering, and searching.

## Features

- **Responsive Design**: Adapts to mobile and desktop views.
- **Pagination**: Supports customizable page sizes and navigation.
- **Search**: Real-time search with debouncing.
- **Sorting**: Column-based sorting with ascending/descending options.
- **Filtering**: Custom filters with a modal for mobile devices.
- **Selectable Rows**: Optional checkbox selection for rows.
- **Test Mode**: Uses mock data for testing without API calls.
- **Customizable**: Configurable columns, table height, and action buttons.

## Installation

```bash
npm i responsive-react-datatable
```

Ensure dependencies like `react-icons` and custom components (`Pagination`, `ResponsiveTable`, `PageSizeSelect`, `Modal`, `MainButton`, `Checkbox`, `Input`) are installed.

## Usage

```jsx
import Table from "responsive-react-datatable";

const columns = [
  { data: "name", title: "نام", searchable: true, orderable: true },
  { data: "age", title: "سن", searchable: false, orderable: true },
];

<Table
  columns={columns}
  endpoint="/api/data"
  baseUrl="https://example.com"
  pageSize={10}
  searchPlaceholder="جستجو کنید ..."
  isSelectable={true}
  selectedKey="id"
  onSelectChange={(selectedIds) => console.log(selectedIds)}
/>;
```

## Props

- `columns`: Array of column definitions (`ColumnType[]`).
- `endpoint`: API endpoint for fetching data.
- `baseUrl`: Base URL for API requests (default: `"BASE_URL"`).
- `pageSize`: Number of rows per page (default: `10`).
- `noSearch`: Disable search input (default: `false`).
- `searchPlaceholder`: Placeholder text for search input.
- `isSelectable`: Enable row selection with checkboxes (default: `false`).
- `selectedKey`: Key for row selection (default: `"id"`).
- `onSelectChange`: Callback for handling row selection changes.
- `isTestMode`: Enable test mode with mock data (default: `false`).
- `tableConfig`: Additional table configuration (default: `{}`).
- `filters`: Custom filter components.
- `topFilter`: Top filter components for mobile view.
- `title`: Table title for mobile view.
- `actionButtonsLeft`: Custom action buttons on the left.
- `saveSearch`: Save search query in sessionStorage (default: `false`).
- `tableName`: Name for saving search queries (default: `"table"`).
- `defaultSortBy`: Default column for sorting (default: `"id"`).
- `sortType`: Default sort direction (`"asc"` or `"desc"`, default: `"desc"`).
- `height`: Custom table height.
- `removeFilterKey`: Key for clearing filters in sessionStorage.
- `hasColumnOrder`: Enable column reordering (default: `false`).

## Dependencies

- React
- react-icons
- Custom components: `Pagination`, `ResponsiveTable`, `PageSizeSelect`, `Modal`, `MainButton`, `Checkbox`, `Input`
- Utility: `postMethod`, `numberWithCommas`, `useIsMobile`

## Notes

- The component uses `URLSearchParams` for managing pagination and search states.
- In `isTestMode`, data is filtered from `mockData.json` without API calls.
- Search queries are debounced (400ms) to optimize performance.
- Session storage is used to persist search queries when `saveSearch` is enabled.
