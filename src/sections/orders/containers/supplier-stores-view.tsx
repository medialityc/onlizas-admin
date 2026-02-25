"use client";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { buildQueryParams } from "@/lib/request";
import { IQueryable, SearchParams } from "@/types/fetch/request";
import { GetAllStores, Store } from "@/types/stores";
import { StoreCard } from "@/sections/orders/components/store-card";
import { DataGridCard } from "@/components/datagrid-card/datagrid-card";
import { Button } from "@/components/button/button";
import { ArrowLeft, Store as StoreIcon } from "lucide-react";
import { ApiResponse } from "@/types/fetch/api";
import { getProviderStores } from "@/services/stores";

interface SupplierStoresViewProps {
  query: SearchParams;
  supplierName: string;
}

export default function SupplierStoresView({
  query,
  supplierName,
}: SupplierStoresViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
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
  });

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

  const stores: Store[] = storesResponse?.data?.data ?? [];

  const handleStoreClick = (storeId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    router.push(`/dashboard/orders/store/${storeId}?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-background via-muted/40 to-background">
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
                    onClick={handleStoreClick}
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
