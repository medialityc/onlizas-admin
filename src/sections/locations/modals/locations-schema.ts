import { z } from "zod";

export const locationSchema = z.object({
  name: z
    .string({ required_error: "El nombre es obligatorio." })
    .min(1, "El nombre no puede estar vacío.")
    .max(120, "El nombre no puede tener más de 120 caracteres."),
  countryCode: z
    .string({ required_error: "El código de país es obligatorio." })
    .min(2, "El código de país debe tener al menos 2 caracteres.")
    .max(3, "El código de país no puede tener más de 3 caracteres."),
  state: z
    .string({ required_error: "El estado es obligatorio." })
    .min(1, "El estado no puede estar vacío.")
    .max(120, "El estado no puede tener más de 120 caracteres."),
  district: z
    .string({ required_error: "El distrito es obligatorio." })
    .min(1, "El distrito no puede estar vacío.")
    .max(120, "El distrito no puede tener más de 120 caracteres."),
  addressRaw: z
    .string({ required_error: "La dirección es obligatoria." })
    .min(1, "La dirección no puede estar vacía."),
  addressNormalized: z
    .string()
    .optional(),
  postalCode: z
    .string()
    .optional(),
  latitude: z
    .number({ required_error: "La latitud es obligatoria." })
    .min(-90, "La latitud debe ser mayor o igual a -90.")
    .max(90, "La latitud debe ser menor o igual a 90."),
  longitude: z
    .number({ required_error: "La longitud es obligatoria." })
    .min(-180, "La longitud debe ser mayor o igual a -180.")
    .max(180, "La longitud debe ser menor o igual a 180."),
  placeId: z.string().optional(),
  type: z.number().min(0).max(5), // 0=WAREHOUSE, 1=STORE, 2=DISTRIBUTION_CENTER, 3=PICKUP_POINT, 4=OFFICE, 5=OTHER
  tags: z.array(z.string()),
});

export type LocationFormData = z.infer<typeof locationSchema>;
