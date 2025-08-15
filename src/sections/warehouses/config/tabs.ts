import { TabItem } from "@/components/tab/navigation-tabs";

export const warehousesTabs: TabItem[] = [
  {
    label: "Todos los Almacenes",
    href: "/dashboard/warehouses",
    icon: "buildingLibrary",
  },
  {
    label: "Almacenes Físicos",
    href: "/dashboard/warehouses/physical",
    icon: "buildingStorefront",
  },
  {
    label: "Almacenes Virtuales",
    href: "/dashboard/warehouses/virtual",
    icon: "buildingOffice",
  },
];
