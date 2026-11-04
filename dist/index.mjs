"use client";
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import React, { useState, useEffect, useSyncExternalStore, useCallback, forwardRef, useRef, useImperativeHandle, memo, useMemo, useId, useContext, isValidElement, cloneElement } from 'react';
import { QueryClientContext, QueryClient, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Virtual } from 'swiper/modules';
import { createPortal } from 'react-dom';

function useIsMobile(breakpoint = 768) {
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        function handleResize() {
            setIsMobile(window.innerWidth < breakpoint);
        }
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [breakpoint]);
    return isMobile;
}

const eventName = "responsive-datatable:url";
let subscribers = 0;
let restoreHistory;
const subscribe = (listener) => {
    if (subscribers++ === 0) {
        const history = window.history;
        const push = history.pushState, replace = history.replaceState;
        const notify = () => window.dispatchEvent(new Event(eventName));
        const wrappedPush = function (...args) { push.apply(this, args); notify(); };
        const wrappedReplace = function (...args) { replace.apply(this, args); notify(); };
        history.pushState = wrappedPush;
        history.replaceState = wrappedReplace;
        restoreHistory = () => {
            if (history.pushState === wrappedPush)
                history.pushState = push;
            if (history.replaceState === wrappedReplace)
                history.replaceState = replace;
        };
    }
    window.addEventListener("popstate", listener);
    window.addEventListener(eventName, listener);
    return () => {
        window.removeEventListener("popstate", listener);
        window.removeEventListener(eventName, listener);
        if (--subscribers === 0) {
            restoreHistory?.();
            restoreHistory = undefined;
        }
    };
};
const snapshot = () => window.location.search;
const serverSnapshot = () => "";
function useQueryParams() {
    const search = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
    const getParams = useCallback((key) => new URLSearchParams(search).get(key), [search]);
    const setParams = useCallback((values, replace = true) => {
        const url = new URL(window.location.href);
        Object.entries(values).forEach(([key, value]) => {
            if (value === null)
                url.searchParams.delete(key);
            else
                url.searchParams.set(key, value);
        });
        const next = `${url.pathname}${url.search}${url.hash}`;
        if (next === `${window.location.pathname}${window.location.search}${window.location.hash}`)
            return;
        window.history[replace ? "replaceState" : "pushState"](window.history.state, "", next);
    }, []);
    const updateParams = useCallback((key, value, replace = true) => setParams({ [key]: value }, replace), [setParams]);
    const removeParams = useCallback((key, replace = true) => setParams({ [key]: null }, replace), [setParams]);
    return { getParams, updateParams, removeParams, setParams };
}

const defaultSize = 10;
const defaultTexts = {
    en: {
        row: "Row",
        noDataText: "No data available",
        firstPaging: "First",
        lastPaging: "Last",
        showing: (from, to, total) => `Showing ${from} to ${to} of ${total} records`,
        searchPlaceholder: "search ...",
        pageSize: "page Size",
        filterText: "filter",
        removeFilterText: "delete filters",
        close: "close",
    },
    fa: {
        row: "ردیف",
        noDataText: "اطلاعاتی برای نمایش وجود ندارد",
        firstPaging: "اولین",
        lastPaging: "آخرین",
        showing: (from, to, total) => `نمایش ${from} تا ${to} از ${total} رکورد`,
        searchPlaceholder: "جستجو کنید...",
        pageSize: "نمایش",
        filterText: "فیلتر",
        removeFilterText: "حذف فیلتر ها",
        close: "بستن",
    },
};
const defaultColorTheme = {
    borderColor: "#e7e7e7",
    headerBackgroundColor: "#f9f9f9",
    headerTextColor: "#333333",
    backgroundColor: "#fff",
    cellTextColor: "#7a7a7a",
    primaryColor: "#ffd61f",
};
const defaultAutoConfig = {
    enabled: false,
    containerSelector: "#content-wrapper",
    subtractSelectors: [
    // "#table-header-actions",
    // "#paging",
    // "#topFilter",
    ],
    optionalSelectorsForExtraBuffer: ["#topFilter"],
    rowHeight: 51.15,
    baseBufferRows: 2,
    extraBufferRows: 1,
};

const positiveInteger = (value, fallback) => {
    const number = Number(value);
    return Number.isSafeInteger(number) && number > 0 ? number : fallback;
};
function localRows(rows, columns, search, order) {
    const lowered = search.toLocaleLowerCase();
    const filtered = lowered ? rows.filter(row => columns.some(col => col.data !== null && col.searchable !== false &&
        String(row[col.data] ?? "").toLocaleLowerCase().includes(lowered))) : [...rows];
    if (order)
        filtered.sort((a, b) => {
            const x = a[order.name], y = b[order.name];
            if (x == null && y == null)
                return 0;
            if (x == null)
                return 1;
            if (y == null)
                return -1;
            const result = typeof x === "number" && typeof y === "number" ? x - y : String(x).localeCompare(String(y));
            return order.dir === "asc" ? result : -result;
        });
    return filtered;
}
function requestConfig(config, payload) {
    const endpoint = config.endpoint;
    const url = /^(?:https?:)?\/\//i.test(endpoint) ? endpoint :
        config.baseUrl ? `${config.baseUrl.replace(/\/$/, "")}/${endpoint.replace(/^\//, "")}` : endpoint;
    const method = config.method || "POST";
    return { url, method, headers: config.headers, ...(method === "GET" ? { params: config.payload ?? payload } : { data: config.payload ?? payload }) };
}
function rowIdentity(row, index, key) {
    return (typeof key === "function" ? key(row) : row[key || "id"]) ?? index;
}

const ArrowUpIcon = ({ className, style = {}, }) => {
    return (jsx("svg", { style: style, stroke: "currentColor", fill: "currentColor", strokeWidth: "0", viewBox: "0 0 24 24", className: className, height: "1em", width: "1em", xmlns: "http://www.w3.org/2000/svg", children: jsx("path", { d: "M3 19h18a1.002 1.002 0 0 0 .823-1.569l-9-13c-.373-.539-1.271-.539-1.645 0l-9 13A.999.999 0 0 0 3 19z" }) }));
};
const ArrowDownIcon = ({ className, style = {}, }) => {
    return (jsx("svg", { style: style, stroke: "currentColor", fill: "currentColor", strokeWidth: "0", viewBox: "0 0 24 24", className: className, height: "1em", width: "1em", xmlns: "http://www.w3.org/2000/svg", children: jsx("path", { d: "M11.178 19.569a.998.998 0 0 0 1.644 0l9-13A.999.999 0 0 0 21 5H3a1.002 1.002 0 0 0-.822 1.569l9 13z" }) }));
};
const CloseIcon = ({ onClick, className, style = {}, }) => {
    return (jsx("svg", { style: style, onClick: onClick, className: className, stroke: "currentColor", fill: "none", strokeWidth: "0", viewBox: "0 0 24 24", height: "1rem", width: "1rem", xmlns: "http://www.w3.org/2000/svg", children: jsx("path", { d: "M6.2253 4.81108C5.83477 4.42056 5.20161 4.42056 4.81108 4.81108C4.42056 5.20161 4.42056 5.83477 4.81108 6.2253L10.5858 12L4.81114 17.7747C4.42062 18.1652 4.42062 18.7984 4.81114 19.1889C5.20167 19.5794 5.83483 19.5794 6.22535 19.1889L12 13.4142L17.7747 19.1889C18.1652 19.5794 18.7984 19.5794 19.1889 19.1889C19.5794 18.7984 19.5794 18.1652 19.1889 17.7747L13.4142 12L19.189 6.2253C19.5795 5.83477 19.5795 5.20161 19.189 4.81108C18.7985 4.42056 18.1653 4.42056 17.7748 4.81108L12 10.5858L6.2253 4.81108Z", fill: "currentColor" }) }));
};
const SearchIcon = ({ className, style = {}, }) => {
    return (jsx("svg", { style: style, stroke: "currentColor", fill: "none", strokeWidth: "0", viewBox: "0 0 24 24", className: className, xmlns: "http://www.w3.org/200it style0/svg", children: jsx("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M18.319 14.4326C20.7628 11.2941 20.542 6.75347 17.6569 3.86829C14.5327 0.744098 9.46734 0.744098 6.34315 3.86829C3.21895 6.99249 3.21895 12.0578 6.34315 15.182C9.22833 18.0672 13.769 18.2879 16.9075 15.8442C16.921 15.8595 16.9351 15.8745 16.9497 15.8891L21.1924 20.1317C21.5829 20.5223 22.2161 20.5223 22.6066 20.1317C22.9971 19.7412 22.9971 19.1081 22.6066 18.7175L18.364 14.4749C18.3493 14.4603 18.3343 14.4462 18.319 14.4326ZM16.2426 5.28251C18.5858 7.62565 18.5858 11.4246 16.2426 13.7678C13.8995 16.1109 10.1005 16.1109 7.75736 13.7678C5.41421 11.4246 5.41421 7.62565 7.75736 5.28251C10.1005 2.93936 13.8995 2.93936 16.2426 5.28251Z", fill: "currentColor" }) }));
};
const TrashIcon = () => {
    return (jsxs("svg", { stroke: "currentColor", fill: "currentColor", strokeWidth: "0", viewBox: "0 0 24 24", height: "20px", width: "20px", xmlns: "http://www.w3.org/2000/svg", children: [jsx("path", { d: "M16 1.75V3h5.25a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1 0-1.5H8V1.75C8 .784 8.784 0 9.75 0h4.5C15.216 0 16 .784 16 1.75Zm-6.5 0V3h5V1.75a.25.25 0 0 0-.25-.25h-4.5a.25.25 0 0 0-.25.25ZM4.997 6.178a.75.75 0 1 0-1.493.144L4.916 20.92a1.75 1.75 0 0 0 1.742 1.58h10.684a1.75 1.75 0 0 0 1.742-1.581l1.413-14.597a.75.75 0 0 0-1.494-.144l-1.412 14.596a.25.25 0 0 1-.249.226H6.658a.25.25 0 0 1-.249-.226L4.997 6.178Z" }), jsx("path", { d: "M9.206 7.501a.75.75 0 0 1 .793.705l.5 8.5A.75.75 0 1 1 9 16.794l-.5-8.5a.75.75 0 0 1 .705-.793Zm6.293.793A.75.75 0 1 0 14 8.206l-.5 8.5a.75.75 0 0 0 1.498.088l.5-8.5Z" })] }));
};
const FilterIcon = () => {
    return (jsx("svg", { stroke: "currentColor", fill: "currentColor", strokeWidth: "0", viewBox: "0 0 24 24", height: "20px", width: "20px", xmlns: "http://www.w3.org/2000/svg", children: jsx("path", { d: "M21 3H5a1 1 0 0 0-1 1v2.59c0 .523.213 1.037.583 1.407L10 13.414V21a1.001 1.001 0 0 0 1.447.895l4-2c.339-.17.553-.516.553-.895v-5.586l5.417-5.417c.37-.37.583-.884.583-1.407V4a1 1 0 0 0-1-1zm-6.707 9.293A.996.996 0 0 0 14 13v5.382l-2 1V13a.996.996 0 0 0-.293-.707L6 6.59V5h14.001l.002 1.583-5.71 5.71z" }) }));
};
const ChevronDown = ({ className, style = {}, }) => {
    return (jsx("svg", { stroke: "currentColor", fill: "currentColor", strokeWidth: "0", viewBox: "0 0 24 24", height: "20px", width: "20px", className: className, style: style, xmlns: "http://www.w3.org/2000/svg", children: jsx("path", { d: "M16.293 9.293 12 13.586 7.707 9.293l-1.414 1.414L12 16.414l5.707-5.707z" }) }));
};
const MdOutlineArrowForwardIos = ({ style = {}, }) => {
    return (jsxs("svg", { style: style, stroke: "currentColor", fill: "currentColor", strokeWidth: "0", viewBox: "0 0 24 24", height: "14px", width: "14px", xmlns: "http://www.w3.org/2000/svg", children: [jsx("path", { fill: "none", d: "M0 0h24v24H0V0z" }), jsx("path", { d: "M6.23 20.23 8 22l10-10L8 2 6.23 3.77 14.46 12z" })] }));
};
const MdOutlineArrowBackIos = ({ style = {} }) => {
    return (jsxs("svg", { style: style, stroke: "currentColor", fill: "currentColor", strokeWidth: "0", viewBox: "0 0 24 24", height: "14px", width: "14px", xmlns: "http://www.w3.org/2000/svg", children: [jsx("path", { fill: "none", d: "M0 0h24v24H0V0z", opacity: ".87" }), jsx("path", { d: "M17.51 3.87 15.73 2.1 5.84 12l9.9 9.9 1.77-1.77L9.38 12l8.13-8.13z" })] }));
};
const BiDotsVerticalRounded = () => {
    return (jsx("svg", { stroke: "currentColor", fill: "currentColor", strokeWidth: "0", viewBox: "0 0 24 24", height: "20px", style: {
            marginLeft: "auto",
            marginRight: "auto",
            width: 24,
            height: 24,
        }, width: "20px", xmlns: "http://www.w3.org/2000/svg", children: jsx("path", { d: "M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 12c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" }) }));
};

const Checkbox = forwardRef(({ label, ariaLabel, indeterminate, checked, onChange, name, className, value, disabled = false, defaultChecked, primaryColor, }, ref) => {
    const inputRef = useRef(null);
    useImperativeHandle(ref, () => inputRef.current);
    useEffect(() => { if (inputRef.current)
        inputRef.current.indeterminate = !!indeterminate; }, [indeterminate]);
    return (jsxs("label", { className: `${className} checkbox checkbox-container`, children: [jsx("input", { className: "checkbox-input", type: "checkbox", name: name, checked: checked, onChange: onChange, ref: inputRef, "aria-label": ariaLabel || label || "Select row", value: value, disabled: disabled, defaultChecked: defaultChecked }), jsx("span", { style: {
                    backgroundColor: checked ? primaryColor : "transparent",
                    borderColor: checked ? primaryColor : "#b8b8b8",
                    width: 22,
                    height: 22,
                }, className: `checkbox-control checkbox-visual-control` }), label && (jsx("span", { className: "checkbox-label checkbox-text-label", children: label }))] }));
});
Checkbox.displayName = "Checkbox";

const Skeleton = ({ height = "30px", style = {}, className, }) => {
    return (jsx("div", { style: { height, ...style }, className: `skleton-class ${className}` }));
};

function DesktopTable({ columns, rows, pageSize, theme, textsConfig, isLoading, maxHeight, rowHeight, isAllSelected = false, isIndeterminate, onAllSelect, onOrderChange, rowClassName, rowKey, order }) {
    const sort = (column, index) => {
        if (!column.orderable || !column.data)
            return;
        onOrderChange?.(!order || order.name !== column.data ? { column: index, name: column.data, dir: "desc" } :
            order.dir === "desc" ? { ...order, dir: "asc" } : null);
    };
    return jsx("div", { className: "desktop-table-container", style: { border: `1px solid ${theme.borderColor}` }, children: jsx("div", { className: "desktop-table-body-container", style: { maxHeight, overflow: "auto" }, children: jsxs("table", { className: "desktop-table desktop-table-body", "aria-label": "Data table", children: [jsx("thead", { className: "desktop-table-head", style: { backgroundColor: theme.headerBackgroundColor, position: "sticky", top: 0, zIndex: 1 }, children: jsx("tr", { className: "desktop-table-header-row", style: { height: rowHeight }, children: columns.map((column, index) => jsx("th", { scope: "col", className: "desktop-table-header-cell", style: { width: column.width, color: theme.headerTextColor, borderBottom: `1px solid ${theme.borderColor}` }, "aria-sort": column.orderable ? order?.name === column.data ? order.dir === "asc" ? "ascending" : "descending" : "none" : undefined, children: column.data === "selectableTable" ? jsx(Checkbox, { checked: isAllSelected, indeterminate: isIndeterminate, ariaLabel: "Select all rows", primaryColor: theme.primaryColor, onChange: event => onAllSelect?.(event.target.checked) }) :
                                    column.orderable ? jsxs("button", { type: "button", className: "desktop-table-header-content", onClick: () => sort(column, index), children: [jsxs("span", { className: "desktop-table-sort-icons", "aria-hidden": "true", children: [jsx(ArrowUpIcon, { className: order?.name === column.data && order.dir === "asc" ? "opacityFull" : "opacityHalf" }), jsx(ArrowDownIcon, { className: order?.name === column.data && order.dir === "desc" ? "opacityFull" : "opacityHalf" })] }), jsx("span", { className: "desktop-table-header-title", children: column.title })] }) : jsx("span", { className: "desktop-table-header-title", children: column.title }) }, `${column.data}:${index}`)) }) }), jsx("tbody", { className: "desktop-table-body-inner", children: isLoading ? Array.from({ length: pageSize }, (_, index) => jsx("tr", { className: "desktop-table-skeleton-row", children: columns.map((_, colIndex) => jsx("td", { className: "desktop-table-skeleton-cell", children: jsx(Skeleton, { className: "desktop-table-skeleton" }) }, colIndex)) }, index)) : rows.length ? rows.map((row, index) => jsx("tr", { className: `desktop-table-data-row ${rowClassName?.(row) || ""}`, style: { borderBottom: `1px solid ${theme.borderColor}`, backgroundColor: theme.backgroundColor, height: rowHeight }, children: columns.map((column, colIndex) => jsx("td", { className: "desktop-table-data-cell", style: { width: column.width, color: theme.cellTextColor }, children: jsx("div", { className: `desktop-table-cell-content ${column.data === null ? "isContent" : "noContent"}`, title: column.data ? row[column.data]?.toString() : undefined, children: column.render ? column.render(column.data ? row[column.data] : undefined, row, index) : column.data ? row[column.data] : null }) }, `${column.data}:${colIndex}`)) }, rowIdentity(row, index, rowKey))) : jsx("tr", { className: "desktop-table-empty-row", children: jsx("td", { colSpan: columns.length, className: "desktop-table-empty-cell", style: { color: theme.headerTextColor }, children: textsConfig.noDataText }) }) })] }) }) });
}
var DesktopTable$1 = memo(DesktopTable);

// کامپوننت کارت جداگانه با memo
const TableCard = memo(({ row, rowIndex, columns, theme, }) => {
    return (jsx("div", { style: {
            background: theme?.backgroundColor,
            borderColor: theme?.borderColor,
        }, className: "mobile-table-card shadowSmall", children: columns.map((column, colIndex) => {
            const cellKey = column.data;
            const content = column.render ? column.render(cellKey ? row[cellKey] : undefined, row, rowIndex) : cellKey ? row[cellKey] : null;
            return column?.dontShowDataInMobile ? null : (jsxs("div", { className: "mobile-table-card-row", children: [column?.title === "عملیات" ||
                        column?.data === null ||
                        column?.dontShowTitleInMobile ? null : (jsxs("span", { style: { color: theme?.headerTextColor }, className: "mobile-table-card-label", children: [column?.title, column?.title && ":"] })), jsx("div", { title: cellKey ? row[cellKey]?.toString() : undefined, className: `mobile-table-card-content ${column?.title === "عملیات" || column?.data === null
                            ? "isOperation"
                            : ""}`, children: content })] }, colIndex));
        }) }));
});
TableCard.displayName = "TableCard";
const MobileTable = ({ columns, isLoading, rows, theme, textsConfig, listMode = false, rowKey, }) => {
    return (jsx("div", { className: "mobile-table-container", children: isLoading ? (jsx("div", { className: "mobile-table-skeleton-container space-items", children: Array.from({ length: 3 }).map((_, index) => (jsx("div", { className: "mobile-table-skeleton-card shadowSmall", children: columns.map((column, colIndex) => column?.dontShowDataInMobile ? null : (jsxs("div", { className: "mobile-table-skeleton-row", children: [column?.title === "عملیات" ||
                            column?.data === null ||
                            column?.dontShowTitleInMobile ? null : (jsx(Skeleton, { className: "mobile-table-skeleton-item", style: { width: "40%", margin: 0 }, height: "20px" })), jsx(Skeleton, { className: "mobile-table-skeleton-item", style: { width: "60%", margin: 0 }, height: "20px" })] }, colIndex))) }, index))) })) : rows?.length > 0 ? (listMode ? (jsx("div", { className: "mobile-table-list-container", children: rows.map((row, rowIndex) => (jsx(TableCard, { row: row, rowIndex: rowIndex, columns: columns, theme: theme }, rowIdentity(row, rowIndex, rowKey)))) })) : (jsx(Swiper, { className: "mobile-table-swiper", slidesPerView: rows?.length === 1 ? 1 : 1.1, spaceBetween: 10, modules: [Virtual], virtual: true, children: rows.map((row, rowIndex) => (jsx(SwiperSlide, { virtualIndex: rowIndex, className: "mobile-table-swiper-slide", children: jsx(TableCard, { row: row, rowIndex: rowIndex, columns: columns, theme: theme }) }, rowIdentity(row, rowIndex, rowKey)))) }))) : (jsx("p", { className: "mobile-table-empty-message", children: textsConfig?.noDataText })) }));
};

const rowRenderer = (fn) => {
    return (cell, row, index) => fn(cell, row, index);
};
const numberWithCommas = (number) => {
    if (number == null || number === "")
        return ""; // Handle null, undefined, or empty input
    const num = typeof number === "number"
        ? number
        : parseFloat(number.toString().replace(/,/g, ""));
    if (isNaN(num))
        return ""; // Handle invalid numbers
    return num.toLocaleString("en-US"); // Use built-in formatting
};

const Pagination = ({ totalItems, pageSize, queryName = "page", startMobileSize, theme, dir, textsConfig, currentPage, onChangePage, }) => {
    const totalPages = Math.ceil(totalItems / pageSize);
    const isMobile = useIsMobile(startMobileSize);
    const [pageInput, setPageInput] = useState(currentPage.toString());
    const maxInputLength = totalPages.toString().length;
    // === Styles
    const baseStyle = {
        color: "inherit",
        border: `1px solid ${theme.borderColor}`,
        backgroundColor: theme.backgroundColor || "transparent",
        padding: isMobile ? "0 4px" : "0 8px",
        borderRadius: "6px",
        fontSize: "14px",
        minWidth: "32px",
        height: isMobile ? "27px" : "32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: "all 0.2s",
    };
    const activeStyle = {
        backgroundColor: theme.primaryColor,
        border: `1px solid ${theme.primaryColor}`,
        color: "inherit",
    };
    const disabledStyle = {
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
        }
        else if (currentPage > totalPages - 2) {
            start = totalPages - 3;
            end = totalPages - 1;
        }
        else {
            start = currentPage - 1;
            end = currentPage + 1;
        }
        if (start < 2)
            start = 2;
        if (end > totalPages - 1)
            end = totalPages - 1;
        if (start > end)
            return [];
        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    }, [currentPage, totalPages]);
    const showLeftEllipsis = middlePages.length > 0 && middlePages[0] > 2;
    const showRightEllipsis = middlePages.length > 0 &&
        middlePages[middlePages.length - 1] < totalPages - 1;
    const updatePage = useCallback((page) => {
        onChangePage?.(page);
    }, [onChangePage]);
    const goToFirstPage = () => updatePage(1);
    const goToLastPage = () => updatePage(totalPages);
    const goToNextPage = () => currentPage < totalPages && updatePage(currentPage + 1);
    const goToPrevPage = () => currentPage > 1 && updatePage(currentPage - 1);
    useEffect(() => {
        setPageInput(currentPage.toString());
    }, [currentPage]);
    const handleInputChange = (e) => {
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
        if (isNaN(page) || page < 1)
            page = 1;
        if (page > totalPages)
            page = totalPages;
        if (page !== currentPage) {
            updatePage(page);
        }
        else {
            setPageInput(currentPage.toString());
        }
    };
    useEffect(() => {
        if (pageInput === currentPage.toString() || pageInput === "")
            return;
        const timer = setTimeout(() => {
            handleGoToPage();
        }, 2000);
        return () => clearTimeout(timer);
    }, [pageInput, currentPage]);
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleGoToPage();
        }
    };
    const handleBlur = () => {
        handleGoToPage();
    };
    if (totalPages <= 1)
        return null;
    return isMobile ? (jsxs("div", { className: "pagination-mobile-container", children: [jsx("button", { type: "button", style: {
                    ...baseStyle,
                    ...(currentPage === 1 ? disabledStyle : {}),
                }, disabled: currentPage === 1, onClick: goToPrevPage, "aria-label": "Previous page", className: "pagination-mobile-nav pagination-mobile-prev", children: dir === "rtl" ? (jsx(MdOutlineArrowForwardIos, { style: { fontSize: "16px" } })) : (jsx(MdOutlineArrowBackIos, { style: { fontSize: "16px" } })) }), jsx("input", { style: {
                    width: "40px",
                    textAlign: "center",
                    border: `1px solid ${theme.borderColor}`,
                    borderRadius: "6px",
                }, "aria-label": "Page number", type: "number", inputMode: "numeric", value: pageInput, onChange: handleInputChange, onKeyDown: handleKeyDown, onBlur: handleBlur, className: "pagination-mobile-input" }), jsx("span", { style: { color: "inherit" }, className: "pagination-mobile-separator", children: "/" }), jsx("span", { className: "pagination-mobile-total", children: totalPages }), jsx("button", { type: "button", style: {
                    ...baseStyle,
                    ...(currentPage === totalPages ? disabledStyle : {}),
                }, disabled: currentPage === totalPages, onClick: goToNextPage, "aria-label": "Next page", className: "pagination-mobile-nav pagination-mobile-next", children: dir === "rtl" ? (jsx(MdOutlineArrowBackIos, { style: { fontSize: "16px" } })) : (jsx(MdOutlineArrowForwardIos, { style: { fontSize: "16px" } })) })] })) : (jsxs("div", { id: "paging", className: "pagination-container", children: [jsx("nav", { className: "pagination-nav", children: jsxs("div", { style: { display: "flex", gap: "4px", flexWrap: "wrap" }, className: "pagination-buttons-container", children: [jsx("button", { type: "button", style: {
                                ...baseStyle,
                                ...(currentPage === 1 ? disabledStyle : {}),
                            }, disabled: currentPage === 1, onClick: goToFirstPage, className: "pagination-button pagination-first", children: textsConfig?.firstPaging }), jsx("button", { type: "button", style: {
                                ...baseStyle,
                                ...(currentPage === 1 ? disabledStyle : {}),
                            }, disabled: currentPage === 1, onClick: goToPrevPage, "aria-label": "Previous page", className: "pagination-button pagination-prev", children: dir === "rtl" ? (jsx(MdOutlineArrowForwardIos, { style: { fontSize: "16px" } })) : (jsx(MdOutlineArrowBackIos, { style: { fontSize: "16px" } })) }), jsx("button", { type: "button", style: {
                                ...baseStyle,
                                ...(1 === currentPage ? activeStyle : {}),
                            }, onClick: () => updatePage(1), className: "pagination-button pagination-page", children: 1 }), showLeftEllipsis && (jsx("span", { style: baseStyle, className: "pagination-ellipsis", children: "..." })), middlePages.map((pageNum) => (jsx("button", { type: "button", style: {
                                ...baseStyle,
                                ...(pageNum === currentPage ? activeStyle : {}),
                            }, onClick: () => updatePage(pageNum), className: "pagination-button pagination-page", children: numberWithCommas(pageNum) || "" }, pageNum))), showRightEllipsis && (jsx("span", { style: baseStyle, className: "pagination-ellipsis", children: "..." })), jsx("button", { type: "button", style: {
                                ...baseStyle,
                                ...(totalPages === currentPage ? activeStyle : {}),
                            }, onClick: () => updatePage(totalPages), className: "pagination-button pagination-page", children: numberWithCommas(totalPages) || "" }), jsx("button", { type: "button", style: {
                                ...baseStyle,
                                ...(currentPage === totalPages ? disabledStyle : {}),
                            }, disabled: currentPage === totalPages, onClick: goToNextPage, "aria-label": "Next page", className: "pagination-button pagination-next", children: dir === "rtl" ? (jsx(MdOutlineArrowBackIos, { style: { fontSize: "16px" } })) : (jsx(MdOutlineArrowForwardIos, { style: { fontSize: "16px" } })) }), jsx("button", { type: "button", style: {
                                ...baseStyle,
                                ...(currentPage === totalPages ? disabledStyle : {}),
                            }, disabled: currentPage === totalPages, onClick: goToLastPage, className: "pagination-button pagination-last", children: textsConfig?.lastPaging })] }) }), totalItems > 0 && !isMobile && (jsx("p", { className: "pagination-info", children: textsConfig?.showing &&
                    textsConfig?.showing((Number(currentPage) - 1) * pageSize + 1, Math.min(Number(currentPage) * pageSize, totalItems), numberWithCommas(totalItems)) }))] }));
};

function PageSizeSelect({ pageSize, initialPageSize, theme, textsConfig, onPageSizeChange }) {
    const sizes = Array.from(new Set([initialPageSize || pageSize, pageSize, 20, 50, 100, 200, 300])).sort((a, b) => a - b);
    return jsxs("div", { className: "page-size-select-container", children: [jsx("span", { className: "page-size-select-label", children: textsConfig.pageSize }), jsxs("div", { className: "pageSizeParent", children: [jsx("select", { "aria-label": textsConfig.pageSize || "Page size", value: pageSize, onChange: event => onPageSizeChange(Number(event.target.value)), className: "page-size-select cursorPointer", style: { borderColor: theme.borderColor, backgroundColor: theme.backgroundColor }, children: sizes.map(size => jsx("option", { value: size, children: size }, size)) }), jsx(ChevronDown, { className: "page-size-select-icon" })] })] });
}

function SearchBox({ value, onSearch, theme, mergedTexts, dir }) {
    const [input, setInput] = useState(value);
    const callback = useRef(onSearch);
    useEffect(() => { callback.current = onSearch; }, [onSearch]);
    useEffect(() => { setInput(value); }, [value]);
    useEffect(() => {
        if (input === value)
            return;
        const timer = setTimeout(() => callback.current(input), 400);
        return () => clearTimeout(timer);
    }, [input, value]);
    return jsx("div", { className: "table-search-container", children: jsx("div", { className: "table-search-wrapper", children: jsxs("div", { className: "table-search-input-container", style: { borderColor: theme.borderColor, backgroundColor: theme.backgroundColor }, children: [input ? jsx("button", { type: "button", className: "table-search-clear-button", "aria-label": dir === "rtl" ? "پاک کردن جستجو" : "Clear search", onClick: () => setInput(""), children: jsx(CloseIcon, { className: "table-search-clear-icon" }) }) : jsx(SearchIcon, { className: "table-search-icon" }), jsx("input", { type: "search", "aria-label": mergedTexts.searchPlaceholder || "Search", value: input, placeholder: mergedTexts.searchPlaceholder, className: "table-search-input", onChange: event => setInput(event.target.value) })] }) }) });
}

function Modal({ title, isOpen, onClose, children, className = "", size = "fit", overflowY = "overflow__auto", childrenClass = "", theme }) {
    const [mounted, setMounted] = useState(false);
    const panel = useRef(null);
    const titleId = useId();
    const close = useRef(onClose);
    useEffect(() => { close.current = onClose; }, [onClose]);
    useEffect(() => { setMounted(true); }, []);
    useEffect(() => {
        if (!isOpen || !mounted)
            return;
        const previous = document.activeElement;
        const focusable = () => Array.from(panel.current?.querySelectorAll('button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex="0"]') || []);
        (focusable()[0] || panel.current)?.focus();
        const keydown = (event) => {
            if (event.key === "Escape") {
                event.preventDefault();
                close.current();
            }
            if (event.key !== "Tab")
                return;
            const items = focusable();
            if (!items.length) {
                event.preventDefault();
                panel.current?.focus();
                return;
            }
            if (event.shiftKey && document.activeElement === items[0]) {
                event.preventDefault();
                items[items.length - 1].focus();
            }
            else if (!event.shiftKey && document.activeElement === items[items.length - 1]) {
                event.preventDefault();
                items[0].focus();
            }
        };
        document.addEventListener("keydown", keydown);
        return () => { document.removeEventListener("keydown", keydown); previous?.focus(); };
    }, [isOpen, mounted]);
    if (!mounted || !isOpen)
        return null;
    return createPortal(jsx("div", { className: "rrdt modal-overlay show", onClick: () => onClose(), children: jsxs("div", { ref: panel, role: "dialog", "aria-modal": "true", "aria-labelledby": titleId, tabIndex: -1, onClick: event => event.stopPropagation(), style: { backgroundColor: theme.backgroundColor }, className: `modal-container ${size === "2xl" ? "xxl" : size} open ${className}`, children: [jsx("div", { className: "modal-header-wrapper", children: jsxs("div", { className: "modal-header", style: { backgroundColor: theme.backgroundColor }, children: [jsx("div", { id: titleId, className: "modal-title", children: title }), jsx("button", { type: "button", "aria-label": "Close dialog", onClick: onClose, className: "modal-close-btn", children: jsx(CloseIcon, { className: "icon-close" }) })] }) }), jsx("hr", { style: { color: theme.borderColor } }), jsx("div", { className: `modal-body ${overflowY} ${childrenClass}`, children: children })] }) }), document.body);
}

const SelectableCheckbox = ({ row, selectableProps, theme, }) => {
    const selectedKey = selectableProps.selectedKey || "id";
    const selectedIds = selectableProps.selectedIds || [];
    const id = row[selectedKey];
    const handleCheckboxChange = useCallback((row) => {
        if (!selectableProps)
            return;
        const { selectedIds, selectedKey, onSelectChange } = selectableProps;
        const id = row?.[selectedKey || "id"];
        if (id === null || id === undefined)
            return;
        const newSelectedIds = selectedIds?.includes(id)
            ? selectedIds.filter((i) => i !== id)
            : [...(selectedIds || []), id];
        onSelectChange?.(newSelectedIds);
    }, [selectableProps]);
    return (jsx(Checkbox, { ariaLabel: `Select row ${id}`, className: "selectableCheckbox", primaryColor: theme.primaryColor, checked: selectedIds.includes(id), value: id, onChange: () => handleCheckboxChange(row) }));
};

// Keep credentials out of query keys/devtools. Identity is private to its client.
const credentialScopes = new WeakMap();
function credentialScope(client, headers) {
    let scopes = credentialScopes.get(client);
    if (!scopes) {
        scopes = new Map();
        credentialScopes.set(client, scopes);
    }
    const key = JSON.stringify(headers || {});
    if (!scopes.has(key))
        scopes.set(key, scopes.size + 1);
    return scopes.get(key);
}
const emptyRows = [];
function Table(props) {
    const { columns, mode, lang = "en", pageQueryName = "page", pageSizeQueryName = "pageSize", pageSize = defaultSize, tableName, isSelectable, noSearch, filters, topFilter, onPageChange, onPageSizeChange, onSearch, onSortChange } = props;
    const instanceId = useId();
    const root = useRef(null);
    const header = useRef(null);
    const footer = useRef(null);
    const top = useRef(null);
    const isMobile = useIsMobile(props.startMobileSize);
    const { getParams, setParams } = useQueryParams();
    const [ready, setReady] = useState(false);
    useEffect(() => { setReady(true); }, []);
    const [openFilter, setOpenFilter] = useState(false);
    const [search, setSearch] = useState("");
    const searchValue = useRef("");
    const searchCallback = useRef(onSearch);
    useEffect(() => { searchCallback.current = onSearch; }, [onSearch]);
    const searchKey = props.saveSearch && tableName ? `search_${tableName}` : null;
    useEffect(() => {
        let saved = "";
        try {
            if (searchKey)
                saved = JSON.parse(sessionStorage.getItem(searchKey) || "null")?.value || "";
        }
        catch { /* storage is optional */ }
        const restored = typeof saved === "string" ? saved : "";
        setSearch(restored);
        if (restored !== searchValue.current)
            searchCallback.current?.(restored);
        searchValue.current = restored;
    }, [searchKey]);
    const config = mode === "internal" ? props.internalApiConfig : undefined;
    const defaultOrder = config?.defaultSortBy ? {
        column: props.columnNumber ?? 0, dir: config.sortType ?? "desc", name: config.defaultSortBy,
    } : null;
    const [order, setOrder] = useState(defaultOrder);
    useEffect(() => {
        setOrder(config?.defaultSortBy ? { column: props.columnNumber ?? 0, dir: config.sortType ?? "desc", name: config.defaultSortBy } : null);
    }, [mode, config?.defaultSortBy, config?.sortType, props.columnNumber]);
    const theme = useMemo(() => ({ ...defaultColorTheme, ...props.colorTheme }), [props.colorTheme]);
    const texts = useMemo(() => ({ ...defaultTexts[lang], ...props.textsConfig }), [lang, props.textsConfig]);
    const dir = lang === "fa" ? "rtl" : "ltr";
    const [autoSize, setAutoSize] = useState(null);
    const auto = useMemo(() => ({ ...defaultAutoConfig, ...props.autoPageSizeConfig }), [props.autoPageSizeConfig]);
    const preferredSize = positiveInteger(pageSize, defaultSize);
    const size = positiveInteger(getParams(pageSizeQueryName), auto.enabled && !isMobile ? autoSize ?? preferredSize : preferredSize);
    const requestedPage = positiveInteger(getParams(pageQueryName), 1);
    useEffect(() => {
        if (!auto.enabled || isMobile)
            return;
        const query = (selector) => {
            try {
                return selector ? document.querySelector(selector) : null;
            }
            catch {
                return null;
            }
        };
        const container = query(auto.containerSelector) || root.current?.parentElement;
        const calculate = () => {
            if (!container || container.clientHeight <= 0)
                return;
            const internal = [header.current, footer.current, top.current];
            const additional = (auto.subtractSelectors || []).map(selector => {
                // Historical IDs are now local to each table, not global duplicate IDs.
                if (selector === "#table-header-actions")
                    return header.current;
                if (selector === "#topFilter")
                    return top.current;
                if (selector === "#paging")
                    return footer.current;
                return query(selector);
            });
            const elements = new Set([...internal, ...additional]);
            const subtract = Array.from(elements).reduce((sum, el) => sum + (el?.clientHeight || 0), 0);
            const optional = (auto.optionalSelectorsForExtraBuffer || []).some(selector => {
                const el = selector === "#topFilter" ? top.current : selector === "#paging" ? footer.current : query(selector);
                return !!el && el.clientHeight > 0;
            });
            const rowHeight = Number.isFinite(auto.rowHeight) && auto.rowHeight > 0 ? auto.rowHeight : 51.15;
            const buffer = Math.max(0, auto.baseBufferRows ?? 2) + (optional ? Math.max(0, auto.extraBufferRows ?? 1) : 0);
            setAutoSize(Math.max(1, Math.floor((container.clientHeight - subtract) / rowHeight) - buffer));
        };
        calculate();
        const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(calculate);
        if (container)
            observer?.observe(container);
        [header.current, footer.current, top.current].forEach(el => { if (el)
            observer?.observe(el); });
        window.addEventListener("resize", calculate);
        return () => { observer?.disconnect(); window.removeEventListener("resize", calculate); };
    }, [auto, isMobile]);
    const staticRows = mode === "static" ? props.staticRows || emptyRows : emptyRows;
    const processed = useMemo(() => localRows(staticRows, columns, search, order), [staticRows, columns, search, order]);
    const preliminaryTotal = mode === "static" ? processed.length : mode === "external" ? Math.max(0, props.totalItems || 0) : 0;
    const preliminaryPage = mode === "static" ? Math.min(requestedPage, Math.max(1, Math.ceil(preliminaryTotal / size))) : requestedPage;
    const requestColumns = useMemo(() => [{ data: "id", title: texts.row || "", searchable: false, orderable: true }, ...columns]
        .filter(col => col.data !== null).map(col => ({ data: col.data, name: col.data, searchable: !!col.searchable,
        orderable: !!col.orderable, search: { value: "", regex: false, fixed: [] } })), [columns, texts.row]);
    const refreshBody = JSON.stringify((config?.customBody || []).filter(item => !item.noRefresh));
    const previousBody = useRef(null);
    const previousMode = useRef(mode);
    const bodyChanged = mode === "internal" && previousMode.current === mode && previousBody.current !== null && previousBody.current !== refreshBody;
    useEffect(() => {
        if (bodyChanged)
            setParams({ [pageQueryName]: "1" });
        previousMode.current = mode;
        previousBody.current = mode === "internal" ? refreshBody : null;
    }, [mode, refreshBody, bodyChanged, setParams, pageQueryName]);
    const pageForRequest = bodyChanged ? 1 : preliminaryPage;
    const sharedClient = useContext(QueryClientContext);
    const [privateClient] = useState(() => new QueryClient({ defaultOptions: { queries: { retry: false } } }));
    const client = sharedClient || privateClient;
    const callbacks = useRef({ config, notify: props.notify });
    useEffect(() => { callbacks.current = { config, notify: props.notify }; });
    const query = useQuery({
        enabled: ready && mode === "internal" && !!config,
        queryKey: ["responsive-react-datatable", tableName || instanceId, config?.baseUrl, config?.endpoint,
            config?.method || "POST", config?.payload, requestColumns, credentialScope(client, config?.headers),
            pageForRequest, size, search, order, refreshBody],
        refetchOnWindowFocus: false,
        throwOnError: false,
        queryFn: async ({ signal }) => {
            const current = config;
            const payload = { draw: pageForRequest, columns: requestColumns, order: order ? [order] : [],
                start: (pageForRequest - 1) * size, length: size, search: { value: search, regex: false, fixed: [] } };
            for (const { noRefresh: _noRefresh, isFilter: _isFilter, ...rest } of current.customBody || [])
                Object.assign(payload, rest);
            const response = await axios({ ...requestConfig(current, payload), signal });
            if (!response.data || typeof response.data !== "object")
                throw new Error("Invalid table response: expected an object");
            if (response.data.data != null && !Array.isArray(response.data.data))
                throw new Error("Invalid table response: data must be an array");
            return response.data;
        },
    }, client);
    const lastSuccess = useRef(null);
    useEffect(() => {
        if (mode !== "internal" || !query.data || query.data === lastSuccess.current)
            return;
        lastSuccess.current = query.data;
        callbacks.current.config?.onFetch?.(query.data);
        if (query.data.data === null)
            callbacks.current.notify?.(query.data.message || "null data", "warning");
        setOpenFilter(false);
    }, [mode, query.data]);
    useEffect(() => {
        if (mode === "internal" && query.error)
            callbacks.current.notify?.(query.error.message, "error");
    }, [mode, query.error]);
    const total = mode === "internal" ? Math.max(0, Number(query.data?.recordsFiltered) || 0) : preliminaryTotal;
    const page = total > 0 || mode === "static" ? Math.min(requestedPage, Math.max(1, Math.ceil(total / size))) : requestedPage;
    const previousPage = useRef(1);
    const pageCallback = useRef(onPageChange);
    useEffect(() => { pageCallback.current = onPageChange; }, [onPageChange]);
    useEffect(() => {
        if (previousPage.current !== page) {
            previousPage.current = page;
            pageCallback.current?.(page);
        }
        if (page !== requestedPage)
            setParams({ [pageQueryName]: String(page) });
    }, [page, requestedPage, pageQueryName, setParams]);
    const changePage = useCallback((next) => setParams({ [pageQueryName]: String(positiveInteger(next, 1)) }), [pageQueryName, setParams]);
    const changeSearch = (next) => {
        searchValue.current = next;
        setSearch(next);
        changePage(1);
        onSearch?.(next);
        try {
            if (searchKey)
                sessionStorage.setItem(searchKey, JSON.stringify({ value: next }));
        }
        catch { /* optional */ }
    };
    const changeSize = (next) => {
        setParams({ [pageSizeQueryName]: String(positiveInteger(next, preferredSize)), [pageQueryName]: "1" });
        onPageSizeChange?.(positiveInteger(next, preferredSize));
    };
    const changeOrder = (next) => {
        const index = next ? requestColumns.findIndex(col => col.data === next.name) : -1;
        const mapped = next ? { ...next, column: index } : null;
        setOrder(mapped);
        changePage(1);
        onSortChange?.(mapped);
    };
    const rows = mode === "static" ? processed.slice((page - 1) * size, page * size) :
        mode === "external" ? props.externalRows || emptyRows : query.data?.data || emptyRows;
    const selectable = isSelectable ? props : undefined;
    const selectedKey = selectable?.selectedKey || "id";
    // Static: all filtered rows; server modes: loaded page. Preserve other pages' IDs.
    const selectableRows = mode === "static" ? processed : rows;
    const selectableIds = Array.from(new Set(selectableRows.map((row) => row[selectedKey])
        .filter((id) => typeof id === "string" || typeof id === "number")));
    const selectedIds = selectable?.selectedIds || [];
    const allSelected = selectableIds.length > 0 && selectableIds.every(id => selectedIds.includes(id));
    const someSelected = selectableIds.some(id => selectedIds.includes(id));
    const selectAll = () => selectable?.onSelectChange?.(allSelected ? selectedIds.filter(id => !selectableIds.includes(id)) : Array.from(new Set([...selectedIds, ...selectableIds])));
    const displayColumns = [
        ...(selectable ? [{ data: "selectableTable", title: "", width: 50, orderable: false, searchable: false,
                render: (_cell, row) => jsx(SelectableCheckbox, { row: row, selectableProps: selectable, theme: theme }) }] : []),
        { data: "id", title: texts.row || "", render: (_cell, _row, index = 0) => (page - 1) * size + index + 1,
            orderable: true, width: 70, searchable: false }, ...columns,
    ];
    const loading = props.isLoading || (mode === "internal" && (!ready || query.isFetching || bodyChanged));
    const activeFilterCount = (config?.customBody || []).filter(item => item.isFilter && Object.entries(item)
        .some(([key, value]) => key !== "isFilter" && key !== "noRefresh" && value != null && value !== "")).length;
    const pageSelect = jsx(PageSizeSelect, { pageSize: size, initialPageSize: autoSize ?? preferredSize, theme: theme, textsConfig: texts, onPageSizeChange: changeSize });
    return jsxs("div", { ref: root, className: "rrdt table-container", dir: dir, "aria-busy": !!loading, children: [!isMobile && topFilter && jsx("div", { ref: top, className: `top-filter-container ${props.topFilterContainerClassName || ""}`, children: topFilter }), jsxs("div", { ref: header, className: "table-header-actions", children: [jsxs("div", { className: "search-container-table", children: [!noSearch && jsx(SearchBox, { value: search, onSearch: changeSearch, theme: theme, mergedTexts: texts, dir: dir }), !isMobile && filters && jsx("div", { className: `${props.filterContainerClassName || ""} filter-container-className`, children: filters })] }), isMobile && (filters || topFilter) && jsxs("button", { type: "button", onClick: () => setOpenFilter(true), style: { minHeight: 43, background: "#427bd225", color: "#427bd2" }, className: "mobile-filter-button", children: [activeFilterCount > 0 && jsx("span", { className: "mobile-filter-badge", children: activeFilterCount }), texts.filterText, jsx(FilterIcon, {})] }), jsxs("div", { className: "actionButtons", children: [props.actionButtons, !isMobile && !props.noPageSize && pageSelect] })] }), isMobile ? jsx(MobileTable, { columns: displayColumns, rows: rows, isLoading: !!loading, theme: theme, textsConfig: texts, listMode: props.listMode, rowKey: props.rowKey || selectedKey }) :
                jsx(DesktopTable$1, { columns: displayColumns, rows: rows, isLoading: !!loading, theme: theme, textsConfig: texts, pageSize: size, maxHeight: props.height || `${(size + 1) * (auto.rowHeight || 51.15)}px`, rowHeight: `${auto.rowHeight || 51.15}px`, rowClassName: props.rowClassName, rowKey: props.rowKey || selectedKey, order: order, onOrderChange: changeOrder, isAllSelected: allSelected, isIndeterminate: someSelected && !allSelected, onAllSelect: selectAll }), jsxs("div", { ref: footer, className: "table-footer", children: [total > 0 && jsx(Pagination, { dir: dir, startMobileSize: props.startMobileSize, totalItems: total, pageSize: size, queryName: pageQueryName, theme: theme, textsConfig: texts, currentPage: page, onChangePage: changePage }), isMobile && !props.noPageSize && pageSelect] }), jsxs(Modal, { size: "lg", title: texts.filterText, isOpen: openFilter, onClose: () => setOpenFilter(false), className: "filter-modal", theme: theme, children: [jsxs("div", { className: "filter-modal-content space-items", children: [filters, topFilter] }), jsxs("div", { className: "filter-modal-actions", children: [jsx("button", { type: "button", onClick: () => setOpenFilter(false), className: "filter-modal-close-button", children: texts.close }), jsxs("button", { type: "button", className: "filter-modal-clear-button", onClick: () => {
                                    changeSearch("");
                                    try {
                                        if (props.removeFilterKey)
                                            sessionStorage.removeItem(props.removeFilterKey);
                                        if (searchKey)
                                            sessionStorage.removeItem(searchKey);
                                    }
                                    catch { /* optional */ }
                                    props.onClearFilters?.();
                                    setOpenFilter(false);
                                }, children: [texts.removeFilterText, jsx(TrashIcon, {})] })] })] })] });
}
var Table_default = React.memo(Table);

function DropDownMenu({ button, children, className }) {
    const [open, setOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const trigger = useRef(null);
    const menu = useRef(null);
    const menuId = useId();
    useEffect(() => { setMounted(true); }, []);
    useEffect(() => {
        if (!open)
            return;
        const items = () => Array.from(menu.current?.querySelectorAll('button,a[href]') || []);
        items()[0]?.focus();
        const close = () => { setOpen(false); trigger.current?.querySelector('button,[tabindex]')?.focus(); };
        const outside = (event) => { if (!menu.current?.contains(event.target) && !trigger.current?.contains(event.target))
            setOpen(false); };
        const keydown = (event) => {
            if (event.key === "Escape") {
                event.preventDefault();
                close();
            }
            if (event.key === "Tab")
                setOpen(false);
            if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                event.preventDefault();
                const list = items();
                const current = list.indexOf(document.activeElement);
                list[(current + (event.key === "ArrowDown" ? 1 : -1) + list.length) % list.length]?.focus();
            }
        };
        const reposition = () => { const rect = trigger.current?.getBoundingClientRect(); if (rect)
            setPosition({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX }); };
        document.addEventListener("mousedown", outside);
        document.addEventListener("keydown", keydown);
        window.addEventListener("resize", reposition);
        window.addEventListener("scroll", reposition, true);
        return () => {
            document.removeEventListener("mousedown", outside);
            document.removeEventListener("keydown", keydown);
            window.removeEventListener("resize", reposition);
            window.removeEventListener("scroll", reposition, true);
        };
    }, [open]);
    const handleOpen = () => {
        const rect = trigger.current?.getBoundingClientRect();
        if (rect)
            setPosition({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX });
        setOpen(value => !value);
    };
    const triggerButton = isValidElement(button) ? cloneElement(button, {
        "aria-expanded": open, "aria-controls": open ? menuId : undefined, "aria-haspopup": "menu",
    }) : button;
    return jsxs("div", { className: "rrdt dropdown-container", children: [jsx("div", { ref: trigger, className: "dropdown-trigger", onClick: handleOpen, onKeyDown: event => { if (event.key === "ArrowDown") {
                    event.preventDefault();
                    handleOpen();
                } }, children: triggerButton }), mounted && open && createPortal(jsx("div", { ref: menu, id: menuId, className: `rrdt dropdown-menu ${className || ""}`, style: { position: "absolute", ...position, zIndex: 9999 }, onClick: () => { setOpen(false); trigger.current?.querySelector('button')?.focus(); }, children: children }), document.body)] });
}

function ActionDropDown({ options, button, lastItem, text, }) {
    const renderButton = button
        ? typeof button === "function"
            ? button()
            : button
        : text
            ? managementButton(text)
            : actionButton();
    return (jsx(Fragment, { children: jsx(DropDownMenu, { button: renderButton, className: "DropDownMenu", children: jsx("ul", { role: "menu", className: "dropdown-list", children: options?.map((option, index) => !option.hidden && (jsx("li", { className: `dropdown-item ${lastItem && index === options?.length - 1
                        ? "dropdown-item--last"
                        : ""}`, role: "none", children: option?.href ? (jsx("a", { role: "menuitem", onClick: option.onClick, href: option.href, className: "dropdown-link", children: jsxs(Fragment, { children: [option.Icon && (jsx(option.Icon, { className: "dropdown-icon" })), option.label] }) })) : (jsxs("button", { type: "button", role: "menuitem", onClick: option.onClick, className: "dropdown-link", children: [option.Icon && (jsx(option.Icon, { className: "dropdown-icon" })), option.label] })) }, index))) }) }) }));
}
const actionButton = () => {
    return (jsx("button", { type: "button", "aria-label": "Actions", style: {
            backgroundColor: "#fefefe",
        }, className: "cursor-pointer option-button", children: jsx(BiDotsVerticalRounded, {}) }));
};
const managementButton = (text) => {
    return (jsxs("button", { type: "button", "aria-label": "Actions", style: {
            backgroundColor: "#fefefe",
        }, className: "cursorPointer option-button managementButton", children: [text, jsx(ChevronDown, {})] }));
};

export { ActionDropDown, Table_default as Table, Table_default as default, rowRenderer };
//# sourceMappingURL=index.mjs.map
