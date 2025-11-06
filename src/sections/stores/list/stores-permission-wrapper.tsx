"use client";
import { usePermissions } from "@/hooks/use-permissions";
import { PERMISSION_ENUM } from "@/lib/permissions";
import { useQuery } from "@tanstack/react-query";
import { buildQueryParams } from "@/lib/request";
import { getAllStores, getProviderStores } from "@/services/stores";
import { SearchParams, IQueryable } from "@/types/fetch/request";
import StoresListContainer from "./stores-list-container";
import SkeletonStoreList from "./components/skeleton";

/**
 * Wrapper que decide qué servicio de listado de tiendas usar dependiendo de permisos.
 * - Admin (Retrieve): lista todas las tiendas.
 * - Supplier (RetrieveStore sin Retrieve): lista solo sus propias tiendas.
 * Si no tiene ninguno de los permisos, muestra mensaje de falta de permisos.
 */
export default function StoresPermissionWrapper({
  query,
}: {
  query: SearchParams;
}) {
  const { hasPermission, isLoading: permissionsLoading } = usePermissions();
  // Evaluar permisos solo cuando ya cargaron para evitar flash de "sin permisos"
  const hasAdminRetrieve =
    !permissionsLoading && hasPermission([PERMISSION_ENUM.RETRIEVE]);
  const hasSupplierRetrieve =
    !permissionsLoading &&
    !hasAdminRetrieve &&
    hasPermission([PERMISSION_ENUM.RETRIEVE_STORE]);
  const canList = hasAdminRetrieve || hasSupplierRetrieve;

  const apiQuery: IQueryable = buildQueryParams(query as any);

  const {
    data: storesResponse,
    isLoading: storesLoading,
    isFetching,
  } = useQuery({
    queryKey: [
      "stores-list",
      hasAdminRetrieve ? "admin" : hasSupplierRetrieve ? "supplier" : "none",
      apiQuery,
    ],
    queryFn: async () => {
      if (hasAdminRetrieve) return await getAllStores(apiQuery);
      if (hasSupplierRetrieve) return await getProviderStores(apiQuery);
      return undefined;
    },
    enabled: canList, // No ejecutar hasta conocer permisos válidos
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });

  // Mientras permisos están cargando mostrar skeleton inicial
  if (permissionsLoading) {
    return <SkeletonStoreList />;
  }

  if (!canList) {
    return (
      <div className="panel p-6">
        <h2 className="text-lg font-semibold mb-2">Gestión de Tiendas</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No tiene permisos para visualizar tiendas.
        </p>
      </div>
    );
  }

  if (storesLoading && !storesResponse) {
    return <SkeletonStoreList />;
  }
  return (
    <div className="relative">
      <StoresListContainer
        storesPromise={storesResponse as any}
        query={query}
      />
      {isFetching && !storesLoading && storesResponse && (
        <div className="absolute top-2 right-2 text-xs px-2 py-1 bg-gray-800 text-white rounded shadow animate-pulse">
          Actualizando...
        </div>
      )}
    </div>
  );
}
