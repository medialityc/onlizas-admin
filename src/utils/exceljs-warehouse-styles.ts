import ExcelJS from "exceljs";

const INDIGO = "FF4F46E5";
const INDIGO_100 = "FFE0E7FF";
const INDIGO_800 = "FF3730A3";
const ZEBRA_A = "FFF5F3FF";
const ZEBRA_B = "FFFFFFFF";
const BORDER_C = "FFC7D2FE";
const TEXT_DARK = "FF374151";

export function wsBorder(): Partial<ExcelJS.Borders> {
  const thin = { style: "thin" as const, color: { argb: BORDER_C } };
  return { top: thin, left: thin, bottom: thin, right: thin };
}

export function wsTitle(
  ws: ExcelJS.Worksheet,
  title: string,
  colCount: number,
  bgArgb = INDIGO_100,
) {
  ws.mergeCells(1, 1, 1, colCount);
  const cell = ws.getCell(1, 1);
  cell.value = title;
  cell.font = { size: 13, bold: true, color: { argb: "FF1F2937" } };
  cell.alignment = { horizontal: "center", vertical: "middle" };
  cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: bgArgb } };
  ws.getRow(1).height = 26;
}

export function wsHeaders(
  ws: ExcelJS.Worksheet,
  headers: string[],
  rowNum: number,
  bgArgb = INDIGO,
) {
  const row = ws.getRow(rowNum);
  row.height = 20;
  headers.forEach((h, i) => {
    const cell = row.getCell(i + 1);
    cell.value = h;
    cell.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 10 };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: bgArgb },
    };
    cell.alignment = { horizontal: "center", vertical: "middle" };
    cell.border = wsBorder();
  });
}

export function wsDataRows(
  ws: ExcelJS.Worksheet,
  data: (string | number | null | undefined)[][],
  startRow: number,
) {
  data.forEach((rowData, idx) => {
    const row = ws.getRow(startRow + idx);
    row.height = 15;
    const bgArgb = idx % 2 === 0 ? ZEBRA_A : ZEBRA_B;
    rowData.forEach((val, c) => {
      const cell = row.getCell(c + 1);
      cell.value = val ?? "";
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: bgArgb },
      };
      cell.border = wsBorder();
      cell.font = { size: 9, color: { argb: TEXT_DARK } };
      cell.alignment = { vertical: "middle" };
    });
  });
}

export function wsSummaryRows(
  ws: ExcelJS.Worksheet,
  rows: [string, string][],
  startRow: number,
) {
  rows.forEach(([campo, valor], idx) => {
    const row = ws.getRow(startRow + idx);
    row.height = 15;
    const bgArgb = idx % 2 === 0 ? ZEBRA_A : ZEBRA_B;
    const cellA = row.getCell(1);
    cellA.value = campo;
    cellA.font = { bold: true, size: 9, color: { argb: INDIGO_800 } };
    cellA.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: INDIGO_100 },
    };
    cellA.border = wsBorder();
    cellA.alignment = { vertical: "middle" };
    const cellB = row.getCell(2);
    cellB.value = valor;
    cellB.font = { size: 9, color: { argb: TEXT_DARK } };
    cellB.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: bgArgb },
    };
    cellB.border = wsBorder();
    cellB.alignment = { vertical: "middle" };
  });
}

export function wsColWidths(ws: ExcelJS.Worksheet, widths: number[]) {
  widths.forEach((w, i) => {
    ws.getColumn(i + 1).width = w;
  });
}

export async function downloadWorkbook(wb: ExcelJS.Workbook, fileName: string) {
  const buffer = await wb.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
}

export function createWorkbook(): ExcelJS.Workbook {
  const wb = new ExcelJS.Workbook();
  wb.creator = "Onlizas Admin";
  wb.created = new Date();
  return wb;
}

export function addSummaryWorksheet(
  wb: ExcelJS.Workbook,
  sheetName: string,
  title: string,
  rows: [string, string][],
) {
  const ws = wb.addWorksheet(sheetName, { views: [{ showGridLines: false }] });
  wsTitle(ws, title, 2);
  wsHeaders(ws, ["Campo", "Valor"], 2);
  wsSummaryRows(ws, rows, 3);
  wsColWidths(ws, [28, 32]);
  return ws;
}

export function addDataWorksheet(
  wb: ExcelJS.Workbook,
  sheetName: string,
  title: string,
  headers: string[],
  data: (string | number | null | undefined)[][],
  colWidths?: number[],
  headerBgArgb = INDIGO,
) {
  const ws = wb.addWorksheet(sheetName, { views: [{ showGridLines: false }] });
  wsTitle(ws, title, headers.length, INDIGO_100);
  wsHeaders(ws, headers, 2, headerBgArgb);
  wsDataRows(ws, data, 3);
  if (colWidths) wsColWidths(ws, colWidths);
  return ws;
}

export function addFinanceWorksheet(
  wb: ExcelJS.Workbook,
  sheetName: string,
  title: string,
  rows: { concepto: string; monto: string | number }[],
  headerBgArgb = INDIGO,
) {
  const ws = wb.addWorksheet(sheetName, { views: [{ showGridLines: false }] });
  wsTitle(ws, title, 2, INDIGO_100);
  wsHeaders(ws, ["Concepto", "Monto"], 2, headerBgArgb);
  wsDataRows(
    ws,
    rows.map((r) => [r.concepto, r.monto]),
    3,
  );
  wsColWidths(ws, [30, 22]);
  return ws;
}
