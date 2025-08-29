import { z } from "zod";
import { productVariants } from "./inventory-provider.schema";

export const InventoryStoreSchema = z.object({
  /* inmutable */
  id: z.number().optional(),
  parentProductName: z.string(),
  warehouseName: z.string(),
  supplierName: z.string(),
  storeName: z.string(),
  supplierId: z.number(),
  storeId: z.number(),
  warehouseId: z.number(),
  parentProductId: z.number(),
  /* adapter data */
  products: z.array(productVariants),
});

export type InventoryStoreFormData = z.infer<typeof InventoryStoreSchema>;
