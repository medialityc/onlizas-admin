import { TabItem } from "@/components/tab/navigation-tabs";

export const warehousesTabs: TabItem[] = [
  {
    label: "Todos los Almacenes",
    href: "/dashboard/warehouses",
    icon: "buildingLibrary",
  },
  {
    label: "Almacenes Generales",
    href: "/dashboard/warehouses/warehouse",
    icon: "buildingStorefront",
  },
  {
    label: "Almacenes para proveedores",
    href: "/dashboard/warehouses/virtualwarehouse",
    icon: "buildingOffice",
  },
];
