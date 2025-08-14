import { z } from "zod";

// Schema completo que coincide con la API real según product-apis.md
export const productSchema = z.object({
  name: z
    .string({ required_error: "El nombre es obligatorio." })
    .min(1, "El nombre no puede estar vacío.")
    .max(100, "El nombre no puede tener más de 100 caracteres."),
  description: z
    .string()
    .max(500, "La descripción no puede tener más de 500 caracteres.")
    .default(""),
  isActive: z.boolean(),
  categoryIds: z
    .array(z.number())
    .min(1, "Debe seleccionar al menos una categoría."),
  supplierIds: z.array(z.number()).optional().default([]),
  dimensions: z.object({
    width: z.number().positive("El ancho debe ser un número positivo.").optional(),
    height: z.number().positive("La altura debe ser un número positivo.").optional(),
    lenght: z.number().positive("La longitud debe ser un número positivo.").optional(), // Note: API usa "lenght"
  }).optional(),
  about: z.array(z.string()).max(10, "Máximo 10 líneas de texto.").optional().default([]),
  details: z.array(z.object({
    name: z.string().min(1, "El nombre del detalle es obligatorio."),
    value: z.string().min(1, "El valor del detalle es obligatorio."),
  })).optional().default([]),
  features: z.array(z.object({
    id: z.number(),
    value: z.string(),
  })).optional().default([]),
  images: z.array(z.object({
    image: z.string(),
    order: z.number(),
  })).optional().default([]),
});

export type ProductFormData = z.infer<typeof productSchema>;

// Schema para el formulario, que puede tener campos adicionales como `imageFile`
export const productFormSchema = z.object({
  name: z
    .string({ required_error: "El nombre es obligatorio." })
    .min(1, "El nombre no puede estar vacío.")
    .max(100, "El nombre no puede tener más de 100 caracteres."),
  description: z
    .string()
    .max(500, "La descripción no puede tener más de 500 caracteres."),
  isActive: z.boolean(),
  categoryIds: z
    .array(z.number())
    .min(1, "Debe seleccionar al menos una categoría."),
  supplierIds: z.array(z.number()),
  dimensions: z.object({
    width: z.coerce.number().positive("El ancho debe ser un número positivo.").optional(),
    height: z.coerce.number().positive("La altura debe ser un número positivo.").optional(),
    lenght: z.coerce.number().positive("La longitud debe ser un número positivo.").optional(),
  }).optional(),
  about: z.array(z.object({
    value: z.string().max(200, "Cada línea no puede superar los 200 caracteres.")
  }))
    .max(10, "Máximo 10 líneas de texto."),
  details: z.array(z.object({
    name: z.string().min(1, "El nombre del detalle es obligatorio."),
    value: z.string().min(1, "El valor del detalle es obligatorio."),
  })),
  imageFile: z.instanceof(File).optional(),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;

export const defaultProductFormValues: ProductFormValues = {
  name: "",
  description: "",
  isActive: true,
  categoryIds: [],
  supplierIds: [],
  dimensions: {
    lenght: undefined,
    width: undefined,
    height: undefined,
  },
  about: [],
  details: [],
  imageFile: undefined,
};

// Función para transformar datos del formulario a formato de API
export const transformToApiFormat = (data: ProductFormValues): Omit<ProductFormData, 'images' | 'features'> => ({
  name: data.name,
  description: data.description,
  isActive: data.isActive,
  categoryIds: data.categoryIds,
  supplierIds: data.supplierIds,
  dimensions: data.dimensions,
  about: data.about.map(item => item.value),
  details: data.details,
});
