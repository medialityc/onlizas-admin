import { z } from "zod";

export const sectionProductSchema = z.object({
  productGlobalId: z.union([z.string(), z.number()]),
  displayOrder: z.number(),
  isFeatured: z.boolean().default(true),
  customLabel: z.string(),
  customBackgroundColor: z.string(),
  products: z.array(z.any()).min(1, "Seleccione al menos un producto"),
  categoriesIds: z
    .array(z.number())
    .min(1, "Seleccione al menos una categoría"),
  supplierId: z.number().optional(),
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
    name: z.string(),
    description: z.string(),
    viewMoreUrl: z.string(),
    active: z.boolean().default(true),
    displayOrder: z.number(),
    templateType: z.number(),
    defaultItemCount: z.number(),

    //banner template
    backgroundColor: z.string(),
    textColor: z.string(),
    isPersonalized: z.boolean().default(true),

    //selects
    targetUserSegment: z.string(),
    targetDeviceType: z.string(),

    startDate: z.union([z.date(), z.string()]),
    endDate: z.union([z.date(), z.string()]),
    products: z.array(
      sectionProductSchema.omit({ products: true, categoriesIds: true })
    ),
  })
  .superRefine((data, ctx) => {
    if (data.products) {
      if (data.products.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Debes agregar al menos un producto.",
          path: ["products"],
        });
      }
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
  id?: number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
};

export type SectionProductItemFormData = z.infer<
  typeof sectionProductSchema
> & {
  productName?: string;
};
