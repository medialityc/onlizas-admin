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
import { usePermissions } from "zas-sso-client";

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
  const { data: permissions = [] } = usePermissions();
  const hasPermission = (requiredPerms: string[]) => {
    return requiredPerms.every((perm) =>
      permissions.some((p) => p.code === perm)
    );
  };
  const canCreateSection = hasPermission(["CreateSection", "Create"]);
  const canUpdateSection = hasPermission(["UpdateSection", "Update"]);
  const canDeleteSection = hasPermission(["DeleteSection", "Delete"]);
  const canRetrieveSection = hasPermission(["RetrieveSection", "Retrieve"]);

  const handleCreateSection = useCallback(() => {
    router.push(paths.content.sections.new);
  }, [router]);

  const handleEditSection = useCallback(
    (section: ISection) => {
      router.push(paths.content.sections.edit(section.id));
    },
    [router]
  );

  const handleViewSection = useCallback(
    (section: ISection) => {
      return router.push(paths.content.sections.view(section.id));
    },
    [router]
  );

  const handleDeleteSection = useCallback(async (banner: ISection) => {
    try {
      const res = await deleteSectionById(banner.id);
      if (res?.error && res.message) {
        console.error(res);
        showToast(res.message, "error");
      } else {
        showToast("Sección desactivada exitosamente", "success");
      }
    } catch (error) {
      console.error(error);
      showToast("Ocurrió un error, por favor intenta de nuevo", "error");
    }
  }, []);

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
              {section?.description}
            </span>
          </div>
        ),
      },

      {
        accessor: "isActive",
        title: "Estado",
        sortable: true,
        width: 100,
        render: (section) => <StatusBadgeCell value={section.isActive} />,
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
              /*  isActive={section.isActive}
              onActive={() => handleToggleActiveSection(section)} */
              onViewDetails={canRetrieveSection ? () => handleViewSection(section) : undefined}
              onEdit={canUpdateSection ? () => handleEditSection(section) : undefined}
              onDelete={canDeleteSection ? () => handleDeleteSection(section) : undefined}
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
        onCreate={canCreateSection ? handleCreateSection : undefined}
        emptyText="No se encontraron secciones"
        createText="Crear Sección"
      />
    </>
  );
}
