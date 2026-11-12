import type { ExportCellValue, ExportFormat } from "../types";
import { cellText, csvContent, safeFileName } from "./data";

export async function createExportBlob(format: ExportFormat, headers: string[], rows: ExportCellValue[][], rtl = false): Promise<Blob> {
  if (format === "csv") return new Blob([csvContent(headers, rows)], { type: "text/csv;charset=utf-8" });
  if (format === "xlsx") {
    const { xlsxBytes } = await import("./xlsx");
    return new Blob([xlsxBytes(headers, rows, rtl)], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  }
  const [{ jsPDF }, { autoTable }, { default: font }] = await Promise.all([
    import("jspdf"), import("jspdf-autotable"), import("./pdfFont"),
  ]);
  const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
  doc.addFileToVFS("Vazirmatn-Regular.ttf", font);
  doc.addFont("Vazirmatn-Regular.ttf", "Vazirmatn", "normal");
  doc.setFont("Vazirmatn");
  const values = rows.map(row => row.map(cellText));
  autoTable(doc, {
    head: [rtl ? [...headers].reverse() : headers],
    body: rtl ? values.map(row => [...row].reverse()) : values,
    styles: { font: "Vazirmatn", fontStyle: "normal", fontSize: 10, overflow: "linebreak", halign: rtl ? "right" : "left" },
    headStyles: { fontStyle: "normal", fillColor: [38, 38, 38] },
    margin: 28, horizontalPageBreak: true,
    willDrawCell: ({ cell }) => { doc.setR2L(/[\u0600-\u06ff]/.test(cell.text.join(" "))); },
  });
  return doc.output("blob");
}

export function downloadBlob(blob: Blob, name: string, format: ExportFormat) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${safeFileName(name)}.${format}`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  // Leave time for the browser to consume the download URL.
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}
