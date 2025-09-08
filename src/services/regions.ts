import { ApiResponse } from '@/types/fetch/api';
import { Region, RegionFormData } from '@/types/regions';

// Local minimal types for service responses used only in this mock service.
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

// Datos mock para desarrollo
const mockRegions: Region[] = [
  {
    id: 1,
    code: 'LATAM',
    name: 'América Latina',
    description: 'Región de América Latina y Caribe',
    status: 'active',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    countries: [
      { id: 1, name: 'México', code: 'MX' },
      { id: 2, name: 'Colombia', code: 'CO' },
      { id: 3, name: 'Brasil', code: 'BR' },
    ],
  },
  {
    id: 2,
    code: 'EU',
    name: 'Unión Europea',
    description: 'Países miembros de la Unión Europea',
    status: 'active',
    createdAt: '2024-01-16T10:00:00Z',
    updatedAt: '2024-01-16T10:00:00Z',
    countries: [
      { id: 4, name: 'España', code: 'ES' },
      { id: 5, name: 'Francia', code: 'FR' },
      { id: 6, name: 'Alemania', code: 'DE' },
    ],
  },
  {
    id: 3,
    code: 'NA',
    name: 'América del Norte',
    description: 'Estados Unidos, Canadá y México',
    status: 'inactive',
    createdAt: '2024-01-17T10:00:00Z',
    updatedAt: '2024-01-17T10:00:00Z',
    countries: [
      { id: 7, name: 'Estados Unidos', code: 'US' },
      { id: 8, name: 'Canadá', code: 'CA' },
      { id: 1, name: 'México', code: 'MX' },
    ],
  },
];

// Funciones CRUD básicas
export async function getRegions(filters?: RegionFilters): Promise<ApiResponse<Region[]>> {
  await new Promise(resolve => setTimeout(resolve, 300));

  let filtered = [...mockRegions];

  if (filters?.status) {
    filtered = filtered.filter(r => r.status === filters.status);
  }

  if (filters?.search) {
    const search = filters.search.toLowerCase();
    filtered = filtered.filter(r =>
      r.name.toLowerCase().includes(search) ||
      r.code.toLowerCase().includes(search) ||
      r.description?.toLowerCase().includes(search)
    );
  }

  return { data: filtered, status: 200, error: false };
}

export async function getRegionById(id: number): Promise<ApiResponse<Region | null>> {
  await new Promise(resolve => setTimeout(resolve, 200));

  const region = mockRegions.find(r => r.id === id);
  if (!region) {
    return { data: null, status: 404, error: true, message: 'Región no encontrada' };
  }
  // Return the region object; mockRegions already contains countries
  return { data: region, status: 200, error: false };
}

export async function createRegion(data: RegionFormData): Promise<ApiResponse<Region | null>> {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Basic validation and normalization for code
  if (!data.code || !data.code.toString().trim()) {
    return { data: null, status: 400, error: true, message: 'Código inválido' };
  }
  const normalizedCode = data.code.toString().trim().toUpperCase();

  // Validar código único
  const existing = mockRegions.find(r => r.code.toUpperCase() === normalizedCode);
  if (existing) {
    return { data: null, status: 400, error: true, message: 'El código de región ya existe' };
  }

  // Get countries data for the selected IDs
  const countriesResponse = await import('./countries').then(mod => mod.getCountries());
  const allCountries = countriesResponse.data || [];
  const selectedCountries = data.countryIds 
    ? allCountries.filter(c => data.countryIds.includes(c.id)).map(c => ({ id: c.id, name: c.name, code: c.code }))
    : [];

  const newRegion: Region = {
    id: mockRegions.length ? Math.max(...mockRegions.map(r => r.id)) + 1 : 1,
    code: normalizedCode,
    name: data.name,
    description: data.description,
    status: data.status,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    countries: selectedCountries,
  };

  console.debug('[mock] createRegion', { incoming: data, selectedCountries: selectedCountries.length });

  mockRegions.push(newRegion);
  return { data: newRegion, status: 201, error: false };
}

export async function updateRegion(id: number, data: Partial<RegionFormData>): Promise<ApiResponse<Region | null>> {
  await new Promise(resolve => setTimeout(resolve, 400));

  const index = mockRegions.findIndex(r => r.id === id);
  if (index === -1) {
    return { data: null, status: 404, error: true, message: 'Región no encontrada' };
  }

  // Validar código único si se está cambiando
  if (data.code) {
    const normalized = data.code.toString().trim().toUpperCase();
    const existing = mockRegions.find(r => r.id !== id && r.code.toUpperCase() === normalized);
    if (existing) {
      return { data: null, status: 400, error: true, message: 'El código de región ya existe' };
    }
  }

  // Get countries data for the selected IDs if countryIds is provided
  let selectedCountries = mockRegions[index].countries;
  if (data.countryIds !== undefined) {
    const countriesResponse = await import('./countries').then(mod => mod.getCountries());
    const allCountries = countriesResponse.data || [];
    selectedCountries = data.countryIds 
      ? allCountries.filter(c => data.countryIds!.includes(c.id)).map(c => ({ id: c.id, name: c.name, code: c.code }))
      : [];
  }

  const updatedRegion: Region = {
    ...mockRegions[index],
    ...data,
    code: data.code ? data.code.toString().trim().toUpperCase() : mockRegions[index].code,
    updatedAt: new Date().toISOString(),
    countries: selectedCountries,
  };

  console.debug('[mock] updateRegion', { id, incoming: data, selectedCountries: selectedCountries?.length });

  mockRegions[index] = updatedRegion;
  return { data: updatedRegion, status: 200, error: false };
}

export async function deleteRegion(id: number): Promise<ApiResponse<boolean>> {
  await new Promise(resolve => setTimeout(resolve, 300));

  const index = mockRegions.findIndex(r => r.id === id);
  if (index === -1) {
    return { data: false, status: 404, error: true, message: 'Región no encontrada' };
  }

  // Soft delete
  mockRegions[index].status = 'deleted';
  mockRegions[index].updatedAt = new Date().toISOString();

  return { data: true, status: 200, error: false };
}

// Resolución rápida por país
export async function resolveRegionByCountry(countryCode: string): Promise<ApiResponse<RegionResolution | null>> {
  await new Promise(resolve => setTimeout(resolve, 100));

  // Mock: asignar países a regiones
  const countryRegionMap: Record<string, number> = {
    'MX': 1, 'CO': 1, 'BR': 1, // LATAM
    'ES': 2, 'FR': 2, 'DE': 2, // EU
    'US': 3, 'CA': 3, // NA
  };

  const regionId = countryRegionMap[countryCode.toUpperCase()];
  if (!regionId) {
    return { data: null, status: 404, error: true, message: 'País no asignado a ninguna región' };
  }

  const region = mockRegions.find(r => r.id === regionId);
  if (!region || region.status !== 'active') {
    return { data: null, status: 404, error: true, message: 'Región no encontrada o inactiva' };
  }

  const resolution: RegionResolution = {
    region,
    primaryCurrency: 'USD',
    enabledPaymentGateways: [
      { gatewayId: 1, priority: 1, isFallback: false },
    ],
    enabledShippingMethods: [
      { methodId: 1, metadata: { carrier: 'DHL', costo_base: 10 } },
    ],
  };

  return { data: resolution, status: 200, error: false };
}

// Estadísticas
export async function getRegionStats(): Promise<ApiResponse<RegionStats>> {
  await new Promise(resolve => setTimeout(resolve, 200));

  const stats: RegionStats = {
    total: mockRegions.length,
    active: mockRegions.filter(r => r.status === 'active').length,
    inactive: mockRegions.filter(r => r.status === 'inactive').length,
    withCountries: mockRegions.filter(r => r.id <= 3).length, // Mock
    withCurrencies: mockRegions.filter(r => r.id <= 2).length, // Mock
  };

  return { data: stats, status: 200, error: false };
}
