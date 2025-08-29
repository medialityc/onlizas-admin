import { z } from "zod";

const colorRegex = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;

const promotionSchema = z.object({
  id: z.number().int().nonnegative().optional(),
  name: z.string().min(1, "El nombre de la promoción es obligatorio"),
  description: z.string().optional(),
  type: z.enum(["percent", "amount"]),
  value: z.number().nonnegative(),
  code: z.string().optional(),
  usageLimit: z.number().int().nonnegative().optional(),
  usedCount: z.number().int().nonnegative().optional(),
  startDate: z
    .string()
    .optional()
    .refine((v) => !v || !Number.isNaN(Date.parse(v)), {
      message: "Fecha de inicio inválida",
    }),
  endDate: z
    .string()
    .optional()
    .refine((v) => !v || !Number.isNaN(Date.parse(v)), {
      message: "Fecha de fin inválida",
    }),
  isActive: z.boolean().optional(),
  badge: z.string().optional(),
});

// Banners en el formulario siguen el contrato del backend:
// { title, urlDestinity, position:number, initDate, endDate, image }
const bannerSchema = z.object({
  id: z.number().int().nonnegative().optional(),
  title: z.string().min(1, "El título es obligatorio"),
  urlDestinity: z.string().min(1, "La URL de destino es obligatoria"),
  position: z.coerce.number().int().nonnegative({ message: "La posición debe ser un número entero" }),
  initDate: z
    .string()
    .optional()
    .refine((v) => !v || !Number.isNaN(Date.parse(v)), {
      message: "Fecha de inicio inválida",
    }),
  endDate: z
    .string()
    .optional()
    .refine((v) => !v || !Number.isNaN(Date.parse(v)), {
      message: "Fecha de fin inválida",
    }),
  image: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
});

const categoryItemSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().optional(),
});

export const storeEditSchema = z.object({
  isActive: z.boolean().optional(),

  // Datos básicos
  name: z
    .string({ required_error: "El nombre es obligatorio" })
    .min(1)
    .max(100),
  description: z.string().max(1000).optional(),
  url: z.string({ required_error: "La URL es obligatoria" }),
  // Contacto
  email: z
    .string({ required_error: "El correo es obligatorio" })
    .email("Formato de correo inválido"),
  phoneNumber: z
    .string()
    .min(1, "El teléfono es obligatorio")
    .regex(/^[0-9 +()\-]+$/, "Formato de teléfono inválido"),
  address: z
    .string()
    .min(10, { message: "La dirección debe tener al menos 10 caracteres" })
    .max(200),

  // Logo: puede ser URL o archivo (File) en cliente
  logoStyle: z
    .union([
      z.string().url("Debe ser una URL válida."),
      z.instanceof(File, { message: "Debe ser un archivo válido." }),
    ])
    .optional(),

  // Políticas
  returnPolicy: z
    .string({ required_error: "Necesita definir una politica de reembolso" })
    .min(10)
    .max(200),
  shippingPolicy: z
    .string({ required_error: "Necesita definir una politica de envío" })
    .min(10)
    .max(200),
  termsOfService: z
    .string({ required_error: "Necesita definir una términos del Servicio" })
    .min(10)
    .max(200),

  // Apariencia
  primaryColor: z.string().regex(colorRegex, "Formato de color inválido"),
  secondaryColor: z.string().regex(colorRegex, "Formato de color inválido"),
  accentColor: z.string().regex(colorRegex, "Formato de color inválido"),
  font: z.string().min(1),
  template: z.string().min(1),

  // Payloads y colecciones
  categoriesPayload: z.array(categoryItemSchema).optional(),
  promotionsPayload: z.array(promotionSchema).optional(),
  banners: z.array(bannerSchema).optional(),
});

export type StoreEditFormData = z.infer<typeof storeEditSchema>;

export default storeEditSchema;
