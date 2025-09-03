import { z } from "zod";
import { WAREHOUSE_TYPE_ENUM } from "../constants/warehouse-type";

export const warehouseSchema = z
  .object({
    id: z.number().optional(),
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
    capacityUnit: z.string().nullable().optional(),

    // virtual
    virtualTypeId: z.coerce.number().optional(),
    supplierId: z.coerce.number().optional(),
    rules: z.any().optional(),
  })
  .refine(
    (data) => {
      if (data.type === WAREHOUSE_TYPE_ENUM.physical) {
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
      if (data.type === WAREHOUSE_TYPE_ENUM.physical) {
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
      if (
        data.type === WAREHOUSE_TYPE_ENUM.physical &&
        data.capacity !== undefined
      ) {
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
      if (
        data.type === WAREHOUSE_TYPE_ENUM.physical &&
        data.capacityUnit !== undefined
      ) {
        return data?.capacityUnit && data?.capacityUnit?.trim()?.length > 0;
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
      if (data.type === WAREHOUSE_TYPE_ENUM.virtual) {
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
      if (data.type === WAREHOUSE_TYPE_ENUM.virtual) {
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
      if (
        data.type === WAREHOUSE_TYPE_ENUM.virtual &&
        data.virtualTypeId !== undefined
      ) {
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
      if (
        data.type === WAREHOUSE_TYPE_ENUM.virtual &&
        data.supplierId !== undefined
      ) {
        return data.supplierId > 0;
      }
      return true;
    },
    {
      message: "El proveedor debe ser un número válido",
      path: ["supplierId"],
    }
  );

export type WarehouseFormData = z.infer<typeof warehouseSchema> & {
  id?: number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  locationName?: string;
  supplierName?: string;
  virtualTypeName?: string;
  isDeleted?: boolean;
};
