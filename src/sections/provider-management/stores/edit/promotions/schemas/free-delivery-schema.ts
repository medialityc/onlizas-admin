import { z } from "zod";

/**
 * Schema específico para Free Delivery
 * Basado en el formulario de la imagen y la API
 */
export const freeDeliverySchema = z
  .object({
    // Información básica
    name: z.string().min(1, "El nombre es obligatorio").max(255, "Máximo 255 caracteres"),
    description: z.string().min(1, "La descripción es obligatoria"),

    // Fechas de vigencia - solo arrays, sin rango principal
    simpleDates: z.array(z.date()).optional(),
    dateRanges: z.array(z.object({
      startDate: z.union([z.string(), z.date()]),
      endDate: z.union([z.string(), z.date()])
    }).refine((data) => {
      // Convertir a Date si vienen como string
      const start = data.startDate instanceof Date ? data.startDate : new Date(data.startDate);
      const end = data.endDate instanceof Date ? data.endDate : new Date(data.endDate);
      
      // La fecha de fin debe ser mayor a la fecha de inicio (no iguales)
      return end > start;
    }, {
      message: "La fecha de fin debe ser posterior a la fecha de inicio",
  })).min(1, { message: "Debe seleccionar al menos una fecha" }),

    // Arrays de ids (numéricos)
    productVariantsIds: z.array(z.number().min(1)).min(1, {message: "Debe seleccionar al menos un producto"}),
   

    // Límites de uso
    usageLimit: z.number().optional(),
    usageLimitPerUser: z.number().optional(),

    // Media/file (aceptamos cualquier cosa en el schema para el upload)
  mediaFile:  z.union([z.string().min(1, { message: "La imagen es obligatoria" }), z.instanceof(File,{message:"Seleccione una imagen"})]),

    // Estado
    isActive: z.boolean(),
    code:z.string({required_error:"Debe establecer un código"}),

    // Campos para requisitos de compra
    minimumAmount: z.number().optional().refine((val) => val === undefined || val > 0, {
    message: "La cantidad mínima debe ser mayor a 0"
    }),
    minimumItems: z.number().optional().refine((val) => val === undefined || val > 0, {
    message: "La cantidad mínima debe ser mayor a 0"
    }),

    // Discount fields (for compatibility with ValueSelector)
    discountType: z.number().min(0).max(3),
    discountValue: z.number().min(0),
    
  });

export type FreeDeliveryFormData = z.infer<typeof freeDeliverySchema>;
