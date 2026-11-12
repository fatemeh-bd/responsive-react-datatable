import type { ReactNode } from "react";
import { ChevronDown } from "./icons";
export interface RowExpansion {
  canExpand: (row: any) => boolean;
  isExpanded: (row: any) => boolean;
  toggle: (row: any) => void;
  render: (row: any, index: number) => ReactNode;
  expandText: string;
  collapseText: string;
  detailsText: string;
}
export function RowDetailsButton({ expanded, onToggle, label, panelId }: {
  expanded: boolean; onToggle: () => void; label: string; panelId: string;
}) {
  return <button type="button" className="table-expand-button" aria-label={label} aria-expanded={expanded}
    aria-controls={expanded ? panelId : undefined} onClick={onToggle}><span aria-hidden="true" className={`table-expand-chevron${expanded ? " is-expanded" : ""}`}><ChevronDown /></span></button>;
}
