import React from "react";
import { NavigationTabs, TabItem } from "@/components/tab/navigation-tabs";
import { getModulePermissions } from "@/components/permission/server-permission-wrapper";
import { paths } from "@/config/paths";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const tabs: TabItem[] = [
  {
    label: "Inventario General",
    href: paths.dashboard.inventory.all,
    id: "all_inventory",
    icon: "buildingLibrary",
  },
  {
    label: "Por Proveedor",
    href: paths.dashboard.inventory.list,
    id: "inventory",
    icon: "buildingStorefront",
  },
];

/**
 * Layout de inventario - Server Component
 * Determina qué tabs mostrar basándose en los permisos del usuario.
 * - Admin: Muestra todas las tabs
 * - Supplier: Oculta las tabs (solo ve su inventario)
 */
export default async function InventoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAdmin, isSupplier } = await getModulePermissions("inventory");

  // Si es supplier sin permisos de admin, ocultar las tabs
  const supplierOnly = !isAdmin && isSupplier;

  return (
    <div>
      <NavigationTabs tabs={tabs} className="mb-6" hidden={supplierOnly} />
      <div>{children}</div>
    </div>
  );
}
