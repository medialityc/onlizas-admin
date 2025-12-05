"use client";
import { DataGrid } from "@/components/datagrid/datagrid";
import { DataTableColumn } from "mantine-datatable";
import { useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { paths } from "@/config/paths";
import { GetAllClosures, Closure } from "@/types/finance";
import { useModalState } from "@/hooks/use-modal-state";
import { PartialClosureModal } from "../modals/partial-closure-modal";
import { formatDate } from "@/utils/format";

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
  const { getModalState, openModal, closeModal } = useModalState();
  const partialModal = getModalState("partial-closure");

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
        title: "Fecha de Creación",
        render: (r) =>
          formatDate((r as any).closureDate ?? (r as any).createdAt),
      },
      {
        accessor: "period",
        title: "Periodo",
        render: (r) => (
          <div className="text-xs">
            <div>Inicio: {formatDate((r as any).periodStartDate)}</div>
            <div>Fin: {formatDate((r as any).periodEndDate)}</div>
          </div>
        ),
      },
      {
        accessor: "type",
        title: "Tipo",
        render: (r) => (r as any).typeName ?? r.type,
      },
      {
        accessor: "status",
        title: "Estado",
        render: (r) => (r as any).statusName ?? (r as any).status,
      },
      { accessor: "totalAccounts", title: "Total Cuentas" },
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
        render: (r) => (
          <span className="text-red-700">
            {(r as any).failedAccounts ?? (r as any).errorAccounts}
          </span>
        ),
      },
      {
        accessor: "totalAmount",
        title: "Total a Pagar",
        render: (r) =>
          ((r as any).totalAmount ?? 0).toLocaleString(undefined, {
            style: "currency",
            currency: "USD",
          }),
      },
      {
        accessor: "actions",
        title: "Acciones",
        render: (r) => (
          <div className="flex gap-2">
            <button
              className="px-2 py-1 text-xs rounded border"
              onClick={() => handleViewAccounts(r)}
            >
              Ver cuentas
            </button>
          </div>
        ),
      },
    ],
    [handleViewAccounts]
  );

  return (
    <>
      <DataGrid
        data={data}
        columns={columns}
        searchParams={searchParams}
        onSearchParamsChange={onSearchParamsChange}
        onCreate={() => openModal("partial-closure")}
        createText="Crear Cierre Parcial"
        searchPlaceholder="Buscar cierres..."
        emptyText="No se encontraron cierres"
      />
      <PartialClosureModal />
    </>
  );
}
