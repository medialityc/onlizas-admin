import { z } from "zod";

// Schema for Code promotions (form 'code')
export const automaticSchema = z
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
        usageLimit: z.number().optional(),
        usageLimitPerUser: z.number().optional(),

        // mediaFile obligatorio (puede ser una URL string o un File cuando se sube nueva imagen)
        mediaFile: z.union([z.string().min(1, { message: "La imagen es obligatoria" }), z.instanceof(File)]),
        isActive: z.boolean(),

        // Discount fields
        discountType: z.number().min(0).max(2), // 0=percent, 1=amount, 2=free
        discountValue: z.number(),

    })
    .refine((data) => {
        // Validar discountValue > 0 si es percent (0) o amount (1)
        if (data.discountType === 0 || data.discountType === 1) {
            if (data.discountValue == null || data.discountValue <= 0) return false;
            // Si es porcentaje, validar tope 100
            if (data.discountType === 0 && data.discountValue > 100) return false;
        }
        // Para free (2), no validar discountValue
        return true;
    }, {
        message: "Para descuentos por porcentaje o cantidad fija, debe proporcionar un valor válido (porcentaje <= 100)",
        path: ["discountValue"]
    });

export type AutomaticFormData = z.infer<typeof automaticSchema>;
