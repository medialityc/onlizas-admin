import { CategoryFormData } from "../schemas/category-schema";

export const setCategoryAdapter = (category: CategoryFormData): any => {
  return {
    ...category,
    features: category?.features?.map((f) => ({
      ...f,
      suggestions: f.suggestions?.map((s) => ({ value: s })),
    })),
  };
};
