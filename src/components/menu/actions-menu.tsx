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
  StarIcon,
} from "@heroicons/react/24/solid";
import DeleteDialog from "../modal/delete-modal";
import ToggleStatusDialog from "../modal/toggle-status-modal";
import { usePermissions } from "@/hooks/use-permissions";

interface MenuProps {
  onAddUsers?: () => void;
  onEdit?: () => void;
  onEditFull?: () => void; 
  onViewDetails?: () => void;
  onViewDocuments?: () => void;
  onDelete?: () => void;
  onPay?: () => void;
  onDownload?: () => void;
  onActive?: () => void;
  active?: boolean;
  onSetDefault?: () => void; 
  onBlocked?: () => void;
  isBlocked?: boolean;
  onVerify?: () => void;
  isVerify?: boolean;
  onModifyAttributes?: () => void;
  onChangeStatus?: () => void;
  onNomenclators?: () => void;
  onContracts?: () => void;
  onGenerateQR?: () => void;
  onApprove?: () => void;
  onReject?: () => void;


  viewPermissions?: string[];
  editPermissions?: string[];
  deletePermissions?: string[];
  activePermissions?: string[];
  setDefaultPermissions?: string[];
  documentsPermissions?: string[];
  addUsersPermissions?: string[];
  payPermissions?: string[];
  downloadPermissions?: string[];
  blockedPermissions?: string[];
  verifyPermissions?: string[];
  modifyAttributesPermissions?: string[];
  changeStatusPermissions?: string[];
  nomenclatorsPermissions?: string[];
  contractsPermissions?: string[];
  qrPermissions?: string[];
  approvePermissions?: string[];
  rejectPermissions?: string[];
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
  active,
  isBlocked,
  isVerify,
  onDownload,
  onBlocked,
  onVerify,
  onModifyAttributes,
  onChangeStatus,
  onNomenclators,
  onContracts,
  onGenerateQR,
  onSetDefault,
  onApprove,
  onReject,
  viewPermissions,
  editPermissions,
  deletePermissions,
  activePermissions,
  setDefaultPermissions,
  documentsPermissions,
  addUsersPermissions,
  payPermissions,
  downloadPermissions,
  blockedPermissions,
  verifyPermissions,
  modifyAttributesPermissions,
  changeStatusPermissions,
  nomenclatorsPermissions,
  contractsPermissions,
  qrPermissions,
  approvePermissions,
  rejectPermissions,
}: MenuProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [toggleStatusDialogOpen, setToggleStatusDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { hasPermission } = usePermissions();

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
          {onViewDetails && hasPermission(viewPermissions) && (
            <Menu.Item
              className="p-1 text-sm  hover:text-white"
              leftSection={<EyeIcon className="h-4 w-4" />}
              onClick={onViewDetails}
            >
              Ver detalles
            </Menu.Item>
          )}

          {onApprove && hasPermission(approvePermissions) && (
            <Menu.Item
              className="p-1 text-sm hover:text-white hover:bg-green-500"
              leftSection={<CheckIcon className="h-4 w-4" />}
              onClick={onApprove}
            >
              Aprobar
            </Menu.Item>
          )}

          {onReject && hasPermission(rejectPermissions) && (
            <Menu.Item
              className="p-1 text-sm hover:text-white hover:bg-red-500"
              leftSection={<TrashIcon className="h-4 w-4" />}
              onClick={onReject}
            >
              Rechazar
            </Menu.Item>
          )}

          {onNomenclators && hasPermission(nomenclatorsPermissions) && (
            <Menu.Item
              className="p-1 text-sm hover:text-white"
              leftSection={<DocumentIcon className="h-4 w-4 " />}
              onClick={onNomenclators}
            >
              Nomencladores
            </Menu.Item>
          )}

          {onContracts && hasPermission(contractsPermissions) && (
            <Menu.Item
              className="p-1 text-sm hover:text-white"
              leftSection={<UserPlusIcon className="h-4 w-4 " />}
              onClick={onContracts}
            >
              Contratos
            </Menu.Item>
          )}

          {onGenerateQR && hasPermission(qrPermissions) && (
            <Menu.Item
              className="p-1 text-sm hover:text-white"
              leftSection={<LockClosedIcon className="h-4 w-4 " />}
              onClick={onGenerateQR}
            >
              Generar QR
            </Menu.Item>
          )}

          {onDownload && hasPermission(downloadPermissions) && (
            <Menu.Item
              className="p-1 text-sm  hover:text-white"
              leftSection={<ArrowDownTrayIcon className="h-4 w-4 " />}
              onClick={onDownload}
            >
              Descargar
            </Menu.Item>
          )}

          {onEdit && hasPermission(editPermissions) && (
            <Menu.Item
              className="p-1 text-sm hover:text-white"
              leftSection={<PencilIcon className="h-4 w-4 " />}
              onClick={onEdit}
            >
              Editar
            </Menu.Item>
          )}

          {onEditFull && hasPermission(editPermissions) && (
            <Menu.Item
              className="p-1 text-sm hover:text-white"
              leftSection={<Cog6ToothIcon className="h-4 w-4 " />}
              onClick={onEditFull}
            >
              Edición Completa
            </Menu.Item>
          )}

          {onSetDefault && hasPermission(setDefaultPermissions) && (
            <Menu.Item
              className="p-1 text-sm hover:text-white"
              leftSection={<StarIcon className="h-4 w-4 " />}
              onClick={onSetDefault}
            >
              Establecer como actual
            </Menu.Item>
          )}

          {onModifyAttributes && hasPermission(modifyAttributesPermissions) && (
            <Menu.Item
              className="p-1 text-sm hover:text-white"
              leftSection={<Cog6ToothIcon className="h-4 w-4 " />}
              onClick={onModifyAttributes}
            >
              Modificar Atributos
            </Menu.Item>
          )}

          {onChangeStatus && hasPermission(changeStatusPermissions) && (
            <Menu.Item
              className="p-1 text-sm hover:text-white"
              leftSection={<Cog6ToothIcon className="h-4 w-4 " />}
              onClick={onChangeStatus}
            >
              Cambiar estado
            </Menu.Item>
          )}

          {onPay && hasPermission(payPermissions) && (
            <Menu.Item
              className="p-1 text-sm hover:text-white"
              leftSection={<CurrencyDollarIcon className="h-4 w-4 " />}
              onClick={onPay}
            >
              Pagar
            </Menu.Item>
          )}

          {onVerify && hasPermission(verifyPermissions) && (
            <Menu.Item
              className="p-1 text-sm hover:text-white"
              leftSection={<CheckIcon className="h-4 w-4 " />}
              onClick={onVerify}
            >
              {isVerify ? "Quitar Verificación" : "Dar Verificación"}
            </Menu.Item>
          )}

          {onBlocked && hasPermission(blockedPermissions) && (
            <Menu.Item
              className="p-1 text-sm hover:text-white"
              leftSection={<LockClosedIcon className="h-4 w-4 " />}
              onClick={onBlocked}
            >
              {isBlocked ? "Desbloquear" : "Bloquear"}
            </Menu.Item>
          )}

          {onViewDocuments && hasPermission(documentsPermissions) && (
            <Menu.Item
              className="p-1 text-sm"
              leftSection={<DocumentIcon className="h-4 w-4 " />}
              onClick={onViewDocuments}
            >
              Ver Documentos
            </Menu.Item>
          )}
          {onAddUsers && hasPermission(addUsersPermissions) && (
            <Menu.Item
              className="p-1 text-sm hover:text-white"
              leftSection={<UserPlusIcon className="h-4 w-4 " />}
              onClick={onAddUsers}
            >
              Añadir Usuarios
            </Menu.Item>
          )}

          {((onDelete && hasPermission(deletePermissions)) ||
            (onVerify && hasPermission(verifyPermissions)) ||
            (onBlocked && hasPermission(blockedPermissions)) ||
            (onActive && hasPermission(activePermissions))) && (
            <>
              <Menu.Divider />
              <Menu.Label>Zona de peligro</Menu.Label>
            </>
          )}
          {onActive && hasPermission(activePermissions) && (
            <>
              <Menu.Item
                className={`p-1 text-sm ${active ? "hover:bg-red-500" : "hover:bg-green-500"}`}
                leftSection={<CheckIcon className="h-4 w-4 " />}
                onClick={() => setToggleStatusDialogOpen(true)}
              >
                {active ? "Desactivar" : "Activar"}
              </Menu.Item>
            </>
          )}

          {onDelete && hasPermission(deletePermissions) && (
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

      {onDelete && hasPermission(deletePermissions) && (
        <DeleteDialog
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={handleDelete}
          loading={loading}
          open={deleteDialogOpen}
        />
      )}
      {onActive && hasPermission(activePermissions) && (
        <ToggleStatusDialog
          active={active}
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
