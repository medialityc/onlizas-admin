import { buildQueryParams } from "@/lib/request";
import AdminOrdersPage from "@/sections/orders/containers/order-list-container"; // retained for SSR prefetch
import OrdersPermissionWrapper from "@/sections/orders/containers/orders-permission-wrapper";
import { getAllOrders } from "@/services/order";
import { IQueryable, SearchParams } from "@/types/fetch/request";
import { Metadata } from "next";

interface PageProps {
  searchParams: Promise<SearchParams>;
}

export const metadata: Metadata = {
  title: "Gestión de órdenes - Onlizas",
  description: "Administra las órdenes del sistema y sus datos asociados",
  icons: {
    icon: "/assets/images/NEWZAS.svg",
  },
};

async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const query: IQueryable = buildQueryParams(params);
  const ordersPromise = await getAllOrders(query);
  return (
    <OrdersPermissionWrapper
      query={params}
      adminData={ordersPromise}
      supplierName={"Proveedor"}
    />
  );
}

export default Page;
