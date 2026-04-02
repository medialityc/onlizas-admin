"use client";
import { Tab } from "@/types/tabs";
import { WAREHOUSE_TYPE_ENUM } from "./warehouse-type";

export const warehouseTabs = (
  warehouseId: string,
  warehouseType: WAREHOUSE_TYPE_ENUM,
): Tab[] => [
  {
    id: "general",
    label: "Datos Generales",
    path: `/dashboard/warehouses/${warehouseType}/${warehouseId}/edit`,
  },
  {
    id: "inventory",
    label: "Inventarios",
    path: `/dashboard/warehouses/${warehouseType}/${warehouseId}/edit/inventory`,
  },
  {
    id: "transfers",
    label: "Transferencias",
    path: `/dashboard/warehouses/${warehouseType}/${warehouseId}/edit/transfers`,
  },
  {
    id: "history",
    label: "Historial de transferencia",
    path: `/dashboard/warehouses/${warehouseType}/${warehouseId}/edit/transfers/list`,
  },
];

