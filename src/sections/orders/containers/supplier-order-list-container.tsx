"use client";
import { useMemo, useState } from "react";
import { Download, RefreshCw, Search, Package } from "lucide-react";
import { Input } from "@/components/input/input";
import { Button } from "@/components/button/button";
import { DataGridCard } from "@/components/datagrid-card/datagrid-card";
// Vista de proveedor: recibe órdenes ya filtradas por backend con solo sus sub-órdenes
import { ApiResponse } from "@/types/fetch/api";
import { GetAllOrders, Order } from "@/types/order";
import { OrderGroupCard } from "@/components/orders/order-group-card";
import { SupplierOrderStatsCards } from "@/components/orders/supplier-order-stats-cards";

type Props = {
  data: ApiResponse<GetAllOrders>;
  supplierName?: string;
  onShowStores?: () => void;
};

export default function SupplierOrderListContainer({
  data,
  supplierName,
  onShowStores,
}: Props) {
  const [searchValue, setSearchValue] = useState("");
  const orders: Order[] = useMemo(() => data.data?.data ?? [], [data]);

  const filteredOrders = useMemo(() => {
    if (!searchValue) return orders;
    const q = searchValue.toLowerCase();
    return orders.filter((o) => {
      const baseMatch =
        o.orderNumber.toLowerCase().includes(q) ||
        o.senderName.toLowerCase().includes(q) ||
        o.receiverName.toLowerCase().includes(q);
      const subMatch = o.subOrders.some(
        (so) =>
          so.productName.toLowerCase().includes(q) ||
          so.subOrderNumber.toLowerCase().includes(q)
      );
      return baseMatch || subMatch;
    });
  }, [searchValue, orders]);

  const allSubOrders = useMemo(
    () => orders.flatMap((o) => o.subOrders),
    [orders]
  );

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
        </div>

        <SupplierOrderStatsCards subOrders={allSubOrders as any} />

        {/* <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por número de orden, cliente, producto..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-10"
          />
        </div> */}

        <DataGridCard
          enableSearch={false}
          hidePagination
          searchPlaceholder="Buscar órdenes..."
          data={{
            data: filteredOrders,
            totalCount: filteredOrders.length,
            page: 1,
            pageSize: filteredOrders.length,
            hasNext: false,
            hasPrevious: false,
          }}
          component={
            filteredOrders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-16 w-16 mx-auto text-muted-foreground/50" />
                <p className="text-muted-foreground mt-4">
                  No se encontraron órdenes
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <OrderGroupCard
                    key={order.id}
                    order={order}
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
