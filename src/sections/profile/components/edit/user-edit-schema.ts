import { z } from "zod";

// Email schema
export const emailSchema = z.object({
  address: z
    .string()
    .min(1, "El email es requerido")
    .email("Debe ser un email válido")
    .max(255, "El email es demasiado largo"),
  isVerified: z.boolean(),
});

// Phone schema
export const phoneSchema = z.object({
  countryId: z
    .number()
    .positive("Debe seleccionar un país válido")
    .int("El ID del país debe ser un número entero"),
  number: z
    .string()
    .min(1, "El número de teléfono es requerido")
    .max(20, "El número de teléfono es demasiado largo")
    .trim()
    .regex(
      /^[0-9\-\s\+\(\)]+$/,
      "El número de teléfono contiene caracteres no válidos"
    ),
  isVerified: z.boolean(),
});

// Address schema
export const addressSchema = z.object({
  id: z.number().positive("El ID debe ser un número positivo").optional(),
  name: z
    .string()
    .min(1, "El nombre es requerido")
    .max(100, "El nombre no puede exceder 100 caracteres")
    .trim(),
  mainStreet: z
    .string()
    .min(1, "La calle principal es requerida")
    .max(150, "La calle principal no puede exceder 150 caracteres")
    .trim(),
  number: z
    .string()
    .min(1, "El número es requerido")
    .max(20, "El número no puede exceder 20 caracteres")
    .trim(),
  city: z
    .string()
    .min(1, "La ciudad es requerida")
    .max(100, "La ciudad no puede exceder 100 caracteres")
    .trim(),
  state: z
    .string()
    .min(1, "El estado es requerido")
    .max(100, "El estado no puede exceder 100 caracteres")
    .trim(),
  zipcode: z.string().min(1, "El código postal es requerido").trim(),
  countryId: z.union([z.number()
    .positive("Debe seleccionar un país válido")
    .int("El ID del país debe ser un número entero"), z.string()])
    ,
  otherStreets: z
    .string()
    .max(
      200,
      "La información adicional de calles no puede exceder 200 caracteres"
    )
    .trim()
    .optional()
    .or(z.literal("")),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  annotations: z
    .string()
    .max(500, "Las anotaciones no pueden exceder 500 caracteres")
    .trim()
    .optional()
    .or(z.literal("")),
});

export const userEditSchema = z.object({
  name: z
    .string({ required_error: "El nombre es obligatorio." })
    .min(1, "El nombre no puede estar vacío.")
    .max(50, "El nombre es demasiado largo")
    .trim(),
  photo: z
    .union([
      z.string().url("Debe ser una URL válida para la imagen."),
      z.instanceof(File, { message: "Debe ser un archivo válido." }),
    ])
    .optional(),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .regex(/[A-Z]/, "La contraseña debe contener al menos una letra mayúscula")
    .regex(/[0-9]/, "La contraseña debe contener al menos un número")
    .regex(
      /[^A-Za-z0-9]/,
      "La contraseña debe contener al menos un carácter especial"
    )
    .optional()
    .or(z.literal("")),
  // Arrays para contacto y direcciones - siempre arrays, nunca undefined
  emails: z.array(emailSchema),
  phones: z.array(phoneSchema),
  addresses: z.array(addressSchema),
  // Campos adicionales que un proveedor puede querer actualizar
  attributes: z.record(z.string(), z.string()).optional(),
});

export type UserEditFormData = z.infer<typeof userEditSchema>;
export type EmailFormData = z.infer<typeof emailSchema>;
export type PhoneFormData = z.infer<typeof phoneSchema>;
export type AddressFormData = z.infer<typeof addressSchema>;

// Default values for the form
export const defaultUserEditForm: Partial<UserEditFormData> = {
  name: "",
  password: "",
  emails: [],
  phones: [],
  addresses: [],
  attributes: {},
};
