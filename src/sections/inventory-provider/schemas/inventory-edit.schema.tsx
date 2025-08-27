import { z } from "zod";
import { productVariants } from "./inventory-provider.schema";

export const InventoryStoreSchema = z.object({
  /* inmutable */
  parentProductName: z.string(),
  warehouseName: z.string(),
  supplierName: z.string(),
  storeName: z.string(),
  supplierId: z.number(),
  storeId: z.number(),
  warehouseId: z.number(),
  parentProductId: z.number(),

  /* adapter data */
  products: productVariants,
});

export type InventoryStoreFormData = z.infer<typeof InventoryStoreSchema>;
