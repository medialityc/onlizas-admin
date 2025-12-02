import { SearchParams } from "@/types/fetch/request";
import InventoryServerWrapper from "@/sections/inventory-provider/containers/inventory-server-wrapper";
import { InventoryListSkeleton } from "@/sections/inventory-provider/components/skeleton/inventory-list-skeleton";
import { Suspense } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inventario General - Onlizas",
  description: "Gestión el inventarios",
  icons: {
    icon: "/assets/images/NEWZAS.svg",
  },
};

/**
 * Página de inventario - Server Component
 *
 * Utiliza el nuevo InventoryServerWrapper que:
 * - Obtiene permisos en el servidor (sin delay de cliente)
 * - Pre-fetchea datos según el rol del usuario
 * - Renderiza el componente apropiado (admin/supplier)
 */
export default async function InventoryProviderPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const search = await searchParams;

  return (
    <Suspense fallback={<InventoryListSkeleton />}>
      <InventoryServerWrapper query={search} />
    </Suspense>
  );
}
