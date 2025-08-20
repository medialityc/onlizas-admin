import { z } from "zod";

// Schema completo que coincide con la API real según product-apis.md
export const productSchema = z.object({
  id: z.number().optional(),
  name: z
    .string({ required_error: "El nombre es obligatorio." })
    .min(1, "El nombre no puede estar vacío.")
    .max(100, "El nombre no puede tener más de 100 caracteres."),
  description: z
    .string()
    .max(500, "La descripción no puede tener más de 500 caracteres.")
    .default(""),
  isActive: z.boolean(),
  supplierIds: z
    .array(z.number())
    .min(1, "Debe seleccionar al menos un proveedor."),
  categoryIds: z
    .array(z.number())
    .min(1, "Debe seleccionar al menos una categoría."),
  dimensions: z
    .object({
      width: z
        .number()
        .positive("El ancho debe ser un número positivo.")
        .optional(),
      height: z
        .number()
        .positive("La altura debe ser un número positivo.")
        .optional(),
      length: z
        .number()
        .positive("La longitud debe ser un número positivo.")
        .optional(),
    })
    .optional(),
  about: z
    .union([
      z.array(
        z.object({
          value: z
            .string({ required_error: "Requerido" })
            .min(4, "Mínimo 4 caracteres"),
        })
      ),
      z.array(z.string()),
    ])
    .transform((val) => {
      if (val.length > 0 && typeof val[0] === "object" && "value" in val[0]) {
        return val.map((item: any) => item.value);
      }

      return val as string[];
    })
    .pipe(z.array(z.string()).max(10, "Máximo 10 líneas de texto."))
    .default([])
    .optional(),
  details: z
    .array(
      z
        .object({
          name: z.string().min(1, "El nombre del detalle es obligatorio."),
          value: z.string().min(1, "El valor del detalle es obligatorio."),
        })
        .optional()
    )
    .optional()
    .default([]),

  features: z
    .array(
      z.object({
        value: z
          .string({ required_error: "Requerido" })
          .min(4, "Mínimo 4 caracteres"),
      })
    )
    .optional()
    .default([]),
  images: z.array(z.any()).optional().default([]),
});

export type ProductFormData = z.infer<typeof productSchema>;
