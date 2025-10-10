// Tipos para categorías asociadas a una tienda (Store)
export type StoreCategory = {
  storeId: number | string;
  categoryId: number | string;
  id: number | string;
  categoryName: string;
  active: boolean;
  order: number; // prioridad/posición
};

// Parámetros de búsqueda para categorías de tienda
export type StoreCategorySearchParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  active?: boolean;
};

// Para crear/actualizar orden de categorías
export type UpdateStoreCategoriesOrderRequest = Array<{
  categoryId: number | string;
  order: number;
}>;

// Tipos de respuesta
export type GetStoreCategories = StoreCategory[];
export type StoreCategoryToggleResponse = {
  success: boolean;
  message: string;
};
