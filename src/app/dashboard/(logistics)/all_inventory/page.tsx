import { buildQueryParams } from "@/lib/request";
import { InventoryListSkeleton } from "@/sections/inventory-provider/components/skeleton/inventory-list-skeleton";
import InventoryCardListContainer from "@/sections/inventory-provider/containers/inventory-card-list-container";
import { getAllInventoryProvider } from "@/services/inventory-providers";
import { IQueryable, SearchParams } from "@/types/fetch/request";
import { Metadata } from "next";
import { Suspense } from "react";

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

  const inventories = getAllInventoryProvider(query);

  return (
    <Suspense fallback={<InventoryListSkeleton />}>
      <InventoryCardListContainer inventories={inventories} query={search} />
    </Suspense>
  );
}

export default InventoryProviderPage;
