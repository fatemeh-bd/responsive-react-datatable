import { useRef } from "react";
import { ColorTheme, ColumnType, TextsConfig } from "./types";
import { ArrowUpIcon } from "./icons";
import Checkbox from "./CheckBox";

const DesktopTable = ({
  columns,
  isLoading,
  maxHeight,
  pageSize,
  rows,
  theme,
  textsConfig,
  onAllSelect,
}: {
  columns: ColumnType[];
  isLoading?: boolean;
  maxHeight?: string;
  pageSize: number;
  rows: Record<string, any>[];
  theme: ColorTheme;
  textsConfig: TextsConfig;
  onAllSelect?: () => void;
}) => {
  const headerContainerRef = useRef<HTMLDivElement>(null);
  const bodyContainerRef = useRef<HTMLDivElement>(null);
  return (
    <div
      className="w-full overflow-hidden rounded-xl"
      style={{ border: `1px solid ${theme.borderColor}` }}
    >
      <div className="relative">
        {/* Header table (fixed) */}
        <div
          ref={headerContainerRef}
          className="overflow-x-auto overflow-y-hidden scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <table className="w-full table-fixed border-collapse">
            <thead style={{ backgroundColor: theme.headerBg }}>
              <tr>
                {columns.map((column, colIndex) => (
                  <th
                    key={column?.data || colIndex}
                    style={{
                      width: column?.width,
                      color: theme.headerText,
                      borderBottom: `1px solid ${theme.rowBorder}`,
                    }}
                    className={`${
                      column?.orderable ? "cursor-pointer" : ""
                    } py-2 px-1 text-center min-w-max`}
                  >
                    {column?.data === "selectableTable" ? (
                      <Checkbox
                        className="mx-auto justify-center"
                        primaryColor={theme.primaryColor}
                        onChange={() => onAllSelect?.()}
                      />
                    ) : (
                      <div
                        className="truncate mx-auto m-auto text-center line-clamp-1 flex items-center justify-center gap-1"
                        title={column?.width ? column?.title : ""}
                      >
                        {column?.orderable && (
                          <span className="flex flex-col items-center">
                            <ArrowUpIcon className="h-2 translate-y-[1px]" />
                            <ArrowUpIcon className="h-2 rotate-180" />
                          </span>
                        )}
                        {column?.title}
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
          className="overflow-auto w-full"
          style={{ maxHeight }}
        >
          <table className="w-full table-fixed border-collapse">
            <tbody>
              {isLoading ? (
                Array.from({ length: pageSize }).map((_, i) => (
                  <tr key={i}>
                    {columns.map((_, colIndex) => (
                      <td key={colIndex}>
                        <div
                          className="h-9 w-full animate-pulse"
                          style={{ backgroundColor: theme.rowBg }}
                        />
                      </td>
                    ))}
                  </tr>
                ))
              ) : rows?.length > 0 ? (
                rows.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    style={{
                      borderBottom: `1px solid ${theme.rowBorder}`,
                      backgroundColor: theme.rowBg,
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
                          style={{
                            width: column?.width,
                            color: theme.cellText,
                          }}
                          className="py-1 px-1 text-center"
                        >
                          <div
                            title={
                              cellKey ? row[cellKey]?.toString() : undefined
                            }
                            className={`block truncate mx-auto text-center ${
                              cellKey === null
                                ? "flex items-center justify-center gap-1.5"
                                : "mx-auto"
                            } overflow-visible h-auto`}
                          >
                            {content}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="p-6 text-center"
                    style={{ color: theme.headerText }}
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
