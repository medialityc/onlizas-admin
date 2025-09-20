"use client";

import { DataGrid } from "@/components/datagrid/datagrid";
import ActionsMenu from "@/components/menu/actions-menu";
import showToast from "@/config/toast/toastConfig";
import { SearchParams } from "@/types/fetch/request";
import { DataTableColumn } from "mantine-datatable";
import { useCallback, useMemo } from "react";
import { GetAllWarehousesVirtualType } from "../interfaces/warehouse-virtual-type.interface";
import { WarehouseVirtualTypeFormData } from "../schemas/warehouse-virtual-type-schema";
import WarehouseVirtualTypeModal from "../containers/warehouse-virtual-create-modal";
import { useModalState } from "@/hooks/use-modal-state";
import { toggleStatusWarehouseVirtualType } from "@/services/warehouses-virtual-types";
import { useHasPermissions } from "@/auth-sso/permissions/hooks";

interface Props {
  data?: GetAllWarehousesVirtualType;
  searchParams: SearchParams;
  onSearchParamsChange: (params: SearchParams) => void;
}

export function WarehouseVirtualTypeList({
  data,
  searchParams,
  onSearchParamsChange,
}: Props) {
  const { getModalState, openModal, closeModal } = useModalState();

  const editTypeModal = getModalState<number>("edit");
  const createTypeModal = getModalState("create");

  const selectedType = useMemo(() => {
    const editId = editTypeModal.id;
    const targetId = editId;

    if (!targetId || !data?.data) return undefined;

    // Convertir targetId a número para comparación
    const numericId =
      typeof targetId === "string" ? parseInt(targetId, 10) : targetId;

    return data.data.find((type) => type.id === numericId);
  }, [editTypeModal.id, data?.data]);

  const handleCreateType = useCallback(() => openModal("create"), [openModal]);

  const handleToggleActiveWarehouseType = useCallback(
    async (type: WarehouseVirtualTypeFormData) => {
      try {
        const res = await toggleStatusWarehouseVirtualType(type?.id as number);
        if (res?.error && res.message) {
          console.error(res);
          showToast(res.message, "error");
        } else {
          showToast(
            `Tipo de almacén virtual ${(res.data as unknown as WarehouseVirtualTypeFormData)?.isActive ? "activada" : "desactivada"}  correctamente`,
            "success"
          );
        }
      } catch (error) {
        console.error(error);
        showToast("Ocurrió un error, intente nuevamente", "error");
      }
    },
    []
  );

  const columns = useMemo<DataTableColumn<WarehouseVirtualTypeFormData>[]>(
    () => [
      {
        accessor: "id",
        title: "ID",
        sortable: true,
        width: 80,
        render: (type) => (
          <span className="font-medium text-dark dark:text-white">
            #{type.id}
          </span>
        ),
      },
      {
        accessor: "name",
        title: "Nombre",
        sortable: true,
        render: (type) => (
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
              {type.name}
            </span>
          </div>
        ),
      },

      {
        accessor: "isActive",
        title: "Estado",
        sortable: true,
        width: 100,
        render: (type) => (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              type.isActive
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
            }`}
          >
            {type.isActive ? "Activa" : "Inactiva"}
          </span>
        ),
      },

      {
        accessor: "actions",
        title: "Acciones",
        textAlign: "center",
        render: (type) => (
          <div className="flex justify-center">
            <ActionsMenu
              isActive={type.isActive}
              onActive={() => handleToggleActiveWarehouseType(type)}
              // onEdit={() => handleEditCategory(type)}
              activePermissions={["UPDATE_ALL"]}
            />
          </div>
        ),
      },
    ],
    [handleToggleActiveWarehouseType]
  );

  return (
    <>
      <DataGrid
        data={data}
        columns={columns}
        searchParams={searchParams}
        onSearchParamsChange={onSearchParamsChange}
        searchPlaceholder="Buscar tipo de almacén virtual..."
        onCreate={handleCreateType}
        emptyText="No se encontraron tipos de almacén virtual"
        createText="Crear Tipo"
        createPermissions={["CREATE_ALL"]}
      />

      <WarehouseVirtualTypeModal
        open={createTypeModal.open}
        onClose={() => closeModal("create")}
      />

      <WarehouseVirtualTypeModal
        onClose={() => closeModal("edit")}
        open={editTypeModal.open}
        initValue={selectedType}
        isDetailsView
      />
    </>
  );
}
