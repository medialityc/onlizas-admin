"use client";

import { DataGrid } from "@/components/datagrid/datagrid";
import ActionsMenu from "@/components/menu/actions-menu";
import showToast from "@/config/toast/toastConfig";
import { SearchParams } from "@/types/fetch/request";
import { DataTableColumn } from "mantine-datatable";
import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Category, GetAllCategories } from "@/types/categories";
import { toggleStatusCategory } from "@/services/categories";
import { paths } from "@/config/paths";
import { PERMISSION_ENUM } from "@/lib/permissions";
import { usePermissions } from "@/hooks/use-permissions";

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
  const router = useRouter();
  const { hasPermission } = usePermissions();

  const handleCreateCategory = useCallback(() => {
    if (
      hasPermission([PERMISSION_ENUM.CREATE_SECTION, PERMISSION_ENUM.CREATE])
    ) {
      router.push("/dashboard/categories/new");
    }
  }, [router, hasPermission]);

  const handleEditCategory = useCallback(
    (cat: Category) => {
      if (
        hasPermission([PERMISSION_ENUM.UPDATE_SECTION, PERMISSION_ENUM.UPDATE])
      ) {
        router.push(`/dashboard/categories/${cat.id}/edit`);
      }
    },
    [router, hasPermission]
  );

  const handleViewCategory = useCallback(
    (cat: Category) => {
      return router.push(paths.dashboard.categories.view(cat.id));
    },
    [router]
  );

  const handleToggleActiveCategory = useCallback(
    async (category: Category) => {
      if (
        !hasPermission([PERMISSION_ENUM.UPDATE_SECTION, PERMISSION_ENUM.UPDATE])
      ) {
        showToast("No tienes permisos para realizar esta acción", "error");
        return;
      }

      try {
        const res = await toggleStatusCategory(category?.id as number);
        if (res?.error && res.message) {
          console.error(res);
          showToast(res.message, "error");
        } else {
          showToast(
            `Categoría ${(res.data as unknown as Category)?.isActive ? "activada" : "desactivada"}  correctamente`,
            "success"
          );
        }
      } catch (error) {
        console.error(error);
        showToast("Ocurrió un error, intente nuevamente", "error");
      }
    },
    [hasPermission]
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
              isActive={category.isActive}
              onActive={() => handleToggleActiveCategory(category)}
              onViewDetails={() => handleViewCategory(category)}
              onEdit={() => handleEditCategory(category)}
              viewPermissions={[
                PERMISSION_ENUM.RETRIEVE,
                PERMISSION_ENUM.RETRIEVE_SECTION,
              ]}
              editPermissions={[
                PERMISSION_ENUM.UPDATE,
                PERMISSION_ENUM.UPDATE_SECTION,
              ]}
              activePermissions={[
                PERMISSION_ENUM.UPDATE,
                PERMISSION_ENUM.UPDATE_SECTION,
              ]}
            />
          </div>
        ),
      },
    ],
    [handleToggleActiveCategory, handleViewCategory, handleEditCategory]
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
        createPermissions={[
          PERMISSION_ENUM.CREATE_SECTION,
          PERMISSION_ENUM.CREATE,
        ]}
        emptyText="No se encontraron categorías"
        createText="Crear categoría"
      />
      {/* Creación/edición redirige a vistas; mantenemos modal de detalles */}
      {/* Details Modal */}
      {/* {selectedCategory && (
        <CategoriesModalContainer
          onClose={() => closeModal("view")}
          open={viewCategoryModal.open}
          category={selectedCategory}
          isDetailsView
        />
      )} */}
    </>
  );
}
