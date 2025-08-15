// Constantes para almacenes virtuales - HU-005
export const VIRTUAL_WAREHOUSE_SUBTYPES = {
  in_transit: {
    id: 'in_transit',
    name: 'En Tránsito',
    description: 'Inventario en movimiento entre ubicaciones',
    icon: '🚛',
    defaultRules: {
      allowsManualInventory: false,
      autoTransferAfterDays: 7,
      requiresApprovalToExit: false,
      requiresInspection: false,
      allowsCrossDocking: true,
      priorityLevel: 'high' as const,
      notificationRules: {
        notifyOnEntry: true,
        notifyOnExit: true,
        notifyBeforeExpiry: false,
        daysByforeExpiryAlert: 0,
      },
    },
  },
  inspection: {
    id: 'inspection',
    name: 'En Inspección',
    description: 'Productos en proceso de control de calidad',
    icon: '🔍',
    defaultRules: {
      allowsManualInventory: true,
      requiresApprovalToExit: true,
      requiresInspection: true,
      allowsCrossDocking: false,
      priorityLevel: 'medium' as const,
      notificationRules: {
        notifyOnEntry: true,
        notifyOnExit: true,
        notifyBeforeExpiry: true,
        daysByforeExpiryAlert: 5,
      },
    },
  },
  repair: {
    id: 'repair',
    name: 'En Reparación',
    description: 'Productos dañados en proceso de reparación',
    icon: '🔧',
    defaultRules: {
      allowsManualInventory: true,
      requiresApprovalToExit: true,
      requiresInspection: true,
      allowsCrossDocking: false,
      priorityLevel: 'low' as const,
      notificationRules: {
        notifyOnEntry: true,
        notifyOnExit: true,
        notifyBeforeExpiry: false,
        daysByforeExpiryAlert: 0,
      },
    },
  },
  customer_reserved: {
    id: 'customer_reserved',
    name: 'Reservado Cliente',
    description: 'Inventario reservado para clientes específicos',
    icon: '👤',
    defaultRules: {
      allowsManualInventory: false,
      requiresApprovalToExit: true,
      requiresInspection: false,
      allowsCrossDocking: false,
      priorityLevel: 'high' as const,
      notificationRules: {
        notifyOnEntry: true,
        notifyOnExit: true,
        notifyBeforeExpiry: true,
        daysByforeExpiryAlert: 3,
      },
    },
  },
  damaged_goods: {
    id: 'damaged_goods',
    name: 'Mercancía Dañada',
    description: 'Productos dañados pendientes de evaluación',
    icon: '⚠️',
    defaultRules: {
      allowsManualInventory: true,
      requiresApprovalToExit: true,
      requiresInspection: true,
      allowsCrossDocking: false,
      priorityLevel: 'low' as const,
      notificationRules: {
        notifyOnEntry: true,
        notifyOnExit: true,
        notifyBeforeExpiry: false,
        daysByforeExpiryAlert: 0,
      },
    },
  },
  quarantine: {
    id: 'quarantine',
    name: 'En Cuarentena',
    description: 'Productos aislados por precaución sanitaria',
    icon: '🚫',
    defaultRules: {
      allowsManualInventory: false,
      requiresApprovalToExit: true,
      requiresInspection: true,
      allowsCrossDocking: false,
      priorityLevel: 'high' as const,
      notificationRules: {
        notifyOnEntry: true,
        notifyOnExit: true,
        notifyBeforeExpiry: true,
        daysByforeExpiryAlert: 7,
      },
    },
  },
  staging: {
    id: 'staging',
    name: 'Área de Montaje',
    description: 'Zona de preparación y ensamblaje de productos',
    icon: '📦',
    defaultRules: {
      allowsManualInventory: true,
      requiresApprovalToExit: false,
      requiresInspection: false,
      allowsCrossDocking: true,
      priorityLevel: 'medium' as const,
      notificationRules: {
        notifyOnEntry: false,
        notifyOnExit: false,
        notifyBeforeExpiry: false,
        daysByforeExpiryAlert: 0,
      },
    },
  },
  returns: {
    id: 'returns',
    name: 'Devoluciones',
    description: 'Productos devueltos pendientes de procesamiento',
    icon: '↩️',
    defaultRules: {
      allowsManualInventory: true,
      requiresApprovalToExit: true,
      requiresInspection: true,
      allowsCrossDocking: false,
      priorityLevel: 'medium' as const,
      notificationRules: {
        notifyOnEntry: true,
        notifyOnExit: true,
        notifyBeforeExpiry: true,
        daysByforeExpiryAlert: 5,
      },
    },
  },
  supplier_managed: {
    id: 'supplier_managed',
    name: 'Gestionado por Proveedor',
    description: 'Almacén virtual gestionado directamente por el proveedor',
    icon: '🏢',
    defaultRules: {
      allowsManualInventory: false,
      requiresApprovalToExit: false,
      requiresInspection: false,
      allowsCrossDocking: true,
      priorityLevel: 'medium' as const,
      notificationRules: {
        notifyOnEntry: false,
        notifyOnExit: false,
        notifyBeforeExpiry: true,
        daysByforeExpiryAlert: 7,
      },
    },
  },
  general: {
    id: 'general',
    name: 'Propósito General',
    description: 'Almacén virtual para uso general sin restricciones específicas',
    icon: '📋',
    defaultRules: {
      allowsManualInventory: true,
      requiresApprovalToExit: false,
      requiresInspection: false,
      allowsCrossDocking: true,
      priorityLevel: 'medium' as const,
      notificationRules: {
        notifyOnEntry: false,
        notifyOnExit: false,
        notifyBeforeExpiry: false,
        daysByforeExpiryAlert: 0,
      },
    },
  },
} as const;

// Opciones para selects
export const VIRTUAL_SUBTYPE_OPTIONS = Object.values(VIRTUAL_WAREHOUSE_SUBTYPES).map(subtype => ({
  id: subtype.id,
  name: subtype.name,
  description: subtype.description,
  icon: subtype.icon,
}));

// Niveles de prioridad
export const PRIORITY_LEVELS = [
  { id: 'low', name: 'Baja', color: 'text-gray-600' },
  { id: 'medium', name: 'Media', color: 'text-yellow-600' },
  { id: 'high', name: 'Alta', color: 'text-red-600' },
] as const;

// Utilidades
export const getVirtualSubtypeConfig = (subType: string) => {
  return VIRTUAL_WAREHOUSE_SUBTYPES[subType as keyof typeof VIRTUAL_WAREHOUSE_SUBTYPES];
};

export const getDefaultRulesForSubtype = (subType: string) => {
  const config = getVirtualSubtypeConfig(subType);
  return config?.defaultRules || null;
};
