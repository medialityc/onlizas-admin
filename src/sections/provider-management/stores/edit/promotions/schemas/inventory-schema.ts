import { z } from "zod";

// Schema específico para promociones por inventario
export const inventoryPromotionSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().min(1, "La descripción es requerida"),
  active: z.boolean(),
  discountType: z.number(),
  discountValue: z.number().min(0, "El valor debe ser mayor a 0"),
  usageLimit: z.number().min(1, "Debe ser mayor a 0"),
  usageLimitPerUser: z.number().optional(),
  minimumAmount: z.number().optional(),
  minimumItems: z.number().optional(),
  requiresCode: z.boolean(),
  code: z.string().optional(),
  mediaFile: z.any().optional(),
  dateRanges: z.array(
    z.object({
      startDate: z.date(),
      endDate: z.date(),
    })
  ),
  simpleDates: z.array(z.date()).optional(),
  inventoryIds: z
    .array(z.string())
    .min(1, "Selecciona al menos un item de inventario"),
});

export type InventoryPromotionFormData = z.infer<
  typeof inventoryPromotionSchema
>;
