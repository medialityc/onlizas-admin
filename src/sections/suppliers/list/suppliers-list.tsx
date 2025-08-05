"use client";

import { DataGrid } from "@/components/datagrid/datagrid";
import ActionsMenu from "@/components/menu/actions-menu";
import showToast from "@/config/toast/toastConfig";
import { useModalState } from "@/hooks/use-modal-state";
import { SearchParams } from "@/types/fetch/request";
import { GetAllSuppliers, Supplier } from "@/types/suppliers";
import { DataTableColumn } from "mantine-datatable";
import { useCallback, useMemo } from "react";
import SuppliersModalContainer from "../modals/suppliers-modal-container";

interface SuppliersListProps {
  data?: GetAllSuppliers;
  searchParams: SearchParams;
  onSearchParamsChange: (params: SearchParams) => void;
}

export function SuppliersList({
  data,
  searchParams,
  onSearchParamsChange,
}: SuppliersListProps) {
  const { openModal, getModalState, closeModal } = useModalState();

  // Estados de los modales
  const createSupplierModal = getModalState("create");
  const editSupplierModal = getModalState<number>("edit");
  const viewSupplierModal = getModalState<number>("view");

  // Obtener el proveedor seleccionado basado en el ID del modal
  const selectedSupplier = useMemo(() => {
    const editId = editSupplierModal.id;
    const viewId = viewSupplierModal.id;
    const targetId = editId || viewId;

    if (!targetId || !data?.data) return undefined;

    return data.data.find((supplier) => supplier.id === targetId);
  }, [editSupplierModal.id, viewSupplierModal.id, data?.data]);

  const handleCreateSupplier = useCallback(
    () => openModal("create"),
    [openModal]
  );

  const handleEditSupplier = useCallback(
    (supplier: Supplier) => {
      openModal<number>("edit", supplier.id);
    },
    [openModal]
  );

  const handleViewSupplier = useCallback(
    (supplier: Supplier) => {
      openModal<number>("view", supplier.id);
    },
    [openModal]
  );

  const handleDeleteSupplier = useCallback(
    async (supplier: Supplier) => {
      try {
        // TODO: Implementar deleteSupplier cuando esté disponible el servicio
        // const res = await deleteSupplier(supplier.id);
        // if (res?.error && res.message) {
        //   console.error(res);
        //   showToast(res.message, "error");
        // } else {
        //   queryClient.invalidateQueries({ queryKey: ["suppliers"] });
        //   showToast("Proveedor eliminado correctamente", "success");
        // }
        console.log("Eliminar proveedor:", supplier.id);
        showToast("Función de eliminar en desarrollo", "info");
      } catch (error) {
        console.error(error);
        showToast("Ocurrió un error, intente nuevamente", "error");
      }
    },
    [] // Removed queryClient dependency since it's commented out
  );

  const columns = useMemo<DataTableColumn<Supplier>[]>(
    () => [
      {
        accessor: "id",
        title: "ID",
        sortable: true,
        width: 80,
        render: (supplier) => (
          <span className="font-medium text-dark dark:text-white">
            #{supplier.id}
          </span>
        ),
      },
      {
        accessor: "name",
        title: "Nombre",
        sortable: true,
        render: (supplier) => (
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
              {supplier.name}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {supplier.email}
            </span>
          </div>
        ),
      },
      {
        accessor: "type",
        title: "Tipo",
        sortable: true,
        render: (supplier) => (
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {supplier.type}
          </span>
        ),
      },
      {
        accessor: "currentRating",
        title: "Calificación",
        sortable: true,
        width: 120,
        render: (supplier) => (
          <div className="flex items-center">
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
              {supplier.currentRating}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
              / 5.0
            </span>
          </div>
        ),
      },
      {
        accessor: "lastEvaluationDate",
        title: "Última Evaluación",
        sortable: true,
        width: 150,
        render: (supplier) => (
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {new Date(supplier.lastEvaluationDate).toLocaleDateString("es-ES")}
          </span>
        ),
      },
      {
        accessor: "isActive",
        title: "Estado",
        sortable: true,
        width: 100,
        render: (supplier) => (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              supplier.isActive
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
            }`}
          >
            {supplier.isActive ? "Activo" : "Inactivo"}
          </span>
        ),
      },
      {
        accessor: "isAproved",
        title: "Aprobación",
        sortable: true,
        width: 120,
        render: (supplier) => (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              supplier.isAproved
                ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
            }`}
          >
            {supplier.isAproved ? "Aprobado" : "Pendiente"}
          </span>
        ),
      },
      {
        accessor: "actions",
        title: "Acciones",
        textAlign: "center",
        render: (supplier) => (
          <div className="flex justify-center">
            <ActionsMenu
              onViewDetails={() => handleViewSupplier(supplier)}
              onEdit={() => handleEditSupplier(supplier)}
              onDelete={() => handleDeleteSupplier(supplier)}
            />
          </div>
        ),
      },
    ],
    [handleViewSupplier, handleEditSupplier, handleDeleteSupplier]
  );

  return (
    <>
      <DataGrid
        data={data}
        columns={columns}
        searchParams={searchParams}
        onSearchParamsChange={onSearchParamsChange}
        searchPlaceholder="Buscar proveedores..."
        onCreate={handleCreateSupplier}
        emptyText="No se encontraron proveedores"
      />

      {/* Create Modal */}
      <SuppliersModalContainer
        open={createSupplierModal.open}
        onClose={() => closeModal("create")}
      />

      {/* Edit Modal */}
      {selectedSupplier && (
        <SuppliersModalContainer
          onClose={() => closeModal("edit")}
          open={editSupplierModal.open}
          supplier={selectedSupplier}
        />
      )}

      {/* Details Modal */}
      {selectedSupplier && (
        <SuppliersModalContainer
          onClose={() => closeModal("view")}
          open={viewSupplierModal.open}
          supplier={selectedSupplier}
          isDetailsView
        />
      )}
    </>
  );
}
