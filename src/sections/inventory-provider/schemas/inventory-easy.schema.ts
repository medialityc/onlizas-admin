import { z } from "zod";

export const inventoryEasySchema = z
  .object({
    supplierId: z.number(),
    productId: z.number(),
    storeId: z.number(),
    physicalWarehouseId: z.number().optional(),
    virtualWarehouseId: z.number().optional(),
    meWarehouse: z.boolean().default(false).optional(),
  })
  .refine(
    (data) =>
      data.physicalWarehouseId !== undefined ||
      data.virtualWarehouseId !== undefined,
    {
      message: "Se requiere physicalWarehouseId o virtualWarehouseId",
      path: ["physicalWarehouseId", "virtualWarehouseId"],
    }
  );

export type InventoryEasy = z.infer<typeof inventoryEasySchema>;
