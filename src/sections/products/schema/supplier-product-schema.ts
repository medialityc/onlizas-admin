import { detailsObjectToArray } from "@/utils/format";
import { z } from "zod";

// Schema completo que coincide con la API real según product-apis.md
export const supplierProductSchema = z
  .object({
    id: z.string().optional(),
    isDraft: z.boolean().default(false).optional(),
    isOwned: z.boolean().default(false).optional(), // define si es un producto del proveedor
    name: z
      .string({ required_error: "El nombre es obligatorio." })
      .min(1, "El nombre no puede estar vacío.")
      .max(250, "El nombre no puede tener más de 250 caracteres."),
    description: z
      .string()
      .max(500, "La descripción no puede tener más de 500 caracteres.")
      .default(""),
    active: z.boolean().default(false).optional(),

    categoryIds: z
      .array(z.string())
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
      .default([])
      .transform((details) => {
        if (Array.isArray(details)) {
          return details;
        }
        return detailsObjectToArray(details);
      })
      .refine(
        (arrayDetails) => {
          const uniqueKeys = new Set(
            arrayDetails.map((d) => d.key.toLowerCase().trim())
          );
          return uniqueKeys.size === arrayDetails.length;
        },
        {
          message:
            "Las claves de detalles deben ser únicas (no se permiten duplicados).",
        }
      ),

    image: z
      .union([z.string(), z.instanceof(File)])
      .nullable()
      .optional(),

    additionalImages: z
      .array(z.union([z.string(), z.instanceof(File)]))
      .optional(),
  })
  .superRefine((data, ctx) => {
    // Validar imagen y details cuando isDraft es true (producto es plantilla)
    if (data.isDraft) {
      // Validar que la imagen sea obligatoria
      if (!data.image) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["image"],
          message: "La imagen es obligatoria.",
        });
      }

      // Validar que details tenga al menos un elemento
      if (!data.details || data.details.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["details"],
          message: "Los detalles son obligatorios.",
        });
      }
    }
  });

export type SupplierProductFormData = z.infer<typeof supplierProductSchema> & {
  categories?: {
    id: string;
    name: string;
  }[];
};
