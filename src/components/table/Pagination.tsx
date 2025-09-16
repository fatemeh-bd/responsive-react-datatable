import { useMemo, useCallback, useState } from "react";
import {
  MdOutlineArrowBackIos,
  MdOutlineArrowForwardIos,
} from "react-icons/md";
import { useQueryParams } from "./requirements/useQueryParams";
import { useIsMobile } from "./requirements/useIsMobile";
import { numberWithCommas } from "./requirements/utils";
import { useFZTableColors } from "./contexts/FZTableThemeContext";

interface PaginationProps {
  totalItems: number;
  pageSize: number;
  queryName?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  totalItems,
  pageSize,
  queryName = "page",
}) => {
  const colors = useFZTableColors();
  const { updateParams, getParams } = useQueryParams();
  const currentPage = Number(getParams(queryName)) || 1;
  const totalPages = Math.ceil(totalItems / pageSize);
  const [pageInput, setPageInput] = useState(currentPage.toString());
  const isMobile = useIsMobile();
  const maxInputLength = totalPages.toString().length;

  const baseClass = `cursor-pointer font-normal px-2 bg-transparent border flex items-center justify-center text-base max-md:text-sm rounded-md transition-colors`;

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
    },
    [getParams, updateParams, queryName]
  );

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= maxInputLength) {
      setPageInput(value);
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleGoToPage();
    }
  };

  const handleBlur = () => {
    handleGoToPage();
  };

  const goToFirstPage = () => updatePage(1);
  const goToLastPage = () => updatePage(totalPages);
  const goToNextPage = () =>
    currentPage < totalPages && updatePage(currentPage + 1);
  const goToPrevPage = () => currentPage > 1 && updatePage(currentPage - 1);

  if (totalPages <= 1) return null;

  return isMobile ? (
    <>
      <button
        type="button"
        className={`${baseClass} size-[26px] px-0.5`}
        style={{
          color: colors.secondary900,
          borderColor: colors.secondary500,
        }}
        disabled={currentPage === 1}
        onClick={goToPrevPage}
        aria-label="صفحه قبلی"
      >
        <MdOutlineArrowForwardIos className="size-3" />
      </button>
      <input
        className="!w-[40px] text-center text-base !h-7 !py-0 outline-none rounded-md p-0.5"
        style={{
          borderColor: colors.secondary400,
        }}
        type="number"
        inputMode="numeric"
        value={pageInput}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
      />
      <span className="text-sm" style={{ color: colors.secondary600 }}>
        /
      </span>
      <span className="text-sm">{totalPages}</span>
      <button
        type="button"
        className={`${baseClass} size-[26px] px-0.5`}
        style={{
          color: colors.secondary900,
          borderColor: colors.secondary500,
        }}
        disabled={currentPage === totalPages}
        onClick={goToNextPage}
        aria-label="صفحه بعدی"
      >
        <MdOutlineArrowBackIos className="size-3" />
      </button>
    </>
  ) : (
    <nav className="w-fit" id="paging" aria-label="صفحه‌بندی">
      <div className="flex items-center flex-wrap gap-1">
        <button
          type="button"
          className={`${baseClass} h-8 max-md:h-7`}
          style={{
            color: colors.secondary900,
            borderColor: colors.secondary500,
          }}
          disabled={currentPage === 1}
          onClick={goToFirstPage}
          aria-label="صفحه اول"
        >
          اولین
        </button>
        <button
          type="button"
          className={`${baseClass} size-8 max-md:min-w-7 max-md:h-7`}
          style={{
            color: colors.secondary900,
            borderColor: colors.secondary500,
          }}
          disabled={currentPage === 1}
          onClick={goToPrevPage}
          aria-label="صفحه قبلی"
        >
          <MdOutlineArrowForwardIos className="size-6" />
        </button>
        <button
          type="button"
          className={`${baseClass} min-w-8 h-8 max-md:min-w-7 max-md:h-7`}
          style={{
            color: colors.secondary900,
            borderColor: colors.secondary500,
            ...(1 === currentPage
              ? {
                  backgroundColor: colors.primary,
                  fontWeight: "bold",
                  borderColor: colors.primary,
                }
              : {}),
          }}
          onClick={() => updatePage(1)}
          aria-label={`صفحه ${1}`}
          aria-current={1 === currentPage ? "page" : undefined}
        >
          {1}
        </button>
        {showLeftEllipsis && (
          <span
            className={`${baseClass} min-w-8 h-8 max-md:min-w-7 max-md:h-7 !bg-transparent !border-none !hover:bg-transparent`}
            style={{
              color: colors.secondary900,
              borderColor: colors.secondary500,
            }}
            aria-hidden="true"
          >
            ...
          </span>
        )}
        {middlePages.map((pageNum) => (
          <button
            type="button"
            key={pageNum}
            className={`${baseClass} min-w-8 h-8 max-md:min-w-7 max-md:h-7`}
            style={{
              color: colors.secondary900,
              borderColor: colors.secondary500,
              ...(pageNum === currentPage
                ? {
                    backgroundColor: colors.primary,
                    fontWeight: "bold",
                    borderColor: colors.primary,
                  }
                : {}),
            }}
            onClick={() => updatePage(pageNum)}
            aria-label={`صفحه ${pageNum}`}
            aria-current={pageNum === currentPage ? "page" : undefined}
          >
            {numberWithCommas(pageNum) || ""}
          </button>
        ))}
        {showRightEllipsis && (
          <span
            className={`${baseClass} min-w-8 h-8 max-md:min-w-7 max-md:h-7 !bg-transparent !border-none !hover:bg-transparent`}
            style={{
              color: colors.secondary900,
              borderColor: colors.secondary500,
            }}
            aria-hidden="true"
          >
            ...
          </span>
        )}
        <button
          type="button"
          className={`${baseClass} min-w-8 h-8 max-md:min-w-7 max-md:h-7`}
          style={{
            color: colors.secondary900,
            borderColor: colors.secondary500,
            ...(totalPages === currentPage
              ? {
                  backgroundColor: colors.primary,
                  fontWeight: "bold",
                  borderColor: colors.primary,
                }
              : {}),
          }}
          onClick={() => updatePage(totalPages)}
          aria-label={`صفحه ${totalPages}`}
          aria-current={totalPages === currentPage ? "page" : undefined}
        >
          {numberWithCommas(totalPages) || ""}
        </button>
        <button
          type="button"
          className={`${baseClass} size-8 max-md:min-w-7 max-md:h-7`}
          style={{
            color: colors.secondary900,
            borderColor: colors.secondary500,
          }}
          disabled={currentPage === totalPages}
          onClick={goToNextPage}
          aria-label="صفحه بعدی"
        >
          <MdOutlineArrowBackIos className="size-6" />
        </button>
        <button
          type="button"
          className={`${baseClass} h-8 max-md:h-7`}
          style={{
            color: colors.secondary900,
            borderColor: colors.secondary500,
          }}
          disabled={currentPage === totalPages}
          onClick={goToLastPage}
          aria-label="صفحه آخر"
        >
          آخرین
        </button>
      </div>
    </nav>
  );
};

export default Pagination;
