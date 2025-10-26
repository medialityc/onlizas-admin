import { z } from "zod";
import { WAREHOUSE_TYPE_ENUM } from "../constants/warehouse-type";

export const warehouseSchema = z
  .object({
    id: z.string().optional(),
    name: z.string().min(1, "El nombre del almacén es requerido"),
    type: z.enum(Object.keys(WAREHOUSE_TYPE_ENUM) as [string, ...string[]], {
      errorMap: () => {
        return { message: "Tipo de almacén inválido" };
      },
    }),
    locationId: z.string({ required_error: "Requerido" }),
    active: z.boolean().default(true),

    // physical
    capacity: z.coerce.number().optional(),
    capacityUnit: z.string().nullable().optional(),

    // virtual
    virtualTypeId: z.coerce.string().optional().nullable(),
    supplierId: z.string().optional(),
    rules: z.any().optional(),
  })
  .refine(
    (data) => {
      if (data.type === WAREHOUSE_TYPE_ENUM.warehouse) {
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
      if (data.type === WAREHOUSE_TYPE_ENUM.warehouse) {
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
        data.type === WAREHOUSE_TYPE_ENUM.warehouse &&
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
        data.type === WAREHOUSE_TYPE_ENUM.warehouse &&
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
      if (data.type === WAREHOUSE_TYPE_ENUM.virtualwarehouse) {
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
      if (data.type === WAREHOUSE_TYPE_ENUM.virtualwarehouse) {
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
  );

export type WarehouseFormData = z.infer<typeof warehouseSchema> & {
  createdAt?: string | Date;
  updatedAt?: string | Date;
  locationName?: string;
  supplierName?: string;
  virtualTypeName?: string;
  isDeleted?: boolean;
};
