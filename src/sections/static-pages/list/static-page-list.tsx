"use client";

import { DataGrid } from "@/components/datagrid/datagrid";
import ActionsMenu from "@/components/menu/actions-menu";
import showToast from "@/config/toast/toastConfig";
import { SearchParams } from "@/types/fetch/request";
import { DataTableColumn } from "mantine-datatable";
import { useCallback, useMemo, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { StaticPageSummaryDto } from "@/types/static-pages";
import { StaticPageCreateModal } from "@/sections/static-pages/modals/static-page-create-modal";
import { StaticPageEditModal } from "@/sections/static-pages/modals/static-page-edit-modal";
import { StaticPageDetailsModal } from "@/sections/static-pages/modals/static-page-details-modal";
import { paths } from "@/config/paths";
import { PERMISSION_ENUM } from "@/lib/permissions";
import { usePermissions } from "@/hooks/use-permissions";
import {
  deleteStaticPage,
  toggleStaticPageStatus,
} from "@/services/static-pages";
import { ContentStatus } from "@/types/static-pages";

interface StaticPageListProps {
  data?: {
    data: StaticPageSummaryDto[];
    totalCount: number;
    page: number;
    pageSize: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
  searchParams: SearchParams;
  onSearchParamsChange: (params: SearchParams) => void;
}

export function StaticPageList({
  data,
  searchParams,
  onSearchParamsChange,
}: StaticPageListProps) {
  const router = useRouter();
  const { hasPermission } = usePermissions();
  const urlSearchParams = useSearchParams();

  const createOpen = urlSearchParams.get("create") === "true";
  const editPageId = urlSearchParams.get("edit");
  const viewPageId = urlSearchParams.get("view");

  const selectedPage = useMemo(() => {
    const id = editPageId || viewPageId;
    if (!id || !data?.data) return null;
    return data.data.find((p) => p.id === id) || null;
  }, [editPageId, viewPageId, data?.data]);

  const handleCreateStaticPage = useCallback(() => {
    if (!hasPermission([PERMISSION_ENUM.CREATE])) return;
    const params = new URLSearchParams(urlSearchParams);
    params.set("create", "true");
    router.push(`${paths.content.staticPages.list}?${params.toString()}`);
  }, [router, urlSearchParams, hasPermission]);

  const handleEditStaticPage = useCallback(
    (page: StaticPageSummaryDto) => {
      if (!hasPermission([PERMISSION_ENUM.UPDATE])) return;
      const params = new URLSearchParams(urlSearchParams);
      params.set("edit", page.id.toString());
      router.push(`${paths.content.staticPages.list}?${params.toString()}`);
    },
    [router, urlSearchParams, hasPermission]
  );

  const handleViewStaticPage = useCallback(
    (page: StaticPageSummaryDto) => {
      const params = new URLSearchParams(urlSearchParams);
      params.set("view", page.id.toString());
      router.push(`${paths.content.staticPages.list}?${params.toString()}`);
    },
    [router, urlSearchParams]
  );

  const handleCloseModal = useCallback(() => {
    const params = new URLSearchParams(urlSearchParams);
    params.delete("create");
    params.delete("edit");
    params.delete("view");
    router.push(`${paths.content.staticPages.list}?${params.toString()}`);
  }, [router, urlSearchParams]);

  const columns = useMemo<DataTableColumn<StaticPageSummaryDto>[]>(
    () => [
      {
        accessor: "title",
        title: "Título",
        sortable: true,
        render: (page) => (
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
              {page.title}
            </span>
            <span className="text-xs text-gray-500">/{page.slug}</span>
          </div>
        ),
      },
      {
        accessor: "status",
        title: "Estado",
        width: 140,
        render: (page) => (
          <div className="text-center">
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
              {page.status === ContentStatus.Draft
                ? "Borrador"
                : page.status === ContentStatus.Active
                  ? "Activa"
                  : "Inactiva"}
            </span>
          </div>
        ),
      },
      {
        accessor: "updatedAt",
        title: "Actualizada",
        width: 180,
      },
      {
        accessor: "actions",
        title: "Acciones",
        textAlign: "center",
        render: (page) => (
          <div className="flex justify-center">
            <ActionsMenu
              onViewDetails={() => handleViewStaticPage(page)}
              onEdit={() => handleEditStaticPage(page)}
              onDelete={async () => {
                try {
                  const res = await deleteStaticPage(page.id);
                  if (res.error) {
                    showToast(res.message || "Error al eliminar", "error");
                  } else {
                    showToast("Página eliminada", "success");
                  }
                } catch (e) {
                  showToast("Error al eliminar", "error");
                }
              }}
              onActive={async () => {
                try {
                  const activate = page.status !== ContentStatus.Active;
                  const res = await toggleStaticPageStatus(page.id, activate);
                  if (res.error) {
                    showToast(
                      res.message || "Error al cambiar estado",
                      "error"
                    );
                  } else {
                    showToast("Estado actualizado", "success");
                  }
                } catch (e) {
                  showToast("Error al cambiar estado", "error");
                }
              }}
              active={page.status === ContentStatus.Active}
              viewPermissions={[PERMISSION_ENUM.RETRIEVE]}
              editPermissions={[PERMISSION_ENUM.UPDATE]}
              deletePermissions={[PERMISSION_ENUM.DELETE]}
              activePermissions={[PERMISSION_ENUM.UPDATE]}
            />
          </div>
        ),
      },
    ],
    [handleViewStaticPage, handleEditStaticPage]
  );

  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const handleSearchParamsChangeDebounced = useCallback(
    (params: SearchParams) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        onSearchParamsChange(params);
      }, 400);
    },
    [onSearchParamsChange]
  );

  return (
    <>
      <DataGrid
        data={data}
        columns={columns}
        searchParams={searchParams}
        onSearchParamsChange={handleSearchParamsChangeDebounced}
        searchPlaceholder="Buscar páginas..."
        onCreate={handleCreateStaticPage}
        createPermissions={[PERMISSION_ENUM.CREATE]}
        emptyText="No se encontraron páginas"
        createText="Crear página"
      />
      {createOpen && (
        <StaticPageCreateModal open={createOpen} onClose={handleCloseModal} />
      )}
      {selectedPage && editPageId && (
        <StaticPageEditModal
          open={!!editPageId}
          onClose={handleCloseModal}
          page={{
            id: selectedPage.id,
            title: selectedPage.title,
            slug: selectedPage.slug,
          }}
        />
      )}
      {viewPageId && (
        <StaticPageDetailsModal
          open={!!viewPageId}
          pageId={viewPageId}
          fallbackPage={selectedPage}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
}
