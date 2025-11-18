"use client";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProviderStores } from "@/services/stores";
import { buildQueryParams } from "@/lib/request";
import { IQueryable } from "@/types/fetch/request";
import { GetAllStores, Store } from "@/types/stores";
import { StoreCard } from "@/sections/orders/components/store-card";
import SupplierOrdersPage from "./supplier-orders-page";
import { SearchParams } from "@/types/fetch/request";
import { getOrdersByStore } from "@/services/order";
import { GetAllOrders } from "@/types/order";
import { DataGridCard } from "@/components/datagrid-card/datagrid-card";
import { ApiResponse } from "@/types/fetch/api";
import { useRouter } from "next/navigation";
import { Button } from "@/components/button/button";
import { ArrowLeft, Store as StoreIcon } from "lucide-react";

interface SupplierStoresViewProps {
  query: SearchParams;
  supplierName: string;
}

export default function SupplierStoresView({
  query,
  supplierName,
}: SupplierStoresViewProps) {
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);
  const [currentQuery, setCurrentQuery] = useState<SearchParams>(query);

  const apiQuery: IQueryable = useMemo(
    () => buildQueryParams(currentQuery),
    [currentQuery]
  );

  const {
    data: storesResponse,
    isLoading,
    error,
  } = useQuery<ApiResponse<GetAllStores>>({
    queryKey: ["supplier-stores", JSON.stringify(apiQuery)],
    queryFn: () => getProviderStores(apiQuery),
    enabled: !selectedStoreId,
  });

  const router = useRouter();

  const storeQuery = useMemo(
    () => ({
      page: currentQuery.page || 1,
      pageSize: currentQuery.pageSize || 10,
    }),
    [currentQuery.page, currentQuery.pageSize]
  );

  const { data: ordersResponse, isLoading: ordersLoading } = useQuery<
    ApiResponse<GetAllOrders>
  >({
    queryKey: ["supplier-orders", selectedStoreId, JSON.stringify(storeQuery)],
    queryFn: () =>
      getOrdersByStore(selectedStoreId!, buildQueryParams(storeQuery)),
    enabled: !!selectedStoreId,
  });

  if (selectedStoreId) {
    if (ordersLoading) {
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
      <div>
        <div className="mb-4">
          <Button variant="secondary" onClick={() => setSelectedStoreId(null)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a tiendas
          </Button>
        </div>
        <SupplierOrdersPage
          data={ordersResponse as any}
          query={storeQuery}
          supplierName={supplierName}
        />
      </div>
    );
  }

  if (isLoading) {
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

  if (error) {
    return (
      <div className="panel p-6">
        <p className="text-red-500">
          Error al cargar tiendas: {(error as any)?.message || "Desconocido"}
        </p>
      </div>
    );
  }

  const stores = storesResponse?.data?.data ?? [];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-balance">Mis Tiendas</h1>
            <p className="text-muted-foreground mt-1">
              Selecciona una tienda para ver sus órdenes
            </p>
          </div>
          <Button variant="secondary" onClick={router.back}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </div>

        <DataGridCard
          data={storesResponse?.data}
          searchParams={currentQuery}
          onSearchParamsChange={setCurrentQuery}
          searchPlaceholder="Buscar tiendas..."
          enableColumnToggle={false}
          component={
            stores.length === 0 ? (
              <div className="text-center py-12">
                <StoreIcon className="h-16 w-16 mx-auto text-muted-foreground/50" />
                <p className="text-muted-foreground mt-4">
                  No tienes tiendas asociadas
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stores.map((store: Store) => (
                  <StoreCard
                    key={store.id}
                    store={store}
                    onClick={setSelectedStoreId}
                  />
                ))}
              </div>
            )
          }
        />
      </div>
    </div>
  );
}
