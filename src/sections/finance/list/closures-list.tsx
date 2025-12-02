"use client";
import { DataGrid } from "@/components/datagrid/datagrid";
import { DataTableColumn } from "mantine-datatable";
import { useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { paths } from "@/config/paths";
import { GetAllClosures, Closure } from "@/types/finance";

interface ClosuresListProps {
  data?: GetAllClosures;
  searchParams: any;
  onSearchParamsChange: (params: any) => void;
}

export function ClosuresList({
  data,
  searchParams,
  onSearchParamsChange,
}: ClosuresListProps) {
  const router = useRouter();

  const handleViewAccounts = useCallback(
    (row: Closure) => {
      router.push(paths.finance.closureAccounts(row.id));
    },
    [router]
  );

  const columns = useMemo<DataTableColumn<Closure>[]>(
    () => [
      {
        accessor: "createdAt",
        title: "Fecha",
        render: (r) => new Date(r.createdAt).toLocaleDateString(),
      },
      { accessor: "type", title: "Tipo" },
      {
        accessor: "pendingAccounts",
        title: "Pendientes",
        render: (r) => (
          <span className="text-yellow-700">{r.pendingAccounts}</span>
        ),
      },
      { accessor: "paidAccounts", title: "Pagadas" },
      {
        accessor: "errorAccounts",
        title: "Errores",
        render: (r) => <span className="text-red-700">{r.errorAccounts}</span>,
      },
      {
        accessor: "actions",
        title: "Acciones",
        render: (r) => (
          <button
            className="px-2 py-1 text-xs rounded border"
            onClick={() => handleViewAccounts(r)}
          >
            Ver cuentas
          </button>
        ),
      },
    ],
    [handleViewAccounts]
  );

  return (
    <DataGrid
      data={data}
      columns={columns}
      searchParams={searchParams}
      onSearchParamsChange={onSearchParamsChange}
      searchPlaceholder="Buscar cierres..."
      emptyText="No se encontraron cierres"
    />
  );
}
