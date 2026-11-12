// @vitest-environment node
import { describe, expect, it } from "vitest";
import { strFromU8, unzipSync } from "fflate";
import { csvContent, exportData } from "../src/components/table/export/data";
import { createExportBlob } from "../src/components/table/export/download";

describe("file contents", () => {
  it("quotes CSV cells, preserves numeric negatives and neutralizes formula text", () => {
    const value = csvContent(["Name", "Value"], [['A, "B"\nC', "=HYPERLINK(1)"], ["فارسی", -12], ["test", "\t+SUM(1)"]]);
    expect(value.startsWith("\uFEFF")).toBe(true);
    expect(value).toContain('"A, ""B""\nC"');
    expect(value).toContain("'=HYPERLINK(1)"); expect(value).toContain('"-12"'); expect(value).toContain("'\t+SUM(1)");
  });
  it("uses explicit export formatters instead of renderers", () => {
    const data = exportData([{ data: "amount", title: "Amount", exportValue: row => row.amount / 100 }], [{ amount: 1234 }]);
    expect(data).toEqual({ headers: ["Amount"], rows: [[12.34]] });
  });
  it("writes a real XLSX archive with typed values, escaped text and no executable formulas", async () => {
    const blob = await createExportBlob("xlsx", ["Name", "Amount", "Active"], [["سمیرا & <team>", 12.5, true], ["=SUM(1,2)", -3, false]], true);
    const files = unzipSync(new Uint8Array(await blob.arrayBuffer()));
    expect(files["[Content_Types].xml"]).toBeTruthy(); expect(files["xl/workbook.xml"]).toBeTruthy();
    const sheet = strFromU8(files["xl/worksheets/sheet1.xml"]);
    expect(sheet).toContain("سمیرا &amp; &lt;team&gt;"); expect(sheet).toContain('rightToLeft="1"');
    expect(sheet).toContain('<c r="B2"><v>12.5</v></c>'); expect(sheet).toContain('t="b"><v>1</v>');
    expect(sheet).toContain("=SUM(1,2)"); expect(sheet).not.toContain("<f>");
  });
  it("writes a PDF with an embedded Unicode font", async () => {
    const blob = await createExportBlob("pdf", ["Name", "نام"], [["Sara", "سمیرا"]], true);
    const text = new TextDecoder("latin1").decode(await blob.arrayBuffer());
    expect(text.startsWith("%PDF-")).toBe(true); expect(text).toContain("/FontFile2"); expect(blob.size).toBeGreaterThan(10000);
  }, 15_000);
});
