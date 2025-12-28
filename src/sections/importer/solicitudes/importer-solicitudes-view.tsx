"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Badge, Group, Avatar, Text, Modal, Textarea, Stack, Loader, Alert, Button } from "@mantine/core";
import { InformationCircleIcon } from "@heroicons/react/24/solid";
import { DataGrid } from "@/components/datagrid/datagrid";
import { DataTableColumn } from "mantine-datatable";
import { approveContract, rejectContract, ImporterContract } from "@/services/importer-portal";
import showToast from "@/config/toast/toastConfig";
import { usePendingContracts } from "@/hooks/react-query/use-pending-contracts";
import { useQueryClient } from "@tanstack/react-query";
import ActionsMenu from "@/components/menu/actions-menu";
import ContractDetailsModal from "./contract-details-modal";

type Contract = ImporterContract;

interface Props {
  importerId: string;
}

export default function ImporterSolicitudesView({ importerId }: Props) {
  const { data: contracts = [], isLoading: isLoadingContracts, error } = usePendingContracts(importerId);
  const queryClient = useQueryClient();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const handleViewDetails = (contract: Contract) => {
    setSelectedContract(contract);
    setDetailsModalOpen(true);
  };

  const handleApprove = async (contract: Contract) => {
    setIsLoading(true);
    try {
      const result = await approveContract(contract.id);
      if (result.success) {
        showToast("Contrato aprobado exitosamente", "success");
        // Invalidar las queries para recargar los datos
        await queryClient.invalidateQueries({ queryKey: ["importer-pending-contracts", importerId] });
        router.refresh();
      } else {
        showToast(result.message || "Error al aprobar contrato", "error");
      }
    } catch {
      showToast("Error al aprobar contrato", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRejectClick = (contract: Contract) => {
    setSelectedContract(contract);
    setRejectReason("");
    setRejectModalOpen(true);
  };

  const handleRejectConfirm = async () => {
    if (!selectedContract || !rejectReason.trim()) {
      showToast("Debe ingresar un motivo de rechazo", "error");
      return;
    }
    
    setIsLoading(true);
    try {
      const result = await rejectContract(selectedContract.id, rejectReason);
      if (result.success) {
        showToast("Contrato rechazado", "success");
        setRejectModalOpen(false);
        // Invalidar las queries para recargar los datos
        await queryClient.invalidateQueries({ queryKey: ["importer-pending-contracts", importerId] });
        router.refresh();
      } else {
        showToast(result.message || "Error al rechazar contrato", "error");
      }
    } catch {
      showToast("Error al rechazar contrato", "error");
    } finally {
      setIsLoading(false);
    }
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
        accessor: "createdAt",
        title: "Fecha Solicitud",
        render: (r) => (
          <Text size="sm" c="dimmed">
            {r.createdAt ? new Date(r.createdAt).toLocaleDateString("es-ES") : "-"}
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
        render: (r) => {
          const isPending = r.status?.toUpperCase() === "PENDING";
          
          return (
            <div className="flex justify-center">
              <ActionsMenu
                onViewDetails={() => handleViewDetails(r)}
                onApprove={isPending ? () => handleApprove(r) : undefined}
                onReject={isPending ? () => handleRejectClick(r) : undefined}
                viewPermissions={[]}
                approvePermissions={[]}
                rejectPermissions={[]}
              />
            </div>
          );
        },
      },
    ],
    [isLoading]
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Solicitudes de Contrato
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Revisa y gestiona las solicitudes de contrato de proveedores
        </p>
      </div>

      {isLoadingContracts && (
        <div className="flex justify-center items-center py-20">
          <Loader size="lg" />
        </div>
      )}

      {error && (
        <Alert 
          icon={<InformationCircleIcon className="h-5 w-5" />} 
          title="Error al cargar solicitudes" 
          color="red"
          className="mb-4"
        >
          No se pudieron cargar las solicitudes de contrato. Por favor, intenta nuevamente.
        </Alert>
      )}

      {!isLoadingContracts && !error && (
        <DataGrid<Contract>
          simpleData={contracts}
          columns={columns}
          enablePagination={false}
          enableSorting={false}
          enableSearch={false}
          searchPlaceholder=""
          emptyText="No hay solicitudes de contrato pendientes"
        />
      )}

      <ContractDetailsModal
        open={detailsModalOpen}
        onClose={() => {
          setDetailsModalOpen(false);
          setSelectedContract(null);
        }}
        contract={selectedContract}
      />

      <Modal
        opened={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="Rechazar Solicitud"
        centered
        styles={{
          content: {
            backgroundColor: 'light-dark(#ffffff, #0e1726)',
          },
          header: {
            backgroundColor: 'light-dark(#ffffff, #0e1726)',
            borderBottom: '1px solid light-dark(#e5e7eb, #1b2e4b)',
          },
          title: {
            color: 'light-dark(#000000, #ffffff)',
            fontWeight: 600,
          },
          close: {
            color: 'light-dark(#374151, #e5e7eb)',
          },
          body: {
            backgroundColor: 'light-dark(#ffffff, #0e1726)',
          },
        }}
      >
        <Stack gap="md">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            ¿Estás seguro de rechazar la solicitud de {selectedContract?.supplierName}?
          </p>
          <Textarea
            label="Motivo del rechazo"
            placeholder="Ingrese el motivo del rechazo..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            required
            minRows={3}
            styles={{
              input: {
                backgroundColor: 'light-dark(#ffffff, #1b2e4b)',
                color: 'light-dark(#000000, #ffffff)',
                borderColor: 'light-dark(#e5e7eb, #17263c)',
              },
              label: {
                color: 'light-dark(#000000, #ffffff)',
              },
            }}
          />
          <Group justify="flex-end" gap="sm">
            <Button variant="subtle" onClick={() => setRejectModalOpen(false)}>
              Cancelar
            </Button>
            <Button
              color="red"
              onClick={handleRejectConfirm}
              loading={isLoading}
              disabled={!rejectReason.trim()}
            >
              Rechazar
            </Button>
          </Group>
        </Stack>
      </Modal>
    </div>
  );
}
