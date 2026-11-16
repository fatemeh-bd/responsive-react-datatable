import Table, { Table as Named, ActionDropDown, rowRenderer } from "react-responsive-datatable-kit";
import type { ColumnType, TableProps, ColorTheme, AutoPageSizeConfig, CustomBody, TextsConfig, ExportConfig, ExpandableRowsConfig, RowId } from "react-responsive-datatable-kit";
const columns: ColumnType[] = [{ data: "name", title: "Name", render: rowRenderer(cell => String(cell)) }];
const theme: ColorTheme = { primaryColor: "red" };
const size: AutoPageSizeConfig = { optionalSelectorsForExtraBuffer: [], extraBufferRows: 0 };
const body: CustomBody[] = [{ active: true }];
const textsConfig: TextsConfig = { errorText: "Could not load people", retryText: "Reload people" };
const props: TableProps = { mode: "static", staticRows: [], columns, colorTheme: theme, autoPageSizeConfig: size };
const ids: RowId[] = [0];
const exports: ExportConfig = { formats: ["csv", "xlsx", "pdf"], getRows: async context => [{ id: context.selectedIds[0], name: "Typed export" }] };
const expandable: ExpandableRowsConfig = { render: row => <p>{row.name}</p>, expandedRowIds: ids };
export const fixture = <><Table {...props} /><Named mode="internal" internalApiConfig={{ endpoint: "/api", customBody: body }} columns={columns} textsConfig={textsConfig} />
  <ActionDropDown options={[]} /><Table {...props} theme="#000" className="consumer-table" style={{ padding: 12 }}
    columnVisibility hiddenColumnIds={[]} onHiddenColumnsChange={() => {}} exportConfig={exports} expandableRows={expandable} /></>;

// Public configuration must offer completion and reject unsupported values.
import type { InternalApiConfig, InternalApiResponse, InternalApiPayload } from "react-responsive-datatable-kit";
const api: InternalApiConfig = {
  endpoint: "/api/people", method: "GET", sortType: "asc",
  headers: { Accept: "application/json" },
  customBody: [{ active: true, isFilter: true, noRefresh: false }],
  onFetch(response) {
    const total: number = response.recordsFiltered;
    const people: Record<string, unknown>[] | null = response.data;
    // @ts-expect-error Unknown server fields require narrowing.
    const extra: string = response.extra;
    void [total, people, extra];
  },
};
const response: InternalApiResponse<{ id: number }> = { data: [{ id: 1 }], recordsFiltered: 1 };
const payload: InternalApiPayload = { start: 0, length: 10, filters: { active: true } };
// @ts-expect-error endpoint is required.
const missingEndpoint: InternalApiConfig = { method: "GET" };
// @ts-expect-error Only GET and POST are implemented.
const invalidMethod: InternalApiConfig = { endpoint: "/api", method: "PUT" };
// @ts-expect-error Sort directions are constrained.
const invalidSort: InternalApiConfig = { endpoint: "/api", sortType: "ascending" };
// @ts-expect-error Metadata flags must be booleans.
const invalidFilter: InternalApiConfig = { endpoint: "/api", customBody: [{ isFilter: "yes" }] };
// @ts-expect-error payload must be an object of request fields.
const invalidPayload: InternalApiConfig = { endpoint: "/api", payload: "body" };
// @ts-expect-error Header values must be strings.
const invalidHeaders: InternalApiConfig = { endpoint: "/api", headers: { Accept: 42 } };
void [api, response, payload, missingEndpoint, invalidMethod, invalidSort, invalidFilter, invalidPayload, invalidHeaders];
