import { FeatureFormData } from "@/sections/categories/schemas/category-schema";

export const getCategoryFeature = (feature: FeatureFormData[]) => {
  feature.sort((a, b) => {
    if (a.isPrimary && !b.isPrimary) return -1;
    if (!a.isPrimary && b.isPrimary) return 1;

    if (a.isRequired && !b.isRequired) return -1;
    if (!a.isRequired && b.isRequired) return 1;

    return 0;
  });

  return feature?.map((fet) => ({ ...fet, name: fet?.featureName, value: "" }));
};
