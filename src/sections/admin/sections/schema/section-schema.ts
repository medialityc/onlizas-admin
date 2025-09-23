import { TEMPLATE_TYPE_ENUM } from "@/types/section";
import { z } from "zod";

export const sectionProductSchema = z.object({
  productGlobalId: z.string(),
  displayOrder: z.number(),
  isFeatured: z.literal(true),
  customLabel: z.string(),
  customBackgroundColor: z.string(),
  addedAt: z.union([z.date(), z.string()]),
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

export const sectionSchema = z.object({
  name: z.string(),
  description: z.string(),
  viewMoreUrl: z.string(),
  isActive: z.literal(true),
  displayOrder: z.number(),
  templateType: z.enum(Object.values(TEMPLATE_TYPE_ENUM) as [string, ...string[]]),
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
  banners: z.array(sectionHomeBannerSchema),
  criteria: z.array(sectionCriterionSchema),
});

export type SectionFormData = z.infer<typeof sectionSchema> & {
  id?: number;
  createdAt: string | Date;
  updatedAt: string | Date;
};
