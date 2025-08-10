import { z } from "zod";

// Address schema
export const addressSchema = z
  .object({
    id: z.number().positive("El ID debe ser un número positivo").optional(),

    // Campos requeridos con validaciones mejoradas
    name: z
      .string()
      .min(1, "El nombre es requerido")
      .max(100, "El nombre no puede exceder 100 caracteres")
      .trim()
      .regex(
        /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s\-\.]+$/,
        "El nombre solo puede contener letras, espacios, guiones y puntos"
      ),

    mainStreet: z
      .string()
      .min(1, "La calle principal es requerida")
      .max(150, "La calle principal no puede exceder 150 caracteres")
      .trim()
      .regex(
        /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s\-\.\#0-9]+$/,
        "La calle contiene caracteres no válidos"
      ),

    number: z
      .string()
      .min(1, "El número es requerido")
      .max(20, "El número no puede exceder 20 caracteres")
      .trim()
      .regex(
        /^[0-9]+[a-zA-Z]?(\-[0-9]+[a-zA-Z]?)?$/,
        "Formato de número inválido (ej: 123, 123A, 123-125)"
      ),

    city: z
      .string()
      .min(1, "La ciudad es requerida")
      .max(100, "La ciudad no puede exceder 100 caracteres")
      .trim()
      .regex(
        /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s\-\.]+$/,
        "La ciudad solo puede contener letras, espacios, guiones y puntos"
      ),

    state: z
      .string()
      .min(1, "El estado es requerido")
      .max(100, "El estado no puede exceder 100 caracteres")
      .trim()
      .regex(
        /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s\-\.]+$/,
        "El estado solo puede contener letras, espacios, guiones y puntos"
      ),

    zipcode: z
      .string()
      .min(1, "El código postal es requerido")
      .trim()
      .refine((val) => {
        // Validación flexible para diferentes formatos internacionales
        const patterns = [
          /^\d{5}$/, // USA: 12345
          /^\d{5}-\d{4}$/, // USA extendido: 12345-6789
          /^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/, // Canadá: K1A 0A6
          /^\d{4,6}$/, // Europa general: 1234, 12345, 123456
          /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/, // Reino Unido: SW1A 1AA
        ];
        return patterns.some((pattern) => pattern.test(val));
      }, "Formato de código postal inválido"),

    countryId: z
      .number()
      .positive("Debe seleccionar un país válido")
      .int("El ID del país debe ser un número entero"),

    // Campos opcionales con validaciones
    otherStreets: z
      .string()
      .max(
        200,
        "La información adicional de calles no puede exceder 200 caracteres"
      )
      .trim()
      .optional()
      .nullable()
      .or(z.literal("")),

    latitude: z.number().optional(),

    longitude: z.number().optional(),

    annotations: z
      .string()
      .max(500, "Las anotaciones no pueden exceder 500 caracteres")
      .trim()
      .optional()
      .nullable()
      .or(z.literal("")),
  })
  .refine(
    (data) => {
      // Validación condicional: si hay latitud, debe haber longitud y viceversa
      const hasLatitude = data.latitude !== undefined;
      const hasLongitude = data.longitude !== undefined;
      return hasLatitude === hasLongitude;
    },
    {
      message:
        "Debe proporcionar tanto latitud como longitud, o ninguna de las dos",
      path: ["latitude"], // Muestra el error en el campo latitud
    }
  )
  .refine(
    (data) => {
      // Validación de coordenadas: deben ser números válidos si se proporcionan
      if (data.latitude !== undefined && data.longitude !== undefined) {
        return !isNaN(data.latitude) && !isNaN(data.longitude);
      }
      return true;
    },
    {
      message: "Las coordenadas deben ser números válidos",
      path: ["coordinates"],
    }
  );

// User form schema
export const userFormSchema = z.object({
  id: z.number(),
  name: z
    .string()
    .min(1, "El nombre es requerido")
    .max(50, "El nombre es demasiado largo"),
  roles: z.array(z.string()).default([]),
  addresses: z.array(addressSchema).default([]),
  isBlocked: z.boolean().default(false),
  isVerified: z.boolean().default(false),
  isForeign: z.boolean().default(false),
  birthDate: z.string().optional(),
  photo: z.instanceof(File).or(z.string()).optional(),
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
  businessIds: z.array(z.number()).default([]),
  documents: z
    .array(
      z.object({
        name: z.string(),
        description: z.string(),
        objectCode: z.string(),
      })
    )
    .default([])
    .optional(),
  attributes: z.record(z.string(), z.string()).optional(),
});

// User update schema (for PATCH requests)
export const userUpdateSchema = userFormSchema.partial().extend({
  id: z.number().optional(),
});

// User search/filter schema
export const userSearchSchema = z.object({
  search: z.string().optional(),
  page: z.number().min(1).default(1),
  pageSize: z.number().min(1).max(100).default(10),
  sortBy: z.string().optional(),
  // isDescending: z.boolean().optional(),
  // isBlocked: z.boolean().optional(),
  // isEmailVerified: z.boolean().optional(),
  // isPhoneVerified: z.boolean().optional(),
  // roles: z.array(z.string()).optional(),
});

// User attributes update schema
export const updateUserAttributesSchema = z.object({
  attributes: z.record(z.string(), z.string()),
});

export type UpdateUserAttributesRequest = z.infer<
  typeof updateUserAttributesSchema
>;

// Export types
export type AddressFormData = z.infer<typeof addressSchema>;
export type AttributesFormData = z.infer<typeof updateUserAttributesSchema>;
export type UserFormData = z.infer<typeof userFormSchema>;
export type UserUpdateData = z.infer<typeof userUpdateSchema>;
export type UserSearchParams = z.infer<typeof userSearchSchema>;

// Default values
export const defaultUserForm: Partial<UserFormData> = {
  name: "",
  roles: [],
  addresses: [],
  isBlocked: false,
  isVerified: false,
  password: "",
  businessIds: [],
};

export const defaultAddress: AddressFormData = {
  name: "",
  mainStreet: "",
  otherStreets: "",
  number: "",
  city: "",
  state: "",
  zipcode: "",
  countryId: 0,
  latitude: 0,
  longitude: 0,
  annotations: "",
};
