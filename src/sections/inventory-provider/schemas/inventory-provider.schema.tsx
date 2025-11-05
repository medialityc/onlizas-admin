import { featureSchema } from "@/sections/categories/schemas/category-schema";
import { detailsArrayToObject } from "@/utils/format";
import { z } from "zod";
export const productVariants = z
  .object({
    id: z.string().optional(),
    limitPurchaseLimit: z.number().optional(),
    sku: z.string().min(1, "El SKU es requerida"),
    upc: z.string().min(1, "EL UPC es requerida"),
    ean: z.string().min(1, "EL EAN es requerida"),
    condition: z.number().min(1, "La condición es requerida"),
    isActive: z.boolean().default(true),
    details: z
      .union([
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
        z.record(
          z.union([
            z.string(),
            z.object({
              value: z.string(),
              isRequired: z.boolean().optional(),
            }),
          ])
        ),
      ])
      .transform((details) => {
        if (typeof details === "object" && !Array.isArray(details)) {
          return details; // ya es record
        }
        return detailsArrayToObject(
          (
            details as Array<{
              key: string;
              value: string;
              isRequired?: boolean;
            }>
          ).map((d) => ({
            key: d.key,
            value: d.value,
            isRequired: d.isRequired,
          }))
        );
      }),
    stock: z
      .number({ required_error: "Requerido" })
      .min(1, "La cantidad debe ser al menos 1")
      .default(1),
    price: z
      .number({ required_error: "Requerido" })
      .min(0, "El precio es requerido")
      .default(0),
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
    packageDelivery: z.boolean().optional().default(false),
    images: z
      .array(
        z.union([
          z.string().url("Debe ser una URL válida para la imagen."),
          z.instanceof(File, { message: "Debe ser un archivo válido." }),
        ])
      )
      .max(5, { message: "Máximo 5 imágenes permitidas." })
      .optional(),

    // ⚡️ Campos de paquetería
    volume: z.number().optional(),
    weight: z.number().optional(),
  })
  .transform((data) => ({
    ...data,
    purchaseLimit: data.isLimit ? data.purchaseLimit : 0,
  }))
  .superRefine((data, ctx) => {
    // ✅ Validación límite de compras
    if (data.isLimit && data.purchaseLimit <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["purchaseLimit"],
        message: "Límite de compras es requerido",
      });
    }

    // ✅ Validación de volumen/peso si es paquetería
    if (data.packageDelivery) {
      if (data.volume === undefined || data.volume <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["volume"],
          message: "El volumen es requerido y debe ser mayor a 0",
        });
      }
      if (data.weight === undefined || data.weight <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["weight"],
          message: "El peso es requerido y debe ser mayor a 0",
        });
      }
    }
  });

// ---------- ARRAY SCHEMA ----------
export const inventoryProviderArraySchema = z
  .array(
    z
      .object({
        storeId: z.number(),
        warehouseIds: z.array(z.number()),
        warehousePhysicalIds: z.array(z.number()),
        productVariants: productVariants,
      })
      .refine(
        (data) =>
          data.warehouseIds.length + data.warehousePhysicalIds.length > 0,
        {
          message:
            "Debe existir al menos un almacén entre almacenes del proveedor y almacenes físicos",
          path: ["warehouseIds"],
        }
      )
  )
  .min(1, "Debes seleccionar al menos una tienda")
  .transform((array) =>
    array.map((item) => {
      const combinedWarehouseIds = [
        ...item.warehouseIds,
        ...item.warehousePhysicalIds,
      ].filter((id, index, arr) => arr.indexOf(id) === index);

      return {
        ...item,
        warehouseIds: combinedWarehouseIds,
      };
    })
  );

// ---------- PROVIDER SCHEMA ----------
export const inventoryProviderSchema = z.object({
  storesWarehouses: inventoryProviderArraySchema,
  productId: z.string({ required_error: "Requerido" }),
  supplierId: z.string({ required_error: "Requerido" }),
  categoryFeatures: z.array(featureSchema),
});

// ---------- TYPES ----------
export type InventoryProviderStoreSettingItem = {
  id: string;
  storeId: number;
  storeName: string;
  warehouseIds: number[];
};

export type InventoryProviderFormData = z.infer<
  typeof inventoryProviderSchema
> & {
  id?: number;
  parentProductName?: string;
};
export type ProductVariant = z.infer<typeof productVariants> & {
  productName?: string;
  storeName?: string;
  isPacking?: boolean;
};
