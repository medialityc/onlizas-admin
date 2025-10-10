// Minimal types for Regions: keep surface small so it's easy to evolve.

import { PaginatedResponse } from './common';
import { Country } from './countries';

export interface RegionCurrency {
  currencyId: number|string;
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
  paymentGatewayId: number|string;
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
  shippingMethodId: number|string;
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
  id: number|string;
  name: string;
  code: string;
  description: string;
  status: number | string;
  createdAt: string;
  updatedAt: string;
  active: boolean;
  countries: Array<{
    id: string|number;
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
  countryIds: string|number[]; // Países asociados
  moveCountries?: boolean; // Para mover países desde otras regiones
}

// Response type for paginated regions list
export type GetAllRegions = PaginatedResponse<Region>;


// Region logs types
export type RegionLogs = {
  id: number|string;
  timestamp: string;
  description: string;
  regionId: number|string;
  regionName: string;
  regionCode: string;
  userId: number|string;
  userName: string;
  action: string;
  entityType: string;
  entityId?: number|string;
  metadata?: Record<string, any>;
};

export type GetAllRegionLogs = PaginatedResponse<RegionLogs>;

// Payloads for API operations
export interface AddCurrenciesPayload {
  currencies: Array<{
    currencyId: number|string;
    isPrimary: boolean;
    isEnabled: boolean;
  }>;
}

export interface AddPaymentGatewaysPayload {
  paymentGateways: Array<{
    paymentGatewayId: number|string;
    priority: number;
    isFallback: boolean;
    isEnabled: boolean;
    supportedMethods: string[]; // ['card', 'bank_transfer', etc.]
    configurationJson?: string;
  }>;
}

export interface UpdatePaymentPriorityPayload {
  paymentGatewayId: number|string;
  newPriority: number;
}

export interface AddShippingMethodsPayload {
  shippingMethods: Array<{
    shippingMethodId: number|string;
    baseCost: number;
    estimatedDaysMin: number;
    estimatedDaysMax: number;
    maxWeight?: number;
    maxDimensions?: number;
    carrier: string;
    enabled: boolean;
    metadata?: Record<string, any>;
  }>;
}