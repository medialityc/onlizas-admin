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
  image:z
      .union([
        z.string().url("Debe ser una URL válida."),
        z.instanceof(File, { message: "La imagen es obligatoria." }),
      ]),
  active: z.boolean({ required_error: "El estado activo es obligatorio." }),
});

export type DepartmentFormData = z.infer<typeof departmentSchema>;

// Tipo para CreateDepartment que coincide con el schema
export type CreateDepartment = DepartmentFormData;
