import { z } from "zod";
import { addressSchema } from "../components/edit/user-edit-schema";

// Email and Phone schemas adapted from IUser types
export const emailSchema = z.object({
  address: z.string().email("Correo inválido"),
  isVerified: z.boolean(),
});

export const phoneSchema = z.object({
  countryId: z.number().int().positive("Seleccione un país"),
  number: z.string().min(7, "Teléfono inválido").max(20, "Teléfono inválido"),
  isVerified: z.boolean(),
});

export const providerProfileSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "El nombre es requerido").max(100),
  photo: z.instanceof(File).or(z.string()).optional(),
  emails: z.array(emailSchema),
  phones: z.array(phoneSchema),
  addresses: z.array(addressSchema),
  isBlocked: z.boolean(),
  isVerified: z.boolean(),
  attributes: z.record(z.string(), z.string()).optional(),
  // Minimal shape for businesses to support inline edit of name
  businesses: z
    .array(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        code: z.string().optional(),
      })
    )
    .optional(),
  // Keep as optional; validation not enforced here
  beneficiaries: z.array(z.any()).optional(),
});

export type ProviderProfileFormData = z.infer<typeof providerProfileSchema>;

export const defaultProviderProfileForm: Partial<ProviderProfileFormData> = {
  name: "",
  emails: [],
  phones: [],
  addresses: [],
  isBlocked: false,
  isVerified: false,
};
