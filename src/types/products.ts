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
export type Product = {
  id: number;
  name: string;
  description: string;
  state: boolean;
  suppliers: ProductSupplier[];
  categories: ProductCategory[];
  dimensions?: ProductDimensions;
  about: string[];
  details: ProductDetail[];
  features: ProductFeatureResponse[];
  images: ProductImage[];
};

// Para crear producto según la API
export type CreateProductRequest = {
  name: string;
  description: string;
  isActive: boolean;
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

export type ProductFilter = {
  search?: string;
  categoryId?: number;
  isActive?: boolean;
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
  isActive?: boolean;
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
