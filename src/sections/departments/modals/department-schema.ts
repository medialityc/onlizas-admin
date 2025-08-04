import { z } from "zod";

export const departmentSchema = z.object({
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

export type DepartmentFormData = z.infer<typeof departmentSchema>;

// Tipo para CreateDepartment que coincide con el schema
export type CreateDepartment = DepartmentFormData;
