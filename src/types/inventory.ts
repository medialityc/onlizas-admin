import { PaginatedResponse } from "./common";

export type InventoryProductItem = {
  id: string;
  globalID: string;
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
  stock: number;
  inventoryId: number;
  storeId: number;
  storeName: string;
  details: string[];
  images?: string[];
  isActive?: boolean;
};

// Tipos para Currency
export type InventoryProvider = {
  id: number;
  active: boolean;
  parentProductId: number;
  parentProductName: string;
  storeId: number;
  storeName: string;
  supplierId: string;
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
  storeId: string;
  warehouseId?: string;
  productId: string;
  supplierId: string;
  isPaqueteria?: boolean;
};

export type GetAllInventoryProviderResponse =
  PaginatedResponse<InventoryProvider>;
