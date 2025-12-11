"use client";

import { DataGrid } from "@/components/datagrid/datagrid";
import { DataTableColumn } from "mantine-datatable";
import { ImporterContractRequest, SupplierContract } from "@/types/importers";
import { useCallback, useMemo } from "react";
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
        accessor: "startDate",
        title: "Inicio",
        render: (r) => new Date(r.startDate).toLocaleDateString("es-ES"),
      },
      {
        accessor: "endDate",
        title: "Fin",
        render: (r) => new Date(r.endDate).toLocaleDateString("es-ES"),
      },
      {
        accessor: "status",
        title: "Estado",
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
    ],
    []
  );

  return (
    <div className="p-6">
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
    </div>
  );
}
