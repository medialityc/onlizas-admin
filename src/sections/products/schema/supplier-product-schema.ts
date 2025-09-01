import { z } from "zod";

// Schema completo que coincide con la API real según product-apis.md
export const supplierProductSchema = z.object({
  id: z.number().optional(),
  isDraft: z.boolean().optional(),
  name: z
    .string({ required_error: "El nombre es obligatorio." })
    .min(1, "El nombre no puede estar vacío.")
    .max(100, "El nombre no puede tener más de 100 caracteres."),
  description: z
    .string()
    .max(500, "La descripción no puede tener más de 500 caracteres.")
    .default(""),
  isActive: z.boolean().default(false).optional(),

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
  // details dinámicos (objeto de claves arbitrarias string -> string)
  details: z
    .union([
      z.array(
        z.object({
          key: z.string().trim().min(1, "Clave requerida"),
          value: z.string().trim().min(1, "Valor requerido para el detalle"),
        })
      ),
      z.record(z.string(), z.string()),
    ])
    .default({})
    .refine(
      (obj) => Object.keys(obj).length <= 50,
      "Máximo 50 detalles (no se permiten duplicados)"
    )
    .refine(
      (obj) => {
        const uniqueKeys = new Set(
          Object.keys(obj).map((key) => key.toLowerCase().trim())
        );
        return uniqueKeys.size === Object.keys(obj).length;
      },
      {
        message:
          "Las claves de detalles deben ser únicas (no se permiten duplicados).",
      }
    ),

  image: z
    .union([
      z.string().url("Debe ser una URL válida para la imagen."),
      z.instanceof(File, { message: "Debe ser un archivo válido." }),
    ])
    .optional(),
});

export type SupplierProductFormData = z.infer<typeof supplierProductSchema> & {
  supplierId?: number;
  suppliers?: {
    id: number;
    name: string;
  }[];
  categories?: {
    id: number;
    name: string;
  }[];
};
