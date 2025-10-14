import { z } from "zod";

export const createUserBaseSchema = z.object({
  firstName: z
    .string({
      required_error: "El nombre es requerido",
      invalid_type_error: "El nombre debe ser texto",
    })
    .min(2, { message: "El nombre debe tener al menos 2 caracteres" })
    .max(50, { message: "El nombre no debe exceder 50 caracteres" }),
  lastName: z
    .string({
      required_error: "El apellido es requerido",
      invalid_type_error: "El apellido debe ser texto",
    })
    .min(2, { message: "El apellido debe tener al menos 2 caracteres" })
    .max(50, { message: "El apellido no debe exceder 50 caracteres" }),
  email: z
    .string()
    .optional()
    .refine(
      (val) => !val || val === "" || z.string().email().safeParse(val).success,
      { message: "Email inválido" }
    ),
  phoneNumber: z
    .string()
    .optional()
    .refine((val) => !val || val === "" || /^\d{8,15}$/.test(val), {
      message: "Número de teléfono inválido (8-15 dígitos)",
    }),
  countryCode: z.string().optional(),
  password: z
    .string({
      required_error: "La contraseña es requerida",
      invalid_type_error: "La contraseña debe ser texto",
    })
    .min(8, { message: "La contraseña debe tener al menos 8 caracteres" })
    .max(128, { message: "La contraseña no debe exceder 128 caracteres" })
    .regex(/[A-Z]/, {
      message: "La contraseña debe incluir al menos una letra mayúscula",
    })
    .regex(/[a-z]/, {
      message: "La contraseña debe incluir al menos una letra minúscula",
    })
    .regex(/\d/, {
      message: "La contraseña debe incluir al menos un número",
    })
    .regex(/[^A-Za-z0-9]/, {
      message: "La contraseña debe incluir al menos un carácter especial",
    }),
});

// El esquema con refinamiento
export const createUserSchema = createUserBaseSchema.refine(
  (data) => data.email || data.phoneNumber,
  {
    message: "Se requiere al menos un email o número de teléfono",
    path: ["email", "phoneNumber"],
  }
);

export type CreateUserSchema = z.infer<typeof createUserSchema>;
