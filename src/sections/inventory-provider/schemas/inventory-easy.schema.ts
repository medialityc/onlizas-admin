import { z } from "zod";

export const inventoryEasySchema = z
  .object({
    supplierId: z.string(),
    productId: z.number(),
    storeId: z.number(),
    physicalWarehouseId: z.number().optional(),
    virtualWarehouseId: z.number().optional(),
    meWarehouse: z.boolean().default(false).optional(),
    isPaqueteria: z.boolean().default(false).optional(),
  })
  .superRefine((data, ctx) => {
    // Si es paquetería, ignoramos meWarehouse y exigimos virtualWarehouseId
    if (data.isPaqueteria) {
      if (!data.virtualWarehouseId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Para paquetería debes seleccionar un almacén internacional",
          path: ["virtualWarehouseId"],
        });
      }
      return; // salimos aquí, no validamos meWarehouse
    }

    // Si no es paquetería: validar meWarehouse o physical
    if (data.meWarehouse) {
      if (!data.virtualWarehouseId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Selecciona un almacén virtual",
          path: ["virtualWarehouseId"],
        });
      }
    } else {
      if (!data.physicalWarehouseId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Selecciona un almacén físico",
          path: ["physicalWarehouseId"],
        });
      }
    }
  });

export type InventoryEasy = z.infer<typeof inventoryEasySchema>;
