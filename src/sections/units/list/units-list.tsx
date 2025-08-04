"use client";

import { DataGrid } from "@/components/datagrid/datagrid";
import ActionsMenu from "@/components/menu/actions-menu";
import showToast from "@/config/toast/toastConfig";
import { useModalState } from "@/hooks/use-modal-state";
import { SearchParams } from "@/types/fetch/request";
import { DataTableColumn } from "mantine-datatable";
import { useCallback, useMemo } from "react";

import { deleteUnit } from "@/services/units/units";
import { GetAllUnits, Units } from "@/types/units";
import { useQueryClient } from "@tanstack/react-query";
import UnitsModalContainer from "../modals/units-modal-container";

interface UnitsListProps {
  data?: GetAllUnits;
  searchParams: SearchParams;
  onSearchParamsChange: (params: SearchParams) => void;
}

export function UnitsList({
  data,
  searchParams,
  onSearchParamsChange,
}: UnitsListProps) {
  const { getModalState, openModal, closeModal } = useModalState();
  const queryClient = useQueryClient();

  const createUnitModal = getModalState("create");
  const editUnitModal = getModalState<number>("edit");
  const viewUnitModal = getModalState<number>("view");

  const selectedUnit = useMemo(() => {
    const id = editUnitModal.id || viewUnitModal.id;
    if (!id || !data?.data) return null;
    return data.data.find((unit) => unit.id == id);
  }, [editUnitModal, viewUnitModal, data?.data]);

  const handleCreateUnit = useCallback(() => openModal("create"), [openModal]);

  const handleEditUnit = useCallback(
    (unit: Units) => {
      openModal<number>("edit", unit.id);
    },
    [openModal]
  );

  const handleViewUnit = useCallback(
    (unit: Units) => {
      openModal<number>("view", unit.id);
    },
    [openModal]
  );

  const handleDeleteUnit = useCallback(
    async (unit: Units) => {
      try {
        const res = await deleteUnit(unit.id);
        if (res?.error && res.message) {
          console.error(res);
          showToast(res.message, "error");
        } else {
          queryClient.invalidateQueries({ queryKey: ["units"] });
          showToast("Unidad eliminada correctamente", "success");
        }
      } catch (error) {
        console.error(error);
        showToast("Ocurrió un error, intente nuevamente", "error");
      }
    },
    [queryClient]
  );

  const columns = useMemo<DataTableColumn<Units>[]>(
    () => [
      {
        accessor: "id",
        title: "ID",
        sortable: true,
        width: 80,
        render: (unit) => (
          <span className="font-medium text-dark dark:text-white">
            #{unit.id}
          </span>
        ),
      },
      {
        accessor: "name",
        title: "Nombre",
        sortable: true,
        render: (unit) => (
          <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
            {unit.name}
          </span>
        ),
      },
      {
        accessor: "abbreviation",
        title: "Abreviación",
        sortable: true,
        render: (unit) => (
          <span className="text-sm text-gray-600 dark:text-gray-300 font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
            {unit.abbreviation}
          </span>
        ),
      },
      {
        accessor: "actions",
        title: "Acciones",
        textAlign: "center",
        render: (unit) => (
          <div className="flex justify-center">
            <ActionsMenu
              onViewDetails={() => handleViewUnit(unit)}
              onEdit={() => handleEditUnit(unit)}
              onDelete={() => handleDeleteUnit(unit)}
            />
          </div>
        ),
      },
    ],
    [handleViewUnit, handleEditUnit, handleDeleteUnit]
  );

  return (
    <>
      <DataGrid
        data={data}
        columns={columns}
        searchParams={searchParams}
        onSearchParamsChange={onSearchParamsChange}
        searchPlaceholder="Buscar unidades..."
        onCreate={handleCreateUnit}
        emptyText="No se encontraron unidades"
      />
      {/* Create Modal */}
      <UnitsModalContainer
        open={createUnitModal.open}
        onClose={() => closeModal("create")}
      />
      {/* Edit Modal */}
      {selectedUnit && (
        <UnitsModalContainer
          onClose={() => closeModal("edit")}
          open={editUnitModal.open}
          unit={selectedUnit}
        />
      )}
      {/* Details Modal */}
      {selectedUnit && (
        <UnitsModalContainer
          onClose={() => closeModal("view")}
          open={viewUnitModal.open}
          unit={selectedUnit}
          isDetailsView
        />
      )}
    </>
  );
}
