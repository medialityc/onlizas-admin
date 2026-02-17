import { buildQueryParams } from "@/lib/request";
import OrdersPermissionWrapper from "@/sections/orders/containers/orders-permission-wrapper";
import { getAllOrders } from "@/services/order";
import { IQueryable, SearchParams } from "@/types/fetch/request";
import { Metadata } from "next";
import { getModulePermissions } from "@/components/permission/server-permission-wrapper";

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
  const { isAdmin } = await getModulePermissions("orders");
  const ordersPromise = isAdmin ? await getAllOrders(query) : undefined;
  return (
    <OrdersPermissionWrapper
      query={params}
      adminData={ordersPromise}
      supplierName={"Proveedor"} // Se obtendrá dinámicamente en el componente
    />
  );
}

export default Page;
