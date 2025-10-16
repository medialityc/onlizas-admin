"use client";

import { DataGrid } from "@/components/datagrid/datagrid";
import ActionsMenu from "@/components/menu/actions-menu";
import showToast from "@/config/toast/toastConfig";
import { SearchParams } from "@/types/fetch/request";
import { DataTableColumn } from "mantine-datatable";
import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { paths } from "@/config/paths";
import { ISection, IGetAllAdminsSection } from "@/types/section";
import StatusBadgeCell from "@/sections/common/components/cells/status-badge-cell";
import DateValue from "@/components/format-vales/date-value";
import { deleteSectionById } from "@/services/section";
import {
  TARGET_USER_DEVICE_OPTIONS,
  TARGET_USER_SEGMENT_OPTIONS,
} from "../constants/section.options";
import { PERMISSION_ENUM } from "@/lib/permissions";
import { usePermissions } from "@/hooks/use-permissions";

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
  const { hasPermission } = usePermissions();

  const handleCreateSection = useCallback(() => {
    if (hasPermission([PERMISSION_ENUM.CREATE])) {
      router.push(paths.content.sections.new);
    }
  }, [router, hasPermission]);

  const handleEditSection = useCallback(
    (section: ISection) => {
      if (hasPermission([PERMISSION_ENUM.UPDATE])) {
        router.push(paths.content.sections.edit(section.id));
      }
    },
    [router, hasPermission]
  );

  const handleViewSection = useCallback(
    (section: ISection) => {
      if (hasPermission([PERMISSION_ENUM.RETRIEVE])) {
        return router.push(paths.content.sections.view(section.id));
      }
    },
    [router, hasPermission]
  );

  const handleDeleteSection = useCallback(
    async (section: ISection) => {
      if (!hasPermission([PERMISSION_ENUM.DELETE])) {
        showToast("No tienes permisos para realizar esta acción", "error");
        return;
      }

      try {
        const res = await deleteSectionById(section.id);
        if (res?.error && res.message) {
          console.error(res);
          showToast(res.message, "error");
        } else {
          showToast("Sección eliminada exitosamente", "success");
        }
      } catch (error) {
        console.error(error);
        showToast("Ocurrió un error, por favor intenta de nuevo", "error");
      }
    },
    [hasPermission]
  );

  const columns = useMemo<DataTableColumn<ISection>[]>(
    () => [
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
              {section?.description}
            </span>
          </div>
        ),
      },

      {
        accessor: "active",
        title: "Estado",
        sortable: true,
        width: 100,
        render: (section) => <StatusBadgeCell value={section.active} />,
      },
      {
        accessor: "isPersonalized",
        title: "Personalizado",
        sortable: true,
        width: 150,
        render: (section) => (
          <StatusBadgeCell
            value={section.isPersonalized}
            status={{
              active: "Sí",
              inactive: "No",
            }}
          />
        ),
      },
      {
        accessor: "targetUserSegment",
        title: "Usuario objetivo",
        sortable: true,
        width: 150,
        render: (section) =>
          TARGET_USER_SEGMENT_OPTIONS.find(
            (opt) => opt.value === section.targetUserSegment
          )?.label,
      },
      {
        accessor: "targetDeviceType",
        title: "Dispositivo objetivo",
        sortable: true,
        width: 150,
        render: (section) =>
          TARGET_USER_DEVICE_OPTIONS.find(
            (opt) => opt.value === section.targetDeviceType
          )?.label,
      },
      {
        accessor: "defaultItemCount",
        title: "Cantidad",
        sortable: true,
        width: 150,
        render: (section) => section.defaultItemCount,
      },
      {
        accessor: "startDate",
        title: "Fecha de inicio",
        sortable: true,
        width: 150,
        render: (section) => <DateValue value={section.startDate} />,
      },
      {
        accessor: "endDate",
        title: "Fecha de Fin",
        sortable: true,
        width: 150,
        render: (section) => <DateValue value={section.endDate} />,
      },

      {
        accessor: "actions",
        title: "Acciones",
        textAlign: "center",
        render: (section) => (
          <div className="flex justify-center">
            <ActionsMenu
              /*  active={section.active}
              onActive={() => handleToggleActiveSection(section)} */
              onViewDetails={() => handleViewSection(section)}
              onEdit={() => handleEditSection(section)}
              onDelete={() => handleDeleteSection(section)}
              viewPermissions={[PERMISSION_ENUM.RETRIEVE]}
              editPermissions={[PERMISSION_ENUM.UPDATE]}
              deletePermissions={[PERMISSION_ENUM.DELETE]}
            />
          </div>
        ),
      },
    ],
    [handleViewSection, handleEditSection, handleDeleteSection]
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
        createPermissions={[PERMISSION_ENUM.CREATE]}
      />
    </>
  );
}
