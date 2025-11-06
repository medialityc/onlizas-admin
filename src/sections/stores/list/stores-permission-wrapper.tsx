"use client";
import { usePermissions } from "@/hooks/use-permissions";
import { PERMISSION_ENUM } from "@/lib/permissions";
import { useQuery } from "@tanstack/react-query";
import { buildQueryParams } from "@/lib/request";
import { getAllStores, getProviderStores } from "@/services/stores";
import { SearchParams, IQueryable } from "@/types/fetch/request";
import StoresListContainer from "./stores-list-container";
import SkeletonStoreList from "./components/skeleton";
import { useMemo, useState, useEffect } from "react";

interface WrapperProps {
  query?: SearchParams; // search params crudos
  apiQuery?: IQueryable; // versión ya construida desde la page
}

export default function StoresPermissionWrapper({
  query,
  apiQuery: externalApiQuery,
}: WrapperProps) {
  const { hasPermission, isLoading: permissionsLoading } = usePermissions();

  const hasAdminRetrieve =
    !permissionsLoading && hasPermission([PERMISSION_ENUM.RETRIEVE]);
  const hasSupplierRetrieve =
    !permissionsLoading &&
    !hasAdminRetrieve &&
    hasPermission([PERMISSION_ENUM.RETRIEVE_STORE]);
  const canList = hasAdminRetrieve || hasSupplierRetrieve;

  // Memo de parámetros para evitar nueva identidad
  const apiQuery: IQueryable = useMemo(
    () =>
      externalApiQuery
        ? externalApiQuery
        : buildQueryParams((query || {}) as any),
    [externalApiQuery, query]
  );
  const serializedParams = useMemo(() => JSON.stringify(apiQuery), [apiQuery]);

  const [stableData, setStableData] = useState<any | undefined>(undefined);

  const {
    data: storesResponse,
    isLoading: storesLoading,
    isFetching,
  } = useQuery({
    queryKey: [
      "stores-list",
      hasAdminRetrieve ? "admin" : hasSupplierRetrieve ? "supplier" : "none",
      serializedParams,
    ],
    queryFn: async () => {
      if (hasAdminRetrieve) return await getAllStores(apiQuery);
      if (hasSupplierRetrieve) return await getProviderStores(apiQuery);
      return undefined;
    },
    enabled: canList,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
    placeholderData: (prev) => prev,
    retry: 1,
  });

  useEffect(() => {
    if (storesResponse) setStableData(storesResponse);
  }, [storesResponse]);

  // Estado inicial mientras cargan permisos y no hay datos previos
  if (permissionsLoading && !stableData) {
    return <SkeletonStoreList />;
  }

  // Sin permisos
  if (!permissionsLoading && !canList) {
    return (
      <div className="panel p-6">
        <h2 className="text-lg font-semibold mb-2">Gestión de Tiendas</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No tiene permisos para visualizar tiendas.
        </p>
      </div>
    );
  }

  // Cargando primera vez lista sin datos aún
  if (canList && storesLoading && !storesResponse && !stableData) {
    return <SkeletonStoreList />;
  }

  const effectiveData = storesResponse || stableData;

  return (
    <div className="relative">
      {canList && effectiveData && (
        <StoresListContainer
          storesPromise={effectiveData as any}
          query={(query || {}) as SearchParams}
        />
      )}
      {isFetching && canList && effectiveData && (
        <div className="absolute top-2 right-2 text-xs px-2 py-1 bg-gray-800 text-white rounded shadow animate-pulse">
          Actualizando...
        </div>
      )}
    </div>
  );
}
