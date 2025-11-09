export interface ProductImage {
  url: string;
  id: number;
}

export interface Product {
  id: number;
  name: string;
  images: ProductImage[];
  aboutThis?: string[];
  tutorials?: string[]; // URLs de YouTube
  details?: Record<string, string>;
  description?: string;
  width?: number;
  height?: number;
  length?: number;
  weight?: number;
}

export interface ProductOption {
  id: number;
  name: string;
  images?: string[];
  aboutThis?: string[];
  tutorials?: string[]; // URLs de YouTube
  details?: Record<string, string>;
  description?: string;
  width?: number;
  height?: number;
  length?: number;
  weight?: number;
}

export interface ProductApiResponse {
  data: Product[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}
