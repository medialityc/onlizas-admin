import { z } from "zod";

export const GeneralStoreSchema = z.object({
  // Estado
  isActive: z.boolean().optional(),

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
  returnPolicy: z.string().min(1, "Política de devolución requerida"),
  shippingPolicy: z.string().min(1, "Política de envío requerida"),
  termsOfService: z.string().min(1, "Términos de servicio requeridos"),
});

export type GeneralStoreForm = z.infer<typeof GeneralStoreSchema>;
