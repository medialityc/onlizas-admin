import { TEMPLATE_TYPE_ENUM } from "@/types/section";
import { z } from "zod";

export const sectionProductSchema = z.object({
  productGlobalId: z
    .union([z.string(), z.number()])
    .refine((val) => val !== null && val !== 0 && val !== "", {
      message: "Debes seleccionar un producto válido",
    }),
  displayOrder: z.number(),
  isFeatured: z.literal(true),
  customLabel: z.string(),
  customBackgroundColor: z.string(),

  product: z.any().nullable().optional(),
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
  isActive: z.literal(true),
});

export const sectionSchema = z
  .object({
    name: z.string(),
    description: z.string(),
    viewMoreUrl: z.string(),
    isActive: z.literal(true),
    displayOrder: z.number(),
    templateType: z.enum(
      Object.values(TEMPLATE_TYPE_ENUM) as [string, ...string[]]
    ),
    defaultItemCount: z.number(),

    //banner template
    backgroundColor: z.string(),
    textColor: z.string(),
    isPersonalized: z.literal(true),

    //selects
    targetUserSegment: z.string(),
    targetDeviceType: z.string(),

    startDate: z.union([z.date(), z.string()]),
    endDate: z.union([z.date(), z.string()]),
    products: z.array(sectionProductSchema),
    /* banners: z.array(sectionHomeBannerSchema),
  criteria: z.array(sectionCriterionSchema), */
  })
  .superRefine((data, ctx) => {
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
  id?: number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
};

export type SectionProductItemFormData = z.infer<typeof sectionProductSchema>;
