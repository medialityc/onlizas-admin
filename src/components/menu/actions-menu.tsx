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
import { useHasPermissions } from "@/auth-sso/permissions/hooks";

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

  // Permissions - si no se especifican, se asumen permisos generales
  viewPermissions?: string[];
  editPermissions?: string[];
  deletePermissions?: string[];
  activePermissions?: string[];
  documentsPermissions?: string[];
  addUsersPermissions?: string[];
  payPermissions?: string[];
  downloadPermissions?: string[];
  blockedPermissions?: string[];
  verifyPermissions?: string[];
  modifyAttributesPermissions?: string[];
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
  viewPermissions,
  editPermissions,
  deletePermissions,
  activePermissions,
  documentsPermissions,
  addUsersPermissions,
  payPermissions,
  downloadPermissions,
  blockedPermissions,
  verifyPermissions,
  modifyAttributesPermissions,
}: MenuProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [toggleStatusDialogOpen, setToggleStatusDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Verificar permisos
  const hasViewPermission = useHasPermissions(viewPermissions);
  const hasEditPermission = useHasPermissions(editPermissions);
  const hasDeletePermission = useHasPermissions(deletePermissions);
  const hasActivePermission = useHasPermissions(activePermissions);
  const hasDocumentsPermission = useHasPermissions(documentsPermissions);
  const hasAddUsersPermission = useHasPermissions(addUsersPermissions);
  const hasPayPermission = useHasPermissions(payPermissions);
  const hasDownloadPermission = useHasPermissions(downloadPermissions);
  const hasBlockedPermission = useHasPermissions(blockedPermissions);
  const hasVerifyPermission = useHasPermissions(verifyPermissions);
  const hasModifyAttributesPermission = useHasPermissions(modifyAttributesPermissions);

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
          {onViewDetails && hasViewPermission && (
            <Menu.Item
              className="p-1 text-sm  hover:text-white"
              leftSection={<EyeIcon className="h-4 w-4" />}
              onClick={onViewDetails}
            >
              Ver detalles
            </Menu.Item>
          )}

          {onDownload && hasDownloadPermission && (
            <Menu.Item
              className="p-1 text-sm  hover:text-white"
              leftSection={<ArrowDownTrayIcon className="h-4 w-4 " />}
              onClick={onDownload}
            >
              Descargar
            </Menu.Item>
          )}

          {onEdit && hasEditPermission && (
            <Menu.Item
              className="p-1 text-sm hover:text-white"
              leftSection={<PencilIcon className="h-4 w-4 " />}
              onClick={onEdit}
            >
              Editar
            </Menu.Item>
          )}

          {onEditFull && hasEditPermission && (
            <Menu.Item
              className="p-1 text-sm hover:text-white"
              leftSection={<Cog6ToothIcon className="h-4 w-4 " />}
              onClick={onEditFull}
            >
              Edición Completa
            </Menu.Item>
          )}

          {onModifyAttributes && hasModifyAttributesPermission && (
            <Menu.Item
              className="p-1 text-sm hover:text-white"
              leftSection={<Cog6ToothIcon className="h-4 w-4 " />}
              onClick={onModifyAttributes}
            >
              Modificar Atributos
            </Menu.Item>
          )}

          {onPay && hasPayPermission && (
            <Menu.Item
              className="p-1 text-sm hover:text-white"
              leftSection={<CurrencyDollarIcon className="h-4 w-4 " />}
              onClick={onPay}
            >
              Pagar
            </Menu.Item>
          )}

          {onVerify && hasVerifyPermission && (
            <Menu.Item
              className="p-1 text-sm hover:text-white"
              leftSection={<CheckIcon className="h-4 w-4 " />}
              onClick={onVerify}
            >
              {isVerify ? "Quitar Verificación" : "Dar Verificación"}
            </Menu.Item>
          )}

          {onBlocked && hasBlockedPermission && (
            <Menu.Item
              className="p-1 text-sm hover:text-white"
              leftSection={<LockClosedIcon className="h-4 w-4 " />}
              onClick={onBlocked}
            >
              {isBlocked ? "Desbloquear" : "Bloquear"}
            </Menu.Item>
          )}

          {onViewDocuments && hasDocumentsPermission && (
            <Menu.Item
              className="p-1 text-sm"
              leftSection={<DocumentIcon className="h-4 w-4 " />}
              onClick={onViewDocuments}
            >
              Ver Documentos
            </Menu.Item>
          )}
          {onAddUsers && hasAddUsersPermission && (
            <Menu.Item
              className="p-1 text-sm hover:text-white"
              leftSection={<UserPlusIcon className="h-4 w-4 " />}
              onClick={onAddUsers}
            >
              Añadir Usuarios
            </Menu.Item>
          )}

          {((onDelete && hasDeletePermission) || (onVerify && hasVerifyPermission) || (onBlocked && hasBlockedPermission) || (onActive && hasActivePermission)) && (
            <>
              <Menu.Divider />
              <Menu.Label>Zona de peligro</Menu.Label>
            </>
          )}
          {onActive && hasActivePermission && (
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

          {onDelete && hasDeletePermission && (
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
