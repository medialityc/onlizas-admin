import { WarehouseFormData } from "@/sections/warehouses/schemas/warehouse-schema";
import { PaginatedResponse } from "./common";

export type WarehouseType = "physical" | "virtual";

// Subtipos específicos para almacenes virtuales (HU-005)
export type VirtualWarehouseSubType =
  | "in_transit" // En tránsito (HU-011, HU-013)
  | "inspection" // En proceso de inspección
  | "repair" // En reparación
  | "customer_reserved" // Reservado para clientes específicos
  | "damaged_goods" // Mercancía dañada
  | "quarantine" // En cuarentena
  | "staging" // Área de preparación/montaje
  | "returns" // Devoluciones pendientes
  | "supplier_managed" // Gestionado por proveedor (HU-023)
  | "general"; // Propósito general

export type WarehouseStatus = "active" | "inactive" | "maintenance";

export type Location = {
  id: number;
  country: string;
  region: string;
  zone: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  postalCode?: string;
  address?: string;
};

// Reglas de negocio específicas para almacenes virtuales (HU-005)
export type VirtualWarehouseRules = {
  allowsManualInventory: boolean; // Permite gestión manual de inventario
  autoTransferAfterDays?: number; // Auto-transferir después de X días
  requiresApprovalToExit: boolean; // Requiere aprobación para sacar inventario (HU-012)
  maxDaysInStorage?: number; // Máximo días que puede estar el inventario
  restrictedToSuppliers?: number[]; // Solo ciertos proveedores pueden usar (HU-023)
  requiresInspection: boolean; // Requiere inspección antes de mover
  allowsCrossDocking: boolean; // Permite cross-docking (entrada/salida directa)
  priorityLevel: "low" | "medium" | "high"; // Nivel de prioridad para transferencias
  notificationRules: {
    notifyOnEntry: boolean; // Notificar al entrar inventario
    notifyOnExit: boolean; // Notificar al salir inventario
    notifyBeforeExpiry: boolean; // Notificar antes de vencimiento
    daysByforeExpiryAlert: number; // Días antes del vencimiento para alertar
  };
};

export type Warehouse = {
  id: string;
  name: string;
  type: WarehouseType;
  status: WarehouseStatus;
  locationId: number;
  location?: Location;
  maxCapacity?: number;
  currentCapacity?: number;
  description?: string;
  supplierId?: number;
  managerName?: string;
  managerEmail?: string;
  managerPhone?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string; // eliminación lógica
  isDeleted?: boolean; // flag lógico

  // === CAMPOS ESPECÍFICOS PARA ALMACENES VIRTUALES (HU-005) ===
  virtualSubType?: VirtualWarehouseSubType; // Solo para type='virtual'
  virtualRules?: VirtualWarehouseRules; // Reglas específicas del subtipo
  linkedPhysicalWarehouseId?: number; // Almacén físico relacionado
  linkedPhysicalWarehouse?: Warehouse; // Datos del almacén físico (populate)

  // === CAMPOS CALCULADOS POR BACKEND (BFF) ===
  // Permisos y acciones disponibles determinadas por el backend
  permissions?: {
    canEdit: boolean;
    canDelete: boolean;
    canDeactivate: boolean;
    canActivate: boolean;
    canViewDetails: boolean;
    // Permisos específicos para almacenes virtuales
    canConfigureRules?: boolean; // Puede configurar reglas de negocio
    canLinkPhysical?: boolean; // Puede vincular almacén físico
    canManageTransfers?: boolean; // Puede gestionar transferencias (HU-011)
  };
  // Información adicional para reglas de negocio
  hasActiveInventory?: boolean; // Determina si tiene inventario activo
  occupancyPercentage?: number; // Calculado por el backend
  canBeDeleted?: boolean; // Regla de negocio calculada por backend
  canBeDeactivated?: boolean; // Regla de negocio calculada por backend

  // === MÉTRICAS Y ESTADÍSTICAS (para futuras HUs) ===
  metrics?: {
    totalTransfersIn?: number; // Total transferencias de entrada
    totalTransfersOut?: number; // Total transferencias de salida
    averageStayDays?: number; // Promedio días de permanencia
    lastTransferDate?: string; // Última transferencia realizada
  };
};

export type CreateWarehouse = Omit<
  Warehouse,
  "id" | "createdAt" | "updatedAt" | "location"
>;

export type UpdateWarehouse = Partial<CreateWarehouse>;

export type WarehouseFilter = {
  search?: string;
  type?: WarehouseType;
  status?: WarehouseStatus;
  locationId?: number | string;
  supplierId?: number | string;
};

export type GetAllWarehouses = PaginatedResponse<WarehouseFormData>;

// Tipos para inventario
export type InventoryStatus =
  | "available"
  | "reserved"
  | "damaged"
  | "expired"
  | "transferred";

export type ProductBatch = {
  id: number | string;
  batchNumber: string;
  expirationDate?: string;
  manufacturingDate?: string;
  quantity: number;
  status: InventoryStatus;
};

export type InventoryItem = {
  id: number | string;
  productId: number | string;
  warehouseId: number | string;
  supplierId: number | string;
  totalQuantity: number;
  availableQuantity: number;
  reservedQuantity: number;
  damagedQuantity: number;
  batches: ProductBatch[];
  lastUpdate: string;
  product?: {
    id: number | string;
    name: string;
    upcCode?: string;
    npnCode?: string;
    categoryId: number | string;
    categoryName?: string;
  };
  warehouse?: Warehouse;
  supplier?: {
    id: number | string;
    name: string;
  };
};

export type InventoryFilter = {
  search?: string;
  warehouseId?: number | string;
  supplierId?: number | string;
  productId?: number | string;
  status?: InventoryStatus;
  availability?: "available" | "low_stock" | "out_of_stock";
  expirationDateFrom?: string;
  expirationDateTo?: string;
};

export type GetAllInventory = PaginatedResponse<InventoryItem>;

// Tipos para transferencias
export type TransferStatus =
  | "pending"
  | "in_progress"
  | "in_transit"
  | "delivered"
  | "cancelled"
  | "failed";

export type TransferItem = {
  productId: number | string;
  batchIds: (number | string)[];
  quantity: number;
  notes?: string;
};

export type TransportationService = {
  id: number | string;
  name: string;
  type: "internal" | "external";
  estimatedTime?: string;
  cost?: number;
};

export type Transfer = {
  id: number | string;
  transferNumber: string;
  originId: number | string;
  destinationId: number | string;
  status: TransferStatus;
  requestedBy: string;
  approvedBy?: string;
  items: TransferItem[];
  justification: string;
  estimatedDeliveryDate?: string;
  actualDeliveryDate?: string;
  transportationServiceId?: number | string;
  transportationDetails?: {
    trackingNumber?: string;
    driverName?: string;
    driverPhone?: string;
    vehiclePlate?: string;
    gpsCoordinates?: {
      latitude: number;
      longitude: number;
      timestamp: string;
    };
  };
  documents: {
    id: number | string;
    name: string;
    url: string;
    type: "transfer_guide" | "receipt" | "evidence" | "other";
  }[];
  createdAt: string;
  updatedAt: string;
  sourceWarehouse?: Warehouse;
  destinationWarehouse?: Warehouse;
  transportationService?: TransportationService;
};

export type CreateTransfer = Omit<
  Transfer,
  | "id"
  | "transferNumber"
  | "createdAt"
  | "updatedAt"
  | "sourceWarehouse"
  | "destinationWarehouse"
  | "transportationService"
>;

export type UpdateTransfer = Partial<
  Omit<CreateTransfer, "originId" | "destinationId">
>;

export type TransferFilter = {
  search?: string;
  status?: TransferStatus;
  originId?: number | string;
  destinationId?: number | string;
  requestedBy?: string;
  dateFrom?: string;
  dateTo?: string;
};

export type GetAllTransfers = PaginatedResponse<Transfer>;

// Tipos para localizaciones
export type CreateLocation = Omit<Location, "id">;

export type UpdateLocation = Partial<CreateLocation>;

export type LocationFilter = {
  search?: string;
  country?: string;
  region?: string;
  zone?: string;
};

export type GetAllLocations = PaginatedResponse<Location>;

export type WarehouseAuditLog = {
  id: string | string;
  warehouseId: number | string;
  action: "DELETE" | "DEACTIVATE" | "ACTIVATE";
  at: string;
  by: string;
  reason?: string;
};

export interface IWarehouseMetric {
  totalPhysicalWarehouses: number;
  totalVirtualWarehouses: number;
  totalCurrentStock: number;
  totalStockValue: number;
  calculatedAt: Date;
}
