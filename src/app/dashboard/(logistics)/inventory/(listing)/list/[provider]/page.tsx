import { buildQueryParams } from "@/lib/request";
import { InventoryListSkeleton } from "@/sections/inventory-provider/components/skeleton/inventory-list-skeleton";
import InventoryProviderCardListContainer from "@/sections/inventory-provider/containers/inventory-provider-card-list-container";
import { getAllInventoryByUserProvider } from "@/services/inventory-providers";
import { getUserProviderById } from "@/services/users";
import { IQueryable, SearchParams } from "@/types/fetch/request";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Inventario por Proveedores - ZAS Express",
  description: "Gestiona el inventario de los proveedores",
  icons: {
    icon: "/assets/images/NEWZAS.svg",
  },
};

interface PageProps {
  searchParams: Promise<SearchParams>;
  params: Promise<{ provider: string }>;
}

async function InventoryProviderPage({ searchParams, params }: PageProps) {
  const search = await searchParams;
  const { provider: supplierId } = await params;
  const query: IQueryable = buildQueryParams(search);

  const inventories = getAllInventoryByUserProvider(supplierId, query);

  const provider = await getUserProviderById(supplierId);

  return (
    <Suspense fallback={<InventoryListSkeleton />}>
      <InventoryProviderCardListContainer
        inventories={inventories}
        query={search}
        provider={provider?.data}
      />
    </Suspense>
  );
}

export default InventoryProviderPage;
