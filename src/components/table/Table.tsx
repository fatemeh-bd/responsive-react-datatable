import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import Input from "../inputs/Input";
import { CgClose, CgSearch } from "react-icons/cg";
import { useQuery } from "@tanstack/react-query";
import { notify } from "../../utils/notify/notify";
import { BASE_URL, postMethod } from "../../api/callApi";
import Paragraph from "../typography/Paragraph";
import { numberWithCommas } from "../../utils/helper";
import Pagination from "./Pagination";
import { useSearchParams } from "react-router-dom";
import "./style.css";
import PageSizeSelect from "./PageSizeSelect";
import ResponsiveTable, { OrderType } from "./ResponsiveTable";
import { useIsMobile } from "../../hooks/useIsMobile";
import { BiFilterAlt } from "react-icons/bi";
import Title from "../typography/Title";
import Modal from "../modals/Modal";
import MainButton from "../buttons/MainButton";

import Checkbox from "../inputs/CheckBox";
import { TrashIcon } from "@heroicons/react/24/outline";
interface CustomBody {
  noRefresh?: boolean;
  isFilter?: boolean;
  [key: string]: string | number | boolean | null | undefined | Object;
}
export const rowRenderer = (
  fn: (cell?: any, row?: any, index?: number) => React.ReactNode,
) => {
  return (cell?: any, row?: any, index?: number) => fn(cell, row, index);
};
export interface ColumnType {
  data: string | null;
  title: string;
  render?: (
    cell?: unknown,
    row?: Record<string, any>,
    index?: number,
  ) => React.ReactNode;
  width?: number;
  orderable?: boolean;
  searchable?: boolean;
  dontShowTitleInMobile?: boolean;
  dontShowDataInMobile?: boolean;
}
interface TableProps {
  columns: ColumnType[];
  endpoint: string;
  baseUrl?: string;
  customBody?: CustomBody[];
  pageSize?: number;
  height?: string;
  noSearch?: boolean;
  tableName?: string;
  deafaultSortBy?: string;
  onFetch?: (data: any) => void;
  saveSearch?: boolean;
  searchPlaceholder?: string;
  sortType?: "desc" | "asc";
  actionButtonsLeft?: ReactNode;
  filters?: ReactNode;
  topFilter?: ReactNode;
  title: string;
  filterContainerClassName?: string;
  topFilterContainerClassName?: string;
  isSelectable?: boolean;
  selectedIds?: any[];
  onSelectChange?: (value: any) => void;
  selectedKey?: string;
  removeFilterKey?: string;
  hasColumnOrder?: boolean;
}
export const defaultSize = 10;
const Table: React.FC<TableProps> = ({
  columns = [],
  endpoint,
  baseUrl = BASE_URL,
  customBody = [],
  pageSize = defaultSize,
  height,
  noSearch = false,
  tableName = "table",
  deafaultSortBy = "id",
  onFetch,
  saveSearch = false,
  searchPlaceholder = "جستجو کنید ...",
  sortType = "desc",
  actionButtonsLeft,
  filters,
  topFilter,
  title,
  topFilterContainerClassName = "sm:mb-4 flex items-center flex-wrap md:gap-2 gap-3 [&>div]:md:w-[200px] [&>div]:w-full",
  filterContainerClassName = "flex flex-wrap md:gap-2 gap-3 [&>div]:md:w-[200px] [&>div]:w-full",
  isSelectable = false,
  selectedIds,
  onSelectChange,
  selectedKey = "id",
  removeFilterKey,
  hasColumnOrder,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const pageNum = searchParams?.get("page") || 1;
  const pageSizeInitial = Number(searchParams?.get("pageSize")) || pageSize;
  const isMobile = useIsMobile();
  const [searchValue, setSearchValue] = useState("");
  const [openFilter, setOpenFilter] = useState(false);
  const [pageSizeState, setPageSizeState] = useState(pageSizeInitial);
  const [debouncedSearch, setDebouncedSearch] = useState(searchValue);
  const [order, setOrder] = useState<any>([
    {
      column: hasColumnOrder ? 8 : 0,
      dir: sortType,
      name: deafaultSortBy,
    },
  ]);
  const handleCheckboxChange = useCallback(
    (row: any) => {
      const id = row?.[selectedKey];
      if (!id) return;

      if (selectedIds?.includes(id)) {
        onSelectChange?.(selectedIds.filter((i) => i !== id));
      } else {
        onSelectChange?.([...(selectedIds || []), id]);
      }
    },
    [selectedIds, onSelectChange, selectedKey],
  );
  const handleOrderChange = useCallback((newOrder: OrderType) => {
    setOrder(newOrder ? [newOrder] : []);
  }, []);

  const columnsWithRow = useMemo<ColumnType[]>(() => {
    return [
      {
        data: "id",
        title: "ردیف",
        render: rowRenderer((_cell, _row, index?: number) => {
          return (
            <span className="flex items-center gap-1 flex-wrap justify-center">
              {isSelectable && (
                <Checkbox
                  checked={selectedIds?.includes(_row?.[selectedKey])}
                  value={_row?.[selectedKey]}
                  onChange={() => handleCheckboxChange(_row)}
                />
              )}
              {!isMobile &&
                (Number(pageNum) - 1) * pageSizeState + (index! + 1)}
            </span>
          );
        }),
        orderable: true,
        width: isSelectable ? 75 : 70,
        searchable: false,
        dontShowTitleInMobile: true,
      },
      ...columns,
    ];
  }, [
    columns,
    isSelectable,
    selectedIds,
    selectedKey,
    handleCheckboxChange,
    isMobile,
    pageNum,
    pageSizeState,
    endpoint,
  ]);
  const refreshableCustomBody = Array.isArray(customBody)
    ? customBody.filter((item) => !item.noRefresh)
    : [];

  const payloadCustomBody = customBody || [];

  const { data: tableRows, isFetching } = useQuery({
    queryKey: [
      tableName,
      pageNum,
      debouncedSearch,
      order,
      pageSizeState,
      refreshableCustomBody,
    ],
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: false,
    queryFn: async () => {
      try {
        const makeCurrentCols = columnsWithRow
          ?.filter((i) => i.data !== null)
          ?.map((item) => ({
            data: item?.data,
            name: item?.data,
            searchable: item?.searchable,
            orderable: item?.orderable,
            search: { value: "", regex: false, fixed: [] },
          }));

        let payload: Record<string, any> = {
          draw: Number(pageNum),
          columns: makeCurrentCols,
          order: order || [],
          start: (Number(pageNum) - 1) * pageSizeState,
          length: pageSizeState,
          search: { value: debouncedSearch || "", regex: false, fixed: [] },
        };

        payloadCustomBody.forEach((item) => {
          const { noRefresh, isFilter, ...rest } = item;
          Object.assign(payload, rest);
        });
        if (openFilter) {
          setOpenFilter(false);
        }
        const response = await postMethod(
          endpoint,
          payload,
          undefined,
          undefined,
          baseUrl,
        );
        onFetch?.(response);
        return response;
      } catch (error: any) {
        notify(error?.message, "error");
      }
    },
  });

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchValue);
    }, 400);

    return () => clearTimeout(handler);
  }, [searchValue, setSearchParams]);
  useEffect(() => {
    if (saveSearch && tableName) {
      const key = `search_${tableName}`;
      const savedData = sessionStorage.getItem(key);
      if (savedData) {
        const { value, expireAt } = JSON.parse(savedData);
        if (Date.now() < expireAt) {
          setSearchValue(value);
          setDebouncedSearch(value);
        } else {
          sessionStorage.removeItem(key);
        }
      }
    }
  }, [saveSearch, tableName]);

  useEffect(() => {
    if (saveSearch && tableName) {
      const key = `search_${tableName}`;
      const expireAt = Date.now() + 5 * 60 * 1000;
      sessionStorage.setItem(
        key,
        JSON.stringify({ value: searchValue, expireAt }),
      );
    }
  }, [searchValue, saveSearch, tableName]);
  const activeFilterCount = Array.isArray(customBody)
    ? customBody.reduce((count, item) => {
        if (!item.isFilter) return count;
        const { noRefresh, isFilter, ...rest } = item;
        const hasValue = Object.values(rest).some(
          (val) => val !== null && val !== undefined && val !== "",
        );
        return hasValue ? count + 1 : count;
      }, 0)
    : 0;

  return (
    <div>
      {!isMobile && (
        <div className={topFilterContainerClassName}>{topFilter}</div>
      )}
      <div className="flex items-start gap-2 justify-between mb-2 max-md:items-center flex-wrap-reverse">
        {title && (
          <Title className="md:hidden max-sm:!text-base">{title}</Title>
        )}

        {isMobile && (filters || topFilter) && (
          <button
            onClick={() => setOpenFilter(true)}
            className="relative mr-auto min-w-[70px] text-sm bg-blue/15 font-bold text-blue flex items-center gap-0.5 p-1 min-h-[38px] justify-center rounded-md"
          >
            {activeFilterCount > 0 && (
              <span className="absolute top-0 -right-2.5 bg-white text-xs border-2  border-blue/15 size-5 content-center rounded-full text-black">
                {activeFilterCount}
              </span>
            )}
            فیلتر
            <BiFilterAlt />
          </button>
        )}
        <div className="flex md:items-start items-center gap-2 w-fit md:flex-wrap-reverse max-md:w-full max-md:mt-2">
          {!noSearch && (
            <div className="max-md:w-full">
              <Input
                value={searchValue}
                onChange={(e) => {
                  setSearchValue(e.target.value);
                  if (searchParams?.get("page")) {
                    setSearchParams(
                      (prev) => {
                        const newParams = new URLSearchParams(prev);
                        newParams.delete("page");
                        return newParams;
                      },
                      { replace: true },
                    );
                  }
                }}
                placeholder={searchPlaceholder}
                icon={
                  searchValue ? (
                    <CgClose
                      onClick={() => setSearchValue("")}
                      className="size-5 text-error font-bold scale-150 cursor-pointer border-r pr-1"
                    />
                  ) : (
                    <CgSearch className="size-5 scale-150 opacity-70 border-r pr-1" />
                  )
                }
                className="md:!w-[320px] !w-full [&>div]:!gap-1 [&>div]:!flex-row-reverse"
                inputClassName="placeholder:!text-[10.5pt]"
              />
            </div>
          )}
          {!isMobile && (
            <div className={filterContainerClassName}>{filters}</div>
          )}
        </div>
        <div className="flex items-center gap-3 flex-wrap max-md:justify-end max-md:!w-full">
          {actionButtonsLeft && actionButtonsLeft}
          {!isMobile && (
            <PageSizeSelect
              initialPageSize={pageSize}
              pageSize={pageSizeInitial}
              onPageSizeChange={(newSize) => {
                setPageSizeState(newSize);
              }}
            />
          )}
        </div>
      </div>
      <ResponsiveTable
        columns={columnsWithRow}
        isLoading={isFetching}
        rows={tableRows?.data || []}
        pageSize={pageSize}
        maxHeight={
          height || pageSize >= defaultSize
            ? `calc(${pageSize * 51.15}px)`
            : `calc(${pageSize * 51.15}px)`
        }
        onOrderChange={handleOrderChange}
      />

      <div className="flex items-center max-sm:justify-center justify-between gap-2 mt-2 flex-wrap-reverse">
        <Pagination
          totalItems={tableRows?.recordsFiltered || 0}
          pageSize={pageSizeState}
        />
        {tableRows?.recordsFiltered > 0 && (
          <Paragraph
            themeType="secondary"
            size="md"
            className="sm:mr-auto w-fit font-medium"
          >
            نمایش {(Number(pageNum) - 1) * pageSizeState + 1} تا{" "}
            {Math.min(
              Number(pageNum) * pageSizeState,
              tableRows?.recordsFiltered,
            )}{" "}
            از {numberWithCommas(tableRows?.recordsFiltered)} رکورد
          </Paragraph>
        )}
      </div>
      {isMobile && (
        <div className="flex items-center gap-3 flex-wrap justify-center mt-4 !w-full">
          <PageSizeSelect
            initialPageSize={pageSize}
            pageSize={pageSizeInitial}
            onPageSizeChange={(newSize) => {
              setPageSizeState(newSize);
            }}
          />
        </div>
      )}
      <Modal
        size="lg"
        title="فیلتر ها"
        // childrenClass="!h-[80svh]"
        isOpen={openFilter}
        onClose={() => setOpenFilter(false)}
      >
        <div className={filterContainerClassName}>
          {filters}
          {topFilter}
        </div>
        <div className="flex items-center gap-2 mt-8">
          <MainButton onClick={() => setOpenFilter(false)} full>
            بستن
          </MainButton>
          <MainButton
            full
            theme="error"
            outline
            Icon={TrashIcon}
            onClick={() => {
              const newParams = new URLSearchParams(searchParams);
              Array.from(newParams.keys()).forEach((key) => {
                newParams.delete(key);
              });
              setSearchParams(newParams);
              if (removeFilterKey) {
                sessionStorage.removeItem(removeFilterKey);
              }

              location.reload();
            }}
          >
            حذف فیلتر ها
          </MainButton>
        </div>
      </Modal>
    </div>
  );
};

export default React.memo(Table);
