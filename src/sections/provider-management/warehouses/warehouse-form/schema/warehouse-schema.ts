import { z } from "zod";

// Esquema para reglas de almacenes virtuales
const virtualWarehouseRulesSchema = z
  .object({
    allowsManualInventory: z.boolean().default(true),
    autoTransferAfterDays: z.number().optional(),
    requiresApprovalToExit: z.boolean().default(false),
    maxDaysInStorage: z.number().optional(),
    restrictedToSuppliers: z.array(z.number()).optional(),
    requiresInspection: z.boolean().default(false),
    allowsCrossDocking: z.boolean().default(true),
    priorityLevel: z.enum(["low", "medium", "high"]).default("low"),
    notificationRules: z
      .object({
        notifyOnEntry: z.boolean().default(false),
        notifyOnExit: z.boolean().default(false),
        notifyBeforeExpiry: z.boolean().default(false),
        daysByforeExpiryAlert: z.number().default(0),
      })
      .default({
        notifyOnEntry: false,
        notifyOnExit: false,
        notifyBeforeExpiry: false,
        daysByforeExpiryAlert: 0,
      }),
  })
  .optional();

// Esquema principal del formulario de almacén
export const warehouseFormSchema = z
  .object({
    name: z.string().min(1, "El nombre del almacén es requerido"),
    type: z.enum(["physical", "virtual"]),
    status: z.enum(["active", "inactive", "maintenance"]),
    description: z.string().optional(),

    // Campos para almacenes físicos
    maxCapacity: z.number().positive().optional(),
    currentCapacity: z.number().min(0).optional(),

    // Información del gestor
    managerName: z.string().optional(),
    managerEmail: z
      .string()
      .email("Email inválido")
      .optional()
      .or(z.literal("")),
    managerPhone: z.string().optional(),
    // Información de ubicación
    locationId: z.number().positive("La ubicación es requerida"),
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    postalCode: z.string().optional(),
    coordinates: z
      .object({
        latitude: z.number(),
        longitude: z.number(),
      })
      .optional(),

    // Campos específicos para almacenes virtuales
    virtualSubType: z
      .enum([
        "in_transit",
        "inspection",
        "repair",
        "customer_reserved",
        "damaged_goods",
        "quarantine",
        "staging",
        "returns",
        "supplier_managed",
        "general",
      ] as const)
      .optional(),
    virtualRules: virtualWarehouseRulesSchema,
    linkedPhysicalWarehouseId: z.number().optional(),
    supplierId: z.number().optional(), // Para almacenes virtuales gestionados por proveedores
  })
  .refine(
    (data) => {
      // Validaciones condicionales
      if (data.type === "physical") {
        return data.maxCapacity !== undefined;
      }
      if (data.type === "virtual") {
        return data.virtualSubType !== undefined;
      }
      return true;
    },
    {
      message:
        "Los campos requeridos según el tipo de almacén deben estar completos",
      path: ["type"],
    }
  );

export type WarehouseFormValues = z.infer<typeof warehouseFormSchema>;

// Valores por defecto del formulario
export const defaultWarehouseFormValues: WarehouseFormValues = {
  name: "",
  type: "physical",
  status: "active",
  description: "",
  maxCapacity: undefined,
  currentCapacity: 0,
  managerName: "",
  managerEmail: "",
  managerPhone: "",
  locationId: 1,
  address: "",
  city: "",
  state: "",
  country: "",
  postalCode: "",
  coordinates: undefined,
  virtualSubType: "general",
  virtualRules: {
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
  linkedPhysicalWarehouseId: undefined,
  supplierId: undefined,
};

// Función para transformar datos del formulario al formato de la API
export const transformToApiFormat = (data: WarehouseFormValues) => {
  const baseData = {
    name: data.name,
    type: data.type,
    status: data.status,
    description: data.description,
    locationId: data.locationId,
    managerName: data.managerName,
    managerEmail: data.managerEmail,
    managerPhone: data.managerPhone,
  };

  if (data.type === "physical") {
    return {
      ...baseData,
      maxCapacity: data.maxCapacity,
      currentCapacity: data.currentCapacity || 0,
    };
  } else {
    return {
      ...baseData,
      virtualSubType: data.virtualSubType,
      virtualRules: data.virtualRules,
      linkedPhysicalWarehouseId: data.linkedPhysicalWarehouseId,
      supplierId: data.supplierId,
    };
  }
};
