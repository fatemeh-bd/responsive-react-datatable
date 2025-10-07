import { useEffect, useState } from "react";
import { CloseIcon, SearchIcon } from "../icons";
import { ColorTheme, TableProps, TextsConfig } from "../types";
import { useQueryParams } from "../hooks/useQueryParams";
const SearchBox = ({
  theme,
  saveSearch,
  tableName,
  mode,
  tableRows,
  columns,
  onStaticNoSearch,
  onStaticSearching,
  onSearch,
  dir,
  mergedTexts,
  currentPage,
  pageQueryName,
}: TableProps & {
  tableRows: any[];
  onStaticNoSearch: () => void;
  onStaticSearching: (value: any) => void;
  currentPage: number;
  dir: "rtl" | "ltr";
  mergedTexts: TextsConfig;
  theme: ColorTheme;
}) => {
  const { removeParams } = useQueryParams();
  const [searchValue, setSearchValue] = useState(() => {
    if (saveSearch && tableName) {
      const key = `search_${tableName}`;
      const savedData = sessionStorage.getItem(key);
      if (savedData) {
        try {
          return JSON.parse(savedData).value || "";
        } catch {
          return "";
        }
      }
    }
    return "";
  });
  const [debouncedSearch, setDebouncedSearch] = useState(searchValue);
  useEffect(() => {
    if (mode === "static") {
      if (!debouncedSearch) {
        onStaticNoSearch?.();
      } else {
        const lowered = debouncedSearch.toLowerCase();
        const searched = tableRows.filter((row) =>
          columns.some((col) => {
            if (!col.data || col.searchable === false) return false;
            const val = row[col.data];
            return val?.toString().toLowerCase().includes(lowered);
          }),
        );
        onStaticSearching?.(searched);
      }
    }
  }, [debouncedSearch, tableRows, columns, mode]);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchValue);
      onSearch?.(searchValue);
    }, 400);

    return () => clearTimeout(handler);
  }, [searchValue]);

  useEffect(() => {
    if (saveSearch && tableName) {
      const key = `search_${tableName}`;
      sessionStorage.setItem(key, JSON.stringify({ value: searchValue }));
    }
  }, [searchValue, saveSearch, tableName]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchValue);
      onSearch?.(searchValue);
    }, 400);

    return () => clearTimeout(handler);
  }, [searchValue, onSearch]);

  return (
    <div className="table-search-container max-md:w-full mt-auto">
      <div
        className={`table-search-wrapper flex flex-col gap-1 [&>div]:!gap-1 [&>div]:!flex-row-reverse`}
      >
        <div
          style={{
            borderColor: theme?.borderColor,
            backgroundColor: theme?.backgroundColor,
          }}
          className="table-search-input-container my-0 flex items-center justify-between gap-3 text-right text-base rounded-lg placeholder:text-sm !outline-none w-full p-[9px] border disabled:opacity-70"
        >
          {searchValue ? (
            <CloseIcon
              style={{
                borderColor: theme?.borderColor,
                color: searchValue ? "#fb2c36" : theme?.borderColor,
                paddingLeft: dir === "rtl" ? 0 : 4,
                paddingRight: dir === "rtl" ? 4 : 0,
              }}
              onClick={() => setSearchValue("")}
              className={`table-search-clear-icon size-5 font-bold scale-150 cursor-pointer ${
                dir === "rtl" ? "border-r" : "border-l"
              }`}
            />
          ) : (
            <SearchIcon
              style={{
                paddingLeft: dir === "rtl" ? 0 : 4,
                paddingRight: dir === "rtl" ? 4 : 2,
                borderColor: theme?.borderColor,
              }}
              className={`table-search-icon size-5 scale-150 opacity-60 ${
                dir === "rtl" ? "border-r" : "border-l"
              }`}
            />
          )}
          <input
            type="text"
            value={searchValue}
            placeholder={mergedTexts?.searchPlaceholder}
            className={`table-search-input w-full text-inherit border-none bg-transparent !outline-none text-sm placeholder:!text-sm max-md:placeholder:!text-xs`}
            onChange={(e) => {
              setSearchValue(e.target.value);
              if (currentPage) {
                removeParams(pageQueryName || "page");
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchBox;
