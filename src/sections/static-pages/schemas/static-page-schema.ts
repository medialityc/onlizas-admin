import { z } from "zod";

export const staticPageSchema = z.object({
  id: z.string().optional(),
  title: z
    .string({ error: "El título es requerido" })
    .min(1, "El título es requerido")
    .max(200, "Máximo 200 caracteres"),
  slug: z
    .string({ error: "El slug es requerido" })
    .min(1, "El slug es requerido")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message:
        "Slug inválido. Usa minúsculas, números y guiones (ej: terminos-y-condiciones)",
    })
    .max(120, "Máximo 120 caracteres"),
  content: z
    .string({ error: "El contenido es requerido" })
    .min(1, "El contenido es requerido"),
  section: z
    .number({ error: "La sección es requerida" })
    .min(0, "Selecciona una sección válida")
    .max(3, "Selecciona una sección válida"),
  metaDescription: z.string().optional(),
  metaKeywords: z.string().optional(),
});

export type StaticPageFormData = z.infer<typeof staticPageSchema>;
