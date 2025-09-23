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

  const handleCreateHomeBanner = useCallback(() => {
    router.push(paths.content.banners.new);
  }, [router]);

  const handleEditHomeBanner = useCallback(
    (banner: IHomeBanner) => {
      router.push(paths.content.banners.edit(banner.id));
    },
    [router]
  );

  const handleViewHomeBanner = useCallback(
    (banner: IHomeBanner) => {
      return router.push(paths.content.banners.view(banner.id));
    },
    [router]
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
            images={[banner.imageDesktopUrl]}
            previewEnabled
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
            images={[banner.imageMobileUrl]}
            previewEnabled
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
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
              {banner.regionName}
            </span>
          </div>
        ),
      },

      {
        accessor: "actions",
        title: "Acciones",
        textAlign: "center",
        render: (banner) => (
          <div className="flex justify-center">
            <ActionsMenu
              onViewDetails={() => handleViewHomeBanner(banner)}
              onEdit={() => handleEditHomeBanner(banner)}
              //  onDelete={() => handleDeleteCategory(category)}
            />
          </div>
        ),
      },
    ],
    [handleViewHomeBanner, handleEditHomeBanner]
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
