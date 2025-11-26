import { z } from "zod";
import { productVariants } from "./inventory-provider.schema";

export const InventoryStoreSchema = z.object({
  /* inmutable */
  id: z.string().optional(),
  parentProductName: z.string(),
  warehouseName: z.string(),
  supplierName: z.string(),
  storeName: z.string(),
  supplierId: z.string(),
  storeId: z.string(),
  warehouseId: z.number(),
  parentProductId: z.number(),
  /* adapter data */
  products: z.array(productVariants),
  isPacking: z.boolean().readonly(),
  isMayorista: z.boolean().optional().default(false),
});

export type InventoryStoreFormData = z.infer<typeof InventoryStoreSchema>;
