"use client";
import { ActionIcon, Menu } from "@mantine/core";
import { useState } from "react";
import {
  CheckIcon,
  XMarkIcon,
  PlayIcon,
  EllipsisHorizontalIcon,
  EyeIcon,
  ClockIcon,
  InboxArrowDownIcon,
} from "@heroicons/react/24/solid";
import ConfirmationDialog from "@/components/modal/confirm-modal";
import { usePermissions } from "@/hooks/use-permissions";
import { PERMISSION_ENUM } from "@/lib/permissions";

interface MenuProps {
  onApproveTransfer?: () => void;
  onCancelTransfer?: () => void;
  onExecuteTransfer?: () => void;
  onMarkAwaitingReception?: () => void;
  onViewReception?: () => void;
  onViewDetails?: () => void;
  isApproveActive?: boolean;
  isCancelActive?: boolean;
  isExecuteActive?: boolean;
  isMarkAwaitingReceptionActive?: boolean;
  isViewReceptionActive?: boolean;
  isViewDetailsActive?: boolean;
}

const TransferActionsMenu = ({
  onApproveTransfer,
  onCancelTransfer,
  onExecuteTransfer,
  onMarkAwaitingReception,
  onViewReception,
  onViewDetails,
  isApproveActive = false,
  isCancelActive = false,
  isExecuteActive = false,
  isMarkAwaitingReceptionActive = false,
  isViewReceptionActive = false,
  isViewDetailsActive = false,
}: MenuProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [executeDialogOpen, setExecuteDialogOpen] = useState(false);
  const [awaitingReceptionDialogOpen, setAwaitingReceptionDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Control de permisos
  const { hasPermission } = usePermissions();
  const hasApprovePermission = hasPermission([PERMISSION_ENUM.UPDATE]);
  const hasExecutePermission = hasPermission([PERMISSION_ENUM.UPDATE]);
  const hasCancelPermission = hasPermission([PERMISSION_ENUM.UPDATE]);
  const hasMarkAwaitingPermission = hasPermission([PERMISSION_ENUM.UPDATE]);
  const hasViewPermission = hasPermission([PERMISSION_ENUM.RETRIEVE]);

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

  const handleMarkAwaitingReception = async () => {
    if (onMarkAwaitingReception) {
      setLoading(true);
      try {
        await onMarkAwaitingReception();
      } catch (error) {
        console.error("Error marking awaiting reception:", error);
      } finally {
        setLoading(false);
        setAwaitingReceptionDialogOpen(false);
      }
    }
  };

  // Verificar si hay al menos una acción disponible
  const hasActions =
    (onApproveTransfer && isApproveActive && hasApprovePermission) ||
    (onCancelTransfer && isCancelActive && hasCancelPermission) ||
    (onExecuteTransfer && isExecuteActive && hasExecutePermission) ||
    (onMarkAwaitingReception && isMarkAwaitingReceptionActive && hasMarkAwaitingPermission) ||
    (onViewReception && isViewReceptionActive && hasViewPermission) ||
    (onViewDetails && isViewDetailsActive && hasViewPermission);

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

          {onViewReception && isViewReceptionActive && hasViewPermission && (
            <Menu.Item
              className="p-1 text-sm hover:text-white hover:bg-blue-500"
              leftSection={<InboxArrowDownIcon className="h-4 w-4" />}
              onClick={onViewReception}
            >
              Recepcionar
            </Menu.Item>
          )}

          {onViewDetails && isViewDetailsActive && hasViewPermission && (
            <Menu.Item
              className="p-1 text-sm hover:text-white hover:bg-gray-500"
              leftSection={<EyeIcon className="h-4 w-4" />}
              onClick={onViewDetails}
            >
              Ver Detalles
            </Menu.Item>
          )}

          {onApproveTransfer && isApproveActive && hasApprovePermission && (
            <Menu.Item
              className="p-1 text-sm hover:text-white hover:bg-green-500"
              leftSection={<CheckIcon className="h-4 w-4" />}
              onClick={() => setApproveDialogOpen(true)}
            >
              Aprobar transferencia
            </Menu.Item>
          )}

          {onExecuteTransfer && isExecuteActive && hasExecutePermission && (
            <Menu.Item
              className="p-1 text-sm hover:text-white hover:bg-blue-500"
              leftSection={<PlayIcon className="h-4 w-4" />}
              onClick={() => setExecuteDialogOpen(true)}
            >
              Ejecutar transferencia
            </Menu.Item>
          )}

          {onMarkAwaitingReception && isMarkAwaitingReceptionActive && hasMarkAwaitingPermission && (
            <Menu.Item
              className="p-1 text-sm hover:text-white hover:bg-amber-500"
              leftSection={<ClockIcon className="h-4 w-4" />}
              onClick={() => setAwaitingReceptionDialogOpen(true)}
            >
              Marcar esperando recepción
            </Menu.Item>
          )}

          {onCancelTransfer && isCancelActive && hasCancelPermission && (
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

      {onCancelTransfer && isCancelActive && hasCancelPermission && (
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
      {onApproveTransfer && isApproveActive && hasApprovePermission && (
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
      {onExecuteTransfer && isExecuteActive && hasExecutePermission && (
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
      {onMarkAwaitingReception && isMarkAwaitingReceptionActive && hasMarkAwaitingPermission && (
        <ConfirmationDialog
          onClose={() => setAwaitingReceptionDialogOpen(false)}
          onConfirm={handleMarkAwaitingReception}
          loading={loading}
          open={awaitingReceptionDialogOpen}
          title="Marcar esperando recepción"
          description="¿Estás seguro de que deseas marcar esta transferencia como esperando recepción? El almacén destino podrá proceder con la recepción."
          actionType="confirm"
        />
      )}
    </>
  );
};

export default TransferActionsMenu;
