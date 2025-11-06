import { SearchParams } from "@/types/fetch/request";
import InventoryPermissionWrapper from "@/sections/inventory-provider/containers/inventory-permission-wrapper";
import { InventoryPermissionGate } from "@/sections/inventory-provider/components/inventory-permission-gate";
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
  // Gate: ocultar cualquier navegación/tabs que estén fuera hasta que permisos carguen.
  // Aquí asumimos que las tabs están fuera de este componente; si no, envuelve sólo la parte de tabs.
  return (
    <InventoryPermissionGate
      requireAdmin={false}
      keepSkeletonForNonAdmin={false}
    >
      <InventoryPermissionWrapper query={search} />
    </InventoryPermissionGate>
  );
}

export default InventoryProviderPage;
