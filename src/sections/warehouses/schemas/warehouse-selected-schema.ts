import { z } from "zod";
import { WAREHOUSE_TYPE_ROUTE_ENUM } from "../constants/warehouse-type";

export const warehouseOriginSelectedSchema = z.object({
  warehouseOriginId: z
    .number({ required_error: "Almacén de origen es requerido" })
    .refine((val) => val > 0, {
      message: "Almacén de origen es requerido",
    }),

  type: z.enum(Object.keys(WAREHOUSE_TYPE_ROUTE_ENUM) as [string, ...string[]], {
    errorMap: () => {
      return { message: "Tipo de almacén inválido" };
    },
  }),
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
