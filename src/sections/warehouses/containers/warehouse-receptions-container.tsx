"use client";

import { ApiResponse } from "@/types/fetch/api";
import { SearchParams } from "@/types/fetch/request";
import {
  GetAllTransferReceptions,
  TransferReceptionStatus,
  TransferReception,
} from "@/types/warehouse-transfer-receptions";
import { WarehouseFormData } from "../schemas/warehouse-schema";
import { DataGrid } from "@/components/datagrid/datagrid";
import { DataTableColumn } from "mantine-datatable";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import DateValue from "@/components/format-vales/date-value";
import Badge from "@/components/badge/badge";
import { Button } from "@/components/button/button";
import { EyeIcon } from "@heroicons/react/24/outline";

import { useCallback } from "react";

interface Props {
  warehouse: WarehouseFormData;
  receptionsPromise: ApiResponse<GetAllTransferReceptions>;
  query: SearchParams;
}

export default function WarehouseReceptionsContainer({
  warehouse,
  receptionsPromise,
  query,
}: Props) {
  const router = useRouter();
  const hasError = receptionsPromise?.error;

  const handleViewReception = useCallback(
    (transferId: string) => {
      router.push(
        `/dashboard/warehouses/${warehouse.type}/${warehouse.id}/reception/${transferId}`,
      );
    },
    [router, warehouse.type, warehouse.id],
  );

  const columns = useMemo<DataTableColumn<TransferReception>[]>(
    () => [
      {
        accessor: "transferNumber",
        title: "Número de Transferencia",
        width: 200,
      },
      {
        accessor: "originWarehouseName",
        title: "Almacén Origen",
        width: 200,
      },
      {
        accessor: "status",
        title: "Estado",
        width: 180,
        render: (reception: TransferReception) => (
          <Badge
            children={reception.status}
            variant={getStatusColor(reception.status)}
          />
        ),
      },
      {
        accessor: "createdAt",
        title: "Fecha de Envío",
        width: 150,
        render: (reception: TransferReception) => (
          <DateValue value={reception.receivedAt} />
        ),
      },
      {
        accessor: "actions" as keyof TransferReception,
        title: "Acciones",
        width: 120,
        textAlign: "center" as const,
        render: (reception: TransferReception) => (
          <Button
            onClick={() => handleViewReception(reception.transferId)}
            variant="secondary"
            size="sm"
          >
            <EyeIcon className="h-4 w-4 mr-2" />
            Ver Recepción
          </Button>
        ),
      },
    ],
    [handleViewReception],
  );

  const getStatusColor = (
    status: TransferReceptionStatus,
  ): "primary" | "success" | "warning" | "danger" | "info" => {
    switch (status) {
      case "PENDING":
        return "warning";
      case "RECEIVED":
        return "success";
      case "WITH_DISCREPANCY":
        return "danger";
      case "DISCREPANCY_RESOLVED":
        return "success";
      default:
        return "primary";
    }
  };

  if (hasError) {
    return (
      <div>
        <div className="text-center py-12">
          <p className="text-red-500 dark:text-red-400">
            Error al cargar las recepciones: {receptionsPromise.message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-dark dark:text-white-light">
            Recepciones de Transferencias
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Gestiona las recepciones de transferencias para {warehouse.name}
          </p>
        </div>
      </div>

      <DataGrid
        data={receptionsPromise?.data}
        columns={columns}
        searchParams={query}
        searchPlaceholder="Buscar recepciones..."
        emptyText="No se encontraron recepciones de transferencias"
      />
    </div>
  );
}
