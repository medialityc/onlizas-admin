import { PaginatedResponse } from "./common";

export type ProductVariant = {
  weight?: number;
  color?: string;
  size?: string;
};

export type ProductImage = {
  id: number;
  url: string;
  isMain: boolean;
  order: number;
};

export type ProductSpecification = {
  key: string;
  value: string;
};

export type ProductDimensions = {
  height?: number;
  width?: number;
  depth?: number;
  unit: string;
};

export type Product = {
  id: number;
  name: string;
  description?: string;
  categoryId: number;
  status: 'active' | 'inactive';
  upcCode?: string;
  npnCode?: string;
  images: ProductImage[];
  variants?: ProductVariant;
  specifications?: ProductSpecification[];
  featuredCharacteristics?: string[];
  dimensions?: ProductDimensions;
  warranty?: string;
  supplierIds: number[];
  createdAt: string;
  updatedAt: string;
};

export type CreateProduct = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;

export type UpdateProduct = Partial<CreateProduct>;

export type GetAllProducts = PaginatedResponse<Product>;

export type ProductFilter = {
  categoryId?: number;
  status?: 'active' | 'inactive';
  supplierId?: number;
  hasStock?: boolean;
};
