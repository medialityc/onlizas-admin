"use client";

import { DataGrid } from "@/components/datagrid/datagrid";
import ActionsMenu from "@/components/menu/actions-menu";
import showToast from "@/config/toast/toastConfig";
import { setSystemConfigurationAsDefault } from "@/services/system-configuration";
import { SearchParams } from "@/types/fetch/request";
import { PaginatedResponse } from "@/types/common";
import { SystemConfiguration } from "@/types/system-configuration";
import { useQueryClient } from "@tanstack/react-query";
import { DataTableColumn } from "mantine-datatable";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import SystemConfigurationCreateModal from "../create/system-configuration-create-modal";
import SystemConfigurationEditModal from "../edit/system-configuration-edit-modal";

interface ConfigurationsListProps {
  data?: PaginatedResponse<SystemConfiguration>;
  searchParams: SearchParams;
  onSearchParamsChange: (params: SearchParams) => void;
}

export function ConfigurationsList({
  data,
  searchParams,
  onSearchParamsChange,
}: ConfigurationsListProps) {
  const router = useRouter();
  const urlSearchParams = useSearchParams();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const isCreateModalOpen = urlSearchParams.get("create") === "true";
  const editId = urlSearchParams.get("edit");
  const isEditModalOpen = !!editId;

  const handleEdit = useCallback(
    (row: SystemConfiguration) => {
      const params = new URLSearchParams(urlSearchParams);
      params.set("edit", row.id.toString());
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, urlSearchParams, pathname]
  );

  const handleSetDefault = useCallback(
    async (row: SystemConfiguration) => {
      const res = await setSystemConfigurationAsDefault(row.id);
      if (res?.error && res.message) {
        showToast(res.message, "error");
      } else {
        showToast("Configuración establecida como actual", "success");
        queryClient.invalidateQueries({ queryKey: ["system-configurations"] });
      }
    },
    [queryClient]
  );

  const handleCreate = useCallback(() => {
    const params = new URLSearchParams(urlSearchParams);
    params.set("create", "true");
    router.push(`${pathname}?${params.toString()}`);
  }, [router, urlSearchParams, pathname]);

  const handleCloseModal = useCallback(() => {
    const params = new URLSearchParams(urlSearchParams);
    params.delete("create");
    router.push(`${pathname}?${params.toString()}`);
  }, [router, urlSearchParams, pathname]);

  const handleCloseEditModal = useCallback(() => {
    const params = new URLSearchParams(urlSearchParams);
    params.delete("edit");
    router.push(`${pathname}?${params.toString()}`);
  }, [router, urlSearchParams, pathname]);

  const columns = useMemo<DataTableColumn<SystemConfiguration>[]>(
    () => [
      {
        accessor: "countryName",
        title: "País",
        sortable: true,
        render: (r) => (
          <div className="flex flex-col">
            <span className="font-medium text-dark dark:text-white">
              {r.countryName}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {r.countryCode}
            </span>
          </div>
        ),
      },
      {
        accessor: "configurationType",
        title: "Tipo",
        sortable: true,
        render: (r) => (
          <span className="text-sm text-gray-700 dark:text-gray-300">
            {r.configurationType}
          </span>
        ),
      },
      {
        accessor: "additionalSettings",
        title: "Ajustes",
        render: (r) => (
          <span className="text-sm text-gray-600 dark:text-gray-300 truncate max-w-[280px] block">
            {r.additionalSettings}
          </span>
        ),
      },
      {
        accessor: "isActive",
        title: "Actual",
        render: (r) => (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              r.isActive
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
            }`}
          >
            {r.isActive ? "Actual" : "Disponible"}
          </span>
        ),
      },
      {
        accessor: "actions",
        textAlign: "center",
        render: (r) => (
          <div className="flex justify-center">
            <ActionsMenu
              onEdit={() => handleEdit(r)}
              onSetDefault={!r.isActive ? () => handleSetDefault(r) : undefined}
              editPermissions={["UPDATE_SYSTEM_CONFIGURATIONS", "UPDATE_ALL"]}
              setDefaultPermissions={[
                "UPDATE_SYSTEM_CONFIGURATIONS",
                "UPDATE_ALL",
              ]}
            />
          </div>
        ),
      },
    ],
    [handleEdit, handleSetDefault]
  );

  return (
    <>
      <DataGrid
        data={data}
        columns={columns}
        searchParams={searchParams}
        onSearchParamsChange={onSearchParamsChange}
        searchPlaceholder="Buscar configuraciones..."
        onCreate={handleCreate}
        createPermissions={["CREATE_SYSTEM_CONFIGURATIONS", "CREATE_ALL"]}
        emptyText="No se encontraron configuraciones"
      />
      <SystemConfigurationCreateModal
        open={isCreateModalOpen}
        onClose={handleCloseModal}
        onSuccess={() => {
          // refrescar lista
          queryClient.invalidateQueries({
            queryKey: ["system-configurations"],
          });
        }}
      />
      {isEditModalOpen && data?.data && (
        <SystemConfigurationEditModal
          open={isEditModalOpen}
          onClose={handleCloseEditModal}
          onSuccess={() => {
            queryClient.invalidateQueries({
              queryKey: ["system-configurations"],
            });
          }}
          item={
            data.data.find(
              (x) => String(x.id) === String(editId)
            ) as SystemConfiguration
          }
        />
      )}
    </>
  );
}
