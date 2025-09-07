import { buildQueryParams } from "@/lib/request";
import InventoryProviderCardListContainer from "@/sections/provider-management/inventory/list/inventory-provider-card-list-container";
import { getAllMyInventoryProvider } from "@/services/inventory-providers";
import { fetchUserMe } from "@/services/users";
import { IQueryable, SearchParams } from "@/types/fetch/request";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inventario por Proveedores - ZAS Express",
  description: "Gestiona el inventario de los proveedores",
  icons: {
    icon: "/assets/images/NEWZAS.svg",
  },
};

interface PageProps {
  searchParams: Promise<SearchParams>;
}

async function InventoryProviderPage({ searchParams }: PageProps) {
  const search = await searchParams;
  const query: IQueryable = buildQueryParams(search);

  const inventories = getAllMyInventoryProvider(query);

  const provider = await fetchUserMe();

  return (
    <InventoryProviderCardListContainer
      inventories={inventories}
      query={search}
      provider={provider?.data}
    />
  );
}

export default InventoryProviderPage;
