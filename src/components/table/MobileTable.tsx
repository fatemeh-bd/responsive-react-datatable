import React from "react";
import { ColorTheme, ColumnType, TextsConfig } from "./types";
import Skeleton from "./tools/Skeleton";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Virtual } from "swiper/modules";

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
  const renderCard = (row: Record<string, any>, rowIndex: number) => (
    <div
      key={rowIndex}
      style={{
        background: theme?.backgroundColor,
        borderColor: theme?.borderColor,
      }}
      className="mobile-table-card shadowSmall"
    >
      {columns.map((column, colIndex) => {
        const cellKey = column.data;
        const content = column?.render
          ? column?.render(cellKey ? row[cellKey] : undefined, row, rowIndex)
          : cellKey
          ? row[cellKey]
          : null;

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

  return (
    <div className="mobile-table-container">
      {isLoading ? (
        <div className="mobile-table-skeleton-container space-items">
          {columns?.map((_item, index) => (
            <React.Fragment key={index}>
              <div className="mobile-table-skeleton-row">
                <Skeleton
                  className="mobile-table-skeleton-item"
                  style={{ width: index % 2 ? "40%" : "60%", margin: 0 }}
                  height="20px"
                />
                <Skeleton
                  className="mobile-table-skeleton-item"
                  style={{ width: index % 2 ? "60%" : "40%", margin: 0 }}
                  height="20px"
                />
              </div>
              {_item?.data === null && (
                <div className="mobile-table-skeleton-action-row">
                  <Skeleton
                    className="mobile-table-skeleton-action"
                    height="36px"
                    style={{ width: "50%", margin: 0 }}
                  />
                  <Skeleton
                    className="mobile-table-skeleton-action"
                    height="36px"
                    style={{ width: "50%", margin: 0 }}
                  />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      ) : rows?.length > 0 ? (
        listMode ? (
          <div className="mobile-table-list-container">
            {rows.map((row, rowIndex) => renderCard(row, rowIndex))}
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
              <SwiperSlide key={rowIndex} className="mobile-table-swiper-slide">
                {renderCard(row, rowIndex)}
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
