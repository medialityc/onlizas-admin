import { z } from "zod";

export const createSystemConfigurationSchema = z.object({
  configurationType: z
    .string({ error: "El tipo de configuración es requerido" })
    .trim()
    .min(2, "Debe tener al menos 2 caracteres"),
  additionalSettings: z.string().trim(),
  countryId: z.string(),
});

export type CreateSystemConfigurationSchema = z.infer<
  typeof createSystemConfigurationSchema
>;

export const defaultSystemConfigurationForm: CreateSystemConfigurationSchema = {
  configurationType: "",
  additionalSettings: "",
  countryId: "",
};
