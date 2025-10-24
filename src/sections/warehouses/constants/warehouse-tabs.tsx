"use client";
import { Tab } from "@/types/tabs";
import { WAREHOUSE_TYPE_ROUTE_ENUM } from "./warehouse-type";

export const warehouseTabs = (
  warehouseId: string,
  warehouseType: WAREHOUSE_TYPE_ROUTE_ENUM
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
    label: "Historial de trasferencia",
    path: `/dashboard/warehouses/${warehouseType}/${warehouseId}/edit/transfers/list`,
  },
];

export const meWarehouseTabs = (
  warehouseId: number,
  warehouseType: WAREHOUSE_TYPE_ROUTE_ENUM
): Tab[] => [
  {
    id: "inventory",
    label: "Inventarios",
    path: `/provider/warehouses/${warehouseType}/${warehouseId}/edit/inventory`,
  },
  {
    id: "transfers",
    label: "Transferencias",
    path: `/provider/warehouses/${warehouseType}/${warehouseId}/edit/transfers`,
  },
  {
    id: "history",
    label: "Historial de trasferencia",
    path: `/provider/warehouses/${warehouseType}/${warehouseId}/edit/transfers/list`,
  },
];
