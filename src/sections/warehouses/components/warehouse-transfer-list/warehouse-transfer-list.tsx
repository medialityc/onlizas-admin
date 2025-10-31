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
import { useRouter, usePathname } from "next/navigation";
import DateValue from "@/components/format-vales/date-value";
import TransferStatusCell from "../transfer-cell/transfer-status-cell";
import TransferActionsMenu from "../transfer-cell/transfer-row-actions";
import { StatusFilter } from "@/components/filters/status-filters";
import {
  approveWarehouseTransfer,
  cancelWarehouseTransfer,
  executeWarehouseTransfer,
  markWarehouseTransferAwaitingReception,
} from "@/services/warehouses-transfers";
import showToast from "@/config/toast/toastConfig";
import { PERMISSION_ENUM } from "@/lib/permissions";

interface Props {
  data?: WarehouseTransfer[]; // Array directo de transfers
  searchParams: SearchParams;
  onSearchParamsChange: (params: SearchParams) => void;
  currentWarehouseId: number;
}

export function WarehouseTransferList({
  data,
  searchParams,
  onSearchParamsChange,
  currentWarehouseId,
}: Props) {
  const { push } = useRouter();
  const pathname = usePathname();
  const handleCreateTransfer = useCallback(() => {
    const newPath = window.location.pathname.replace(/\/list$/, "");
    push(newPath);
  }, [push]);

  const handleCanceledTransfer = useCallback(async (transferId: string) => {
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

  const handleApprovedTransfer = useCallback(async (transferId: string) => {
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
  const handleExecuteTransfer = useCallback(async (transferId: string) => {
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

  const handleMarkAwaitingReception = useCallback(async (transferId: string) => {
    try {
      // Solicitar notas al usuario (temporalmente con prompt, idealmente sería un modal)
      const notes = window.prompt("Notas adicionales (opcional):", "") || "";

      const res = await markWarehouseTransferAwaitingReception(transferId, notes);
      if (res?.error && res.message) {
        showToast(res.message, "error");
      }
      // Quitar el toast de éxito - solo mostrar errores
    } catch (error) {
      console.error(error);
      showToast("Ocurrió un error, por favor intenta de nuevo", "error");
    }
  }, []);

  const handleViewReception = useCallback((transferId: string) => {
    // Construir la ruta de recepción basada en la ruta actual
    // pathname será algo como: /dashboard/warehouses/[type]/[id]/edit/transfers/list
    // Necesitamos extraer type e id para construir la ruta de recepción
    const pathParts = pathname.split('/');
    const typeIndex = pathParts.indexOf('warehouses') + 1;
    const idIndex = typeIndex + 1;

    if (typeIndex > 0 && idIndex < pathParts.length) {
      const type = pathParts[typeIndex];
      const warehouseId = pathParts[idIndex];
      const receptionPath = `/dashboard/warehouses/${type}/${warehouseId}/reception/${transferId}`;
      push(receptionPath);
    }
  }, [pathname, push]);

  const handleViewTransferDetails = useCallback((transferId: string) => {
    // Para transferencias completadas, ir a una página de solo lectura
    const pathParts = pathname.split('/');
    const typeIndex = pathParts.indexOf('warehouses') + 1;
    const idIndex = typeIndex + 1;

    if (typeIndex > 0 && idIndex < pathParts.length) {
      const type = pathParts[typeIndex];
      const warehouseId = pathParts[idIndex];
      const detailsPath = `/dashboard/warehouses/${type}/${warehouseId}/transfers/${transferId}/details`;
      push(detailsPath);
    }
  }, [pathname, push]);

  const columns = useMemo<DataTableColumn<WarehouseTransfer>[]>(
    () => [
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
              isMarkAwaitingReceptionActive={
                trans?.status === WAREHOUSE_TRANSFER_STATUS.InTransit
              }
              onMarkAwaitingReception={() => handleMarkAwaitingReception(trans?.id)}
              isViewReceptionActive={[
                WAREHOUSE_TRANSFER_STATUS.AwaitingReception,
                WAREHOUSE_TRANSFER_STATUS.PartiallyReceived,
                WAREHOUSE_TRANSFER_STATUS.ReceivedWithDiscrepancies,
              ].includes(trans?.status) && trans?.destinationId === currentWarehouseId}
              onViewReception={() => handleViewReception(trans?.id)}
              isViewDetailsActive={true}
              onViewDetails={() => handleViewTransferDetails(trans?.id)}
            />
          </div>
        ),
      },
    ],
    [handleApprovedTransfer, handleCanceledTransfer, handleExecuteTransfer, handleMarkAwaitingReception, handleViewReception, handleViewTransferDetails]
  );

  return (
    <>
      <DataGrid
       
        simpleData={data}
        columns={columns}
        searchParams={searchParams}
        onSearchParamsChange={onSearchParamsChange}
        searchPlaceholder="Buscar transferencia..."
        onCreate={handleCreateTransfer}
        createPermissions={[PERMISSION_ENUM.CREATE]}
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
