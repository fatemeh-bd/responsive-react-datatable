import { useEffect, useRef, useState } from "react";
import { ColorTheme, ColumnType, OrderType, TextsConfig } from "./types";
import { ArrowUpIcon } from "./icons";
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
}: {
  columns: ColumnType[];
  isLoading?: boolean;
  maxHeight?: string;
  pageSize: number;
  rows: Record<string, any>[];
  theme: ColorTheme;
  textsConfig: TextsConfig;
  onAllSelect?: () => void;
  onOrderChange?: (order: OrderType) => void;
  rowHeight?: string;
}) => {
  const [order, setOrder] = useState<OrderType>(null);

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
      className="desktop-table-container w-full overflow-hidden rounded-xl"
      style={{ border: `1px solid ${theme.borderColor}` }}
    >
      <div className="desktop-table-inner relative">
        {/* Header table (fixed) */}
        <div
          ref={headerContainerRef}
          className="desktop-table-header-container overflow-x-auto overflow-y-hidden scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <table className="desktop-table w-full table-fixed border-collapse">
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
                        ? "desktop-table-header-cell--sortable cursor-pointer"
                        : ""
                    } py-2 px-1 text-center min-w-max text-sm`}
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
                        className="desktop-table-select-all-checkbox mx-auto justify-center"
                        primaryColor={theme.primaryColor}
                        onChange={() => onAllSelect?.()}
                      />
                    ) : (
                      <div
                        className="desktop-table-header-content truncate mx-auto m-auto text-center line-clamp-1 flex items-center justify-center gap-1"
                        title={column?.width ? column?.title : ""}
                      >
                        {column?.orderable && (
                          <span className="desktop-table-sort-icons flex flex-col items-center">
                            <ArrowUpIcon
                              style={{
                                color:
                                  order?.dir === "asc"
                                    ? theme?.headerTextColor
                                    : "",
                              }}
                              className={`desktop-table-sort-icon desktop-table-sort-icon--asc h-2 translate-y-[1px] ${
                                order?.column === colIndex &&
                                order?.dir === "asc"
                                  ? "opacity-100"
                                  : "opacity-20"
                              }`}
                            />
                            <ArrowUpIcon
                              style={{
                                color:
                                  order?.dir === "desc"
                                    ? theme?.headerTextColor
                                    : "",
                              }}
                              className={`desktop-table-sort-icon desktop-table-sort-icon--desc h-2 rotate-180 ${
                                order?.column === colIndex &&
                                order?.dir === "desc"
                                  ? "opacity-100"
                                  : "opacity-20"
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
          className="desktop-table-body-container overflow-auto w-full"
          style={{ maxHeight }}
        >
          <table className="desktop-table-body w-full table-fixed border-collapse">
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
                    className="desktop-table-data-row"
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
                          className="desktop-table-data-cell py-1 px-1 text-center"
                          style={{
                            width: column?.width,
                            color: theme.cellTextColor,
                          }}
                        >
                          <div
                            title={
                              cellKey ? row[cellKey]?.toString() : undefined
                            }
                            className={`desktop-table-cell-content block truncate mx-auto text-center ${
                              cellKey === null
                                ? "flex items-center justify-center gap-1.5"
                                : "mx-auto"
                            } h-auto text-sm`}
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
                    className="desktop-table-empty-cell p-6 text-center"
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
