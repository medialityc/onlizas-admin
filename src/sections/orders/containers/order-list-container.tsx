"use client";

import { Download, RefreshCw } from "lucide-react";
import { useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ApiResponse } from "zas-sso-client/dist/lib/api";
import { GetAllOrders, OrderStatus } from "@/types/order";
import useFiltersUrl from "@/hooks/use-filters-url";
import { SearchParams } from "@/types/fetch/request";
import { DataGridCard } from "@/components/datagrid-card/datagrid-card";
import OrderList from "./order-card-list";
import { Button } from "@/components/button/button";
import { OrderStats } from "../components/order-stats";
import { StatusFilter } from "@/components/filters/status-filters";

type Props = {
  data: ApiResponse<GetAllOrders>;
  query: SearchParams;
};

// Mapeo de estados a nombres legibles
const ORDER_STATUS_MAP: Record<number, string> = {
  [OrderStatus.Pending]: "Pendiente",
  [OrderStatus.Processing]: "Procesando",
  [OrderStatus.Completed]: "Completada",
  [OrderStatus.Sent]: "Enviada",
  [OrderStatus.Received]: "Recibida",
  [OrderStatus.Cancelled]: "Cancelada",
  [OrderStatus.Refunded]: "Reembolsada",
};

const STATUS_OPTIONS = Object.entries(ORDER_STATUS_MAP).map(([key, value]) => ({
  value: key,
  label: value,
}));

export default function AdminOrdersPage({ data, query }: Props) {
  const [isPending, startTransition] = useTransition();
  const { updateFiltersInUrl } = useFiltersUrl();
  const router = useRouter();
  const searchParams = useSearchParams();
  const onSearchParamsChange = (params: SearchParams) => {
    startTransition(() => {
      updateFiltersInUrl(params);
    });
  };

  const statusParam = searchParams.get("status");
  const activeStatus = statusParam
    ? (Number(statusParam) as OrderStatus)
    : undefined;

  const handleStatsFilterChange = (status?: OrderStatus) => {
    const params = new URLSearchParams(searchParams);

    if (status === undefined) {
      params.delete("status");
    } else {
      params.set("status", String(status));
    }

    router.replace(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-balance">
              Gestión de Órdenes
            </h1>
            <p className="text-muted-foreground mt-1">
              Panel de administración para todas las órdenes del sistema
            </p>
          </div>
        </div>

        {/* Stats */}
        <OrderStats
          orders={data.data?.data ?? []}
          activeStatus={activeStatus}
          onStatusFilterChange={handleStatsFilterChange}
        />

        {/* Grid con Búsqueda y Filtros */}
        <DataGridCard
          data={data.data}
          searchParams={query}
          onSearchParamsChange={onSearchParamsChange}
          searchPlaceholder="Buscar por número de orden, cliente, email..."
          enableColumnToggle={false}
          rightActions={
            <StatusFilter
              options={STATUS_OPTIONS}
              placeholder="Todos los estados"
              searchParamKey="status"
              allowMultiple={false}
              className="w-full md:w-auto md:min-w-48"
            />
          }
          component={
            isPending ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center gap-3">
                  <div className="animate-spin rounded-full border-4 border-gray-300 dark:border-gray-600 border-t-blue-500 dark:border-t-blue-400 h-8 w-8"></div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Cargando órdenes...
                  </p>
                </div>
              </div>
            ) : (
              <OrderList data={data.data?.data} />
            )
          }
        />
      </div>
    </div>
  );
}
