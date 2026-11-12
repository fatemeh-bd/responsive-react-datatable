import type { ColumnType, ExportCellValue } from "../types";

export const columnId = (column: ColumnType, index: number) => column.id ?? column.data ?? `column-${index}`;
export const canExport = (column: ColumnType) => column.exportable !== false && (column.data !== null || !!column.exportValue);

export function exportData(columns: ColumnType[], rows: any[]): { headers: string[]; rows: ExportCellValue[][] } {
  return {
    headers: columns.map(column => column.title),
    rows: rows.map(row => columns.map(column => {
      const value = column.exportValue ? column.exportValue(row) : column.data !== null ? row[column.data] : null;
      if (value == null || value instanceof Date || ["string", "number", "boolean"].includes(typeof value)) return value;
      // Rendered React elements never enter the file. Structured values require an explicit formatter.
      return JSON.stringify(value);
    })),
  };
}

export function cellText(value: ExportCellValue): string {
  return value == null ? "" : value instanceof Date ? value.toISOString() : String(value);
}

export function csvContent(headers: string[], rows: ExportCellValue[][]) {
  const quote = (value: ExportCellValue) => {
    let text = cellText(value);
    // Keep user data as text when opened by spreadsheet applications.
    if (/^[\s\u0000-\u001f]*[=+@-]/.test(text) && typeof value !== "number") text = `'${text}`;
    return `"${text.replace(/"/g, '""')}"`;
  };
  return "\uFEFF" + [headers, ...rows].map(row => row.map(quote).join(",")).join("\r\n");
}

export function safeFileName(value = "table-export") {
  return value.replace(/\.(?:csv|xlsx|pdf)$/i, "").replace(/[<>:"/\\|?*\u0000-\u001f]/g, "-").trim().slice(0, 120) || "table-export";
}
