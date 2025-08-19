import { z } from "zod";

const featureSchema = z.object({
  featureName: z
    .string()
    .min(1, "El nombre de la característica es obligatorio."),
  featureDescription: z.string().min(1, "La descripción es obligatoria."),
  // UI como texto separado por comas; se convertirá a array en el submit
  suggestions: z
    .array(z.string().min(1, "La sugerencia no puede estar vacía."))
    .default([]),
  isPrimary: z.boolean().default(false),
  isRequired: z.boolean().default(false),
});

export const categoriesSchema = z.object({
  department: z.coerce.number({
    required_error: "Debes seleccionar un departamento.",
  }),
  name: z
    .string({ required_error: "El nombre es obligatorio." })
    .min(1, "El nombre no puede estar vacío.")
    .max(100, "El nombre no puede tener más de 100 caracteres."),
  description: z
    .string({ required_error: "La descripción es obligatoria." })
    .min(1, "La descripción no puede estar vacía.")
    .max(500, "La descripción no puede tener más de 500 caracteres."),
  image: z.union(
    [
      z.string().url("Debe ser una URL válida para la imagen."),
      z.instanceof(File, { message: "Debe ser un archivo válido." }),
    ],
    { required_error: "La imagen es obligatoria." }
  ),
  isActive: z.boolean({ required_error: "El estado activo es obligatorio." }),
  features: z
    .array(featureSchema)
    .min(1, "Debes agregar al menos una característica."),
});

export type FeatureFormData = z.infer<typeof featureSchema>;
export type CategoriesFormData = z.infer<typeof categoriesSchema>;
