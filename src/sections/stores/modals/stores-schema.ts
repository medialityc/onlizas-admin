import { z } from "zod";

export const storeSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio").max(100),
  description: z.string().optional(),
  url: z
    .string()
    .min(1, "La URL debe tener al menos 1 carácter")
    .regex(
      /^[a-z0-9-]+$/,
      "La URL debe tener el formato 'tu-tienda-online' (solo letras minúsculas, números y guiones)."
    ),
  email: z
    .string()
    .min(1, "El email es obligatorio")
    .email("Formato de correo inválido"),
  phoneNumber: z
    .string()
    .min(1, "El teléfono es obligatorio")
    .regex(/^[0-9 +()-]+$/, "Formato de teléfono inválido"),
  countryCode: z.string().min(1, "El teléfono es obligatorio"),
  address: z
    .string()
    .min(10, { message: "La dirección debe tener al menos 10 caracteres" })
    .max(200),

  logoStyle: z.union([
    z.string().url("Debe ser una URL válida."),
    z.instanceof(File, { message: "Debe ser un archivo válido." }),
  ]),
  returnPolicy: z
    .string({
      required_error: "Necesita definir una politica de reembolso",
    })
    .min(10, {
      message: "La política de reembolso debe tener al menos 10 caracteres",
    })
    .max(200),
  shippingPolicy: z
    .string({
      required_error: "Necesita definir una politica de envío",
    })
    .min(10, {
      message: "La política de envío debe tener al menos 10 caracteres",
    })
    .max(200),
  termsOfService: z
    .string({
      required_error: "Necesita definir una términos del Servicio",
    })
    .min(10, {
      message: "Los términos del servicio deben tener al menos 10 caracteres",
    })
    .max(200),
  businessId: z.string(),
  ownerId: z.string(),
});

export type StoreFormData = z.infer<typeof storeSchema>;
