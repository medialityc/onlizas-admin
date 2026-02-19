import { detailsObjectToArray } from "@/utils/format";
import { z } from "zod";

export const productSchema = z.object({
  isDraft: z.boolean().default(false).optional(),
  id: z.string().optional(),
  name: z
    .string({ error: "El nombre es obligatorio." })
    .min(1, "El nombre no puede estar vacío.")
    .max(250, "El nombre no puede tener más de 250 caracteres."),
  description: z
    .string()
    .max(500, "La descripción no puede tener más de 500 caracteres.")
    .default(""),
  active: z.boolean(),
  supplierUserIds: z
    .array(z.string())
    .min(1, "Debe seleccionar al menos un proveedor."),
  categoryIds: z
    .array(z.string())
    .min(1, "Debe seleccionar al menos una categoría."),
  /*  customsValueAduanaUsd: z
    .number({
      error: "El valor aduanero es obligatorio",
      error: "El valor aduanero es obligatorio",
    })
    .min(0, "El valor aduanero no puede ser negativo")
    .optional(),
  valuePerUnit: z
    .number({
      error: "El valor por unidad es obligatorio",
      error: "El valor por unidad es obligatorio",
    })
    .min(0, "El valor por unidad no puede ser negativo")
    .optional(), */
  // isDurable: z.boolean().default(false),
  /*  unitGuid: z
    .union([z.string(), z.number()])
    .refine((val) => val !== "" && val !== undefined && val !== null, {
      message: "Debe seleccionar una unidad",
    }), */
  aduanaCategoryGuid: z
    .union([z.string(), z.number()])
    .refine((val) => val !== "" && val !== undefined && val !== null, {
      message: "Debe seleccionar una categoría aduanal",
    }),
  /* dimensiones */
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
          suggestions.map((s) => s.toLowerCase().trim()),
        );
        return uniqueSuggestions.size === suggestions.length;
      },
      {
        message:
          "Las sugerencias deben ser únicas (no se permiten duplicados).",
      },
    ),

  // Tutoriales de video (solo YouTube) - máximo 10
  tutorials: z
    .array(z.string().url("Debe ser una URL válida"))
    .max(10, "Máximo 10 tutoriales")
    .refine(
      (tutorials: string[]) => {
        const pattern =
          /^(?:https?:\/\/)?(?:(?:www|m)\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})(?:[?&].*)?$/;
        return tutorials.every((t: string) => pattern.test(t));
      },
      { message: "Solo se permiten URLs válidas de YouTube" },
    )
    .refine(
      (tutorials: string[]) => {
        const uniques = new Set(tutorials.map((t: string) => t.trim()));
        return uniques.size === tutorials.length;
      },
      { message: "Las URLs de tutorial deben ser únicas" },
    )
    .default([]),

  details: z
    .union([
      z.array(
        z.object({
          key: z.string().trim().min(1, "Clave requerida"),
          value: z.string().trim().min(1, "Valor requerido para el detalle"),
        }),
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
        if (arrayDetails.length === 0) {
          return false;
        }
        const uniqueKeys = new Set(
          arrayDetails.map((d) => d.key.toLowerCase().trim()),
        );
        return uniqueKeys.size === arrayDetails.length;
      },
      {
        message:
          "Las claves de detalles deben ser únicas (no se permiten duplicados).",
      },
    ),

  image: z
    .union([
      z.string().url("Debe ser una URL válida para la imagen."),
      z.instanceof(File, { message: "Debe ser un archivo válido." }),
    ])
    .optional(),
  brandId: z.string().min(1, "Debe seleccionar al menos un proveedor."),
  gtin: z.string().min(1, "Debe ingresar un GTIN válido."),
});

export type ProductFormData = z.infer<typeof productSchema> & {
  id?: string;
  state?: boolean;
  brand?: {
    id: string;
    name: string;
  };
  suppliers?: {
    id: string;
    name: string;
  }[];
  categories?: {
    id: string;
    name: string;
  }[];
};
