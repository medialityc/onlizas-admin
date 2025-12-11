import { z } from "zod";

export const ImporterSchema = z.object({
  name: z
    .string({ required_error: "Nombre requerido" })
    .min(1, "Nombre requerido")
    .max(100, "El nombre no puede exceder 100 caracteres"),
});

export type ImporterInput = z.infer<typeof ImporterSchema>;

export const ImporterAccessSchema = z.object({
  code: z
    .string({ required_error: "Código de acceso requerido" })
    .length(6, "El código debe tener 6 dígitos")
    .regex(/^\d+$/, "El código debe contener solo números"),
});

export type ImporterAccessInput = z.infer<typeof ImporterAccessSchema>;
