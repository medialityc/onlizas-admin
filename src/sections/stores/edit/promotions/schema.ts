import { z } from "zod";

export const promotionFormSchema = z
  .object({
    name: z.string().min(1, "El nombre es requerido"),
    type: z.enum(["percent", "amount"], {
      required_error: "El tipo es requerido",
    }),
    description: z.string().optional(),
    value: z
      .union([z.number(), z.string()])
      .refine((v) => {
        const n = typeof v === "string" ? Number(v) : v;
        return !isNaN(n) && n > 0;
      }, "Ingresa un valor válido"),
    usageLimit: z
      .union([z.number(), z.string()])
      .optional()
      .refine(
        (v) => {
          if (v === undefined || v === "") return true;
          const n = typeof v === "string" ? Number(v) : v;
          return !isNaN(n) && n >= 0;
        },
        { message: "Debe ser un número positivo" }
      ),
    code: z.string().optional(),
    startDate: z.date().optional(),
    endDate: z.date().optional(),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return data.startDate <= data.endDate;
      }
      return true;
    },
    {
      message: "La fecha de inicio no puede ser mayor que la fecha de fin",
      path: ["endDate"],
    }
  );

export type PromotionFormValues = z.infer<typeof promotionFormSchema>;
