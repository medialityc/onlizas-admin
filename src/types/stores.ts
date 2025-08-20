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
export type StoreNo = {
  id: number;
  //supplierId: string,
  ownerId: number;
  businessId: number;
  url: string;
  name: string;
  description: string;
  isActive: boolean;
  logoStyle: string;
  contact: StoreContact;
  appearance: StoreAppearance;
  banners: StoreBanner[];
  promotions: StorePromotion[];
  policy: StorePolicy;
  //categories:Category[]
  metrics: StoreMetrics;

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
  ownerId: number;
  businessId: number;
  url: string;
  description?: string;
  // Logo puede ser URL o nombre de archivo según manejo multipart
  logoStyle?: string;
  // Contacto (campos planos, no objeto)
  email: string;
  phoneNumber: string;
  address: string;
  // Políticas (campos planos)
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
  isActive?: boolean;
};

// Respuesta paginada
export type GetAllStores = PaginatedResponse<Store>;

export type Store = {
  id: number;
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
      id: number;
      name: string;
      email: string;
      phoneNumber: string;
    },
  ];
  banners: [
    {
      title: string;
      urlDestinity: string;
      position: string;
      initDate: string;
      endDate: string;
      image: string;
    },
  ];
  businessName: string;
};

export type StoreMetric = {
  id: number;
  title: string;
  isActive: boolean;
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
