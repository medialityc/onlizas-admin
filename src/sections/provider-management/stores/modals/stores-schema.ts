import { z } from "zod";

export const storeSchema = z.object({
  name: z.string({ error: "El nombre es obligatorio" }).max(100),
  description: z.string().optional(),
  url: z.string({ error: "La URL es obligatoria" }),
  email: z
    .string({ error: "el email es obligatorio" })
    .email("Formato de correo inválido"),
  phoneNumber: z
    .string()
    .min(1, "El teléfono es obligatorio")
    .regex(/^[0-9 +()-]+$/, "Formato de teléfono inválido"),
  address: z
    .string()
    .min(10, { message: "La dirección debe tener al menos 10 caracteres" })
    .max(200),

  logoStyle: z.union([
    z.string().url("Debe ser una URL válida."),
    z.instanceof(File, { message: "Debe ser un archivo válido." }),
  ]),
  /* primaryColor: z
    .string()
    .regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, "Formato de color inválido").optional(),
  secondaryColor: z
    .string()
    .regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, "Formato de color inválido").optional(),
  accentColor: z
    .string()
    .regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, "Formato de color inválido").optional(),
  font: z.number().int().optional(),
  template: z.number().int().optional(), */
  businessId: z.union([z.string(), z.number()]).refine((val) => {
    const num = typeof val === "string" ? parseFloat(val) : val;
    return !isNaN(num) && num > 0;
  }, "Debe ser un número positivo"),
  ownerId: z.union([z.string(), z.number()]).refine((val) => {
    const num = typeof val === "string" ? parseFloat(val) : val;
    return !isNaN(num) && num > 0;
  }, "Debe ser un número positivo"),
});

export type StoreFormData = z.infer<typeof storeSchema>;
