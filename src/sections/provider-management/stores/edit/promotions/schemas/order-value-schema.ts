import { z } from "zod";

// Schema para promociones tipo Order Value (descuento por valor del pedido)
export const orderValueSchema = z
  .object({
    name: z.string().min(1, "El nombre es obligatorio").max(255, "Máximo 255 caracteres"),
    description: z.string().min(1, "La descripción es obligatoria"),

    // Compatibilidad con componentes existentes: permitimos startDate/endDate como string
    startDate: z.union([z.string(), z.date()]).optional(),
    endDate: z.union([z.string(), z.date()]).optional(),

    // Fechas (como arrays opcionales)
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
      
    ).min(1, { message: "Debe seleccionar al menos una fecha" }),
        // Límites de uso
    usageLimit: z.number().optional(),
    usageLimitPerUser: z.number().optional(),

   
    // Media obligatorio (url o File)
    mediaFile: z.union([z.string().min(1, { message: "La imagen es obligatoria" }), z.instanceof(File)]),
    isActive: z.boolean(),

    // Requisitos de compra mínima (un spinner numérico en la UI)
      // Requisitos de compra mínima: opcional en el form; si presente debe ser > 0.
      minimumAmount: z.number().optional().refine((val) => val === undefined || val > 0, {
        message: "El monto mínimo debe ser mayor a 0",
      }),
    appliesTo: z.enum(["products", "categories", "orders"]).optional(),
    products: z.array(z.number().min(1)).optional(),
    categories: z.array(z.number().min(1)).optional(),

    // Discount: tipo numérico y valor
    discountType: z.number().min(0).max(2), // 0=percent,1=amount,2=free (free unlikely here)
    discountValue: z.number().min(1, {message:"No ha especificado el valor del descuento"}),
  })
  .refine((data) => {
    if (data.discountType === 0 || data.discountType === 1) {
      return data.discountValue != null && data.discountValue > 0;
    }
    return true;
  }, {
    message: "Para porcentaje o cantidad fija, el valor debe ser mayor a 0",
    path: ["discountValue"],
  })
    .refine((data) => {
      if (data.discountType === 0 || data.discountType === 1) {
        if (data.discountValue == null || data.discountValue <= 0) return false;
        if (data.discountType === 0 && data.discountValue > 100) return false; // porcentaje no puede exceder 100
      }
      return true;
    }, {
      message: "Para porcentaje o cantidad fija, el valor debe ser válido (porcentaje <= 100)",
      path: ["discountValue"],
    });

export type OrderValueFormData = z.infer<typeof orderValueSchema>;
