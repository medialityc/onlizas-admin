import { Product } from "./products";

export type InventoryStatus = "En Stock" | "Stock Bajo" | "Sin Stock";

export interface InventoryVariant {
  name: string;
  value: string;
  units: number;
}

export interface InventoryItem {
  id: number;
  productId: number;
  productName: string;
  productCategory: string;
  productImage?: string;
  storeId: number;
  storeName: string;
  warehouseId: number;
  warehouseName: string;
  variants: InventoryVariant[];
  quantity: number;
  totalValue: number;
  status: InventoryStatus;
}

export interface InventorySummary {
  totalItems: number;
  totalValue: number;
  lowStockItems: number;
  warehousesCount: number;
}

export interface InventoryFilter {
  search?: string;
  warehouse?: number | "all";
  store?: number | "all";
  status?: InventoryStatus | "all";
}

export interface GetInventoryResponse {
  items: InventoryItem[];
  summary: InventorySummary;
}
