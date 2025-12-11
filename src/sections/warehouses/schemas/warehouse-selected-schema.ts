import { z } from "zod";
import { WAREHOUSE_TYPE_ENUM } from "../constants/warehouse-type";

export const warehouseOriginSelectedSchema = z.object({
  warehouseOriginId: z
    .number({ error: "Almacén de origen es requerido" })
    .refine((val) => val > 0, {
      message: "Almacén de origen es requerido",
    }),

  type: z.nativeEnum(WAREHOUSE_TYPE_ENUM),
});

export type WarehouseOriginSelectedSchema = z.infer<
  typeof warehouseOriginSelectedSchema
> & {
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;
  locationName?: string;
  supplierName?: string;
};
