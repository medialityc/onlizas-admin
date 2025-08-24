import { featureSchema } from "@/sections/categories/schemas/category-schema";
import { z } from "zod";


// todo mejorar validaciones al final
export const inventoryProviderArraySchema = z
  .array(
    z.object({
      /*   productId: z.number({ required_error: "Requerido" }),
      supplierId: z.number({ required_error: "Requerido" }), */
      storeId: z.number(),
      warehouseIds: z.array(z.number()),
      // .min(1, "Debes seleccionar al menos un almacén"),
      productVariants: z.array(
        z.object({
          details: z.array(
            z.object({
              name: z.string(),
              value: z.string(),
            })
          ),
          quantity: z.number().default(0),
          price: z.number().default(0),
          discountType: z.number().default(0),
          discountValue: z.number().default(0),
          purchaseLimit: z.number().default(0),
          isPrime: z.boolean().default(true),
          warranty: z.object({
            isWarranty: z.boolean().default(true),
            warrantyPrice: z.number().default(0),
            warrantyTime: z.number().default(0),
          }),
          packageDelivery: z.boolean().default(false),
        })
      ),
    })
  )
  .min(1, "Debes seleccionar al menos una tienda");

export const inventoryProviderSchema = z.object({
  stores: inventoryProviderArraySchema,
  productId: z.number({ required_error: "Requerido" }),
  supplierId: z.number({ required_error: "Requerido" }),
  categoryFeatures: z.array(featureSchema),
});

export type InventoryProviderStoreSettingItem = {
  id: string;
  storeId: number;
  storeName: string;
  warehouseIds: number[];
};

export type InventoryProviderFormData = z.infer<typeof inventoryProviderSchema>;
