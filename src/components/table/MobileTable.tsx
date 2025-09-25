import React from "react";
import { ColorTheme, ColumnType, TextsConfig } from "./types";
import Skeleton from "./Skeleton";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Virtual } from "swiper/modules";

const MobileTable = ({
  columns,
  isLoading,
  pageSize,
  rows,
  theme,
  textsConfig,
  listMode = false,
}: {
  columns: ColumnType[];
  isLoading?: boolean;
  pageSize: number;
  rows: Record<string, any>[];
  theme: ColorTheme;
  textsConfig: TextsConfig;
  listMode?: boolean;
}) => {
  const renderCard = (row: Record<string, any>, rowIndex: number) => (
    <div
      key={rowIndex}
      className="p-4 !h-auto mb-3 rounded-xl overflow-hidden border border-secondary-300 bg-white shadow-sm"
    >
      {columns.map((column, colIndex) => {
        const cellKey = column.data;
        const content = column?.render
          ? column?.render(cellKey ? row[cellKey] : undefined, row, rowIndex)
          : cellKey
          ? row[cellKey]
          : null;

        return column?.dontShowDataInMobile ? null : (
          <div
            key={colIndex}
            className="flex items-start justify-between py-1 gap-4 w-full flex-wrap"
          >
            {column?.title === "عملیات" ||
            column?.dontShowTitleInMobile ? null : (
              <span className="text-xs text-secondary-600 min-w-[80px]">
                {column?.title}
                {column?.title && ":"}
              </span>
            )}

            <div
              title={cellKey ? row[cellKey]?.toString() : undefined}
              className={`truncate text-center overflow-visible h-auto text-sm flex text-wrap items-center justify-center gap-2 !mx-0 flex-wrap ${
                column?.title === "عملیات"
                  ? "[&>button]:flex-1 [&>div]:flex-1 !w-full [&>a]:flex-1"
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

  return (
    <div className="block md:hidden">
      {isLoading ? (
        <div className="border rounded-xl border-secondary-400 p-4 space-y-2 mb-2">
          {columns?.map((_item, index) => (
            <React.Fragment key={index}>
              <div className="flex items-center gap-2">
                <Skeleton
                  style={{ width: index % 2 ? "40%" : "60%" }}
                  height="h-5"
                />
                <Skeleton
                  style={{ width: index % 2 ? "60%" : "40%" }}
                  height="h-5"
                />
              </div>
              {_item?.data === null && (
                <div className="flex items-center gap-2">
                  <div
                    style={{ width: index % 2 ? "60%" : "40%" }}
                    className="h-5 my-2 w-full animate-pulse bg-gray-200 dark:bg-gray-800"
                  />
                  <Skeleton height="h-9" style={{ width: "50%" }} />
                  <Skeleton height="h-9" style={{ width: "50%" }} />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      ) : rows?.length > 0 ? (
        listMode ? (
          <div className="flex flex-col px-1 my-2">
            {rows.map((row, rowIndex) => renderCard(row, rowIndex))}
          </div>
        ) : (
          <Swiper
            className="swiper px-1 my-2 flex-col"
            slidesPerView={rows?.length === 1 ? 1 : 1.1}
            spaceBetween={10}
            modules={[Virtual]}
            virtual
          >
            {rows.map((row, rowIndex) => (
              <SwiperSlide key={rowIndex}>
                {renderCard(row, rowIndex)}
              </SwiperSlide>
            ))}
          </Swiper>
        )
      ) : (
        <p className="text-center text-secondary-700 py-6">
          {textsConfig?.noDataText}
        </p>
      )}
    </div>
  );
};

export default MobileTable;
