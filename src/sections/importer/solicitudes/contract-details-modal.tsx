"use client";

import { Modal, Stack, Badge, Group } from "@mantine/core";
import { ImporterContract } from "@/services/importer-portal";

interface Props {
  open: boolean;
  onClose: () => void;
  contract: ImporterContract | null;
}

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

export default function ContractDetailsModal({ open, onClose, contract }: Props) {
  if (!contract) return null;

  const statusConfig = getStatusConfig(contract.status);

  return (
    <Modal
      opened={open}
      onClose={onClose}
      title="Detalles del Contrato"
      size="md"
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
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            Importadora
          </p>
          <p className="text-md font-medium text-gray-900 dark:text-gray-100">
            {contract.importerName || "-"}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            Proceso de Aprobación
          </p>
          <p className="text-md font-medium text-gray-900 dark:text-gray-100">
            {contract.approvalProcessName || "-"}
          </p>
        </div>

        <Group grow>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Fecha de Inicio
            </p>
            <p className="text-md font-medium text-gray-900 dark:text-gray-100">
              {contract.startDate
                ? new Date(contract.startDate).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "-"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Fecha de Fin
            </p>
            <p className="text-md font-medium text-gray-900 dark:text-gray-100">
              {contract.endDate
                ? new Date(contract.endDate).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "-"}
            </p>
          </div>
        </Group>

        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            Estado
          </p>
          <Badge color={statusConfig.color} variant="filled" size="md">
            {statusConfig.label}
          </Badge>
        </div>

        {contract.createdAt && (
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Fecha de Solicitud
            </p>
            <p className="text-sm text-gray-900 dark:text-gray-100">
              {new Date(contract.createdAt).toLocaleDateString("es-ES", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        )}
      </Stack>
    </Modal>
  );
}
