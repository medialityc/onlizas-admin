"use client";

import React from "react";
import { NavigationTabs, TabItem } from "@/components/tab/navigation-tabs";
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
  return (
    <div>
      <NavigationTabs tabs={tabs} className="mb-6" />
      <div>{children}</div>
    </div>
  );
}
