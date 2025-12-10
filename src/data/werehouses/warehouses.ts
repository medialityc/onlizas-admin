import {
  Warehouse,
  VirtualWarehouseRules,
  VirtualWarehouseSubType,
} from "@/types/warehouses";

// Conjunto de reglas predefinidas por subtipo
export const defaultVirtualRulesBySubType: Record<
  VirtualWarehouseSubType,
  VirtualWarehouseRules
> = {
  in_transit: {
    allowsManualInventory: false,
    autoTransferAfterDays: 5,
    requiresApprovalToExit: true,
    requiresInspection: false,
    allowsCrossDocking: true,
    priorityLevel: "high",
    notificationRules: {
      notifyOnEntry: true,
      notifyOnExit: true,
      notifyBeforeExpiry: true,
      daysByforeExpiryAlert: 1,
    },
  },
  inspection: {
    allowsManualInventory: true,
    requiresApprovalToExit: true,
    requiresInspection: true,
    allowsCrossDocking: false,
    priorityLevel: "medium",
    notificationRules: {
      notifyOnEntry: true,
      notifyOnExit: true,
      notifyBeforeExpiry: false,
      daysByforeExpiryAlert: 0,
    },
  },
  repair: {
    allowsManualInventory: true,
    maxDaysInStorage: 30,
    requiresApprovalToExit: true,
    requiresInspection: true,
    allowsCrossDocking: false,
    priorityLevel: "low",
    notificationRules: {
      notifyOnEntry: true,
      notifyOnExit: true,
      notifyBeforeExpiry: true,
      daysByforeExpiryAlert: 3,
    },
  },
  customer_reserved: {
    allowsManualInventory: true,
    requiresApprovalToExit: true,
    requiresInspection: false,
    allowsCrossDocking: true,
    priorityLevel: "high",
    notificationRules: {
      notifyOnEntry: true,
      notifyOnExit: true,
      notifyBeforeExpiry: false,
      daysByforeExpiryAlert: 0,
    },
  },
  damaged_goods: {
    allowsManualInventory: true,
    maxDaysInStorage: 90,
    requiresApprovalToExit: true,
    requiresInspection: true,
    allowsCrossDocking: false,
    priorityLevel: "low",
    notificationRules: {
      notifyOnEntry: false,
      notifyOnExit: true,
      notifyBeforeExpiry: true,
      daysByforeExpiryAlert: 7,
    },
  },
  quarantine: {
    allowsManualInventory: false,
    maxDaysInStorage: 14,
    requiresApprovalToExit: true,
    requiresInspection: true,
    allowsCrossDocking: false,
    priorityLevel: "medium",
    notificationRules: {
      notifyOnEntry: true,
      notifyOnExit: true,
      notifyBeforeExpiry: true,
      daysByforeExpiryAlert: 2,
    },
  },
  staging: {
    allowsManualInventory: true,
    autoTransferAfterDays: 2,
    requiresApprovalToExit: false,
    requiresInspection: false,
    allowsCrossDocking: true,
    priorityLevel: "high",
    notificationRules: {
      notifyOnEntry: true,
      notifyOnExit: true,
      notifyBeforeExpiry: false,
      daysByforeExpiryAlert: 0,
    },
  },
  returns: {
    allowsManualInventory: true,
    maxDaysInStorage: 30,
    requiresApprovalToExit: true,
    requiresInspection: true,
    allowsCrossDocking: false,
    priorityLevel: "medium",
    notificationRules: {
      notifyOnEntry: true,
      notifyOnExit: false,
      notifyBeforeExpiry: false,
      daysByforeExpiryAlert: 0,
    },
  },
  supplier_managed: {
    allowsManualInventory: false,
    requiresApprovalToExit: true,
    restrictedToSuppliers: [1, 2, 3],
    requiresInspection: true,
    allowsCrossDocking: true,
    priorityLevel: "medium",
    notificationRules: {
      notifyOnEntry: true,
      notifyOnExit: true,
      notifyBeforeExpiry: false,
      daysByforeExpiryAlert: 0,
    },
  },
  general: {
    allowsManualInventory: true,
    requiresApprovalToExit: false,
    requiresInspection: false,
    allowsCrossDocking: true,
    priorityLevel: "low",
    notificationRules: {
      notifyOnEntry: false,
      notifyOnExit: false,
      notifyBeforeExpiry: false,
      daysByforeExpiryAlert: 0,
    },
  },
};

// Lista de subtipos para select input
export const virtualWarehouseSubTypeOptions = [
  { id: "in_transit", name: "En tránsito" },
  { id: "inspection", name: "En inspección" },
  { id: "repair", name: "En reparación" },
  { id: "customer_reserved", name: "Reservado para clientes" },
  { id: "damaged_goods", name: "Mercancía dañada" },
  { id: "quarantine", name: "En cuarentena" },
  { id: "staging", name: "Área de preparación" },
  { id: "returns", name: "Devoluciones" },
  { id: "supplier_managed", name: "Gestionado por proveedor" },
  { id: "general", name: "Propósito general" },
];

// Lista de niveles de prioridad para select input
export const priorityLevelOptions = [
  { id: "low", name: "Baja" },
  { id: "medium", name: "Media" },
  { id: "high", name: "Alta" },
];
