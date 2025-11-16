"use client";
import { useMemo, useState } from "react";
import { Download, RefreshCw, Search, Package } from "lucide-react";
import { Input } from "@/components/input/input";
import { Button } from "@/components/button/button";
import { DataGridCard } from "@/components/datagrid-card/datagrid-card";
import { OrderStats } from "../components/order-stats";
import { ApiResponse } from "@/types/fetch/api";
import { GetAllOrders, Order } from "@/types/order";
import { OrderGroupCard, OrderGroup } from "@/components/orders/order-group-card";
import { SupplierOrderStatsCards } from "@/components/orders/supplier-order-stats-cards";

type Props = { data: ApiResponse<GetAllOrders>; supplierName?: string };

export default function SupplierOrderListContainer({ data, supplierName }: Props) {
  const [searchValue, setSearchValue] = useState("");
  const orderGroups: OrderGroup[] = useMemo(() => {
    const orders: Order[] = data.data?.data ?? [];
    return orders.map((o) => ({ order: o, subOrders: o.subOrders }));
  }, [data]);

  const filteredGroups = useMemo(() => {
    if (!searchValue) return orderGroups;
    const q = searchValue.toLowerCase();
    return orderGroups.filter((g) => {
      const baseMatch =
        g.order.orderNumber.toLowerCase().includes(q) ||
        g.order.senderName.toLowerCase().includes(q) ||
        g.order.receiverName.toLowerCase().includes(q);
      const subMatch = g.subOrders.some(
        (so) =>
          so.productName.toLowerCase().includes(q) ||
          so.subOrderNumber.toLowerCase().includes(q)
      );
      return baseMatch || subMatch;
    });
  }, [searchValue, orderGroups]);

  const allSubOrders = useMemo(() => orderGroups.flatMap((g) => g.subOrders), [orderGroups]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-balance">
              Mis Órdenes de Proveedor
            </h1>
            {supplierName && (
              <p className="text-muted-foreground mt-1">
                {supplierName} - Gestiona tus órdenes agrupadas
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={() => window.location.reload()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualizar
            </Button>
            <Button size="sm" variant="secondary" outline>
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>

        <OrderStats orders={allSubOrders as any} />
        <SupplierOrderStatsCards subOrders={allSubOrders as any} />

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por número de orden, cliente, producto..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-10"
          />
        </div>

        <DataGridCard
          enableSearch={false}
          hidePagination
          searchPlaceholder="Buscar órdenes..."
          data={{
            data: filteredGroups,
            totalCount: filteredGroups.length,
            page: 1,
            pageSize: filteredGroups.length,
            hasNext: false,
            hasPrevious: false,
          }}
          component={
            filteredGroups.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-16 w-16 mx-auto text-muted-foreground/50" />
                <p className="text-muted-foreground mt-4">
                  No se encontraron órdenes
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredGroups.map((group) => (
                  <OrderGroupCard
                    key={group.order.id}
                    group={group}
                    onPrintLabel={(id) => console.log("Imprimir etiqueta", id)}
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
