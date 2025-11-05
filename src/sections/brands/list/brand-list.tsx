"use client";

import { DataGrid } from "@/components/datagrid/datagrid";
import ActionsMenu from "@/components/menu/actions-menu";
import showToast from "@/config/toast/toastConfig";
import { SearchParams } from "@/types/fetch/request";
import { DataTableColumn } from "mantine-datatable";
import { useCallback, useMemo, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Brand, GetAllBrandsResponse } from "@/types/brands";
import { BrandCreateModal } from "../modals/brand-create-modal";
import { BrandEditModal } from "../modals/brand-edit-modal";
import { BrandDetailsModal } from "../modals/brand-details-modal";
import { paths } from "@/config/paths";
import { PERMISSION_ENUM } from "@/lib/permissions";
import { usePermissions } from "@/hooks/use-permissions";
import { deleteBrand } from "@/services/brands";

interface BrandListProps {
  data?: GetAllBrandsResponse;
  searchParams: SearchParams;
  onSearchParamsChange: (params: SearchParams) => void;
}

export function BrandList({
  data,
  searchParams,
  onSearchParamsChange,
}: BrandListProps) {
  const router = useRouter();
  const { hasPermission } = usePermissions();
  const urlSearchParams = useSearchParams();

  const createOpen = urlSearchParams.get("create") === "true";
  const editBrandId = urlSearchParams.get("edit");
  const viewBrandId = urlSearchParams.get("view");

  const selectedBrand = useMemo(() => {
    const id = editBrandId || viewBrandId;
    if (!id || !data?.data) return null;
    return data.data.find((b) => b.id === id) || null;
  }, [editBrandId, viewBrandId, data?.data]);

  const handleCreateBrand = useCallback(() => {
    if (!hasPermission([PERMISSION_ENUM.CREATE])) return;
    const params = new URLSearchParams(urlSearchParams);
    params.set("create", "true");
    router.push(`${paths.dashboard.brands.list}?${params.toString()}`);
  }, [router, urlSearchParams, hasPermission]);

  const handleEditBrand = useCallback(
    (brand: Brand) => {
      if (!hasPermission([PERMISSION_ENUM.UPDATE])) return;
      const params = new URLSearchParams(urlSearchParams);
      params.set("edit", brand.id.toString());
      router.push(`${paths.dashboard.brands.list}?${params.toString()}`);
    },
    [router, urlSearchParams, hasPermission]
  );

  const handleViewBrand = useCallback(
    (brand: Brand) => {
      const params = new URLSearchParams(urlSearchParams);
      params.set("view", brand.id.toString());
      router.push(`${paths.dashboard.brands.list}?${params.toString()}`);
    },
    [router, urlSearchParams]
  );

  const handleCloseModal = useCallback(() => {
    const params = new URLSearchParams(urlSearchParams);
    params.delete("create");
    params.delete("edit");
    params.delete("view");
    router.push(`${paths.dashboard.brands.list}?${params.toString()}`);
  }, [router, urlSearchParams]);

  const columns = useMemo<DataTableColumn<Brand>[]>(
    () => [
      {
        accessor: "name",
        title: "Nombre",
        sortable: true,
        render: (brand) => (
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
              {brand.name}
            </span>
          </div>
        ),
      },
      {
        accessor: "productsCount",
        title: "Productos",
        sortable: true,
        width: 120,
        render: (brand) => (
          <div className="text-center">
            <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
              {brand.productsCount}
            </div>
          </div>
        ),
      },
      {
        accessor: "actions",
        title: "Acciones",
        textAlign: "center",
        render: (brand) => (
          <div className="flex justify-center">
            <ActionsMenu
              onViewDetails={() => handleViewBrand(brand)}
              onEdit={() => handleEditBrand(brand)}
              onDelete={async () => {
                try {
                  const res = await deleteBrand(brand.id);
                  if (res.error) {
                    showToast(res.message || "Error al eliminar", "error");
                  } else {
                    showToast("Marca eliminada", "success");
                  }
                } catch (e) {
                  showToast("Error al eliminar", "error");
                }
              }}
              viewPermissions={[PERMISSION_ENUM.RETRIEVE]}
              editPermissions={[PERMISSION_ENUM.UPDATE]}
              deletePermissions={[PERMISSION_ENUM.DELETE]}
              activePermissions={[PERMISSION_ENUM.UPDATE]}
            />
          </div>
        ),
      },
    ],
    [handleViewBrand, handleEditBrand]
  );

  // Debounce search param updates (only search field) if DataGrid triggers onSearchParamsChange rapidly
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
        searchPlaceholder="Buscar marcas..."
        onCreate={handleCreateBrand}
        createPermissions={[PERMISSION_ENUM.CREATE]}
        emptyText="No se encontraron marcas"
        createText="Crear marca"
      />
      {createOpen && (
        <BrandCreateModal open={createOpen} onClose={handleCloseModal} />
      )}
      {selectedBrand && editBrandId && (
        <BrandEditModal
          open={!!editBrandId}
          onClose={handleCloseModal}
          brand={{ id: selectedBrand.id, name: selectedBrand.name }}
        />
      )}
      {viewBrandId && (
        <BrandDetailsModal
          open={!!viewBrandId}
          brandId={viewBrandId}
          fallbackBrand={selectedBrand}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
}
