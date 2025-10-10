import { z } from "zod";

// Schema for Code promotions (form 'code')
export const getySchema = z
    .object({
        name: z.string().min(1, "El nombre es obligatorio").max(255, "Máximo 255 caracteres"),
        description: z.string().min(1, { message: "La descripción es obligatoria" }),

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
            ).min(1, { message: "Debe seleccionar al menos una fecha" }),

        

        productIdX: z.number().min(1,{message:"Seleccione el producto X requerido"}),
        productIdY: z.number().min(1,{message:"Seleccione el producto Y obtenido"}),

        usageLimit: z.number().optional(),
        usageLimitPerUser: z.number().optional(),

        // mediaFile obligatorio (puede ser una URL string o un File cuando se sube nueva imagen)
        mediaFile: z.union([z.string().min(1, { message: "La imagen es obligatoria" }), z.instanceof(File)]),
        active: z.boolean(),

        // Requisitos de compra: opcionales en el esquema; si vienen, deben ser > 0.
        // El componente `PurchaseRequirements` limpia estos campos cuando no aplican,
        // por eso los hacemos opcionales y aplicamos la validación condicional.
        minimumAmount: z.number().optional().refine((val) => val === undefined || val > 0, {
            message: "La cantidad mínima debe ser mayor a 0",
        }),
        minimumItems: z.number().optional().refine((val) => val === undefined || val > 0, {
            message: "La cantidad mínima debe ser mayor a 0",
        }),

        // Discount fields
    // Discount fields (numbers only)
    discountType: z.number().min(0).max(3), // 0=percent, 1=amount, 2=free, 3=free-delivery
    // discountValue: optional number; validation rules applied in refine below
    discountValue: z.number().optional(),
    })
    .refine((data) => {
        // Validar discountValue > 0 si es percent (0) o amount (1)
        if (data.discountType === 0 || data.discountType === 1) {
            if (data.discountValue == null || data.discountValue <= 0) return false;
            // Si es porcentaje, validar tope 100
            if (data.discountType === 0 && data.discountValue > 100) return false;
        }
        // Para free (2), exigir que discountValue exista y sea 0 (se debe enviar como 0)
        if (data.discountType === 2) {
            // Debe existir y ser exactamente 0
            return data.discountValue === 0;
        }
        // Para freedelivery (3) se permite que discountValue sea 0 o vacío según tipo
        return true;
    }, {
        message: "Para descuentos por porcentaje o cantidad fija, debe proporcionar un valor válido (porcentaje <= 100)",
        path: ["discountValue"]
    });

export type GetyFormData = z.infer<typeof getySchema>;
