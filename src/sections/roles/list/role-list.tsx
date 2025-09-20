"use client";

import { DataGrid } from "@/components/datagrid/datagrid";
import ActionsMenu from "@/components/menu/actions-menu";
import { paths } from "@/config/paths";
import showToast from "@/config/toast/toastConfig";
import { deleteRole } from "@/services/roles";
import { SearchParams } from "@/types/fetch/request";
import { GetAllRolesResponse, IRole } from "@/types/roles";
import { useQueryClient } from "@tanstack/react-query";
import { DataTableColumn } from "mantine-datatable";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import RoleCreateModal from "../create/role-create-modal";
import { RoleDetailsModal } from "../details/role-details-modal";
import { RoleEditModal } from "../edit/role-edit-modal";
import { useHasPermissions } from "@/auth-sso/permissions/hooks";

interface RoleListProps {
  data?: GetAllRolesResponse;
  searchParams: SearchParams;
  onSearchParamsChange: (params: SearchParams) => void;
}

export function RoleList({
  data,
  searchParams,
  onSearchParamsChange,
}: RoleListProps) {
  const router = useRouter();
  const urlSearchParams = useSearchParams();
  const queryClient = useQueryClient();

  // Modal states controlled by URL
  const isCreateModalOpen = urlSearchParams.get("create") === "true";
  const editRoleId = urlSearchParams.get("edit");
  const viewRoleId = urlSearchParams.get("view");

  // Get selected roles for modals
  const selectedRole = useMemo(() => {
    const id = editRoleId || viewRoleId;
    if (!id || !data?.data) return null;
    return data.data.find(role => role.id === parseInt(id));
  }, [editRoleId, viewRoleId, data?.data]);

  // Modal handlers
  const handleCreateRole = useCallback(() => {
    const params = new URLSearchParams(urlSearchParams);
    params.set("create", "true");
    router.push(`${paths.dashboard.roles.list}?${params.toString()}`);
  }, [router, urlSearchParams]);

  const handleEditRole = useCallback(
    (role: IRole) => {
      const params = new URLSearchParams(urlSearchParams);
      params.set("edit", role.id.toString());
      router.push(`${paths.dashboard.roles.list}?${params.toString()}`);
    },
    [router, urlSearchParams]
  );

  const handleDeleteRole = useCallback(
    async (role: IRole) => {
      try {
        const res = await deleteRole(role.id);

        if (res?.error && res.message) {
          console.error(res);
          showToast(res.message, "error");
        } else {
          showToast("Eliminado correctamente", "success");
          queryClient.invalidateQueries({ queryKey: ["roles"] });
        }
      } catch (error) {
        console.error(error);
        showToast("Ocurrió un error, intente nuevamente", "error");
      }
    },
    [queryClient]
  );

  const handleViewRole = useCallback(
    (role: IRole) => {
      const params = new URLSearchParams(urlSearchParams);
      params.set("view", role.id.toString());
      router.push(`${paths.dashboard.roles.list}?${params.toString()}`);
    },
    [router, urlSearchParams]
  );

  const handleCloseModal = useCallback(() => {
    const params = new URLSearchParams(urlSearchParams);
    params.delete("create");
    params.delete("edit");
    params.delete("view");
    router.push(`${paths.dashboard.roles.list}?${params.toString()}`);
  }, [router, urlSearchParams]);

  const columns = useMemo<DataTableColumn<IRole>[]>(
    () => [
      {
        accessor: "name",
        title: "Nombre",
        sortable: true,
        render: role => (
          <div className="flex flex-col">
            <span className="font-medium text-dark dark:text-white">
              {role.name}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {role.code}
            </span>
          </div>
        ),
      },
      {
        accessor: "description",
        title: "Descripción",
        sortable: true,
        render: role => (
          <span  className="text-sm text-gray-600 dark:text-gray-300 truncate max-w-[200px] block">
            {role.description}
          </span>
        ),
      },
      
      {
        accessor: "permissions",
        title: "Permisos",
        render: role => (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            {role.permissions?.length || 0} permisos
          </span>
        ),
      },
      {
        accessor: "actions",
        textAlign: "center",
        render: role => (
          <div className="flex justify-center">
            <ActionsMenu
              onViewDetails={() => handleViewRole(role)}
              onEdit={() => handleEditRole(role)}
              onDelete={() => handleDeleteRole(role)}
              viewPermissions={["READ_ROLES",]}
              editPermissions={["UPDATE_ROLES"]}
              deletePermissions={["DELETE_ALL", "DELETE_ROLES"]}
            />
          </div>
        ),
      },
    ],
    [handleViewRole, handleEditRole, handleDeleteRole]
  );

  return (
    <>
      <DataGrid
        data={data}
        columns={columns}
        searchParams={searchParams}
        onSearchParamsChange={onSearchParamsChange}
        searchPlaceholder="Buscar roles..."
        onCreate={handleCreateRole}
        createPermissions={["CREATE_ROLES"]}
        emptyText="No se encontraron roles"
      />
      {/* Create Modal */}
      <RoleCreateModal
        open={isCreateModalOpen}
        onClose={handleCloseModal}
        roles={data?.data}
      />
      {/* Edit Modal */}
      {selectedRole && (
        <RoleEditModal
          open={!!editRoleId}
          role={selectedRole}
          onClose={handleCloseModal}
          roles={data?.data}
        />
      )}
      {/* Details Modal */}
      {selectedRole && (
        <RoleDetailsModal
          open={!!viewRoleId}
          role={selectedRole}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
}
