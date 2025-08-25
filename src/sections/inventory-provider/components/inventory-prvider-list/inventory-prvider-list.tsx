"use client";

import { DataGrid } from "@/components/datagrid/datagrid";
import ActionsMenu from "@/components/menu/actions-menu";
import showToast from "@/config/toast/toastConfig";
import { SearchParams } from "@/types/fetch/request";
import { DataTableColumn } from "mantine-datatable";
import { useCallback, useMemo } from "react";

import { useQueryClient } from "@tanstack/react-query";

import { useRouter } from "next/navigation";
import {
  deleteInventoryProvider,
  GetAllInventoryProvider,
  InventoryProvider,
} from "@/services/inventory-providers";

interface InventoryProviderListProps {
  data?: GetAllInventoryProvider;
  searchParams: SearchParams;
  onSearchParamsChange: (params: SearchParams) => void;
}

export function InventoryProviderList({
  data,
  searchParams,
  onSearchParamsChange,
}: InventoryProviderListProps) {
  const queryClient = useQueryClient();
  const { push } = useRouter();

  const handleInventoryProviderCreate = useCallback(
    () => push("/dashboard/inventory/new"),
    [push]
  );

  const handleInventoryProviderEdit = useCallback(
    (cat: InventoryProvider) => {
      push(`/dashboard/inventory/${cat.id}/edit`);
    },
    [push]
  );

  const handleDeleteInventoryProvider = useCallback(
    async (provider: InventoryProvider) => {
      if (provider.default) {
        showToast("No se puede eliminar la moneda por defecto", "error");
        return;
      }

      try {
        const res = await deleteInventoryProvider(provider.id);

        if (res?.error) {
          showToast("Error al eliminar moneda", "error");
        } else {
          queryClient.invalidateQueries({ queryKey: ["currencies"] });
          showToast("Moneda eliminada correctamente", "success");
        }
      } catch (error) {
        console.error(error);
        showToast("Ocurrió un error, intente nuevamente", "error");
      }
    },
    [queryClient]
  );

  const columns = useMemo<DataTableColumn<InventoryProvider>[]>(
    () => [
      {
        accessor: "id",
        title: "ID",
        sortable: true,
        width: 80,
        render: (currency) => (
          <span className="font-medium text-dark dark:text-white">
            #{currency.id}
          </span>
        ),
      },
      {
        accessor: "name",
        title: "Moneda",
        sortable: true,
        render: (currency) => (
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
              {currency.name}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
              {currency.codIso}
            </span>
          </div>
        ),
      },

      {
        accessor: "isActive",
        title: "Estado",
        sortable: true,
        width: 100,
        render: (inventory) => (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              inventory.isActive
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
            }`}
          >
            {inventory.isActive ? "Activa" : "Inactiva"}
          </span>
        ),
      },
      {
        accessor: "default",
        title: "Por Defecto",
        sortable: true,
        width: 120,
        render: (inventory) => (
          <div className="text-center">
            {inventory.default ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                Sí
              </span>
            ) : (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                No
              </span>
            )}
          </div>
        ),
      },
      {
        accessor: "actions",
        title: "Acciones",
        textAlign: "center",
        render: (inventory) => (
          <div className="flex justify-center">
            <ActionsMenu
              onViewDetails={() => {}}
              onEdit={() => handleInventoryProviderEdit(inventory)}
              onDelete={() => handleDeleteInventoryProvider(inventory)}
            />
          </div>
        ),
      },
    ],
    [handleDeleteInventoryProvider, handleInventoryProviderEdit]
  );

  return (
    <>
      <DataGrid
        simpleData={data?.data}
        columns={columns}
        searchParams={searchParams}
        onSearchParamsChange={onSearchParamsChange}
        searchPlaceholder="Buscar proveedor..."
        onCreate={handleInventoryProviderCreate}
        emptyText="No se encontraron proveedor"
      />
    </>
  );
}
