"use client";

import { useCallback, useMemo } from "react";

import { GetAllStores, Store } from "@/types/stores";
import { SearchParams } from "@/types/fetch/request";
import { useModalState } from "@/hooks/use-modal-state";

import StoresModalContainer from "../modals/store-create-container";
import useFiltersUrl from "@/hooks/use-filters-url";
import { DataGrid } from "@/components/datagrid";
import { DataTableColumn } from "mantine-datatable";
import Badge from "@/components/badge/badge";
import { formatNumber, formatPercentage } from "@/utils/format";
import { usePermissions } from "@/hooks/use-permissions";
import { PERMISSION_ENUM } from "@/lib/permissions";
import { BuildingStorefrontIcon } from "@heroicons/react/24/outline";
import { Cog6ToothIcon, EyeIcon } from "@heroicons/react/24/solid";
import ProgressiveImage from "@/components/image/progressive-image";
import Link from "next/link";
import { Button } from "@/components/button/button";

interface StoresListProps {
  data?: GetAllStores;
  searchParams: SearchParams;
  onSearchParamsChange: (params: SearchParams) => void;
  afterCreateRedirectTo?: string;
}

export function StoresList({
  data,
  searchParams,
  onSearchParamsChange,
  afterCreateRedirectTo,
}: StoresListProps) {
  const { getModalState, openModal, closeModal } = useModalState();
  const createStoreModal = getModalState("create");
  const handleCreateStore = useCallback(() => openModal("create"), [openModal]);

  const { updateFiltersInUrl } = useFiltersUrl();
  const { hasPermission } = usePermissions();

  const hasReadPermission = hasPermission([
    PERMISSION_ENUM.RETRIEVE,
    PERMISSION_ENUM.SUPPLIER_RETRIEVE,
  ]);
  const hasUpdatePermission = hasPermission([
    PERMISSION_ENUM.UPDATE,
    PERMISSION_ENUM.SUPPLIER_UPDATE,
  ]);

  const mergedOnSearchParamsChange = useCallback(
    (params: SearchParams) => {
      onSearchParamsChange?.(params);
      updateFiltersInUrl(params);
    },
    [onSearchParamsChange, updateFiltersInUrl],
  );

  const columns = useMemo<DataTableColumn<Store>[]>(
    () => [
      {
        accessor: "name",
        title: "Tienda",
        sortable: true,
        render: (store) => (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 shrink-0 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden flex items-center justify-center">
              {store.logoStyle ? (
                <ProgressiveImage
                  src={store.logoStyle}
                  alt={store.name}
                  width={32}
                  height={32}
                  className="object-cover w-full h-full"
                />
              ) : (
                <BuildingStorefrontIcon className="w-4 h-4 text-gray-400" />
              )}
            </div>
            <div className="min-w-0">
              <div className="font-medium text-sm truncate max-w-45">
                {store.name}
              </div>
              {store.businessName && (
                <div className="text-xs text-gray-400 truncate max-w-45">
                  {store.businessName}
                </div>
              )}
            </div>
          </div>
        ),
      },
      {
        accessor: "supplierName",
        title: "Proveedor",
        sortable: true,
        render: (store) => (
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {store.supplierName || "-"}
          </span>
        ),
      },
      {
        accessor: "active",
        title: "Estado",
        sortable: true,
        render: (store) => (
          <Badge variant={store.active ? "primary" : "outline-primary"}>
            <span
              className={`mr-1 inline-block h-2 w-2 rounded-full ${store.active ? "bg-green-500" : "bg-gray-400"}`}
            />
            {store.active ? "Activa" : "Inactiva"}
          </Badge>
        ),
      },
      {
        accessor: "url",
        title: "URL",
        render: (store) =>
          store.url ? (
            <a
              href={`${process.env.NEXT_PUBLIC_CLIENT_URL}/store/${store.url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
              onClick={(e) => e.stopPropagation()}
            >
              /{store.url}
            </a>
          ) : (
            <span className="text-gray-400">-</span>
          ),
      },
      {
        accessor: "email",
        title: "Email",
        render: (store) => (
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {store.email || "-"}
          </span>
        ),
      },
      {
        accessor: "phoneNumber",
        title: "Teléfono",
        render: (store) => (
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {store.phoneNumber || "-"}
          </span>
        ),
      },

      {
        accessor: "primaryColor",
        title: "Colores",
        render: (store) => (
          <div className="flex items-center gap-1.5">
            {store.primaryColor && (
              <span
                className="inline-block w-4 h-4 rounded-full border border-gray-200 dark:border-gray-600"
                style={{ backgroundColor: store.primaryColor }}
                title={`Primary: ${store.primaryColor}`}
              />
            )}
            {store.secondaryColor && (
              <span
                className="inline-block w-4 h-4 rounded-full border border-gray-200 dark:border-gray-600"
                style={{ backgroundColor: store.secondaryColor }}
                title={`Secondary: ${store.secondaryColor}`}
              />
            )}
            {store.accentColor && (
              <span
                className="inline-block w-4 h-4 rounded-full border border-gray-200 dark:border-gray-600"
                style={{ backgroundColor: store.accentColor }}
                title={`Accent: ${store.accentColor}`}
              />
            )}
            {!store.primaryColor &&
              !store.secondaryColor &&
              !store.accentColor && (
                <span className="text-gray-400 text-xs">-</span>
              )}
          </div>
        ),
      },
      {
        accessor: "actions",
        title: "Acciones",
        render: (store) => (
          <div
            className="flex items-center gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            {store.url && hasReadPermission && (
              <a
                href={`${process.env.NEXT_PUBLIC_CLIENT_URL}/store/${store.url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center p-1.5 rounded border text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-700 transition-colors"
                title="Ver tienda pública"
              >
                <EyeIcon className="w-4 h-4" />
              </a>
            )}
            {hasUpdatePermission && (
              <Link href={`/dashboard/stores/${store.id}`}>
                <Button size="sm" className="px-2 py-1.5">
                  <Cog6ToothIcon className="w-4 h-4" />
                </Button>
              </Link>
            )}
          </div>
        ),
      },
    ],
    [hasReadPermission, hasUpdatePermission],
  );

  return (
    <>
      <DataGrid
        data={data}
        columns={columns}
        searchParams={searchParams}
        onSearchParamsChange={mergedOnSearchParamsChange}
        searchPlaceholder="Buscar tienda..."
        onCreate={handleCreateStore}
        createText="Nueva Tienda"
        createPermissions={[PERMISSION_ENUM.CREATE, PERMISSION_ENUM.SUPPLIER_CREATE]}
        emptyText="No hay tiendas para mostrar"
      />

      <StoresModalContainer
        open={createStoreModal.open}
        onClose={() => closeModal("create")}
        afterCreateRedirectTo={afterCreateRedirectTo}
      />
    </>
  );
}
