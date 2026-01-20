"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Badge,
  Group,
  Avatar,
  Text,
  Modal,
  Stack,
  Loader,
  Alert,
  Button,
} from "@mantine/core";
import { InformationCircleIcon } from "@heroicons/react/24/solid";
import { DataGrid } from "@/components/datagrid/datagrid";
import { DataTableColumn } from "mantine-datatable";
import { ImporterContract } from "@/services/importer-portal";
import showToast from "@/config/toast/toastConfig";
import { usePendingContracts } from "@/hooks/react-query/use-pending-contracts";
import { useQueryClient } from "@tanstack/react-query";
import ActionsMenu from "@/components/menu/actions-menu";
import ContractDetailsModal from "./contract-details-modal";
import RHFInputWithLabel from "@/components/react-hook-form/rhf-input";
import FormProvider from "@/components/react-hook-form/form-provider";
import { useForm } from "react-hook-form";

type Contract = ImporterContract;

interface Props {
  importerId: string;
}

type RejectForm = {
  reason: string;
};

export default function ImporterSolicitudesView({ importerId }: Props) {
  const {
    data: contracts = [],
    isLoading: isLoadingContracts,
    error,
    isError,
  } = usePendingContracts(importerId);
  const queryClient = useQueryClient();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(
    null
  );

  const rejectMethods = useForm<RejectForm>({
    defaultValues: {
      reason: "",
    },
  });

  const handleViewDetails = (contract: Contract) => {
    setSelectedContract(contract);
    setDetailsModalOpen(true);
  };

  const handleApprove = async (contract: Contract) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/importer-access/contracts/${contract.id}/approve`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      if (response.ok && result.success) {
        showToast("Contrato aprobado exitosamente", "success");
        // Invalidar las queries para recargar los datos
        await queryClient.invalidateQueries({
          queryKey: ["importer-pending-contracts", importerId],
        });
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
    rejectMethods.reset({ reason: "" });
    setRejectModalOpen(true);
  };

  const handleRejectConfirm = async (values: RejectForm) => {
    if (!selectedContract || !values.reason.trim()) {
      showToast("Debe ingresar un motivo de rechazo", "error");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/importer-access/contracts/${selectedContract.id}/reject`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ reason: values.reason }),
        }
      );

      const result = await response.json();

      if (response.ok && result.success) {
        showToast("Contrato rechazado", "success");
        setRejectModalOpen(false);
        rejectMethods.reset();
        // Invalidar las queries para recargar los datos
        await queryClient.invalidateQueries({
          queryKey: ["importer-pending-contracts", importerId],
        });
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

  const getStatusConfig = (
    status: string
  ): { label: string; color: string } => {
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
            <Text
              size="sm"
              fw={500}
              className="text-gray-900 dark:text-gray-100"
            >
              {r.approvalProcessName}
            </Text>
          </Group>
        ),
      },
      {
        accessor: "startDate",
        title: "Fecha de Inicio",
        render: (r) => (
          <Text size="sm" c="dimmed">
            {r.startDate
              ? new Date(r.startDate).toLocaleDateString("es-ES")
              : "-"}
          </Text>
        ),
      },
      {
        accessor: "nomenclators",
        title: "Nomencladores",
        render: (r) => {
          const nomenclators = r.nomenclators || [];
          if (nomenclators.length === 0) {
            return <Text size="sm" c="dimmed">-</Text>;
          }
          
          const first3 = nomenclators.slice(0, 3).map(n => n.name).join(", ");
          const remaining = nomenclators.length - 3;
          
          return (
            <Text size="sm" c="dimmed">
              {first3}
              {remaining > 0 && ` y ${remaining} más`}
            </Text>
          );
        },
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

      {isError && error && (
        <Alert
          icon={<InformationCircleIcon className="h-5 w-5" />}
          title="Error al cargar solicitudes"
          color="red"
          className="mb-4"
        >
          {error instanceof Error ? error.message : "No se pudieron cargar las solicitudes de contrato. Por favor, intenta nuevamente."}
        </Alert>
      )}

      {!isLoadingContracts && !isError && (
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
        onClose={() => {
          setRejectModalOpen(false);
          rejectMethods.reset();
        }}
        title="Rechazar Solicitud"
        centered
        styles={{
          content: {
            backgroundColor: "light-dark(#ffffff, #0e1726)",
          },
          header: {
            backgroundColor: "light-dark(#ffffff, #0e1726)",
            borderBottom: "1px solid light-dark(#e5e7eb, #1b2e4b)",
          },
          title: {
            color: "light-dark(#000000, #ffffff)",
            fontWeight: 600,
          },
          close: {
            color: "light-dark(#374151, #e5e7eb)",
          },
          body: {
            backgroundColor: "light-dark(#ffffff, #0e1726)",
          },
        }}
      >
        <FormProvider methods={rejectMethods} onSubmit={handleRejectConfirm}>
          <Stack gap="md">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              ¿Estás seguro de rechazar la solicitud de{" "}
              {selectedContract?.approvalProcessName}?
            </p>
            
            <RHFInputWithLabel
              name="reason"
              label="Motivo del rechazo"
              placeholder="Ingrese el motivo del rechazo..."
              type="textarea"
              required
            />

            <Group justify="flex-end" gap="sm">
              <Button
                variant="subtle"
                onClick={() => {
                  setRejectModalOpen(false);
                  rejectMethods.reset();
                }}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                color="red"
                loading={isLoading}
                disabled={isLoading || !rejectMethods.watch("reason")?.trim()}
              >
                Rechazar
              </Button>
            </Group>
          </Stack>
        </FormProvider>
      </Modal>
    </div>
  );
}
