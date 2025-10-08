"use client";

import { DataGrid } from "@/components/datagrid/datagrid";
import ActionsMenu from "@/components/menu/actions-menu";
import showToast from "@/config/toast/toastConfig";
import { useModalState } from "@/hooks/use-modal-state";
import { deletePermission } from "@/services/permissions";
import { SearchParams } from "@/types/fetch/request";
import { GetAllPermissionsResponse, IPermission } from "@/types/permissions";
import { DataTableColumn } from "mantine-datatable";
import { useCallback, useMemo } from "react";
import PermissionCreateModal from "../create/permissions-create-modal";
import { PermissionDetailsModal } from "../details/permissions-details-modal";
import { PermissionEditModal } from "../edit/permissions-edit-modal";
import { usePermissions } from "zas-sso-client";

interface PermissionListProps {
  data?: GetAllPermissionsResponse;
  searchParams: SearchParams;
  onSearchParamsChange: (params: SearchParams) => void;
}
export function PermissionList({
  data,
  searchParams,
  onSearchParamsChange,
}: PermissionListProps) {
  const { getModalState, openModal, closeModal } = useModalState();

  const { data: permissions = [] } = usePermissions();
  const hasPermission = (requiredPerms: string[]) => {
    return requiredPerms.every((perm) =>
      permissions.some((p) => p.code === perm)
    );
  };

  // Modal states controlled by URL
  const createPermissionModal = getModalState("create");
  const editPermissionModal = getModalState<number>("edit");
  const viewPermissionModal = getModalState<number>("view");

  // Get selected roles for modals
  const selectedPermission = useMemo(() => {
    const id = editPermissionModal.id || viewPermissionModal.id;
    if (!id || !data?.data) return null;
    return data.data.find(role => role.id == id);
  }, [editPermissionModal, viewPermissionModal, data?.data]);

  // Modal handlers
  const handleCreatePermission = useCallback(
    () => openModal("create"),
    [openModal]
  );

  const handleEditPermission = useCallback(
    (role: IPermission) => {
      openModal<number>("edit", role.id);
    },
    [openModal]
  );

  const handleViewPermission = useCallback(
    (role: IPermission) => {
      openModal<number>("view", role.id);
    },
    [openModal]
  );

  const handleDeletePermission = useCallback(async (role: IPermission) => {
    try {
      const res = await deletePermission(role.id);

      if (res?.error && res.message) {
        console.error(res);
        showToast(res.message, "error");
      } else {
        showToast("Eliminado correctamente", "success");
      }
    } catch (error) {
      console.error(error);
      showToast("Ocurrió un error, intente nuevamente", "error");
    }
  }, []);

  const columns = useMemo<DataTableColumn<IPermission>[]>(
    () => [
      {
        accessor: "name",
        title: "Nombre",
        sortable: true,
        render: permission => (
          <div className="flex flex-col">
            <span className="font-medium text-dark dark:text-white">
              {permission.name}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {permission.code}
            </span>
          </div>
        ),
      },
      {
        accessor: "description",
        title: "Descripción",
        sortable: true,
        render: permission => (
            <span
            className="text-sm text-gray-600 dark:text-gray-300 truncate max-w-[200px] block"
            title={permission.description}
            >
            {permission.description}
            </span>
        ),
      },
      {
        accessor: "roleName",
        title: "Rol",
        sortable: true,
        render: permission => (
          <div className="flex flex-col">
            <span className="text-sm font-medium">{permission.roleName}</span>
            <span className="text-xs text-gray-500">
              ({permission.roleCode})
            </span>
          </div>
        ),
      },

      {
        accessor: "actions",       
        textAlign: "center",
        render: permission => (
          <div className="flex justify-center">
            <ActionsMenu
              onViewDetails={() => handleViewPermission(permission)}
              onEdit={() => handleEditPermission(permission)}
              onDelete={() => handleDeletePermission(permission)}
              viewPermissions={["Retrieve"]}
              editPermissions={["Update"]}
              deletePermissions={["Delete"]}
            />
          </div>
        ),
      },
    ],
    [handleViewPermission, handleEditPermission, handleDeletePermission]
  );

  return (
    <>
      <DataGrid
        data={data}
        columns={columns}
        searchParams={searchParams}
        onSearchParamsChange={onSearchParamsChange}
        searchPlaceholder="Buscar permisos..."
        onCreate={handleCreatePermission}
        createPermissions={["Create"]}
        emptyText="No se encontraron permisos"
      />
      {/* Create Modal */}
      <PermissionCreateModal
        open={createPermissionModal.open}
        onClose={() => closeModal("create")}
      />
      {/* Edit Modal */}
      {selectedPermission && (
        <PermissionEditModal
          onClose={() => closeModal("edit")}
          open={editPermissionModal.open}
          permission={selectedPermission}
        />
      )}
      {/* Details Modal */}
      {selectedPermission && (
        <PermissionDetailsModal
          onClose={() => closeModal("view")}
          open={viewPermissionModal.open}
          permission={selectedPermission}
        />
      )}
    </>
  );
}
