"use client";
import { usePermissions } from "@/hooks/use-permissions";
import { PERMISSION_ENUM } from "@/lib/permissions";
import ProductsListContainer from "./products-list-container";
import SupplierProductsListContainer from "./supplier-products-list-container";
import { useMemo, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllProducts, getAllMyProducts } from "@/services/products";
import { buildQueryParams } from "@/lib/request";
import { IQueryable, SearchParams } from "@/types/fetch/request";
import Loader from "@/layouts/loading";

type Props = {
  query: SearchParams;
};

export default function ProductsListPermissionWrapper({ query }: Props) {
  const { hasPermission, isLoading: permissionsLoading } = usePermissions();

  const hasAdminRetrieve = hasPermission([PERMISSION_ENUM.RETRIEVE]);
  const hasSupplierRetrieveOnly =
    !hasAdminRetrieve && hasPermission([PERMISSION_ENUM.SUPPLIER_RETRIEVE]);

  const apiQuery: IQueryable = useMemo(
    () => buildQueryParams(query as any),
    [query]
  );
  const serializedParams = useMemo(() => JSON.stringify(apiQuery), [apiQuery]);
  const [stableData, setStableData] = useState<any | undefined>(undefined);

  const {
    data: productsResponse,
    isLoading,
    isError,
    error,
    isFetching,
  } = useQuery({
    queryKey: [
      "products-list",
      hasAdminRetrieve ? "admin" : "supplier",
      serializedParams,
    ],
    queryFn: async () => {
      return hasAdminRetrieve
        ? await getAllProducts(apiQuery)
        : await getAllMyProducts(apiQuery);
    },
    staleTime: 30_000,
    refetchOnWindowFocus: false,
    placeholderData: (prev) => prev,
    retry: 1,
  });

  useEffect(() => {
    if (productsResponse) setStableData(productsResponse);
  }, [productsResponse]);

  // Permisos cargando y no hay data previa -> skeleton consistente
  if (permissionsLoading && !stableData) {
    return (
      <div className="space-y-4">
        <div className="h-10 w-full bg-gray-100 dark:bg-gray-800 animate-pulse rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-48 bg-gray-100 dark:bg-gray-800 animate-pulse rounded"
            />
          ))}
        </div>
      </div>
    );
  }
  // Cargando inicial sin data previa
  if (!permissionsLoading && isLoading && !productsResponse && !stableData) {
    return (
      <div className="space-y-4">
        <div className="h-10 w-full bg-gray-100 dark:bg-gray-800 animate-pulse rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-48 bg-gray-100 dark:bg-gray-800 animate-pulse rounded"
            />
          ))}
        </div>
      </div>
    );
  }
  if (isError)
    return (
      <div className="p-6 panel">
        <p className="text-red-500">
          Error al cargar productos: {(error as any)?.message || "Desconocido"}
        </p>
      </div>
    );

  const effectiveData = productsResponse || stableData;
  if (!effectiveData) {
    return (
      <div className="space-y-4">
        <div className="h-10 w-full bg-gray-100 dark:bg-gray-800 animate-pulse rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-48 bg-gray-100 dark:bg-gray-800 animate-pulse rounded"
            />
          ))}
        </div>
      </div>
    );
  }

  const supplierView = hasSupplierRetrieveOnly;
  const ContainerComponent = supplierView
    ? SupplierProductsListContainer
    : ProductsListContainer;

  // Admin (or user with full RETRIEVE) fallback
  return (
    <div className="relative">
      {isFetching && effectiveData && (
        <div className="absolute top-0 right-0 m-2 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <span className="inline-block w-2 h-2 rounded-full bg-blue-500 animate-ping" />
          Actualizando...
        </div>
      )}
      <ContainerComponent productsPromise={effectiveData} query={query} />
    </div>
  );
}
