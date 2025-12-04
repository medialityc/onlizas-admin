import { Brand } from "./brands";
import { InventoryProductItem } from "./inventory";

// Tipos según la API real en product-apis.md
export type ProductDimensions = {
  width?: number;
  height?: number;
  lenght?: number; // Note: API usa "lenght" no "length"
};

export type ProductImage = {
  image: string;
  order: number;
};

export type ProductDetail = {
  name: string;
  value: string;
};

export type ProductFeature = {
  id: number;
  value: string;
};

export type ProductFeatureResponse = {
  id: number;
  name: string;
  values: string[];
};

export type ProductCategory = {
  id: number;
  name: string;
};

export type ProductSupplier = {
  id: number;
  name: string;
};

// Producto según respuesta de la API
export interface Product {
  id: string;
  name: string;
  niso: string;
  gtin: string;
  brand: Brand;
  description: string;
  image: string;
  length: number;
  width: number;
  height: number;
  weight: number;
  customsValue: number;
  quantityValue: string;
  // isDurable: boolean;
  aduanaCategoryGuid: string;
  aduanaCategory: AduanaCategory;
  source: string;
  shortDescription: string;
  customsValueAduanaUsd: number;
  points: number;
  minimumQuantity: number;
  rateXValue: number;
  stock: number;
  unitGuid: string;
  aboutThis: string[];
  details: Details;
  state: boolean;
  categories: Category[];
  suppliers: Category[];
  active: boolean;
  tutorials: string[];
}
export interface AduanaCategory {
  id: number;
  guid: string;
  source: string;
  chapter: string;
  chapterName: string;
  specificRule: string;
  active: boolean;
  suppliers: ProductSupplier[];
  categories: ProductCategory[];
  dimensions?: ProductDimensions;
  about: string[];
  details: ProductDetail[];
  features: ProductFeatureResponse[];
  images: ProductImage[];
  image: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface Details {
  additionalProp1: string;
  additionalProp2: string;
  additionalProp3: string;
}
// Para crear producto según la API
export type CreateProductRequest = {
  name: string;
  description: string;
  active: boolean;
  supplierIds: number[];
  categoryIds: number[];
  dimensions?: ProductDimensions;
  about: string[];
  details: ProductDetail[];
  features: ProductFeature[];
  images: ProductImage[];
};

// Para actualizar producto según la API
export type UpdateProductRequest = Partial<CreateProductRequest>;

// Aliases para compatibilidad con servicios
export type CreateProduct = CreateProductRequest;
export type UpdateProduct = UpdateProductRequest;

// Respuesta específica de la API de productos con su formato de paginación
export type ProductApiResponse = {
  data: Product[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
};

export type GetAllProducts = ProductApiResponse;

// Tipo para las variantes de productos con la nueva estructura del endpoint
export type ProductVariantItem = {
  id: string;
  productId: string;
  productName: string;
  costPrice: number;
  price: number;
  upc: string;
  ean: string;
  condition: number;
  limitPurchaseLimit: number;
  warranty: {
    id: number;
    isWarranty: boolean;
    warrantyPrice: number;
    warrantyTime: number;
  };
  isPrime: boolean;
  stock: number;
  inventoryId: string;
  storeId: string;
  storeName: string;
  details: {
    [key: string]: string;
  };
  images: string[];
  sku: string;
  weight: number;
  volume: number;
  isActive: boolean;
  deliveryType: number;
  zoneId: string;
  zone: {
    id: string;
    deliveryAmount: number;
    districtsIds: string[];
    userId: string;
    userName: string;
    subsystemId: string;
    subsystemName: string;
    active: boolean;
    createdDatetime: string;
    updatedDatetime: string;
  };
};

export type ProductVariantsApiResponse = {
  data: ProductVariantItem[];
  page: number;
  pageSize: number;
  totalCount: number;
  hasNext: boolean;
  hasPrevious: boolean;
};

export type GetAllProductVariant = Omit<ProductApiResponse, "data"> & {
  data: InventoryProductItem[];
};

export type ProductFilter = {
  search?: string;
  categoryId?: number;
  active?: boolean;
  supplierId?: number;
  page?: number;
  pageSize?: number;
};

// Search params para productos - actualizado según la nueva API
export interface ProductSearchParams {
  page?: number;
  pageSize?: number;
  search?: string;
  categoryId?: number;
  active?: boolean;
  supplierId?: number;
}

// Tipos para endpoints complementarios
export type SimpleCategory = {
  id: number;
  name: string;
  description?: string;
};

export type SimpleSupplier = {
  id: number;
  name: string;
};

export type CategoryFeature = {
  id: number;
  name: string;
  description?: string;
  suggestions: string[];
  required: boolean;
};

export type SimpleCategoriesResponse = {
  categories: SimpleCategory[];
};

export type SimpleSuppliersResponse = {
  suppliers: SimpleSupplier[];
};

export type CategoryFeaturesResponse = {
  features: CategoryFeature[];
};

// Tipos para acciones específicas
export type AssignSuppliersRequest = {
  supplierIds: number[];
};

export type CanDeleteResponse = {
  canDelete: boolean;
};
