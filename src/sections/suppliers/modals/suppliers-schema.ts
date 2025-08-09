import { z } from "zod";

export const suppliersSchema = z.object({
  name: z
    .string({ required_error: "El nombre es obligatorio." })
    .min(1, "El nombre no puede estar vacío.")
    .max(100, "El nombre no puede tener más de 100 caracteres."),
  supplierType: z.enum(["Persona", "Empresa"], {
    required_error: "Debes seleccionar un tipo de proveedor.",
    invalid_type_error: "El tipo de proveedor debe ser 'Persona' o 'Empresa'.",
  }),
  email: z
    .string({ required_error: "El email es obligatorio." })
    .min(1, "El email no puede estar vacío.")
    .email("Debe ser un email válido."),
  phone: z
    .string({ required_error: "El teléfono es obligatorio." })
    .min(1, "El teléfono no puede estar vacío.")
    .max(20, "El teléfono no puede tener más de 20 caracteres."),
  address: z
    .string({ required_error: "La dirección es obligatoria." })
    .min(1, "La dirección no puede estar vacía.")
    .max(200, "La dirección no puede tener más de 200 caracteres."),
  createAutomaticAprovalProcess: z.boolean({
    required_error:
      "Debes especificar si crear proceso de aprobación automático.",
  }),
  documents: z
    .array(
      z.object({
        fileName: z
          .string({ required_error: "El nombre del archivo es obligatorio." })
          .min(1, "El nombre del archivo no puede estar vacío."),
        content: z.instanceof(File, {
          message: "El contenido debe ser un archivo válido.",
        }),
      })
    )
    .default([])
    .optional(),
});

export type SuppliersFormData = z.infer<typeof suppliersSchema>;

export const updateSupplierSchema = z.object({
  name: z
    .string({ required_error: "El nombre es obligatorio." })
    .min(1, "El nombre no puede estar vacío.")
    .max(100, "El nombre no puede tener más de 100 caracteres."),
  email: z
    .string({ required_error: "El email es obligatorio." })
    .min(1, "El email no puede estar vacío.")
    .email("Debe ser un email válido."),
  phone: z
    .string({ required_error: "El teléfono es obligatorio." })
    .min(1, "El teléfono no puede estar vacío.")
    .max(20, "El teléfono no puede tener más de 20 caracteres."),
  address: z
    .string({ required_error: "La dirección es obligatoria." })
    .min(1, "La dirección no puede estar vacía.")
    .max(200, "La dirección no puede tener más de 200 caracteres."),
  message: z
    .string()
    .max(500, "El mensaje no puede tener más de 500 caracteres.")
    .optional(),
  type: z
    .string({ required_error: "El tipo es obligatorio." })
    .min(1, "El tipo no puede estar vacío."),
  isActive: z.boolean({
    required_error: "Debes especificar si el proveedor está activo.",
  }),
  pendingDocuments: z
    .array(
      z.object({
        fileName: z
          .string({ required_error: "El nombre del archivo es obligatorio." })
          .min(1, "El nombre del archivo no puede estar vacío."),
        content: z.union([
          z.instanceof(File, {
            message: "El contenido debe ser un archivo válido.",
          }),
          z.string().min(1, "El contenido del archivo no puede estar vacío."),
        ]),
      })
    )
    .default([])
    .optional(),
});

export type UpdateSupplierFormData = z.infer<typeof updateSupplierSchema>;
