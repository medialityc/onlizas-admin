import { z } from "zod";

export const expirationExtensionModalSchema = z.object({
  newExpirationDate: z
    .date({
      error: "La nueva fecha de expiración es obligatoria.",
    })
    .refine(
      (date) => date > new Date(),
      "La nueva fecha debe ser posterior a la fecha actual."
    ),
  documentNames: z.array(z.string()).optional(),
  contents: z.array(
    z
      .union([
        z.instanceof(File, {
          message: "Debe seleccionar un archivo válido.",
        }),
        z.string().min(1),
      ])
      .optional()
  ),
  comments: z
    .string({ error: "Los comentarios son obligatorios." })
    .max(1000, "Los comentarios no pueden tener más de 1000 caracteres."),
});

export type ExpirationExtensionModalFormData = z.infer<
  typeof expirationExtensionModalSchema
>;
