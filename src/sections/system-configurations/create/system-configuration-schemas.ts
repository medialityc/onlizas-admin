import { z } from "zod";

export const createSystemConfigurationSchema = z.object({
  configurationType: z
    .string({ required_error: "El tipo de configuración es requerido" })
    .trim()
    .min(2, "Debe tener al menos 2 caracteres"),
  additionalSettings: z.string().trim(),
  countryId: z.coerce
    .number({ required_error: "El país es requerido" })
    .int("Debe ser un entero")
    .positive("Debe ser un número positivo"),
});

export type CreateSystemConfigurationSchema = z.infer<
  typeof createSystemConfigurationSchema
>;

export const defaultSystemConfigurationForm: CreateSystemConfigurationSchema = {
  configurationType: "",
  additionalSettings: "",
  countryId: 0,
};
