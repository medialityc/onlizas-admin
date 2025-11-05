import { z } from "zod";

export const brandSchema = z.object({
  id: z.string().optional(),
  name: z
    .string({ required_error: "El nombre es requerido" })
    .min(1, "El nombre es requerido")
    .max(100, "Máximo 100 caracteres"),
});

export type BrandFormData = z.infer<typeof brandSchema>;
