import { z } from "zod";

export const featureSchema = z.object({
  featureName: z
    .string()
    .min(1, "El nombre de la característica es obligatorio."),
  featureDescription: z.string().min(1, "La descripción es obligatoria."),
  // UI como texto separado por comas; se convertirá a array en el submit
  suggestions: z
    .array(z.string().min(1, "La sugerencia no puede estar vacía."))
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
  isPrimary: z.boolean().default(false),
  isRequired: z.boolean().default(false),
  featureId: z.string().uuid().optional(),
});

export const categorySchema = z.object({
  /* inmutable data */
  id: z.string().uuid().optional(),
  departmentName: z.string().optional(),

  /* fields */
  name: z
    .string({ error: "El nombre es obligatorio." })
    .min(1, "El nombre no puede estar vacío.")
    .max(100, "El nombre no puede tener más de 100 caracteres."),
  departmentId: z
    .string({
      error: "Debes seleccionar un departamento.",
    })
    .uuid("El ID del departamento debe ser un UUID válido."),
  description: z
    .string({ error: "La descripción es obligatoria." })
    .min(1, "La descripción no puede estar vacía.")
    .max(500, "La descripción no puede tener más de 500 caracteres."),
  image: z.union(
    [
      z.string().url("Debe ser una URL válida para la imagen."),
      z.instanceof(File, { message: "Debe ser un archivo válido." }),
    ],
    { error: "La imagen es obligatoria." }
  ),
  active: z
    .boolean({ error: "El estado activo es obligatorio." })
    .default(false),
  features: z
    .array(featureSchema)
    .min(1, "Debes agregar al menos una característica."),
});

export type FeatureFormData = z.infer<typeof featureSchema>;
export type CategoryFormData = z.infer<typeof categorySchema>;
