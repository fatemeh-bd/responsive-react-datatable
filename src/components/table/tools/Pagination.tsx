import { useMemo, useCallback, useState, useEffect } from "react";
import {
  MdOutlineArrowBackIos,
  MdOutlineArrowForwardIos,
} from "react-icons/md";
import { useIsMobile } from "../hooks/useIsMobile";
import { numberWithCommas } from "../helper";
import { useQueryParams } from "../hooks/useQueryParams";
import { ColorTheme, TextsConfig } from "../types";

interface PaginationProps {
  totalItems: number;
  pageSize: number;
  queryName?: string;
  startMobileSize?: number;
  theme: ColorTheme;
  dir?: "ltr" | "rtl";
  currentPage: number;
  textsConfig?: TextsConfig;
  onChangePage?: (value: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  totalItems,
  pageSize,
  queryName = "page",
  startMobileSize,
  theme,
  dir,
  textsConfig,
  currentPage,
  onChangePage,
}) => {
  const { updateParams } = useQueryParams();
  const totalPages = Math.ceil(totalItems / pageSize);
  const isMobile = useIsMobile(startMobileSize);
  const [pageInput, setPageInput] = useState(currentPage.toString());
  const maxInputLength = totalPages.toString().length;

  // === Styles
  const baseStyle: React.CSSProperties = {
    color: "inherit",
    border: `1px solid ${theme.paginationBorderColor}`,
    backgroundColor: theme.paginationBackgroundColor || "transparent",
    padding: "0 8px",
    borderRadius: "6px",
    fontSize: "14px",
    minWidth: "32px",
    height: "32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.2s",
  };

  const activeStyle: React.CSSProperties = {
    backgroundColor: theme.primaryColor,
    border: `1px solid ${theme.primaryColor}`,
    color: "inherit",
  };

  const disabledStyle: React.CSSProperties = {
    cursor: "not-allowed",
    opacity: 0.5,
  };

  // === Logic
  const middlePages = useMemo(() => {
    let start = currentPage - 1;
    let end = currentPage + 1;

    if (currentPage < 3) {
      start = 2;
      end = 4;
    } else if (currentPage > totalPages - 2) {
      start = totalPages - 3;
      end = totalPages - 1;
    } else {
      start = currentPage - 1;
      end = currentPage + 1;
    }

    if (start < 2) start = 2;
    if (end > totalPages - 1) end = totalPages - 1;
    if (start > end) return [];

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [currentPage, totalPages]);

  const showLeftEllipsis = middlePages.length > 0 && middlePages[0] > 2;
  const showRightEllipsis =
    middlePages.length > 0 &&
    middlePages[middlePages.length - 1] < totalPages - 1;

  const updatePage = useCallback(
    (page: number) => {
      updateParams(queryName, page.toString());
      onChangePage?.(page);
    },
    [updateParams, queryName]
  );

  const goToFirstPage = () => updatePage(1);
  const goToLastPage = () => updatePage(totalPages);
  const goToNextPage = () =>
    currentPage < totalPages && updatePage(currentPage + 1);
  const goToPrevPage = () => currentPage > 1 && updatePage(currentPage - 1);

  useEffect(() => {
    setPageInput(currentPage.toString());
  }, [currentPage]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= maxInputLength) {
      setPageInput(value);
    }
  };

  const handleGoToPage = () => {
    if (!pageInput) {
      setPageInput(currentPage.toString());
      return;
    }
    let page = parseInt(pageInput, 10);
    if (isNaN(page) || page < 1) page = 1;
    if (page > totalPages) page = totalPages;
    if (page !== currentPage) {
      updatePage(page);
    } else {
      setPageInput(currentPage.toString());
    }
  };

  useEffect(() => {
    if (pageInput === currentPage.toString() || pageInput === "") return;
    const timer = setTimeout(() => {
      handleGoToPage();
    }, 2000);
    return () => clearTimeout(timer);
  }, [pageInput, currentPage]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleGoToPage();
    }
  };

  const handleBlur = () => {
    handleGoToPage();
  };

  if (totalPages <= 1) return null;

  return isMobile ? (
    <div className="pagination-mobile-container">
      <button
        style={{
          ...baseStyle,
          ...(currentPage === 1 ? disabledStyle : {}),
        }}
        disabled={currentPage === 1}
        onClick={goToPrevPage}
        className="pagination-mobile-nav pagination-mobile-prev"
      >
        {dir === "rtl" ? (
          <MdOutlineArrowForwardIos style={{ fontSize: "16px" }} />
        ) : (
          <MdOutlineArrowBackIos style={{ fontSize: "16px" }} />
        )}
      </button>
      <input
        style={{
          width: "40px",
          textAlign: "center",
          border: `1px solid ${theme.paginationBorderColor}`,
          borderRadius: "6px",
        }}
        type="number"
        inputMode="numeric"
        value={pageInput}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        className="pagination-mobile-input"
      />
      <span
        style={{ color: "inherit" }}
        className="pagination-mobile-separator"
      >
        /
      </span>
      <span className="pagination-mobile-total">{totalPages}</span>
      <button
        style={{
          ...baseStyle,
          ...(currentPage === totalPages ? disabledStyle : {}),
        }}
        disabled={currentPage === totalPages}
        onClick={goToNextPage}
        className="pagination-mobile-nav pagination-mobile-next"
      >
        {dir === "rtl" ? (
          <MdOutlineArrowBackIos style={{ fontSize: "16px" }} />
        ) : (
          <MdOutlineArrowForwardIos style={{ fontSize: "16px" }} />
        )}
      </button>
    </div>
  ) : (
    <div
      id="paging"
      className="pagination-container w-full flex items-center justify-between gap-2 mt-2 flex-wrap-reverse"
    >
      <nav className="pagination-nav">
        <div
          style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}
          className="pagination-buttons-container"
        >
          <button
            style={{
              ...baseStyle,
              ...(currentPage === 1 ? disabledStyle : {}),
            }}
            disabled={currentPage === 1}
            onClick={goToFirstPage}
            className="pagination-button pagination-first"
          >
            {textsConfig?.firstPaging}
          </button>

          <button
            style={{
              ...baseStyle,
              ...(currentPage === 1 ? disabledStyle : {}),
            }}
            disabled={currentPage === 1}
            onClick={goToPrevPage}
            className="pagination-button pagination-prev"
          >
            {dir === "rtl" ? (
              <MdOutlineArrowForwardIos style={{ fontSize: "16px" }} />
            ) : (
              <MdOutlineArrowBackIos style={{ fontSize: "16px" }} />
            )}
          </button>

          <button
            style={{
              ...baseStyle,
              ...(1 === currentPage ? activeStyle : {}),
            }}
            onClick={() => updatePage(1)}
            className="pagination-button pagination-page"
          >
            {1}
          </button>

          {showLeftEllipsis && (
            <span style={baseStyle} className="pagination-ellipsis">
              ...
            </span>
          )}

          {middlePages.map((pageNum) => (
            <button
              key={pageNum}
              style={{
                ...baseStyle,
                ...(pageNum === currentPage ? activeStyle : {}),
              }}
              onClick={() => updatePage(pageNum)}
              className="pagination-button pagination-page"
            >
              {numberWithCommas(pageNum) || ""}
            </button>
          ))}

          {showRightEllipsis && (
            <span style={baseStyle} className="pagination-ellipsis">
              ...
            </span>
          )}

          <button
            style={{
              ...baseStyle,
              ...(totalPages === currentPage ? activeStyle : {}),
            }}
            onClick={() => updatePage(totalPages)}
            className="pagination-button pagination-page"
          >
            {numberWithCommas(totalPages) || ""}
          </button>

          <button
            style={{
              ...baseStyle,
              ...(currentPage === totalPages ? disabledStyle : {}),
            }}
            disabled={currentPage === totalPages}
            onClick={goToNextPage}
            className="pagination-button pagination-next"
          >
            {dir === "rtl" ? (
              <MdOutlineArrowBackIos style={{ fontSize: "16px" }} />
            ) : (
              <MdOutlineArrowForwardIos style={{ fontSize: "16px" }} />
            )}
          </button>

          <button
            style={{
              ...baseStyle,
              ...(currentPage === totalPages ? disabledStyle : {}),
            }}
            disabled={currentPage === totalPages}
            onClick={goToLastPage}
            className="pagination-button pagination-last"
          >
            {textsConfig?.lastPaging}
          </button>
        </div>
      </nav>
      {totalItems > 0 && !isMobile && (
        <p className="pagination-info text-inherit">
          {textsConfig?.showing(
            (Number(currentPage) - 1) * pageSize + 1,
            Math.min(Number(currentPage) * pageSize, totalItems),
            numberWithCommas(totalItems)
          )}
        </p>
      )}
    </div>
  );
};

export default Pagination;
