import { z } from "zod";
import { SUPPLIER_NATIONALITY } from "../../constants/supplier.options";

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
  countryCode: z.string().min(1, "El código de país es obligatorio."),
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
  active: z.boolean({
    required_error: "Debes especificar si el proveedor está activo.",
  }),
  pendingCategories: z
    .array(
      z.object({
        id: z.string(),
        name: z.string().min(2).max(100),
      })
    )
    .default([])
    .optional(),
  approvedCategories: z
    .array(
      z.object({
        id: z.string(),
        name: z.string().min(2).max(100),
      })
    )
    .default([])
    .optional(),
  sellerType: z.coerce
    .number({
      required_error: "El tipo de vendedor es obligatorio.",
      invalid_type_error: "El tipo de vendedor es obligatorio.",
    })
    .min(0, "El tipo de vendedor no puede estar vacío.")
    .max(100),
  nacionalityType: z.coerce
    .number({
      required_error: "La nacionalidad es obligatoria.",
      invalid_type_error: "La nacionalidad es obligatoria.",
    })
    .min(0, "La nacionalidad no puede estar vacía."),
  mincexCode: z.string().optional(),
  // Expiration date of the supplier account (ISO date string)
  expirationDate: z.date().default(new Date()).optional(),
});

export type UpdateSupplierFormData = z.infer<typeof updateSupplierSchema>;

export const updateSupplierSchemaWithRules = updateSupplierSchema.superRefine(
  (data, ctx) => {
    if (
      [SUPPLIER_NATIONALITY.Extranjero, SUPPLIER_NATIONALITY.Ambos].includes(
        data.nacionalityType
      )
    ) {
      if (!data.mincexCode || data.mincexCode.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["mincexCode"],
          message: "El código Mincex es obligatorio para extranjeros o ambos.",
        });
      }
    }
  }
);
