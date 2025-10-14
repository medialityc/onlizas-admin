"use client";

import { DataGrid } from "@/components/datagrid/datagrid";
import ActionsMenu from "@/components/menu/actions-menu";
import showToast from "@/config/toast/toastConfig";
import { useModalState } from "@/hooks/use-modal-state";
import { SearchParams } from "@/types/fetch/request";
import { DataTableColumn } from "mantine-datatable";
import { useCallback, useMemo } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { Department, GetAllDepartments } from "@/types/departments";
import DepartmentsModalContainer from "../modals/department-modal-container";
import { deleteDepartment } from "@/services/department";
import { PERMISSION_ENUM } from "@/lib/permissions";
import ImagePreview from "@/components/image/image-preview";
import { isValid } from "date-fns";
import { isValidUrl } from "@/utils/format";

interface Props {
  data?: GetAllDepartments;
  searchParams: SearchParams;
  onSearchParamsChange: (params: SearchParams) => void;
}

export function DepartmentsList({
  data,
  searchParams,
  onSearchParamsChange,
}: Props) {
  const { getModalState, openModal, closeModal } = useModalState();
  const queryClient = useQueryClient();

  const createDepartmentModal = getModalState("create");
  const editDepartmentModal = getModalState<number>("edit");
  const viewDepartmentModal = getModalState<number>("view");

  const selectedDepartment = useMemo(() => {
    const id = editDepartmentModal.id || viewDepartmentModal.id;
    if (!id || !data?.data) return null;
    return data.data.find((department) => department.id == id);
  }, [editDepartmentModal, viewDepartmentModal, data?.data]);

  const handleCreateDepartment = useCallback(
    () => openModal("create"),
    [openModal]
  );

  const handleEditDepartment = useCallback(
    (department: Department) => {
      openModal<number>("edit", department.id);
    },
    [openModal]
  );

  const handleViewDepartment = useCallback(
    (department: Department) => {
      openModal<number>("view", department.id);
    },
    [openModal]
  );

  const handleDeleteDepartment = useCallback(
    async (department: Department) => {
      if (!department.canDelete) {
        showToast("Este departamento no se puede eliminar", "error");
        return;
      }

      try {
        const res = await deleteDepartment(department.id);

        if (res?.error) {
          showToast("Error al eliminar departamento", "error");
        } else {
          queryClient.invalidateQueries({ queryKey: ["departments"] });
          showToast("Departamento eliminado correctamente", "success");
        }
      } catch (error) {
        console.error(error);
        showToast("Ocurrió un error, intente nuevamente", "error");
      }
    },
    [queryClient]
  );

  const columns = useMemo<DataTableColumn<Department>[]>(
    () => [
      {
        accessor: "name",
        title: "Nombre",
        sortable: true,
        render: (department) => (
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
              {department.name}
            </span>
          </div>
        ),
      },
      {
        accessor: "description",
        title: "Descripción",
        render: (department) => (
          <div className="max-w-xs">
            <span className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
              {department.description.length > 100
                ? `${department.description.substring(0, 100)}...`
                : department.description}
            </span>
          </div>
        ),
      },
      {
        accessor: "active",
        title: "Estado",
        sortable: true,
        width: 100,
        render: (department) => (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              department.active
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
            }`}
          >
            {department.active ? "Activa" : "Inactiva"}
          </span>
        ),
      },
      {
        accessor: "categoriesCount",
        title: "Categorías",
        sortable: true,
        width: 120,
        render: (department) => (
          <div className="text-center">
            <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
              {department.categoriesCount}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              categorías
            </div>
          </div>
        ),
      },
      {
        accessor: "actions",
        title: "Acciones",
        textAlign: "center",
        render: (department) => (
          <div className="flex justify-center">
            <ActionsMenu
              onViewDetails={() => handleViewDepartment(department)}
              onEdit={
                department.canEdit
                  ? () => handleEditDepartment(department)
                  : undefined
              }
              onDelete={
                department.canDelete
                  ? () => handleDeleteDepartment(department)
                  : undefined
              }
              viewPermissions={[
                PERMISSION_ENUM.RETRIEVE,
                PERMISSION_ENUM.RETRIEVE_SECTION,
              ]}
              editPermissions={[
                PERMISSION_ENUM.UPDATE,
                PERMISSION_ENUM.UPDATE_SECTION,
              ]}
              deletePermissions={[
                PERMISSION_ENUM.DELETE,
                PERMISSION_ENUM.DELETE_SECTION,
              ]}
            />
          </div>
        ),
      },
    ],
    [handleViewDepartment, handleEditDepartment, handleDeleteDepartment]
  );

  return (
    <>
      <DataGrid
        data={data}
        columns={columns}
        searchParams={searchParams}
        onSearchParamsChange={onSearchParamsChange}
        searchPlaceholder="Buscar departamentos..."
        onCreate={handleCreateDepartment}
        createPermissions={[
          PERMISSION_ENUM.CREATE_SECTION,
          PERMISSION_ENUM.CREATE,
        ]}
        emptyText="No se encontraron departamentos"
      />
      {/* Create Modal */}
      <DepartmentsModalContainer
        open={createDepartmentModal.open}
        onClose={() => closeModal("create")}
      />

      {/* Edit Modal */}
      {selectedDepartment && (
        <DepartmentsModalContainer
          onClose={() => closeModal("edit")}
          open={editDepartmentModal.open}
          department={selectedDepartment}
        />
      )}
      {/* Details Modal */}
      {selectedDepartment && (
        <DepartmentsModalContainer
          onClose={() => closeModal("view")}
          open={viewDepartmentModal.open}
          department={selectedDepartment}
          isDetailsView
        />
      )}
    </>
  );
}
