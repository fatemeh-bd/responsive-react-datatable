import { memo } from "react";
import { ColorTheme, ColumnType, TextsConfig } from "./types";
import { rowIdentity } from "./data";
import Skeleton from "./tools/Skeleton";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Virtual } from "swiper/modules";

// کامپوننت کارت جداگانه با memo
const TableCard = memo(
  ({
    row,
    rowIndex,
    columns,
    theme,
    rowClassName,
  }: {
    row: Record<string, any>;
    rowIndex: number;
    columns: ColumnType[];
    theme: ColorTheme;
    rowClassName?: (row: any) => string | undefined | void;
  }) => {
    return (
      <div
        style={{
          background: theme?.backgroundColor,
          borderColor: theme?.borderColor,
        }}
        className={`mobile-table-card shadowSmall ${rowClassName?.(row) || ""}`}
      >
        {columns.map((column, colIndex) => {
          const cellKey = column.data;
          const content = column.render ? column.render(cellKey ? row[cellKey] : undefined, row, rowIndex) : cellKey ? row[cellKey] : null;

          return column?.dontShowDataInMobile ? null : (
            <div key={colIndex} className="mobile-table-card-row">
              {column?.title === "عملیات" ||
              column?.data === null ||
              column?.dontShowTitleInMobile ? null : (
                <span
                  style={{ color: theme?.headerTextColor }}
                  className="mobile-table-card-label"
                >
                  {column?.title}
                  {column?.title && ":"}
                </span>
              )}
              <div
                title={cellKey ? row[cellKey]?.toString() : undefined}
                className={`mobile-table-card-content ${
                  column?.title === "عملیات" || column?.data === null
                    ? "isOperation"
                    : ""
                }`}
              >
                {content}
              </div>
            </div>
          );
        })}
      </div>
    );
  },
);

TableCard.displayName = "TableCard";

const MobileTable = ({
  columns,
  isLoading,
  rows,
  theme,
  textsConfig,
  listMode = false,
  rowKey,
  rowClassName,
}: {
  columns: ColumnType[];
  isLoading?: boolean;
  rows: Record<string, any>[];
  theme: ColorTheme;
  textsConfig: TextsConfig;
  listMode?: boolean;
  rowKey?: string | ((row: any) => string | number);
  rowClassName?: (row: any) => string | undefined | void;
}) => {
  return (
    <div className="mobile-table-container">
      {isLoading ? (
        <div className="mobile-table-skeleton-container space-items">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="mobile-table-skeleton-card shadowSmall">
              {columns.map((column, colIndex) =>
                column?.dontShowDataInMobile ? null : (
                  <div key={colIndex} className="mobile-table-skeleton-row">
                    {column?.title === "عملیات" ||
                    column?.data === null ||
                    column?.dontShowTitleInMobile ? null : (
                      <Skeleton
                        className="mobile-table-skeleton-item"
                        style={{ width: "40%", margin: 0 }}
                        height="20px"
                      />
                    )}
                    <Skeleton
                      className="mobile-table-skeleton-item"
                      style={{ width: "60%", margin: 0 }}
                      height="20px"
                    />
                  </div>
                ),
              )}
            </div>
          ))}
        </div>
      ) : rows?.length > 0 ? (
        listMode ? (
          <div className="mobile-table-list-container">
            {rows.map((row, rowIndex) => (
              <TableCard
                key={rowIdentity(row, rowIndex, rowKey)} // ترجیحاً از row.id استفاده کنید
                row={row}
                rowIndex={rowIndex}
                columns={columns}
                theme={theme}
                rowClassName={rowClassName}
              />
            ))}
          </div>
        ) : (
          <Swiper
            className="mobile-table-swiper"
            slidesPerView={rows?.length === 1 ? 1 : 1.1}
            spaceBetween={10}
            modules={[Virtual]}
            virtual
          >
            {rows.map((row, rowIndex) => (
              <SwiperSlide
                virtualIndex={rowIndex}
                key={rowIdentity(row, rowIndex, rowKey)}
                className="mobile-table-swiper-slide"
              >
                <TableCard
                  row={row}
                  rowIndex={rowIndex}
                  columns={columns}
                  theme={theme}
                  rowClassName={rowClassName}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        )
      ) : (
        <p className="mobile-table-empty-message">{textsConfig?.noDataText}</p>
      )}
    </div>
  );
};

export default MobileTable;
