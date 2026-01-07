import { z } from "zod";
import { SUPPLIER_NATIONALITY } from "../../constants/supplier.options";

export const updateSupplierSchema = z.object({
  name: z
    .string({ error: "El nombre es obligatorio." })
    .min(1, "El nombre no puede estar vacío.")
    .max(100, "El nombre no puede tener más de 100 caracteres."),
  email: z
    .string({ error: "El email es obligatorio." })
    .min(1, "El email no puede estar vacío.")
    .email("Debe ser un email válido."),
  phone: z
    .string({ error: "El teléfono es obligatorio." })
    .min(1, "El teléfono no puede estar vacío.")
    .max(20, "El teléfono no puede tener más de 20 caracteres."),
  countryCode: z.string().optional(),
  address: z
    .string({ error: "La dirección es obligatoria." })
    .min(1, "La dirección no puede estar vacía.")
    .max(200, "La dirección no puede tener más de 200 caracteres."),
  message: z
    .string()
    .max(500, "El mensaje no puede tener más de 500 caracteres.")
    .optional(),
  active: z.boolean({
    error: "Debes especificar si el proveedor está activo.",
  }),
  importersIds: z.array(z.string()).default([]).optional(),
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
  // .default([]) y .optional() removidos para requerir al menos una categoría
  sellerType: z.coerce
    .number({
      error: "El tipo de vendedor es obligatorio.",
    })
    .min(0, "El tipo de vendedor no puede estar vacío.")
    .max(100),
  nacionalityType: z.coerce
    .number({
      error: "La nacionalidad es obligatoria.",
    })
    .min(0, "La nacionalidad no puede estar vacía."),
  mincexCode: z.string().optional(),
  // Expiration date of the supplier account (ISO date string)
  expirationDate: z.date().default(new Date()).optional(),
  supplierType: z.coerce
    .number({
      error: "El tipo de proveedor es obligatorio.",
    })
    .min(0)
    .max(1)
    .default(0),
});

export type UpdateSupplierFormData = z.infer<typeof updateSupplierSchema>;

export const updateSupplierSchemaWithRules = updateSupplierSchema.superRefine(
  (data, ctx) => {
    // El código Mincex es obligatorio únicamente cuando la nacionalidad es Extranjero
    if (
      data.nacionalityType === SUPPLIER_NATIONALITY.Extranjero ||
      data.nacionalityType === SUPPLIER_NATIONALITY.Ambos
    ) {
      if (!data.mincexCode || data.mincexCode.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["mincexCode"],
          message: "El código Mincex es obligatorio para extranjeros.",
        });
      }
    }
  }
);
