import { SearchParams } from "@/types/fetch/request";
import InventoryPermissionWrapper from "@/sections/inventory-provider/containers/inventory-permission-wrapper";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inventario General - ZAS Express",
  description: "Gestión el inventarios",
  icons: {
    icon: "/assets/images/NEWZAS.svg",
  },
};

interface PageProps {
  searchParams: Promise<SearchParams>;
}

async function InventoryProviderPage({ searchParams }: PageProps) {
  const search = await searchParams;
  return <InventoryPermissionWrapper query={search} />;
}

export default InventoryProviderPage;
