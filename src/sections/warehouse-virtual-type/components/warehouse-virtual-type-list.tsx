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
import { canDeleteWarehouseVirtualType, deleteWarehouseVirtualType, getWarehouseVirtualTypeById } from "@/services/warehouses-virtual-types";
import { PERMISSION_ENUM } from "@/lib/permissions";

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

  const editTypeModal = getModalState<string | number>("edit");
  const createTypeModal = getModalState("create");
  const viewTypeModal = getModalState<string | number>("view");

  const selectedType = useMemo(() => {
    const editId = editTypeModal.id;
    const viewId = viewTypeModal.id;
    const targetId = editId || viewId;

    if (!targetId || !data?.data) return undefined;

    return data.data.find((type) => type.id === targetId);
  }, [editTypeModal.id, viewTypeModal.id, data?.data]);

  const handleCreateType = useCallback(() => openModal("create"), [openModal]);

  const handleViewType = useCallback(
    (type: WarehouseVirtualTypeFormData) => {
      openModal<string | number>("view", type.id);
    },
    [openModal]
  );

  const handleEditType = useCallback(
    (type: WarehouseVirtualTypeFormData) => {
      openModal<string | number>("edit", type.id);
    },
    [openModal]
  );

  const handleDeleteWarehouseType = useCallback(
    async (type: WarehouseVirtualTypeFormData) => {
      if (!type.id) return;
      
      try {
        // Primero verificamos si se puede eliminar
        const canDeleteRes = await canDeleteWarehouseVirtualType(type.id);
        
        if (canDeleteRes?.error) {
          showToast(canDeleteRes.message || "Error al verificar si se puede eliminar", "error");
          return;
        }

        if (!canDeleteRes.data?.canDelete) {
          showToast(
            canDeleteRes.data?.reason || "No se puede eliminar este tipo de almacén virtual",
            "error"
          );
          return;
        }

        // Si se puede eliminar, procedemos con la eliminación
        const deleteRes = await deleteWarehouseVirtualType(type.id);
        
        if (deleteRes?.error) {
          showToast(deleteRes.message || "Error al eliminar el tipo", "error");
        } else {
          showToast("Tipo de almacén virtual eliminado correctamente", "success");
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
        accessor: "defaultRules",
        title: "Reglas por Defecto",
        sortable: true,
        render: (type) => (
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
              {type.defaultRules}
            </span>
          </div>
        ),
      },

      {
        accessor: "active",
        title: "Estado",
        sortable: true,
        width: 100,
        render: (type) => (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              type.active
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
            }`}
          >
            {type.active ? "Activa" : "Inactiva"}
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
              onViewDetails={() => handleViewType(type)}
              onEdit={() => handleEditType(type)}
              onDelete={
                type.active ? () => handleDeleteWarehouseType(type) : undefined
              }
              viewPermissions={[PERMISSION_ENUM.RETRIEVE]}
              editPermissions={[PERMISSION_ENUM.UPDATE]}
              deletePermissions={[PERMISSION_ENUM.DELETE]}
            />
          </div>
        ),
      },
    ],
    [handleViewType, handleEditType, handleDeleteWarehouseType]
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
        createPermissions={[PERMISSION_ENUM.CREATE]}
      />

      <WarehouseVirtualTypeModal
        open={createTypeModal.open}
        onClose={() => closeModal("create")}
      />

      <WarehouseVirtualTypeModal
        onClose={() => closeModal("edit")}
        open={editTypeModal.open}
        initValue={selectedType}
      />

      <WarehouseVirtualTypeModal
        onClose={() => closeModal("view")}
        open={viewTypeModal.open}
        initValue={selectedType}
        isDetailsView
      />
    </>
  );
}
