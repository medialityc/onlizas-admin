"use client";

import { DataGrid } from "@/components/datagrid/datagrid";
import ActionsMenu from "@/components/menu/actions-menu";
import showToast from "@/config/toast/toastConfig";
import { SearchParams } from "@/types/fetch/request";
import { DataTableColumn } from "mantine-datatable";
import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toggleStatusCategory } from "@/services/categories";
import { paths } from "@/config/paths";
import { ISection, IGetAllAdminsSection } from "@/types/section";

interface Props {
  data?: IGetAllAdminsSection;
  searchParams: SearchParams;
  onSearchParamsChange: (params: SearchParams) => void;
}

export function SectionList({
  data,
  searchParams,
  onSearchParamsChange,
}: Props) {
  const router = useRouter();

  const handleCreateSection = useCallback(() => {
    router.push("/dashboard/admin/sections/new");
  }, [router]);

  const handleEditSection = useCallback(
    (section: ISection) => {
      router.push(`/dashboard/admin/sections/${section.id}/edit`);
    },
    [router]
  );

  const handleViewSection = useCallback(
    (section: ISection) => {
      return router.push(paths.content.sections.view(section.id));
    },
    [router]
  );

  const handleToggleActiveSection = useCallback(
    async (section: ISection) => {
      try {
        const res = await toggleStatusCategory(section?.id as number);
        if (res?.error && res.message) {
          console.error(res);
          showToast(res.message, "error");
        } else {
          showToast(
            `Sección ${(res.data as unknown as ISection)?.isActive ? "activada" : "desactivada"}  correctamente`,
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

  const columns = useMemo<DataTableColumn<ISection>[]>(
    () => [
      {
        accessor: "id",
        title: "ID",
        sortable: true,
        width: 80,
        render: (section) => (
          <span className="font-medium text-dark dark:text-white">
            #{section.id}
          </span>
        ),
      },
      {
        accessor: "name",
        title: "Nombre",
        sortable: true,
        render: (section) => (
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
              {section.name}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {section?.name}
            </span>
          </div>
        ),
      },
      {
        accessor: "description",
        title: "Descripción",
        render: (section) => (
          <div className="max-w-xs">
            <span className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
              {section.description.length > 100
                ? `${section.description.substring(0, 100)}...`
                : section.description}
            </span>
          </div>
        ),
      },
      {
        accessor: "isActive",
        title: "Estado",
        sortable: true,
        width: 100,
        render: (section) => (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              section.isActive
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
            }`}
          >
            {section.isActive ? "Activa" : "Inactiva"}
          </span>
        ),
      },

      {
        accessor: "actions",
        title: "Acciones",
        textAlign: "center",
        render: (section) => (
          <div className="flex justify-center">
            <ActionsMenu
              isActive={section.isActive}
              onActive={() => handleToggleActiveSection(section)}
              onViewDetails={() => handleViewSection(section)}
              onEdit={() => handleEditSection(section)}
              //  onDelete={() => handleDeleteCategory(category)}
            />
          </div>
        ),
      },
    ],
    [
      handleToggleActiveSection,
      handleViewSection,
      handleEditSection,
    ]
  );

  return (
    <>
      <DataGrid
        data={data}
        columns={columns}
        searchParams={searchParams}
        onSearchParamsChange={onSearchParamsChange}
        searchPlaceholder="Buscar sección..."
        onCreate={handleCreateSection}
        emptyText="No se encontraron secciones"
        createText="Crear Sección"
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
