import { z } from "zod";
import { SUPPLIER_NATIONALITY } from "../constants/supplier.options";

export const suppliersSchema = z.object({
  // Manual supplier fields: make optional here and enforce conditionally in superRefine
  name: z
    .string()
    .max(100, "El nombre no puede tener más de 100 caracteres.")
    .optional(),
  email: z.string().optional(),
  phone: z
    .string()
    .max(20, "El teléfono no puede tener más de 20 caracteres.")
    .optional(),
  countryCode: z.string().min(1, "El código de país es obligatorio."),
  address: z
    .string()
    .max(200, "La dirección no puede tener más de 200 caracteres.")
    .optional(),
  // When selecting an existing user
  createUserAutomatically: z.boolean().optional(),
  userMissingEmail: z.boolean().optional(),
  userMissingPhone: z.boolean().optional(),
  userMissingAddress: z.boolean().optional(),
  userId: z.union([z.number(), z.string()]).optional(),
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
    .min(1, "Debes agregar al menos un documento."),
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
  requiredPasswordChange: z.boolean().optional(),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres.")
    .max(100, "La contraseña no puede tener más de 100 caracteres.")
    .optional(),
  confirmPassword: z.string().optional(),
  // Optional existing business association
  useExistingBusiness: z.boolean().optional(),
  businessId: z.union([z.number(), z.string()]).optional(),
});

export type SuppliersFormData = z.infer<typeof suppliersSchema>;

export const suppliersSchemaWithRules = suppliersSchema.superRefine(
  (data, ctx) => {
    const useExisting = !!data.createUserAutomatically;

    // If using an existing user, require userId
    if (useExisting) {
      if (
        data.userId === undefined ||
        data.userId === null ||
        (typeof data.userId === "string" && data.userId.trim() === "")
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["userId"],
          message: "Debes seleccionar un usuario existente.",
        });
      }

      // If user is missing email/phone/address, require those fields to be completed
      if (data.userMissingEmail) {
        if (!data.email || data.email.trim().length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["email"],
            message: "El email es obligatorio para el usuario seleccionado.",
          });
        } else {
          const res = z.string().email().safeParse(data.email);
          if (!res.success) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ["email"],
              message: "Debe ser un email válido.",
            });
          }
        }
      }

      if (data.userMissingPhone) {
        if (!data.phone || data.phone.trim().length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["phone"],
            message: "El teléfono es obligatorio para el usuario seleccionado.",
          });
        }
      }

      if (data.userMissingAddress) {
        if (!data.address || data.address.trim().length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["address"],
            message:
              "La dirección es obligatoria para el usuario seleccionado.",
          });
        }
      }
    } else {
      // When not using existing user, require manual fields
      if (!data.name || data.name.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["name"],
          message: "El nombre es obligatorio.",
        });
      }

      if (!data.email || data.email.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["email"],
          message: "El email es obligatorio.",
        });
      } else {
        // validate email format
        const res = z.string().email().safeParse(data.email);
        if (!res.success) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["email"],
            message: "Debe ser un email válido.",
          });
        }
      }

      if (!data.phone || data.phone.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["phone"],
          message: "El teléfono es obligatorio.",
        });
      }

      if (!data.countryCode || data.countryCode.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["countryCode"],
          message: "El código de país es obligatorio.",
        });
      }

      if (!data.address || data.address.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["address"],
          message: "La dirección es obligatoria.",
        });
      }
    }

    // Existing rule for mincexCode depending on nationality
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

    // Password rules (only when creating a new user i.e., not using existing)
    if (!useExisting) {
      if (!data.password || data.password.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["password"],
          message: "La contraseña es obligatoria.",
        });
      }
      if (!data.confirmPassword || data.confirmPassword.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["confirmPassword"],
          message: "La confirmación de contraseña es obligatoria.",
        });
      }
      if (
        data.password &&
        data.confirmPassword &&
        data.password !== data.confirmPassword
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["confirmPassword"],
          message: "Las contraseñas no coinciden.",
        });
      }
    } else {
      // If using existing user, ignore provided password/confirmPassword values (optional: could warn)
    }

    // Business: only validate if flag is set; otherwise ignore.
    if (data.useExistingBusiness) {
      if (
        data.businessId === undefined ||
        data.businessId === null ||
        (typeof data.businessId === "string" && data.businessId.trim() === "")
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["businessId"],
          message:
            "Debes seleccionar un negocio existente o desactivar la opción.",
        });
      }
    }
  }
);
