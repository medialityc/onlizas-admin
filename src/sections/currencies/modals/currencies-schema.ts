import { z } from "zod";

export const currencySchema = z.object({
  name: z
    .string({ required_error: "El nombre es obligatorio." })
    .min(1, "El nombre no puede estar vacío.")
    .max(100, "El nombre no puede tener más de 100 caracteres."),
  codIso: z
    .string({ required_error: "El código ISO es obligatorio." })
    .min(3, "El código ISO debe tener exactamente 3 caracteres.")
    .max(3, "El código ISO debe tener exactamente 3 caracteres.")
    .regex(
      /^[A-Z]{3}$/,
      "El código ISO debe contener 3 letras mayúsculas (ej: USD, EUR, COP)."
    ),
  symbol: z
    .string({ required_error: "El símbolo es obligatorio." })
    .min(1, "El símbolo no puede estar vacío.")
    .max(10, "El símbolo no puede tener más de 10 caracteres."),
  rate: z
    .number({ required_error: "La tasa de cambio es obligatoria." })
    .positive("La tasa de cambio debe ser un número positivo.")
    .min(0.01, "La tasa de cambio debe ser mayor a 0.01.")
    .max(999999.99, "La tasa de cambio no puede exceder 999,999.99."),
    regionsId:z.array(z.union([z.number(),z.string()])),
});

export type CurrencyFormData = z.infer<typeof currencySchema>;
