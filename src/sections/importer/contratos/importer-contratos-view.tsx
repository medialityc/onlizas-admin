"use client";

import { useMemo, useState } from "react";
import { Badge, Group, Avatar, Text, Loader, Alert } from "@mantine/core";
import { InformationCircleIcon } from "@heroicons/react/24/solid";
import { DataGrid } from "@/components/datagrid/datagrid";
import { DataTableColumn } from "mantine-datatable";
import { ImporterContract } from "@/services/importer-portal";
import { useImporterData } from "@/contexts/importer-data-context";
import ActionsMenu from "@/components/menu/actions-menu";

interface Props {
  importerId: string;
}

export default function ImporterContratosView({ importerId }: Props) {
  const { importerData } = useImporterData();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState<ImporterContract | null>(null);

  const contracts = importerData?.contracts || [];
  const isLoading = false; // Ya los datos vienen del contexto

  const handleEdit = (contract: ImporterContract) => {
    setSelectedContract(contract);
    setEditModalOpen(true);
    // TODO: Implementar modal de edición
    console.log("Editar contrato:", contract);
  };

  const getStatusConfig = (status: string): { label: string; color: string } => {
    const config: Record<string, { label: string; color: string }> = {
      PENDING: { label: "Pendiente", color: "yellow" },
      APPROVED: { label: "Aprobado", color: "green" },
      ACTIVE: { label: "Activo", color: "green" },
      REJECTED: { label: "Rechazado", color: "red" },
      EXPIRED: { label: "Expirado", color: "gray" },
      TERMINATED: { label: "Terminado", color: "gray" },
    };
    return config[status?.toUpperCase()] || { label: status, color: "gray" };
  };

  const columns = useMemo<DataTableColumn<ImporterContract>[]>(
    () => [
      {
        accessor: "approvalProcessUser.userName",
        title: "Nombre de Usuario",
        render: (r) => {
          const userName = r.approvalProcessUser?.userName || "Usuario Desconocido";
          const userEmail = r.approvalProcessUser?.userEmail || "";
          
          return (
            <Group gap="sm">
              <Avatar size="sm" radius="xl" color="blue">
                {userName?.substring(0, 2).toUpperCase()}
              </Avatar>
              <div>
                <Text size="sm" fw={500} className="text-gray-900 dark:text-gray-100">
                  {userName}
                </Text>
                {userEmail && (
                  <Text size="xs" c="dimmed">
                    {userEmail}
                  </Text>
                )}
              </div>
            </Group>
          );
        },
      },
      {
        accessor: "approvalProcessName",
        title: "Proceso",
        render: (r) => (
          <Text size="sm" className="text-gray-900 dark:text-gray-100">
            {r.approvalProcessName}
          </Text>
        ),
      },
      {
        accessor: "startDate",
        title: "Fecha de Inicio",
        render: (r) => (
          <Text size="sm" c="dimmed">
            {r.startDate ? new Date(r.startDate).toLocaleDateString("es-ES", {
              year: "numeric",
              month: "short",
              day: "numeric",
            }) : "-"}
          </Text>
        ),
      },
      {
        accessor: "endDate",
        title: "Fecha de Fin",
        render: (r) => (
          <Text size="sm" c="dimmed">
            {r.endDate ? new Date(r.endDate).toLocaleDateString("es-ES", {
              year: "numeric",
              month: "short",
              day: "numeric",
            }) : "-"}
          </Text>
        ),
      },
      {
        accessor: "status",
        title: "Estado",
        render: (r) => {
          const config = getStatusConfig(r.status);
          return (
            <Badge color={config.color} variant="filled" size="sm">
              {config.label}
            </Badge>
          );
        },
      },
      {
        accessor: "actions",
        title: "Acciones",
        textAlign: "center",
        render: (r) => (
          <div className="flex justify-center">
            <ActionsMenu
              onEdit={() => handleEdit(r)}
              editPermissions={[]}
            />
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Contratos
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Visualiza y gestiona los contratos de la importadora
        </p>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center py-20">
          <Loader size="lg" />
        </div>
      )}

      {!isLoading && contracts.length === 0 && (
        <Alert 
          icon={<InformationCircleIcon className="h-5 w-5" />} 
          title="No hay contratos" 
          color="blue"
          className="mb-4"
        >
          No se encontraron contratos asociados a esta importadora.
        </Alert>
      )}

      {!isLoading && contracts.length > 0 && (
        <DataGrid<ImporterContract>
          simpleData={contracts}
          columns={columns}
          enablePagination={false}
          enableSorting={true}
          enableSearch={true}
          searchPlaceholder="Buscar por usuario, proceso..."
          emptyText="No hay contratos disponibles"
        />
      )}
    </div>
  );
}
