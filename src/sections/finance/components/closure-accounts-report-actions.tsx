"use client";

import { ClosureAccount, ClosureStatement } from "@/types/finance";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { formatCurrency } from "@/utils/format";
import * as XLSX from "xlsx";

interface ClosureAccountsReportActionsProps {
  closureId: string;
  statement: ClosureStatement | null;
  accounts: ClosureAccount[];
  totalAccounts: number;
  totalAmount: number;
}

export function ClosureAccountsReportActions({
  closureId,
  statement,
  accounts,
  totalAccounts,
  totalAmount,
}: ClosureAccountsReportActionsProps) {
  const handleExportPdf = () => {
    const doc = new jsPDF();

    const marginLeft = 14;
    let currentY = 20;

    doc.setFontSize(16);
    const periodText = statement
      ? `Cierre del ${new Date(statement.fromDate).toLocaleDateString()} al ${new Date(statement.toDate).toLocaleDateString()}`
      : `Cierre ${closureId}`;
    doc.text("Cuentas del cierre", marginLeft, currentY);
    currentY += 6;
    doc.setFontSize(11);
    doc.text(periodText, marginLeft, currentY);
    currentY += 8;

    const now = new Date();
    const printedAt = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
    doc.setFontSize(8);
    doc.text(`Generado: ${printedAt}`, marginLeft, currentY);
    currentY += 8;

    // Resumen del cierre
    if (statement) {
      doc.setFontSize(12);
      doc.text("Resumen del cierre", marginLeft, currentY);
      currentY += 4;

      autoTable(doc, {
        startY: currentY,
        head: [["Métrica", "Valor"]],
        body: [
          ["Ingresos", formatCurrency(statement.totalIncome)],
          ["Tarifa plataforma", formatCurrency(statement.platformFee)],
          ["Impuestos", formatCurrency(statement.taxes)],
          ["Proveedores", formatCurrency(statement.suppliersTotal)],
          ["Logística", formatCurrency(statement.logisticsTotal)],
          ["Total cuentas", String(totalAccounts)],
          ["Total a pagar", formatCurrency(totalAmount)],
        ],
        styles: { fontSize: 8 },
        headStyles: { fillColor: [240, 240, 240] },
        theme: "grid",
      });

      // @ts-ignore
      currentY = (doc.lastAutoTable?.finalY || currentY) + 8;
    }

    // Balances por proveedor
    if (statement?.supplierBalances?.length) {
      doc.setFontSize(12);
      doc.text("Balances por proveedor", marginLeft, currentY);
      currentY += 4;

      autoTable(doc, {
        startY: currentY,
        head: [["Proveedor", "Productos", "Delivery", "Total"]],
        body: statement.supplierBalances.map((b) => [
          b.supplierName,
          formatCurrency(b.productAmount),
          formatCurrency(b.deliveryAmount),
          formatCurrency(b.totalAmount),
        ]),
        styles: { fontSize: 8 },
        headStyles: { fillColor: [240, 240, 240] },
        theme: "grid",
      });

      // @ts-ignore
      currentY = (doc.lastAutoTable?.finalY || currentY) + 8;
    }

    // Lista de cuentas
    if (accounts && accounts.length) {
      doc.setFontSize(12);
      doc.text("Lista de cuentas", marginLeft, currentY);
      currentY += 4;

      autoTable(doc, {
        startY: currentY,
        head: [
          [
            "Proveedor",
            "Descripción",
            "Estado",
            "Vence",
            "Total",
            "Subórdenes",
          ],
        ],
        body: accounts.map((a) => [
          a.supplierName ?? "-",
          a.description,
          a.statusName,
          a.dueDate ? new Date(a.dueDate).toLocaleDateString() : "-",
          formatCurrency(a.totalAmount),
          typeof a.subOrdersCount === "number" ? String(a.subOrdersCount) : "-",
        ]),
        styles: { fontSize: 7 },
        headStyles: { fillColor: [240, 240, 240] },
        theme: "grid",
      });
    }

    const fileName = statement
      ? `cierre-${new Date(statement.fromDate).toISOString().slice(0, 10)}-${new Date(
          statement.toDate,
        )
          .toISOString()
          .slice(0, 10)}-cuentas.pdf`
      : `cierre-${closureId}-cuentas.pdf`;

    doc.save(fileName);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleExportPdf}
        className="inline-flex items-center rounded-md border border-gray-200 bg-white px-2 py-1 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800/60"
      >
        Reporte PDF
      </button>
      <button
        type="button"
        onClick={() => {
          const wb = XLSX.utils.book_new();

          // Hoja Resumen
          const summaryRows: any[] = [];
          if (statement) {
            summaryRows.push(
              {
                Metrica: "Desde",
                Valor: new Date(statement.fromDate).toLocaleString(),
              },
              {
                Metrica: "Hasta",
                Valor: new Date(statement.toDate).toLocaleString(),
              },
              { Metrica: "Ingresos", Valor: statement.totalIncome },
              { Metrica: "Tarifa plataforma", Valor: statement.platformFee },
              { Metrica: "Impuestos", Valor: statement.taxes },
              { Metrica: "Proveedores", Valor: statement.suppliersTotal },
              { Metrica: "Logística", Valor: statement.logisticsTotal },
            );
          }
          summaryRows.push(
            { Metrica: "Total cuentas", Valor: totalAccounts },
            { Metrica: "Total a pagar", Valor: totalAmount },
          );

          const wsResumen = XLSX.utils.json_to_sheet(summaryRows);
          XLSX.utils.book_append_sheet(wb, wsResumen, "Resumen");

          // Hoja Balances por proveedor
          if (statement?.supplierBalances?.length) {
            const balancesRows = statement.supplierBalances.map((b) => ({
              Proveedor: b.supplierName,
              Productos: b.productAmount,
              Delivery: b.deliveryAmount,
              Total: b.totalAmount,
            }));
            const wsBalances = XLSX.utils.json_to_sheet(balancesRows);
            XLSX.utils.book_append_sheet(wb, wsBalances, "BalancesProveedor");
          }

          // Hoja Cuentas
          if (accounts?.length) {
            const accountsRows = accounts.map((a) => ({
              Proveedor: a.supplierName ?? "-",
              Descripcion: a.description,
              Estado: a.statusName,
              Vence: a.dueDate ? new Date(a.dueDate).toLocaleDateString() : "-",
              Pago: a.paymentDate
                ? new Date(a.paymentDate).toLocaleDateString()
                : "-",
              Total: a.totalAmount,
              Subordenes: a.subOrdersCount ?? null,
              Producto: a.debitBreakdown?.productAmount ?? null,
              FeePlataforma: a.debitBreakdown?.platformFeeAmount ?? null,
              ProveedorMonto: a.debitBreakdown?.supplierAmount ?? null,
              DeliveryMonto: a.debitBreakdown?.deliveryAmount ?? null,
              ImpuestosMonto: a.debitBreakdown?.taxAmount ?? null,
            }));
            const wsCuentas = XLSX.utils.json_to_sheet(accountsRows);
            XLSX.utils.book_append_sheet(wb, wsCuentas, "Cuentas");
          }

          const excelName = statement
            ? `cierre-${new Date(statement.fromDate).toISOString().slice(0, 10)}-${new Date(
                statement.toDate,
              )
                .toISOString()
                .slice(0, 10)}-cuentas.xlsx`
            : `cierre-${closureId}-cuentas.xlsx`;

          XLSX.writeFile(wb, excelName);
        }}
        className="inline-flex items-center rounded-md border border-gray-200 bg-white px-2 py-1 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800/60"
      >
        Exportar Excel
      </button>
    </div>
  );
}
