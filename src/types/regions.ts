// Minimal types for Regions: keep surface small so it's easy to evolve.

import { PaginatedResponse } from './common';

export interface RegionCurrency {
  currencyId: number;
  code: string;
  name: string;
  symbol: string;
  rate: number;
  isPrimary: boolean;
  isEnabled: boolean;
}

export interface RegionCurrencyConfig {
  primaryCurrency: RegionCurrency;
  allCurrencies: RegionCurrency[];
  enabledCount: number;
  totalCount: number;
}

export interface RegionPaymentGateway {
  paymentGatewayId: number;
  code: string;
  name: string;
  priority: number;
  isFallback: boolean;
  isEnabled: boolean;
  supportedMethods: string[];
}

export interface RegionPaymentConfig {
  gateways: RegionPaymentGateway[];
  fallbackGateway: RegionPaymentGateway;
  enabledCount: number;
  totalCount: number;
}

export interface RegionShippingMethod {
  shippingMethodId: number;
  code: string;
  name: string;
  carrier: string;
  isEnabled: boolean;
  baseCost: number;
  estimatedDaysMin: number;
  estimatedDaysMax: number;
}

export interface RegionShippingConfig {
  methods: RegionShippingMethod[];
  enabledCount: number;
  totalCount: number;
  minBaseCost: number;
  maxBaseCost: number;
}

// Interfaz que coincide exactamente con la respuesta del backend
export interface Region {
  id: number;
  name: string;
  code: string;
  description: string;
  status: number | string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  countries: Array<{
    id: number;
    code: string;
    name: string;
    phoneNumberCode?: number;
  }>;
  currencyConfig: RegionCurrencyConfig;
  paymentConfig: RegionPaymentConfig;
  shippingConfig: RegionShippingConfig;
  lastModified: string;
}

// Payload expected by create/update requests (keep as the single request type).
export interface RegionFormData {
  code: string;
  name: string;
  description?: string;
  status: number; // 0: active, 1: inactive
  countryIds: number[]; // Países asociados
  moveCountries?: boolean; // Para mover países desde otras regiones
}

// Response type for paginated regions list
export type GetAllRegions = PaginatedResponse<Region>;

// For country conflicts
export interface CountryConflictData {
  countryId: number;
  countryName: string;
  currentRegionId: number;
  currentRegionName: string;
}