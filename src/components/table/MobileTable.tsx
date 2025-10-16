import { memo, useMemo } from "react";
import { ColorTheme, ColumnType, TextsConfig } from "./types";
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
  }: {
    row: Record<string, any>;
    rowIndex: number;
    columns: ColumnType[];
    theme: ColorTheme;
  }) => {
    return (
      <div
        style={{
          background: theme?.backgroundColor,
          borderColor: theme?.borderColor,
        }}
        className="mobile-table-card shadowSmall"
      >
        {columns.map((column, colIndex) => {
          const cellKey = column.data;
          // استفاده از useMemo برای بهینه‌سازی رندر محتوا
          const content = useMemo(
            () =>
              column?.render
                ? column.render(
                    cellKey ? row[cellKey] : undefined,
                    row,
                    rowIndex,
                  )
                : cellKey
                  ? row[cellKey]
                  : null,
            [column, row, cellKey, rowIndex],
          );

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
}: {
  columns: ColumnType[];
  isLoading?: boolean;
  rows: Record<string, any>[];
  theme: ColorTheme;
  textsConfig: TextsConfig;
  listMode?: boolean;
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
                key={row.id || rowIndex} // ترجیحاً از row.id استفاده کنید
                row={row}
                rowIndex={rowIndex}
                columns={columns}
                theme={theme}
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
                key={row.id || rowIndex}
                className="mobile-table-swiper-slide"
              >
                <TableCard
                  row={row}
                  rowIndex={rowIndex}
                  columns={columns}
                  theme={theme}
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
