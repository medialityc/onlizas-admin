import StoresPermissionWrapper from "@/sections/stores/list/stores-permission-wrapper";
import { SearchParams } from "@/types/fetch/request";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gestión de Tiendas - ZAS Express",
  description: "Administra las tiendas del sistema",
  icons: {
    icon: "/assets/images/NEWZAS.svg",
  },
};

interface PageProps {
  searchParams: Promise<SearchParams>;
}

async function StoresListPage({ searchParams }: PageProps) {
  const params = await searchParams;
  // Delegamos la lógica de permisos y fetching al wrapper cliente
  return <StoresPermissionWrapper query={params} />;
}

export default StoresListPage;
