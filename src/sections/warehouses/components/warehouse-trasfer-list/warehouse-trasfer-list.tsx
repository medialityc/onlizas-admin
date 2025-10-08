"use client";

import { DataGrid } from "@/components/datagrid/datagrid";
import { SearchParams } from "@/types/fetch/request";
import { DataTableColumn } from "mantine-datatable";
import { useCallback, useMemo } from "react";
import {
  GetAllWarehouseTransfers,
  WAREHOUSE_TRANSFER_OPTIONS,
  WAREHOUSE_TRANSFER_STATUS,
  WarehouseTransfer,
} from "@/types/warehouses-transfers";
import { useRouter } from "next/navigation";
import DateValue from "@/components/format-vales/date-value";
import TransferStatusCell from "../transfer-cell/transfer-status-cell";
import TransferActionsMenu from "../transfer-cell/transfer-row-actions";
import { StatusFilter } from "@/components/filters/status-filters";
import {
  approveWarehouseTransfer,
  cancelWarehouseTransfer,
  executeWarehouseTransfer,
} from "@/services/warehouses-transfers";
import showToast from "@/config/toast/toastConfig";
import { PERMISSION_ENUM } from "@/lib/permissions";

interface Props {
  data?: GetAllWarehouseTransfers;
  searchParams: SearchParams;
  onSearchParamsChange: (params: SearchParams) => void;
}

export function WarehouseTransferList({
  data,
  searchParams,
  onSearchParamsChange,
}: Props) {
  const { push } = useRouter();
  const handleCreateTransfer = useCallback(() => {
    const newPath = window.location.pathname.replace(/\/list$/, "");
    push(newPath);
  }, [push]);

  const handleCanceledTransfer = useCallback(async (transferId: number) => {
    try {
      const res = await cancelWarehouseTransfer(transferId);
      if (res?.error && res.message) {
        showToast(res.message, "error");
      } else {
        showToast("Transferencia cancelada exitosamente", "success");
      }
    } catch (error) {
      console.error(error);
      showToast("Ocurrió un error, por favor intenta de nuevo", "error");
    }
  }, []);

  const handleApprovedTransfer = useCallback(async (transferId: number) => {
    try {
      const res = await approveWarehouseTransfer(transferId);
      if (res?.error && res.message) {
        showToast(res.message, "error");
      } else {
        showToast("Transferencia aprobada exitosamente", "success");
      }
    } catch (error) {
      console.error(error);
      showToast("Ocurrió un error, por favor intenta de nuevo", "error");
    }
  }, []);
  const handleExecuteTransfer = useCallback(async (transferId: number) => {
    try {
      const res = await executeWarehouseTransfer(transferId);
      if (res?.error && res.message) {
        showToast(res.message, "error");
      } else {
        showToast("Transferencia ejecutada exitosamente", "success");
      }
    } catch (error) {
      console.error(error);
      showToast("Ocurrió un error, por favor intenta de nuevo", "error");
    }
  }, []);

  const columns = useMemo<DataTableColumn<WarehouseTransfer>[]>(
    () => [
      {
        accessor: "id",
        title: "ID",
        sortable: true,
        width: 80,
        render: (trans) => (
          <span className="font-medium text-dark dark:text-white">
            #{trans.id}
          </span>
        ),
      },
      {
        accessor: "name",
        title: "Nombre",
        sortable: true,
        render: (trans) => (
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
              {trans.transferNumber}
            </span>
          </div>
        ),
      },
      {
        accessor: "destinationWarehouseName",
        title: "Almacén destino",
        sortable: true,
        render: (trans) => (
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
              {trans.destinationWarehouseName}
            </span>
          </div>
        ),
      },
      {
        accessor: "status",
        title: "Estado",
        sortable: true,
        render: (trans) => (
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
              <TransferStatusCell status={trans?.status} />
            </span>
          </div>
        ),
      },
      {
        accessor: "items",
        title: "Total de productos",
        sortable: true,
        render: (trans) => (
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
              {trans?.items?.length || 0}
            </span>
          </div>
        ),
      },
      {
        accessor: "createAt",
        title: "Fecha creación",
        sortable: true,
        render: (trans) => (
          <div className="flex flex-col">
            <DateValue value={trans?.createdAt} />
          </div>
        ),
      },

      {
        accessor: "actions",
        title: "Acciones",
        textAlign: "center",
        render: (trans) => (
          <div className="flex justify-center">
            <TransferActionsMenu
              isApproveActive={
                trans?.status === WAREHOUSE_TRANSFER_STATUS.Pending
              }
              onApproveTransfer={() => handleApprovedTransfer(trans?.id)}
              isCancelActive={[
                WAREHOUSE_TRANSFER_STATUS.Pending,
                WAREHOUSE_TRANSFER_STATUS.Approved,
              ].includes(trans?.status)}
              onCancelTransfer={() => handleCanceledTransfer(trans?.id)}
              isExecuteActive={
                trans?.status === WAREHOUSE_TRANSFER_STATUS.Approved
              }
              onExecuteTransfer={() => handleExecuteTransfer(trans?.id)}
            />
          </div>
        ),
      },
    ],
    [handleApprovedTransfer, handleCanceledTransfer, handleExecuteTransfer]
  );

  return (
    <>
      <DataGrid
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        data={{ ...data, data: data?.transfers }}
        columns={columns}
        searchParams={searchParams}
        onSearchParamsChange={onSearchParamsChange}
        searchPlaceholder="Buscar transferencia..."
        onCreate={handleCreateTransfer}
        createPermissions={[PERMISSION_ENUM.CREATE_SECTION, PERMISSION_ENUM.CREATE]}
        emptyText="No se encontraron transferencias del almacén"
        createText="Crear Transferencia"
        enableColumnToggle={false}
        rightActions={
          <div>
            <TransferStatusFilter />
          </div>
        }
      />
    </>
  );
}

const TransferStatusFilter = () => {
  return (
    <StatusFilter
      options={WAREHOUSE_TRANSFER_OPTIONS}
      allowMultiple
      placeholder="Estados"
      searchParamKey="status"
    />
  );
};
