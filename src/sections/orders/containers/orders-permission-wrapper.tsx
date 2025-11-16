"use client";
import { usePermissions } from "@/hooks/use-permissions";
import { PERMISSION_ENUM } from "@/lib/permissions";
import { useQuery } from "@tanstack/react-query";
import { buildQueryParams } from "@/lib/request";
import { IQueryable, SearchParams } from "@/types/fetch/request";
import { getAllOrders, getSupplierOrders } from "@/services/order";
import { useEffect, useMemo, useState } from "react";
import AdminOrdersPage from "./order-list-container";
import SupplierOrderListContainer from "./supplier-order-list-container";
import { ApiResponse } from "@/types/fetch/api";
import { GetAllOrders } from "@/types/order";

type Props = {
  query: SearchParams;
  adminData?: ApiResponse<GetAllOrders>; // SSR prefetch opcional
  supplierName?: string;
};

export default function OrdersPermissionWrapper({
  query,
  adminData,
  supplierName,
}: Props) {
  const { hasPermission, isLoading: permissionsLoading } = usePermissions();
  const hasAdminRetrieve =
    !permissionsLoading && hasPermission([PERMISSION_ENUM.RETRIEVE]);
  const hasSupplierRetrieve =
    !permissionsLoading &&
    !hasAdminRetrieve &&
    hasPermission([PERMISSION_ENUM.RETRIEVE_ORDERS]);
  const canList = hasAdminRetrieve || hasSupplierRetrieve;

  const apiQuery: IQueryable = useMemo(
    () => buildQueryParams(query as any),
    [query]
  );
  const serializedParams = useMemo(() => JSON.stringify(apiQuery), [apiQuery]);
  const [stableData, setStableData] = useState<ApiResponse<GetAllOrders> | undefined>(
    adminData
  );

  const {
    data: ordersResponse,
    isLoading: ordersLoading,
    isFetching,
    error,
    isError,
  } = useQuery<ApiResponse<GetAllOrders>>({
    queryKey: [
      "orders-list",
      hasAdminRetrieve ? "admin" : hasSupplierRetrieve ? "supplier" : "none",
      serializedParams,
    ],
    queryFn: async () => {
      if (hasAdminRetrieve) return await getAllOrders(apiQuery as any);
      if (hasSupplierRetrieve) return await getSupplierOrders(apiQuery as any);
      return undefined as any;
    },
    enabled: canList,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
    placeholderData: (prev) => prev,
    retry: 1,
  });

  useEffect(() => {
    if (ordersResponse) setStableData(ordersResponse);
  }, [ordersResponse]);

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
        <h2 className="text-lg font-semibold mb-2">Gestión de Órdenes</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No tiene permisos para visualizar órdenes.
        </p>
      </div>
    );
  }

  if (ordersLoading && !ordersResponse && !stableData) {
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
          Error al cargar órdenes: {(error as any)?.message || "Desconocido"}
        </p>
      </div>
    );
  }

  const effectiveData = ordersResponse || stableData;
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
        <AdminOrdersPage data={effectiveData as any} query={query} />
      ) : (
        <SupplierOrderListContainer
          data={effectiveData as any}
          supplierName={supplierName}
        />
      )}
      {isFetching && !ordersLoading && effectiveData && (
        <div className="absolute top-2 right-2 text-xs px-2 py-1 bg-gray-800 text-white rounded shadow animate-pulse">
          Actualizando...
        </div>
      )}
    </div>
  );
}