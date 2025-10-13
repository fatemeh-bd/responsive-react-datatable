import { useEffect, useRef, useState } from "react";
import { ColorTheme, ColumnType, OrderType, TextsConfig } from "./types";
import { ArrowDownIcon, ArrowUpIcon } from "./icons";
import Checkbox from "./tools/checkbox/CheckBox";
import Skeleton from "./tools/Skeleton";

const DesktopTable = ({
  columns,
  isLoading,
  maxHeight,
  pageSize,
  rows,
  theme,
  textsConfig,
  onAllSelect,
  onOrderChange,
  rowHeight,
  isAllSelected = false,
  rowClassName,
}: {
  columns: ColumnType[];
  isLoading?: boolean;
  maxHeight?: string;
  pageSize: number;
  rows: Record<string, any>[];
  theme: ColorTheme;
  textsConfig: TextsConfig;
  onAllSelect?: (checked?: boolean) => void;
  onOrderChange?: (order: OrderType) => void;
  rowHeight?: string;
  isAllSelected?: boolean;
  rowClassName?: string;
}) => {
  const [order, setOrder] = useState<OrderType>(null);
  const [allSelected, setAllSelected] = useState(isAllSelected);
  const headerContainerRef = useRef<HTMLDivElement>(null);
  const bodyContainerRef = useRef<HTMLDivElement>(null);
  const handleSort = (colIndex: number, column: ColumnType) => {
    if (!column.orderable || !column.data) return;

    setOrder((prev) => {
      let newOrder: OrderType;
      if (!prev || prev.column !== colIndex) {
        newOrder = { column: colIndex, dir: "desc", name: column.data! };
      } else if (prev.dir === "desc") {
        newOrder = { column: colIndex, dir: "asc", name: column.data! };
      } else {
        newOrder = null;
      }
      onOrderChange?.(newOrder);
      return newOrder;
    });
  };
  useEffect(() => {
    if (isAllSelected) {
      setAllSelected(true);
    }
  }, [isAllSelected]);
  useEffect(() => {
    const bodyContainer = bodyContainerRef.current;
    const headerContainer = headerContainerRef.current;

    if (!bodyContainer || !headerContainer) return;

    const handleScroll = () => {
      headerContainer.scrollLeft = bodyContainer.scrollLeft;
    };

    bodyContainer.addEventListener("scroll", handleScroll);

    return () => {
      bodyContainer.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className="desktop-table-container"
      style={{ border: `1px solid ${theme.borderColor}` }}
    >
      <div className="desktop-table-inner">
        {/* Header table (fixed) */}
        <div
          ref={headerContainerRef}
          className="desktop-table-header-container scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <table className="desktop-table">
            <thead
              className="desktop-table-head"
              style={{ backgroundColor: theme.headerBackgroundColor }}
            >
              <tr
                className="desktop-table-header-row"
                style={{
                  height: rowHeight,
                }}
              >
                {columns.map((column, colIndex) => (
                  <th
                    key={column?.data || colIndex}
                    className={`desktop-table-header-cell ${
                      column?.orderable
                        ? "desktop-table-header-cell--sortable cursorPointer"
                        : ""
                    }`}
                    style={{
                      width: column?.width,
                      color: theme.headerTextColor,
                      borderBottom: `1px solid ${theme.borderColor}`,
                    }}
                    onClick={() =>
                      column?.orderable && handleSort(colIndex, column)
                    }
                  >
                    {column?.data === "selectableTable" ? (
                      <Checkbox
                        className="desktop-table-select-all-checkbox"
                        primaryColor={theme.primaryColor}
                        onChange={(value) => {
                          setAllSelected(value?.target.checked);
                          onAllSelect?.(value?.target.checked);
                        }}
                        checked={allSelected}
                      />
                    ) : (
                      <div
                        className="desktop-table-header-content"
                        title={column?.width ? column?.title : ""}
                      >
                        {column?.orderable && (
                          <span className="desktop-table-sort-icons">
                            <ArrowUpIcon
                              style={{
                                color:
                                  order?.dir === "asc"
                                    ? theme?.headerTextColor
                                    : "",
                              }}
                              className={`desktop-table-sort-icon desktop-table-sort-icon--asc ${
                                order?.column === colIndex &&
                                order?.dir === "asc"
                                  ? "opacityFull"
                                  : "opacityHalf"
                              }`}
                            />
                            <ArrowDownIcon
                              style={{
                                color:
                                  order?.dir === "desc"
                                    ? theme?.headerTextColor
                                    : "",
                              }}
                              className={`desktop-table-sort-icon desktop-table-sort-icon--desc ${
                                order?.column === colIndex &&
                                order?.dir === "desc"
                                  ? "opacityFull"
                                  : "opacityHalf"
                              }`}
                            />
                          </span>
                        )}
                        <span className="desktop-table-header-title">
                          {column?.title}
                        </span>
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
          </table>
        </div>

        {/* Scrollable body */}
        <div
          ref={bodyContainerRef}
          className="desktop-table-body-container"
          style={{ maxHeight }}
        >
          <table className="desktop-table-body">
            <tbody className="desktop-table-body-inner">
              {isLoading ? (
                Array.from({ length: pageSize }).map((_, i) => (
                  <tr key={i} className="desktop-table-skeleton-row">
                    {columns.map((_, colIndex) => (
                      <td
                        key={colIndex}
                        className="desktop-table-skeleton-cell"
                      >
                        <Skeleton className="desktop-table-skeleton" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : rows?.length > 0 ? (
                rows.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className={`desktop-table-data-row ${rowClassName}`}
                    style={{
                      borderBottom: `1px solid ${theme.borderColor}`,
                      backgroundColor: theme.backgroundColor,
                      height: rowHeight,
                    }}
                  >
                    {columns.map((column, colIndex) => {
                      const cellKey = column.data;
                      const content = column?.render
                        ? column?.render(
                            cellKey ? row[cellKey] : undefined,
                            row,
                            rowIndex
                          )
                        : cellKey
                        ? row[cellKey]
                        : null;

                      return (
                        <td
                          key={colIndex}
                          className="desktop-table-data-cell"
                          style={{
                            width: column?.width,
                            color: theme.cellTextColor,
                          }}
                        >
                          <div
                            title={
                              cellKey ? row[cellKey]?.toString() : undefined
                            }
                            className={`desktop-table-cell-content ${
                              cellKey === null ? "isContent" : "noContent"
                            }`}
                          >
                            {content}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))
              ) : (
                <tr className="desktop-table-empty-row">
                  <td
                    colSpan={columns.length}
                    className="desktop-table-empty-cell"
                    style={{ color: theme.headerTextColor }}
                  >
                    {textsConfig.noDataText}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DesktopTable;
