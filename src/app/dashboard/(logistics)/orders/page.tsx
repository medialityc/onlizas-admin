import OrdersPermissionWrapper from "@/sections/orders/containers/orders-permission-wrapper";
import { SearchParams } from "@/types/fetch/request";
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
  return <OrdersPermissionWrapper query={params} />;
}

export default Page;
