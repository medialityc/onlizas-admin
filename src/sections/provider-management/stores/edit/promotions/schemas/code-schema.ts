import { z } from "zod";

// Schema for Code promotions (form 'code')
export const codeSchema = z
  .object({
    name: z.string().min(1, "El nombre es obligatorio").max(255, "Máximo 255 caracteres"),
    description: z.string().min(1,{message:"La descripción es obligatoria"}),

    // Dates
    simpleDates: z.array(z.date()).optional(),
    dateRanges: z
      .array(
        z
          .object({
            startDate: z.union([z.string(), z.date()]),
            endDate: z.union([z.string(), z.date()]),
          })
          .refine((data) => {
            const start = data.startDate instanceof Date ? data.startDate : new Date(data.startDate);
            const end = data.endDate instanceof Date ? data.endDate : new Date(data.endDate);
            return end > start;
          }, { message: "La fecha de fin debe ser posterior a la fecha de inicio" })
  ).min(1,{message:"Debe seleccionar al menos una fecha"}),

  // Apply-to selector (products|categories|orders)
  appliesTo: z.enum(["products", "categories", "orders"]).optional(),
  // Product/category lists are optional but validated conditionally in superRefine below
  productVariantsIds: z.array(z.number().min(1)).optional(),
  promotionCategoriesDTOs: z.array(z.number()).optional(),

    usageLimit: z.number().optional(),
    usageLimitPerUser: z.number().optional(),

  // mediaFile obligatorio (puede ser una URL string o un File cuando se sube nueva imagen)
  mediaFile: z.union([z.string().min(1, { message: "La imagen es obligatoria" }), z.instanceof(File)]),
  isActive: z.boolean(),

  minimumAmount: z.number().optional(),
  minimumItems: z.number().optional(),

    // Discount fields
  discountType: z.number().min(0).max(2), // 0=percent, 1=amount, 2=free
  discountValue: z.number().optional(),

    // Code specific
    code: z.string().min(1, "Código promocional requerido"),
  })
  .superRefine((data, ctx) => {
    // Discount rules
    if (data.discountType === 0 || data.discountType === 1) {
      if (data.discountValue == null || data.discountValue <= 0) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["discountValue"], message: "Debe proporcionar un valor de descuento mayor que 0" });
      } else if (data.discountType === 0 && data.discountValue > 100) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["discountValue"], message: "El porcentaje no puede ser mayor a 100" });
      }
    }

    // Apply-to conditional requirements
    if (data.appliesTo === "products") {
      if (!Array.isArray(data.productVariantsIds) || data.productVariantsIds.length === 0) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["productVariantsIds"], message: "Debe seleccionar al menos un producto cuando aplica a productos" });
      }
    }
    if (data.appliesTo === "categories") {
      if (!Array.isArray(data.promotionCategoriesDTOs) || data.promotionCategoriesDTOs.length === 0) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["promotionCategoriesDTOs"], message: "Debe seleccionar al menos una categoría cuando aplica a categorías" });
      }
    }

    // Purchase requirement conditional validation: if provided, must be > 0
    if (data.minimumAmount !== undefined && data.minimumAmount !== null) {
      if (!(typeof data.minimumAmount === "number") || data.minimumAmount <= 0) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["minimumAmount"], message: "El monto mínimo debe ser mayor que 0" });
      }
    }
    if (data.minimumItems !== undefined && data.minimumItems !== null) {
      if (!(typeof data.minimumItems === "number") || data.minimumItems <= 0) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["minimumItems"], message: "La cantidad mínima debe ser mayor que 0" });
      }
    }
  });

export type CodeFormData = z.infer<typeof codeSchema>;
