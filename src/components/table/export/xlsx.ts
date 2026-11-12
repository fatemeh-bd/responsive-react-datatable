import { strToU8, zipSync } from "fflate";
import type { ExportCellValue } from "../types";
import { cellText } from "./data";

// Minimal SpreadsheetML workbook: typed values and inline strings, never formulas.
const main = "http://schemas.openxmlformats.org/spreadsheetml/2006/main";
const rel = "http://schemas.openxmlformats.org/officeDocument/2006/relationships";
const xml = (text: string) => text.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, "")
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
function letter(index: number): string {
  let result = "";
  for (let value = index + 1; value > 0; value = Math.floor((value - 1) / 26)) result = String.fromCharCode(65 + (value - 1) % 26) + result;
  return result;
}
export function xlsxBytes(headers: string[], rows: ExportCellValue[][], rtl: boolean) {
  if (!headers.length || headers.length > 16384 || rows.length > 1048575) throw new Error("Data exceeds Excel worksheet limits");
  const last = `${letter(headers.length - 1)}${rows.length + 1}`;
  const cell = (value: ExportCellValue, address: string, header: boolean) => {
    const style = header ? ' s="1"' : "";
    if (typeof value === "number" && Number.isFinite(value)) return `<c r="${address}"${style}><v>${value}</v></c>`;
    if (typeof value === "boolean") return `<c r="${address}" t="b"${style}><v>${value ? 1 : 0}</v></c>`;
    return `<c r="${address}" t="inlineStr"${style}><is><t xml:space="preserve">${xml(cellText(value))}</t></is></c>`;
  };
  const sheetRows = [headers, ...rows].map((row, index) => `<row r="${index + 1}">${row.map((value, col) => cell(value, `${letter(col)}${index + 1}`, index === 0)).join("")}</row>`).join("");
  const parts: Record<string, string> = {
    "[Content_Types].xml": '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>',
    "_rels/.rels": `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="${rel}/officeDocument" Target="xl/workbook.xml"/></Relationships>`,
    "xl/workbook.xml": `<workbook xmlns="${main}" xmlns:r="${rel}"><sheets><sheet name="Data" sheetId="1" r:id="rId1"/></sheets></workbook>`,
    "xl/_rels/workbook.xml.rels": `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="${rel}/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="${rel}/styles" Target="styles.xml"/></Relationships>`,
    "xl/styles.xml": `<styleSheet xmlns="${main}"><fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><name val="Calibri"/></font></fonts><fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill></fills><borders count="1"><border/></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="2"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1"/></cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>`,
    "xl/worksheets/sheet1.xml": `<worksheet xmlns="${main}"><dimension ref="A1:${last}"/><sheetViews><sheetView workbookViewId="0" rightToLeft="${rtl ? 1 : 0}"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews><cols><col min="1" max="${headers.length}" width="24" customWidth="1"/></cols><sheetData>${sheetRows}</sheetData><autoFilter ref="A1:${last}"/></worksheet>`,
  };
  const files: Record<string, Uint8Array> = {};
  for (const [name, content] of Object.entries(parts)) files[name] = strToU8(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>${content}`);
  return zipSync(files, { level: 6 });
}
