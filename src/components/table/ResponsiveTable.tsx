import { ColumnType } from "./Table";
import BoxCell from "./BoxCell";
import LoaderScreen from "./LoaderScreen";
import React, { useState, useRef, useEffect } from "react";
import { BiSolidDownArrow, BiSolidUpArrow } from "react-icons/bi";
import { useIsMobile } from "./useIsMobile";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Skeleton from "./Skeleton";
import { Virtual } from "swiper/modules";

export type OrderType = {
  column: number;
  dir: "asc" | "desc";
  name: string;
} | null;

const ResponsiveTable = ({
  columns,
  isLoading,
  rows,
  pageSize,
  maxHeight,
  onOrderChange,
}: {
  columns: ColumnType[];
  isLoading: boolean;
  rows: Record<string, any>[];
  pageSize: number;
  maxHeight?: string;
  onOrderChange?: (order: OrderType) => void;
}) => {
  const isMobile = useIsMobile();
  const [order, setOrder] = useState<OrderType>(null);

  // Refs for synchronizing scroll
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

  // Synchronize horizontal scroll between header and body
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

  return isMobile ? (
    <div className="block md:hidden">
      {isLoading ? (
        <div className="border rounded-xl border-secondary-400 p-4 space-y-2">
          {columns?.map((_item, index) => (
            <React.Fragment key={index}>
              <div className="flex items-center gap-2">
                <Skeleton
                  height="h-4"
                  width={index % 2 ? "w-[40%]" : "w-[60%]"}
                />
                <Skeleton
                  height="h-4"
                  width={index % 2 !== 0 ? "w-[60%]" : "w-[40%]"}
                />
              </div>

              {_item?.data === null && (
                <div className="flex items-center gap-2">
                  <Skeleton height="h-8" width="w-[50%]" />
                  <Skeleton height="h-8" width="w-[50%]" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      ) : rows?.length > 0 ? (
        <Swiper
          className="swiper px-1 my-2"
          slidesPerView={rows?.length === 1 ? 1 : 1.1}
          spaceBetween={10}
          modules={[Virtual]}
          virtual
        >
          {rows.map((row, rowIndex) => (
            <SwiperSlide
              key={rowIndex}
              className="p-4 !h-auto mb-3 rounded-xl overflow-hidden border border-secondary-300 bg-white shadow-sm"
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

                return column?.dontShowDataInMobile ? null : (
                  <div
                    key={colIndex}
                    className="flex items-start justify-between py-1 gap-4 w-full flex-wrap"
                  >
                    {column?.title === "عملیات" ||
                    column?.dontShowTitleInMobile ? null : (
                      <span className="text-xs text-secondary-600 min-w-[80px]">
                        {column?.title + ":"}
                      </span>
                    )}

                    <BoxCell
                      visible={isMobile}
                      className={`flex text-wrap text-sm items-center justify-center gap-2 !mx-0 flex-wrap ${
                        column?.title === "عملیات"
                          ? "[&>button]:flex-1 [&>div]:flex-1 !w-full [&>a]:flex-1"
                          : ""
                      }`}
                    >
                      {content}
                    </BoxCell>
                  </div>
                );
              })}
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <p className="text-center text-secondary-700 py-6">
          اطلاعاتی برای نمایش وجود ندارد
        </p>
      )}
    </div>
  ) : (
    <div className="w-full overflow-hidden dt-scroll rounded-xl">
      <div className="relative">
        <>
          {/* Header table (fixed) */}
          <div
            ref={headerContainerRef}
            className="overflow-x-auto overflow-y-hidden scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <table className="w-full table-fixed border-collapse">
              <thead>
                <tr>
                  {columns.map((column, colIndex) => (
                    <th
                      key={column?.data}
                      style={{ width: column?.width }}
                      onClick={() =>
                        column?.orderable && handleSort(colIndex, column)
                      }
                      className={`${
                        column?.orderable && "!cursor-pointer"
                      } py-2 px-1 text-center text-secondary-900 min-w-max border-b border-secondary-600`}
                    >
                      <BoxCell
                        tooltip={column?.width ? column?.title : ""}
                        className="flex items-center justify-center gap-1"
                      >
                        {column?.orderable && (
                          <span className="flex flex-col items-center">
                            <BiSolidUpArrow
                              className={`h-2 translate-y-[1px] ${
                                order?.column === colIndex &&
                                order?.dir === "asc"
                                  ? "opacity-100 text-secondary-900"
                                  : "opacity-20"
                              }`}
                            />
                            <BiSolidDownArrow
                              className={`h-2 ${
                                order?.column === colIndex &&
                                order?.dir === "desc"
                                  ? "opacity-100 text-secondary-900"
                                  : "opacity-20"
                              }`}
                            />
                          </span>
                        )}
                        {column?.title}
                      </BoxCell>
                    </th>
                  ))}
                </tr>
              </thead>
            </table>
          </div>
          {isLoading && <LoaderScreen />}
          {/* Scrollable body */}
          <div
            ref={bodyContainerRef}
            className="overflow-auto w-full"
            style={{ maxHeight }}
          >
            <table className="w-full table-fixed border-collapse">
              <tbody className="[&>tr:last-child]:border-0">
                {isLoading ? (
                  Array.from({ length: pageSize }).map((_, i) => (
                    <tr key={i}>
                      {columns?.map((_, colIndex) => (
                        <td key={colIndex}>
                          <div className="h-9 w-full bg-secondary-200 animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : rows?.length > 0 ? (
                  <>
                    {rows?.map((row, rowIndex) => (
                      <tr
                        key={rowIndex}
                        className={`border-b border-secondary-400`}
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
                              style={{ width: column?.width }}
                              className="py-1 px-1 text-center"
                            >
                              <BoxCell
                                className={
                                  cellKey === null
                                    ? "flex items-center justify-center gap-1.5"
                                    : "mx-auto"
                                }
                                tooltip={
                                  cellKey ? row[cellKey]?.toString() : undefined
                                }
                                visible={columns?.length - 1 === colIndex}
                              >
                                {content}
                              </BoxCell>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </>
                ) : (
                  <tr>
                    <td
                      colSpan={columns?.length}
                      className="p-6 text-center text-secondary-700"
                    >
                      اطلاعاتی برای نمایش وجود ندارد
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      </div>
    </div>
  );
};

export default ResponsiveTable;
