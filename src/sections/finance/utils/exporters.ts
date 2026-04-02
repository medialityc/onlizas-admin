import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import {
  createWorkbook,
  addSummaryWorksheet,
  addDataWorksheet,
  downloadWorkbook,
} from "@/utils/exceljs-warehouse-styles";
import { formatCurrency, formatDate } from "@/utils/format";
import type {
  Closure,
  ClosureStatement,
  ClosureAccount,
  ClosuresSummary,
  SupplierFinancialSummaryItem,
  ClosureByMonth,
} from "@/types/finance";

// ─── helpers ────────────────────────────────────────────────────────────────

function fmtD(val: string | Date | undefined | null): string {
  if (!val) return "—";
  try {
    return new Date(val).toLocaleDateString("es-ES");
  } catch {
    return String(val);
  }
}

function fmtDT(val: string | Date | undefined | null): string {
  if (!val) return "—";
  try {
    return new Date(val).toLocaleString("es-ES");
  } catch {
    return String(val);
  }
}

function cur(n: number | null | undefined): string {
  return formatCurrency(n ?? 0, "USD");
}

// ─── PDF: cuentas de un cierre ───────────────────────────────────────────────

export function exportClosureAccountsPdf(
  closureId: string,
  statement: ClosureStatement | null,
  accounts: ClosureAccount[],
  totalAccounts: number,
  totalAmount: number,
) {
  const doc = new jsPDF();
  const margin = 14;
  const pageH = doc.internal.pageSize.getHeight();
  let y = 20;

  const stepY = (need = 10) => {
    if (y + need > pageH - 20) {
      doc.addPage();
      y = 20;
    }
  };

  // Título
  doc.setFontSize(16);
  doc.setTextColor(33);
  doc.text("Cuentas del Cierre", margin, y);
  y += 6;

  const periodText = statement
    ? `Período: ${fmtD(statement.fromDate)} — ${fmtD(statement.toDate)}`
    : `Cierre ID: ${closureId}`;
  doc.setFontSize(10);
  doc.text(periodText, margin, y);
  y += 5;
  doc.setFontSize(8);
  doc.text(`Generado: ${fmtDT(new Date())}`, margin, y);
  y += 8;

  // Resumen financiero
  if (statement) {
    stepY(20);
    doc.setFontSize(12);
    doc.setTextColor(30);
    doc.text("Resumen del Cierre", margin, y);
    y += 4;

    autoTable(doc, {
      startY: y,
      head: [["Métrica", "Valor"]],
      body: [
        ["Ingresos totales", cur(statement.totalIncome)],
        ["Tarifa plataforma", cur(statement.platformFee)],
        ["Impuestos", cur(statement.taxes)],
        ["Proveedores", cur(statement.suppliersTotal)],
        ["Logística", cur(statement.logisticsTotal)],
        ["Total cuentas", String(totalAccounts)],
        ["Total a pagar", cur(totalAmount)],
      ],
      theme: "grid",
      styles: { fontSize: 8 },
      headStyles: { fillColor: [240, 240, 248], textColor: 33 },
    });
    y = (doc as any).lastAutoTable?.finalY ?? y;
    y += 8;
  }

  // Balances por proveedor
  if (statement?.supplierBalances?.length) {
    stepY(20);
    doc.setFontSize(12);
    doc.text("Balances por Proveedor", margin, y);
    y += 4;

    autoTable(doc, {
      startY: y,
      head: [["Proveedor", "Productos", "Delivery", "Total"]],
      body: statement.supplierBalances.map((b) => [
        b.supplierName,
        cur(b.productAmount),
        cur(b.deliveryAmount),
        cur(b.totalAmount),
      ]),
      theme: "grid",
      styles: { fontSize: 8 },
      headStyles: { fillColor: [224, 231, 255], textColor: 55 },
    });
    y = (doc as any).lastAutoTable?.finalY ?? y;
    y += 8;
  }

  // Lista de cuentas
  if (accounts.length) {
    stepY(20);
    doc.setFontSize(12);
    doc.text("Lista de Cuentas", margin, y);
    y += 4;

    autoTable(doc, {
      startY: y,
      head: [
        ["Proveedor", "Descripción", "Estado", "Vence", "Total", "Subórdenes"],
      ],
      body: accounts.map((a) => [
        a.supplierName ?? "—",
        a.description,
        a.statusName,
        fmtD(a.dueDate),
        cur(a.totalAmount),
        typeof a.subOrdersCount === "number" ? String(a.subOrdersCount) : "—",
      ]),
      theme: "grid",
      styles: { fontSize: 7 },
      headStyles: { fillColor: [224, 231, 255], textColor: 55 },
    });
  }

  const base = statement
    ? `cierre-${fmtD(statement.fromDate)}-${fmtD(statement.toDate)}`
    : `cierre-${closureId}`;
  doc.save(`${base}-cuentas.pdf`);
}

// ─── Excel: cuentas de un cierre ─────────────────────────────────────────────

export async function exportClosureAccountsExcel(
  closureId: string,
  statement: ClosureStatement | null,
  accounts: ClosureAccount[],
  totalAccounts: number,
  totalAmount: number,
) {
  const wb = createWorkbook();

  // Hoja 1: Resumen
  const summaryRows: [string, string][] = statement
    ? [
        ["Período desde", fmtD(statement.fromDate)],
        ["Período hasta", fmtD(statement.toDate)],
        ["Ingresos totales", cur(statement.totalIncome)],
        ["Tarifa plataforma", cur(statement.platformFee)],
        ["Impuestos", cur(statement.taxes)],
        ["Proveedores", cur(statement.suppliersTotal)],
        ["Logística", cur(statement.logisticsTotal)],
        ["Total cuentas", String(totalAccounts)],
        ["Total a pagar", cur(totalAmount)],
      ]
    : [
        ["Cierre ID", closureId],
        ["Total cuentas", String(totalAccounts)],
        ["Total a pagar", cur(totalAmount)],
      ];
  addSummaryWorksheet(
    wb,
    "Resumen",
    statement ? `Cierre ${fmtD(statement.fromDate)}` : `Cierre ${closureId}`,
    summaryRows,
  );

  // Hoja 2: Balances por proveedor
  if (statement?.supplierBalances?.length) {
    addDataWorksheet(
      wb,
      "Balances Proveedor",
      "Balances por Proveedor",
      ["Proveedor", "Productos", "Delivery", "Total"],
      statement.supplierBalances.map((b) => [
        b.supplierName,
        cur(b.productAmount),
        cur(b.deliveryAmount),
        cur(b.totalAmount),
      ]),
      [34, 18, 18, 18],
    );
  }

  // Hoja 3: Lista de cuentas
  if (accounts.length) {
    addDataWorksheet(
      wb,
      "Cuentas",
      "Lista de Cuentas",
      ["Proveedor", "Descripción", "Estado", "Vence", "Total", "Subórdenes"],
      accounts.map((a) => [
        a.supplierName ?? "—",
        a.description,
        a.statusName,
        fmtD(a.dueDate),
        cur(a.totalAmount),
        typeof a.subOrdersCount === "number" ? a.subOrdersCount : "—",
      ]),
      [28, 36, 16, 16, 18, 14],
    );
  }

  const base = statement
    ? `cierre-${fmtD(statement.fromDate)}-${fmtD(statement.toDate)}`
    : `cierre-${closureId}`;
  await downloadWorkbook(wb, `${base}-cuentas.xlsx`);
}

// ─── PDF: resumen general de cierres (estados de cuenta) ─────────────────────

export function exportClosuresSummaryPdf(
  summary: ClosuresSummary,
  suppliers: SupplierFinancialSummaryItem[],
  startDate?: string,
  endDate?: string,
) {
  const doc = new jsPDF();
  const margin = 14;
  const pageH = doc.internal.pageSize.getHeight();
  let y = 20;

  const stepY = (need = 10) => {
    if (y + need > pageH - 20) {
      doc.addPage();
      y = 20;
    }
  };

  doc.setFontSize(16);
  doc.setTextColor(33);
  doc.text("Estados de Cuentas — Cierres", margin, y);
  y += 6;

  const range = [
    startDate ? `Desde: ${startDate}` : null,
    endDate ? `Hasta: ${endDate}` : null,
  ]
    .filter(Boolean)
    .join("  |  ");
  if (range) {
    doc.setFontSize(10);
    doc.text(range, margin, y);
    y += 5;
  }
  doc.setFontSize(8);
  doc.text(`Generado: ${fmtDT(new Date())}`, margin, y);
  y += 8;

  // Resumen general
  stepY(20);
  doc.setFontSize(12);
  doc.text("Resumen General", margin, y);
  y += 4;

  autoTable(doc, {
    startY: y,
    head: [["Métrica", "Valor"]],
    body: [
      ["Total cierres", String(summary.totalClosures)],
      ["Ingresos totales", cur(summary.totalIncome)],
      ["Tarifa plataforma", cur(summary.platformFee)],
      ["Impuestos", cur(summary.taxes)],
      ["Proveedores", cur(summary.suppliersTotal)],
      ["Logística", cur(summary.logisticsTotal)],
      ["Total cuentas", String(summary.totalAccounts)],
      ["Pendientes", String(summary.pendingAccounts)],
      ["Pagadas", String(summary.paidAccounts)],
      ["Fallidas", String(summary.failedAccounts)],
    ],
    theme: "grid",
    styles: { fontSize: 8 },
    headStyles: { fillColor: [240, 240, 248], textColor: 33 },
  });
  y = (doc as any).lastAutoTable?.finalY ?? y;
  y += 8;

  // Último cierre
  if (summary.latestClosure) {
    const lc = summary.latestClosure;
    stepY(20);
    doc.setFontSize(12);
    doc.text("Último Cierre", margin, y);
    y += 4;

    autoTable(doc, {
      startY: y,
      head: [["Campo", "Valor"]],
      body: [
        ["Tipo", lc.typeName],
        ["Fecha de corte", fmtD(lc.cutoffDate)],
        ["Ingresos", cur(lc.totalIncome)],
        ["Total cuentas", String(lc.totalAccounts)],
        ["Pendientes", String(lc.pendingAccounts)],
        ["Pagadas", String(lc.paidAccounts)],
        ["Fallidas", String(lc.failedAccounts)],
      ],
      theme: "grid",
      styles: { fontSize: 8 },
      headStyles: { fillColor: [224, 231, 255], textColor: 55 },
    });
    y = (doc as any).lastAutoTable?.finalY ?? y;
    y += 8;
  }

  // Cierres por mes
  if (summary.closuresByMonth?.length) {
    stepY(20);
    doc.setFontSize(12);
    doc.text("Cierres por Mes", margin, y);
    y += 4;

    autoTable(doc, {
      startY: y,
      head: [
        [
          "Mes",
          "Cierres",
          "Ingresos",
          "Prov.",
          "Ctas.",
          "Pendientes",
          "Pagadas",
        ],
      ],
      body: summary.closuresByMonth.map((m: ClosureByMonth) => [
        `${m.monthName} ${m.year}`,
        String(m.closuresCount),
        cur(m.totalIncome),
        cur(m.suppliersTotal),
        String(m.accountsCount),
        String(m.pendingAccounts),
        String(m.paidAccounts),
      ]),
      theme: "grid",
      styles: { fontSize: 7 },
      headStyles: { fillColor: [224, 231, 255], textColor: 55 },
    });
    y = (doc as any).lastAutoTable?.finalY ?? y;
    y += 8;
  }

  // Detalle por proveedor
  if (suppliers?.length) {
    stepY(20);
    doc.setFontSize(12);
    doc.text("Detalle por Proveedor", margin, y);
    y += 4;

    autoTable(doc, {
      startY: y,
      head: [
        [
          "Proveedor",
          "Productos",
          "Delivery",
          "Fee Plataforma",
          "Impuestos",
          "Total Prov.",
          "Subórdenes",
          "Ctas. Pend.",
        ],
      ],
      body: suppliers.map((s) => [
        s.supplierName,
        cur(s.productAmount),
        cur(s.deliveryAmount),
        cur(s.platformFeeAmount),
        cur(s.taxAmount),
        cur(s.supplierAmount),
        String(s.subOrdersCount),
        String(s.pendingAccountsCount),
      ]),
      theme: "grid",
      styles: { fontSize: 7 },
      headStyles: { fillColor: [224, 231, 255], textColor: 55 },
    });
  }

  const suffix = startDate && endDate ? `-${startDate}-${endDate}` : "";
  doc.save(`estados-cuentas${suffix}.pdf`);
}

// ─── Excel: resumen general de cierres ────────────────────────────────────────

export async function exportClosuresSummaryExcel(
  summary: ClosuresSummary,
  suppliers: SupplierFinancialSummaryItem[],
  startDate?: string,
  endDate?: string,
) {
  const wb = createWorkbook();
  const title = `Estados de Cuentas${startDate && endDate ? ` (${startDate} — ${endDate})` : ""}`;

  addSummaryWorksheet(wb, "Resumen", title, [
    ["Total cierres", String(summary.totalClosures)],
    ["Ingresos totales", cur(summary.totalIncome)],
    ["Tarifa plataforma", cur(summary.platformFee)],
    ["Impuestos", cur(summary.taxes)],
    ["Proveedores", cur(summary.suppliersTotal)],
    ["Logística", cur(summary.logisticsTotal)],
    ["Total cuentas", String(summary.totalAccounts)],
    ["Pendientes", String(summary.pendingAccounts)],
    ["Pagadas", String(summary.paidAccounts)],
    ["Fallidas", String(summary.failedAccounts)],
  ]);

  if (summary.closuresByMonth?.length) {
    addDataWorksheet(
      wb,
      "Por Mes",
      "Cierres por Mes",
      [
        "Mes",
        "Cierres",
        "Ingresos",
        "Proveedores",
        "Total Cuentas",
        "Pendientes",
        "Pagadas",
      ],
      summary.closuresByMonth.map((m: ClosureByMonth) => [
        `${m.monthName} ${m.year}`,
        m.closuresCount,
        cur(m.totalIncome),
        cur(m.suppliersTotal),
        m.accountsCount,
        m.pendingAccounts,
        m.paidAccounts,
      ]),
      [22, 10, 18, 18, 16, 14, 12],
    );
  }

  if (suppliers?.length) {
    addDataWorksheet(
      wb,
      "Proveedores",
      "Detalle por Proveedor",
      [
        "Proveedor",
        "Email",
        "Productos",
        "Delivery",
        "Fee Pltf.",
        "Impuestos",
        "Total Prov.",
        "Subórdenes",
        "Ctas. Pend.",
      ],
      suppliers.map((s) => [
        s.supplierName,
        s.email,
        cur(s.productAmount),
        cur(s.deliveryAmount),
        cur(s.platformFeeAmount),
        cur(s.taxAmount),
        cur(s.supplierAmount),
        s.subOrdersCount,
        s.pendingAccountsCount,
      ]),
      [30, 30, 16, 16, 14, 14, 16, 14, 14],
    );
  }

  const suffix = startDate && endDate ? `-${startDate}-${endDate}` : "";
  await downloadWorkbook(wb, `estados-cuentas${suffix}.xlsx`);
}

// ─── PDF: lista de cierres ────────────────────────────────────────────────────

export function exportClosuresListPdf(closures: Closure[]) {
  const doc = new jsPDF();
  const margin = 14;
  let y = 20;

  doc.setFontSize(16);
  doc.setTextColor(33);
  doc.text("Lista de Cierres", margin, y);
  y += 6;
  doc.setFontSize(8);
  doc.text(`Generado: ${fmtDT(new Date())}`, margin, y);
  y += 8;

  autoTable(doc, {
    startY: y,
    head: [
      [
        "Fecha",
        "Tipo",
        "Estado",
        "Total Cuentas",
        "Pendientes",
        "Pagadas",
        "Errores",
      ],
    ],
    body: closures.map((c) => [
      fmtD((c as any).closureDate ?? (c as any).createdAt),
      (c as any).typeName ?? c.type,
      (c as any).statusName ?? String((c as any).status ?? "—"),
      String((c as any).totalAccounts ?? "—"),
      String(c.pendingAccounts ?? "—"),
      String(c.paidAccounts ?? "—"),
      String((c as any).failedAccounts ?? c.errorAccounts ?? "—"),
    ]),
    theme: "grid",
    styles: { fontSize: 8 },
    headStyles: { fillColor: [224, 231, 255], textColor: 55 },
  });

  doc.save("cierres.pdf");
}

// ─── Excel: lista de cierres ──────────────────────────────────────────────────

export async function exportClosuresListExcel(closures: Closure[]) {
  const wb = createWorkbook();

  addDataWorksheet(
    wb,
    "Cierres",
    "Lista de Cierres",
    [
      "Fecha",
      "Tipo",
      "Estado",
      "Total Cuentas",
      "Pendientes",
      "Pagadas",
      "Errores",
    ],
    closures.map((c) => [
      fmtD((c as any).closureDate ?? (c as any).createdAt),
      (c as any).typeName ?? c.type,
      (c as any).statusName ?? String((c as any).status ?? "—"),
      (c as any).totalAccounts ?? "—",
      c.pendingAccounts ?? "—",
      c.paidAccounts ?? "—",
      (c as any).failedAccounts ?? c.errorAccounts ?? "—",
    ]),
    [24, 14, 14, 16, 14, 12, 12],
  );

  await downloadWorkbook(wb, "cierres.xlsx");
}
