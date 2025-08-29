import { featureSchema } from "@/sections/categories/schemas/category-schema";
import { detailsArrayToObject } from "@/utils/format";
import { z } from "zod";

export const productVariants = z
  .object({
    //only by adapter
    limitPurchaseLimit: z.number().optional(),
    id: z.number(),
    details: z
      .union([
        // Acepta el array original
        z
          .array(
            z.object({
              key: z.string(),
              value: z
                .string({ required_error: "Requerido" })
                .min(1, "Requerido"),
              isRequired: z.boolean().optional(),
            })
          )
          .min(1, "Es requerido al menos una característica"),
        // Acepta el objeto transformado: puede ser string o { value, isRequired }
        z.record(
          z.union([
            z.string(),
            z.object({ value: z.string(), isRequired: z.boolean().optional() }),
          ])
        ),
      ])
      .transform((details) => {
        // Si ya es un objeto, lo devolvemos tal cual
        if (typeof details === "object" && !Array.isArray(details)) {
          return details;
        }
        // Si es un array, lo transformamos (preserva isRequired)
        return detailsArrayToObject(
          (
            details as Array<{
              key: string;
              value: string;
              isRequired?: boolean;
            }>
          )?.map((d) => ({
            key: d?.key,
            value: d?.value,
            isRequired: d?.isRequired,
          }))
        );
      }),
    quantity: z
      .number({ required_error: "Requerido" })
      .min(1, "La cantidad debe ser al menos 1")
      .default(1),
    price: z
      .number({ required_error: "Requerido" })
      .min(1, "El precio es requerido")
      .default(0),
    discountType: z.number({ required_error: "Requerido" }).default(0),
    discountValue: z.number({ required_error: "Requerido" }).default(0),
    isLimit: z.boolean().default(false),
    purchaseLimit: z.number().default(0),
    isPrime: z.boolean().default(false),
    warranty: z.object({
      isWarranty: z.preprocess(
        (val) => (val === null ? false : val),
        z.boolean().default(false)
      ),
      warrantyPrice: z.preprocess(
        (val) => (val == null ? 0 : val),
        z.number({ required_error: "Requerido" }).default(0)
      ),
      warrantyTime: z.preprocess(
        (val) => (val == null ? 0 : val),
        z.number({ required_error: "Requerido" }).default(0)
      ),
    }),
    packageDelivery: z.boolean().default(false),
    images: z
      .array(
        z.union([
          z.string().url("Debe ser una URL válida para la imagen."),
          z.instanceof(File, {
            message: "Debe ser un archivo válido.",
          }),
        ])
      )
      .max(5, { message: "Máximo 5 imágenes permitidas." })
      .optional(),
  })
  .transform((data) => ({
    ...data,
    purchaseLimit: data.isLimit ? data.purchaseLimit : 0,
  }))
  .refine(
    (data) => {
      if (data.isLimit && data.purchaseLimit <= 0) {
        return false;
      }
      return true;
    },
    {
      message: "Límite de compras es requerido",
      path: ["purchaseLimit"],
    }
  );

export const inventoryProviderArraySchema = z
  .array(
    z
      .object({
        storeId: z.number({}),
        warehouseIds: z.array(z.number()),
        warehousePhysicalIds: z.array(z.number()),
        productVariants: productVariants,
      })
      .refine(
        (data) => {
          // Validar que existe al menos un almacén entre warehouseIds y warehousePhysicalIds
          const totalWarehouses =
            data.warehouseIds.length + data.warehousePhysicalIds.length;
          return totalWarehouses > 0;
        },
        {
          message:
            "Debe existir al menos un almacén entre almacenes del proveedor y almacenes físicos",
          path: ["warehouseIds"], // Se puede ajustar el path según dónde quieras mostrar el error
        }
      )
  )
  .min(1, "Debes seleccionar al menos una tienda")
  .transform((array) => {
    return array.map((item) => {
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

/* array */
export type InventoryProviderFormData = z.infer<typeof inventoryProviderSchema>;
export type ProductVariant = z.infer<typeof productVariants>;
