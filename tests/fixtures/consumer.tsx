import Table, { Table as Named, ActionDropDown, rowRenderer } from "react-responsive-datatable-kit";
import type { ColumnType, TableProps, ColorTheme, AutoPageSizeConfig, CustomBody, TextsConfig } from "react-responsive-datatable-kit";
const columns: ColumnType[] = [{ data: "name", title: "Name", render: rowRenderer(cell => String(cell)) }];
const theme: ColorTheme = { primaryColor: "red" };
const size: AutoPageSizeConfig = { optionalSelectorsForExtraBuffer: [], extraBufferRows: 0 };
const body: CustomBody[] = [{ active: true }];
const textsConfig: TextsConfig = { errorText: "Could not load people", retryText: "Reload people" };
const props: TableProps = { mode: "static", staticRows: [], columns, colorTheme: theme, autoPageSizeConfig: size };
export const fixture = <><Table {...props} /><Named mode="internal" internalApiConfig={{ endpoint: "/api", customBody: body }} columns={columns} textsConfig={textsConfig} />
  <ActionDropDown options={[]} /></>;
