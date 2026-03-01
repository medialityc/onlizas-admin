"use client";

import { ClosuresSummary, SupplierFinancialSummaryItem } from "@/types/finance";
import { ClosuresSummaryFilters } from "@/sections/finance/components/closures-summary-filters";
import { jsPDF } from "jspdf";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - jspdf-autotable types may not be installed
import autoTable from "jspdf-autotable";
import { formatCurrency } from "@/utils/format";

interface AccountStatesActionsProps {
  summary: ClosuresSummary;
  suppliers: SupplierFinancialSummaryItem[];
  startDate?: string;
  endDate?: string;
  closureType?: number;
}

export function AccountStatesActions({
  summary,
  suppliers,
  startDate,
  endDate,
  closureType,
}: AccountStatesActionsProps) {
  const handleExportPdf = () => {
    const doc = new jsPDF();

    const marginLeft = 14;
    let currentY = 20;

    doc.setFontSize(16);
    doc.text("Estados de cuentas", marginLeft, currentY);
    currentY += 8;

    doc.setFontSize(10);
    const rangeParts: string[] = [];
    if (startDate) rangeParts.push(`Desde: ${startDate}`);
    if (endDate) rangeParts.push(`Hasta: ${endDate}`);
    if (closureType)
      rangeParts.push(
        `Tipo cierre: ${closureType === 1 ? "Total" : closureType === 2 ? "Parcial" : closureType}`,
      );

    if (rangeParts.length) {
      doc.text(rangeParts.join("  |  "), marginLeft, currentY);
      currentY += 6;
    }

    const now = new Date();
    const printedAt = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
    doc.setFontSize(8);
    doc.text(`Generado: ${printedAt}`, marginLeft, currentY);
    currentY += 8;

    // Resumen general
    doc.setFontSize(12);
    doc.text("Resumen general", marginLeft, currentY);
    currentY += 4;

    autoTable(doc, {
      startY: currentY,
      head: [["Métrica", "Valor"]],
      body: [
        ["Total cierres", String(summary.totalClosures)],
        ["Ingresos totales", formatCurrency(summary.totalIncome)],
        ["Onlizas", formatCurrency(summary.platformFee)],
        ["Impuestos", formatCurrency(summary.taxes)],
        ["Proveedores", formatCurrency(summary.suppliersTotal)],
        ["Logística", formatCurrency(summary.logisticsTotal)],
        ["Total cuentas", String(summary.totalAccounts)],
      ],
      styles: { fontSize: 8 },
      headStyles: { fillColor: [240, 240, 240] },
      theme: "grid",
    });

    // @ts-ignore
    currentY = (doc.lastAutoTable?.finalY || currentY) + 8;

    // Estado de cuentas
    doc.setFontSize(12);
    doc.text("Estado de cuentas", marginLeft, currentY);
    currentY += 4;

    autoTable(doc, {
      startY: currentY,
      head: [["Estado", "Cantidad"]],
      body: [
        ["Pendientes", String(summary.pendingAccounts)],
        ["Pagadas", String(summary.paidAccounts)],
        ["Fallidas", String(summary.failedAccounts)],
      ],
      styles: { fontSize: 8 },
      headStyles: { fillColor: [240, 240, 240] },
      theme: "grid",
    });

    // @ts-ignore
    currentY = (doc.lastAutoTable?.finalY || currentY) + 8;

    // Último cierre
    if (summary.latestClosure) {
      const latest = summary.latestClosure;
      doc.setFontSize(12);
      doc.text("Último cierre", marginLeft, currentY);
      currentY += 4;

      autoTable(doc, {
        startY: currentY,
        head: [["Campo", "Valor"]],
        body: [
          ["Tipo", latest.typeName],
          ["Fecha de corte", new Date(latest.cutoffDate).toLocaleDateString()],
          ["Ingresos", formatCurrency(latest.totalIncome)],
          ["Total cuentas", String(latest.totalAccounts)],
          ["Pendientes", String(latest.pendingAccounts)],
          ["Pagadas", String(latest.paidAccounts)],
          ["Fallidas", String(latest.failedAccounts)],
        ],
        styles: { fontSize: 8 },
        headStyles: { fillColor: [240, 240, 240] },
        theme: "grid",
      });

      // @ts-ignore
      currentY = (doc.lastAutoTable?.finalY || currentY) + 8;
    }

    // Detalle por proveedor
    if (suppliers && suppliers.length) {
      doc.setFontSize(12);
      doc.text("Detalle por proveedor", marginLeft, currentY);
      currentY += 4;

      autoTable(doc, {
        startY: currentY,
        head: [
          [
            "Proveedor",
            "Email",
            "Productos",
            "Delivery",
            "Fee plataforma",
            "Impuestos",
            "Total proveedor",
            "Subórdenes",
            "Ctas. pendientes",
          ],
        ],
        body: suppliers.map((s) => [
          s.supplierName,
          s.email,
          formatCurrency(s.productAmount),
          formatCurrency(s.deliveryAmount),
          formatCurrency(s.platformFeeAmount),
          formatCurrency(s.taxAmount),
          formatCurrency(s.supplierAmount),
          String(s.subOrdersCount),
          String(s.pendingAccountsCount),
        ]),
        styles: { fontSize: 7 },
        headStyles: { fillColor: [240, 240, 240] },
        theme: "grid",
      });
    }

    doc.save("estado-cuentas.pdf");
  };

  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-end md:gap-4">
      <ClosuresSummaryFilters
        defaultStartDate={startDate}
        defaultEndDate={endDate}
        defaultClosureType={closureType ? String(closureType) : undefined}
      />
      <button
        type="button"
        onClick={handleExportPdf}
        className="btn btn-sm btn-primary"
      >
        Reporte PDF
      </button>
    </div>
  );
}
