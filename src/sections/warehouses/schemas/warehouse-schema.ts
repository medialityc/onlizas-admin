import { z } from "zod";
import {
  WAREHOUSE_VIRTUAL_SUBTYPE_ENUM,
  WAREHOUSE_TYPE_ENUM,
} from "../constants/warehouse-type";

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

export const warehouseSchema = z
  .object({
    name: z.string().min(1, "El nombre del almacén es requerido"),
    type: z.enum(Object.keys(WAREHOUSE_TYPE_ENUM) as [string, ...string[]], {
      errorMap: () => {
        return { message: "Tipo de almacén inválido" };
      },
    }),
    locationId: z.number({ required_error: "Requerido" }),
    isActive: z.boolean().default(true),

    // physical
    capacity: z.coerce.number().optional(),
    capacityUnit: z.string().optional(),

    // virtual
    virtualTypeId: z.coerce.number().optional(),
    supplierId: z.coerce.number().optional(),
    rules: z.any().optional(),
  })
  .refine(
    (data) => {
      if (data.type === "physical") {
        return data.capacity !== undefined && data.capacityUnit !== undefined;
      }
      return true;
    },
    {
      message:
        "Capacidad y unidad de capacidad son requeridos para almacenes físicos",
      path: ["capacity"],
    }
  )
  .refine(
    (data) => {
      if (data.type === "physical") {
        return data.capacity !== undefined && data.capacityUnit !== undefined;
      }
      return true;
    },
    {
      message:
        "Capacidad y unidad de capacidad son requeridos para almacenes físicos",
      path: ["capacityUnit"],
    }
  )
  // Validación adicional: capacidad debe ser un número positivo para almacenes físicos
  .refine(
    (data) => {
      if (data.type === "physical" && data.capacity !== undefined) {
        return data.capacity > 0;
      }
      return true;
    },
    {
      message: "La capacidad debe ser un número positivo",
      path: ["capacity"],
    }
  )
  // Validación adicional: unidad de capacidad no debe estar vacía para almacenes físicos
  .refine(
    (data) => {
      if (data.type === "physical" && data.capacityUnit !== undefined) {
        return data.capacityUnit.trim().length > 0;
      }
      return true;
    },
    {
      message: "La unidad de capacidad no puede estar vacía",
      path: ["capacityUnit"],
    }
  )
  .refine(
    (data) => {
      if (data.type === "virtual") {
        return (
          data.virtualTypeId !== undefined && data.supplierId !== undefined
        );
      }
      return true;
    },
    {
      message:
        "Tipo virtual y proveedor son requeridos para almacenes virtuales",
      path: ["virtualTypeId"],
    }
  )
  .refine(
    (data) => {
      if (data.type === "virtual") {
        return (
          data.virtualTypeId !== undefined && data.supplierId !== undefined
        );
      }
      return true;
    },
    {
      message:
        "Tipo virtual y proveedor son requeridos para almacenes virtuales",
      path: ["supplierId"],
    }
  )
  // Validación adicional: virtualTypeId debe ser un número positivo
  .refine(
    (data) => {
      if (data.type === "virtual" && data.virtualTypeId !== undefined) {
        return data.virtualTypeId > 0;
      }
      return true;
    },
    {
      message: "El tipo virtual debe ser un número válido",
      path: ["virtualTypeId"],
    }
  )
  // Validación adicional: supplierId debe ser un número positivo
  .refine(
    (data) => {
      if (data.type === "virtual" && data.supplierId !== undefined) {
        return data.supplierId > 0;
      }
      return true;
    },
    {
      message: "El proveedor debe ser un número válido",
      path: ["supplierId"],
    }
  );

// Esquema principal del formulario de almacén
export const warehouseFormSchema = z
  .object({
    name: z.string().min(1, "El nombre del almacén es requerido"),
    type: z.enum(Object.keys(WAREHOUSE_TYPE_ENUM) as [string, ...string[]], {
      errorMap: () => {
        return { message: "Tipo de almacén inválido" };
      },
    }),
    isActive: z.boolean().default(false),
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
    virtualSubType: z.enum(
      Object.keys(WAREHOUSE_VIRTUAL_SUBTYPE_ENUM) as [string, ...string[]],
      {
        errorMap: () => {
          return { message: "Subtipo de almacén inválido" };
        },
      }
    ),
    virtualRules: virtualWarehouseRulesSchema,
    linkedPhysicalWarehouseId: z.number().optional(),
    supplierId: z.number().optional(), // Para almacenes virtuales gestionados por proveedores
  })
  .refine(
    (data) => {
      if (data.type === WAREHOUSE_TYPE_ENUM.virtual) {
        return data.virtualSubType !== undefined;
      }
      if (data.type === WAREHOUSE_TYPE_ENUM.physical) {
        return data.maxCapacity !== undefined;
      }
      return true;
    },
    {
      message:
        "Los campos requeridos según el tipo de almacén deben estar completos",
      path: ["type"],
    }
  );

export type WarehouseFormData = z.infer<typeof warehouseSchema> & {
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;
};
