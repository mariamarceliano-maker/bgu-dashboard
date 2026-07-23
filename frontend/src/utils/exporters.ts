import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { KPI } from "../types";

const EXPORT_COLUMNS: { key: keyof KPI; label: string }[] = [
  { key: "dashboard", label: "Dashboard" },
  { key: "codigo", label: "Código" },
  { key: "nombre", label: "Nombre" },
  { key: "dimension", label: "Dimensión" },
  { key: "objetivo", label: "Objetivo" },
  { key: "meta", label: "Meta" },
  { key: "resultado", label: "Resultado" },
  { key: "estado", label: "Estado" },
  { key: "responsable", label: "Responsable" },
];

export function exportKpisToExcel(rows: KPI[], filename = "lista_completa_kpi.xlsx") {
  const data = rows.map((r) =>
    Object.fromEntries(EXPORT_COLUMNS.map((c) => [c.label, r[c.key] ?? ""]))
  );
  const worksheet = XLSX.utils.json_to_sheet(data);
  worksheet["!cols"] = EXPORT_COLUMNS.map((c) => ({
    wch: c.key === "nombre" ? 45 : c.key === "dimension" || c.key === "objetivo" ? 28 : 16,
  }));
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "KPI");
  XLSX.writeFile(workbook, filename);
}

export function exportKpisToPdf(rows: KPI[], filename = "lista_completa_kpi.pdf") {
  const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });

  doc.setFontSize(14);
  doc.setTextColor(15, 42, 84);
  doc.text("Blackwell Global University — Lista Completa de KPI", 40, 34);
  doc.setFontSize(9);
  doc.setTextColor(90, 100, 120);
  doc.text(`Generado: ${new Date().toLocaleString("es-PE")} · ${rows.length} indicadores`, 40, 50);

  autoTable(doc, {
    startY: 64,
    head: [EXPORT_COLUMNS.map((c) => c.label)],
    body: rows.map((r) => EXPORT_COLUMNS.map((c) => String(r[c.key] ?? ""))),
    styles: { fontSize: 7, cellPadding: 4, overflow: "linebreak" },
    headStyles: { fillColor: [15, 42, 84], textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [244, 246, 250] },
    columnStyles: {
      2: { cellWidth: 190 }, // nombre
    },
    margin: { left: 40, right: 40 },
  });

  doc.save(filename);
}
