'use client'
import { ActionIcon, Menu } from "@mantine/core";
import { useState } from "react";
import {
  CheckIcon,
  XMarkIcon,
  PlayIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/24/solid";
import ConfirmationDialog from "@/components/modal/confirm-modal";

interface MenuProps {
  onApproveTransfer?: () => void;
  onCancelTransfer?: () => void;
  onExecuteTransfer?: () => void;
  isApproveActive?: boolean;
  isCancelActive?: boolean;
  isExecuteActive?: boolean;
}

const TransferActionsMenu = ({
  onApproveTransfer,
  onCancelTransfer,
  onExecuteTransfer,
  isApproveActive = false,
  isCancelActive = false,
  isExecuteActive = false,
}: MenuProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [executeDialogOpen, setExecuteDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCancelTransfer = async () => {
    if (onCancelTransfer) {
      setLoading(true);
      try {
        await onCancelTransfer();
      } catch (error) {
        console.error("Error canceling transfer:", error);
      } finally {
        setLoading(false);
        setDeleteDialogOpen(false);
      }
    }
  };

  const handleApproveTransfer = async () => {
    if (onApproveTransfer) {
      setLoading(true);
      try {
        await onApproveTransfer();
      } catch (error) {
        console.error("Error approve transfer:", error);
      } finally {
        setLoading(false);
        setApproveDialogOpen(false);
      }
    }
  };

  const handleExecuteTransfer = async () => {
    if (onExecuteTransfer) {
      setLoading(true);
      try {
        await onExecuteTransfer();
      } catch (error) {
        console.error("Error execute transfer:", error);
      } finally {
        setLoading(false);
        setExecuteDialogOpen(false);
      }
    }
  };

  // Verificar si hay al menos una acción disponible
  const hasActions = (onApproveTransfer && isApproveActive) || 
                    (onCancelTransfer && isCancelActive) || 
                    (onExecuteTransfer && isExecuteActive);

  // Si no hay acciones disponibles, no renderizar el menú
  if (!hasActions) {
    return null;
  }

  return (
    <>
      <Menu shadow="lg" width={220}>
        <Menu.Target>
          <ActionIcon variant="subtle" size="sm">
            <EllipsisHorizontalIcon className="h-5 w-5" />
          </ActionIcon>
        </Menu.Target>

        <Menu.Dropdown className="bg-white text-gray-700 space-y-2 border border-gray-200 px-1 dark:bg-black">
          <Menu.Label>Acciones</Menu.Label>

          {onApproveTransfer && isApproveActive && (
            <Menu.Item
              className="p-1 text-sm hover:text-white hover:bg-green-500"
              leftSection={<CheckIcon className="h-4 w-4" />}
              onClick={() => setApproveDialogOpen(true)}
            >
              Aprobar transferencia
            </Menu.Item>
          )}

          {onExecuteTransfer && isExecuteActive && (
            <Menu.Item
              className="p-1 text-sm hover:text-white hover:bg-blue-500"
              leftSection={<PlayIcon className="h-4 w-4" />}
              onClick={() => setExecuteDialogOpen(true)}
            >
              Ejecutar transferencia
            </Menu.Item>
          )}

          {onCancelTransfer && isCancelActive && (
            <>
              <Menu.Divider />
              <Menu.Label>Zona de peligro</Menu.Label>
              <Menu.Item
                className="p-1 text-sm hover:text-white hover:bg-red-500"
                leftSection={<XMarkIcon className="h-4 w-4" />}
                onClick={() => setDeleteDialogOpen(true)}
              >
                Cancelar transferencia
              </Menu.Item>
            </>
          )}
        </Menu.Dropdown>
      </Menu>

      {onCancelTransfer && isCancelActive && (
        <ConfirmationDialog
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={handleCancelTransfer}
          loading={loading}
          open={deleteDialogOpen}
          title="Cancelar transferencia"
          description="¿Estás seguro de que deseas cancelar esta transferencia? Esta acción no se puede deshacer."
          actionType="canceled"
        />
      )}
      {onApproveTransfer && isApproveActive && (
        <ConfirmationDialog
          onClose={() => setApproveDialogOpen(false)}
          onConfirm={handleApproveTransfer}
          loading={loading}
          open={approveDialogOpen}
          title="Aprobar transferencia"
          description="¿Estás seguro de que deseas aprobar esta transferencia? Esta acción no se puede deshacer."
          actionType="approve"
        />
      )}
      {onExecuteTransfer && isExecuteActive && (
        <ConfirmationDialog
          onClose={() => setExecuteDialogOpen(false)}
          onConfirm={handleExecuteTransfer}
          loading={loading}
          open={executeDialogOpen}
          title="Ejecutar transferencia"
          description="¿Estás seguro de que deseas ejecutar esta transferencia? Esta acción no se puede deshacer."
          actionType="confirm"
        />
      )}
    </>
  );
};

export default TransferActionsMenu;