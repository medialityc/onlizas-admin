import { z } from "zod";

export const addressSchema = z.object({
  id: z.string().optional(),
  address: z.string().min(1, "Dirección requerida"),
  city: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  postalCode: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});
export type AddressFormData = z.infer<typeof addressSchema>;

export const socialNetworkSchema = z.object({
  id: z.string().optional(),
  platform: z.string().min(1, "Plataforma requerida"),
  url: z.string().url("URL inválida"),
  username: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});
export type SocialNetworkFormData = z.infer<typeof socialNetworkSchema>;

export const numberSchema = z.object({
  id: z.string().optional(),
  phoneNumber: z.string().min(1, "Número requerido"),
  label: z.string().optional().nullable(),
  countryCode: z.string().optional().nullable(),
  extension: z.string().optional().nullable(),
  isWhatsApp: z.boolean().default(false),
  isActive: z.boolean().default(true),
});
export type NumberFormData = z.infer<typeof numberSchema>;

export const emailSchema = z.object({
  id: z.string().optional(),
  email: z.string().email("Correo inválido"),
  label: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});
export type EmailFormData = z.infer<typeof emailSchema>;
