import { featureSchema } from "@/sections/categories/schemas/category-schema";
import { detailsArrayToObject } from "@/utils/format";
import { z } from "zod";

export const inventoryProviderArraySchema = z
  .array(
    z.object({
      storeId: z.number({}),
      warehouseIds: z.array(z.number({ required_error: "Requerido" })),
      warehousePhysicalIds: z.array(z.number()),
      productVariants: z.array(
        z.object({
          details: z
            .union([
              // Acepta el array original
              z
                .array(
                  z.object({
                    name: z.string(),
                    value: z.string(),
                  })
                )
                .min(1, "Es requerido al menos una característica"),
              // Acepta el objeto transformado
              z.record(z.string()),
            ])

            .transform((details) => {
              // Si ya es un objeto, lo devolvemos tal cual
              if (typeof details === "object" && !Array.isArray(details)) {
                return details;
              }
              // Si es un array, lo transformamos
              return detailsArrayToObject(
                (details as Array<{ name: string; value: string }>)?.map(
                  (d) => ({
                    key: d?.name,
                    value: d?.value,
                  })
                )
              );
            }),
          quantity: z
            .number({ required_error: "Requerido" })
            .min(1, "La cantidad debe ser al menos 1")
            .default(1),
          price: z.number({ required_error: "Requerido" }).min(1,'El precio es requerido').default(0),
          discountType: z.number({ required_error: "Requerido" }).default(0),//todo definir que es
          discountValue: z.number({ required_error: "Requerido" }).default(0),
          purchaseLimit: z.number({ required_error: "Requerido" }).default(0),
          isPrime: z.boolean().default(true),
          warranty: z.object({
            isWarranty: z.boolean().default(true),
            warrantyPrice: z.number({ required_error: "Requerido" }).default(0),
            warrantyTime: z.number({ required_error: "Requerido" }).default(0),
          }),
          packageDelivery: z.boolean().default(false),
        })
      ),
    })
  )
  .min(1, "Debes seleccionar al menos una tienda")
  .transform((array) => {
    return array.map((item) => {
      // Combinar warehouseIds y warehousePhysicalIds, eliminando duplicados
      const combinedWarehouseIds = [
        ...item.warehouseIds,
        ...item.warehousePhysicalIds,
      ].filter((id, index, array) => array.indexOf(id) === index);

      return {
        ...item,
        warehouseIds: combinedWarehouseIds,
      };
    });
  });

export const inventoryProviderSchema = z.object({
  storesWarehouses: inventoryProviderArraySchema,
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
