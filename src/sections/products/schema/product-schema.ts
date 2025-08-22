import { z } from "zod";

// Schema completo que coincide con la API real según product-apis.md
export const productSchema = z.object({
  id: z.number().optional(),
  name: z
    .string({ required_error: "El nombre es obligatorio." })
    .min(1, "El nombre no puede estar vacío.")
    .max(100, "El nombre no puede tener más de 100 caracteres."),
  description: z
    .string()
    .max(500, "La descripción no puede tener más de 500 caracteres.")
    .default(""),
  isActive: z.boolean(),

  supplierUserIds: z
    .array(z.number())
    .min(1, "Debe seleccionar al menos un proveedor."),
  categoryIds: z
    .array(z.number())
    .min(1, "Debe seleccionar al menos una categoría."),

  /* dimensions */
  width: z
    .number()
    .positive("El ancho debe ser un número positivo.")
    .optional(),
  height: z
    .number()
    .positive("La altura debe ser un número positivo.")
    .optional(),
  length: z
    .number()
    .positive("La longitud debe ser un número positivo.")
    .optional(),
  weight: z
    .number()
    .positive("El peso debe ser un número positivo.")
    .optional(),

  aboutThis: z
    .array(z.string().min(1, "Se requiere al menos una"))
    .default([])
    .refine(
      (suggestions) => {
        const uniqueSuggestions = new Set(
          suggestions.map((s) => s.toLowerCase().trim())
        );
        return uniqueSuggestions.size === suggestions.length;
      },
      {
        message:
          "Las sugerencias deben ser únicas (no se permiten duplicados).",
      }
    ),
  details: z.object({
    additionalProp1: z.string({ required_error: "Requerido" }).min(1,'Requerido'),
    additionalProp2: z.string({ required_error: "Requerido" }).min(1,'Requerido'),
    additionalProp3: z.string({ required_error: "Requerido" }).min(1,'Requerido'),
  }),

  image: z
    .union([
      z.string().url("Debe ser una URL válida para la imagen."),
      z.instanceof(File, { message: "Debe ser un archivo válido." }),
    ])
    .optional(),
});

export type ProductFormData = z.infer<typeof productSchema>;
