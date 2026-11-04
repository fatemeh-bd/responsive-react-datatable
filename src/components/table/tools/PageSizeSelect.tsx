import type { ColorTheme, TextsConfig } from "../types";
import { ChevronDown } from "../icons";
export default function PageSizeSelect({ pageSize, initialPageSize, theme, textsConfig, onPageSizeChange }: {
  pageSize: number; initialPageSize?: number; theme: ColorTheme; textsConfig: TextsConfig;
  onPageSizeChange: (size: number) => void;
}) {
  const sizes = Array.from(new Set([initialPageSize || pageSize, pageSize, 20, 50, 100, 200, 300])).sort((a,b) => a-b);
  return <div className="page-size-select-container"><span className="page-size-select-label">{textsConfig.pageSize}</span>
    <div className="pageSizeParent"><select aria-label={textsConfig.pageSize || "Page size"} value={pageSize}
      onChange={event => onPageSizeChange(Number(event.target.value))} className="page-size-select cursorPointer"
      style={{ borderColor: theme.borderColor, backgroundColor: theme.backgroundColor }}>
      {sizes.map(size => <option key={size} value={size}>{size}</option>)}
    </select><ChevronDown className="page-size-select-icon" /></div></div>;
}
