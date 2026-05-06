import { z } from "zod";

export const createSuggestionSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  description: z.string().optional(),
  departmentId: z
    .union([z.number(), z.string()])
    .transform((val) => String(val))
    .refine(
      (val) => val.length > 0 && val !== "undefined" && val !== "null",
      "Debes seleccionar un departamento"
    ),
});

export type CreateSuggestionFormData = z.infer<typeof createSuggestionSchema>;
