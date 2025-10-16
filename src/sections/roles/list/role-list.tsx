"use client";

import { DataGrid } from "@/components/datagrid/datagrid";
import ActionsMenu from "@/components/menu/actions-menu";
import { paths } from "@/config/paths";
import { SearchParams } from "@/types/fetch/request";
import { GetAllRolesResponse, IRole } from "@/types/roles";
import { DataTableColumn } from "mantine-datatable";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { RoleDetailsModal } from "../details/role-details-modal";
import { useQueryClient } from "@tanstack/react-query";
import { RoleEditModal } from "../edit/role-edit-modal";
import { deleteRole } from "@/services/roles";
import showToast from "@/config/toast/toastConfig";
import { PERMISSION_ENUM } from "@/lib/permissions";

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
  const editRoleId = urlSearchParams.get("edit");
  const viewRoleId = urlSearchParams.get("view");

  // Get selected roles for modals
  const selectedRole = useMemo(() => {
    const id = editRoleId || viewRoleId;
    if (!id || !data?.data) return null;
    return data.data.find((role) => role.id === id);
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
      const res = await deleteRole(role.id);

      if (res?.error && res.message) {
        showToast(res.message, "error");
        return;
      }
      showToast("Eliminado correctamente", "success");
      queryClient.invalidateQueries({ queryKey: ["roles"] });
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
        render: (role) => (
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
        render: (role) => (
          <span className="block max-w-[200px] truncate text-sm text-gray-600 dark:text-gray-300">
            {role.description}
          </span>
        ),
      },
      {
        accessor: "subSystem",
        title: "Subsistema",
        sortable: true,
        render: (role) => (
          <div className="flex flex-col">
            <span className="text-sm font-medium">{role?.subsystem?.name}</span>
            <span className="text-xs text-gray-500">
              ({role.subsystem?.code})
            </span>
          </div>
        ),
      },
      {
        accessor: "permissions",
        title: "Permisos",
        render: (role) => (
          <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            {role.permissions?.length || 0} permisos
          </span>
        ),
      },
      {
        accessor: "actions",
        textAlign: "center",
        render: (role) => (
          <div className="flex justify-center">
            <ActionsMenu
              onViewDetails={() => handleViewRole(role)}
              onEdit={() => handleEditRole(role)}
              onDelete={() => handleDeleteRole(role)}
              viewPermissions={[PERMISSION_ENUM.RETRIEVE]}
              editPermissions={[
                PERMISSION_ENUM.UPDATE,
                PERMISSION_ENUM.ASSIGN_ROLE,
              ]}
              activePermissions={[PERMISSION_ENUM.UPDATE]}
            />
          </div>
        ),
      },
    ],
    [handleDeleteRole, handleEditRole, handleViewRole]
  );

  return (
    <>
      <DataGrid
        data={data}
        columns={columns}
        searchParams={searchParams}
        onSearchParamsChange={onSearchParamsChange}
        searchPlaceholder="Buscar roles..."
        // onCreate={handleCreateRole}
        emptyText="No se encontraron roles"
        createPermissions={[
          PERMISSION_ENUM.CREATE,
          PERMISSION_ENUM.ASSIGN_ROLE,
        ]}
      />
      {/* Create Modal */}
      {/*  <RoleCreateModal
        open={isCreateModalOpen}
        onClose={handleCloseModal}
        roles={data?.data}
      /> */}
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
