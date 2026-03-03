"use client";

import { DataGrid } from "@/components/datagrid/datagrid";
import { DataTableColumn } from "mantine-datatable";
import { useMemo } from "react";
import { SupplierFinancialSummaryItem } from "@/types/finance";
import { formatCurrency } from "@/utils/format";

interface SupplierFinancialSummaryTableProps {
  items: SupplierFinancialSummaryItem[];
  emptyText?: string;
}

export function SupplierFinancialSummaryTable({
  items,
  emptyText,
}: SupplierFinancialSummaryTableProps) {
  const columns = useMemo<DataTableColumn<SupplierFinancialSummaryItem>[]>(
    () => [
      { accessor: "supplierName", title: "Proveedor" },
      { accessor: "email", title: "Email" },
      {
        accessor: "productAmount",
        title: "Productos (USD)",
        render: (r) => formatCurrency(r.productAmount, "USD"),
      },
      {
        accessor: "deliveryAmount",
        title: "Delivery (USD)",
        render: (r) => formatCurrency(r.deliveryAmount, "USD"),
      },
      {
        accessor: "platformFeeAmount",
        title: "Fee plataforma (USD)",
        render: (r) => formatCurrency(r.platformFeeAmount, "USD"),
      },
      {
        accessor: "taxAmount",
        title: "Impuestos (USD)",
        render: (r) => formatCurrency(r.taxAmount, "USD"),
      },
      {
        accessor: "supplierAmount",
        title: "Total proveedor (USD)",
        render: (r) => formatCurrency(r.supplierAmount, "USD"),
      },
      { accessor: "subOrdersCount", title: "Subórdenes" },
      { accessor: "pendingAccountsCount", title: "Cuentas pendientes" },
    ],
    [],
  );

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold">Resumen por proveedor</h2>
      <DataGrid<SupplierFinancialSummaryItem>
        simpleData={items}
        columns={columns}
        enablePagination={false}
        enableSorting={false}
        enableSearch={false}
        searchPlaceholder=""
        emptyText={
          emptyText ||
          "No hay información de proveedores para el período seleccionado"
        }
        removePanel
      />
    </div>
  );
}
