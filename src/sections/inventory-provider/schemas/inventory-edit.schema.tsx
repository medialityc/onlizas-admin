import { z } from "zod";
import { productVariants } from "./inventory-provider.schema";

export const InventoryStoreSchema = z.object({
  storeId: z.number({}),
  warehouseId: z.number(),
  products: productVariants,

  /* inmutable */
  parentProductName: z.string(),
  warehouseName: z.string(),
  supplierName: z.string(),
  storeName: z.string(),
});

export type InventoryStoreFormData = z.infer<typeof InventoryStoreSchema>;
