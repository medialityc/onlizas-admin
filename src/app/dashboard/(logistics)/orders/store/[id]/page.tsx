import { Metadata } from "next";
import { SearchParams } from "@/types/fetch/request";
import { buildQueryParams } from "@/lib/request";
import { getOrdersByStore } from "@/services/order";
import { ApiResponse } from "@/types/fetch/api";
import { GetAllOrders } from "@/types/order";
import SupplierOrdersPage from "@/sections/orders/containers/supplier-orders-page";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<SearchParams>;
}

export const metadata: Metadata = {
  title: "Órdenes por tienda - Onlizas",
};

async function StoreOrdersPage({ params, searchParams }: PageProps) {
  const sp = await searchParams;
  const apiQuery = buildQueryParams(sp as any);

  const ordersResponse: ApiResponse<GetAllOrders> = await getOrdersByStore(
    (await params).id,
    apiQuery,
  );

  return (
    <SupplierOrdersPage
      data={ordersResponse}
      query={sp}
      supplierName={"Proveedor"}
    />
  );
}

export default StoreOrdersPage;
