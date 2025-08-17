import { Category } from "./categories";
import { PaginatedResponse } from "./common";

// Tipos auxiliares
export type StoreContact = {
  email: string;
  phone: string;
};

export type StoreAddress = {
  street: string;
  city?: string;
  country?: string;
};

export type StoreAppearance = {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  font: string;
  template: string;
};

export type StoreBanner = {
  id: number;
  title: string;
  image: string;
  url: string;
  position: "hero" | "sidebar";
  startDate: string;
  endDate: string;
  isActive: boolean;
};

export type StorePromotion = {
  id: number;
  title: string;
  type: "percentage" | "freeShipping";
  value: string;
  usageLimit: number;
  usageCount: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
};

// Tienda completa según API
export type Store = {
  id: number;
  supplierId: string,
  url:string;
  name: string;
  description: string;
  isActive: boolean;
  ownerId: string;
  logo: string;
  contact: StoreContact;
  address: StoreAddress;
  appearance: StoreAppearance;
  banners: StoreBanner[];
  promotions: StorePromotion[];
  
  categories:Category[]
  metrics:StoreMetrics
  
  // Nuevos campos de ventas e ingresos
  ventasDelMes: number;
  ingresosDelMes: number;
  totalVentas: number;
  totalIngresos: number;
  /* categories: {
    id: number;
    name: string;
    productCount: number;
    visits: number;
    conversion: number;
  }[]; */
  /* metrics: {
    monthlyVisits: number;
    conversionRate: number;
    totalProducts: number;
    totalCategories: number;
  }; */
};
export type StoreMetrics = {
  totalProducts: number;
  views: number;
  sales: number;
  income: number;
  monthlyVisits: number;
  conversionRate: number;
  totalCategories: number;
};

// Para crear tienda
export type CreateStoreRequest = {
  name: string;
  description: string;
  isActive: boolean;
  slug: string;
  logo: string;
  contact: StoreContact;
  address: StoreAddress;
  appearance: StoreAppearance;
};

// Para actualizar tienda
export type UpdateStoreRequest = Partial<CreateStoreRequest>;

// Alias
export type CreateStore = CreateStoreRequest;
export type UpdateStore = UpdateStoreRequest;

// Filtros y búsqueda
export type StoreSearchParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  isActive?: boolean;
};

// Respuesta paginada
export type GetAllStores = PaginatedResponse<Store>;
