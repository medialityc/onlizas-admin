"use client";

import React from "react";
import { NavigationTabs, TabItem } from "@/components/tab/navigation-tabs";
import { usePermissions } from "@/hooks/use-permissions";
import { PERMISSION_ENUM } from "@/lib/permissions";
// ...existing code...
import { paths } from "@/config/paths";

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

export default function InventoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { hasPermission } = usePermissions();
  const hasAdminRetrieve = hasPermission([PERMISSION_ENUM.RETRIEVE]);

  const supplierOnly =
    !hasAdminRetrieve && hasPermission([PERMISSION_ENUM.RETRIEVE_INVENTORY]);
  return (
    <div>
      <NavigationTabs tabs={tabs} className="mb-6" hidden={supplierOnly} />
      <div>{children}</div>
    </div>
  );
}
