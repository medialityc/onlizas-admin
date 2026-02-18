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
    [currentQuery],
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
    [currentQuery.page, currentQuery.pageSize],
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
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <StoreIcon className="h-4 w-4" />
            <span>Órdenes por tienda</span>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setSelectedStoreId(null)}
          >
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
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/40 to-background">
      <div className="container mx-auto space-y-8 px-4 py-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <StoreIcon className="h-3.5 w-3.5" />
              Tiendas con órdenes
            </div>
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              Mis Tiendas
            </h1>
            <p className="text-sm text-muted-foreground">
              Selecciona una tienda para revisar y gestionar sus órdenes.
            </p>
          </div>
          <Button variant="secondary" size="sm" onClick={router.back}>
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
              <div className="py-12 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <StoreIcon className="h-8 w-8 text-muted-foreground/60" />
                </div>
                <p className="text-sm text-muted-foreground">
                  No tienes tiendas con órdenes registradas todavía.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
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
