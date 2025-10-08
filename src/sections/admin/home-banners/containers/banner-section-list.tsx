"use client";

import { DataGrid } from "@/components/datagrid/datagrid";
import ActionsMenu from "@/components/menu/actions-menu";
import { SearchParams } from "@/types/fetch/request";
import { DataTableColumn } from "mantine-datatable";
import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { paths } from "@/config/paths";
import { IHomeBanner, IGetAllHomeBanner } from "@/types/home-banner";
import ImagePreview from "@/components/image/image-preview";

import {
  deleteHomeBannerById,
  toggleStatusHomeBanner,
} from "@/services/homebanner";
import showToast from "@/config/toast/toastConfig";
import Badge from "@/components/badge/badge";
import DateValue from "@/components/format-vales/date-value";
import { PERMISSION_ENUM } from "@/lib/permissions";
import { usePermissions } from "@/hooks/use-permissions";

interface Props {
  data?: IGetAllHomeBanner;
  searchParams: SearchParams;
  onSearchParamsChange: (params: SearchParams) => void;
}

export function HomeBannerList({
  data,
  searchParams,
  onSearchParamsChange,
}: Props) {
  const router = useRouter();
  const { hasPermission } = usePermissions();

  const handleCreateHomeBanner = useCallback(() => {
    if (
      hasPermission([
        PERMISSION_ENUM.CREATE_BANNER,
        PERMISSION_ENUM.CREATE,
        PERMISSION_ENUM.CREATE_SECTION,
      ])
    ) {
      router.push(paths.content.banners.new);
    }
  }, [router, hasPermission]);

  const handleEditHomeBanner = useCallback(
    (banner: IHomeBanner) => {
      if (
        hasPermission([
          PERMISSION_ENUM.UPDATE_BANNER,
          PERMISSION_ENUM.UPDATE,
          PERMISSION_ENUM.UPDATE_SECTION,
        ])
      ) {
        router.push(paths.content.banners.edit(banner.id));
      }
    },
    [router, hasPermission]
  );

  /* const handleViewHomeBanner = useCallback(
    (banner: IHomeBanner) => {
      return router.push(paths.content.banners.view(banner.id));
    },
    [router]
  );
 */
  const handleDeleteHomeBanner = useCallback(
    async (banner: IHomeBanner) => {
      if (
        !hasPermission([
          PERMISSION_ENUM.DELETE_BANNER,
          PERMISSION_ENUM.DELETE,
          PERMISSION_ENUM.DELETE_SECTION,
        ])
      ) {
        showToast("No tienes permisos para realizar esta acción", "error");
        return;
      }

      try {
        const res = await deleteHomeBannerById(banner.id);
        if (res?.error && res.message) {
          console.error(res);
          showToast(res.message, "error");
        } else {
          showToast("Banner eliminado exitosamente", "success");
        }
      } catch (error) {
        console.error(error);
        showToast("Ocurrió un error, por favor intenta de nuevo", "error");
      }
    },
    [hasPermission]
  );

  const handleToggleActiveCategory = useCallback(
    async (banner: IHomeBanner) => {
      if (
        !hasPermission([PERMISSION_ENUM.UPDATE_BANNER, PERMISSION_ENUM.UPDATE, PERMISSION_ENUM.UPDATE_SECTION])
      ) {
        showToast("No tienes permisos para realizar esta acción", "error");
        return;
      }

      try {
        const res = await toggleStatusHomeBanner(banner?.id as number);
        if (res?.error && res.message) {
          console.error(res);
          showToast(res.message, "error");
        } else {
          showToast(
            `Banner ${(res.data as unknown as IHomeBanner)?.isActive ? "activado" : "desactivado"} correctamente`,
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

  const columns = useMemo<DataTableColumn<IHomeBanner>[]>(
    () => [
      {
        accessor: "id",
        title: "ID",
        sortable: true,
        width: 80,
        render: (banner) => (
          <span className="font-medium text-dark dark:text-white">
            #{banner.id}
          </span>
        ),
      },

      {
        accessor: "imageDesktopUrl",
        title: "Banner Escritorio",
        sortable: true,
        render: (banner) => (
          <ImagePreview
            alt="Banner Escritorio"
            images={[banner.desktopImageThumbnail || banner.imageDesktopUrl]}
            previewEnabled
            className="w-10 h-10 object-contain [&>img]:object-contain rounded"
          />
        ),
      },
      {
        accessor: "imageMobileUrl",
        title: "Banner Móvil",
        sortable: true,
        render: (banner) => (
          <ImagePreview
            alt="Banner móvil"
            images={[banner.mobileImageThumbnail || banner.imageMobileUrl]}
            previewEnabled
            className="w-10 h-10 object-contain [&>img]:object-contain rounded"
          />
        ),
      },
      {
        accessor: "link",
        title: "Url del banner",
        sortable: true,
        render: (banner) => (
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
              {banner.link}
            </span>
          </div>
        ),
      },
      {
        accessor: "regionId",
        title: "Región",
        sortable: true,
        render: (banner) => (
          <div className="flex flex-row gap-2 max-w-28">
            {banner.regionNames?.map((r) => (
              <Badge rounded variant="outline-primary" key={r}>
                {r}
              </Badge>
            ))}
          </div>
        ),
      },
      {
        accessor: "isActive",
        title: "Estado",
        sortable: true,
        width: 100,
        render: (banner) =>
          banner.isActive ? (
            <Badge rounded>Activo</Badge>
          ) : (
            <Badge rounded variant="danger">
              Inactivo
            </Badge>
          ),
      },
      {
        accessor: "createdDate",
        title: "Fecha de creación",
        sortable: true,
        width: 100,
        render: (banner) => <DateValue value={banner?.createdDate} />,
      },

      {
        accessor: "actions",
        title: "Acciones",
        textAlign: "center",
        render: (banner) => (
          <div className="flex justify-center">
            <ActionsMenu
              isActive={banner?.isActive}
              // onViewDetails={() => handleViewHomeBanner(banner)}
              onEdit={() => handleEditHomeBanner(banner)}
              onDelete={() => handleDeleteHomeBanner(banner)}
              onActive={() => handleToggleActiveCategory(banner)}
              viewPermissions={[
                PERMISSION_ENUM.RETRIEVE_BANNER,
                PERMISSION_ENUM.READ_BANNER,
                PERMISSION_ENUM.RETRIEVE,
                PERMISSION_ENUM.RETRIEVE_SECTION
              ]}
              editPermissions={[
                PERMISSION_ENUM.UPDATE_BANNER,
                PERMISSION_ENUM.UPDATE,
                PERMISSION_ENUM.UPDATE_SECTION,
              ]}
              deletePermissions={[
                PERMISSION_ENUM.DELETE_BANNER,
                PERMISSION_ENUM.DELETE,
                PERMISSION_ENUM.DELETE_SECTION,
              ]}
              activePermissions={[
                PERMISSION_ENUM.UPDATE_BANNER,
                PERMISSION_ENUM.UPDATE,
                PERMISSION_ENUM.UPDATE_SECTION,
              ]}
            />
          </div>
        ),
      },
    ],
    [handleEditHomeBanner, handleDeleteHomeBanner, handleToggleActiveCategory]
  );

  return (
    <>
      <DataGrid
        data={data}
        columns={columns}
        searchParams={searchParams}
        onSearchParamsChange={onSearchParamsChange}
        searchPlaceholder="Buscar banner..."
        onCreate={handleCreateHomeBanner}
        emptyText="No se encontraron banners"
        createText="Crear banner"
        createPermissions={[
          PERMISSION_ENUM.CREATE_BANNER,
          PERMISSION_ENUM.CREATE,
          PERMISSION_ENUM.CREATE_SECTION,
        ]}
      />
    </>
  );
}
