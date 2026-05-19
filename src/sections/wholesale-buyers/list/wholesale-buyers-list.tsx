"use client";

import { DataGrid } from "@/components/datagrid/datagrid";
import showToast from "@/config/toast/toastConfig";
import { useModalState } from "@/hooks/use-modal-state";
import { SearchParams } from "@/types/fetch/request";
import {
  ListWholesaleBuyersResult,
  WholesaleBuyerDTO,
  WholesaleBuyerState,
} from "@/types/wholesale-buyers";
import { DataTableColumn } from "mantine-datatable";
import { useCallback, useMemo } from "react";
import { usePermissions } from "@/hooks/use-permissions";
import { PERMISSION_ENUM } from "@/lib/permissions";
import ApproveWholesaleBuyerModal from "../modals/approve-wholesale-buyer-modal";
import RejectRevokeWholesaleBuyerModal from "../modals/reject-revoke-wholesale-buyer-modal";

const STATE_LABELS: Record<WholesaleBuyerState, string> = {
  Pending: "Pendiente",
  Approved: "Aprobado",
  Rejected: "Rechazado",
  Revoked: "Revocado",
};

const STATE_STYLES: Record<WholesaleBuyerState, string> = {
  Pending:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  Approved: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  Rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  Revoked: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
};

interface WholesaleBuyersListProps {
  data?: ListWholesaleBuyersResult;
  searchParams: SearchParams;
  onSearchParamsChange: (params: SearchParams) => void;
}

export function WholesaleBuyersList({
  data,
  searchParams,
  onSearchParamsChange,
}: WholesaleBuyersListProps) {
  const { openModal, getModalState, closeModal } = useModalState();
  const { hasPermission } = usePermissions();

  const canManage = hasPermission([
    PERMISSION_ENUM.CREATE,
    PERMISSION_ENUM.UPDATE,
    PERMISSION_ENUM.DELETE,
    PERMISSION_ENUM.RETRIEVE,
  ]);

  const approveModal = getModalState<string>("approve");
  const rejectModal = getModalState<string>("reject");
  const revokeModal = getModalState<string>("revoke");

  const getBuyer = (id?: string) => data?.items.find((b) => b.id === id);

  const approveBuyer = getBuyer(approveModal.id);
  const rejectBuyer = getBuyer(rejectModal.id);
  const revokeBuyer = getBuyer(revokeModal.id);

  const tableData = useMemo(
    () => ({
      data: data?.items ?? [],
      totalCount: data?.totalCount ?? 0,
      page: data?.page ?? 1,
      pageSize: data?.pageSize ?? 20,
      hasNext: false,
      hasPrevious: false,
    }),
    [data],
  );

  const columns = useMemo<DataTableColumn<WholesaleBuyerDTO>[]>(
    () => [
      {
        accessor: "userName",
        title: "Usuario",
        sortable: true,
        render: (buyer) => (
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
              {buyer.userName}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {buyer.userEmail}
            </span>
          </div>
        ),
      },
      {
        accessor: "businessName",
        title: "Negocio",
        sortable: true,
        render: (buyer) => (
          <div className="flex flex-col">
            <span className="text-sm text-gray-800 dark:text-gray-200">
              {buyer.businessName}
            </span>
            {buyer.taxId && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                NIT: {buyer.taxId}
              </span>
            )}
          </div>
        ),
      },
      {
        accessor: "phone",
        title: "Teléfono",
        render: (buyer) => (
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {buyer.phone
              ? `${buyer.phoneCountryCode ?? ""} ${buyer.phone}`.trim()
              : "—"}
          </span>
        ),
      },
      {
        accessor: "state",
        title: "Estado",
        sortable: true,
        render: (buyer) => (
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATE_STYLES[buyer.state]}`}
          >
            {STATE_LABELS[buyer.state]}
          </span>
        ),
      },
      {
        accessor: "createdAt",
        title: "Fecha solicitud",
        sortable: true,
        render: (buyer) => (
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {new Date(buyer.createdAt).toLocaleDateString("es-ES")}
          </span>
        ),
      },
      {
        accessor: "expiresAt",
        title: "Vence",
        render: (buyer) => (
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {buyer.expiresAt
              ? new Date(buyer.expiresAt).toLocaleDateString("es-ES")
              : "Sin vencimiento"}
          </span>
        ),
      },
      {
        accessor: "requestMessage",
        title: "Mensaje",
        render: (buyer) => (
          <span
            className="text-sm text-gray-600 dark:text-gray-300 max-w-50 truncate block"
            title={buyer.requestMessage ?? undefined}
          >
            {buyer.requestMessage || "—"}
          </span>
        ),
      },
      {
        accessor: "actions",
        title: "Acciones",
        render: (buyer) => {
          if (!canManage) return null;
          return (
            <div className="flex gap-2">
              {buyer.state === "Pending" && (
                <>
                  <button
                    onClick={() => openModal<string>("approve", buyer.id)}
                    className="rounded px-2 py-1 text-xs font-medium bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800 transition-colors"
                  >
                    Aprobar
                  </button>
                  <button
                    onClick={() => openModal<string>("reject", buyer.id)}
                    className="rounded px-2 py-1 text-xs font-medium bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800 transition-colors"
                  >
                    Rechazar
                  </button>
                </>
              )}
              {buyer.state === "Approved" && (
                <button
                  onClick={() => openModal<string>("revoke", buyer.id)}
                  className="rounded px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Revocar
                </button>
              )}
            </div>
          );
        },
      },
    ],
    [canManage, openModal],
  );

  return (
    <>
      <DataGrid<WholesaleBuyerDTO>
        data={tableData}
        columns={columns}
        searchParams={searchParams}
        onSearchParamsChange={onSearchParamsChange}
        searchPlaceholder="Buscar por nombre, empresa..."
        emptyText="No hay compradores mayoristas registrados"
        enableSearch
        enablePagination
        enableSorting
      />

      {approveModal.open && approveBuyer && (
        <ApproveWholesaleBuyerModal
          open
          onClose={() => closeModal("approve")}
          buyer={approveBuyer}
        />
      )}

      {rejectModal.open && rejectBuyer && (
        <RejectRevokeWholesaleBuyerModal
          open
          onClose={() => closeModal("reject")}
          buyer={rejectBuyer}
          mode="reject"
        />
      )}

      {revokeModal.open && revokeBuyer && (
        <RejectRevokeWholesaleBuyerModal
          open
          onClose={() => closeModal("revoke")}
          buyer={revokeBuyer}
          mode="revoke"
        />
      )}
    </>
  );
}
