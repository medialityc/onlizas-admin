import { PaginatedResponse } from "./common";

// Tipo principal de promoción (actualizado para coincidir con el JSON del backend)
export type Promotion = {
  id: number;
  storeId: number;
  storeName: string;
  isActive: boolean;
  name: string;
  description: string;
  promotionType?: number; // Campo del backend que indica el tipo de promoción (0-5)
  startDate?: string; // Opcional si no siempre viene
  endDate?: string;   // Opcional si no siempre viene
  discountValue: number;
  discountType: number;
  usageLimit: number;
  usedCount?: number;
  code: string;
  mediaFile: string;
  isFreeDelivery?: boolean; // Campo adicional del backend
  usageLimitPerUser?: number | null;
  minPurchaseAmount?: number | null;
  minProductQuantity?: number | null;
  promotionCategoriesDTOs: Array<{ // Corregido para coincidir con JSON
    id: number;
    categoryId: number;
    categoryName: string;
  }>;
  promotionProductsDTOs: Array<{ // Corregido para coincidir con JSON
    productVariantId: number;
    productName: string; // Corregido para coincidir con JSON
  }>;
  dateRangesDTOs?: Array<any>; // Campo adicional si es necesario
  productRequirementsDTOs?: Array<any>;
  productRewardsDTOs?: Array<any>;
};

// Parámetros de búsqueda para promociones
export type PromotionSearchParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  isActive?: boolean;
  type?: "percent" | "amount";
  status?: "active" | "inactive" | "expired";
};

// Para crear promoción
export type PromotionRequest = {
  id?:number,
  storeId?: number;
  name: string;
  description: string;
  discountType: number;
  discountValue?: number;
  code?: string;
  mediaFile: string | File;
  usageLimit?: number;
  startDate: string;
  endDate: string;
  usageLimitPerUser?: number,
  categoriesIds?: number[];
  productVariantsIds?: number[];
};

// Para actualizar promoción
export type UpdatePromotionRequest = Partial<PromotionRequest>;

// Respuesta paginada de promociones
export type GetStorePromotions = PaginatedResponse<Promotion>;

// Métricas de promociones
export type PromotionMetrics = {
  total: number;
  active: number;
  uses: number;
  expired: number;
};
