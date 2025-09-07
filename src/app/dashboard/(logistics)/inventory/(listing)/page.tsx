import { buildQueryParams } from "@/lib/request";
import InventoryCardListContainer from "@/sections/inventory-provider/containers/inventory-card-list-container";
import { getAllInventoryProvider } from "@/services/inventory-providers";
import { IQueryable, SearchParams } from "@/types/fetch/request";
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
  const query: IQueryable = buildQueryParams(search);
  const inventories = await getAllInventoryProvider(query);

  return (
    <>
      {inventories && (
        <InventoryCardListContainer inventories={inventories} query={search} />
      )}
    </>
  );
}

export default InventoryProviderPage;
