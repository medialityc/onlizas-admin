import { isValidUrl, urlToFile } from "@/utils/format";
import { CategoryFormData } from "../schemas/category-schema";
import { toast } from "react-toastify";

export const setCategoryFormData = async (
  category: CategoryFormData
): Promise<FormData> => {
  const formData = new FormData();

  const features = (category.features || []).map((f: any) => ({
    ...f,
    isPrimary: !!f.isPrimary,
    isRequired: !!f.isRequired,
    suggestions: Array.isArray(f.suggestions)
      ? f.suggestions.filter((s: string) => !!s?.trim())
      : [],
  }));

  if (category.image) {
    if (typeof category.image === "string" && isValidUrl(category.image)) {
      try {
        const imageFile = await urlToFile(category.image);
        formData.append("image", imageFile);
      } catch {
        toast.error("Error al procesar la imagen desde URL");
      }
    } else if (category.image instanceof File) {
      formData.append("image", category.image);
    }
  }
  formData.append("departmentId", String(category.departmentId));
  formData.append("name", category.name);
  formData.append("description", category.description);
  formData.append("isActive", String(category.isActive));

  features.forEach((feature, index) => {
    formData.append(`features[${index}].featureName`, feature.featureName);
    formData.append(
      `features[${index}].featureDescription`,
      feature.featureDescription || ""
    );
    formData.append(`features[${index}].isPrimary`, String(feature.isPrimary));
    formData.append(
      `features[${index}].isRequired`,
      String(feature.isRequired)
    );

    // Agregar suggestions como array
    if (feature.suggestions && Array.isArray(feature.suggestions)) {
      feature.suggestions.forEach(
        (suggestion: string, suggestionIndex: number) => {
          formData.append(
            `features[${index}].suggestions[${suggestionIndex}]`,
            suggestion
          );
        }
      );
    }
  });

  return formData;
};
