import { ActionIcon, Menu } from "@mantine/core";
import { useState } from "react";
import {
  CheckIcon,
  CurrencyDollarIcon,
  ArrowDownTrayIcon,
  EyeIcon,
  EllipsisHorizontalIcon,
  LockClosedIcon,
  PencilIcon,
  Cog6ToothIcon,
  DocumentIcon,
  UserPlusIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import DeleteDialog from "../modal/delete-modal";
import ToggleStatusDialog from "../modal/toggle-status-modal";

interface MenuProps {
  onAddUsers?: () => void;
  onEdit?: () => void;
  onEditFull?: () => void; // Nueva acción para edición completa
  onViewDetails?: () => void;
  onViewDocuments?: () => void;
  onDelete?: () => void;
  onPay?: () => void;
  onDownload?: () => void;
  onActive?: () => void;
  isActive?: boolean;
  onBlocked?: () => void;
  isBlocked?: boolean;
  onVerify?: () => void;
  isVerify?: boolean;
  onModifyAttributes?: () => void;
}

const ActionsMenu = ({
  onAddUsers,
  onDelete,
  onEdit,
  onEditFull,
  onViewDocuments,
  onViewDetails,
  onPay,
  onActive,
  isActive,
  isBlocked,
  isVerify,
  onDownload,
  onBlocked,
  onVerify,
  onModifyAttributes,
}: MenuProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [toggleStatusDialogOpen, setToggleStatusDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (onDelete) {
      setLoading(true);
      try {
        await onDelete();
      } catch (error) {
        console.error("Error deleting item:", error);
      } finally {
        setLoading(false);
        setDeleteDialogOpen(false);
      }
    }
  };
  const handleActive = async () => {
    if (onActive) {
      setLoading(true);
      try {
        await onActive();
      } catch (error) {
        console.error("Error activating item:", error);
      } finally {
        setLoading(false);
        setToggleStatusDialogOpen(false);
      }
    }
  };

  return (
    <>
      <Menu shadow="lg" width={200}>
        <Menu.Target>
          <ActionIcon variant="subtle" size="sm">
            <EllipsisHorizontalIcon className="h-5 w-5" />
          </ActionIcon>
        </Menu.Target>

        <Menu.Dropdown className="bg-white text-gray-700 space-y-2 border border-gray-200 px-1 dark:bg-black">
          <Menu.Label>Opciones</Menu.Label>
          {onViewDetails && (
            <Menu.Item
              className="p-1 text-sm  hover:text-white"
              leftSection={<EyeIcon className="h-4 w-4" />}
              onClick={onViewDetails}
            >
              Ver detalles
            </Menu.Item>
          )}

          {onDownload && (
            <Menu.Item
              className="p-1 text-sm  hover:text-white"
              leftSection={<ArrowDownTrayIcon className="h-4 w-4 " />}
              onClick={onDownload}
            >
              Descargar
            </Menu.Item>
          )}

          {onEdit && (
            <Menu.Item
              className="p-1 text-sm hover:text-white"
              leftSection={<PencilIcon className="h-4 w-4 " />}
              onClick={onEdit}
            >
              Editar
            </Menu.Item>
          )}

          {onEditFull && (
            <Menu.Item
              className="p-1 text-sm hover:text-white"
              leftSection={<Cog6ToothIcon className="h-4 w-4 " />}
              onClick={onEditFull}
            >
              Edición Completa
            </Menu.Item>
          )}

          {onModifyAttributes && (
            <Menu.Item
              className="p-1 text-sm hover:text-white"
              leftSection={<Cog6ToothIcon className="h-4 w-4 " />}
              onClick={onModifyAttributes}
            >
              Modificar Atributos
            </Menu.Item>
          )}

          {onPay && (
            <Menu.Item
              className="p-1 text-sm hover:text-white"
              leftSection={<CurrencyDollarIcon className="h-4 w-4 " />}
              onClick={onPay}
            >
              Pagar
            </Menu.Item>
          )}

          {onVerify && (
            <Menu.Item
              className="p-1 text-sm hover:text-white"
              leftSection={<CheckIcon className="h-4 w-4 " />}
              onClick={onVerify}
            >
              {isVerify ? "Quitar Verificación" : "Dar Verificación"}
            </Menu.Item>
          )}

          {onBlocked && (
            <Menu.Item
              className="p-1 text-sm hover:text-white"
              leftSection={<LockClosedIcon className="h-4 w-4 " />}
              onClick={onBlocked}
            >
              {isBlocked ? "Desbloquear" : "Bloquear"}
            </Menu.Item>
          )}

          {onViewDocuments && (
            <Menu.Item
              className="p-1 text-sm"
              leftSection={<DocumentIcon className="h-4 w-4 " />}
              onClick={onViewDocuments}
            >
              Ver Documentos
            </Menu.Item>
          )}
          {onAddUsers && (
            <Menu.Item
              className="p-1 text-sm hover:text-white"
              leftSection={<UserPlusIcon className="h-4 w-4 " />}
              onClick={onAddUsers}
            >
              Añadir Usuarios
            </Menu.Item>
          )}

          {(onDelete || onVerify || onBlocked || onActive) && (
            <>
              <Menu.Divider />
              <Menu.Label>Zona de peligro</Menu.Label>
            </>
          )}
          {onActive && (
            <>
              <Menu.Item
                className={`p-1 text-sm ${isActive ? "hover:bg-red-500" : "hover:bg-green-500"}`}
                leftSection={<CheckIcon className="h-4 w-4 " />}
                onClick={() => setToggleStatusDialogOpen(true)}
              >
                {isActive ? "Desactivar" : "Activar"}
              </Menu.Item>
            </>
          )}

          {onDelete && (
            <>
              <Menu.Item
                className="p-1 text-sm hover:bg-red-500"
                leftSection={<TrashIcon className="h-4 w-4 " />}
                onClick={() => setDeleteDialogOpen(true)}
              >
                Eliminar
              </Menu.Item>
            </>
          )}
        </Menu.Dropdown>
      </Menu>

      {onDelete && (
        <DeleteDialog
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={handleDelete}
          loading={loading}
          open={deleteDialogOpen}
        />
      )}
      {onActive && (
        <ToggleStatusDialog
          isActive={isActive}
          onClose={() => setToggleStatusDialogOpen(false)}
          onConfirm={handleActive}
          open={toggleStatusDialogOpen}
          loading={loading}
        />
      )}
    </>
  );
};
export default ActionsMenu;
