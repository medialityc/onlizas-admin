import { z } from "zod";
import { addressSchema } from "../components/edit/user-edit-schema";

// Email and Phone schemas for personal info
export const emailSchema = z.object({
  address: z.string().email("Correo inválido"),
  isVerified: z.boolean(),
});

export const phoneSchema = z.object({
  countryId: z.number().int().positive("Seleccione un país"),
  number: z.string().min(7, "Teléfono inválido").max(20, "Teléfono inválido"),
  isVerified: z.boolean(),
});

export const personalInfoSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "El nombre es requerido").max(100),
  photoFile: z
    .union([
      z.instanceof(File, { message: "Debe ser un archivo válido." }),
      z.string().url("URL inválido"),
    ])
    .optional(),
  emails: z.array(emailSchema),
  phones: z.array(phoneSchema),
  addresses: z.array(addressSchema),
  documents: z
    .array(
      z.object({
        fileName: z.string().optional(),
        content: z.instanceof(File).or(z.string()).optional(),
      })
    )
    .optional(),
  isBlocked: z.boolean(),
  isVerified: z.boolean(),
  attributes: z.record(z.string(), z.string()).optional(),
});

export type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;

export const defaultPersonalInfoForm: Partial<PersonalInfoFormData> = {
  name: "",
  emails: [],
  phones: [],
  addresses: [],
  isBlocked: false,
  isVerified: false,
};
