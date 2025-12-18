import { z } from "zod";
import { Package } from "lucide-react";

// Schema for Package promotions
export const packageSchema = z.object({
  name: z
    .string()
    .min(1, "El nombre es obligatorio")
    .max(255, "Máximo 255 caracteres"),
  description: z.string().min(1, { message: "La descripción es obligatoria" }),
  active: z.boolean(),

  // Dates
  simpleDates: z.array(z.date()).optional(),
  dateRanges: z
    .array(
      z
        .object({
          startDate: z.date(),
          endDate: z.date(),
        })
        .refine((data) => data.endDate > data.startDate, {
          message: "La fecha de fin debe ser posterior a la fecha de inicio",
        })
    )
    .min(1, { message: "Debe seleccionar al menos una fecha" }),

  // Usage limits
  usageLimit: z.number(),
  usageLimitPerUser: z.number().optional(),

  // Media file
  mediaFile: z.any().optional(),

  // Code fields
  requiresCode: z.boolean(),
  code: z.string().optional(),

  // Discount fields - usando mapeo frontend (0=percent, 1=amount)
  discountType: z.number(),
  discountValue: z.number().min(0, "El valor debe ser mayor a 0"),

  // Product variants
  productVariantsIds: z
    .array(z.string())
    .min(1, { message: "Seleccione al menos un producto" }),

  // Requisitos de compra (opcionales)
  minimumAmount: z.number().optional(),
  minimumItems: z.number().optional(),
});

export type PackageFormData = z.infer<typeof packageSchema>;
