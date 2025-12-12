"use client";

import { DataGrid } from "@/components/datagrid/datagrid";
import { DataTableColumn } from "mantine-datatable";
import { ImporterContractRequest, SupplierContract } from "@/types/importers";
import { useCallback, useMemo } from "react";
import { usePermissions } from "@/hooks/use-permissions";
import { PERMISSION_ADMIN } from "@/lib/permissions";
import { Badge, Tabs } from "@mantine/core";
import { approveContractRequest, rejectContractRequest } from "@/services/importer-contracts";
import showToast from "@/config/toast/toastConfig";
import { useRouter } from "next/navigation";
import IconSquareCheck from "@/components/icon/icon-square-check";
import IconX from "@/components/icon/icon-x";

interface Props {
  pendingRequests: ImporterContractRequest[];
  approvedContracts: SupplierContract[];
  importerName: string;
}

export default function ProvidersListClient({
  pendingRequests,
  approvedContracts,
  importerName,
}: Props) {
  const router = useRouter();
  const { hasPermission, isLoading: permissionsLoading } = usePermissions();

  const canAccess = !permissionsLoading && hasPermission(PERMISSION_ADMIN);

  const handleApprove = useCallback(
    async (request: ImporterContractRequest) => {
      try {
        const res = await approveContractRequest(request.id);
        if (res.error) {
          showToast(res.message || "Error al aprobar solicitud", "error");
        } else {
          showToast("Solicitud aprobada correctamente", "success");
          router.refresh();
        }
      } catch (e) {
        console.error(e);
        showToast("Ocurrió un error, intente nuevamente", "error");
      }
    },
    [router]
  );

  const handleReject = useCallback(
    async (request: ImporterContractRequest) => {
      try {
        const res = await rejectContractRequest(request.id);
        if (res.error) {
          showToast(res.message || "Error al rechazar solicitud", "error");
        } else {
          showToast("Solicitud rechazada", "success");
          router.refresh();
        }
      } catch (e) {
        console.error(e);
        showToast("Ocurrió un error, intente nuevamente", "error");
      }
    },
    [router]
  );

  const pendingColumns = useMemo<DataTableColumn<ImporterContractRequest>[]>(
    () => [
      {
        accessor: "supplierName",
        title: "Proveedor",
        render: (r) => (
          <div className="flex flex-col">
            <span className="font-medium text-gray-900 dark:text-gray-100">{r.supplierName}</span>
            <span className="text-xs text-gray-500">{r.supplierEmail}</span>
          </div>
        ),
      },
      {
        accessor: "nomenclatorName",
        title: "Nomenclador",
        render: (r) => (
          <Badge variant="light" color="blue">
            {r.nomenclatorName}
          </Badge>
        ),
      },
      {
        accessor: "requestedDatetime",
        title: "Fecha de Solicitud",
        render: (r) => new Date(r.requestedDatetime).toLocaleDateString("es-ES", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      },
      {
        accessor: "actions",
        title: "Acciones",
        textAlign: "center",
        render: (request) => (
          <div className="flex justify-center gap-2">
            <button
              onClick={() => handleApprove(request)}
              className="btn btn-sm btn-success"
              title="Aprobar"
            >
              <IconSquareCheck className="w-4 h-4" />
              Aprobar
            </button>
            <button
              onClick={() => handleReject(request)}
              className="btn btn-sm btn-danger"
              title="Rechazar"
            >
              <IconX className="w-4 h-4" />
              Rechazar
            </button>
          </div>
        ),
      },
    ],
    [handleApprove, handleReject]
  );

  const approvedColumns = useMemo<DataTableColumn<SupplierContract>[]>(
    () => [
      {
        accessor: "supplierName",
        title: "Proveedor",
        render: (r) => (
          <div className="flex flex-col">
            <span className="font-medium text-gray-900 dark:text-gray-100">{r.supplierName}</span>
            <span className="text-xs text-gray-500">{r.supplierEmail}</span>
          </div>
        ),
      },
      {
        accessor: "nomenclatorName",
        title: "Nomenclador",
        render: (r) => (
          <Badge variant="light" color="blue">
            {r.nomenclatorName}
          </Badge>
        ),
      },
      {
        accessor: "status",
        title: "Estado del Contrato",
        render: (r) => {
          const colors = {
            ACTIVE: "green",
            EXPIRED: "red",
            TERMINATED: "gray",
          };
          return (
            <Badge color={colors[r.status]}>
              {r.status === "ACTIVE" ? "Activo" : r.status === "EXPIRED" ? "Vencido" : "Terminado"}
            </Badge>
          );
        },
      },
      {
        accessor: "validity",
        title: "Vigencia",
        render: (r) => {
          const startDate = new Date(r.startDate).toLocaleDateString("es-ES");
          const endDate = new Date(r.endDate).toLocaleDateString("es-ES");
          return `${startDate} - ${endDate}`;
        },
      },
      {
        accessor: "actions",
        title: "Acciones",
        textAlign: "center",
        render: (r) => (
          <div className="flex justify-center gap-2">
            <button
              onClick={() => router.push(`/dashboard/suppliers/${r.supplierId}`)}
              className="btn btn-sm btn-outline-primary"
              title="Ver proveedor"
            >
              Ver proveedor
            </button>
            <button
              onClick={() => router.push(`/dashboard/importadoras/${r.importerId}/proveedores/${r.id}`)}
              className="btn btn-sm btn-outline-info"
              title="Ver contrato"
            >
              Ver contrato
            </button>
          </div>
        ),
      },
    ],
    [router]
  );

  return (
    <div className="p-6">
      {permissionsLoading && (
        <div className="text-sm text-gray-600 dark:text-gray-400">Comprobando permisos...</div>
      )}
      {!permissionsLoading && !canAccess && (
        <div className="panel p-6">
          <h2 className="text-lg font-semibold mb-2">Acceso denegado</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">No tienes permisos de administrador para ver esta página.</p>
        </div>
      )}
      {!permissionsLoading && canAccess && (
        <>
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Proveedores - {importerName}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Gestiona las solicitudes y contratos de proveedores
            </p>
          </div>

          <Tabs defaultValue="pending" className="mt-6">
        <Tabs.List>
          <Tabs.Tab value="pending">
            Solicitudes Pendientes
            {pendingRequests.length > 0 && (
              <Badge ml="xs" size="sm" variant="filled" color="yellow">
                {pendingRequests.length}
              </Badge>
            )}
          </Tabs.Tab>
          <Tabs.Tab value="approved">
            Proveedores Aprobados
            {approvedContracts.length > 0 && (
              <Badge ml="xs" size="sm" variant="filled" color="green">
                {approvedContracts.length}
              </Badge>
            )}
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="pending" pt="md">
          <DataGrid<ImporterContractRequest>
            simpleData={pendingRequests}
            columns={pendingColumns}
            enablePagination={false}
            enableSorting={false}
            enableSearch={false}
            searchPlaceholder=""
            emptyText="No hay solicitudes pendientes"
          />
        </Tabs.Panel>

        <Tabs.Panel value="approved" pt="md">
          <DataGrid<SupplierContract>
            simpleData={approvedContracts}
            columns={approvedColumns}
            enablePagination={false}
            enableSorting={false}
            enableSearch={false}
            searchPlaceholder=""
            emptyText="No hay contratos aprobados"
          />
        </Tabs.Panel>
      </Tabs>
        </>
      )}
    </div>
  );
}
