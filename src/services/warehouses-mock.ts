import { ApiResponse } from "@/types/fetch/api";
import { IQueryable } from "@/types/fetch/request";
import {
  CreateWarehouse,
  GetAllWarehouses,
  UpdateWarehouse,
  Warehouse,
  WarehouseAuditLog,
} from "@/types/warehouses";

import { QueryParamsURLFactory } from "@/lib/request";
import { backendRoutes } from "@/lib/endpoint";
import { nextAuthFetch } from "./utils/next-auth-fetch";
import { buildApiResponseAsync, handleApiServerError } from "@/lib/api";

// Mock data - Inicialización de almacenes físicos
const mockWarehouses: Warehouse[] = [
  {
    id: 1,
    name: "Centro de Distribución Principal",
    type: "physical",
    status: "active",
    locationId: 1,
    maxCapacity: 10000,
    currentCapacity: 7500,
    description: "Almacén Físico",
    managerName: "Carlos Rodríguez",
    managerEmail: "carlos.rodriguez@empresa.com",
    managerPhone: "+52 55 1234 5678",
    location: {
      id: 1,
      country: "México",
      region: "CDMX",
      zone: "Centro",
      address: "Av. Industrial 123, Ciudad de México",
      postalCode: "06100",
      coordinates: { latitude: 19.4326, longitude: -99.1332 },
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    // Campos calculados por el backend (BFF)
    permissions: {
      canEdit: true,
      canDelete: false, // No puede eliminar porque tiene inventario
      canDeactivate: true,
      canActivate: false, // Ya está activo
      canViewDetails: true,
    },
    hasActiveInventory: true,
    occupancyPercentage: 75,
    canBeDeleted: false,
    canBeDeactivated: true,
  },
  {
    id: 2,
    name: "Almacén Norte - Monterrey",
    type: "physical",
    status: "active",
    locationId: 2,
    maxCapacity: 5000,
    currentCapacity: 3200,
    description: "Almacén Físico",
    managerName: "Ana García",
    managerEmail: "ana.garcia@empresa.com",
    managerPhone: "+52 81 2345 6789",
    location: {
      id: 2,
      country: "México",
      region: "Nuevo León",
      zone: "Norte",
      address: "Calle Logística 450, Monterrey",
      postalCode: "64000",
      coordinates: { latitude: 25.6866, longitude: -100.3161 },
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    // Campos calculados por el backend (BFF)
    permissions: {
      canEdit: true,
      canDelete: true, // Puede eliminar porque es virtual sin inventario
      canDeactivate: true,
      canActivate: false,
      canViewDetails: true,
    },
    hasActiveInventory: true,
    occupancyPercentage: 64,
    canBeDeleted: false,
    canBeDeactivated: true,
  },
  {
    id: 3,
    name: "Depósito Sur",
    type: "physical",
    status: "maintenance",
    locationId: 3,
    maxCapacity: 3000,
    currentCapacity: 1800,
    description: "Almacén Físico",
    managerName: "Luis Martínez",
    managerEmail: "luis.martinez@empresa.com",
    managerPhone: "+52 55 3456 7890",
    location: {
      id: 3,
      country: "México",
      region: "Guadalajara",
      zone: "Sur",
      address: "Zona Industrial 789, Guadalajara",
      postalCode: "44100",
      coordinates: { latitude: 20.6597, longitude: -103.3496 },
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    // Campos calculados por el backend (BFF)
    permissions: {
      canEdit: true,
      canDelete: false, // No puede eliminar porque tiene mucho inventario
      canDeactivate: false, // No puede desactivar porque está en mantenimiento
      canActivate: true,
      canViewDetails: true,
    },
    hasActiveInventory: true,
    occupancyPercentage: 60,
    canBeDeleted: false,
    canBeDeactivated: false,
  },
  // Almacenes virtuales
  {
    id: 4,
    name: "Almacén TechSupply",
    type: "virtual",
    status: "active",
    locationId: 1,
    description: "Almacén Virtual",
    supplierId: 101,
    virtualSubType: "supplier_managed",
    managerName: "TechSupply Corp",
    managerEmail: "contact@techsupply.com",
    managerPhone: "+52 55 4567 8901",
    location: {
      id: 1,
      country: "México",
      region: "CDMX",
      zone: "Norte",
      address: "Parque Tecnológico 101, Tijuana",
      postalCode: "22000",
      coordinates: { latitude: 32.5149, longitude: -117.0382 },
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    permissions: {
      canEdit: true,
      canDelete: true,
      canDeactivate: true,
      canActivate: false,
      canViewDetails: true,
      canConfigureRules: true,
      canLinkPhysical: true,
      canManageTransfers: true,
    },
    hasActiveInventory: true,
    occupancyPercentage: 75,
    canBeDeleted: false,
    canBeDeactivated: true,
  },
  {
    id: 5,
    name: "Depósito ElectroMax",
    type: "virtual",
    status: "active",
    locationId: 2,
    description: "Almacén Virtual",
    supplierId: 102,
    virtualSubType: "supplier_managed",
    managerName: "ElectroMax SA",
    managerEmail: "contact@electromax.com",
    managerPhone: "+52 55 5678 9012",
    location: {
      id: 2,
      country: "México",
      region: "Puebla",
      zone: "Este",
      address: "Zona Comercial 202, Puebla",
      postalCode: "72000",
      coordinates: { latitude: 19.0414, longitude: -98.2063 },
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    permissions: {
      canEdit: true,
      canDelete: true,
      canDeactivate: true,
      canActivate: false,
      canViewDetails: true,
      canConfigureRules: true,
      canLinkPhysical: true,
      canManageTransfers: true,
    },
    hasActiveInventory: true,
    occupancyPercentage: 60,
    canBeDeleted: false,
    canBeDeactivated: true,
  },
  {
    id: 6,
    name: "Centro HomeGoods",
    type: "virtual",
    status: "inactive",
    locationId: 3,
    description: "Almacén Virtual",
    supplierId: 103,
    virtualSubType: "supplier_managed",
    managerName: "HomeGoods Inc",
    managerEmail: "contact@homegoods.com",
    managerPhone: "+52 55 6789 0123",
    location: {
      id: 3,
      country: "México",
      region: "Querétaro",
      zone: "Centro",
      address: "Boulevard Central 303, Querétaro",
      postalCode: "76000",
      coordinates: { latitude: 20.5888, longitude: -100.3899 },
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    permissions: {
      canEdit: true,
      canDelete: true,
      canDeactivate: false,
      canActivate: true,
      canViewDetails: true,
      canConfigureRules: true,
      canLinkPhysical: true,
      canManageTransfers: false,
    },
    hasActiveInventory: true,
    occupancyPercentage: 62,
    canBeDeleted: false,
    canBeDeactivated: false,
  },
];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper para calcular permisos basado en reglas de negocio (simula BFF)
function calculateWarehousePermissions(
  warehouse: Warehouse
): Warehouse["permissions"] {
  const hasInventory = (warehouse.currentCapacity || 0) > 0;
  const isActive = warehouse.status === "active";
  const isInactive = warehouse.status === "inactive";
  const isMaintenance = warehouse.status === "maintenance";
  const isDeleted = warehouse.isDeleted || false;
  const isVirtual = warehouse.type === "virtual";

  // Permisos básicos para cualquier tipo de almacén
  const basePermissions = {
    canEdit: !isDeleted,
    canDelete: !hasInventory && !isDeleted, // Solo si no tiene inventario
    canDeactivate: isActive && !isDeleted, // Solo si está activo
    canActivate: (isInactive || isMaintenance) && !isDeleted, // Si está inactivo o en mantenimiento
    canViewDetails: true, // Siempre puede ver detalles
  };

  // Agregar permisos específicos para almacenes virtuales
  if (isVirtual) {
    return {
      ...basePermissions,
      canConfigureRules: !isDeleted,
      canLinkPhysical: !isDeleted,
      canManageTransfers: isActive && !isDeleted,
    };
  }

  return basePermissions;
}

// Helper para calcular campos adicionales de negocio
function calculateWarehouseBusinessRules(
  warehouse: Warehouse
): Pick<
  Warehouse,
  | "hasActiveInventory"
  | "occupancyPercentage"
  | "canBeDeleted"
  | "canBeDeactivated"
> {
  const hasInventory = (warehouse.currentCapacity || 0) > 0;
  const occupancy = warehouse.maxCapacity
    ? Math.round(
        ((warehouse.currentCapacity || 0) / warehouse.maxCapacity) * 100
      )
    : 0;

  return {
    hasActiveInventory: hasInventory,
    occupancyPercentage: occupancy,
    canBeDeleted: !hasInventory,
    canBeDeactivated: warehouse.status === "active",
  };
}

// Helper para enriquecer un almacén con permisos y reglas de negocio
function enrichWarehouse(warehouse: Warehouse): Warehouse {
  const permissions = calculateWarehousePermissions(warehouse);
  const businessRules = calculateWarehouseBusinessRules(warehouse);

  return {
    ...warehouse,
    permissions,
    ...businessRules,
  };
}

export async function getAllWarehouses(
  params: IQueryable
): Promise<ApiResponse<GetAllWarehouses>> {
  const url = new QueryParamsURLFactory(
    params,
    backendRoutes.warehouses.list
  ).build();

  const res = await nextAuthFetch({
    url,
    useAuth: true,
    next: { tags: ["warehouses"] },
  });

  if (!res.ok) return handleApiServerError(res);

  return buildApiResponseAsync<GetAllWarehouses>(res);
}

/* export async function getAllWarehouses(
  params: IQueryable & WarehouseFilter
): Promise<ApiResponse<GetAllWarehouses>> {
  await delay(300);
  let list = [...mockWarehouses].filter((warehouse) => !warehouse.isDeleted); // excluir eliminados lógicamente

  if (params.search) {
    const searchTerm = params.search.toLowerCase();
    list = list.filter((warehouse) =>
      warehouse.name.toLowerCase().includes(searchTerm)
    );
  }
  if (params.type)
    list = list.filter((warehouse) => warehouse.type === params.type);
  if (params.status)
    list = list.filter((warehouse) => warehouse.status === params.status);

  // Enriquecer cada almacén con permisos calculados dinámicamente
  const enrichedList = list.map((warehouse) => enrichWarehouse(warehouse));

  const page = params?.pagination?.page || 1;
  const pageSize = params?.pagination?.pageSize || 10;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  const result: GetAllWarehouses = {
    data: enrichedList.slice(start, end),
    totalCount: enrichedList.length,
    page,
    pageSize,
    hasNext: end < enrichedList.length,
    hasPrevious: start > 0,
  };

  return {
    data: result,
    status: 200,
    error: false,
  } as ApiResponse<GetAllWarehouses>;
}
 */
export async function getWarehouseById(
  id: number
): Promise<ApiResponse<Warehouse>> {
  await delay(200);
  const warehouse = mockWarehouses.find((warehouse) => warehouse.id === id);
  if (!warehouse)
    return {
      error: true,
      status: 404,
      message: "Not found",
    } as ApiResponse<Warehouse>;

  // Enriquecer con permisos calculados dinámicamente
  const enrichedWarehouse = enrichWarehouse(warehouse);

  return {
    data: enrichedWarehouse,
    status: 200,
    error: false,
  } as ApiResponse<Warehouse>;
}

export async function createWarehouse(
  data: CreateWarehouse
): Promise<ApiResponse<Warehouse>> {
  await delay(300);
  const id = mockWarehouses.length
    ? Math.max(...mockWarehouses.map((warehouse) => warehouse.id)) + 1
    : 1;
  const newWarehouse: Warehouse = {
    ...data,
    id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    currentCapacity: data.currentCapacity || 0,
  };

  // Enriquecer con permisos antes de añadir
  const enrichedWarehouse = enrichWarehouse(newWarehouse);
  mockWarehouses.push(enrichedWarehouse);

  return {
    data: enrichedWarehouse,
    status: 201,
    error: false,
  } as ApiResponse<Warehouse>;
}

export async function updateWarehouse(
  id: number,
  data: UpdateWarehouse,
  audit: { reason?: string } = {}
): Promise<ApiResponse<Warehouse>> {
  await delay(300);
  const index = mockWarehouses.findIndex((warehouse) => warehouse.id === id);
  if (index === -1)
    return {
      error: true,
      status: 404,
      message: "Not found",
    } as ApiResponse<Warehouse>;

  const originalWarehouse = mockWarehouses[index];
  const originalStatus = originalWarehouse.status;
  const newStatus = data.status;

  const updatedWarehouse = {
    ...originalWarehouse,
    ...data,
    id,
    updatedAt: new Date().toISOString(),
  };

  // Auditoría de cambios de estado
  if (newStatus && originalStatus !== newStatus) {
    let action: "ACTIVATE" | "DEACTIVATE" | undefined;
    if (newStatus === "active" && originalStatus !== "active") {
      action = "ACTIVATE";
    } else if (newStatus === "inactive" && originalStatus !== "inactive") {
      action = "DEACTIVATE";
    }
    if (action) {
      console.log(action);
    }
  }

  // Enriquecer con permisos recalculados y guardar
  const enrichedWarehouse = enrichWarehouse(updatedWarehouse);
  mockWarehouses[index] = enrichedWarehouse;

  return {
    data: enrichedWarehouse,
    status: 200,
    error: false,
  } as ApiResponse<Warehouse>;
}

export async function deleteWarehouse(
  id: number,
  audit: { reason?: string } = {}
): Promise<ApiResponse<{ success: boolean }>> {
  await delay(200);
  const index = mockWarehouses.findIndex((warehouse) => warehouse.id === id);
  if (index === -1)
    return { error: true, status: 404, message: "Not found" } as ApiResponse<{
      success: boolean;
    }>;

  const currentWarehouse = mockWarehouses[index];

  // Validación backend: verificar inventario (simple: currentCapacity > 0)
  if ((currentWarehouse.currentCapacity || 0) > 0) {
    return {
      error: true,
      status: 409,
      message: "WarehouseNotEmpty",
    } as ApiResponse<{ success: boolean }>;
  }

  // Eliminación lógica
  const deletedWarehouse = {
    ...currentWarehouse,
    isDeleted: true,
    deletedAt: new Date().toISOString(),
    status: "inactive" as const,
  };

  mockWarehouses[index] = deletedWarehouse;

  // Registro de auditoría

  return { data: { success: true }, status: 200, error: false } as ApiResponse<{
    success: boolean;
  }>;
}

// Mock data para inventarios simulados
export const mockInventoryData = [
  {
    id: 1,
    productName: "iPhone 15 Pro",
    category: "Smartphones",
    supplier: "TechSupply Corp",
    warehouseId: 1,
    variants: [
      {
        id: 1,
        name: "128GB Titanio Natural",
        available: 25,
        storage: "128GB",
        color: "Titanio Natural",
        price: "$1199.00",
      },
      {
        id: 2,
        name: "256GB Titanio Azul",
        available: 18,
        storage: "256GB",
        color: "Titanio Azul",
        price: "$1299.00",
      },
    ],
    lastUpdated: "2024-01-15",
  },
  {
    id: 2,
    productName: "MacBook Pro 14",
    category: "Laptops",
    supplier: "ElectroMax SA",
    warehouseId: 1,
    variants: [
      {
        id: 3,
        name: "M3 Pro, 512GB",
        available: 12,
        processor: "M3 Pro",
        storage: "512GB",
        price: "$2199.00",
      },
    ],
    lastUpdated: "2024-01-14",
  },
];

// Mock data para transferencias
export const mockTransferData = [
  {
    id: 1,
    productName: "iPhone 15 Pro",
    category: "Smartphones",
    supplier: "TechSupply Corp",
    destinationWarehouse: "Almacén Norte - Monterrey",
    variants: [
      {
        id: 1,
        name: "128GB Titanio Natural",
        available: 25,
        selectedQuantity: 0,
        storage: "128GB",
        color: "Titanio Natural",
      },
      {
        id: 2,
        name: "256GB Titanio Azul",
        available: 18,
        selectedQuantity: 0,
        storage: "256GB",
        color: "Titanio Azul",
      },
    ],
  },
];
