"use client";
import { DataGrid } from "@/components/datagrid/datagrid";
import { DataTableColumn } from "mantine-datatable";
import { useMemo } from "react";

export type PayRecvRow = {
  id: string;
  tipo: "PAGO" | "COBRO";
  destino: "ONLIZAS" | "PROVEEDOR";
  total: number;
  estado: "PENDIENTE" | "PAGADA" | "ERROR";
};

interface PayablesReceivablesListProps {
  data?: { items: PayRecvRow[]; total: number };
  searchParams: any;
  onSearchParamsChange: (params: any) => void;
}

export function PayablesReceivablesList({
  data,
  searchParams,
  onSearchParamsChange,
}: PayablesReceivablesListProps) {
  const columns = useMemo<DataTableColumn<PayRecvRow>[]>(
    () => [
      { accessor: "tipo", title: "Tipo" },
      { accessor: "destino", title: "Destino" },
      {
        accessor: "total",
        title: "Total",
        render: (r) => <span>${r.total.toLocaleString()}</span>,
      },
      { accessor: "estado", title: "Estado" },
    ],
    []
  );

  return (
    <DataGrid
      data={data as any}
      columns={columns}
      searchParams={searchParams}
      onSearchParamsChange={onSearchParamsChange}
      searchPlaceholder="Buscar cuentas..."
      emptyText="No se encontraron cuentas"
    />
  );
}
