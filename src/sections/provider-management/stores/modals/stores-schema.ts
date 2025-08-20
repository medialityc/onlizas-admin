import { z } from "zod";

export const storeSchema = z.object({
  name: z.string({ required_error: "El nombre es obligatorio" }).max(100),
  description: z.string().optional(),
  url: z.string({ required_error: "La URL es obligatoria" }),
  email: z
    .string({ required_error: "el email es obligatorio" })
    .email("Formato de correo inválido"),
  phoneNumber: z
    .string()
    .min(1, "El teléfono es obligatorio")
    .regex(/^[0-9 +()-]+$/, "Formato de teléfono inválido"),
  address: z.string().min(10, { message: "La dirección debe tener al menos 10 caracteres" }).max(200),

  logoStyle: z.union([
    z.string().url("Debe ser una URL válida."),
    z.instanceof(File, { message: "Debe ser un archivo válido." }),
  ]),
  returnPolicy: z.string({
    required_error: "Necesita definir una politica de reembolso",
  }).min(10, { message: "La política de reembolso debe tener al menos 10 caracteres" }).max(200),
  shippingPolicy: z.string({
    required_error: "Necesita definir una politica de envío",
  }).min(10, { message: "La política de envío debe tener al menos 10 caracteres" }).max(200),
  termsOfService: z.string({
    required_error: "Necesita definir una términos del Servicio",
  }).min(10, { message: "Los términos del servicio deben tener al menos 10 caracteres" }).max(200),
  /* primaryColor: z
    .string()
    .regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, "Formato de color inválido").optional(),
  secondaryColor: z
    .string()
    .regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, "Formato de color inválido").optional(),
  accentColor: z
    .string()
    .regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, "Formato de color inválido").optional(),
  font: z.number().int().optional(),
  template: z.number().int().optional(), */
   businessId: z.number().int("Debe ser un entero").positive(),
  ownerId: z.number().int("Debe ser un entero").positive(), 
});

export type StoreFormData = z.infer<typeof storeSchema>;
