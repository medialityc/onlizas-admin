import { z } from "zod";

// Schema completo que coincide con la API real según product-apis.md
export const inventoryProviderSchema = z.object({
  id: z.number().optional(),
  name: z
    .string({ required_error: "El nombre es obligatorio." })
    .min(1, "El nombre no puede estar vacío.")
    .max(100, "El nombre no puede tener más de 100 caracteres."),
  image: z
    .union([
      z.string().url("Debe ser una URL válida para la imagen."),
      z.instanceof(File, { message: "Debe ser un archivo válido." }),
    ])
    .optional(),
});

export type InventoryProviderFormData = z.infer<typeof inventoryProviderSchema>;
