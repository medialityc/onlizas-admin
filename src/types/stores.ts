import { PaginatedResponse } from "./common";

// Tipos auxiliares
export type StoreContact = {
  email: string;
  phoneNumber: string;
  address: string;
};

export type StoreAddress = {
  street: string;
  city?: string;
  country?: string;
};

export type BannerItem = {
  id?: number | string; 
  title: string;
  urlDestinity: string;
  position: number | string; // integer position
  initDate?: string | null; // ISO date string - usar nombres del backend
  endDate?: string | null;   // ISO date string - usar nombres del backend
  image?: File | string | null;
  active: boolean;
};

export type StorePolicy = {
  returnPolicy: string;
  shippingPolicy: string;
  termsOfService: string;
};

export type StoreAppearance = {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  font: string;
  template: string;
};

export type StoreBanner = {
  id: number | string;
  title: string;
  image: string;
  url: string;
  position: "hero" | "sidebar";
  startDate: string;
  endDate: string;
  active: boolean;
};

type StoreMetrics = {
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
  ownerId: number | string;
  businessId: number | string;
  url: string;
  description?: string;
  logoStyle?: string;
  email: string;
  phoneNumber: string;
  address: string;
  returnPolicy: string;
  shippingPolicy: string;
  termsOfService: string;
};

// Para actualizar tienda
export type UpdateStoreRequest = Partial<Store>;

// Alias
export type CreateStore = CreateStoreRequest;
export type UpdateStore = UpdateStoreRequest;

// Filtros y búsqueda
export type StoreSearchParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  active?: boolean;
};

// Respuesta paginada

export type Store = {
  id: number | string;
  active: boolean;
  supplierId: number | string;
  metrics: StoreMetrics;
  name: string;
  description: string;
  url: string;
  email: string;
  phoneNumber: string;
  address: string;
  logoStyle: string;
  returnPolicy: string;
  shippingPolicy: string;
  termsOfService: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  font: string;
  template: string;
  followers: [
    {
      id: number | string;
      name: string;
      email: string;
      phoneNumber: string;
    },
  ];
  banners: [
    {
      title: string;
      urlDestinity: string;
      position: number | string;
      initDate: string;
      endDate: string;
      image: string;
    },
  ];
  businessName: string;
  supplierName: string;
};

export type GetAllStores = PaginatedResponse<Store>;

export type StoreMetric = {
  id: number | string;
  title: string;
  active: boolean;
  logo?: string | null;
  url?: string | null;
  description?: string | null;
  categoryCount?: number;
  productCount?: number;
  visitCount?: number;
  conversionRate?: number;
};
export type StoreMetricsResponse = {
  totalStores: number;
  activeStores: number;
  totalVisits: number;
  averageConversionRate: number;
  storeMetrics: StoreMetric[];
};
export type GetStoreMetrics = StoreMetricsResponse;
