import { z } from "zod";

export const regionSchema = z.object({
  code: z
    .string({ error: "El código es obligatorio." })
    .min(1, "El código no puede estar vacío.")
    .max(10, "Máximo 10 caracteres.")
    .regex(
      /^[A-Z0-9_-]+$/,
      "Solo letras mayúsculas, números, guiones y guiones bajos."
    ),

  name: z
    .string({ error: "El nombre es obligatorio." })
    .min(1, "El nombre no puede estar vacío.")
    .max(100, "Máximo 100 caracteres."),

  description: z.string().max(500).optional(),

  moveCountries: z.boolean(),

  countryIds: z.array(z.union([z.string(), z.number()])).optional(),
});

export type CreateRegionSchema = z.infer<typeof regionSchema>;
export type UpdateRegionSchema = z.infer<typeof regionSchema>;
