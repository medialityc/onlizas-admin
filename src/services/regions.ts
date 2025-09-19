"use server";

import { ApiResponse, ApiStatusResponse } from '@/types/fetch/api';
import { Region, RegionFormData, GetAllRegions } from '@/types/regions';
import { IQueryable } from "@/types/fetch/request";
import { QueryParamsURLFactory } from "@/lib/request";
import { backendRoutes } from "@/lib/endpoint";
import { nextAuthFetch } from "./utils/next-auth-fetch";
import { buildApiResponseAsync, handleApiServerError, getErrorMessage } from "@/lib/api";
import { revalidateTag } from "next/cache";

// Local minimal types for service responses used only in this service.
interface RegionFilters {
  status?: Region['status'];
  search?: string;
}

interface RegionResolution {
  region: Region;
  primaryCurrency: string;
  enabledPaymentGateways: Array<{ gatewayId: number; priority: number; isFallback: boolean }>;
  enabledShippingMethods: Array<{ methodId: number; metadata: Record<string, any> }>;
}

interface RegionStats {
  total: number;
  active: number;
  inactive: number;
  withCountries: number;
  withCurrencies: number;
}

// CRUD operations using real backend API calls
export async function getRegions(params?: IQueryable): Promise<ApiResponse<GetAllRegions>> {
  const url = new QueryParamsURLFactory(
    { ...params },
    backendRoutes.regions.get
  ).build();

  const res = await nextAuthFetch({
    url,
    method: "GET",
    useAuth: true,
    next: { tags: ["regions"] },
  });

  if (!res.ok) return handleApiServerError(res);

  return buildApiResponseAsync<GetAllRegions>(res);
}

export async function getRegionById(id: number): Promise<ApiResponse<Region | null>> {
  const baseUrl = backendRoutes.regions.listById(id);  
  let url = `${baseUrl}?include= `;
  
  const res = await nextAuthFetch({
    url,
    method: "GET",
    useAuth:true,

  });

  if (!res.ok) {
    if (res.status === 404) {
      return { data: null, status: 404, error: true, message: 'Región no encontrada' };
    }
    return handleApiServerError(res);
  }

  return buildApiResponseAsync<Region>(res);
}

export async function createRegion(data: RegionFormData): Promise<ApiResponse<Region | null>> {
  const res = await nextAuthFetch({
    url: backendRoutes.regions.create,
    method: "POST",
    data: JSON.stringify(data),
    useAuth: true,
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    // Si es 400, intentar devolver el error original para detectar conflictos
    if (res.status === 400) {
      try {
        const errorText = await res.text();
        const errorData = JSON.parse(errorText);
        
        // Si hay error de países asociados, devolver el error estructurado
        if (errorData.errors && Array.isArray(errorData.errors)) {
          const countryError = errorData.errors.find((err: any) => err.code === 'COUNTRIES_ALREADY_ASSOCIATED');
          if (countryError) {
            return {
              error: true,
              status: 400,
              message: countryError.reason || 'Países ya asociados',
              data: null,
              errorType: 'COUNTRIES_ALREADY_ASSOCIATED',
              originalError: errorData
            } as any;
          }
        }
      } catch (parseError) {
        // Si no se puede parsear, usar el manejo normal
        return handleApiServerError(res);
      }
    }
    return handleApiServerError(res);
  }  revalidateTag("regions");
  return buildApiResponseAsync<Region>(res);
}

export async function updateRegion(id: number, data: Partial<RegionFormData>): Promise<ApiResponse<Region | null>> {
  const res = await nextAuthFetch({
    url: backendRoutes.regions.update(id),
    method: "PUT",
    data: JSON.stringify(data),
    useAuth: true,
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    if (res.status === 404) {
      return { data: null, status: 404, error: true, message: 'Región no encontrada' };
    }
    
    // Si es 400, intentar devolver el error original para detectar conflictos
    if (res.status === 400) {
      try {
        const errorText = await res.text();
        const errorData = JSON.parse(errorText);
        
        // Si hay error de países asociados, devolver el error estructurado
        if (errorData.errors && Array.isArray(errorData.errors)) {
          const countryError = errorData.errors.find((err: any) => err.code === 'COUNTRIES_ALREADY_ASSOCIATED');
          if (countryError) {
            return {
              error: true,
              status: 400,
              message: countryError.reason || 'Países ya asociados',
              data: null,
              errorType: 'COUNTRIES_ALREADY_ASSOCIATED',
              originalError: errorData
            } as any;
          }
        }
      } catch (parseError) {
        // Si no se puede parsear, usar el manejo normal
        return handleApiServerError(res);
      }
    }
    
    return handleApiServerError(res);
  }  revalidateTag("regions");
  return buildApiResponseAsync<Region>(res);
}

export async function deleteRegion(id: number): Promise<ApiResponse<boolean>> {
  const res = await nextAuthFetch({
    url: backendRoutes.regions.delete(id),
    method: "DELETE",
    useAuth: true,
    data: JSON.stringify({ id }),
    contentType: "application/json",
  });

  if (!res.ok) {
    if (res.status === 404) {
      return { data: false, status: 404, error: true, message: 'Región no encontrada' };
    }
    return handleApiServerError(res);
  }
  revalidateTag("regions");

  return { data: true, status: 200, error: false };
}

// Note: These functions might need backend endpoints if needed in the future
export async function resolveRegionByCountry(countryCode: string): Promise<ApiResponse<RegionResolution | null>> {
  // TODO: Implement when backend endpoint is available
  // For now, return a basic response or implement via getRegions + client-side filtering
  return { data: null, status: 404, error: true, message: 'Función no implementada - requerida endpoint del backend' };
}

/* export async function getRegionStats(): Promise<ApiResponse<RegionStats>> {
  // TODO: Implement when backend endpoint is available
  // For now, return basic stats or implement via getRegions + client-side calculation
  const regionsResponse = await getRegions();
  if (regionsResponse.error || !regionsResponse.data) {
    return { data: { total: 0, active: 0, inactive: 0, withCountries: 0, withCurrencies: 0 }, status: 200, error: false };
  }

  const regions = regionsResponse.data.data || []; // Get the actual array from PaginatedResponse
  const stats: RegionStats = {
    total: regions.length,
    active: regions.filter(r => r.status === 'active').length,
    inactive: regions.filter(r => r.status === 'inactive').length,
    withCountries: regions.filter(r => r.countries && r.countries.length > 0).length,
    withCurrencies: 0, // TODO: Add currency information when available from backend
  };

  return { data: stats, status: 200, error: false };
} */
