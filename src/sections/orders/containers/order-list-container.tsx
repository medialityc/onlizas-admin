"use client";

import { useState } from "react";

import { Download, RefreshCw, Search } from "lucide-react";
import { ApiResponse } from "zas-sso-client/dist/lib/api";
import { GetAllOrders } from "@/types/order";
import useFiltersUrl from "@/hooks/use-filters-url";
import { SearchParams } from "@/types/fetch/request";
import { DataGridCard } from "@/components/datagrid-card/datagrid-card";
import OrderList from "./order-card-list";
import { Button } from "@/components/button/button";
import { Input } from "@/components/input/input";
import { OrderStats } from "../components/order-stats";

type Props = {
  data: ApiResponse<GetAllOrders>;
  query: SearchParams;
};

export default function AdminOrdersPage({ data, query }: Props) {
  const [searchQuery, setSearchQuery] = useState("");

  const { updateFiltersInUrl } = useFiltersUrl();
  const onSearchParamsChange = (params: SearchParams) => {
    updateFiltersInUrl(params);
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
          <div className="flex gap-2">
            <Button size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualizar
            </Button>
            <Button size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>

        {/* Stats */}
        <OrderStats orders={data.data?.data ?? []} />

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por número de orden, cliente, producto..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

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
              searchPlaceholder="Buscar inventario..."
              createText="Crear inventario"
              enableColumnToggle={false}
              component={<OrderList data={data.data?.data} />}
            />
          )}
        </div>
      </div>
    </div>
  );
}
