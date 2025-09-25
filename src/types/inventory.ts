import { PaginatedResponse } from "./common";

export type InventoryProductItem = {
  id: number;
  productId: number;
  productName: string;
  price: number;
  discountedPrice: number;
  limitPurchaseLimit: number;
  warranty?: {
    isWarranty: boolean;
    warrantyTime: number;
    warrantyPrice: number;
  };
  isPrime: boolean;
  quantity: number;
  inventoryId: number;
  storeId: number;
  storeName: string;
  details: string[];
  images?: string[];
};

// Tipos para Currency
export type InventoryProvider = {
  id: number;
  isActive: boolean;
  parentProductId: number;
  parentProductName: string;
  storeId: number;
  storeName: string;
  supplierId: number;
  supplierName: string;
  warehouseId: number;
  warehouseName: string;
  totalPrice: number;
  totalQuantity: number;
  isPacking?: boolean;

  products: InventoryProductItem[];
  categoryIds: number[];
};

export type GetAllInventoryProvider = {
  data: InventoryProvider[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export type CreateEasyInventory = {
  storeId: number;
  warehouseId?: number;
  productId: number;
  supplierId: number;
  isPaqueteria?: boolean;
};

export type GetAllInventoryProviderResponse =
  PaginatedResponse<InventoryProvider>;
