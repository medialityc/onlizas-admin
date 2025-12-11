import { z } from "zod";

export const sectionProductSchema = z.object({
  id: z.string().optional(),
  productGlobalId: z.string(),
  displayOrder: z.number(),
  isFeatured: z.boolean().default(true),
  customLabel: z.string(),
  customBackgroundColor: z.string(),
  products: z.array(z.any()).min(1, "Seleccione al menos un producto"),
  categoriesIds: z
    .array(z.string())
    .min(1, "Seleccione al menos una categoría"),
  supplierId: z.string().optional(),
});

export const sectionCriterionSchema = z.object({
  criterionType: z.string(),
  criterionValue: z.string(),
  operator: z.string(),
  parentCriterionId: z.number(),
  logicalOperator: z.string(),
  priority: z.number(),
});

export const sectionHomeBannerSchema = z.object({
  imageUrl: z.string(),
  title: z.string(),
  subtitle: z.string(),
  buttonText: z.string(),
  buttonUrl: z.string(),
  position: z.string(),
  displayOrder: z.number(),
  startDate: z.union([z.date(), z.string()]),
  endDate: z.union([z.date(), z.string()]),
  active: z.literal(true),
});

export const sectionSchema = z
  .object({
    name: z
      .string()
      .min(1, "El nombre es requerido")
      .max(128, "El nombre no puede tener más de 128 caracteres"),
    description: z
      .string()
      .min(1, "La descripción es requerida")
      .max(255, "La descripción no puede tener más de 255 caracteres"),
    viewMoreUrl: z
      .string()
      .min(1, "La URL es requerida")
      .max(128, "La URL no puede tener más de 128 caracteres")
      .regex(
        /^\/[a-z0-9\-\/]*$/i,
        "La URL debe iniciar con '/' y solo puede contener letras, números, guiones y barras"
      ),
    active: z.boolean().default(true),
    displayOrder: z
      .number({ error: "El orden de visualización es requerido" })
      .int("El orden debe ser un número entero")
      .min(0, "El orden debe ser mayor o igual a 0"),
    templateType: z
      .number({ error: "El tipo de plantilla es requerido" })
      .int("El tipo de plantilla debe ser un número entero"),
    defaultItemCount: z
      .number({ error: "La cantidad por defecto es requerida" })
      .int("La cantidad debe ser un número entero")
      .min(1, "Debe haber al menos 1 elemento por defecto"),

    // banner template
    backgroundColor: z
      .string()
      .regex(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i, "Color de fondo inválido")
      .or(z.literal("")),
    textColor: z
      .string()
      .regex(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i, "Color de texto inválido")
      .or(z.literal("")),
    isPersonalized: z.boolean().default(true),

    // selects
    targetUserSegment: z.string().min(1, "El segmento de usuario es requerido"),
    targetDeviceType: z.string().min(1, "El tipo de dispositivo es requerido"),

    startDate: z.union([z.date(), z.string()]).refine(
      (val) => {
        if (typeof val === "string") return !isNaN(Date.parse(val));
        return true;
      },
      { message: "La fecha de inicio no es válida" }
    ),
    endDate: z.union([z.date(), z.string()]).refine(
      (val) => {
        if (typeof val === "string") return !isNaN(Date.parse(val));
        return true;
      },
      { message: "La fecha de fin no es válida" }
    ),
    products: z
      .array(sectionProductSchema.omit({ products: true, categoriesIds: true }))
      .min(1, "Debes agregar al menos un producto"),
  })
  .superRefine((data, ctx) => {
    // Validar que endDate sea mayor o igual a startDate
    const start = new Date(data.startDate as any).getTime();
    const end = new Date(data.endDate as any).getTime();
    if (!isNaN(start) && !isNaN(end) && end < start) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "La fecha de fin debe ser mayor o igual a la fecha de inicio",
        path: ["endDate"],
      });
    }
    // Validar productos duplicados
    if (data.products) {
      const ids = data.products.map((item) => item.productGlobalId);
      const hasDuplicates = ids.length !== new Set(ids).size;
      if (hasDuplicates) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "No puedes agregar productos duplicados",
          path: ["products"],
        });
      }
    }
  });

export type SectionFormData = z.infer<typeof sectionSchema> & {
  id?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
};

export type SectionProductItemFormData = z.infer<
  typeof sectionProductSchema
> & {
  productName?: string;
};
