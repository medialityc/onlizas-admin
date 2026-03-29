import { featureSchema } from "@/sections/categories/schemas/category-schema";
import { DETAILS_MAX_ITEMS, detailsArrayToObject } from "@/utils/format";
import { z } from "zod";

// Helper para coerción robusta de números
const toNumber = (val: unknown, fallback = 0): number => {
  if (val == null || val === "") return fallback;
  const n = Number(val);
  return Number.isNaN(n) ? fallback : n;
};

const gtinRegex = /^(?:\d{8}|\d{12}|\d{13}|\d{14})$/;

const detailsArraySchema = z
  .array(
    z.object({
      key: z.string(),
      value: z.string(),
      isRequired: z.boolean().optional(),
    })
  )
  .max(DETAILS_MAX_ITEMS, `Máximo ${DETAILS_MAX_ITEMS} detalles permitidos.`)
  .superRefine((details, ctx) => {
    const keyCount = new Map<string, number>();

    details.forEach((detail, index) => {
      const normalizedKey = (detail.key ?? "").trim().toLowerCase();

      if (!normalizedKey) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [index, "key"],
          message: "La clave es obligatoria.",
        });
        return;
      }

      keyCount.set(normalizedKey, (keyCount.get(normalizedKey) ?? 0) + 1);
    });

    details.forEach((detail, index) => {
      const normalizedKey = (detail.key ?? "").trim().toLowerCase();
      if (!normalizedKey) return;

      if ((keyCount.get(normalizedKey) ?? 0) > 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [index, "key"],
          message: "La clave ya existe en otro detalle.",
        });
      }
    });
  });

const detailsRecordSchema = z
  .record(
    z.string(),
    z.union([
      z.string(),
      z.object({
        value: z.string(),
        isRequired: z.boolean().optional(),
      }),
    ])
  )
  .superRefine((details, ctx) => {
    const keys = Object.keys(details);

    if (keys.length > DETAILS_MAX_ITEMS) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: [],
        message: `Máximo ${DETAILS_MAX_ITEMS} detalles permitidos.`,
      });
    }

    keys.forEach((key) => {
      if (!key.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [key],
          message: "La clave es obligatoria.",
        });
      }
    });
  });

export const productVariants = z
  .object({
    id: z.string().optional(),
    limitPurchaseLimit: z
      .preprocess((v) => toNumber(v), z.number())
      .optional(),
    sku: z.string().min(1, "El SKU es requerida"),
    upc: z.string().min(1, "EL UPC es requerida"),
    ean: z.string().min(1, "EL EAN es requerida"),
    gtin: z
      .string()
      .trim()
      .min(1, "Debe ingresar un GTIN válido.")
      .regex(gtinRegex, "GTIN inválido. Usa 8, 12, 13 o 14 dígitos."),
    condition: z.preprocess(
      (v) => toNumber(v),
      z.number().min(1, "La condición es requerida")
    ),
    isActive: z.preprocess(
      (v) => (v === null || v === undefined ? true : v),
      z.boolean().default(true)
    ),
    details: z
      .union([detailsArraySchema, detailsRecordSchema])
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
    stock: z.preprocess(
      (v) => toNumber(v, 0),
      z.number().min(0, "La cantidad no puede ser negativa").default(0)
    ),
    price: z.preprocess(
      (v) => toNumber(v, 0),
      z.number().min(0, "El precio es requerido").default(0)
    ),
    costPrice: z.preprocess(
      (v) => toNumber(v, 0),
      z.number().min(0, "El costo es requerido").default(0)
    ),
    deliveryMode: z.enum(["ONLIZAS", "PROVEEDOR"]).default("ONLIZAS"),
    isLimit: z.preprocess(
      (v) => (v === null || v === undefined ? false : v),
      z.boolean().default(false)
    ),
    purchaseLimit: z.preprocess(
      (v) => toNumber(v, 0),
      z.number().default(0)
    ),
    isPrime: z.preprocess(
      (v) => (v === null || v === undefined ? false : v),
      z.boolean().default(false)
    ),
    warranty: z.object({
      isWarranty: z.preprocess(
        (val) => (val === null ? false : val),
        z.boolean().default(false)
      ),
      warrantyType: z.enum(["GRATIS", "PAGO"]).default("GRATIS"),
      warrantyPrice: z.preprocess(
        (val) => (val == null || val === "" ? 0 : Number(val)),
        z.number().default(0)
      ),
      warrantyTime: z.preprocess(
        (val) => (val == null || val === "" ? 0 : Number(val)),
        z.number().default(0)
      ),
      timeUnit: z.preprocess(
        (val) => (val == null || val === "" ? 1 : Number(val)),
        z.number().int().min(0).max(2).default(1)
      ),
    }),
    packageDelivery: z.preprocess(
      (v) => (v === null || v === undefined ? false : v),
      z.boolean().optional().default(false)
    ),
    images: z
      .preprocess(
        (v) => (Array.isArray(v) ? v.filter((i: any) => i != null && i !== "") : []),
        z
          .array(
            z.union([
              z.string().min(1),
              z.instanceof(File, { message: "Debe ser un archivo válido." }),
            ])
          )
          .max(5, { message: "Máximo 5 imágenes permitidas." })
          .optional()
      ),

    // ⚡️ Campos de paquetería
    volume: z.preprocess(
      (v) => (v == null || v === "" ? undefined : Number(v)),
      z.number().optional()
    ),
    weight: z.preprocess(
      (v) => (v == null || v === "" ? undefined : Number(v)),
      z.number().optional()
    ),

    // Zonas de entrega - ahora acepta objetos completos
    zoneIds: z.array(z.string()).optional().default([]),
    zones: z.array(z.any()).optional().default([]), // Array de objetos Zone completos
  })
  .transform((data) => ({
    ...data,
    purchaseLimit: data.isLimit ? data.purchaseLimit : 0,
    warranty: {
      ...data.warranty,
      warrantyPrice:
        !data.warranty.isWarranty || data.warranty.warrantyType === "GRATIS"
          ? 0
          : data.warranty.warrantyPrice,
      warrantyTime: data.warranty.isWarranty ? data.warranty.warrantyTime : 0,
      timeUnit: data.warranty.timeUnit ?? 1,
    },
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

    if (data.warranty?.isWarranty) {
      if ((data.warranty.warrantyTime ?? 0) < 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["warranty", "warrantyTime"],
          message: "El tiempo de garantía no puede ser negativo",
        });
      }

      if ((data.warranty.warrantyPrice ?? 0) < 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["warranty", "warrantyPrice"],
          message: "El precio de garantía no puede ser negativo",
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
  productId: z.string().min(1, "Requerido"),
  supplierId: z.string().min(1, "Requerido"),
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
