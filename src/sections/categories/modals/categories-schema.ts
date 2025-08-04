import { z } from "zod";

export const categoriesSchema = z.object({
  department: z.object({
    id: z
      .number({ required_error: "El ID del departamento es obligatorio." })
      .int("El ID del departamento debe ser un número entero.")
      .positive("El ID del departamento debe ser un número positivo."),
    name: z
      .string({ required_error: "El nombre del departamento es obligatorio." })
      .min(1, "El nombre del departamento no puede estar vacío.")
      .max(
        100,
        "El nombre del departamento no puede tener más de 100 caracteres."
      ),
  }),
  name: z
    .string({ required_error: "El nombre es obligatorio." })
    .min(1, "El nombre no puede estar vacío.")
    .max(100, "El nombre no puede tener más de 100 caracteres."),
  description: z
    .string({ required_error: "La descripción es obligatoria." })
    .min(1, "La descripción no puede estar vacía.")
    .max(500, "La descripción no puede tener más de 500 caracteres."),
  image: z
    .string({ required_error: "La imagen es obligatoria." })
    .min(1, "La URL de la imagen no puede estar vacía.")
    .url("Debe ser una URL válida para la imagen."),
  isActive: z.boolean({ required_error: "El estado activo es obligatorio." }),
});

export type CategoriesFormData = z.infer<typeof categoriesSchema>;
