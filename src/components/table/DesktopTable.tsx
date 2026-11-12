import { Fragment, memo, useId } from "react";
import type { ColorTheme, ColumnType, OrderType, TextsConfig } from "./types";
import { ArrowDownIcon, ArrowUpIcon } from "./icons";
import { rowIdentity } from "./data";
import Checkbox from "./tools/checkbox/CheckBox";
import Skeleton from "./tools/Skeleton";
import { RowDetailsButton, type RowExpansion } from "./RowDetails";
interface Props {
  columns: ColumnType[]; rows: any[]; pageSize: number; theme: ColorTheme; textsConfig: TextsConfig;
  isLoading?: boolean; maxHeight?: string; rowHeight?: string; isAllSelected?: boolean; isIndeterminate?: boolean;
  onAllSelect?: (checked?: boolean) => void; onOrderChange?: (order: OrderType) => void;
  rowClassName?: (row: any) => string | undefined | void;
  rowKey?: string | ((row: any) => string | number); order?: OrderType;
  expansion?: RowExpansion;
}
function DesktopRow({ row, index, columns, theme, rowHeight, rowClassName, expansion }: {
  row: any; index: number; columns: ColumnType[]; theme: ColorTheme; rowHeight?: string;
  rowClassName?: Props["rowClassName"]; expansion?: RowExpansion;
}) {
  const panelId = useId();
  const expanded = !!expansion?.isExpanded(row);
  return <Fragment><tr className={`desktop-table-data-row ${rowClassName?.(row) || ""}`}
    style={{ borderBottom: `1px solid ${theme.borderColor}`, backgroundColor: theme.backgroundColor, height: rowHeight }}>
    {expansion && <td className="table-expand-cell">{expansion.canExpand(row) && <RowDetailsButton expanded={expanded}
      panelId={panelId} label={expanded ? expansion.collapseText : expansion.expandText} onToggle={() => expansion.toggle(row)} />}</td>}
    {columns.map((column, colIndex) => <td key={`${column.data}:${colIndex}`} className="desktop-table-data-cell" style={{ width: column.width, color: theme.cellTextColor }}>
      <div className={`desktop-table-cell-content ${column.data === null ? "isContent" : "noContent"}`} title={column.data ? row[column.data]?.toString() : undefined}>
        {column.render ? column.render(column.data ? row[column.data] : undefined, row, index) : column.data ? row[column.data] : null}
      </div>
    </td>)}
  </tr>{expanded && expansion?.canExpand(row) && <tr className="table-details-row"><td colSpan={columns.length + 1}
    style={{ backgroundColor: theme.backgroundColor, color: theme.cellTextColor }}>
    <div id={panelId} role="region" aria-label={expansion.detailsText} className="table-row-details">{expansion.render(row, index)}</div>
  </td></tr>}</Fragment>;
}
function DesktopTable({ columns, rows, pageSize, theme, textsConfig, isLoading, maxHeight, rowHeight,
  isAllSelected = false, isIndeterminate, onAllSelect, onOrderChange, rowClassName, rowKey, order, expansion }: Props) {
  const sort = (column: ColumnType, index: number) => {
    if (!column.orderable || !column.data) return;
    onOrderChange?.(!order || order.name !== column.data ? { column: index, name: column.data, dir: "desc" } :
      order.dir === "desc" ? { ...order, dir: "asc" } : null);
  };
  return <div className="desktop-table-container" style={{ border: `1px solid ${theme.borderColor}` }}>
    <div className="desktop-table-body-container" style={{ maxHeight, overflow: "auto" }}>
      <table className="desktop-table desktop-table-body" aria-label="Data table">
        <colgroup>
          {expansion && <col style={{ width: 48 }} />}
          {columns.map((column, index) => <col key={`${column.data}:${index}`} style={{ width: column.width }} />)}
        </colgroup>
        <thead className="desktop-table-head" style={{ backgroundColor: theme.headerBackgroundColor, position: "sticky", top: 0, zIndex: 1 }}>
          <tr className="desktop-table-header-row" style={{ height: rowHeight }}>
            {expansion && <th scope="col" className="table-expand-cell"><span className="rrdt-sr-only">{expansion.detailsText}</span></th>}
            {columns.map((column, index) => <th key={`${column.data}:${index}`} scope="col"
              className="desktop-table-header-cell" style={{ width: column.width, color: theme.headerTextColor, borderBottom: `1px solid ${theme.borderColor}` }}
              aria-sort={column.orderable ? order?.name === column.data ? order.dir === "asc" ? "ascending" : "descending" : "none" : undefined}>
              {column.data === "selectableTable" ? <Checkbox checked={isAllSelected} indeterminate={isIndeterminate}
                ariaLabel="Select all rows" primaryColor={theme.primaryColor} primaryTextColor={theme.primaryTextColor} onChange={event => onAllSelect?.(event.target.checked)} /> :
                column.orderable ? <button type="button" className="desktop-table-header-content" onClick={() => sort(column, index)}>
                  <span className="desktop-table-sort-icons" aria-hidden="true">
                    <ArrowUpIcon className={order?.name === column.data && order.dir === "asc" ? "opacityFull" : "opacityHalf"} />
                    <ArrowDownIcon className={order?.name === column.data && order.dir === "desc" ? "opacityFull" : "opacityHalf"} />
                  </span><span className="desktop-table-header-title">{column.title}</span>
                </button> : <span className="desktop-table-header-title">{column.title}</span>}
            </th>)}
          </tr>
        </thead>
        <tbody className="desktop-table-body-inner">
          {isLoading ? Array.from({ length: pageSize }, (_, index) => <tr key={index} className="desktop-table-skeleton-row" aria-hidden="true"
            style={{ height: rowHeight, backgroundColor: theme.backgroundColor }}>
            {Array.from({ length: columns.length + (expansion ? 1 : 0) }, (_, colIndex) => <td key={colIndex} className="desktop-table-data-cell desktop-table-skeleton-cell"><Skeleton height={`calc(${rowHeight || "51.15px"} - 16px)`} className="desktop-table-skeleton" /></td>)}
          </tr>) : rows.length ? rows.map((row, index) => <DesktopRow key={rowIdentity(row, index, rowKey)} row={row} index={index}
            columns={columns} theme={theme} rowHeight={rowHeight} rowClassName={rowClassName} expansion={expansion} />)
          : <tr className="desktop-table-empty-row"><td colSpan={columns.length + (expansion ? 1 : 0)} className="desktop-table-empty-cell" style={{ color: theme.headerTextColor }}>{textsConfig.noDataText}</td></tr>}
        </tbody>
      </table>
    </div>
  </div>;
}
export default memo(DesktopTable);
