"use client";
import { usePermissions } from "@/hooks/use-permissions";
import { PERMISSION_ENUM } from "@/lib/permissions";
import { useQuery } from "@tanstack/react-query";
import { buildQueryParams } from "@/lib/request";
import { getAllWarehouses, getAllMeWarehouses } from "@/services/warehouses";
import { SearchParams, IQueryable } from "@/types/fetch/request";
import WarehouseListContainer from "./warehouse-list-container";
import MeWarehouseListContainer from "./me-warehouse-list-container";
import { useMemo, useEffect, useState } from "react";

/**
 * Wrapper de permisos para listado de almacenes.
 * - Admin (Retrieve): lista todos los almacenes (WarehouseListContainer)
 * - Supplier (RetrieveWarehouse sin Retrieve): lista solo sus almacenes (MeWarehouseListContainer)
 * - Sin permisos válidos: mensaje informativo
 */
export default function WarehousePermissionWrapper({
  query,
}: {
  query: SearchParams;
}) {
  const { hasPermission, isLoading: permissionsLoading } = usePermissions();
  const hasAdminRetrieve =
    !permissionsLoading && hasPermission([PERMISSION_ENUM.RETRIEVE]);
  const hasSupplierRetrieve =
    !permissionsLoading &&
    !hasAdminRetrieve &&
    hasPermission([PERMISSION_ENUM.SUPPLIER_RETRIEVE]);
  const canList = hasAdminRetrieve || hasSupplierRetrieve;

  const apiQuery: IQueryable = useMemo(
    () => buildQueryParams(query as any),
    [query]
  );
  const serializedParams = useMemo(() => JSON.stringify(apiQuery), [apiQuery]);
  const [stableData, setStableData] = useState<any | undefined>(undefined);

  const {
    data: warehousesResponse,
    isLoading: warehousesLoading,
    isFetching,
    error,
    isError,
  } = useQuery({
    queryKey: [
      "warehouses-list",
      hasAdminRetrieve ? "admin" : hasSupplierRetrieve ? "supplier" : "none",
      serializedParams,
    ],
    queryFn: async () => {
      if (hasAdminRetrieve) return await getAllWarehouses(apiQuery as any);
      if (hasSupplierRetrieve) return await getAllMeWarehouses(apiQuery as any);
      return undefined;
    },
    enabled: canList,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
    placeholderData: (prev) => prev,
    retry: 1,
  });

  useEffect(() => {
    if (warehousesResponse) setStableData(warehousesResponse);
  }, [warehousesResponse]);

  // Skeleton mientras cargan permisos
  if (permissionsLoading) {
    return (
      <div className="space-y-4">
        <div className="h-10 w-full bg-gray-100 dark:bg-gray-800 animate-pulse rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-40 bg-gray-100 dark:bg-gray-800 animate-pulse rounded"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!canList) {
    return (
      <div className="panel p-6">
        <h2 className="text-lg font-semibold mb-2">Gestión de Almacenes</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No tiene permisos para visualizar almacenes.
        </p>
      </div>
    );
  }

  if (warehousesLoading && !warehousesResponse && !stableData) {
    return (
      <div className="space-y-4">
        <div className="h-10 w-full bg-gray-100 dark:bg-gray-800 animate-pulse rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-40 bg-gray-100 dark:bg-gray-800 animate-pulse rounded"
            />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="panel p-6">
        <p className="text-red-500">
          Error al cargar almacenes: {(error as any)?.message || "Desconocido"}
        </p>
      </div>
    );
  }

  const effectiveData = warehousesResponse || stableData;
  if (!effectiveData) {
    return (
      <div className="space-y-4">
        <div className="h-10 w-full bg-gray-100 dark:bg-gray-800 animate-pulse rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-40 bg-gray-100 dark:bg-gray-800 animate-pulse rounded"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {hasAdminRetrieve ? (
        <WarehouseListContainer
          warehousesPromise={effectiveData as any}
          query={query}
        />
      ) : (
        <MeWarehouseListContainer
          warehousesPromise={effectiveData as any}
          query={query}
        />
      )}
      {isFetching && !warehousesLoading && effectiveData && (
        <div className="absolute top-2 right-2 text-xs px-2 py-1 bg-gray-800 text-white rounded shadow animate-pulse">
          Actualizando...
        </div>
      )}
    </div>
  );
}
