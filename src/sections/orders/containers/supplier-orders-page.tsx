"use client";

import { Download, RefreshCw } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { ApiResponse } from "@/types/fetch/api";
import { GetAllOrders, OrderStatus } from "@/types/order";
import useFiltersUrl from "@/hooks/use-filters-url";
import { SearchParams } from "@/types/fetch/request";
import { DataGridCard } from "@/components/datagrid-card/datagrid-card";
import SupplierOrderCardList from "./supplier-order-card-list";
import { Button } from "@/components/button/button";
import { SupplierOrderStatsCards } from "@/components/orders/supplier-order-stats-cards";

type Props = {
  data: ApiResponse<GetAllOrders>;
  query: SearchParams;
  supplierName?: string;
};

export default function SupplierOrdersPage({
  data,
  query,
  supplierName,
}: Props) {
  const { updateFiltersInUrl } = useFiltersUrl();
  const router = useRouter();
  const searchParams = useSearchParams();
  const onSearchParamsChange = (params: SearchParams) => {
    updateFiltersInUrl(params);
  };

  const allSubOrders = data.data?.data?.flatMap((o) => o.subOrders) ?? [];

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
              Órdenes del Proveedor
            </h1>
            <p className="text-muted-foreground mt-1">
              Gestiona tus órdenes agrupadas - {supplierName}
            </p>
          </div>
        </div>

        {/* Stats */}
        <SupplierOrderStatsCards
          subOrders={allSubOrders as any}
          activeStatus={activeStatus}
          onStatusFilterChange={handleStatsFilterChange}
        />

        <div className="space-y-4">
          {data.data?.data.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No se encontraron órdenes</p>
            </div>
          ) : (
            <DataGridCard
              data={data.data}
              searchParams={query}
              onSearchParamsChange={onSearchParamsChange}
              searchPlaceholder="Buscar órdenes..."
              enableColumnToggle={false}
              component={
                <SupplierOrderCardList
                  data={data.data?.data}
                  onPrintLabel={(id) => console.log("Imprimir etiqueta", id)}
                />
              }
            />
          )}
        </div>
      </div>
    </div>
  );
}
