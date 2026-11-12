import { useEffect, useRef, useState } from "react";
import type { ColumnType, ColorTheme, ExportConfig, ExportContext, ExportFormat, ExportScope, TextsConfig } from "../types";
import { canExport, columnId, exportData } from "../export/data";
import Modal from "./Modal";

export default function TableTools({ columns, hiddenIds, onHiddenChange, columnVisibility, config, context,
  pageRows, filteredRows, staticMode, selectedKey, theme, texts, rtl, disabled }: {
  columns: ColumnType[]; hiddenIds: string[]; onHiddenChange: (ids: string[]) => void; columnVisibility?: boolean;
  config?: boolean | ExportConfig; context: ExportContext; pageRows: any[]; filteredRows: any[]; staticMode: boolean;
  selectedKey: string; theme: ColorTheme; texts: TextsConfig; rtl: boolean; disabled?: boolean;
}) {
  const [panel, setPanel] = useState<"columns" | "export" | null>(null);
  const settings = typeof config === "object" ? config : {};
  const [scope, setScope] = useState<ExportScope>(settings.scope ?? (staticMode || settings.getRows ? "filtered" : "page"));
  const [includeHidden, setIncludeHidden] = useState(!!settings.includeHiddenColumns);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const inFlight = useRef(false);
  const mounted = useRef(false);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  const canGetAll = staticMode || !!settings.getRows;
  const effectiveScope = scope === "filtered" && !canGetAll ? "page" : scope;
  const formats = Array.from(new Set(settings.formats ?? ["csv", "xlsx", "pdf"] as ExportFormat[]));
  const available = columns.filter((column, index) => canExport(column) && (includeHidden || !hiddenIds.includes(columnId(column, index))));
  const exportRows = async (format: ExportFormat) => {
    if (inFlight.current) return;
    inFlight.current = true; setBusy(true); setError(false);
    try {
      let source = settings.getRows ? await settings.getRows({ ...context, scope: effectiveScope }) :
        staticMode && effectiveScope !== "page" ? filteredRows : pageRows;
      if (!Array.isArray(source)) throw new Error("exportConfig.getRows must return an array");
      if (effectiveScope === "selected") source = source.filter(row => context.selectedIds.includes(row[selectedKey]));
      const data = exportData(available, source);
      const { createExportBlob, downloadBlob } = await import("../export/download");
      const blob = await createExportBlob(format, data.headers, data.rows, rtl);
      if (mounted.current) downloadBlob(blob, settings.fileName || "table-export", format);
    } catch (cause) {
      if (mounted.current) {
        setError(true);
        settings.onError?.(cause instanceof Error ? cause : new Error(String(cause)));
      }
    } finally {
      inFlight.current = false;
      if (mounted.current) setBusy(false);
    }
  };
  return <div className="table-tools">
    {columnVisibility && <button type="button" className="table-tool-button" onClick={() => setPanel("columns")}>{texts.columnsText}</button>}
    {config && <button type="button" className="table-tool-button" disabled={disabled || busy || !formats.length} onClick={() => { setError(false); setPanel("export"); }}>{texts.exportText}</button>}
    <Modal isOpen={panel === "columns"} title={texts.columnsText} onClose={() => setPanel(null)} theme={theme} size="sm">
      <fieldset className="table-column-options"><legend className="rrdt-sr-only">{texts.columnsText}</legend>
        {columns.map((column, index) => {
          const id = columnId(column, index);
          return <label key={id}><input type="checkbox" checked={!hiddenIds.includes(id)} disabled={column.hideable === false}
            onChange={() => onHiddenChange(hiddenIds.includes(id) ? hiddenIds.filter(value => value !== id) : [...hiddenIds, id])} />{column.title || id}</label>;
        })}
      </fieldset>
    </Modal>
    <Modal isOpen={panel === "export"} title={texts.exportText} onClose={() => { if (!busy) setPanel(null); }} theme={theme} size="sm">
      <div className="table-export-options" aria-busy={busy}>
        <label>{texts.exportScopeText}<select aria-label={texts.exportScopeText} value={effectiveScope} disabled={busy}
          onChange={event => setScope(event.target.value as ExportScope)}>
          {canGetAll && <option value="filtered">{texts.exportFilteredText}{staticMode ? ` (${filteredRows.length})` : ""}</option>}
          <option value="page">{texts.exportPageText} ({pageRows.length})</option>
          <option value="selected" disabled={!context.selectedIds.length}>{texts.exportSelectedText}</option>
        </select></label>
        {!staticMode && !settings.getRows && <p className="table-export-note">{texts.exportLoadedText}</p>}
        <label className="table-export-visible"><input type="checkbox" checked={!includeHidden} disabled={busy}
          onChange={event => setIncludeHidden(!event.target.checked)} />{texts.exportVisibleText}</label>
        <div className="table-export-formats">{formats.map(format => <button key={format} type="button" className="table-tool-button"
          disabled={busy || disabled || !available.length || (effectiveScope === "selected" && !context.selectedIds.length)}
          onClick={() => { void exportRows(format); }}>{format === "xlsx" ? "Excel (.xlsx)" : format.toUpperCase()}</button>)}</div>
        {busy && <p role="status">{texts.exportingText}</p>}
        {error && <p role="alert">{texts.exportErrorText}</p>}
      </div>
    </Modal>
  </div>;
}
