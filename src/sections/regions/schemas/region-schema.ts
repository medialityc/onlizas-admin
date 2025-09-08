import { z } from "zod";

export const regionSchema = z.object({
  code: z
    .string({ required_error: "El código es obligatorio." })
    .min(1, "El código no puede estar vacío.")
    .max(10, "Máximo 10 caracteres.")
    .regex(/^[A-Z0-9_-]+$/, "Solo letras mayúsculas, números, guiones y guiones bajos."),

  name: z
    .string({ required_error: "El nombre es obligatorio." })
    .min(1, "El nombre no puede estar vacío.")
    .max(100, "Máximo 100 caracteres."),

  description: z.string().max(500).optional(),

  status: z
    .enum(["active", "inactive"], {
      required_error: "El estado es obligatorio.",
    }),

  countryIds: z.array(z.number()),
  
});

export type CreateRegionSchema = z.infer<typeof regionSchema>;
export type UpdateRegionSchema = z.infer<typeof regionSchema>;
