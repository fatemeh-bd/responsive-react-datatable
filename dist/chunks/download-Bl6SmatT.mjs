"use client";
import { c as csvContent, a as cellText, s as safeFileName } from './index-ChrjzfzR.mjs';
import 'react/jsx-runtime';
import 'react';
import '@tanstack/react-query';
import 'axios';
import 'swiper/react';
import 'swiper/modules';
import 'react-dom';

async function createExportBlob(format, headers, rows, rtl = false) {
    if (format === "csv")
        return new Blob([csvContent(headers, rows)], { type: "text/csv;charset=utf-8" });
    if (format === "xlsx") {
        const { xlsxBytes } = await import('./xlsx-DrYGsLze.mjs');
        return new Blob([xlsxBytes(headers, rows, rtl)], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    }
    const [{ jsPDF }, { autoTable }, { default: font }] = await Promise.all([
        import('jspdf'), import('jspdf-autotable'), import('./pdfFont-DnhFWgjk.mjs'),
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
function downloadBlob(blob, name, format) {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${safeFileName(name)}.${format}`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    // Leave time for the browser to consume the download URL.
    setTimeout(() => URL.revokeObjectURL(url), 60000);
}

export { createExportBlob, downloadBlob };
//# sourceMappingURL=download-Bl6SmatT.mjs.map
