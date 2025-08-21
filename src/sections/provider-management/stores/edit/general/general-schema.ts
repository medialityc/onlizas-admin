import { z } from "zod";

// Todos los campos obligatorios por ahora, según tipo Store actual
export const GeneralStoreSchema = z.object({
  // Estado
  isActive: z.boolean({ required_error: "El estado es obligatorio" }).default(true),

  // Información básica
  name: z.string().min(1, "Nombre requerido"),
  description: z.string().min(1, "Descripción requerida"),
  url: z.string().min(1, "URL requerida"),
  logoStyle: z.union([z.string().min(1, "Logo requerido"), z.instanceof(File)]),

  // Contacto
  email: z.string().email("Email inválido"),
  phoneNumber: z.string().min(1, "Teléfono requerido"),
  address: z.string().min(1, "Dirección requerida"),

  // Políticas
  returnPolicy: z.string().min(1, "Requerido"),
  shippingPolicy: z.string().min(1, "Requerido"),
  termsOfService: z.string().min(1, "Requerido"),
});

export type GeneralStoreForm = z.infer<typeof GeneralStoreSchema>;
