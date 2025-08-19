"use client";

import { DataGrid } from "@/components/datagrid/datagrid";
import ActionsMenu from "@/components/menu/actions-menu";
import showToast from "@/config/toast/toastConfig";
import { useModalState } from "@/hooks/use-modal-state";
import { SearchParams } from "@/types/fetch/request";
import { DataTableColumn } from "mantine-datatable";
import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";

import CategoriesModalContainer from "../modals/categories-modal-container";
import { useQueryClient } from "@tanstack/react-query";
import { Category, GetAllCategories } from "@/types/categories";
import { deleteCategory } from "@/services/categories";

interface CategoriesListProps {
  data?: GetAllCategories;
  searchParams: SearchParams;
  onSearchParamsChange: (params: SearchParams) => void;
}

export function CategoriesList({
  data,
  searchParams,
  onSearchParamsChange,
}: CategoriesListProps) {
  const { getModalState, openModal, closeModal } = useModalState();
  const queryClient = useQueryClient();
  const router = useRouter();

  const editCategoryModal = getModalState<number>("edit");
  const viewCategoryModal = getModalState<number>("view");

  const selectedCategory = useMemo(() => {
    const id = editCategoryModal.id || viewCategoryModal.id;
    if (!id || !data?.data) return null;
    return data.data.find((category) => category.id == id);
  }, [editCategoryModal, viewCategoryModal, data?.data]);

  const handleCreateCategory = useCallback(() => {
    router.push("/dashboard/categories/new");
  }, [router]);

  const handleEditCategory = useCallback(
    (category: Category) => {
      router.push(`/dashboard/categories/${category.id}/edit`);
    },
    [router]
  );

  const handleViewCategory = useCallback(
    (category: Category) => {
      openModal<number>("view", category.id);
    },
    [openModal]
  );

  const handleDeleteCategory = useCallback(
    async (category: Category) => {
      try {
        const res = await deleteCategory(category.id);
        if (res?.error && res.message) {
          console.error(res);
          showToast(res.message, "error");
        } else {
          queryClient.invalidateQueries({ queryKey: ["categories"] });
          showToast("Categoría eliminada correctamente", "success");
        }
      } catch (error) {
        console.error(error);
        showToast("Ocurrió un error, intente nuevamente", "error");
      }
    },
    [queryClient]
  );

  const columns = useMemo<DataTableColumn<Category>[]>(
    () => [
      {
        accessor: "id",
        title: "ID",
        sortable: true,
        width: 80,
        render: (category) => (
          <span className="font-medium text-dark dark:text-white">
            #{category.id}
          </span>
        ),
      },
      {
        accessor: "name",
        title: "Nombre",
        sortable: true,
        render: (category) => (
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
              {category.name}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {category?.department?.name}
            </span>
          </div>
        ),
      },
      {
        accessor: "description",
        title: "Descripción",
        render: (category) => (
          <div className="max-w-xs">
            <span className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
              {category.description.length > 100
                ? `${category.description.substring(0, 100)}...`
                : category.description}
            </span>
          </div>
        ),
      },
      {
        accessor: "isActive",
        title: "Estado",
        sortable: true,
        width: 100,
        render: (category) => (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              category.isActive
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
            }`}
          >
            {category.isActive ? "Activa" : "Inactiva"}
          </span>
        ),
      },
      {
        accessor: "totalProducts",
        title: "Productos",
        sortable: true,
        width: 120,
        render: (category) => (
          <div className="text-center">
            <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
              {category.totalProducts}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {category.activeProducts} activos
            </div>
          </div>
        ),
      },
      {
        accessor: "actions",
        title: "Acciones",
        textAlign: "center",
        render: (category) => (
          <div className="flex justify-center">
            <ActionsMenu
              onViewDetails={() => handleViewCategory(category)}
              onEdit={() => handleEditCategory(category)}
              onDelete={() => handleDeleteCategory(category)}
            />
          </div>
        ),
      },
    ],
    [handleViewCategory, handleEditCategory, handleDeleteCategory]
  );

  return (
    <>
      <DataGrid
        data={data}
        columns={columns}
        searchParams={searchParams}
        onSearchParamsChange={onSearchParamsChange}
        searchPlaceholder="Buscar categorías..."
        onCreate={handleCreateCategory}
        emptyText="No se encontraron categorías"
      />
      {/* Creación/edición redirige a vistas; mantenemos modal de detalles */}
      {/* Details Modal */}
      {selectedCategory && (
        <CategoriesModalContainer
          onClose={() => closeModal("view")}
          open={viewCategoryModal.open}
          category={selectedCategory}
          isDetailsView
        />
      )}
    </>
  );
}
