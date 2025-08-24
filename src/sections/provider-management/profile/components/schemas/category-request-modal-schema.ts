import { z } from "zod";

export const categoryRequestModalSchema = z.object({
  categoryIds: z.array(
    z.number({ required_error: "Debes seleccionar al menos una categoría." })
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
    .string()
    .max(1000, "Los comentarios no pueden tener más de 1000 caracteres."),
});

export type CategoryRequestModalFormData = z.infer<
  typeof categoryRequestModalSchema
>;
