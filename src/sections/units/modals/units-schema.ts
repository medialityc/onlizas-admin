import { z } from "zod";

export const unitsSchema = z.object({
  name: z
    .string({ required_error: "El nombre es obligatorio." })
    .min(1, "El nombre no puede estar vacío.")
    .max(55, "El nombre no puede tener más de 55 caracteres."),
  abbreviation: z
    .string({ required_error: "La abreviación es obligatoria." })
    .min(2, "La abreviación no puede estar vacía.")
    .max(10, "La abreviación no puede tener más de 10 caracteres.")
    .regex(
      /^[A-Za-z]+$/,
      "La abreviación solo puede contener letras."
    ),
});

export type UnitsFormData = z.infer<typeof unitsSchema>;
