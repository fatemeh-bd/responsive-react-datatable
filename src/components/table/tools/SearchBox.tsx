import { useEffect, useRef, useState } from "react";
import { CloseIcon, SearchIcon } from "../icons";
import type { ColorTheme, TextsConfig } from "../types";
export default function SearchBox({ value, onSearch, theme, mergedTexts, dir }: {
  value: string; onSearch: (value: string) => void; theme: ColorTheme;
  mergedTexts: TextsConfig; dir: "ltr" | "rtl";
}) {
  const [input, setInput] = useState(value);
  const callback = useRef(onSearch);
  useEffect(() => { callback.current = onSearch; }, [onSearch]);
  useEffect(() => { setInput(value); }, [value]);
  useEffect(() => {
    if (input === value) return;
    const timer = setTimeout(() => callback.current(input), 400);
    return () => clearTimeout(timer);
  }, [input, value]);
  return <div className="table-search-container"><div className="table-search-wrapper">
    <div className="table-search-input-container" style={{ borderColor: theme.borderColor, backgroundColor: theme.backgroundColor }}>
      {input ? <button type="button" className="table-search-clear-button" aria-label={dir === "rtl" ? "پاک کردن جستجو" : "Clear search"} onClick={() => setInput("")}><CloseIcon className="table-search-clear-icon" /></button> : <SearchIcon className="table-search-icon" />}
      <input type="search" aria-label={mergedTexts.searchPlaceholder || "Search"} value={input}
        placeholder={mergedTexts.searchPlaceholder} className="table-search-input" onChange={event => setInput(event.target.value)} />
    </div></div></div>;
}
