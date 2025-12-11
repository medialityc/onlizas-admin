import { detailsObjectToArray } from "@/utils/format";
import { z } from "zod";

// Schema completo que coincide con la API real según product-apis.md
export const supplierProductSchema = z
  .object({
    id: z.string().optional(),
    isDraft: z.boolean().default(false).optional(),
    isOwned: z.boolean().default(false).optional(), // define si es un producto del proveedor
    name: z
      .string({ error: "El nombre es obligatorio." })
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

    // Tutoriales de video (solo YouTube) - máximo 10
    tutorials: z
      .array(z.string().url("Debe ser una URL válida"))
      .max(10, "Máximo 10 tutoriales")
      .refine(
        (tutorials: string[]) => {
          const pattern =
            /^(?:https?:\/\/)?(?:(?:www|m)\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})(?:[?&].*)?$/;
          return tutorials.every((t) => pattern.test(t));
        },
        { message: "Solo se permiten URLs válidas de YouTube" }
      )
      .refine(
        (tutorials: string[]) => {
          const uniques = new Set(tutorials.map((t) => t.trim()));
          return uniques.size === tutorials.length;
        },
        { message: "Las URLs de tutorial deben ser únicas" }
      )
      .default([]),

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
    aduanaCategoryGuid: z
      .union([z.string(), z.number()])
      .refine((val) => val !== "" && val !== undefined && val !== null, {
        message: "Debe seleccionar una categoría aduanal",
      }),
    brandId: z.string().min(1, "Debe seleccionar al menos un proveedor."),
    gtin: z.string().min(1, "Debe ingresar un GTIN válido."),
  })
  .superRefine((data, ctx) => {
    if (data.isDraft) {
      if (!data.image) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["image"],
          message: "La imagen es obligatoria.",
        });
      }
      if (
        !data.details ||
        (Array.isArray(data.details) && data.details.length === 0)
      ) {
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
