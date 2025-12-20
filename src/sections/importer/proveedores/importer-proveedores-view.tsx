"use client";

import { useMemo } from "react";
import { Badge, Group, Avatar, Text } from "@mantine/core";
import { DataGrid } from "@/components/datagrid/datagrid";
import { DataTableColumn } from "mantine-datatable";
import { ImporterContract } from "@/services/importer-portal";
import { useImporterData } from "@/contexts/importer-data-context";

type Contract = ImporterContract;

interface Props {
  importerId: string;
}

export default function ImporterProveedoresView({ importerId }: Props) {
  const { importerData } = useImporterData();
  const allContracts = importerData?.contracts || [];

  const getContractStatus = (contract: Contract): { label: string; color: string } => {
    if (contract.endDate) {
      const endDate = new Date(contract.endDate);
      const now = new Date();
      const daysUntilExpiry = Math.floor((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysUntilExpiry < 0) {
        return { label: "Vencido", color: "red" };
      }
      if (daysUntilExpiry <= 30) {
        return { label: "Por vencer", color: "yellow" };
      }
    }
    
    const status = contract.status?.toUpperCase();
    if (status === "APPROVED" || status === "ACTIVE") {
      return { label: "Vigente", color: "green" };
    }
    if (status === "PENDING") {
      return { label: "Pendiente", color: "yellow" };
    }
    
    return { label: contract.status || "N/A", color: "gray" };
  };

  const activeContracts = useMemo(() => {
    return allContracts.filter((c) => {
      const status = c.status?.toUpperCase();
      return status === "APPROVED" || status === "ACTIVE";
    });
  }, [allContracts]);

  const columns = useMemo<DataTableColumn<Contract>[]>(
    () => [
      {
        accessor: "approvalProcessName",
        title: "Proceso de Aprobación",
        render: (r) => (
          <Group gap="sm">
            <Avatar size="sm" radius="xl" color="blue">
              {r.approvalProcessName?.substring(0, 2).toUpperCase()}
            </Avatar>
            <Text size="sm" fw={500} className="text-gray-900 dark:text-gray-100">
              {r.approvalProcessName}
            </Text>
          </Group>
        ),
      },
      {
        accessor: "status",
        title: "Estado Contrato",
        render: (r) => {
          const status = getContractStatus(r);
          return (
            <Badge color={status.color} variant="filled" size="sm">
              {status.label}
            </Badge>
          );
        },
      },
      {
        accessor: "dates",
        title: "Vigencia",
        render: (r) => (
          <Text size="sm" c="dimmed">
            {r.startDate ? new Date(r.startDate).toLocaleDateString("es-ES") : "-"} - {r.endDate ? new Date(r.endDate).toLocaleDateString("es-ES") : "-"}
          </Text>
        ),
      },
      {
        accessor: "createdAt",
        title: "Fecha de creación",
        render: (r) => (
          <Text size="sm" c="dimmed">
            {r.createdAt ? new Date(r.createdAt).toLocaleDateString("es-ES") : "-"}
          </Text>
        ),
      },
    ],
    []
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Proveedores
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Proveedores con contratos activos
        </p>
      </div>

      <DataGrid<Contract>
        simpleData={activeContracts}
        columns={columns}
        enablePagination={false}
        enableSorting={false}
        enableSearch={false}
        searchPlaceholder=""
        emptyText="No hay proveedores contratados"
      />
    </div>
  );
}
